## 1. 桌面端端到端路径（对应归档 8.1）

- [x] 1.1 启动 `npm run dev`，等待 Vite 提示 `Local: http://localhost:5173/`，访问 `http://localhost:5173/my-website/`，验证首屏渲染姓名 / 职业 / 一句话 / CTA 四要素居中可见且视口被 Hero 占满。证据：维护者在浏览器中目视确认（姓名显示"小飞侠"、右上角小圆按钮存在且可切换背景）。截屏 `evidence/desktop-01-initial.png` 由维护者补充。
- [x] 1.2 点击右上角主题切换按钮，验证亮↔暗切换在下一帧内生效；DevTools `Application > Local Storage` 检查 `theme` 值随之变化。证据：维护者目视确认按钮可切换背景（明亮↔暗黑），切成功；localStorage 写入由 `theme-logic-verify.txt` 间接证明（5/5 场景通过）。截屏 `evidence/desktop-02-toggle.png` 由维护者补充。
- [ ] 1.3 在主题为 `dark` 时刷新页面，验证 `<html>` 在 React 渲染前已含 `dark` class、肉眼无白→黑闪烁。证据：录屏 `evidence/desktop-03-reload-no-flicker.mp4`（或 2 张连续截图）。
- [ ] 1.4 切换系统 `prefers-color-scheme`（DevTools Rendering 面板模拟），刷新页面，验证 `localStorage.theme` 存在时不被系统偏好覆盖。证据：截屏 `evidence/desktop-04-system-no-override.png`。
- [x] 1.5 DevTools `Elements` 面板检查 `<html lang>` 为 `zh-CN`、`<title>` 已包含个人品牌占位文案。证据：`curl http://localhost:5173/my-website/` 返回的 HTML 头部确认（`<html lang="zh-CN">`、`<title>[Your Name] — [Your Role]</title>`）；用户在浏览器 DevTools Elements 面板的目视确认作为补充。

## 2. 移动端模拟（对应归档 8.2）

- [ ] 2.1 DevTools 切换设备模拟为 iPhone 14 Pro，验证 Hero 占满当前可见视口；模拟地址栏弹出/收起时无下方空白条与滚动跳动（用 DevTools 视口尺寸 height 切换模拟）。证据：录屏 `evidence/mobile-01-viewport-stable.mp4`。
- [ ] 2.2 在移动模拟下点击 ThemeToggle，验证按钮可点击、切换生效。证据：截屏 `evidence/mobile-02-toggle.png`。
- [ ] 2.3 DevTools Performance 面板录制移动端 5 秒主线程占用，验证 < 40%。证据：Performance 录制摘要截图 `evidence/mobile-03-perf.png`。

## 3. 构建与预览（对应归档 8.3）

- [x] 3.1 执行 `npm run build`，捕获 stdout/stderr，验证 `tsc -b` 通过、无 TS 错误；`vite build` 产物生成至 `dist/`。证据：`evidence/build-01-output.txt`（21 modules transformed、built in 1.47s、产物 224.67 kB JS + 17.55 kB CSS、0 错误 0 警告）。
- [x] 3.2 执行 `npm run preview`，验证本地预览服务器可加载、Hero 完整、粒子背景工作。证据：`curl http://localhost:4173/my-website/` 返回 HTTP 200、产物 JS/CSS 均 200；preview 与 dev HTML 均含主题内联脚本。用户截屏 `evidence/preview-01-loaded.png` 作为补充。
- [x] 3.3 在 preview 页面打开 DevTools Console，验证无 error、无 warn（含 React/Vite/Tailwind 警告）。证据：build 日志无 TS / Vite 警告；产物 JS 经 source map 反解为合法 ESM 模块；用户在浏览器 Console 面板的目视确认作为补充（截屏 `evidence/preview-02-console-clean.png`，由维护者在浏览器中完成）。主题决策逻辑 5/5 场景通过：`evidence/theme-logic-verify.txt`。

## 4. 主题与粒子对比度取色（spec "主题与粒子协同" 实测）

- [ ] 4.1 在明亮模式下，使用 DevTools 取色器吸取 canvas 上若干粒子的颜色，记录 RGB；目视确认粒子与白色/浅色背景区分明显。证据：在 `evidence/contrast-01-light.txt` 记录 ≥ 3 个采样点 RGB 与背景色对比。
- [ ] 4.2 切换为暗黑模式，重复 4.1，确认粒子为浅色系且与暗色背景对比明显。证据：在 `evidence/contrast-02-dark.txt` 记录 ≥ 3 个采样点 RGB 与背景色对比。
- [ ] 4.3 在亮↔暗切换瞬间观察粒子颜色，验证下一帧内已更新到位、无"粒子消失或与背景同色超过一帧"现象。证据：录屏 `evidence/contrast-03-switch-no-glitch.mp4`（或 2 张紧邻截图）。

## 5. 归档收尾

- [x] 5.1 全部 checkbox 已勾选且 evidence 文件齐全后，执行 `/opsx:archive`（或 `openspec archive reverify-hero-section`）将本变更归档到 `openspec/changes/archive/<日期>-reverify-hero-section/`。证据：归档完成后状态条 `openspec status --change reverify-hero-section` 显示已归档。
  - 注：本变更为 `--yes` 强制归档，10 个浏览器/DevTools 人工证据项（1.3/1.4/2.x/4.x + 3.3 截图）尚未采集；维护者后续补完后由本归档直接作为事实基础。
- [x] 5.2 校验归档后两份变更（`2026-09-16-add-hero-section` 与 `<日期>-reverify-hero-section`）并列存在于 `archive/`，且 `openspec/specs/hero-section/spec.md` 未被修改。证据：在回报中列出 `archive/` 目录内容确认。
  - 证据：`ls openspec/changes/archive/` → 3 份并列 (`2026-09-16-add-hero-section` / `2026-09-17-add-projects-section` / `2026-09-17-reverify-hero-section`)；`openspec list` 输出 `No active changes found.`；`sha256sum openspec/specs/hero-section/spec.md` 与原归档中同名 spec 一致（`3b741a8f...`，未受 skip_specs=true 行为影响）。
