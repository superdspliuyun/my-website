# Proposal

## Why

当前站点仍使用 Vite scaffold 的页面标题，缺少搜索引擎摘要、社交分享预览和可爬取策略，且 HTML 语义结构需要一次基础审查。补充这些基础 SEO 能力，可以让个人品牌站更容易被搜索引擎理解并在社交平台分享时显示正确身份信息。

## What Changes

- 将 `index.html` 的页面标题替换为个人品牌站标题，并添加中文 `description`、`author`、canonical 和基础语言/分享元信息。
- 添加 Open Graph 和 Twitter Card 元数据，支持社交分享时展示标题、简介、站点 URL 和预览图配置。
- 添加 `Person` 结构化数据，标识“小飞侠”和“天马行空”的个人品牌身份，并保留可替换的站点 URL/社交链接字段。
- 审查并调整应用入口与主要 Section 的语义化 HTML，包括页面主区域、标题层级和可访问标签，不改变现有视觉行为。
- 在 `public/robots.txt` 添加允许 Google 等搜索引擎抓取的规则，并声明 sitemap 位置（若 sitemap 尚不存在则保留可替换路径）。
- 继续兼容 GitHub Pages `/my-website/` base path，不引入 SEO runtime dependency。

### Out of scope

- 不生成或维护完整 sitemap 内容。
- 不接入 Google Search Console、Analytics 或其他第三方统计服务。
- 不承诺搜索排名，不做关键词堆砌、付费推广或内容营销。
- 不新增登录、后端 API 或管理 SEO 元数据的后台。

## Capabilities

### New Capabilities

- `seo-metadata`: 提供页面基础元数据、Open Graph/Twitter Card、Person 结构化数据和 robots.txt 抓取策略。

### Modified Capabilities

- 无。语义化 HTML 审查属于实现质量检查，不改变现有 Hero、导航、项目或联系我需求的行为契约。

## Impact

- 影响根目录 `index.html`、新增 `public/robots.txt`，以及可能调整 `src/App.tsx` 和 Section 的语义标签。
- 需要一个可替换的站点 canonical URL 和社交预览图路径；默认按 GitHub Pages `/my-website/` 部署路径设计。
- `Person` 数据中的社交 profile URL 将使用可替换占位字段，不调用外部 API。
- 静态 SEO 资源不增加运行时依赖；robots.txt 允许爬虫但不改变应用运行逻辑。
