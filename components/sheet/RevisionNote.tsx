/**
 * Nota di revisione col triangolino, come i richiami di modifica su una tavola.
 * È l'unico punto in cui compare il rosso: usarlo altrove ne annulla il senso.
 */
export default function RevisionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 font-draft text-[10.5px] uppercase tracking-[0.1em] text-sheet-revision">
      <span
        aria-hidden="true"
        className="h-0 w-0 border-x-[6px] border-b-[11px] border-x-transparent border-b-sheet-revision"
      />
      {children}
    </p>
  )
}
