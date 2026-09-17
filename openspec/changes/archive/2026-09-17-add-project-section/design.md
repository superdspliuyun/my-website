## Context

当前 `projects-section` 已交付：`src/data/projects.ts` 定义 `Project` 接口（title / description / tags / href 四个字段）与 4 条数据；`src/components/ProjectCard.tsx` 实现卡片渲染（href 外部链接 / 站内锚点 / 空 href 降级三态）；`src/components/Projects.tsx` 渲染 2 列网格；`src/App.tsx:11` 在 `<Hero />` 与 `<Contact />` 之间挂载。Hero CTA `href="#projects"`（`profile.ctaHref` + `Hero.tsx:53`）已正确指向 Projects 区块 `id="projects"`（`Projects.tsx:17`）。

本变更在既有交付之上扩展两个字段（`screenshot` / `githubUrl`）与对应渲染分支，**不重建任何组件骨架**；卡片整体结构、Projects 区块网格、App 整合、Hero CTA 等均不变。

## Goals / Non-Goals

**Goals:**

- 在不改 projects-section 既有 5 个 REQUIREMENTS 语义的前提下，增补 `Project.screenshot` 与 `Project.githubUrl` 两个可选字段的渲染规则与兜底。
- 截图使用 `loading="lazy"` + `aspect-video` + token 化边框，与既有主题基础设施一致。
- GitHub 链接以图标按钮形式作为卡片内部独立入口，与卡片整体 `href` 并存不冲突。
- 既有数据可平滑迁移：4 条数据各增字段占位（`[占位]`），由维护者后续替换为真实 URL。

**Non-Goals:**

- 不动 projects-section 既有 REQUIREMENTS（区块展示 / ProjectCard 内容三要素 / 卡片跳转 / 主题适配 / 响应式布局）。
- 不动 Hero / Projects / Navigation / Contact / App 等其他组件。
- 不引入图标库（GitHub 图标用内联 SVG，遵循 ThemeToggle 既有约定）。
- 不引入图片优化库；图片直传 URL，浏览器原生 lazy 加载即可。
- 不做项目详情页 / 搜索 / 分类 / 标签筛选。

## Decisions

### D1：截图渲染策略 —— `loading="lazy"` + `aspect-video` + token 边框

截图 `<img>` 元素采用以下属性 / 类名：

```tsx
<img
  src={project.screenshot}
  alt={hasTitle ? `${title} 项目截图` : '项目截图'}
  loading="lazy"
  decoding="async"
  className="mb-4 aspect-video w-full rounded-md border border-border object-cover"
/>
```

理由：

- `loading="lazy"` 由浏览器原生支持，零运行时开销；Projects 区块位于 Hero 之后，进入视口前不会加载图片，符合 hero-section spec「首屏可交互时间 < 2 秒」。
- `aspect-video`（Tailwind v4 内建，对应 `aspect-ratio: 16/9`）确保占位图未加载时容器已预留正确高度，避免布局跳动（CLS）。
- `object-cover` 防止拉伸变形；维护者上传任意比例截图均可适配。
- `border border-border` 主题感知边框；亮 / 暗主题自动切换。
- `decoding="async"` 异步解码，避免大图解码阻塞主线程。

被否决方案：
- IntersectionObserver + 自定义 lazy 实现 —— 过度工程；浏览器原生 lazy 已够用。
- `next/image` —— 项目用 Vite 不用 Next.js，且要引入新依赖。
- 不加 `aspect-video`，用 `h-48` 等固定高度 —— 不适配不同截图比例，会变形或留白。

### D2：GitHub 链接与卡片整体 href 的嵌套处理 —— `<div>` 包裹而非 `<a>`

HTML5 规范禁止 `<a>` 内嵌 `<a>`。当前 ProjectCard 的逻辑是：href 外部链接时整体渲染为 `<a>`，空 href 时降级为 `<div>`。新增 GitHub 链接后，若卡片整体仍为 `<a>` 且 GitHub 链接也是 `<a>`，会出现嵌套。

设计决策：

