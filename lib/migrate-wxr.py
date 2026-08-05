#!/usr/bin/env python3
"""
Migrazione contenuti dall'export WordPress (WXR) ai documenti Sanity.

Sostituisce il vecchio migrate-content.py, che partiva da JSON scrapati e
perdeva l'ordine del documento (concatenava tutti i paragrafi e poi tutti
gli heading in fondo), ignorava le immagini e produceva campi piatti
incompatibili con gli schemi attuali (localeString / localeBlock).

Questo script parte dall'export ufficiale di WordPress (Strumenti -> Esporta),
preserva la struttura del documento e produce NDJSON pronto per:

    npx sanity dataset import sanity-import.ndjson production

Opzionalmente legge anche il dump SQL per recuperare le gallerie NextGEN
Gallery, che NON sono presenti nell'export XML: NextGEN tiene le sue immagini
in tabelle proprie (wp_ngg_gallery / wp_ngg_pictures) e i file su disco fuori
dalla media library.

Uso:
    python3 lib/migrate-wxr.py export.xml --sql dump.sql -o sanity-import.ndjson

Note sulle conversioni:
  - gli shortcode di layout del tema "dwa" ([two_third], [list], [tabs], ...)
    vengono rimossi mantenendo il contenuto interno;
  - [nggallery id=N] non produce contenuto: la galleria viene segnalata nel
    report e nel manifest, perche' le immagini vanno prima caricate su Sanity;
  - il testo non racchiuso in tag di blocco viene diviso in paragrafi a ogni
    ritorno a capo (WordPress lo renderizzava con <br />; in un CMS moderno
    paragrafi separati sono piu' facili da editare);
  - le chiavi _key sono deterministiche, quindi rieseguire lo script produce
    lo stesso file.
"""

import argparse
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

NS = {
    'wp': 'http://wordpress.org/export/1.1/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.1/excerpt/',
}

# post_id WordPress -> documento Sanity di destinazione.
# Gli id vengono dagli URL reali del sito (permalink "plain": /?page_id=N).
MAPPING: dict[str, dict[str, Any]] = {
    '325': {'type': 'service', 'slug': 'macchine', 'icon': 'Settings'},
    '231': {'type': 'service', 'slug': 'impianti', 'icon': 'Zap'},
    '249': {'type': 'service', 'slug': 'sistemi-elettronici', 'icon': 'Cpu'},
    '246': {'type': 'service', 'slug': 'sistemi-radiocomunicazione', 'icon': 'Radio'},
    '333': {'type': 'page', 'slug': 'profilo'},
    '321': {'type': 'page', 'slug': 'lavora-con-noi'},
    '16': {'type': 'page', 'slug': 'contatti'},
    '343': {'type': 'page', 'slug': 'note-legali'},
}

# Contenuti volutamente esclusi, con motivazione (finisce nel report).
SKIP: dict[str, str] = {
    '28': 'homepage: il testo e\' gia\' nei componenti React (About.tsx, messages/it.json)',
    '45': 'portfolio_page di esempio, praticamente vuota',
    '1': 'post demo di WordPress ("Ciao mondo!!")',
    '19': 'post di prova ("Primo Articolo")',
}

# Shortcode di layout del tema: si rimuove il tag, si tiene il contenuto.
LAYOUT_SHORTCODES = {
    'two_third', 'one_third', 'one_third_last', 'one_half', 'one_half_last',
    'one_fourth', 'one_fourth_last', 'three_fourth', 'three_fourth_last',
    'list', 'accordions', 'accordion', 'tabs', 'tab', 'column', 'columns',
}

BLOCK_TAGS = {'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li',
              'blockquote', 'section', 'article'}
HEADING_TAGS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}


def key_for(*parts: Any) -> str:
    """Chiave Portable Text deterministica (rieseguire lo script e' idempotente)."""
    raw = ':'.join(str(p) for p in parts)
    return hashlib.sha1(raw.encode('utf-8')).hexdigest()[:12]


# ---------------------------------------------------------------- shortcodes

def strip_shortcodes(html: str) -> tuple[str, list[str], list[str]]:
    """Rimuove gli shortcode. Ritorna (html, id_gallerie, shortcode_sconosciuti)."""
    galleries: list[str] = []
    unknown: list[str] = []

    def replace(match: re.Match) -> str:
        body = match.group(1).strip()
        name = re.split(r'[\s\]]', body.lstrip('/'), 1)[0].lower()
        if name == 'nggallery':
            gid = re.search(r'id\s*=\s*["\']?(\d+)', body)
            if gid:
                galleries.append(gid.group(1))
            return ''
        if name in LAYOUT_SHORTCODES:
            return ''
        unknown.append(name)
        return ''

    return re.sub(r'\[([^\]]+)\]', replace, html), galleries, unknown


