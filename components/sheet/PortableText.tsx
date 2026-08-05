import { Fragment } from 'react'

/**
 * Renderer Portable Text per il mondo "tavola".
 *
 * Quello precedente stampava ogni blocco come <p>, buttando via heading,
 * elenchi e grassetti — cioè esattamente la struttura che lib/migrate-wxr.py
 * si preoccupa di preservare dall'export WordPress. Qui i blocchi vengono resi
 * per quello che sono.
 */

type Span = {
  _type: string
  _key?: string
  text?: string
  marks?: string[]
}

type MarkDef = { _key: string; _type: string; href?: string }

type Block = {
  _type: string
  _key?: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs?: MarkDef[]
  children?: Span[]
}

function renderSpans(children: Span[] = [], markDefs: MarkDef[] = []) {
  return children.map((span, index) => {
    let node: React.ReactNode = span.text ?? ''

    for (const mark of span.marks ?? []) {
      if (mark === 'strong') {
        node = <strong className="font-semibold text-sheet-ink">{node}</strong>
      } else if (mark === 'em') {
        node = <em>{node}</em>
      } else {
        const def = markDefs.find((candidate) => candidate._key === mark)
        if (def?._type === 'link' && def.href) {
          node = (
            <a
              href={def.href}
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              {node}
            </a>
          )
        }
      }
    }

    return <Fragment key={span._key ?? index}>{node}</Fragment>
  })
}

const HEADING_CLASS: Record<string, string> = {
  h1: 'title-sheet text-[22px] mt-10 mb-3',
  h2: 'title-sheet text-[18px] mt-9 mb-3',
  h3: 'title-sheet text-[15px] mt-8 mb-2',
  h4: 'title-sheet text-[13px] mt-7 mb-2',
  h5: 'title-sheet text-[12px] mt-6 mb-2',
  h6: 'title-sheet text-[12px] mt-6 mb-2',
}

export default function PortableText({ value }: { value: Block[] }) {
  if (!value?.length) return null

  const output: React.ReactNode[] = []
  // Gli elenchi arrivano come blocchi consecutivi con listItem: vanno
  // raggruppati in un solo <ul>/<ol>, altrimenti ogni voce diventa una lista.
  let listBuffer: Block[] = []
  let listType: 'bullet' | 'number' | null = null

  const flushList = () => {
    if (!listBuffer.length || !listType) return
    const ListTag = listType === 'number' ? 'ol' : 'ul'
    output.push(
      <ListTag
        key={`list-${listBuffer[0]._key ?? output.length}`}
        className={`my-4 space-y-2 pl-5 ${
          listType === 'number' ? 'list-decimal' : 'list-disc'
        } marker:text-sheet-hair`}
      >
        {listBuffer.map((item, index) => (
          <li
            key={item._key ?? index}
            className="text-[15px] leading-relaxed text-sheet-soft"
          >
            {renderSpans(item.children, item.markDefs)}
          </li>
        ))}
      </ListTag>
    )
    listBuffer = []
    listType = null
  }

  for (const block of value) {
    if (block._type !== 'block') continue

    if (block.listItem) {
      if (listType && listType !== block.listItem) flushList()
      listType = block.listItem
      listBuffer.push(block)
      continue
    }

    flushList()

    const style = block.style ?? 'normal'
    if (style in HEADING_CLASS) {
      const HeadingTag = style as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      output.push(
        <HeadingTag key={block._key ?? output.length} className={HEADING_CLASS[style]}>
          {renderSpans(block.children, block.markDefs)}
        </HeadingTag>
      )
    } else {
      output.push(
        <p
          key={block._key ?? output.length}
          className="my-4 max-w-[68ch] text-[15px] leading-relaxed text-sheet-soft"
        >
          {renderSpans(block.children, block.markDefs)}
        </p>
      )
    }
  }

  flushList()

  return <>{output}</>
}
