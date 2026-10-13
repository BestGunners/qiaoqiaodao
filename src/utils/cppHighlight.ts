/**
 * C++ 代码着色的词法切分（只用来上色，不参与执行）。
 *
 * 要求：把每一行切成带类型的片段，拼起来必须和原来一字不差——
 * 这样编辑器里「高亮的那一层」和「真正输入的输入框」才会严丝合缝地对齐。
 */
export type CppTokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'type'
  | 'builtin'
  | 'pre'

export interface CppToken {
  text: string
  kind: CppTokenKind
}

const KEYWORDS = new Set([
  'if',
  'else',
  'for',
  'while',
  'return',
  'break',
  'continue',
  'true',
  'false',
  'void',
])

const TYPES = new Set(['int', 'double', 'float', 'bool', 'char', 'string', 'long', 'short'])

/** 语言内置的函数和对象：舞台命令、随机数、输入输出 */
const BUILTINS = new Set([
  'cout',
  'cin',
  'endl',
  'clear',
  'color',
  'star',
  'circle',
  'rect',
  'line',
  'text',
  'wait',
  'key',
  'rand',
  'abs',
  'max',
  'min',
  'sqrt',
  'pow',
  'len',
  'length',
])

const NUMBER_PATTERN = /^[0-9]+(\.[0-9]+)?/
const IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*/

/** 切分一行；`inBlock` 表示这一行是不是接着上一行的块注释 */
export function highlightCppLine(
  line: string,
  inBlock = false,
): { tokens: CppToken[]; inBlock: boolean } {
  const tokens: CppToken[] = []
  let plain = ''
  let index = 0

  const flush = () => {
    if (plain) {
      tokens.push({ text: plain, kind: 'plain' })
      plain = ''
    }
  }

  // 接着上一行没结束的块注释
  if (inBlock) {
    const end = line.indexOf('*/')
    if (end < 0) return { tokens: [{ text: line, kind: 'comment' }], inBlock: true }
    tokens.push({ text: line.slice(0, end + 2), kind: 'comment' })
    index = end + 2
  }

  // 预处理指令整行算一种颜色
  const trimmed = line.slice(index).trimStart()
  if (trimmed.startsWith('#')) {
    const lead = line.length - line.slice(index).trimStart().length
    if (index + lead > 0) tokens.push({ text: line.slice(0, index + lead), kind: 'plain' })
    tokens.push({ text: line.slice(index + lead), kind: 'pre' })
    return { tokens, inBlock: false }
  }

  while (index < line.length) {
    const rest = line.slice(index)

    if (rest.startsWith('//')) {
      flush()
      tokens.push({ text: rest, kind: 'comment' })
      return { tokens, inBlock: false }
    }

    if (rest.startsWith('/*')) {
      flush()
      const end = rest.indexOf('*/')
      if (end < 0) {
        tokens.push({ text: rest, kind: 'comment' })
        return { tokens, inBlock: true }
      }
      tokens.push({ text: rest.slice(0, end + 2), kind: 'comment' })
      index += end + 2
      continue
    }

    const char = line[index]
    if (char === '"' || char === "'") {
      flush()
      let cursor = index + 1
      while (cursor < line.length && line[cursor] !== char) {
        cursor += line[cursor] === '\\' ? 2 : 1
      }
      const end = Math.min(cursor + 1, line.length)
      tokens.push({ text: line.slice(index, end), kind: 'string' })
      index = end
      continue
    }

    const number = NUMBER_PATTERN.exec(rest)
    if (number && !/[A-Za-z0-9_]/.test(line[index - 1] ?? '')) {
      flush()
      tokens.push({ text: number[0], kind: 'number' })
      index += number[0].length
      continue
    }

    const identifier = IDENTIFIER_PATTERN.exec(rest)
    if (identifier) {
      flush()
      const word = identifier[0]
      const kind: CppTokenKind = KEYWORDS.has(word)
        ? 'keyword'
        : TYPES.has(word)
          ? 'type'
          : BUILTINS.has(word)
            ? 'builtin'
            : 'plain'
      tokens.push({ text: word, kind })
      index += word.length
      continue
    }

    plain += char
    index += 1
  }

  flush()
  return { tokens, inBlock: false }
}

/** 整段代码：每一行一组带类型的片段 */
export function highlightCpp(code: string): CppToken[][] {
  const lines: CppToken[][] = []
  let inBlock = false
  for (const line of code.split('\n')) {
    const result = highlightCppLine(line, inBlock)
    lines.push(result.tokens)
    inBlock = result.inBlock
  }
  return lines
}

/** 把切分结果还原成纯文本（自测用它验证"上色不改字"） */
export function tokensToText(lines: CppToken[][]): string {
  return lines.map((tokens) => tokens.map((token) => token.text).join('')).join('\n')
}
