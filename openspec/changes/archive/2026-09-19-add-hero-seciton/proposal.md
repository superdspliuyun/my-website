# Proposal

## Why

当前个人品牌站仅显示基础占位内容，无法清晰传达站点所有者的身份与定位。新增 Hero Section 可在首屏展示“小飞侠”的个人信息，并建立统一的科技感视觉与主题切换入口。

## What Changes

- 新增全屏高度、内容居中的 Hero Section，展示姓名“小飞侠”、职业“天马行空”及介绍文案“喜欢漫无边际去追逐梦的背影”。
- 新增跳转到项目区域的 CTA 按钮。
- 新增 CSS 渐变背景与 Canvas 粒子叠加层；粒子仅允许缓慢动态运动，不添加内容入场、悬浮或滚动动画。
- 新增亮色/暗色主题切换，并持久化用户选择。

## Out of Scope

- 不实现 Hero 内容、CTA 或页面滚动相关的动画效果。
- 不新增导航栏。
- 不实现后端 API、用户账户或远程数据服务。
- 不在本次变更中实现项目列表内容；CTA 仅指向预留的项目区域锚点。

## Capabilities

### New Capabilities

- `hero-section`: 在个人品牌站首屏展示身份信息、项目 CTA、科技感背景及可切换主题。

### Modified Capabilities

- 无。

## Impact

- 影响 `src/App.tsx`、全局 Tailwind CSS 与新增的 React 组件文件。
- Canvas 使用浏览器原生 API，不增加第三方运行时依赖或后端 API。
- 主题状态保存在浏览器本地；部署方式与 GitHub Pages 的 `/my-website/` base path 保持兼容。
- 首屏性能需控制粒子数量与绘制频率，且在用户请求减少动态效果时停用粒子运动。
