/**
 * Linea di quota, come su una tavola tecnica.
 *
 * Misura un elemento reale della pagina (di norma la colonna di testo che
 * segue): è il segno che rende leggibile la tavola come tavola, non un fregio.
 */
export default function DimensionRule({
  /** Quanta parte della larghezza copre, da 0 a 1. */
  extent = 1,
  /** Tratteggiata: quota di riferimento, non di ingombro. */
  dashed = false,
  className,
}: {
  extent?: number
  dashed?: boolean
  className?: string
}) {
  const end = Math.max(0.05, Math.min(1, extent)) * 798 + 1

  return (
    <svg
      viewBox="0 0 800 22"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`block h-[22px] w-full text-sheet-hair ${className ?? ''}`}
    >
      <line x1="1" y1="4" x2="1" y2="18" stroke="currentColor" strokeWidth="1" />
      <line x1={end} y1="4" x2={end} y2="18" stroke="currentColor" strokeWidth="1" />
      <line
        x1="1"
        y1="11"
        x2={end}
        y2="11"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray={dashed ? '3 3' : undefined}
      />
      {!dashed && (
        <>
          <path d="M1 11 L9 8 L9 14 Z" fill="currentColor" />
          <path d={`M${end} 11 L${end - 8} 8 L${end - 8} 14 Z`} fill="currentColor" />
        </>
      )}
    </svg>
  )
}
