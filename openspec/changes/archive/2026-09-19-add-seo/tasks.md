# Tasks

## Phase 1：静态 SEO 与社交身份 metadata

- [x] 1.1 更新 `index.html` 的 title、description、author、language、canonical 和 `/my-website/` base-aware URL；通过构建产物检查不再出现 Vite scaffold 标题
- [x] 1.2 添加 Open Graph、Twitter Card 和 `Person` JSON-LD，使用可替换的站点 URL、预览图和 profile 字段；通过 HTML 解析检查 metadata key 完整且 JSON-LD 合法
- [x] 1.3 新增 `public/robots.txt`，允许公开页面抓取并声明 `/my-website/sitemap.xml`；通过静态文件检查确认 Googlebot 不被禁止且路径正确

**Phase 1 验收条件：** 首页 head 包含基础 SEO、社交分享和 Person 身份数据，robots.txt 允许抓取且所有 URL 与 GitHub Pages base path 一致；完成后暂停并等待用户确认。

## Phase 2：语义化 HTML 审查与验证

- [x] 2.1 审查 `App.tsx`、导航和各 Section 的语义容器、标题层级、`aria-labelledby` 与主标题唯一性；通过源码检查确认不改变视觉布局且无重复主标题
- [x] 2.2 运行 `npm run lint`、`npm run build`，并检查构建后的 HTML 中 title/description/Open Graph/Twitter/JSON-LD/robots 引用；验证现有 Hero、项目、关于我、导航和联系我功能未受影响

**Phase 2 验收条件：** 语义结构清晰、SEO 静态内容可验证、构建与 lint 通过，并保持现有页面功能；完成后暂停并等待用户确认。
