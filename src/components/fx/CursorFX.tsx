import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

/** 同时存在的火花上限，避免刷出一堆节点影响流畅度 */
const SPARK_LIMIT = 16
/** 移上去算「可以点」的元素 */
const ACTION_SELECTOR =
  'button, a, [role="button"], [role="switch"], label, [data-cursor="action"]'
/** 移上去算「可以输入」的元素 */
const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"], [data-cursor="text"]'

type CursorMode = 'default' | 'action' | 'text'

/**
 * 鼠标特效：自绘一个小光标（圆点 + 外圈）。
 * 移到能点的东西上，外圈会放大变成橙色；移到输入框会变成 I 形；
 * 移动和点击的时候还会撒出小火花，让孩子觉得"在玩"而不是"在学"。
 * 触屏设备、以及系统开了「减少动态效果」时自动关闭；设置页也能手动关。
 */
export function CursorFX() {
  const enabled = useSettingsStore((state) => state.cursorFxEnabled)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const sparkHostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    const host = hostRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const sparkHost = sparkHostRef.current
    if (!host || !ring || !dot || !sparkHost) return

    document.documentElement.classList.add('cursor-fx-on')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let ringX = x
    let ringY = y
    let prevX = x
    let prevY = y
    let scale = 1
    let mode: CursorMode = 'default'
    let live = false
    let pressUntil = 0
    let lastSpark = 0
    let frame = 0

    const setVar = (el: HTMLElement, name: string, value: string) => {
      el.style.setProperty(name, value)
    }

    const place = () => {
      setVar(dot, '--cx', x + 'px')
      setVar(dot, '--cy', y + 'px')
      setVar(ring, '--cx', ringX + 'px')
      setVar(ring, '--cy', ringY + 'px')
      setVar(ring, '--cs', scale.toFixed(3))
    }

    const spark = (strength: number) => {
      if (sparkHost.childElementCount >= SPARK_LIMIT) return
      const el = document.createElement('span')
      const size = 3 + Math.random() * 5 * strength
      const drift = 10 + Math.random() * 26 * strength
      const angle = Math.random() * Math.PI * 2
      el.className = 'cursor-fx-spark'
      el.style.left = x + 'px'
      el.style.top = y + 'px'
      el.style.width = size.toFixed(1) + 'px'
      el.style.height = size.toFixed(1) + 'px'
      el.style.setProperty('--sx', (Math.cos(angle) * drift).toFixed(1) + 'px')
      el.style.setProperty('--sy', (Math.sin(angle) * drift).toFixed(1) + 'px')
      sparkHost.appendChild(el)
      window.setTimeout(() => el.remove(), 640)
    }

    const tick = () => {
      ringX += (x - ringX) * 0.2
      ringY += (y - ringY) * 0.2
      const base = mode === 'action' ? 1.65 : 1
      const target = performance.now() < pressUntil ? base * 0.72 : base
      scale += (target - scale) * 0.25
      place()
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!live) {
        live = true
        ringX = x
        ringY = y
        host.classList.add('cursor-fx-live')
        place()
      }

      const targetEl = event.target instanceof Element ? event.target : null
      const next: CursorMode = targetEl?.closest(TEXT_SELECTOR)
        ? 'text'
        : targetEl?.closest(ACTION_SELECTOR)
          ? 'action'
          : 'default'
      if (next !== mode) {
        mode = next
        host.dataset.mode = next
      }

      const speed = Math.hypot(x - prevX, y - prevY)
      prevX = x
      prevY = y
      const now = performance.now()
      const gap = speed > 18 ? 26 : speed > 6 ? 60 : 150
      if (speed > 1.5 && now - lastSpark > gap) {
        lastSpark = now
        spark(1)
      }
    }

    const onDown = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      pressUntil = performance.now() + 150
      for (let i = 0; i < 5; i += 1) spark(1.6)
    }

    const onLeave = () => {
      live = false
      host.classList.remove('cursor-fx-live')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      document.documentElement.classList.remove('cursor-fx-on')
      sparkHost.replaceChildren()
    }
  }, [enabled])

  return (
    <div ref={hostRef} className="cursor-fx" data-mode="default" aria-hidden>
      <div ref={sparkHostRef} />
      <div ref={ringRef} className="cursor-fx-ring" />
      <div ref={dotRef} className="cursor-fx-dot" />
    </div>
  )
}
