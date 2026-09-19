# Design

## Context

当前 `ProjectsSection.tsx` 只包含一个占位文案，`App.tsx` 已将它放在 Hero 下方，Hero CTA 已使用 `#projects` 锚点。实现需要保留现有导航、主题切换、粒子背景和联系我 Section，不引入后端或新的 runtime dependency。

## Goals / Non-Goals

**Goals:**

- 将项目占位区升级为至少四个项目卡片，并把项目内容集中在可替换的静态数据结构中。
- 为每张卡片提供本地可替换截图、中文名称和简介、Github 链接及键盘可访问性。
- 使用 Tailwind responsive grid、暗色变体和轻量 hover shadow/transform 构建卡片视觉。
- 对项目截图使用 `loading="lazy"`，并为截图失败保留不影响文本和链接的后备布局。

**Non-Goals:**

- 不建立项目详情页、路由、搜索、筛选、排序或数据管理 API。
- 不为卡片添加持续动画；hover 反馈仅限短促的 CSS 视觉状态，并尊重 reduced-motion。

## Decisions

### 静态数据与展示组件分离

将四条示例项目记录定义为 TypeScript 静态数据，卡片组件通过 `map` 渲染。这样替换名称、简介、截图或 Github URL 时不需要改动布局；备选是把内容直接写在 JSX 中，但会增加重复并降低可维护性。

### 使用本地占位 SVG/图片资源

项目截图采用 `src/assets/projects/` 下可替换的静态资源，避免依赖不稳定的远程图片服务，并兼容 GitHub Pages 的资源打包。每张图片设置 `loading="lazy"` 和有意义的 `alt`；备选远程 URL 会增加网络失败和部署不可控因素。

### 原生 Github 链接

卡片使用普通 `<a>` 链接指向 Github 仓库，不引入路由或 API；链接使用明确的可访问文本和 `target="_blank"`/`rel="noreferrer"` 的安全组合（若采用新标签打开）。

### Tailwind hover 与 reduced-motion

使用 `transition`、`hover:-translate-y-*` 或阴影增强卡片反馈，并通过 `motion-reduce:transition-none` 与 `motion-reduce:hover:transform-none` 限制运动。这样不新增 JS 状态，也能让 reduced-motion 用户保留内容访问。

### CTA 复用现有锚点

保持 Hero CTA 的 `href="#projects"` 不变，通过新的项目展示区实现真实目标；不新增事件处理器或客户端路由，确保现有导航和 GitHub Pages base path 兼容。

## Risks / Trade-offs

- [示例项目链接可能不是用户真实仓库] → 在数据结构和卡片文案中明确示例性质，并集中放置以便替换。
- [截图资源增加打包体积] → 使用轻量本地占位图、`loading="lazy"`，避免首屏下载非必要图片。
- [hover 位移造成布局跳动] → 使用有限 transform 和卡片容器空间，移动设备仅呈现静态卡片。
- [外部 Github 链接失效] → 链接失效不影响项目名称、简介和页面导航；后续可单独更新数据。

## Migration Plan

1. 准备四个可替换的本地示例截图资源和对应静态项目数据。
2. 重构 `ProjectsSection.tsx` 的占位文案为卡片列表，保持 `id="projects"` 和 Hero 后方位置。
3. 运行 lint/build，并验证亮暗主题、窄屏布局、图片 lazy loading、hover/reduced-motion 和 CTA 锚点。
4. 若需回滚，恢复原占位 Section 和原有 `#projects` CTA，不涉及数据迁移或部署配置。
