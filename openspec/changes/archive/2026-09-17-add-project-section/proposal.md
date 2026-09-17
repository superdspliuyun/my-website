# add-project-section — Proposal

## Why

个人品牌站的 Projects 区块（projects-section spec）已实现项目卡片的基础渲染（标题 / 简介 / 标签 / 通用 href 链接），但当前缺少两个对项目展示至关重要的维度：**项目截图**（提升视觉吸引力与点击转化）与**GitHub 链接**（作为开发者作品集的核心锚点）。本变更在不改 projects-section 既有 REQUIREMENTS 的前提下，增补这两个字段需求与对应渲染规则，使卡片承载更完整的项目信息。

注意：当前 `Projects` 区块已由 `add-projects-section` 变更（已于 2026-09-17 归档）交付，本变更以"在 projects-section 基础上扩展"为定位，**不重建区块骨架**，仅增字段、扩组件、补数据占位。

## What Changes

- 在 `src/data/projects.ts` 的 `Project` 接口中追加两个字段：`screenshot`（项目截图 URL 或占位路径）与 `githubUrl`（GitHub 仓库 URL）；保留既有 `href` 字段作为"演示/总入口"链接，不强制合并。
- 在 `src/components/ProjectCard.tsx` 中按字段是否为空决定渲染：screenshot 非空时在卡片顶部追加 16:9 缩略图（`loading="lazy"` + 主题感知边框）；githubUrl 非空时在卡片底部追加一个 GitHub 图标链接按钮（`target="_blank"` + `rel="noopener noreferrer"` + 显式 `aria-label`）。
- 既有 `href` 字段的语义保持不变：仍为卡片整体的可点击链接目标，控制卡片整体跳转行为；GitHub 链接与整体链接并存，互不取代（spec 显式区分"项目主页"与"GitHub 仓库"两个独立入口）。
- 现有 4 条项目数据新增对应字段占位（screenshot 用 `/projects/[占位].svg` 内联占位图，githubUrl 用 `https://github.com/[username]/[repo]` 形式的方括号占位）。
- Hero 区块的 CTA 按钮锚点无需修改 —— 当前 `profile.ctaHref = '#projects'`（Hero.tsx:53）已正确指向 Projects 区块 `id="projects"`（Projects.tsx:17）。
- 既有 Nav "项目"链接（`href="#projects"`，Navigation.tsx:52）继续工作。

## Capabilities

### New Capabilities

无。本变更**仅扩展**既有 `projects-section` 能力，不引入新能力。

### Modified Capabilities

- `projects-section`: 在 `Project` 数据接口上增 `screenshot` / `githubUrl` 两个字段的 REQUIREMENTS（ProjectCard 内容、href 缺失兜底、字段缺失兜底、键盘可达等既有 REQUIREMENTS 不变）；新增一个独立的 Requirement 描述项目截图与 GitHub 链接的渲染与兜底规则。

## Impact

- **新增/改动组件**：`src/components/ProjectCard.tsx` 增 screenshot 与 githubUrl 渲染分支（既有 title / description / tags / href 分支保留不动）；其余组件（Hero / Projects / App / Navigation / ThemeToggle）**不变**。
- **改动数据**：`src/data/projects.ts` 的 `Project` 接口与 4 条数据均增字段。维护者后续填入真实截图 URL 与 GitHub 仓库 URL 即可生效。
- **既有功能**：
  - Hero CTA（`#projects`）继续工作，无需改动。
  - 现有 ProjectCard 的 href 外部链接新标签页打开、空 href 降级为不可点击卡片、键盘焦点环、主题 token 等行为**完全保留**。
  - 既有 4 条数据中"空 href 降级演示"那条（第 4 条）继续工作。
- **性能影响**：screenshot 加载使用 `loading="lazy"`，首屏不阻塞；GitHub 链接是纯文本按钮，无网络请求增量。
- **无障碍**：GitHub 链接提供显式 `aria-label="在 GitHub 上查看 {title}"`；screenshot 提供 `alt`（占位图用 `alt="{title} 项目截图"`）。
- **依赖**：无新增 / 无变更。
- **部署**：无；行为属前端 UI 层增强。

## Out-of-Scope（严禁开发）

为避免范围蔓延，本变更明确不做以下事项；任何后续需求请另立 OpenSpec change：

1. **不做项目详情页**：点击截图 / GitHub 链接均只跳转外部，不在站内新建 `/projects/[slug]` 路由或详情区块。
2. **不做项目搜索**：Projects 区块不提供搜索框、标签筛选、按标签/标题过滤、排序等能力。
3. 不做截图轮播 / 多图画廊 —— 每张卡片只展示 1 张截图占位。
4. 不做项目分类 / 标签云 / "查看更多"分页。
5. 不做悬停时的截图切换 / 视频预览 / 动态 GIF 等动效扩展（hover 仍仅现有 "上浮 + 边框色变" 微特效）。
6. 不动 projects-section 既有 5 个 REQUIREMENTS 的语义（区块展示 / ProjectCard 内容 / 卡片跳转 / 主题适配 / 响应式布局），仅做字段增补。