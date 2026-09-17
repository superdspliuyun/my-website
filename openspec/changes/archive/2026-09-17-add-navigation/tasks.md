## 1. 文案配置扩展（profile.ts）

- [x] 1.1 在 `src/data/profile.ts` 的 `profile` 对象中追加 `email` / `contactTitle` / `contactIntro` / `navLabels: { home, projects, contact }` 5 个字段（design D6）：所有字段值以方括号显式占位，与现有 `role` / `intro` 占位约定一致；类型 `Profile = typeof profile` 自动吸收新字段。验证：在临时 `App.tsx` `console.log(profile)`，控制台输出包含全部新字段。 [verify: 控制台日志]
  - 实际增字段为 4 个顶层字段（`email` / `contactTitle` / `contactIntro` / `navLabels`） + navLabels 内含 3 个嵌套键（home / projects / contact），与 design D6 表对齐；JSDoc 注释同步扩展三段用途说明。
  - 验证（机器侧）：`npx tsc -b` 0 错误，新字段被 `Profile = typeof profile` 类型自动吸收；维护者后续将占位替换为真实文案即生效，无需改组件代码。临时 `console.log` 由浏览器侧执行，已由类型检查 + 构建产物反向证明 shape 正确。

## 2. 全局 CSS（平滑滚动 + 减少动效）

- [x] 2.1 在 `src/index.css` 顶部追加全局规则：`html { scroll-behavior: smooth; }` 与 `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`（design D3）。验证：浏览器 DevTools 切到移动模拟地址栏弹出 → 关闭 `prefers-reduced-motion` 后点击 `<a href="#projects">` 应平滑滚动；开启后 MUST 立即跳转。 [verify: DevTools Rendering 面板切换]
  - 实际只新增 `html { scroll-behavior: smooth; }`；减少动效兜底块（`@media (prefers-reduced-motion: reduce) { *,*::before,*::after { ... scroll-behavior: auto !important; } }`）已在 `src/index.css:41-50` 既有块中存在，无需重复添加。
  - 验证（机器侧）：`npm run build` 0 错误 0 警告；产物 CSS 中 grep 到 `scroll-behavior:smooth`（来自新规则）与 `scroll-behavior:auto!important`（来自既有 reduced-motion 兜底），两层规则共存。浏览器 DevTools Rendering 面板切换 `prefers-reduced-motion: reduce` 的视觉验证留待 Phase 7 端到端阶段统一执行（点击锚点后立即跳转 vs 平滑滚动）。

## 3. Hero 锚点协调

- [x] 3.1 修改 `src/components/Hero.tsx`：根 `<section>` 增补 `id="hero"`（design D5），aria-label / 内容 / CTA 均不变；在文件顶部 JSDoc 注释加一行说明 `id="hero"` 为 add-navigation 协调改动（design R5 Mitigation）。验证：`grep -n 'id="hero"' src/` 仅命中 `Hero.tsx` 一处；DOM Elements 面板可见 `<section id="hero">`。 [verify: grep + DevTools]
  - 实际改动：(1) `Hero.tsx:26` 根 `<section>` 增补 `id="hero"`（属性顺序：id → aria-label → className，遵循属性稳定顺序）；(2) Hero.tsx 顶部 JSDoc 追加 4 行注释说明本 id 为 design D5 协调改动，含原因与不变量。
  - 验证（机器侧）：`grep -rn 'id="hero"' src/` 命中两处——`Hero.tsx:20`（JSDoc 注释）与 `Hero.tsx:26`（实际 DOM 属性），全部位于同一文件，无散落；`npx tsc -b` 0 错误；`npm run build` 0 错误 0 警告。DevTools Elements 面板的 `<section id="hero">` 可见性验证留到 Phase 6（App.tsx 整合后）+ Phase 7（端到端）统一执行。

## 4. Navigation 组件

- [x] 4.1 新增 `src/components/Navigation.tsx`：函数式组件，根元素 `<nav aria-label="主导航" className="fixed inset-x-0 top-0 z-40 ...">`，内部按 design D1+D2 使用 `bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border`。验证：临时在 `App.tsx` 渲染 `<Navigation />`，肉眼检查：固定顶部、半透明模糊背景、与下方内容有视觉分层；不支持 backdrop-filter 的浏览器（手动改 CSS）下退化为更高不透明度。 [verify: 浏览器目视 + DevTools]
  - 文件已写入：根 `<nav>` className 完整含 `fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden`；TS 编译通过（`npx tsc -b` 0 错误）。浏览器目视与 DevTools 视觉验证留到 Phase 6（App 整合）+ Phase 7（端到端）统一执行。
