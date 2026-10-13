import type { Badge } from '@/types/course'

/** MVP 徽章清单：技能、坚持、突破三类先行，创造类随后续课程开放。 */
export const BADGES: Badge[] = [
  {
    id: 'first-star',
    title: '初次点亮',
    description: '完成第一个关卡',
    icon: 'star',
    color: '#ffd95c',
    category: 'skill',
  },
  {
    id: 'home-row',
    title: '基准行小英雄',
    description: '完成阶段 1 前 6 关',
    icon: 'home',
    color: '#4f9cf9',
    category: 'skill',
  },
  {
    id: 'stage-1-clear',
    title: '键盘新手',
    description: '完成阶段 1 全部关卡',
    icon: 'award',
    color: '#a78bfa',
    category: 'skill',
  },
  {
    id: 'perfect-clear',
    title: '零错误通关',
    description: '一次练习零错误完成',
    icon: 'target',
    color: '#57d6c4',
    category: 'breakthrough',
  },
  {
    id: 'speed-10',
    title: '速度破 10',
    description: '速度首次达到 10 词/分',
    icon: 'bolt',
    color: '#ffb35c',
    category: 'breakthrough',
  },
  {
    id: 'speed-20',
    title: '速度破 20',
    description: '速度首次达到 20 词/分',
    icon: 'rocket',
    color: '#f97362',
    category: 'breakthrough',
  },
  {
    id: 'ten-stars',
    title: '十星收集者',
    description: '累计获得 10 颗星星',
    icon: 'sparkle',
    color: '#ffd95c',
    category: 'habit',
  },
  {
    id: 'thirty-stars',
    title: '星辰收藏家',
    description: '累计获得 30 颗星星',
    icon: 'crown',
    color: '#ff9f43',
    category: 'habit',
  },
  {
    id: 'streak-3',
    title: '连续 3 天',
    description: '连续 3 天来练习',
    icon: 'flame',
    color: '#ef5350',
    category: 'habit',
  },
  {
    id: 'streak-7',
    title: '连续 7 天',
    description: '连续 7 天来练习',
    icon: 'medal',
    color: '#ff9f43',
    category: 'habit',
  },
  {
    id: 'never-give-up',
    title: '越挫越勇',
    description: '同一关反复尝试 3 次以上仍然坚持',
    icon: 'mountain',
    color: '#6fd08c',
    category: 'habit',
  },
]

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id)
}
