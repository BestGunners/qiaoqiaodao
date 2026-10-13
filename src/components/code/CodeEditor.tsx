import { useMemo, type KeyboardEventHandler } from 'react'
import { HighlightedLine } from '@/components/code/CodeHighlight'
import { highlightCpp } from '@/utils/cppHighlight'
import { cn } from '@/utils/cn'

export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  /** 出错的行号（从 1 开始），会把这一行标红 */
  errorLine?: number | null
  minRows?: number
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>
  className?: string
}

/**
 * 代码编辑器：下面一层是上好色的代码，上面一层是透明的输入框，两层字距行高完全一致，
 * 所以既能随便改代码，又能看到颜色（注释绿色、字符串橙色、数字紫色、关键字蓝色）。
 */
export function CodeEditor({
  value,
  onChange,
  errorLine = null,
  minRows = 8,
  onKeyDown,
  className,
}: CodeEditorProps) {
  const lines = useMemo(() => highlightCpp(value), [value])
  const rows = Math.max(lines.length, minRows)

  return (
    <div className={cn('flex', className)}>
      <div className="select-none border-r border-brand-100 bg-brand-50/40 px-2 py-3 text-right font-mono text-xs leading-6 text-ink-soft/60">
        {lines.map((_, index) => (
          <div
            key={index}
            className={cn(
              'px-1',
              errorLine === index + 1 && 'rounded bg-[#ffe9ee] font-extrabold text-[#c2334c]',
            )}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        {/* 高亮层：负责显示，不接收鼠标事件 */}
        <pre
          aria-hidden
          className="whitespace-pre-wrap break-words px-3 py-3 font-mono text-sm leading-6 text-ink"
        >
          {lines.map((tokens, index) => (
            <div
              key={index}
              className={cn(errorLine === index + 1 && '-mx-1 rounded bg-[#ffe9ee] px-1')}
            >
              <HighlightedLine tokens={tokens} />
            </div>
          ))}
        </pre>

        {/* 输入层：文字透明，只留下光标和选区 */}
        <textarea
          value={value}
          spellCheck={false}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          className="absolute inset-0 h-full w-full resize-none overflow-hidden whitespace-pre-wrap break-words bg-transparent px-3 py-3 font-mono text-sm leading-6 text-transparent caret-ink outline-none selection:bg-brand-200/60"
        />
      </div>
    </div>
  )
}
