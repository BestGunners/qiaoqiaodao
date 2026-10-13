import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontStyle = 'rounded' | 'kai' | 'hei'

interface SettingsState {
  soundEnabled: boolean
  /** 全局点击音效：关闭后界面点击不再发声，但练习反馈音保留 */
  clickSoundsEnabled: boolean
  /** 0 - 1，默认 0.8 */
  volume: number
  /** 打字时是否显示下方的模拟键盘（默认显示） */
  keyboardVisible: boolean
  /** 背景音乐：默认开，但只在非打字页面播放 */
  bgmEnabled: boolean
  /** 背景音乐音量 0 - 1，默认 0.35（比音效轻一点） */
  bgmVolume: number
  /** 字体样式：圆润 / 课本楷体 / 端正黑体 */
  fontStyle: FontStyle
  /** 字体大小倍率：0.85 - 1.4，默认 1 */
  fontScale: number
  /** 鼠标特效：光标跟着鼠标走、悬停变色、移动撒火花，默认开 */
  cursorFxEnabled: boolean
  toggleSound: () => void
  toggleClickSounds: () => void
  setVolume: (value: number) => void
  toggleKeyboard: () => void
  toggleBgm: () => void
  setBgmVolume: (value: number) => void
  setFontStyle: (value: FontStyle) => void
  setFontScale: (value: number) => void
  toggleCursorFx: () => void
}

/** 孩子的偏好设置：声音开关与音量（校内使用时可以一键静音）。 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      clickSoundsEnabled: true,
      volume: 0.8,
      keyboardVisible: true,
      bgmEnabled: true,
      bgmVolume: 0.35,
      fontStyle: 'rounded',
      fontScale: 1,
      cursorFxEnabled: true,
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      toggleKeyboard: () => set({ keyboardVisible: !get().keyboardVisible }),
      toggleClickSounds: () => set({ clickSoundsEnabled: !get().clickSoundsEnabled }),
      setVolume: (value) => set({ volume: Math.min(1, Math.max(0, value)) }),
      toggleBgm: () => set({ bgmEnabled: !get().bgmEnabled }),
      setBgmVolume: (value) => set({ bgmVolume: Math.min(1, Math.max(0, value)) }),
      setFontStyle: (value) => set({ fontStyle: value }),
      setFontScale: (value) => set({ fontScale: Math.min(1.4, Math.max(0.85, value)) }),
      toggleCursorFx: () => set({ cursorFxEnabled: !get().cursorFxEnabled }),
    }),
    { name: 'codekids.settings' },
  ),
)