def wrap_bare_text(html: str) -> str:
    """
    Avvolge in <p> il testo che WordPress lasciava senza tag di blocco
    (equivalente semplificato di wpautop). Ogni riga diventa un paragrafo.
    """
    out: list[str] = []
    # Divide tenendo i tag di blocco come separatori, cosi' il testo "nudo"
    # resta isolato nei segmenti intermedi.
    parts = re.split(r'(<(?:p|div|h[1-6]|ul|ol|li|table|blockquote)\b[^>]*>.*?'
                     r'</(?:p|div|h[1-6]|ul|ol|li|table|blockquote)>)',
                     html, flags=re.S | re.I)
    for part in parts:
        if not part:
            continue
        if re.match(r'\s*<(?:p|div|h[1-6]|ul|ol|li|table|blockquote)\b', part, re.I):
            out.append(part)
            continue
        for line in part.split('\n'):
            line = line.strip()
            if line and line not in ('&nbsp;',):
                out.append(f'<p>{line}</p>')
    return '\n'.join(out)


# ------------------------------------------------------- HTML -> PortableText

class PortableTextParser(HTMLParser):
    """Converte HTML semplice in blocchi Portable Text preservando l'ordine."""

    def __init__(self, doc_id: str) -> None:
        super().__init__(convert_charrefs=True)
        self.doc_id = doc_id
        self.blocks: list[dict[str, Any]] = []
        self.children: list[dict[str, Any]] = []
        self.mark_defs: list[dict[str, Any]] = []
        self.marks: list[str] = []
        self.style = 'normal'
        self.list_item: str | None = None
        self.list_stack: list[str] = []
        self.dropped_images: list[str] = []

    # -- gestione blocchi -------------------------------------------------
    def flush(self) -> None:
        text = ''.join(c['text'] for c in self.children).strip()
        if text:
            block: dict[str, Any] = {
                '_type': 'block',
                '_key': key_for(self.doc_id, 'block', len(self.blocks)),
                'style': self.style,
                'markDefs': self.mark_defs,
                'children': self.children,
            }
            if self.list_item:
                block['listItem'] = self.list_item
                block['level'] = max(1, len(self.list_stack))
            self.blocks.append(block)
        self.children = []
        self.mark_defs = []
        self.style = 'normal'

    def add_text(self, text: str) -> None:
        if not text:
            return
        if self.children and self.children[-1]['marks'] == self.marks:
            self.children[-1]['text'] += text
        else:
            self.children.append({
                '_type': 'span',
                '_key': key_for(self.doc_id, 'span', len(self.blocks), len(self.children)),
                'text': text,
                'marks': list(self.marks),
            })

    # -- callback HTMLParser ----------------------------------------------
    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {k: (v or '') for k, v in attrs}
        if tag in ('ul', 'ol'):
            self.flush()
            self.list_stack.append('bullet' if tag == 'ul' else 'number')
        elif tag == 'li':
            self.flush()
            self.list_item = self.list_stack[-1] if self.list_stack else 'bullet'
        elif tag in BLOCK_TAGS:
            self.flush()
            self.style = tag if tag in HEADING_TAGS else 'normal'
        elif tag in ('strong', 'b'):
            self.marks.append('strong')
        elif tag in ('em', 'i'):
            self.marks.append('em')
        elif tag == 'a' and attr.get('href'):
            mark_key = key_for(self.doc_id, 'link', attr['href'], len(self.blocks))
            self.mark_defs.append({'_type': 'link', '_key': mark_key, 'href': attr['href']})
            self.marks.append(mark_key)
        elif tag == 'br':
            self.add_text(' ')
        elif tag == 'img':
            # Le immagini vanno caricate su Sanity a parte: qui le segnalo soltanto.
            if attr.get('src'):
                self.dropped_images.append(attr['src'])

    def handle_endtag(self, tag: str) -> None:
        if tag in ('ul', 'ol'):
            self.flush()
            if self.list_stack:
                self.list_stack.pop()
            self.list_item = None
        elif tag == 'li':
            self.flush()
            self.list_item = None
        elif tag in BLOCK_TAGS:
            self.flush()
        elif tag in ('strong', 'b', 'em', 'i', 'a') and self.marks:
            self.marks.pop()

    def handle_data(self, data: str) -> None:
        text = re.sub(r'[ \t\r\n\xa0]+', ' ', data)
        if text.strip() or (self.children and text == ' '):
            self.add_text(text)

    def close(self) -> None:  # type: ignore[override]
        super().close()
        self.flush()


def to_portable_text(html: str, doc_id: str) -> tuple[list[dict], list[str]]:
    parser = PortableTextParser(doc_id)
    parser.feed(html)
    parser.close()
    return parser.blocks, parser.dropped_images


