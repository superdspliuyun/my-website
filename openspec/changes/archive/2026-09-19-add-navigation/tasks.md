# Tasks

## Phase 1：导航组件与页面结构

- [x] 1.1 新增 `Navigation.tsx` 函数组件，渲染“小飞侠”品牌标识及“首页/项目/联系我”三个锚点链接；使用语义化 `nav`、可见 focus 状态和 Tailwind 亮暗主题样式，并通过静态检查验证组件无 inline style 和新依赖
- [x] 1.2 新增 `ProjectsSection.tsx` 与 `ContactSection.tsx` 最小占位组件，分别提供 `id="projects"`、`id="contact"`、中文可访问标题和明确的占位文案；通过源码检查确认不包含 API 请求、表单提交或登录逻辑
- [x] 1.3 更新 `App.tsx` 组合 Navigation、Hero、项目 Section、联系我 Section，并为页面 Section 添加固定导航所需的滚动偏移；通过开发服务器手动验证三个目标锚点均存在

**Phase 1 验收条件：** 页面显示固定导航和两个目标 Section；Hero CTA 仍能到达 `#projects`；窄屏无水平滚动；导航链接可用且焦点可见。完成后暂停并等待用户确认。

## Phase 2：滚动与视觉细节

- [x] 2.1 更新 `src/index.css` 设置默认平滑滚动及 `prefers-reduced-motion` 下的自动滚动后备；通过浏览器验证普通模式平滑滚动、减少运动模式不强制平滑动画
- [x] 2.2 为导航实现半透明背景、`backdrop-blur` 与不支持 blur 时的后备背景，并复用现有 `.dark` 主题；通过亮色/暗色切换和滚动覆盖内容检查文字对比度与导航可读性
- [x] 2.3 运行 `npm run lint` 与 `npm run build`，并验证 GitHub Pages `/my-website/` base path 下锚点链接仍为站内相对导航

**Phase 2 验收条件：** 导航视觉与主题一致，滚动定位不被固定栏遮挡，减少运动偏好生效，lint/build 均通过。完成后暂停并等待用户确认。
