import { profile } from '../data/profile';

/** 字段值非空（含非纯空白）时返回 true。 */
function hasContent(s: string): boolean {
  return s.trim().length > 0;
}

/**
 * 顶部固定导航栏（spec「navigation-section」）。
 *
 * 关键点（design D1-D4 + spec 全部 Requirements）：
 *   - 定位：fixed top-0 z-40，始终贴顶（design D1）。
 *   - 背景：bg-background/70 + backdrop-blur，supports-[backdrop-filter] 渐进增强（design D2）。
 *   - 品牌名：左侧，profile.name 缺失时退化为 [品牌名] 占位；品牌名整体作为锚点链接至 #hero。
 *   - 链接：右侧 3 个固定顺序锚点 #hero / #projects / #contact（spec「三个链接固定存在」）。
 *   - 主题：全部 token 类名（text-foreground / hover:text-accent / focus-visible:ring-accent），零硬编码颜色。
 *   - 响应式：内层 max-w-5xl mx-auto flex h-14，移动端单行不折叠、桌面端居中（spec「响应式布局」）。
 *   - 打印：print:hidden，避免占用首行版面（spec「打印态隐藏」）。
 *   - 可访问性：<nav aria-label="主导航">，Tab 顺序 = 品牌名 → 首页 → 项目 → 联系我（spec「可访问性」）。
 */
function Navigation() {
  const hasName = hasContent(profile.name);
  const brandLabel = hasName ? profile.name : '[品牌名]';
  const { home, projects, contact } = profile.navLabels;

  // 链接通用类名（focus-visible 焦点环遵循全站约定：accent + ring-offset-background）。
  const linkClass =
    'rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors ' +
    'hover:bg-background/80 hover:text-accent ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* 左侧：品牌名（同时作为"首页"链接，spec「品牌名显示与跳转」） */}
        <a
          href="#hero"
          className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base"
        >
          {brandLabel}
        </a>

        {/* 右侧：3 个固定顺序锚点链接（spec「三个链接固定存在」） */}
        <div className="flex items-center gap-1 sm:gap-2">
          <a href="#hero" className={linkClass}>
            {home}
          </a>
          <a href="#projects" className={linkClass}>
            {projects}
          </a>
          <a href="#contact" className={linkClass}>
            {contact}
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;