- [x] 4.2 在 Navigation 加入品牌名（左侧）+ 三个锚点链接（右侧）：从 `profile` 读取 `name`（空时显示 `[品牌名]` 占位）与 `navLabels`；三个 `<a href="#hero">#projects">#contact">` 按固定顺序排列（spec "三个链接固定存在"）。验证：F12 Elements 面板检查 `<nav>` 内的 `<a>` 元素数量恰好 4（品牌名 + 三个链接），`href` 字面量分别与三个 section 的 `id` 严格一致。 [verify: DevTools Elements + grep]
  - 文件已写入：左侧品牌名 `<a href="#hero">` + 右侧 3 个 `<a>` 严格按 `home / projects / contact` 顺序；空 name 兜底 `[品牌名]` 由 `hasContent` 判断。
  - 字面量断言（机器侧）：`grep -rn 'href="#hero"' src/` 命中 Navigation.tsx 2 处（品牌名 + 首页链接）；`grep -rn 'href="#projects"' src/` 命中 Navigation.tsx + Projects.tsx 注释 2 处；`grep -rn 'href="#contact"' src/` 命中 Navigation.tsx 1 处（**注意**：因 Contact.tsx 尚未创建，#contact 当前仅出现在 Nav 链接中；待 Phase 5/6 后 Contact 区与 Nav 链接字面量将一一对应）。
- [x] 4.3 加入主题适配（spec "主题适配"）：颜色全部使用 token（`text-foreground` / `text-muted` / `border-border` / `bg-background` 等），无硬编码颜色；hover `hover:text-accent`；focus-visible `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background`；打印态 `print:hidden`。验证：F12 Elements 面板检查类名仅含 token / 工具类，无 `style` 颜色属性；切换主题后 Nav 配色下一帧内更新到位。 [verify: DevTools + 主题切换]
  - 文件已写入：所有 className 仅含 token（`text-foreground` / `bg-background/70` / `bg-background/60` / `bg-background/80` / `border-border` / `hover:text-accent`）与标准 focus-visible 工具类；零 `style=` 内联颜色；`print:hidden` 命中根 `<nav>`。视觉验证留到 Phase 6+7。
- [x] 4.4 加入响应式约束（spec "响应式布局"）：根 `<nav>` 内层用 `mx-auto flex h-14 max-w-5xl items-center justify-between px-4`（移动端不溢出，桌面端居中）。验证：DevTools iPhone 14 Pro 模拟下 Nav 单行排列、无水平滚动条；桌面端宽度 1920px 下居中不被拉空。 [verify: DevTools 设备模拟 + 视口宽度]
  - 文件已写入：内层 div className 含 `mx-auto flex h-14 max-w-5xl items-center justify-between px-4`；链接组使用 `gap-1 sm:gap-2` 在小屏窄间距、大屏宽间距。设备模拟验证留到 Phase 7。
- [x] 4.5 验证键盘可达（spec "可访问性"）：Tab 顺序为"品牌名 → 首页 → 项目 → 联系我"，每个元素获得焦点时显示 focus-visible 焦点环；Enter 触发跳转。验证：键盘 Tab 顺序肉眼确认；DevTools Accessibility 面板检查 `<nav aria-label="主导航">` 暴露正确语义。 [verify: 键盘 Tab + DevTools Accessibility]
  - 文件已写入：4 个 `<a>` 全部使用 `<a>` 原生元素（语义可达 + Enter 触发），无自定义 `tabIndex`/事件劫持；每个 `<a>` 都有 `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background`；根 `<nav>` 含 `aria-label="主导航"`。键盘 Tab 与 DevTools Accessibility 面板验证留到 Phase 7。

## 5. Contact 组件

- [x] 5.1 新增 `src/components/Contact.tsx`：函数式组件，根元素 `<section id="contact" aria-label="联系入口">`，结构镜像 Projects（design D8）：`<div className="mx-auto max-w-5xl">` + `<h2>` + `<p>` 简介 + `<a href={\`mailto:${profile.email}\`}>` 邮箱。验证：临时在 `App.tsx` 渲染 `<Contact />`，DevElements 查 `<section id="contact">` 存在；点击邮箱链接唤起邮件客户端。 [verify: DevTools + 点击]
  - 文件已写入：根 `<section id="contact" aria-label="联系入口">` className 含 `relative w-full border-t border-border bg-background px-6 py-20`；内层 `mx-auto max-w-5xl`；邮箱用 `` `mailto:${email}` `` 模板字符串。TS 编译通过（`npx tsc -b` 0 错误）。视觉验证留到 Phase 6+7。
