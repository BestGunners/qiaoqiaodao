import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

/**
 * 把「字体样式」和「字体大小」写到 <html> 上：
 *
 * - 字体样式 → `data-font` 属性，kid.css 里按这个属性切换 CSS 变量（--font-body / --font-display）；
 * - 字体大小 → 根字号（rem 基准），整套界面的字号、间距、键盘大小都会等比跟着放大。
 *
 * 单独抽成函数是为了在 main.tsx 里渲染前先同步跑一次，避免打开页面时先按默认字号闪一下。
 */
export function applyDisplayPreferences(fontStyle: string, fontScale: number): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.font = fontStyle
  root.style.fontSize = `${Math.round(16 * fontScale * 100) / 100}px`
}

/** 设置里改了字体或字号时立刻生效 */
export function useDisplayPreferences(): void {
  const fontStyle = useSettingsStore((state) => state.fontStyle)
  const fontScale = useSettingsStore((state) => state.fontScale)

  useEffect(() => {
    applyDisplayPreferences(fontStyle, fontScale)
  }, [fontStyle, fontScale])
}
