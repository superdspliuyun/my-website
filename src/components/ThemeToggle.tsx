import { useTheme } from '../hooks/useTheme';

/**
 * 明亮 / 暗黑模式切换按钮。
 * - aria-label 反映"点击后会执行的操作"，明亮下提示"切换到暗黑"，
 *   暗黑下提示"切换到明亮"（spec「切换按钮可访问」）。
 * - aria-pressed 反映当前主题状态：暗黑 = true，明亮 = false。
 * - focus-visible 焦点环通过 Tailwind 工具类实现，键盘 Tab 可见。
 * - 不引入图标库：sun / moon 为内联 SVG（design Non-Goals）。
 */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? '切换到明亮模式' : '切换到暗黑模式';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-background/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background print:hidden"
    >
      {isDark ? (
        // 月亮图标 —— 暗黑模式下显示，提示点击会切到明亮
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // 太阳图标 —— 明亮模式下显示，提示点击会切到暗黑
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;