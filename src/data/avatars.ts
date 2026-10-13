import type { IconName } from '@/components/icons/Icon'

export type AvatarEar = 'round' | 'pointy' | 'antenna' | 'fin' | 'horn'
export type AvatarEye = 'dot' | 'happy' | 'sleepy' | 'sparkle'
export type AvatarMouth = 'smile' | 'grin' | 'oh' | 'wavy'
export type AvatarExtra = 'none' | 'blush' | 'spots' | 'stripes'

export interface AvatarOption {
  id: string
  /** 中文名：给读屏和设置页用 */
  name: string
  /** 主体颜色 */
  base: string
  /** 副色：耳朵和装饰 */
  accent: string
  ear: AvatarEar
  eye: AvatarEye
  mouth: AvatarMouth
  extra: AvatarExtra
}

/**
 * 20 个小怪兽头像。
 * 全部由 `AvatarFace` 用参数画成矢量图（没有 emoji），和刺猬 logo 一样的粗描边风格，
 * 缩到 32px 或放到 96px 都清晰。
 */
export const AVATARS: AvatarOption[] = [
  { id: 'blue-bean', name: '蓝豆豆', base: '#7fb4ff', accent: '#3d74f0', ear: 'round', eye: 'dot', mouth: 'smile', extra: 'blush' },
  { id: 'mint', name: '薄荷仔', base: '#7ae4d6', accent: '#1cb3a6', ear: 'round', eye: 'dot', mouth: 'grin', extra: 'spots' },
  { id: 'sunny', name: '小太阳', base: '#ffd95c', accent: '#ff9f43', ear: 'pointy', eye: 'happy', mouth: 'smile', extra: 'blush' },
  { id: 'berry', name: '小莓果', base: '#ff8fb1', accent: '#e0457a', ear: 'round', eye: 'sparkle', mouth: 'oh', extra: 'spots' },
  { id: 'grape', name: '葡萄怪', base: '#a78bfa', accent: '#7c5cf5', ear: 'pointy', eye: 'dot', mouth: 'smile', extra: 'stripes' },
  { id: 'forest', name: '森林豆', base: '#6fd08c', accent: '#3f9e5c', ear: 'fin', eye: 'happy', mouth: 'grin', extra: 'none' },
  { id: 'cocoa', name: '可可球', base: '#e0a366', accent: '#b08968', ear: 'round', eye: 'sleepy', mouth: 'smile', extra: 'spots' },
  { id: 'sky', name: '天蓝仔', base: '#8ec5ff', accent: '#4f9cf9', ear: 'antenna', eye: 'dot', mouth: 'oh', extra: 'blush' },
  { id: 'coral', name: '小珊瑚', base: '#ffb35c', accent: '#e8862b', ear: 'pointy', eye: 'happy', mouth: 'smile', extra: 'stripes' },
  { id: 'snow', name: '小雪球', base: '#dbe7ff', accent: '#93b6ff', ear: 'round', eye: 'dot', mouth: 'smile', extra: 'none' },
  { id: 'ink', name: '墨墨', base: '#94a3b8', accent: '#5b6b88', ear: 'horn', eye: 'sleepy', mouth: 'wavy', extra: 'none' },
  { id: 'lime', name: '青柠', base: '#cdf5ee', accent: '#57d6c4', ear: 'fin', eye: 'dot', mouth: 'grin', extra: 'spots' },
  { id: 'plum', name: '梅子', base: '#b39ddb', accent: '#8b7bf0', ear: 'round', eye: 'sparkle', mouth: 'smile', extra: 'blush' },
  { id: 'peach', name: '小桃子', base: '#ffc978', accent: '#ff9f43', ear: 'pointy', eye: 'dot', mouth: 'oh', extra: 'spots' },
  { id: 'ocean', name: '深海蓝', base: '#4f9cf9', accent: '#2757d6', ear: 'fin', eye: 'dot', mouth: 'smile', extra: 'stripes' },
  { id: 'rose', name: '玫瑰糖', base: '#f7c4d8', accent: '#ef7bc0', ear: 'round', eye: 'happy', mouth: 'grin', extra: 'blush' },
  { id: 'lemon', name: '柠檬仔', base: '#ffe8cc', accent: '#ffb35c', ear: 'antenna', eye: 'sparkle', mouth: 'smile', extra: 'none' },
  { id: 'jade', name: '玉豆豆', base: '#5cc98a', accent: '#2f9d63', ear: 'horn', eye: 'dot', mouth: 'smile', extra: 'blush' },
  { id: 'storm', name: '小闪电', base: '#6693fb', accent: '#3d74f0', ear: 'pointy', eye: 'sleepy', mouth: 'wavy', extra: 'stripes' },
  { id: 'night', name: '夜光仔', base: '#57d6c4', accent: '#1cb3a6', ear: 'horn', eye: 'sparkle', mouth: 'oh', extra: 'spots' },
]

