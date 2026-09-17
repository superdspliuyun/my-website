## 1. profile 数据扩展（About 字段）

- [ ] 1.1 在 `src/data/profile.ts` 的 `profile` 对象中追加 `aboutPortrait` / `aboutParagraphs` / `aboutBrandTag` 三个字段（design D3）：占位字符串以方括号显式呈现，与既有约定一致；JSDoc 注释同步说明字段用途。验证：`npx tsc -b` 0 错误。 [verify: tsc -b]
- [ ] 1.2 在 `src/data/profile.ts` 中 `navLabels` 内追加 `about` 字段（design D4）：值"关于"，与既有 `home` / `projects` / `contact` 同级。验证：`grep -n 'about:' src/data/profile.ts` 命中 navLabels.about 1 处。 [verify: grep]

## 2. 照片占位 SVG 文件

- [ ] 2.1 新增 `public/about/portrait.svg`（design D2）：viewBox 4:5（`viewBox="0 0 800 1000"`），背景用 token `var(--color-border, #e2e8f0)`，居中文字 `[个人照片]`，单 `<rect>` + 单 `<text>` 极简结构。验证：`npm run dev` 访问 `http://localhost:5173/my-website/about/portrait.svg` 返回 200 + SVG 内容；文件大小 < 500 字节。 [verify: curl + 文件大小]

## 3. About 组件

- [ ] 3.1 新增 `src/components/About.tsx`：函数式组件，根元素 `<section id="about" aria-label="关于我">`，className 含 `relative w-full border-t border-border bg-background px-6 py-20`；内层 `mx-auto max-w-5xl`（与 Projects / Contact 一致）。验证：`grep -n 'id="about"\|aria-label="关于我"' src/components/About.tsx` 命中根元素属性行。 [verify: grep]
- [ ] 3.2 在 About 内增 grid 两栏布局（design D1）：`<div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">`，左照片右简介。验证：肉眼 + DevTools。 [verify: DevTools]
- [ ] 3.3 增 `aboutPortrait` 渲染分支（design D2）：`<img>` 含 `loading="lazy" decoding="async" alt="个人照片" className="aspect-[4/5] w-48 md:w-64 rounded-lg border border-border object-cover"`（照片宽度固定，4:5 比例）；`hasPortrait === false` 时不渲染 `<img>`，grid 退化为单栏。验证：临时把 `profile.aboutPortrait` 改 `''`，刷新后左照片位置不渲染 `<img>`，grid 退化为单列；恢复后回归。 [verify: 临时改 profile + 浏览器]
- [ ] 3.4 增 `aboutParagraphs` 渲染分支（design D3）：遍历 `visibleParagraphs = (aboutParagraphs ?? []).filter(p => hasContent(p))`，渲染 `<p key={i} className="text-base leading-relaxed text-muted md:text-lg">{p}</p>`，外层 `space-y-4`。验证：临时把 `profile.aboutParagraphs` 改 `['[段 1]', '', '[段 3]']`，刷新后仅渲染 2 段非空；改 `[]` 不渲染任何 `<p>`。 [verify: 临时改 + 浏览器]
- [ ] 3.5 增 `aboutBrandTag` 渲染分支（design D5）：`hasBrandTag === true` 时渲染 `<p className="mt-12 text-2xl font-semibold text-accent md:text-3xl">{aboutBrandTag}</p>`，跳出 grid 容器占满整行；空时降级为 `<p className="mt-12 text-muted">[品牌标签]</p>` 不可点击占位（spec「品牌标签缺失」Scenario）。验证：临时把 `profile.aboutBrandTag` 改 `''`，刷新后底部渲染占位文案。 [verify: 临时改 + 浏览器]
- [ ] 3.6 主题适配：所有 className 仅 token（`border-border` / `bg-background` / `text-muted` / `text-accent` / `text-foreground`）；零 `style=` 内联颜色；切主题无闪烁（由 `<html class="dark">` 全局驱动）。验证：DevTools Elements + Console 无 error/warn。 [verify: DevTools + Console]

## 4. Nav 第 4 个链接

- [ ] 4.1 修改 `src/components/Navigation.tsx`：在 `<a href="#hero">` 与 `<a href="#projects">` 之间增 `<a href="#about" className={linkClass}>{about}</a>`（design D4），从 `profile.navLabels.about` 读取文案。验证：`grep -n 'href="#about"' src/components/Navigation.tsx` 命中 1 处；Nav 内 `<a>` 元素共 5 个（品牌名 + 4 链接）。 [verify: grep + DevTools Elements]
- [ ] 4.2 验证 Nav 内 4 个 `<a>` 顺序：首页 / 关于 / 项目 / 联系我（spec「四个链接固定存在」）。验证：DevTools Elements 顺序检查。 [verify: DevTools]

## 5. App 整合

