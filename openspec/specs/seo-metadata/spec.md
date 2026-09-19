# seo-metadata Specification

## Purpose
为个人品牌站建立可被搜索引擎和社交平台理解的静态身份信息，包括页面摘要、社交分享预览、Person 结构化数据和公开抓取策略。

## Requirements

### Requirement: Basic page metadata

系统 SHALL 在 HTML 文档中提供准确的页面标题、中文 description、author、canonical URL 和适合个人品牌站的语言标识；标题和摘要 SHALL 反映“小飞侠/天马行空”的个人品牌内容，而不是 scaffold 默认文本。

#### Scenario: Search engine reads page metadata

- **GIVEN** 搜索引擎抓取站点首页 HTML
- **WHEN** 解析 document head
- **THEN** 搜索引擎可以读取个人品牌标题、中文摘要、作者信息和 canonical URL

#### Scenario: Metadata remains valid on GitHub Pages

- **GIVEN** 站点部署在 `/my-website/` base path
- **WHEN** 浏览器或爬虫访问首页
- **THEN** canonical、资源和页面语言信息不指向 Vite scaffold 或错误的站点路径

### Requirement: Social identity metadata

系统 SHALL 提供 Open Graph 和 Twitter Card 元数据，包括可替换的标题、描述、URL、站点类型和社交预览图路径；系统 SHALL 提供描述“小飞侠”个人身份的 `Person` JSON-LD 结构化数据，profile URL 字段可替换。

#### Scenario: Social platform generates a preview

- **GIVEN** 用户在支持 Open Graph 或 Twitter Card 的平台分享首页
- **WHEN** 平台读取 HTML head
- **THEN** 分享预览使用个人品牌标题、简介、预览图和站点 URL

#### Scenario: Optional profile links are absent

- **GIVEN** 维护者尚未填写具体社交平台 profile URL
- **WHEN** 搜索引擎解析 Person JSON-LD
- **THEN** 结构化数据仍是有效 JSON，缺少的 profile URL 不导致页面运行时错误或虚假链接

### Requirement: Semantic HTML and crawl policy

系统 SHALL 使用语义化 HTML 组织主要页面内容，确保页面具有单一清晰的主标题、合理的 Section 标题层级、`main`/`nav`/`section` 等语义容器和可访问标签；站点 SHALL 提供 `public/robots.txt`，允许 Google 等搜索引擎抓取并声明可替换的 sitemap URL。

#### Scenario: Crawler is allowed to index

- **GIVEN** Googlebot 请求 `/robots.txt`
- **WHEN** 服务器返回抓取规则
- **THEN** 规则允许站点公开页面被抓取，并提供 sitemap 位置提示

#### Scenario: Semantic audit preserves visual behavior

- **GIVEN** 用户访问完成语义化审查后的页面
- **WHEN** 页面渲染和交互
- **THEN** Hero、导航、项目、关于我和联系我的视觉布局及既有交互保持可用
