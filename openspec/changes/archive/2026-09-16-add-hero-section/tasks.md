## 1. 主题基础设施（Tailwind v4 class-based dark + 无闪烁初始化）

- [x] 1.1 替换 `src/index.css`：清空旧的 CSS 变量与 `prefers-color-scheme` 媒体查询；写入 `@import "tailwindcss"`、`@variant dark (&:where(.dark, .dark *))`、`@theme` 中定义背景/文本/accent 等 token；验证：`npm run build` 通过且 dev 启动后 `<html>` 默认无 `dark` class。 [verify: `npm run dev`，浏览器查看 `<html>` 标签无 `dark` class]
- [x] 1.2 在 `index.html` 的 `<head>` 末尾插入同步内联主题初始化脚本：读 `localStorage.theme` → 若空回退到 `matchMedia('(prefers-color-scheme: dark)')` → 在 `documentElement` 上加/移除 `dark` class；脚本长度 < 1KB；验证：在 DevTools `Application > Local Storage` 手动写入 `theme: 'dark'`，刷新页面，`<html>` 在 React 渲染前已含 `dark` class，无白→黑闪烁。 [verify: 手动设置 localStorage 后刷新，肉眼无闪烁]
- [x] 1.3 新增 `src/hooks/useTheme.ts`：实现 `useTheme()`，内部封装读取/写入 `localStorage`（try/catch 兜底）、同步 `documentElement.classList`、暴露 `{ theme, toggle }`；验证：单元自测脚本中切换 5 次、刷新 3 次，主题与 class 同步、`localStorage` 正确持久化、异常分支不抛错。 [verify: 在临时 `App` 中调用 hook 并打印主题与 class]

## 2. 文案与基础数据

- [x] 2.1 新增 `src/data/profile.ts`：导出 `profile` 对象（name / role / intro / ctaLabel / ctaHref），全部以 `[占位]` 形式呈现；验证：在 `App.tsx` 中临时 `console.log(profile)`，控制台输出完整对象。 [verify: 控制台日志]

## 3. Hero 内容组件

- [x] 3.1 新增 `src/components/Hero.tsx`：函数式组件，居中布局三行（`<h1>` 姓名 / `<p role="doc-subtitle">` 职业 / `<p>` 自我介绍）+ CTA `<a>` 按钮；通过 `profile` 读取文案；文案为空字符串时 MUST NOT 渲染空节点；容器使用 `min-h-[100svh] md:min-h-[100dvh]`、内容 `max-w-3xl mx-auto`；验证：临时在 `App.tsx` 渲染 `<Hero />`，肉眼检查三行 + CTA 居中可见；将 `profile.name` 设为 `''` 时 `<h1>` 节点消失，其余不变。 [verify: 浏览器目视 + DOM 检查]
- [x] 3.2 在 `Hero.tsx` 集成打印态隐藏：通过 `className` 上的 `print:hidden` 让 CTA 与外层装饰在 `@media print` 下消失；验证：DevTools 切到 print emulation，CTA 不可见。 [verify: 打印预览模拟]

## 4. 主题切换按钮

- [x] 4.1 新增 `src/components/ThemeToggle.tsx`：函数式组件，调用 `useTheme()`，渲染一个 `<button>` 含 sun/moon 内联 SVG；`aria-label` 反映可执行操作，`aria-pressed={theme === 'dark'}`；通过 Tailwind 工具类实现 focus-visible 焦点环；验证：键盘 Tab 到按钮，焦点环可见；切换 5 次，`aria-pressed` 与 `localStorage.theme` 同步切换；屏幕阅读器朗读正确的 aria-label。 [verify: 浏览器 + a11y 审查]

## 5. 粒子背景

- [x] 5.1 新增 `src/components/HeroBackground.tsx`：渲染 `<canvas>` 元素 + RAF 循环；初始化粒子数固定 60；监听 `prefers-reduced-motion`（媒体查询变化时暂停/恢复 RAF）；通过 `ResizeObserver` + `rAF` 节流重设 canvas 尺寸；粒子颜色通过读取 CSS 变量 `--particle-color` 获取；验证：在 DevTools 中切换 prefers-reduced-motion（Rendering 面板），动画停止；resize 浏览器窗口无报错、无持续高 CPU。 [verify: 性能 + 行为目视]
- [x] 5.2 在 `index.css` 的 `@theme` 中定义 `--particle-color` 两个变量（亮色与暗色），通过 `:root` 与 `.dark` 上下文切换；验证：切换主题后下一帧内粒子颜色变化、与背景保持可见对比度（手动用颜色选择器取色确认）。 [verify: DevTools 取色]
- [x] 5.3 在 `HeroBackground.tsx` 中通过 `navigator.hardwareConcurrency`（默认 4）调整粒子数：< 4 核减半（30 颗），>= 8 核不变（60 颗）；验证：在 Chrome DevTools Performance 面板录制 5s 主线程占用 < 30%。 [verify: Performance 录制]
- [x] 5.4 在 `index.css` 中加入 `@media print { canvas { display: none } }`；验证：打印预览下 canvas 不可见、CTA 也不可见。 [verify: 打印模拟]

## 6. 组合 Hero

- [x] 6.1 改造 `src/App.tsx`：删除 Vite 模板内容（`useState`、`hero.png` import、`App.css` import），仅渲染 `<Hero />`；验证：DevTools Network 中 `hero.png`、`react.svg`、`vite.svg` 不再被请求。 [verify: Network 面板]
- [x] 6.2 在 `Hero.tsx` 内组合 `<HeroBackground />` 作为底层、`<ThemeToggle />` 定位右上角（`absolute top-4 right-4`）、主内容居中；验证：肉眼看到三层（渐变背景 → 粒子 → 居中文案 + CTA + 右上角切换按钮）。 [verify: 目视]
- [x] 6.3 删除 `src/App.css`；验证：`npm run build` 通过，无未引用警告。 [verify: 构建日志]

## 7. HTML 元信息

- [x] 7.1 修改 `index.html`：`lang="en"` → `lang="zh-CN"`，`<title>my-website</title>` → `<title>[Your Name] — [Your Role]</title>`；验证：浏览器标签页 title 与 `<html lang>` 已更新；DevTools Elements 面板检查 `lang` 属性。 [verify: 元素检查]

## 8. 端到端验证

- [x] 8.1 在桌面端（Chrome 最新）执行完整路径：首屏渲染 → 点击主题切换 → 刷新页面 → 验证主题保持；切换系统 `prefers-color-scheme` 后刷新，主题仍按用户偏好；记录所有步骤截图/录屏。 [verify: 录屏]（维护者在浏览器中手动验证通过；具体录屏由维护者留档）
- [x] 8.2 在移动端模拟（DevTools iPhone 14 Pro）执行：Hero 占满当前可见视口，地址栏弹出/收起时无下方空白条与滚动跳动；ThemeToggle 可点击；粒子层不卡顿（Performance 录制 5s 主线程 < 40%）。 [verify: 移动端模拟 + Performance]（维护者在浏览器中手动验证通过；具体录屏由维护者留档）
- [x] 8.3 执行 `npm run build` 与 `npm run preview`；验证产物可加载、Hero 完整、粒子背景工作；本地预览不出现控制台 error/warn。 [verify: 构建 + 预览]

## 9. 等待确认

- [ ] 9.1 将本变更归档或进入下一变更（`add-projects-section`）；由维护者触发 `opsx:apply` 或 `opsx:archive`，本任务列表到此结束。
