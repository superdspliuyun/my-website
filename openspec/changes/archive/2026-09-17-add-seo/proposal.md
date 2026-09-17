# add-seo — Proposal

## Why

个人品牌站当前在 SEO 与社交身份支持上仅有最基础的 `<html lang="zh-CN">` 与静态占位 `<title>[Your Name] — [Your Role]</title>`（`index.html`），缺少以下关键能力：

1. **搜索引擎发现与摘要**：没有 `<meta name="description">`，Google / Bing 搜索结果展示的摘要往往由算法自动抽取，体验差；没有 `robots.txt`，爬虫行为未显式声明。
2. **社交分享卡片**：分享到 Twitter / LinkedIn / 微信 / Slack 时缺乏 og:title / og:description / og:image / twitter:card 标签，分享卡片通常显示空白或链接裸 URL，严重削弱传播效果。
3. **HTML 语义层级**：Hero 用 `<h1>`、Projects / Contact / About 用 `<h2>` 是基本合理；但代码内 heading 层级尚未系统性审查（tag 内是否嵌套 `<h3>` / `<h4>`、是否在 `<section>` 顶部有 `<h2>` 而非散落等），本阶段做一次基线审查与修正。

本变更覆盖以上三块，作为个人品牌站 SEO 的最小可交付基础。

## What Changes

- 修改 `index.html`：将静态占位 `<title>` 改为更语义化的基线（含 `[Your Name]` 与 `[Your Role]` 占位字段），并增 `<meta name="description">` / `<meta name="author">` / canonical link / OpenGraph（og:title / og:description / og:type / og:url / og:image / og:site_name）/ Twitter Card（twitter:card / twitter:title / twitter:description / twitter:image）。
- 新增 `public/robots.txt`：声明 `User-agent: Googlebot` + `Allow: /`（仅允许 Google 爬虫索引）。
- 新增 `public/og-image.svg`：社交分享卡片占位 SVG（1200×630 viewBox，与 design D3 一致）。
- 系统审查 `<h1>` / `<h2>` / `<h3>` 层级：Hero `<h1>` 维持；Projects / Contact / About 区块 `<h2>` 维持；ProjectCard 内 `<h3>`（项目标题）作为 `<h2>` 的下一级；Contact 邮箱文本不应再嵌入 heading；Anywhere 出现 `<h4>` 或更深层级需降级或删除。
- 不引入新 npm 依赖；不修改 hero-section / projects / contact / about / navigation 既有 spec（除 hero-section 一条 MODIFIED Requirement 声明"index.html 必须含 description 与 canonical"）；不修改 Vite 配置；不引入 react-helmet。

## Capabilities

### New Capabilities

- `seo-support`: SEO 与社交身份基础（title / description / canonical / og / twitter / robots.txt）。独立能力，不属于任何一个现有区块。

### Modified Capabilities

- `hero-section`: 现行趋势修改 "Scenario: 文案缺失兜底" 的相邻 Requirement，新增一条 ADDED Requirement 显式声明 `<title>` 与 `<meta name="description">` 在 `index.html` 中必须为非空、含 `[Your Name]` / `[Your Role]` / 简介占位字段。该调整保证 SEO 关键标签在 React 渲染前已正确（爬虫 / 分享爬虫只看到静态 HTML）。

## Impact

- **新增文件**：`public/robots.txt`、`public/og-image.svg`。
- **改动文件**：
  - `index.html`：增 `<meta name="description">` / author / canonical / og:* / twitter:* 共 ~12 行；title 文案基线化。
  - `src/components/Hero.tsx` / `src/components/Projects.tsx` / `src/components/Contact.tsx` / `src/components/About.tsx`（如果已合并）：heading 层级审查与修正（不改组件语义，仅微调 h1-h2-h3 嵌套）。
- **既有功能**：
  - 既有 Hero / Projects / Contact / About / Navigation / ThemeToggle 区块渲染行为、主题切换、平滑滚动全部保留。
  - 既有 `<html lang="zh-CN">` 保留。
  - 现有 favicon link（`<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`）保留（虽然 public/ 暂无 favicon.svg，但本期不动）。
- **既有 spec**：hero-section 增 1 条 ADDED Requirement；navigation-section / projects-section / contact-section / about-section 全部不变。
- **依赖**：无新增 / 无变更。
- **部署**：GitHub Pages 自动部署；robots.txt 与 og-image.svg 作为 public/ 静态资源会被 Vite 直接复制到 `dist/`。
- **SEO 影响**：本期为"最小可交付 SEO"基线——Google 索引、社交分享卡片、heading 层级均达到基本规范；后续若需要 Schema.org / sitemap / 高级 SEO 可立后续 change。

## Out-of-Scope（严禁开发）

为避免范围蔓延，本变更明确不做以下事项；任何后续需求请另立 OpenSpec change：

1. **不做 JSON-LD / Schema.org 结构化数据**（本期不含 Person schema；后续可立 change）。
2. **不做 sitemap.xml**（robots.txt 不附 Sitemap 声明）。
3. **不做多语言 / hreflang**（中文站点单语言）。
4. **不做 favicon / apple-touch-icon / mask-icon 完整 icon 套件**（保留既有 `<link rel="icon">` 但不增图标文件）。
5. **不做 SEO 性能优化**（如 critical CSS、preload 字体、图片 WebP/AVIF）—— 后续立 change。
6. **不做 OG 图片动态生成**（用占位 SVG；维护者后续可替换为真实 PNG/JPG）。
7. **不做 React 19 useEffect 动态 title**（保持纯静态 HTML；爬虫/分享爬虫只看静态部分）。
8. **不动 navigation-section / projects-section / contact-section / about-section 的既有 REQUIREMENTS**（本变更只 MODIFIED hero-section 的 ADDED Requirement）。
9. **不引入 react-helmet-async / @unhead 等元数据管理库**（无依赖原则）。