- **保留卡片整体 `<a>` 的可点击行为**：访客点击卡片"非 GitHub 区域"时跳转至 `href`。
- **GitHub 链接必须独立可点击**：点击 GitHub 图标跳转 GitHub 仓库。
- **解决嵌套冲突**：将卡片整体改为 `<div>`，内部内容（截图/简介/标题/标签）正常渲染，但**整张卡片不再响应点击**；GitHub 链接作为独立 `<a>` 保持可点击。
- **新增 `<a>` 包裹整体**：在卡片底部加一个"查看项目 →"文本链接（指向 `href`），与 GitHub 链接并排；让访客仍能从卡片上明确点击"查看项目"。

理由：

- HTML5 规范禁止 `<a>` 嵌套 `<a>`，不能用 CSS 强行绕开。
- 用户的"卡片整体可点击 + 独立 GitHub 入口"需求是冲突的，必须牺牲其中一个或都用 `<div>` + 多 `<a>` 替代。
- 用 `<div>` + 文本链接替代整体 `<a>` 是 Web 通用做法（GitHub 项目卡片、Twitter 卡片都用此模式）。

被否决方案：
- 卡片整体维持 `<a>`，GitHub 链接用 `<button>` + JS 跳转 —— `<button>` 在 `<a>` 内仍合法，但失去 URL 语义，鼠标 hover 不显示地址。
- 卡片整体维持 `<a>`，GitHub 链接用 `onClick` + `stopPropagation` 拦截 —— 非语义、易被忽略、a11y 差。

### D3：截图占位策略 —— 内联 SVG 替代外部图片文件

新增 4 条数据的 `screenshot` 字段占位。考虑到本项目使用 GitHub Pages 部署且不引入额外图片资源管理：

- 占位 URL 用 `/projects/[占位].svg`（维护者后续替换为真实 URL）。
- 占位 SVG 是一张 16:9 的浅色矩形 + 居中文案 `[项目截图占位]`；按主题切换颜色。
- 占位文件存放于 `public/projects/` 下，4 个文件：`placeholder-1.svg` ~ `placeholder-4.svg`（Vite 静态资源约定）。

被否决方案：
- 用 `<div>` + 文字作为占位（无图）—— 与 spec "MUST 渲染 `<img>` 元素" 不一致；改 spec 不划算。
- 用第三方占位图服务（如 placehold.co）—— 引入外部网络请求与跨域依赖，与"静态部署"不匹配。

### D4：GitHub 图标 —— 内联 SVG（与 ThemeToggle 一致）

GitHub 图标用内联 SVG（24×24 viewBox），不使用图标库（如 react-icons / lucide）：

```tsx
<svg xmlns="..." viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 .297c-6.63 0-12 5.373-12 12 ..." />
</svg>
```

理由：

- ThemeToggle 既有 `src/components/ThemeToggle.tsx:26-54` 已用内联 SVG 实现 sun / moon 图标，沿用同模式。
- 零依赖、零网络请求，主题切换 `currentColor` 自动跟随。

### D5：GitHub 链接视觉态 —— 图标 + "在 GitHub 上查看" 文本

GitHub 链接不仅显示图标，还显示一行简短文本 `"在 GitHub 上查看"`（spec「a2y」要求显式 aria-label）。视觉效果：

- 位置：卡片底部，标签列表之后，单独一行（左对齐）。
- 内容：左 GitHub 图标 + 右 文本（`gap-2` 间距）。
- 颜色：默认 `text-foreground hover:text-accent`；focus-visible 焦点环。

理由：

- 仅图标按钮对小屏用户不够明显；带文本的链接可访问性更佳。
- 符合 spec「显式 aria-label」要求，文本本身就是 aria-label 的可见形式。

### D6：截图 / GitHub 链接字段缺失兜底 —— 沿用 `hasContent` 模式

两个新字段的兜底统一沿用 projects-section 既有 `hasContent` 模式（ProjectCard.tsx:11-13）：

```tsx
const hasScreenshot = hasContent(project.screenshot);
const hasGithubUrl = hasContent(project.githubUrl) && /^https?:\/\//.test(project.githubUrl.trim());
```

`hasGithubUrl` 额外加 `^https?://` 校验，对应 spec「githubUrl 非法格式」Scenario。

### D7：数据迁移 —— `as const` + 类型吸收

`Project` 接口与 `projects` 数组已用 `as const`（projects.ts:19）做窄化类型。新增两字段需：