/**
 * 老版本头像是 emoji 动物（fox / cat / panda…），换成小怪兽以后把老 id 映射过来，
 * 孩子登录时还是自己原来那个专属样子，不会突然变成别人。
 */
export const LEGACY_AVATAR_IDS: Record<string, string> = {
  fox: 'coral',
  cat: 'cocoa',
  panda: 'snow',
  rabbit: 'rose',
  tiger: 'peach',
  koala: 'ink',
  lion: 'sunny',
  monkey: 'cocoa',
  frog: 'forest',
  penguin: 'ocean',
  turtle: 'jade',
  octopus: 'berry',
  unicorn: 'grape',
  dragon: 'forest',
  dino: 'lime',
  robot: 'sky',
  alien: 'night',
  wizard: 'plum',
  hero: 'storm',
  ninja: 'ink',
  astronaut: 'sky',
  artist: 'rose',
  donut: 'peach',
  strawberry: 'berry',
  star: 'sunny',
  rocket: 'storm',
}

export function getAvatar(id: string): AvatarOption {
  const resolved = LEGACY_AVATAR_IDS[id] ?? id
  return AVATARS.find((avatar) => avatar.id === resolved) ?? AVATARS[0]
}

/**
 * 图形密码的图案池：换成线性图标 + 各自的颜色。
 * 孩子记「星星-闪电-钥匙」这样的图形顺序，比记密码容易。
 */
export const PATTERN_ICONS: Array<{ id: IconName; color: string }> = [
  { id: 'star', color: '#ffd95c' },
  { id: 'bolt', color: '#6693fb' },
  { id: 'key', color: '#ffb35c' },
  { id: 'target', color: '#f97362' },
  { id: 'sparkle', color: '#a78bfa' },
  { id: 'lightbulb', color: '#ffcf6b' },
  { id: 'crown', color: '#ff9f43' },
  { id: 'music', color: '#57d6c4' },
  { id: 'code', color: '#4f9cf9' },
  { id: 'book', color: '#6fd08c' },
  { id: 'gamepad', color: '#ef7bc0' },
  { id: 'keyboard', color: '#94a3b8' },
]

export function getPatternIcon(id: string): { id: IconName; color: string } {
  return PATTERN_ICONS.find((icon) => icon.id === id) ?? PATTERN_ICONS[0]
}

/**
 * 老版本把图形密码存成了 emoji，换成图标后要把存下来的值映射过去，
 * 否则孩子原来画的密码就对不上了（childStore 的迁移里会用到）。
 */
export const LEGACY_PATTERN_ICONS: Record<string, string> = {
  '🌟': 'star',
  '🚀': 'bolt',
  '🐟': 'key',
  '🍎': 'target',
  '🎈': 'sparkle',
  '🐝': 'lightbulb',
  '🌈': 'crown',
  '🎵': 'music',
  '⚡': 'code',
  '🍄': 'book',
  '🐬': 'gamepad',
  '🎁': 'keyboard',
}