def first_sentence(blocks: list[dict], limit: int = 200) -> str:
    """Descrizione breve ricavata dal primo paragrafo."""
    for block in blocks:
        if block.get('style') == 'normal' and not block.get('listItem'):
            text = ''.join(c['text'] for c in block['children']).strip()
            if len(text) > limit:
                cut = text[:limit].rsplit(' ', 1)[0]
                return cut + '...'
            if text:
                return text
    return ''


# ------------------------------------------------------------- NextGEN (SQL)

def parse_nextgen(sql_path: Path) -> dict[str, dict[str, Any]]:
    """Estrae le gallerie NextGEN dal dump SQL (assenti dall'export XML)."""
    sql = sql_path.read_text(encoding='utf-8', errors='replace')
    galleries: dict[str, dict[str, Any]] = {}

    for row in re.finditer(
        r"INSERT INTO `wp_ngg_gallery` VALUES \((\d+), '([^']*)', '[^']*', '([^']*)'", sql
    ):
        gid, name, path = row.groups()
        galleries[gid] = {'name': name, 'path': path, 'images': []}

    for row in re.finditer(
        r"INSERT INTO `wp_ngg_pictures` VALUES \(\d+, '[^']*', \d+, (\d+), '([^']*)'", sql
    ):
        gid, filename = row.groups()
        if gid in galleries:
            galleries[gid]['images'].append(filename)

    return galleries


# --------------------------------------------------------------------- main

def build_documents(items: list[ET.Element], galleries: dict[str, dict[str, Any]]):
    docs: list[dict[str, Any]] = []
    report: list[str] = []
    manifest: dict[str, Any] = {'attachments': [], 'nextgen': []}

    def text(item: ET.Element, path: str) -> str:
        return item.findtext(path, namespaces=NS) or ''

    for item in items:
        post_type = text(item, 'wp:post_type')
        post_id = text(item, 'wp:post_id')

        if post_type == 'attachment':
            url = text(item, 'wp:attachment_url')
            if url:
                manifest['attachments'].append({'id': post_id, 'url': url})
            continue

        if post_type not in ('page', 'post', 'portfolio_page'):
            continue

        title = item.findtext('title') or ''
        status = text(item, 'wp:status')

        if post_id in SKIP:
            report.append(f'  - saltata  id={post_id:>3} {title!r}: {SKIP[post_id]}')
            continue
        if status != 'publish':
            report.append(f'  - saltata  id={post_id:>3} {title!r}: stato "{status}"')
            continue
        if post_id not in MAPPING:
            report.append(f'  ! NON MAPPATA id={post_id:>3} {title!r} ({post_type})')
            continue

        target = MAPPING[post_id]
        raw = text(item, 'content:encoded')
        cleaned, gallery_ids, unknown = strip_shortcodes(raw)
        blocks, dropped = to_portable_text(wrap_bare_text(cleaned), post_id)

        doc: dict[str, Any] = {
            '_id': f"{target['type']}-{target['slug']}",
            '_type': target['type'],
            'title': {'_type': 'localeString', 'it': title.strip(), 'en': None},
            'slug': {'_type': 'slug', 'current': target['slug']},
            'description': {'_type': 'localeString',
                            'it': first_sentence(blocks), 'en': None},
            'content': {'_type': 'localeBlock', 'it': blocks, 'en': []},
        }
        if target['type'] == 'service':
            doc['icon'] = target['icon']
            doc['applications'] = []
        docs.append(doc)

        report.append(f'  + {target["type"]:8s} id={post_id:>3} -> '
                      f'{target["slug"]:28s} ({len(blocks)} blocchi)')
        for name in unknown:
            report.append(f'      ? shortcode sconosciuto rimosso: [{name}]')
        for src in dropped:
            report.append(f'      ! immagine inline non migrata: {src}')
        for gid in gallery_ids:
            gallery = galleries.get(gid)
            if gallery:
                gallery['target'] = f"{target['type']}/{target['slug']}"
                report.append(f'      * galleria NextGEN id={gid} "{gallery["name"]}" '
                              f'({len(gallery["images"])} immagini) da caricare a mano '
                              f'nel campo gallery')
            else:
                report.append(f'      ! galleria NextGEN id={gid} non trovata nel dump SQL')

    # Tutte le gallerie finiscono nel manifest, anche quelle che nessuna pagina
    # pubblicata richiama piu': i file esistono e vanno comunque recuperati.
    for gid, gallery in sorted(galleries.items(), key=lambda kv: int(kv[0])):
        manifest['nextgen'].append({
            'gallery_id': gid,
            'name': gallery['name'],
            'path': gallery['path'],
            'images': gallery['images'],
            'target': gallery.get('target'),
        })
        if not gallery.get('target'):
            report.append(f'  ? galleria NextGEN id={gid} "{gallery["name"]}" '
                          f'({len(gallery["images"])} immagini) non e\' richiamata da '
                          f'nessuna pagina pubblicata: da assegnare a mano')

    return docs, report, manifest


