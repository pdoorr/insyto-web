# IN SY TO — contesto di progetto

Appunti per chi (persona o agente) riprende il lavoro. Non è documentazione
d'uso: quella sta nel README. Qui ci sono le decisioni già prese e i vincoli
che le motivano, così non vengono rifatte da capo o contraddette.

Ultimo aggiornamento: agosto 2026.

## Che cosa fa l'azienda, e come va raccontato

IN SY TO progetta, integra, installa, collauda e mantiene sistemi elettronici
ed elettromeccanici per Spazio, Difesa, Industriale e Civile.

Il posizionamento commerciale, definito nel piano di espansione sul Sud-Est
asiatico, è più stretto della descrizione generica:

> Infrastrutture modulari di test elettrico, RF e funzionale che riducono i
> tempi di integrazione, automatizzano la verifica e prolungano la vita degli
> impianti AIT esistenti.

In pratica: **costruiscono le macchine che mettono alla prova le altre
macchine.** È l'argomento distintivo e va tenuto al centro.

Corollario spesso frainteso: **l'esperienza sui lanciatori è prova di
competenza, non l'offerta principale.** Immagini di rampe e razzi in evidenza
posizionano l'azienda come fornitore di lanciatori, che è esattamente ciò che
il piano vuole evitare. Le immagini giuste sono banchi di prova e camere di
integrazione.

## Regole di contenuto

1. **Si scrive in inglese, si traduce in italiano.** Con Singapore al centro
   dell'espansione, `messages/en.json` è la sorgente e `it.json` la traduzione.
   Il mercato principale legge la versione EN.
2. **Nessun claim non verificabile.** È una regola che l'azienda si è data nel
   piano commerciale. Il vecchio sito dichiarava "20+ Anni di Eccellenza"
   contraddicendo la propria pagina Profilo (gruppo dal 2008, srl dal 2012):
   rimosso. In telemetria vanno solo date e fatti dimostrabili.
3. **Export control.** Il sito è il primo contatto e mostra solo capability e
   heritage; il dettaglio tecnico passa da NDA. Vale anche per le immagini:
   pagine di manuale e schemi vanno valutati prima di pubblicarli.
4. Vocabolario reale dell'azienda, da usare: AIV plan, test case, procedure di
   prova, dichiarazione di conformità DM 37/08, marcatura CE, quadri di
   controllo, cabine di trasformazione, ponti radio.

## Sistema visivo: due mondi, tenuti separati

La scelta è l'innesto di due direzioni valutate insieme al committente.

**`instrument` — banco di misura.** Home e pagine di verifica. Fondo scuro,
graticola, monospaziato per titoli e dati, un solo colore di segnale (ambra
`#FFB03A`). Mette in scena la verifica, che è ciò che l'azienda vende.

**`sheet` — tavola di disegno esecutivo.** Pagine di capability. Carta fredda,
inchiostro, cornice con filo interno, linee di quota, cartiglio, rosso solo per
i segni di revisione. Sostiene la tesi che un impianto valga quanto i documenti
che lo accompagnano — argomento forte verso Difesa e Spazio, dove conta la
vendor qualification.

**Non vanno mescolati nella stessa sezione.** L'effetto dipende dal fatto che
ogni superficie appartenga a un mondo solo. Header e footer restano `instrument`
anche sopra le pagine `sheet`: il foglio è un documento dentro l'applicazione.

Convenzioni:
- Niente angoli arrotondati: non li ha né un pannello di strumento né una tavola.
- Le linee di quota devono misurare qualcosa di reale nella pagina, non
  decorare.
- Il rosso `sheet-revision` solo per le note di revisione; usarlo altrove ne
  annulla il senso.
- Token in `tailwind.config.ts`, utility in `app/[locale]/globals.css`.

Aperto: il logo attuale è teal e va in conflitto con l'ambra del segnale. Serve
una versione monocromatica per fondo scuro. Non risolvibile in codice.

## Migrazione dal vecchio sito

Il sito precedente girava su WordPress 3.3.1 (2012) su hosting condiviso Aruba,
con permalink "plain": ogni pagina era servita da `/?page_id=N`. Da qui
discendono i redirect in `lib/wp-legacy-urls.ts`, applicati da `middleware.ts` e
non da `next.config.js` — i redirect della config ricopiano la query string
sulla destinazione, creando un doppione indicizzabile di ogni pagina.

`lib/migrate-wxr.py` converte l'export WordPress in documenti Sanity. Legge
anche il dump SQL, perché le gallerie NextGEN non compaiono nell'export XML.

I media del vecchio sito sono immagini a ~640px del 2012: pagine di manuale,
foto di servizio e render CAD su sfondo blu di default. Non reggono come
fotografia di marketing. Vanno usate come documentazione dentro il mondo
`sheet`, a dimensione contenuta e con didascalia. Se esistono ancora i file
CAD, rifare i render è la via più economica per avere immagini nitide.

## Infrastruttura

- Dominio, posta e vecchio hosting sono tutti su Aruba. Spostare il sito
  significa cambiare i record A/AAAA nel pannello Aruba: **i nameserver
  restano lì e gli MX non si toccano**, altrimenti si perde la posta.
- Il nuovo sito è pensato per Vercel.
- `robots.ts` e `sitemap.ts` stanno in `app/`, non in `app/[locale]/`: sotto il
  segmento dinamico venivano serviti come HTML con `lang="sitemap.xml"`.
- La sitemap emette URL con prefisso di lingua, perché `localePrefix: 'always'`
  farebbe rimbalzare qualunque URL senza prefisso.

## Stato

Fatto: home (`instrument`), `/servizi` e `/servizi/[slug]` (`sheet`), header,
footer, contenuti EN/IT, redirect 301, migrazione contenuti.

Da fare: profilo, contatti, lavora-con-noi, note-legali, blog e portfolio hanno
ancora il vecchio aspetto. Profilo e contatti per prime — sono le pagine che un
buyer apre dopo la home.

## Verifica

`npx tsc --noEmit` e `npx next lint` devono restare puliti.

Il build completo richiede credenziali Sanity: la generazione statica interroga
il CMS. In ambienti senza rete verso `*.sanity.io` usare `next dev` e
verificare le pagine renderizzate; `/servizi` e `generateStaticParams` sono
scritte per non rompersi con il CMS irraggiungibile.
