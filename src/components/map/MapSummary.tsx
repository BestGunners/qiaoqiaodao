import { Card } from '@/components/common/Card'
import { Icon } from '@/components/icons/Icon'
import { AvatarFace } from '@/components/child/AvatarFace'
import { getAvatar } from '@/data/avatars'
import { getBadge } from '@/data/badges'
import type { ChildProfile } from '@/store/childStore'

export interface MapSummaryProps {
  child: ChildProfile
  totalStars: number
  streakDays: number
  badgeIds: string[]
}

/** 地图顶部概览：头像 + 三个读数 + 徽章，图案全部用线性图标。 */
export function MapSummary({ child, totalStars, streakDays, badgeIds }: MapSummaryProps) {
  const avatar = getAvatar(child.avatarId)

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <AvatarFace avatar={avatar} size={56} />
        <div className="leading-tight">
          <div className="text-xl font-extrabold">{child.nickname}的学习地图</div>
          <div className="text-sm font-semibold text-ink-soft">
            每天 12 分钟，键盘会越来越听话
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 rounded-xl border border-surface-line bg-white px-3 py-2">
          <Icon name="star" size={16} filled className="text-ember-500" />
          <span className="font-mono text-lg font-extrabold tabular-nums">{totalStars}</span>
          <span className="text-[10px] font-bold text-ink-faint">星星</span>
        </span>

        <span className="flex items-center gap-2 rounded-xl border border-surface-line bg-white px-3 py-2">
          <Icon name="flame" size={16} className="text-ember-600" />
          <span className="font-mono text-lg font-extrabold tabular-nums">{streakDays}</span>
          <span className="text-[10px] font-bold text-ink-faint">连续天数</span>
        </span>

        <span className="flex items-center gap-2 rounded-xl border border-surface-line bg-white px-3 py-2">
          <span className="text-[10px] font-bold text-ink-faint">徽章</span>
          {badgeIds.length === 0 ? (
            <span className="text-xs font-semibold text-ink-faint">还没有</span>
          ) : (
            badgeIds.slice(0, 6).map((id) => {
              const badge = getBadge(id)
              if (!badge) return null
              return (
                <span
                  key={id}
                  title={`${badge.title}：${badge.description}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: badge.color }}
                >
                  <Icon name={badge.icon} size={15} />
                </span>
              )
            })
          )}
        </span>
      </div>
    </Card>
  )
}