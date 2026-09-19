# Tasks

## Phase 1：项目数据与卡片结构

- [x] 1.1 新增四个可替换的示例项目数据和本地项目截图资源，包含名称、简介、Github URL、截图路径及有意义的 alt 文本；通过源码检查确认数据字段完整且图片资源可被项目导入
- [x] 1.2 新增或拆分项目卡片函数式组件，渲染截图、名称、简介和 Github 链接，使用 `loading="lazy"`、键盘 focus 状态和安全的外部链接属性；通过静态检查确认不包含详情页、搜索或 API 逻辑
- [x] 1.3 更新 `ProjectsSection.tsx` 将占位文案替换为至少四张卡片，并保持 `id="projects"`、Hero 下方位置和项目标题；通过开发服务器验证 Hero CTA 与导航的 `#projects` 均到达卡片区

**Phase 1 验收条件：** Hero 下方显示至少 4 张完整项目卡片；每张卡片截图、名称、简介和 Github 链接均可见可操作；项目数据可集中替换；完成后暂停并等待用户确认。

## Phase 2：响应式与交互视觉

- [x] 2.1 使用 Tailwind responsive grid 和暗色变体完善卡片布局，确保窄屏无水平滚动、文本可读且截图不溢出；通过开发服务器检查桌面和移动视口
- [x] 2.2 为卡片添加轻量 hover 阴影/位移效果，并在 reduced-motion 下禁用非必要运动；通过源码检查 `motion-reduce` 类并手动验证鼠标悬浮与减少运动场景
- [x] 2.3 为截图增加加载失败后备，运行 `npm run lint`、`npm run build`，并验证图片 lazy loading、亮暗主题、锚点滚动及原有联系我 Section 未受影响

**Phase 2 验收条件：** 卡片在亮暗主题和不同视口下可读可用，hover 有微特效且 reduced-motion 安全，截图失败不影响文字/链接，lint/build 全部通过。完成后暂停并等待用户确认。
