# Design

## Context

当前 `App.tsx` 的页面顺序为 Hero、项目展示和联系我，尚无关于我区域。项目已采用 React 函数组件、Tailwind CSS v4、`.dark` 主题类和本地静态资源；实现应保持这些约束，不添加联系表单或后端能力。

## Goals / Non-Goals

**Goals:**

- 新增独立的 `AboutSection.tsx`，在项目展示区后渲染并在联系我区域前结束。
- 使用本地云彩照片资源、语义化标题、简介和品牌标签构成可访问内容。
- 使用 Tailwind responsive grid/flex、亮暗主题变体和 `loading="lazy"` 实现稳定布局。
- 为图片加载失败保留不影响文字内容的后备状态，并记录图片来源以便替换和维护。

**Non-Goals:**

- 不实现联系表单、提交动作、后端 API、独立关于页或复杂图片画廊。
- 不新增导航菜单入口或客户端路由，除非后续变更明确提出。

## Decisions

### 独立 Section 组件

使用 `AboutSection.tsx` 保持与 `Hero`、`ProjectsSection`、`ContactSection` 的组件命名和组合方式一致。通过 `App.tsx` 调整渲染顺序，不把关于我内容堆积进现有项目组件。

### 本地化 Unsplash 图片

采用 Unsplash 的公开免费云彩照片作为来源候选（例如“Dramatic clouds with sunlight breaking through”），在实现阶段保存到 `src/assets/about/` 并在资源说明中记录来源页面。使用本地资源而非运行时远程 URL，降低外部网络失败和 GitHub Pages 依赖风险。

### 原生图片后备

使用 `img` 的 `loading="lazy"`、有意义 `alt` 和轻量 `onError` 状态后备。这样图片失效时不会隐藏右侧简介或品牌标签；不引入图片组件库。

### 响应式顺序与主题

桌面端使用左右两列，移动端通过 Tailwind breakpoint 变为单列，默认先显示图片再显示文字。背景、文字、边框使用 `dark:` 变体，沿用现有主题切换机制。

## Risks / Trade-offs

- [Unsplash 图片授权或链接变化] → 记录来源页面并将图片保存为本地资源，后续可替换；不依赖远程 URL 运行。
- [图片文件影响包体积] → 选择压缩后的适中尺寸，并保持非首屏 `loading="lazy"`。
- [图片失败导致视觉空洞] → 保留带替代文本的图片容器后备，不影响简介和品牌标签。
- [窄屏内容顺序不符合预期] → 在移动视口手动验证图片、简介、标签的阅读顺序。

## Migration Plan

1. 获取并保存云彩图片及来源说明，新增 `AboutSection.tsx`。
2. 更新 `App.tsx`，将 About Section 插入项目区和联系我区之间。
3. 运行 lint/build，验证亮暗主题、窄屏布局、图片 lazy loading 和图片失败后备。
4. 若需回滚，移除 About Section 组件和资源，并恢复原有页面组合顺序。
