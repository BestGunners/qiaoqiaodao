import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

/** 移上去会弹小星星的元素 */
const ACTION_SELECTOR = 'button, a, [role="button"], [role="switch"], label'

/**
 * 悬停小星星：鼠标移到按钮、虚拟键盘、关卡这些小东西上，
 * 元素右上角弹一颗小星星再淡出。
 * 只在鼠标进入的那一刻创建一个小元素，不跟随鼠标、不动原生光标、不做逐帧计算，
 * 所以打字和滚动都还是原来的流畅度；触屏设备和「减少动态效果」下自动关闭。
 */
export function CursorFX() {
  const enabled = useSettingsStore((state) => state.cursorFxEnabled)

  useEffect(() => {
    if (!enabled) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    let current: Element | null = null

    const popStar = (rect: DOMRect, size: number, delay: number) => {
      const el = document.createElement('span')
      el.className = 'hover-star'
      el.style.width = size + 'px'
      el.style.height = size + 'px'
      el.style.left = rect.right - size * 0.7 + 'px'
      el.style.top = rect.top - size * 0.3 + 'px'
      el.style.animationDelay = delay + 'ms'
      document.body.appendChild(el)
      window.setTimeout(() => el.remove(), 560 + delay)
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(ACTION_SELECTOR) : null
      if (!target || target === current) return
      current = target
      const rect = target.getBoundingClientRect()
      if (rect.width < 12 || rect.height < 12) return
      popStar(rect, 14, 0)
      popStar(rect, 9, 90)
    }

    const onOut = (event: PointerEvent) => {
      if (!current) return
      const to = event.relatedTarget instanceof Element ? event.relatedTarget : null
      if (to && current.contains(to)) return
      current = null
    }

    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })

    return () => {
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      document.querySelectorAll('.hover-star').forEach((el) => el.remove())
    }
  }, [enabled])

  return null
}
