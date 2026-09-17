/**
 * 项目数据集中点（design D3：与 profile.ts 单文案源模式对齐）。
 * 占位字符串以方括号显式呈现，避免误读为已交付内容；
 * 由维护者替换最终值后即可在 Projects 区块生效，无需改动组件代码。
 *
 * 字段：
 *   - title：项目标题（一级文字）
 *   - description：一句话简介
 *   - tags：标签列表（每条短文字）
 *   - href：外部链接（http(s) 开头）或站内锚点；空字符串降级为不可点击卡片
 *   - screenshot（add-project-section 增补）：项目截图 URL 或站内占位路径；空字符串不渲染 <img>
 *   - githubUrl（add-project-section 增补）：GitHub 仓库 URL；非 http(s) 开头的值会被校验拒绝，等同缺失
 */
export interface Project {
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
  screenshot?: string;
  githubUrl?: string;
}

export const projects: readonly Project[] = [
  {
    title: '[项目 1 标题]',
    description: '[一句话简介 — 介绍这个项目做了什么、解决了什么问题]',
    tags: ['[标签]', '[标签]'],
    href: 'https://example.com/project-1',
    screenshot: '/projects/placeholder-1.svg',
    githubUrl: 'https://github.com/[username]/[repo-1]',
  },
  {
    title: '[项目 2 标题]',
    description: '[一句话简介]',
    tags: ['[标签]', '[标签]', '[标签]'],
    href: 'https://example.com/project-2',
    screenshot: '/projects/placeholder-2.svg',
    githubUrl: 'https://github.com/[username]/[repo-2]',
  },
  {
    title: '[项目 3 标题]',
    description: '[一句话简介]',
    tags: ['[标签]'],
    href: 'https://example.com/project-3',
    screenshot: '/projects/placeholder-3.svg',
    githubUrl: 'https://github.com/[username]/[repo-3]',
  },
  {
    title: '[项目 4 标题]',
    description: '[一句话简介 — 演示空 href 降级为不可点击卡片]',
    tags: ['[标签]'],
    href: '',
    screenshot: '/projects/placeholder-4.svg',
    githubUrl: 'https://github.com/[username]/[repo-4]',
  },
];
