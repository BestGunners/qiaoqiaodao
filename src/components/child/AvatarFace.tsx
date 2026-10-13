import type { AvatarOption } from '@/data/avatars'

/** 统一的描边颜色，和刺猬 logo 一个风格 */
const INK = '#12203a'

export interface AvatarFaceProps {
  avatar: AvatarOption
  size?: number
  className?: string
}

/**
 * 小怪兽头像：纯 SVG 按参数画出来（没有 emoji）。
 * 耳朵形状、眼睛、嘴、装饰、配色都由数据决定，所以 20 个头像各不相同，
 * 但风格统一，缩到 32px 或放到 96px 都清晰。
 */
export function AvatarFace({ avatar, size = 44, className }: AvatarFaceProps) {
  const { base, accent, ear, eye, mouth, extra } = avatar

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={avatar.name}
    >
      <circle cx="32" cy="32" r="31" fill={accent} opacity="0.14" />

      {ear === 'round' ? (
        <>
          <circle cx="16" cy="17" r="8.5" fill={accent} stroke={INK} strokeWidth="2.6" />
          <circle cx="48" cy="17" r="8.5" fill={accent} stroke={INK} strokeWidth="2.6" />
        </>
      ) : null}
      {ear === 'pointy' ? (
        <>
          <path d="M15 24 L11.5 6 L29 15.5 Z" fill={accent} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M49 24 L52.5 6 L35 15.5 Z" fill={accent} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        </>
      ) : null}
      {ear === 'antenna' ? (
        <>
          <path d="M23 17 L18 6.5" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="17.5" cy="5.5" r="3.6" fill={accent} stroke={INK} strokeWidth="2" />
          <path d="M41 17 L46 6.5" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="46.5" cy="5.5" r="3.6" fill={accent} stroke={INK} strokeWidth="2" />
        </>
      ) : null}
      {ear === 'fin' ? (
        <>
          <path d="M13 31 L3.5 23 L13 41 Z" fill={accent} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M51 31 L60.5 23 L51 41 Z" fill={accent} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        </>
      ) : null}
      {ear === 'horn' ? (
        <>
          <path d="M20 19 L22.5 4 L31 16 Z" fill={accent} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M44 19 L41.5 4 L33 16 Z" fill={accent} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        </>
      ) : null}

      <rect x="11" y="15" width="42" height="38" rx="17" fill={base} stroke={INK} strokeWidth="2.6" />

      {extra === 'spots' ? (
        <>
          <circle cx="18" cy="24" r="2.4" fill={accent} opacity="0.85" />
          <circle cx="46" cy="26" r="2.8" fill={accent} opacity="0.85" />
          <circle cx="32" cy="19" r="2.2" fill={accent} opacity="0.85" />
        </>
      ) : null}
      {extra === 'stripes' ? (
        <>
          <path d="M17 21 h7" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M40 21 h7" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        </>
      ) : null}
      {extra === 'blush' ? (
        <>
          <circle cx="16.5" cy="41" r="3.6" fill="#ff9fb2" opacity="0.7" />
          <circle cx="47.5" cy="41" r="3.6" fill="#ff9fb2" opacity="0.7" />
        </>
      ) : null}

      {eye === 'dot' ? (
        <>
          <circle cx="24" cy="33" r="3.6" fill={INK} />
          <circle cx="40" cy="33" r="3.6" fill={INK} />
          <circle cx="22.8" cy="31.8" r="1.2" fill="#ffffff" />
          <circle cx="38.8" cy="31.8" r="1.2" fill="#ffffff" />
        </>
      ) : null}
      {eye === 'happy' ? (
        <>
          <path d="M20 34.5 q4 -4.5 8 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M36 34.5 q4 -4.5 8 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      ) : null}
      {eye === 'sleepy' ? (
        <>
          <path d="M20 33.5 h8" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M36 33.5 h8" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : null}
      {eye === 'sparkle' ? (
        <>
          <path d="M24 28.6 l1.7 3.5 3.5 1.7 -3.5 1.7 -1.7 3.5 -1.7 -3.5 -3.5 -1.7 3.5 -1.7 Z" fill={INK} />
          <path d="M40 28.6 l1.7 3.5 3.5 1.7 -3.5 1.7 -1.7 3.5 -1.7 -3.5 -3.5 -1.7 3.5 -1.7 Z" fill={INK} />
        </>
      ) : null}

      {mouth === 'smile' ? (
        <path d="M26.5 43 q5.5 5.5 11 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      ) : null}
      {mouth === 'grin' ? <path d="M25.5 42.5 a6.5 6.5 0 0 0 13 0 Z" fill={INK} /> : null}
      {mouth === 'oh' ? <circle cx="32" cy="45" r="3.4" fill={INK} /> : null}
      {mouth === 'wavy' ? (
        <path d="M26 44.5 q3 -3.2 6 0 q3 3.2 6 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : null}
    </svg>
  )
}
