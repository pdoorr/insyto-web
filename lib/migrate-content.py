#!/usr/bin/env python3
"""
Script per migrare contenuti da JSON scraped a Sanity CMS
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any

# Mapping URL vecchi -> slug nuovi
URL_TO_SLUG = {
    'https://www.insyto.it/': 'home',
    'https://www.insyto.it/?page_id=333': 'profilo',
    'https://www.insyto.it/?page_id=325': 'Macchine',
    'https://www.insyto.it/?page_id=231': 'impianti',
    'https://www.insyto.it/?page_id=249': 'sistemi-elettronici',
    'https://www.insyto.it/?page_id=246': 'sistemi-radiocomunicazione',
    'https://www.insyto.it/?page_id=321': 'lavora-con-noi',
    'https://www.insyto.it/?page_id=16': 'contatti',
    'https://www.insyto.it/?page_id=343': 'note-legali',
}

def load_json_files(data_dir: Path) -> List[Dict[str, Any]]:
    """Carica tutti i file JSON dalla directory scraped_data/json"""
    json_dir = data_dir / 'json'
    if not json_dir.exists():
        print(f"❌ Directory {json_dir} non trovata")
        return []
    
    pages = []
    for json_file in json_dir.glob('*.json'):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                pages.append(data)
        except Exception as e:
            print(f"⚠ Errore lettura {json_file.name}: {e}")
    
    return pages

def convert_to_sanity_page(page_data: Dict[str, Any]) -> Dict[str, Any]:
    """Converte i dati di una pagina in formato Sanity"""
    url = page_data.get('url', '')
    slug = URL_TO_SLUG.get(url, url.split('/')[-1].replace('?page_id=', ''))
    
    # Estrai contenuto dai paragrafi
    content = []
    for para in page_data.get('paragraphs', []):
        if para.strip():
            content.append({
                '_type': 'block',
                'style': 'normal',
                'children': [{
                    '_type': 'span',
                    'text': para.strip()
                }]
            })
    
    # Aggiungi headings
    for level in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        for heading in page_data.get('headings', {}).get(level, []):
            if heading.strip():
                content.append({
                    '_type': 'block',
                    'style': level,
                    'children': [{
                        '_type': 'span',
                        'text': heading.strip()
                    }]
                })
    
    return {
        '_type': 'page',
        'title': page_data.get('title', ''),
        'slug': {
            '_type': 'slug',
            'current': slug
        },
        'description': page_data.get('description', ''),
        'content': content,
        'seo': {
            'metaTitle': page_data.get('title', ''),
            'metaDescription': page_data.get('description', ''),
            'keywords': []
        }
    }

def convert_to_sanity_service(page_data: Dict[str, Any]) -> Dict[str, Any] | None:
    """Converte una pagina servizio in formato Sanity"""
    url = page_data.get('url', '')
    
    # Solo per pagine servizi specifiche
    service_mapping = {
        'https://www.insyto.it/?page_id=325': {
            'title': 'Macchine',
            'slug': 'Macchine',
            'icon': 'Settings',
        },
        'https://www.insyto.it/?page_id=231': {
            'title': 'Impianti',
            'slug': 'impianti',
            'icon': 'Zap',
        },
        'https://www.insyto.it/?page_id=249': {
            'title': 'SISTEMI ELETTRONICI ED ELETTROMECCANICI',
            'slug': 'sistemi-elettronici',
            'icon': 'Cpu',
        },
        'https://www.insyto.it/?page_id=246': {
            'title': 'SISTEMI DI RADIOCOMUNICAZIONE',
            'slug': 'sistemi-radiocomunicazione',
            'icon': 'Radio',
        },
    }
    
    if url not in service_mapping:
        return None
    
    service_info = service_mapping[url]
    paragraphs = page_data.get('paragraphs', [])
    
    content = []
    for para in paragraphs:
        if para.strip() and not any(x in para for x in ['Sede legale', 'Sede operativa', 'email:', 'Copyright']):
            content.append({
                '_type': 'block',
                'style': 'normal',
                'children': [{
                    '_type': 'span',
                    'text': para.strip()
                }]
            })
    
    return {
        '_type': 'service',
        'title': service_info['title'],
        'slug': {
            '_type': 'slug',
            'current': service_info['slug']
        },
        'icon': service_info['icon'],
        'description': paragraphs[0] if paragraphs else '',
        'content': content,
        'applications': []
    }

def main():
    """Funzione principale"""
    if len(sys.argv) < 2:
        print("Usage: python migrate-content.py <scraped_data_dir> [output_file]")
        sys.exit(1)
    
    data_dir = Path(sys.argv[1])
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'sanity-import.json'
    
    print(f"📖 Caricamento contenuti da {data_dir}...")
    pages = load_json_files(data_dir)
    
    if not pages:
        print("❌ Nessun contenuto trovato")
        sys.exit(1)
    
    print(f"✓ Trovate {len(pages)} pagine")
    
    print("🔄 Conversione in formato Sanity...")
    sanity_documents = []
    
    for page in pages:
        # Converti in pagina
        sanity_page = convert_to_sanity_page(page)
        if sanity_page:
            sanity_documents.append(sanity_page)
        
        # Converti in servizio se applicabile
        sanity_service = convert_to_sanity_service(page)
        if sanity_service:
            sanity_documents.append(sanity_service)
    
    print(f"✓ Convertiti {len(sanity_documents)} documenti")
    
    # Salva output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(sanity_documents, f, ensure_ascii=False, indent=2)
    
    print(f"✅ File salvato: {output_file}")
    print(f"\nPer importare in Sanity:")
    print(f"  1. Vai su https://www.sanity.io/manage")
    print(f"  2. Seleziona il tuo progetto")
    print(f"  3. Vai su Import/Export")
    print(f"  4. Carica il file {output_file}")

if __name__ == '__main__':
    main()