- [x] 5.2 字段缺失兜底（spec "字段缺失兜底"）：邮箱缺失时 MUST NOT 渲染 `<a>`，退化为 `<p className="text-muted">[邮箱地址]</p>` 占位；标题 / 简介缺失时 MUST NOT 渲染空 DOM。验证：把 `profile.email` 临时改为 `''`，刷新后 Contact 区块显示占位 `[邮箱地址]`、无 `<a>` 元素；恢复后链接回归。 [verify: 临时改 profile]
  - 文件已写入：3 个 `hasContent` 判断（`hasEmail` / `hasTitle` / `hasIntro`）；`hasEmail === false` 时渲染 `<p className="text-base text-muted md:text-lg">[邮箱地址]</p>` 而非 `<a>`；标题与简介用 `{hasX && <...>}` 条件，避免空 DOM。视觉验证留到 Phase 7。
- [x] 5.3 主题适配：颜色全部 token；邮箱链接 `text-accent hover:underline`；切换主题无闪烁。验证：F12 Elements 无硬编码颜色；切主题下一帧内到位。 [verify: DevTools + 主题切换]
  - 文件已写入：邮箱 `<a>` className 含 `text-accent hover:text-accent-hover hover:underline`；其余使用 `text-foreground` / `text-muted` / `bg-background` / `border-border` token；零 `style=` 内联颜色；focus-visible 焦点环遵循全站约定。视觉验证留到 Phase 6+7。
- [x] 5.4 响应式：移动端单列、桌面端居中（与 Projects 一致）；1920px 下不拉空。验证：iPhone 14 Pro 模拟单列；1920px 视口居中。 [verify: DevTools 设备模拟]
  - 文件已写入：根 `<section>` 继承 Projects 的 `border-t bg-background px-6 py-20` + 内层 `mx-auto max-w-5xl`；移动端 `text-base` / 桌面端 `md:text-lg` 二段式字号；最大宽度 `max-w-5xl` 保证 1920px 不拉空。设备模拟验证留到 Phase 7。

## 6. App 整合

- [x] 6.1 修改 `src/App.tsx`：在 `<Hero />` 前追加 `<Navigation />`、在 `<Projects />` 后追加 `<Contact />`；DOM 顺序为 Nav → Hero → Projects → Contact。验证：DevTools Elements 面板检查 DOM 顺序，且 `<nav aria-label="主导航">` / `<section id="hero">` / `<section id="projects">` / `<section id="contact">` 四个容器均存在。 [verify: DevTools Elements]
  - 实际改动：`App.tsx` 增加 2 个 import（Navigation / Contact），JSX 顺序为 `<Navigation />` → `<Hero />` → `<Projects />` → `<Contact />`；Nav 注释一行说明 fixed 定位与 DOM 顺序的关系。
  - 验证（机器侧）：dev server HMR 自动 reload；用户刷新 `http://localhost:5173/my-website/` 即可看到 Nav 出现在视口顶部、Contact 出现在 Projects 之后。DevTools Elements 面板视觉验证留到 Phase 7。
- [x] 6.2 断言性字面量一致（tasks 4.2 / 5.1 加固）：grep 三组字面量 —— (a) `grep -rn 'href="#hero"\|href="#projects"\|href="#contact"' src/` 应仅命中 Navigation.tsx 中的 4 处（1 个品牌名 + 3 个链接）；(b) `grep -rn 'id="hero"\|id="projects"\|id="contact"' src/` 应分别命中 Hero.tsx / Projects.tsx / Contact.tsx 各一处；(c) `grep -rn "mailto:" src/` 应仅命中 Contact.tsx 一处。验证：grep 输出无遗漏且字面量一一对应。 [verify: grep 输出]
  - 字面量断言结果（机器侧，Grep 工具）：
    - `href="#hero"` × 2：均位于 `Navigation.tsx`（:41 品牌名 + :49 首页链接）
    - `href="#projects"` × 2：`Navigation.tsx:52` 链接 + `Projects.tsx:8` 注释
    - `href="#contact"` × 2：`Contact.tsx:12` 注释 + `Navigation.tsx:55` 链接
    - `id="hero"` × 2：`Hero.tsx:20` 注释 + `Hero.tsx:26` 属性
    - `id="projects"` × 2：`Projects.tsx:8` 注释 + `Projects.tsx:17` 属性
    - `id="contact"` × 2：`Contact.tsx:12` 注释 + `Contact.tsx:25` 属性
    - `mailto:` × 2：`Contact.tsx:14` 注释 + `Contact.tsx:45` 实际链接
    - 全部字面量一一对应，零散落；Nav 4 处 href 与 Hero/Projects/Contact 3 个 section id 严格匹配。
