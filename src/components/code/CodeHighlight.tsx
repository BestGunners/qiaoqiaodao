import type { CppToken, CppTokenKind } from '@/utils/cppHighlight'

/** 每类片段一个颜色：注释是绿的、字符串是橙的、数字是紫的、关键字是蓝的 */
export const TOKEN_CLASS: Record<CppTokenKind, string> = {
  plain: '',
  comment: 'text-[#3f9e5c]',
  string: 'text-[#e8862b]',
  number: 'text-[#7c5cf5] font-bold',
  keyword: 'text-[#2757d6] font-bold',
  type: 'text-[#1cb3a6]',
  builtin: 'text-[#4f9cf9]',
  pre: 'text-[#a855f7]',
}

export interface HighlightedLineProps {
  tokens: CppToken[]
}

/** 渲染一行：空行补一个零宽字符，免得整行塌掉 */
export function HighlightedLine({ tokens }: HighlightedLineProps) {
  if (tokens.length === 0) return <span>{'\u200b'}</span>

  return (
    <>
      {tokens.map((token, index) => (
        <span key={index} className={TOKEN_CLASS[token.kind]}>
          {token.text}
        </span>
      ))}
    </>
  )
}
