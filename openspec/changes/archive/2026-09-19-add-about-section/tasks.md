# Tasks

## Phase 1：关于我内容与资源

- [x] 1.1 获取并保存一张 Unsplash 云彩照片到 `src/assets/about/`，记录来源页面和替换说明；通过文件检查确认资源可被 Vite 导入且不是运行时远程依赖
- [x] 1.2 新增 `AboutSection.tsx` 函数组件，提供 `id="about"`、可访问标题、云彩照片、个人简介“自由、洒脱、奔放”和品牌标签“云卷云舒”；通过源码检查确认不包含联系表单、提交动作或后端 API
- [x] 1.3 更新 `App.tsx`，将 About Section 放置在 ProjectsSection 与 ContactSection 之间，并为图片设置 `loading="lazy"`、有意义 `alt` 和加载失败后备；通过开发服务器验证页面顺序和内容可见

**Phase 1 验收条件：** 项目区下方显示完整的关于我内容，照片、简介和品牌标签均可见，图片来源可追溯且失败时文字内容仍可用；完成后暂停并等待用户确认。

## Phase 2：响应式与主题适配

- [x] 2.1 使用 Tailwind responsive grid/flex 实现桌面左右分栏与窄屏单列布局，应用 `dark:` 主题样式并确保无水平滚动；通过开发服务器检查桌面和移动视口
- [x] 2.2 验证图片 lazy loading、替代文本、图片失败后备、键盘阅读顺序和现有 `#projects`/`#contact` 锚点不受影响；通过源码检查和手动浏览器验证边界场景
- [x] 2.3 运行 `npm run lint`、`npm run build` 和 `openspec validate add-about-section --strict`，确认无新依赖且现有 Hero、项目、导航和联系我行为保持正常

**Phase 2 验收条件：** 关于我区域在亮暗主题、桌面/移动视口和图片异常场景下均可用，所有检查命令通过；完成后暂停并等待用户确认。
