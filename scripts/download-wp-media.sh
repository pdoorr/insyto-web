#!/usr/bin/env bash
# Scarica i media del vecchio sito WordPress via HTTP dal sito ancora online.
#
#   ./scripts/download-wp-media.sh wp-media
#
# Generato da lib/migrate-wxr.py a partire dall'export WordPress del 2026-08-05.
# E' versionato di proposito, anche se e' output di uno script: il sito di
# origine e' fermo al 2012, quindi questa lista di URL non cambiera' piu' e
# tenerla nel repo evita di dover ritrovare gli export per rigenerarla.
# Per rifarlo da capo: python3 lib/migrate-wxr.py export.xml --sql dump.sql
#
# Non serve l'accesso FTP: i file sono pubblici. Se il vecchio sito viene
# spento, vanno recuperati via FTP da ftp.insyto.it nelle stesse sottocartelle.
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


echo "Media library (20 file)"
fetch "http://www.insyto.it/wp-content/uploads/2012/02/container.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/parking.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/tubi.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/twitts.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/field2.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/field.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/2424572823_614e1e9c9a_o.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/radio.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/bridge.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/sistemielettr01.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/sistemielettr02.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/02/sistemielettr03.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/comunicazioni.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/impiantielettrici.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/lavoraconoi.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/342616_5368.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/header1.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/sistemi-elettromeccanici.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/2012-03-21-03.56.33-pm.jpg" uploads
fetch "http://www.insyto.it/wp-content/uploads/2012/03/2012-03-21-03.56.33-pm1.jpg" uploads

echo "Galleria NextGEN: sistemielettr (3 file)"
fetch "http://www.insyto.it/wp-content/gallery/sistemielettr/sistemielettr01.jpg" "gallery/sistemielettr"
fetch "http://www.insyto.it/wp-content/gallery/sistemielettr/sistemielettr02.jpg" "gallery/sistemielettr"
fetch "http://www.insyto.it/wp-content/gallery/sistemielettr/sistemielettr03.jpg" "gallery/sistemielettr"

echo "Galleria NextGEN: impianti (3 file)"
fetch "http://www.insyto.it/wp-content/uploads/nggallery/impianti/impianti01.jpg" "gallery/impianti"
fetch "http://www.insyto.it/wp-content/uploads/nggallery/impianti/impianti02.jpg" "gallery/impianti"
fetch "http://www.insyto.it/wp-content/uploads/nggallery/impianti/impianti03.jpg" "gallery/impianti"

echo "Galleria NextGEN: macchine (3 file)"
fetch "http://www.insyto.it/wp-content/uploads/nggallery/macchine/macchine01.jpg" "gallery/macchine"
fetch "http://www.insyto.it/wp-content/uploads/nggallery/macchine/macchine02.jpg" "gallery/macchine"
fetch "http://www.insyto.it/wp-content/uploads/nggallery/macchine/macchine03.jpg" "gallery/macchine"

echo ""
echo "Scaricati: $ok - Falliti: $ko - Cartella: $DEST"
[ "$ko" -eq 0 ] || echo "I file falliti vanno recuperati via FTP da ftp.insyto.it"