- 在 `Project` interface 增 `screenshot?: string` 与 `githubUrl?: string`（**可选**，与既有 `href: string` 形成对比；新字段允许缺失以保持向后兼容）。
- 4 条数据均增字段占位（screenshot 用 `[占位].svg`，githubUrl 用 `[username/repo]` 形式）。
- 既有 `Project = readonly Project[]` 不变；TypeScript 自动吸收新字段。

### D8：组件文件不变 —— 仅 ProjectCard 改一处

修改文件清单：

- `src/components/ProjectCard.tsx`：增 screenshot 渲染分支、GitHub 链接渲染分支；将卡片整体 `<a>` 改为 `<div>`（design D2）；保持 title / description / tags / href 既有逻辑。
- `src/data/projects.ts`：增 `screenshot` / `githubUrl` 两个字段定义 + 4 条数据占位。
- `public/projects/placeholder-1.svg` ~ `placeholder-4.svg`：4 个 16:9 占位 SVG 文件。

其他组件（Hero / Projects / Navigation / Contact / ThemeToggle / App）**完全不变**。

## Risks / Trade-offs

- [R1] 卡片整体从 `<a>` 改为 `<div>` 是**用户可感知的 UX 变化**：原本访客点击卡片任意位置均可跳转，现仅"查看项目 →"链接与 GitHub 图标可点。→ Mitigation：在卡片底部同时显式渲染"查看项目 →"文本链接（指向 `href`），与 GitHub 链接并排；让访客有明确点击目标；首屏 demo 时若用户觉得别扭，可立后续 change 重新启用整体 `<a>` + 用其他方式承载 GitHub 入口。
- [R2] 4 张占位 SVG 增加首屏总下载量约 4 × 1KB ≈ 4KB（gzip 后），加上 Projects 区块后续进入视口才加载（`loading="lazy"`），对首屏无影响。→ Mitigation：占位 SVG 极简（单 `<rect>` + 单 `<text>`），实际项目数据用真实截图 URL 后整体大小由维护者控制。
- [R3] 截图 alt 文本使用 `{title} 项目截图` 默认值，若 title 也缺失则降级为 `项目截图`。对屏幕阅读器无歧义。→ Mitigation：spec 已在「截图 alt 文案」Scenario 显式定义降级规则。
- [R4] GitHub 链接 `^https?://` 校验在前端做，但不阻止维护者填入被恶意构造的 URL（如 `"https://attacker.com/redirect?to=evil"`）；后续若用户点击可能跳到非 GitHub 域。→ Mitigation：本变更定位是作品集展示，非安全边界；真实风险由维护者配置数据时把关；如未来需要域名白名单校验，立后续 change。
- [R5] projects-section 既有 5 个 REQUIREMENTS 不变（spec「不动既有」），但 D2 将卡片整体 `<a>` 改为 `<div>` 在严格意义上偏离了既有 spec「卡片整体 MUST 作为可访问的链接元素」（projects-section spec「ProjectCard 内容与可访问性」）；新增"查看项目 →"链接恢复了"卡片有可点击元素"的语义，但与"卡片整体可点击"仍有差异。→ Mitigation：design D2 已显式说明此 trade-off；归档时如发现 spec 字面与代码冲突，可在 spec 增一个 ADDED Requirement 显式声明"卡片整体改为 `<div>`，由底部链接承载跳转"，避免 spec 与实现漂移。

## Migration Plan

本变更无运行时与部署新功能：

1. 按 tasks Phase 顺序实现；
2. 每 Phase 本地 build 校验；
3. 归档时自动合并 delta 到 `openspec/specs/projects-section/spec.md`（新增 3 个 Requirements）；
4. GitHub Pages 走现有自动部署。

回滚策略：本次变更仅新增可选字段与渲染分支；最坏情况可将 ProjectCard 改回原版（git revert 即可）。占位 SVG 文件删除不破坏既有功能。

## Open Questions

无。
- 字段空值时的"占位视觉"（截图缺失时不留白 / GitHub 缺失时不渲染）在 spec「screenshot 字段缺失」「githubUrl 字段缺失」Scenario 已显式定义。
- D2 卡片整体从 `<a>` 改 `<div>` 的 UX 变化已在 R1 Mitigation 中给出过渡方案（"查看项目 →"文本链接）；若用户实测不接受，可立后续 change 调整。