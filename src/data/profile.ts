/**
 * 文案集中点（design D6：spec「文案来源单一」要求）。
 * 占位字符串以方括号显式呈现，避免被误读为已交付内容；
 * 由维护者替换最终值后即可在 Hero / Navigation / Contact 中生效，无需改动组件代码。
 *
 * 字段用途：
 *   - name / role / intro / ctaLabel / ctaHref：Hero 区块（hero-section spec）
 *   - email / contactTitle / contactIntro：Contact 区块（contact-section spec）
 *   - navLabels.{home,projects,contact}：Navigation 区块（navigation-section spec）
 */
export const profile = {
  name: '小飞侠',
  role: '天行者',
  intro: '天马行空、不着边际',
  ctaLabel: '查看项目',
  ctaHref: '#projects',
  // --- Navigation 区块（navigation-section spec）---
  navLabels: {
    home: '首页',
    projects: '项目',
    contact: '联系我',
  },
  // --- Contact 区块（contact-section spec）---
  email: '[your-email@example.com]',
  contactTitle: '联系我',
  contactIntro: '欢迎通过邮件与我交流。',
} as const;

export type Profile = typeof profile;