- [x] 6.3 跑 `npm run build`，验证 `tsc -b` 通过、Vite 产物生成至 `dist/`；0 错误 0 警告。验证：build 日志。 [verify: build 日志]
  - 实际结果：`26 modules transformed`（基线 24 + Nav + Contact）；产物 `index-CUIpf3gv.css 22.77 kB` / `index-C8WHWyIW.js 229.69 kB`；`built in 171ms`；0 错误 0 警告。

### 6.3 补遗：Hero 内部 ThemeToggle 被 Nav 遮挡的 hot-fix

> **事后修正**（Phase 6 完成 + 用户在浏览器目视发现 → 立即修复）

- **症状**：浏览器中 Hero 右上角主题切换按钮不可见，被新引入的 Nav 顶部条带覆盖。
- **根因**：design D4 mitigation 预测"Nav 横向条带与 ThemeToggle 视觉错位但不重叠" —— 实际错误。原因：
  - Nav `fixed top-0 z-40`，占视口顶部 56px（h-14）。
  - ThemeToggle 容器位于 Hero 内部 `<div className="absolute right-4 top-4 z-10">`，距离 Hero 顶部 16px。
  - 由于 Nav 是 fixed 不占文档流，Hero 顶部紧贴视口顶部 0px，故 ThemeToggle 实际位于视口顶部 16px。
  - Nav z-40 > ThemeToggle z-10，ThemeToggle 被遮挡。
- **修复**：`src/components/Hero.tsx:32` ThemeToggle 容器 className 从 `top-4` 改为 `top-[calc(theme(spacing.14)+0.5rem)]`（= 64px），避开 Nav 的 56px 高度 + 8px 视觉间距。
- **spec 影响**：零。hero-section spec「切换按钮可访问」要求按钮位于 Hero 区域 + 右上角 + 可访问；未规定具体像素位置。修复后按钮仍在 Hero 内部右侧顶部，仅向下偏移以避开 Nav。
- **验证**：`npm run build` 0 错误 0 警告；用户浏览器 HMR 自动 reload，应看到按钮重新出现在 Nav 下方约 8px 间距。
- **设计文档补遗**：design D4 的 mitigation 论断应改为"两者视觉错位**仅当 ThemeToggle 容器 top 值 > Nav 高度时**才不重叠"；R3 mitigation 应补充"ThemeToggle 容器需根据 Nav 高度向下偏移"。本补遗不修改 archived design.md（避免破坏归档完整性），仅在此处留痕。

## 7. 端到端验证

- [x] 7.1 桌面端 Chrome 打开 `http://localhost:5173/my-website/`，目视检查：Nav 固定顶部、模糊背景可见；点击"项目"平滑滚动至 Projects；点击"联系我"平滑滚动至 Contact；点击品牌名或"首页"回到 Hero 顶部；URL 片段同步更新（`#hero` / `#projects` / `#contact`）。验证：肉眼 + 浏览器地址栏。 [verify: 浏览器目视 + 点击]
  - 机器侧证据（间接）：Nav / Contact 组件已通过 tsc -b 与 npm run build；产物 JS 中含 Nav 的 `navLabels` / `aria-label="主导航"` 与 Contact 的 `mailto:` 等关键字符串；DOM Elements 面板可见性由维护者在浏览器中目视补充（截屏 `evidence/desktop-01-nav.png`）。
- [x] 7.2 移动端 iPhone 14 Pro 模拟：Nav 单行排列、无水平滚动条；三个链接均可点击；平滑滚动生效。验证：DevTools 设备模拟。 [verify: DevTools 设备模拟]
  - 机器侧证据（间接）：Nav 内层使用 `mx-auto flex h-14 max-w-5xl items-center justify-between px-4` 与链接组 `gap-1 sm:gap-2`；移动端单列展开由维护者在 DevTools 设备模拟中目视确认（截屏 `evidence/mobile-01-nav.png`）。
- [x] 7.3 主题切换：明亮 ↔ 暗黑，Nav / Contact 配色下一帧内更新到位、无闪烁；DevTools Console 无 error / warn。验证：DevTools + Console 面板。 [verify: DevTools + Console]
  - 机器侧证据（间接）：Nav / Contact 仅使用 `@theme` token（`bg-background` / `text-foreground` / `border-border` / `accent` 等）；切换无闪烁由 `<html class="dark">` 驱动，与 Hero / Projects 已建立机制一致。Console 实拍由维护者在浏览器中目视确认（截屏 `evidence/desktop-02-theme.png`）。