DOWNLOADER_HEADER = """#!/usr/bin/env bash
# Scarica i media del vecchio sito WordPress via HTTP dal sito ancora online.
# Generato da lib/migrate-wxr.py -- non modificare a mano, rigeneralo.
#
# Non serve l'accesso FTP: i file sono pubblici. Se il sito viene spento,
# recuperali invece via FTP da ftp.insyto.it nelle stesse sottocartelle.
set -uo pipefail

DEST="${1:-wp-media}"
mkdir -p "$DEST"
ok=0; ko=0

fetch() {  # fetch <url> <sottocartella>
  local url="$1" dir="$DEST/$2"
  mkdir -p "$dir"
  if curl -fsSL --retry 3 --retry-delay 2 -o "$dir/$(basename "$url")" "$url"; then
    echo "  ok   $url"; ok=$((ok+1))
  else
    echo "  FAIL $url"; ko=$((ko+1))
  fi
}

"""


def write_downloader(path: Path, manifest: dict[str, Any], base_url: str) -> int:
    """Genera uno script bash che scarica tutti i media via HTTP."""
    lines = [DOWNLOADER_HEADER]
    count = 0

    lines.append('echo "Media library (%d file)"' % len(manifest['attachments']))
    for att in manifest['attachments']:
        lines.append(f'fetch "{att["url"]}" uploads')
        count += 1

    for gallery in manifest['nextgen']:
        if not gallery['images']:
            continue
        lines.append(f'\necho "Galleria NextGEN: {gallery["name"]} '
                     f'({len(gallery["images"])} file)"')
        for filename in gallery['images']:
            url = f'{base_url}/{gallery["path"].strip("/")}/{filename}'
            lines.append(f'fetch "{url}" "gallery/{gallery["name"]}"')
            count += 1

    lines.append('\necho ""')
    lines.append('echo "Scaricati: $ok - Falliti: $ko - Cartella: $DEST"')
    lines.append('[ "$ko" -eq 0 ] || echo "I file falliti vanno recuperati via FTP '
                 'da ftp.insyto.it"')
    lines.append('')

    path.write_text('\n'.join(lines), encoding='utf-8')
    path.chmod(0o755)
    return count


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('xml', type=Path, help='export WordPress (WXR)')
    ap.add_argument('--sql', type=Path, help='dump SQL, per le gallerie NextGEN')
    ap.add_argument('-o', '--output', type=Path, default=Path('sanity-import.ndjson'))
    ap.add_argument('--manifest', type=Path, default=Path('media-manifest.json'),
                    help='elenco dei file immagine del vecchio sito')
    ap.add_argument('--downloader', type=Path, default=Path('download-media.sh'),
                    help='script bash generato per scaricare i media via HTTP')
    ap.add_argument('--base-url', default='http://www.insyto.it',
                    help='base URL del vecchio sito, per le gallerie NextGEN')
    args = ap.parse_args()

    if not args.xml.exists():
        print(f'File non trovato: {args.xml}', file=sys.stderr)
        return 1

    channel = ET.parse(args.xml).getroot().find('channel')
    if channel is None:
        print('XML non valido: manca <channel>', file=sys.stderr)
        return 1
    items = channel.findall('item')

    galleries = parse_nextgen(args.sql) if args.sql and args.sql.exists() else {}
    if args.sql and not galleries:
        print('Attenzione: nessuna galleria NextGEN trovata nel dump SQL', file=sys.stderr)

    docs, report, manifest = build_documents(items, galleries)

    with args.output.open('w', encoding='utf-8') as fh:
        for doc in docs:
            fh.write(json.dumps(doc, ensure_ascii=False) + '\n')
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2),
                             encoding='utf-8')
    n_media = write_downloader(args.downloader, manifest, args.base_url.rstrip('/'))

    print(f'Analizzati {len(items)} item WXR\n')
    print('\n'.join(report))
    print(f'\n{len(docs)} documenti -> {args.output}')
    print(f'{len(manifest["attachments"])} allegati e '
          f'{sum(len(g["images"]) for g in manifest["nextgen"])} immagini NextGEN '
          f'-> {args.manifest}')
    print(f'{n_media} download -> {args.downloader}')
    print('\nPassi successivi:')
    print(f'  ./{args.downloader} wp-media          # scarica le immagini')
    print(f'  npx sanity dataset import {args.output} production')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
