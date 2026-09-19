# Proposal

## Why

当前个人品牌站已有 Hero、项目展示和联系我区域，但缺少能直接表达个人气质与品牌记忆点的“关于我”内容。新增关于我区域可以在项目内容之后补充个人简介、视觉形象和品牌标签，同时保持单页浏览体验。

## What Changes

- 在项目展示区之后、联系我区域之前新增“关于我” Section。
- 左侧展示一张来自 Unsplash 的帅气云彩照片，作为个人视觉形象占位素材；图片将保存为项目本地资源，便于后续替换。
- 右侧展示个人简介：“自由、洒脱、奔放”。
- 在简介下方展示品牌标签：“云卷云舒”。
- 提供稳定的 `#about` 锚点，并为亮色/暗色主题和窄屏布局提供适配。
- 图片使用非首屏资源的 lazy loading，并保留图片加载失败时的文本后备。

### Out of scope

- 不做联系我的表单。
- 不新增后端 API、用户登录注册或数据管理。
- 不做关于我详情页、独立路由或复杂编辑后台。

## Capabilities

### New Capabilities

- `about-section`: 提供关于我区域、云彩视觉素材、个人简介、品牌标签及响应式可访问布局。

### Modified Capabilities

- 无。现有 Hero、项目展示、导航和联系我需求保持不变；导航是否新增“关于我”入口不在本次请求中扩展。

## Impact

- 影响 `src/App.tsx` 的 Section 组合，并新增关于我组件和本地图片资源。
- 不引入新的 runtime dependency；继续使用 React、TypeScript 和 Tailwind CSS v4。
- 云彩照片来源记录为 Unsplash 的免费图片页面，采用本地静态资源并使用 `loading="lazy"`，避免远程运行时依赖和首屏性能影响。
- 不改变 GitHub Pages `/my-website/` base path、现有项目 CTA、导航行为或联系我占位区域。
