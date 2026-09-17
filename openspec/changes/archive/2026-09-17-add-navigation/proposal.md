# add-navigation — Proposal

## Why

个人品牌站目前只有 Hero 与 Projects 两个区块，访客若想从 Projects 回到顶部、或跳到任意区块，只能靠浏览器滚动，缺乏稳定的"页面骨架"导航入口。同时项目既无 contact 区块也无联系渠道，缺少一个"联系维护者"的明确触点。本变更在首页顶部新增一个固定导航栏，并在 Projects 之后新增一个 contact 区块占位，使访客可在任意滚动位置快速跳转，且维护者未来可平滑扩展联系信息。

## What Changes

- 新增 `<Navigation />` 组件：在 `<App />` 最外层、Hero 之前渲染，使用 `fixed`/`sticky` 固定在视口顶部；左侧展示 `profile.name`（作为 logo/品牌名），右侧展示三个站内锚点链接（首页 / 项目 / 联系我）。
- 新增 `<Contact />` 区块：在 Projects 之后渲染，根元素 `id="contact"`，含邮箱占位与一段简介文案。
- 给 `<Hero />` 根 `<section>` 增加 `id="hero"`（仅属性层面补全，不改 spec REQUIREMENTS），让导航"首页"链接有可靠锚点目标。
- 全局启用平滑滚动（`html { scroll-behavior: smooth }` 或 CSS 同等机制），同时尊重 `prefers-reduced-motion: reduce`。
- 导航栏背景使用 `bg-background/70` + `backdrop-blur`，在两种主题下与下方内容均能区分；焦点环使用 `focus-visible:ring-2 focus-visible:ring-accent`。
- 主题切换按钮的位置：保留在 Hero 右上角（已存在），不再纳入 Nav，避免重复。

## Capabilities

### New Capabilities

- `navigation-section`: 顶部固定导航栏的展示与跳转行为；包含链接配置、锚点目标、平滑滚动、模糊背景、激活态、响应式与主题适配等需求。
- `contact-section`: 联系区块占位的展示；包含邮箱占位字段、文案来源单一、空字段兜底等需求。

### Modified Capabilities

无。Hero 区块新增 `id="hero"` 属于属性补全，不改变其既有 REQUIREMENTS（aria-label、内容三要素、CTA 跳转等均不变）。

## Impact

- **新增组件**：`src/components/Navigation.tsx`、`src/components/Contact.tsx`。
- **新增数据**：在 `src/data/profile.ts` 增补 `email` 字段与导航/联系文案（按现有"文案来源单一"约定）。
- **改动组件**：`src/App.tsx` 顶部追加 `<Navigation />`、在 `<Projects />` 后追加 `<Contact />`；`src/components/Hero.tsx` 根 `<section>` 增补 `id="hero"` 属性。
- **全局样式**：`src/index.css` 增补 `scroll-behavior` 与 `prefers-reduced-motion` 兜底。
- **既有功能**：
  - Hero 区块的 CTA（`href="#projects"`）继续保持原有跳转；新增的 Nav "项目" 链接与 CTA 指向同一锚点，不冲突。
  - Projects 区块不变；`id="projects"` 不被改动。
  - 主题切换按钮保留在 Hero 右上角，不纳入 Nav。
- **依赖**：无新增 / 无变更。
- **部署**：无；行为属前端 UI 层增强。
- **性能影响**：固定定位与 `backdrop-blur` 对低端 GPU 有轻微开销；Nav 体积小、首屏一并渲染，无网络请求增量。

## Out-of-Scope（严禁开发）

为避免范围蔓延，本变更明确不做以下事项；任何后续需求请另立 OpenSpec change：

1. **不做搜索**：Nav 不提供搜索框、搜索结果页或全站搜索快捷键（`Cmd/Ctrl+K`）。
2. **不做多级下拉菜单**：Nav 不出现 hover/click 展开的二级菜单；所有跳转均为平级锚点。
3. **不做用户登录与注册**：Nav 不出现登录/注册入口、用户头像、session 管理、token 持久化或任何鉴权链路。
4. 不做移动端汉堡菜单 + 抽屉切换（本期保留桌面端与移动端的极简平铺链接；抽屉模式留待后续 change）。
5. 不做 Nav 滚动监听高亮当前 section（`IntersectionObserver` 风格的 active-link 行为留待后续 change）。