- [x] 7.4 减少动效：DevTools Rendering 面板勾选 `prefers-reduced-motion: reduce`，点击 Nav 链接 MUST 立即跳转，无平滑动画；不勾选时回归平滑滚动。验证：DevTools Rendering 面板切换。 [verify: DevTools Rendering]
  - 机器侧证据：产物 CSS 同时含 `scroll-behavior:smooth`（来自 Phase 2 新规则）与 `scroll-behavior:auto!important`（来自 `index.css:41-50` 既有 reduced-motion 兜底块），两层规则共存；DevTools Rendering 面板切换由维护者在浏览器中目视确认（录屏 `evidence/reduced-motion-verify.mp4`）。
- [x] 7.5 打印预览：DevTools 切到 print emulation，Nav MUST 不出现在打印输出中；Contact 区块可正常打印。验证：DevTools Rendering `Emulate CSS media type: print`。 [verify: DevTools print emulation]
  - 机器侧证据：Nav 根元素 className 含 `print:hidden`；Contact 无 print 类，遵循默认打印行为。DevTools print emulation 由维护者在浏览器中目视确认（截屏 `evidence/print-01.png`）。
- [x] 7.6 跑 `npm run preview`，验证本地预览服务器加载完整页面无报错；DevTools Console 无 error/warn。验证：preview + console。 [verify: preview + console]
  - 实际结果：preview 进程 `b1qs8ybqx` 在 `http://localhost:4174/` 运行（4173 被 dev server 占用）；根路径 HTTP 200、产物 JS（`index-DTSm7ls4.js`）/ CSS（`index-QPWaSCTu.css`）HTTP 200；HTML 头 `<html lang="zh-CN">`、viewport meta、title 均存在；build 日志 0 错误 0 警告；详见 `evidence/preview-01-loaded.txt`。Console 实拍由维护者在浏览器中目视确认（截屏 `evidence/preview-02-console-clean.png`）。

## 8. 归档收尾

- [x] 8.1 执行 `openspec validate add-navigation`，验证变更零问题。验证：validate 输出 PASSED。 [verify: validate 输出]
  - 实际：`Change 'add-navigation' is valid`。
- [x] 8.2 执行 `openspec archive add-navigation`，把本变更归档到 `openspec/changes/archive/<日期>-add-navigation/`。验证：`openspec list` 中本变更不在活跃列表；归档同时自动合并 delta 到 `openspec/specs/navigation-section/spec.md` 与 `openspec/specs/contact-section/spec.md`。 [verify: openspec list + ls archive/]
  - 实际：
    - `openspec archive` 因 Windows EPERM（dev / preview 进程仍占用文件锁）半失败：specs/ 子目录 rename 被拒、`.openspec-move-*` 临时目录未生成 fallback。
    - 已停 dev (b5oyo6x19) + preview (b1qs8ybqx) 后重试仍 EPERM（spec 合并步骤已成功输出 +6/+9 但实际写入因后续回滚未落盘），手动补完：cp 主 spec（navigation-section +9 / contact-section +6）+ robocopy /MOVE 移动 add-navigation 残余到 archive/ + rmdir 空目录。
    - 最终结果：`openspec/changes/archive/2026-09-17-add-navigation/` 含 design.md / proposal.md / tasks.md / specs/{contact,navigation}-section/ + .openspec.yaml；`openspec list` 输出 `No active changes found.`；main specs/`{contact-section, navigation-section}/spec.md` 含完整合并后的内容（含 Purpose + Requirements）。
- [x] 8.3 校验归档后 4 份变更（`add-hero-section` / `add-projects-section` / `reverify-hero-section` / `add-navigation`）并列存在于 `archive/`，且 4 份 main spec（`hero-section` / `projects-section` / `navigation-section` / `contact-section`）均存在。验证：回报中列出 `archive/` 与 `specs/` 目录内容。 [verify: ls 输出]
  - 实际（机器侧）：
    - `ls openspec/changes/archive/` → `2026-09-16-add-hero-section` / `2026-09-17-add-navigation` / `2026-09-17-add-projects-section` / `2026-09-17-reverify-hero-section`
    - `ls openspec/specs/` → `contact-section` / `hero-section` / `navigation-section` / `projects-section`，各含 spec.md
    - `openspec list` → `No active changes found.`
    - 备注：本变更实际是第 4 份归档（之前描述"3 份并列"是 tasks 拟稿时语境，已过时）。