import type { Project } from '../data/projects';

/**
 * 判断 href 是否为有效外部链接（design D2）。
 * 仅识别 http(s) 开头的链接；空 / 空白 / 站内锚点 / 站内路径在此处视为"非外部链接"。
 */
function isExternalLink(href: string): boolean {
  return /^https?:\/\//.test(href.trim());
}

/**
 * 判断 githubUrl 是否既"非空"又"以 http(s) 开头"（design D6 + spec「githubUrl 非法格式」）。
 * 仅非 http(s) 开头的合法 https URL 才会被渲染为可点击链接；
 * 其他值（javascript: / ftp: / 相对路径 / 空字符串）一律降级为"未提供"。
 */
function isValidGithubUrl(url: string): boolean {
  const trimmed = url.trim();
  return trimmed.length > 0 && /^https?:\/\//.test(trimmed);
}

/** 字段值非空（含非纯空白）时返回 true。 */
function hasContent(s: string): boolean {
  return s.trim().length > 0;
}

/**
 * 项目卡片（spec「projects-section」既有 5 Requirements + add-project-section delta 新增 3 Requirements）。
 *
 * 渲染策略（design D2 / D5 / D8）：
 *   - 根元素：始终为 `<div>`，不再使用 `<a>`（避免与 GitHub 链接的 `<a>` 嵌套；HTML5 规范禁止）
 *   - 跳转：由底部"查看项目 →"文本链接承载（hasContent(href) 时才渲染）
 *   - screenshot：字段非空时在标题之前渲染 16:9 缩略图（loading="lazy"）；空字段不渲染
 *   - githubUrl：字段非空且为合法 http(s) URL 时在标签列表之后渲染图标+文本按钮；否则不渲染
 *
 * 主题：所有颜色用 Tailwind v4 @theme token（design D4 + CLAUDE.md「禁止内联 style」），不写硬编码。
 * 动效：hover 时轻微上浮（既有 projects-section spec「主题适配」保留不变）。
 */
function ProjectCard({ project }: { project: Project }) {
  const { title, description, tags, href, screenshot, githubUrl } = project;
  const hasTitle = hasContent(title);
  const validHref = href.trim();
  const hasHref = hasContent(validHref);
  const external = isExternalLink(validHref);
  const hasScreenshot = hasContent(screenshot ?? '');
  const hasGithubUrl = isValidGithubUrl(githubUrl ?? '');

  const baseClasses =
    'group flex h-full flex-col rounded-lg border border-border bg-background p-6 ' +
    'transition-all duration-150 ' +
    'hover:-translate-y-0.5 hover:border-accent ' +
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-accent ' +
    'focus-within:ring-offset-2 focus-within:ring-offset-background';

  // 内部链接样式：focus-visible 焦点环遵循全站约定
  const innerLinkClass =
    'inline-flex items-center gap-1 rounded text-sm font-medium text-accent ' +
    'transition-colors hover:text-accent-hover ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <div className={baseClasses} aria-label={hasTitle ? title : '项目卡片'}>
      {/* 截图缩略图（design D1）：loading=lazy + aspect-video + 主题感知边框 */}
      {hasScreenshot && (
        <img
          src={screenshot}
          alt={hasTitle ? `${title} 项目截图` : '项目截图'}
          loading="lazy"
          decoding="async"
          className="mb-4 aspect-video w-full rounded-md border border-border object-cover"
        />
      )}

      {hasTitle && (
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      )}

      {hasContent(description) && (
        <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      )}

      {tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="标签">
          {tags.map((tag, i) => (
            <li
              key={i}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {/* 跳转链接 + GitHub 链接（design D2 解决嵌套冲突）：
              根元素已统一为 <div>，由下方两个独立 <a> 承载跳转与 GitHub 入口 */}
      {(hasHref || hasGithubUrl) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {hasHref && (
            <a
              href={validHref}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              className={innerLinkClass}
              aria-label={
                hasTitle
                  ? external
                    ? `${title}（在新标签页打开）`
                    : title
                  : external
                ? '在新标签页打开'
                : '项目链接'
              }
            >
              查看项目 →
            </a>
          )}

          {hasGithubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={innerLinkClass}
              aria-label={
                hasTitle ? `在 GitHub 上查看 ${title}` : '在 GitHub 上查看此项目'
              }
            >
              {/* 内联 GitHub 图标（design D4：24x24 viewBox，与 ThemeToggle 一致） */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>在 GitHub 上查看</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectCard;