# add-about-section — Proposal

## Why

当前首页仅有 Hero / Projects / Contact 三个区块，缺少"关于我"的独立介绍。Hero 受限于首屏定位与粒子背景，仅能承载姓名 / 职业 / 一句话（spec「Hero 内容展示」三要素），无法承载更深入的个人简介与品牌身份。访客若想了解维护者本人，只能从 Projects 卡片的间接线索推断。本变更新增 About 区块，提供照片 + 3 段简介 + 品牌标签的完整自我展示，使个人品牌站具备"人物形象维度"。

## What Changes

- 新增 `<About />` 区块组件：在 `<Hero />` 之后、`<Projects />` 之前渲染；根元素 `<section id="about">`，与 Nav "关于"链接 `href="#about"` 严格一致。
- 区块结构：左侧照片（16:9 或 4:5 比例占位 SVG）、右侧 3 段个人简介文字、底部品牌标签"赋范空间"。
- 新增 `src/data/profile.ts` 字段：`aboutPortrait`（照片 URL 或站内占位路径）、`aboutParagraphs`（3 段简介 string[]）、`aboutBrandTag`（品牌标签字符串，默认"赋范空间"）。
- 新增静态资源：`public/about/portrait.svg`（个人照片占位，与 add-project-section 的 placeholder-N.svg 模式一致）。
- **Nav 增第 4 个链接**：在 `navigation-section` spec 上 ADDED 一条 Requirement 显式增 `#about` 链接（位置在"首页"与"项目"之间）。需修改既有"三个链接固定存在"Scenario 的字面措辞（从"3 个"扩展为"4 个"），不删既有 REQUIREMENTS，仅放宽扩展。
- App.tsx：JSX 顺序变为 `<Navigation /> → <Hero /> → <About /> → <Projects /> → <Contact />`。
- Hero 区块不受影响（CTA 仍指向 `#projects`，spec「Hero CTA 跳转项目」不变）。

## Capabilities

### New Capabilities

- `about-section`: About 区块的展示、字段缺失兜底、主题适配、响应式、可访问性。

### Modified Capabilities

- `navigation-section`: 既有"三个链接固定存在"Scenario 的字面措辞放宽为"四个链接固定存在"（首页 / 关于 / 项目 / 联系我），新增一条 ADDED Requirement 显式增 `#about` 链接及其位置。**这是需求驱动的放宽，不是破坏性变更**——既有链接行为、布局、a11y 全部不变，仅数量 + 1。

## Impact

- **新增组件**：`src/components/About.tsx`。
- **新增数据字段**：`src/data/profile.ts` 增 `aboutPortrait` / `aboutParagraphs` / `aboutBrandTag` 三字段；`Profile = typeof profile` 自动吸收。
- **新增静态资源**：`public/about/portrait.svg`（个人照片占位 SVG）。
- **改动组件**：`src/components/Navigation.tsx` 增第 4 个 `<a href="#about">` 链接；`src/App.tsx` 在 Hero 与 Projects 之间插入 `<About />`。
- **既有功能**：
  - Hero 区块与 Projects 区块完全不变（DOM 顺序：Hero → About → Projects，Hero 与 Projects 不相邻）。
  - 既有 Nav 三个链接行为、主题切换、平滑滚动、响应式、a11y 全部保留。
  - 既有 profile 字段（name / role / intro / email / contactTitle / navLabels）全部保留。
- **既有 spec**：`projects-section` / `contact-section` / `hero-section` 全部不变；仅 `navigation-section` 放宽 Scenario 措辞（字面"3 个" → "4 个"）并增一条 ADDED Requirement。
- **依赖**：无新增 / 无变更。
- **部署**：无；行为属前端 UI 层增强。
- **性能影响**：照片使用 `loading="lazy"`，首屏不阻塞；About 区块位于 Hero 之后，进入视口前不加载图片。

## Out-of-Scope（严禁开发）

为避免范围蔓延，本变更明确不做以下事项；任何后续需求请另立 OpenSpec change：

1. **不做联系我的表单**：About 区块仅承载自我介绍与品牌标签，不嵌入联系表单 / 留言板 / 邮件订阅 / 输入框等任何 form 元素。联系功能由既有 Contact 区块承担。
2. 不做照片轮播 / 多图画廊 / 视频背景 —— 区块内仅 1 张静态照片占位。
3. 不做社交媒体链接（Twitter / GitHub / LinkedIn 等）—— 这些链接属于既有 Contact 区块 / ProjectCard 范畴，不在 About 重复。
4. 不做技能条 / 进度条 / 时间线 —— 仅 3 段纯文字简介 + 1 条品牌标签。
5. 不做 About 区块内下载简历按钮 / PDF 链接 —— 后续若需要另立 change。
6. 不动 navigation-section 既有 REQUIREMENTS（除字面放宽 + ADDED 一条外）；既有"三个链接固定存在"Scenario 仅作措辞扩展，不重写。