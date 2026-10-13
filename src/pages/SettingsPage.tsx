import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PatternPad } from '@/components/child/PatternPad'
import { AvatarFace } from '@/components/child/AvatarFace'
import { Logo } from '@/components/common/Logo'
import { Icon } from '@/components/icons/Icon'
import { Card } from '@/components/common/Card'
import { AppShell } from '@/components/layout/AppShell'
import { Mascot } from '@/components/mascot/Mascot'
import { AVATARS, getAvatar, getPatternIcon } from '@/data/avatars'
import { sfx } from '@/engine/sfx'
import { useChildStore } from '@/store/childStore'
import { useSettingsStore, type FontStyle } from '@/store/settingsStore'
import { useCurrentChild } from '@/store/selectors'
import { cn } from '@/utils/cn'

type PatternStep = 'idle' | 'old' | 'new' | 'confirm'

const FONT_STYLE_OPTIONS: Array<{ value: FontStyle; label: string; description: string }> = [
  { value: 'rounded', label: '圆润可爱', description: '默认样式：圆圆的字体，标题带一点手写味。' },
  { value: 'kai', label: '课本楷体', description: '和语文课本一样，笔画最标准，适合认字练字。' },
  { value: 'hei', label: '端正黑体', description: '干净清楚、笔画最粗，看久了最省力。' },
]

const FONT_SCALE_PRESETS: Array<{ value: number; label: string }> = [
  { value: 0.9, label: '小' },
  { value: 1, label: '标准' },
  { value: 1.15, label: '大' },
  { value: 1.3, label: '特大' },
]

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: () => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-extrabold">{label}</div>
        {description ? (
          <div className="text-xs font-bold text-ink-soft">{description}</div>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={cn(
          'relative h-8 w-14 shrink-0 rounded-full transition',
          checked ? 'bg-brand-500' : 'bg-brand-100',
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all',
            checked ? 'left-7' : 'left-1',
          )}
        />
      </button>
    </div>
  )
}

/**
 * 设置页：孩子自己的样子（头像 / 名字）、图形密码、声音。
 * 所有修改都是即时保存到本机档案里的。
 */