- [ ] 5.1 修改 `src/App.tsx`：import About，在 `<Hero />` 与 `<Projects />` 之间插入 `<About />`；DOM 顺序为 Nav → Hero → About → Projects → Contact。验证：`grep -n '<Navigation ' src/App.tsx` + `grep -n '<Hero ' src/App.tsx` + `grep -n '<About ' src/App.tsx` + `grep -n '<Projects ' src/App.tsx` + `grep -n '<Contact ' src/App.tsx` 五处按序排列。 [verify: grep]
- [ ] 5.2 断言性字面量一致：grep 三组字面量 —— (a) `href="#about"` 仅命中 Navigation.tsx 1 处；(b) `id="about"` 仅命中 About.tsx 1 处；(c) 其他区块（Hero / Projects / Contact）id 字面量不变。验证：grep 输出无遗漏。 [verify: grep]
- [ ] 5.3 跑 `npx tsc -b`，0 错误；`npm run build`，0 错误 0 警告；产物 JS 中 grep `aboutParagraphs` / `aboutBrandTag` / `aboutPortrait` / `id=\"about\"` / `aria-label=\"关于我\"` 确认编入。验证：build 日志 + grep。 [verify: build + grep]

## 6. 端到端验证（桌面端）

- [ ] 6.1 桌面端 Chrome 打开页面，目视检查：About 区块位于 Hero 与 Projects 之间；左照片 + 右 3 段简介 + 下品牌标签"赋范空间"；点击 Nav "关于"平滑滚动至 About 区块；URL 片段同步更新为 `#about`。验证：肉眼 + 浏览器地址栏。 [verify: 浏览器目视 + 点击]
- [ ] 6.2 主题切换：明亮 ↔ 暗黑，About 配色下一帧内到位、无闪烁；Console 无 error/warn。验证：DevTools + Console。 [verify: DevTools + Console]
- [ ] 6.3 键盘 Tab 序列：Nav 内 5 个可聚焦元素（品牌名 + 4 链接）按序 Tab；About 区块无新增可聚焦元素（照片 + 简介 + 品牌标签均非交互元素）；DevTools Accessibility 面板检查 `<section aria-label="关于我">` 暴露正确语义。验证：键盘 Tab + Accessibility。 [verify: 键盘 Tab + DevTools]

## 7. 端到端验证（移动端）

- [ ] 7.1 iPhone 14 Pro 模拟：About 区块单列堆叠（照片在上、简介在中、品牌标签在下）；Nav 4 链接在小屏下不溢出；点击 Nav "关于"平滑滚动。验证：DevTools 设备模拟。 [verify: DevTools 设备模拟]
- [ ] 7.2 打印预览：About 区块正常出现在打印输出（含照片 + 简介 + 品牌标签）；Nav 不打印。验证：DevTools print emulation。 [verify: DevTools print emulation]

## 8. 字段缺失与边界验证

- [ ] 8.1 把 `profile.aboutPortrait` 临时改为 `''`，刷新后左照片不渲染、grid 退化为单列；恢复后回归。验证：临时改 + 浏览器。 [verify: 临时改]
- [ ] 8.2 把 `profile.aboutParagraphs` 临时改为 `[]`，刷新后 About 仅显示照片 + 品牌标签，无 `<p>` 元素。验证：临时改 + 浏览器。 [verify: 临时改]
- [ ] 8.3 把 `profile.aboutBrandTag` 临时改为 `''`，刷新后底部显示 `[品牌标签]` 占位文案。验证：临时改 + 浏览器。 [verify: 临时改]
- [ ] 8.4 跑 `npm run preview`，验证本地预览服务器加载完整页面无报错；DevTools Console 无 error/warn。验证：preview + console。 [verify: preview + console]

## 9. 归档收尾

- [ ] 9.1 执行 `openspec validate add-about-section`，验证变更零问题。验证：validate 输出 PASSED。 [verify: validate 输出]
- [ ] 9.2 执行 `openspec archive add-about-section`，把本变更归档到 `openspec/changes/archive/<日期>-add-about-section/`；归档同时自动合并 delta —— `about-section`（new capability）新建 `openspec/specs/about-section/spec.md`，`navigation-section`（modified capability）合并 delta 到 `openspec/specs/navigation-section/spec.md`。验证：`openspec list` 中本变更不在活跃列表；归档目录新增。 [verify: openspec list + ls archive/]
- [ ] 9.3 校验归档后 6 份变更（`add-hero-section` / `add-projects-section` / `reverify-hero-section` / `add-navigation` / `add-project-section` / `add-about-section`）并列存在于 `archive/`，且 main specs 含 `about-section/spec.md` + `navigation-section/spec.md`（MODIFIED 既有 + ADDED 新增）。验证：回报中列出 `archive/` + `specs/` 目录内容 + 两个 spec.md Requirement 数量。 [verify: ls + grep]