export default function SettingsPage() {
  const navigate = useNavigate()
  const child = useCurrentChild()
  const updateProfile = useChildStore((state) => state.updateProfile)
  const logout = useChildStore((state) => state.logout)

  const volume = useSettingsStore((state) => state.volume)
  const setVolume = useSettingsStore((state) => state.setVolume)
  const soundEnabled = useSettingsStore((state) => state.soundEnabled)
  const toggleSound = useSettingsStore((state) => state.toggleSound)
  const clickSoundsEnabled = useSettingsStore((state) => state.clickSoundsEnabled)
  const toggleClickSounds = useSettingsStore((state) => state.toggleClickSounds)
const bgmEnabled = useSettingsStore((state) => state.bgmEnabled)
const fontStyle = useSettingsStore((state) => state.fontStyle)
const setFontStyle = useSettingsStore((state) => state.setFontStyle)
const fontScale = useSettingsStore((state) => state.fontScale)
const setFontScale = useSettingsStore((state) => state.setFontScale)
const toggleBgm = useSettingsStore((state) => state.toggleBgm)
const bgmVolume = useSettingsStore((state) => state.bgmVolume)
const setBgmVolume = useSettingsStore((state) => state.setBgmVolume)
const cursorFxEnabled = useSettingsStore((state) => state.cursorFxEnabled)
const toggleCursorFx = useSettingsStore((state) => state.toggleCursorFx)

  const [nicknameDraft, setNicknameDraft] = useState(child?.nickname ?? '')
  const [avatarDraft, setAvatarDraft] = useState(child?.avatarId ?? AVATARS[0].id)
  const [notice, setNotice] = useState<string | null>(null)
  const [patternStep, setPatternStep] = useState<PatternStep>('idle')
  const [newPattern, setNewPattern] = useState<string[]>([])
  const lastPreviewAt = useRef(0)
  const [audioStatus, setAudioStatus] = useState(() => sfx.status())

  useEffect(() => {
    setAudioStatus(sfx.status())
  }, [soundEnabled, clickSoundsEnabled, volume])

  if (!child) return null

  const avatar = getAvatar(avatarDraft)
  const profileDirty = nicknameDraft.trim() !== child.nickname || avatarDraft !== child.avatarId

  const previewVolume = () => {
    const now = Date.now()
    if (now - lastPreviewAt.current < 260) return
    lastPreviewAt.current = now
    sfx.preview()
  }

  const saveProfile = () => {
    updateProfile(child.id, { nickname: nicknameDraft, avatarId: avatarDraft })
    sfx.badge()
    setNotice('保存好啦！')
  }

  const matchesPattern = (input: string[], target: string[]) =>
    input.length === target.length && input.every((icon, index) => icon === target[index])

  return (
    <AppShell className="gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Logo size={40} />
        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="rounded-2xl bg-white/85 px-4 py-2 text-sm font-extrabold text-brand-700 shadow-pop"
          >
            <Icon name="map" size={16} /> 回地图
          </Link>
        </div>
      </header>

      <Card className="flex flex-wrap items-center gap-4">
        <Mascot mood="happy" size={72} />
        <div className="leading-tight">
          <div className="font-display text-2xl font-extrabold">设置</div>
          <div className="text-sm font-bold text-ink-soft">
            想换头像、改名字、换密码或者调音量，都在这一页。
          </div>
        </div>
      </Card>

      <Card className="space-y-5">
        <div className="font-display text-xl font-extrabold">我的样子</div>

        <div className="flex items-center gap-4">
          <AvatarFace avatar={avatar} size={64} />
          <div className="min-w-0 flex-1 space-y-2">
            <input
              value={nicknameDraft}
              onChange={(event) => {
                setNotice(null)
                setNicknameDraft(event.target.value)
              }}
              maxLength={12}
              placeholder="我的名字"
              className="w-full rounded-kid border-2 border-brand-200 bg-white px-4 py-2.5 text-lg font-extrabold outline-none focus:border-brand-400"
            />
            <div className="text-xs font-bold text-ink-soft">
              你选的是「{getAvatar(avatarDraft).name}」· 现在 {child.age} 岁
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {AVATARS.map((option) => (
            <button
              key={option.id}
              type="button"
              title={option.name}
              aria-label={option.name}
              onClick={() => {
                setNotice(null)
                setAvatarDraft(option.id)
              }}
              className={cn(
                'flex aspect-square items-center justify-center rounded-2xl border-b-4 p-1 transition',
                avatarDraft === option.id
                  ? 'anim-pop-in border-brand-500 bg-brand-50 shadow-pop'
                  : 'border-brand-200 bg-white hover:-translate-y-1',
              )}
            >
              <AvatarFace avatar={option} className="h-full w-full" />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!profileDirty}
            onClick={saveProfile}
            className="rounded-kid bg-brand-500 px-6 py-3 text-lg font-extrabold text-white shadow-kid transition active:translate-y-[2px] disabled:opacity-40"
          >
            <Icon name="check" size={18} /> 保存修改
          </button>
          {notice ? (
            <span className="anim-pop-in rounded-2xl bg-[#e8f8ee] px-4 py-2 text-sm font-extrabold text-[#2f9d63]">
              {notice}
            </span>
          ) : null}
          {profileDirty ? (
            <button
              type="button"
              onClick={() => {
                setNicknameDraft(child.nickname)
                setAvatarDraft(child.avatarId)
                setNotice(null)
              }}
              className="text-sm font-extrabold text-ink-soft"
            >
              撤销
            </button>
          ) : null}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-xl font-extrabold">图形密码</div>
            <div className="text-xs font-bold text-ink-soft">用 4 个图案保护自己的学习进度</div>
          </div>
          <div className="flex items-center gap-2">
            {child.pattern.map((icon, index) => (
              <span
                key={`${icon}-${index}`}
                className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-200 bg-white"
              >
                <Icon
                  name={getPatternIcon(icon).id}
                  size={22}
                  style={{ color: getPatternIcon(icon).color }}
                />
              </span>
            ))}
          </div>
        </div>

        {patternStep === 'idle' ? (
          <button
            type="button"
            onClick={() => {
              setNotice(null)
              setPatternStep('old')
            }}
            className="rounded-kid border-2 border-brand-200 bg-white px-6 py-3 font-extrabold text-brand-700 transition hover:border-brand-400"
          >
            <Icon name="key" size={18} /> 修改图形密码
          </button>
        ) : null}

        {patternStep === 'old' ? (
          <PatternPad
            title="先输入现在的图形密码"
            hint="验证通过后，才能设置新的密码"
            submitLabel="下一步"
            onSubmit={(input) => {
              if (!matchesPattern(input, child.pattern)) return false
              sfx.badge()
              setPatternStep('new')
              return true
            }}
            onCancel={() => setPatternStep('idle')}
          />
        ) : null}

        {patternStep === 'new' ? (
          <PatternPad
            title="设计新的图形密码"
            hint="按顺序点 4 个图案，挑一个容易记住的"
            submitLabel="下一步"
            onSubmit={(input) => {
              sfx.badge()
              setNewPattern(input)
              setPatternStep('confirm')
              return true
            }}
            onCancel={() => setPatternStep('idle')}
          />
        ) : null}

        {patternStep === 'confirm' ? (
          <PatternPad
            title="再输入一次新密码"
            hint="两次要一模一样才算修改成功"
            submitLabel="保存新密码"
            onSubmit={(input) => {
              if (!matchesPattern(input, newPattern)) return false
              updateProfile(child.id, { pattern: input })
              sfx.badge()
              setPatternStep('idle')
              setNotice('图形密码已经换好啦')
              return true
            }}
            onCancel={() => setPatternStep('idle')}
          />
        ) : null}
      </Card>

      <Card className="space-y-5">
        <div className="font-display text-xl font-extrabold">显示</div>

        <div className="space-y-2">
          <div className="font-extrabold">字体样式</div>
          <div className="flex flex-wrap gap-2">
            {FONT_STYLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFontStyle(option.value)
                  sfx.tap()
                }}
                className={cn(
                  'rounded-xl border px-4 py-2 text-sm font-extrabold transition',
                  fontStyle === option.value
                    ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-glow'
                    : 'border-surface-line bg-white text-ink-soft hover:border-brand-300',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-ink-faint">
            {FONT_STYLE_OPTIONS.find((option) => option.value === fontStyle)?.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold">字体大小</span>
            <span className="text-sm font-extrabold text-brand-700">
              {Math.round(fontScale * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold text-ink-faint">A</span>
            <input
              type="range"
              min={85}
              max={140}
              step={5}
              value={Math.round(fontScale * 100)}
              data-no-click-sound
              aria-label="字体大小"
              onChange={(event) => setFontScale(Number(event.target.value) / 100)}
              className="h-2 flex-1 cursor-pointer accent-brand-500"
            />
            <span className="font-mono text-lg font-extrabold text-ink-faint">A</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FONT_SCALE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setFontScale(preset.value)}
                className={cn(
                  'rounded-xl border px-3 py-1.5 text-xs font-extrabold transition',
                  Math.abs(fontScale - preset.value) < 1e-9
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-surface-line bg-white text-ink-soft hover:border-brand-300',
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-surface-line bg-surface-muted px-4 py-3">
          <div className="text-[11px] font-extrabold text-ink-soft">预览</div>
          <div className="font-kid text-base font-extrabold text-ink">
            敲敲岛 · 你好，小朋友！Aa Bb 123
          </div>
          <div className="font-display text-2xl font-extrabold text-brand-700">敲敲岛</div>
        </div>

        <div className="border-t border-brand-100 pt-4">
          <ToggleRow
            label="悬停小星星"
            description="鼠标移到按钮、键盘这些小东西上，会弹一颗小星星"
            checked={cursorFxEnabled}
            onChange={toggleCursorFx}
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <div className="font-display text-xl font-extrabold">声音</div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold">音效音量</span>
            <span className="text-sm font-extrabold text-brand-700">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="mute" size={16} className="text-ink-faint" />
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(volume * 100)}
              data-no-click-sound
              aria-label="音效音量"
              onChange={(event) => {
                const next = Number(event.target.value) / 100
                setVolume(next)
                if (next > 0 && !soundEnabled) toggleSound()
                if (next > 0) previewVolume()
              }}
              className="h-2 flex-1 cursor-pointer accent-brand-500"
            />
            <Icon name="sound" size={16} className="text-ink-faint" />
          </div>
          <button
            type="button"
            onClick={() => {
              sfx.unlock()
              sfx.preview()
            }}
            className="rounded-2xl border-2 border-brand-200 bg-white px-4 py-2 text-sm font-extrabold text-brand-700"
          >
            <Icon name="sound" size={16} /> 试听一下
          </button>
        </div>

        <div className="space-y-4 border-t border-brand-100 pt-4">
          <ToggleRow
            label="音效"
            description="打字音、点击音、过关音；背景音乐单独控制"
            checked={soundEnabled}
            onChange={() => {
              toggleSound()
              if (!soundEnabled) sfx.tap()
            }}
          />
          <ToggleRow
            label="全局点击音效"
            description="只点按钮、点图案时的提示音"
            checked={clickSoundsEnabled}
            onChange={() => {
              sfx.unlock()
              toggleClickSounds()
              if (!clickSoundsEnabled) sfx.tap()
            }}
          />
          <ToggleRow
            label="背景音乐"
            description="只在首页、地图这些页面轻轻播放，打字练习时不播"
            checked={bgmEnabled}
            onChange={() => {
              sfx.unlock()
              toggleBgm()
              if (!bgmEnabled) sfx.tap()
            }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold">音乐音量</span>
              <span className="text-sm font-extrabold text-brand-700">
                {Math.round(bgmVolume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="mute" size={16} className="text-ink-faint" />
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(bgmVolume * 100)}
                data-no-click-sound
                aria-label="背景音乐音量"
                onChange={(event) => {
                  const next = Number(event.target.value) / 100
                  setBgmVolume(next)
                  if (next > 0 && !bgmEnabled) toggleBgm()
                }}
                className="h-2 flex-1 cursor-pointer accent-brand-500"
              />
              <Icon name="sound" size={16} className="text-ink-faint" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-surface-line bg-surface-muted px-3 py-2">
            <span className="text-xs font-bold text-ink-soft">
              音频状态：{audioStatus.state}
              （声音 {audioStatus.soundEnabled ? '开' : '关'} · 点击音效{' '}
              {audioStatus.clickSounds ? '开' : '关'} · 音效音量 {Math.round(audioStatus.volume * 100)}%
              · 背景音乐 {bgmEnabled ? '开' : '关'} {Math.round(bgmVolume * 100)}%）
            </span>
            <button
              type="button"
              onClick={() => {
                sfx.unlock()
                sfx.preview()
                setAudioStatus(sfx.status())
              }}
              className="rounded-lg border border-surface-line bg-white px-2.5 py-1 text-xs font-extrabold text-brand-700"
            >
              重新检测并试听
            </button>
          </div>
        </div>
      </Card>

      <div className="flex justify-center pb-6">
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="rounded-kid border-2 border-[#f6ccd7] bg-[#fff5f7] px-6 py-3 font-extrabold text-[#c2334c] transition hover:bg-[#ffe9ee]"
        >
          <Icon name="back" size={18} /> 退出登录
        </button>
      </div>
    </AppShell>
  )
}
