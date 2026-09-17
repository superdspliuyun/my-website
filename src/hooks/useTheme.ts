import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** 从 localStorage 读取用户偏好；不可用或值非法时返回 null。 */
function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

/** 读取 prefers-color-scheme；不可用时回退 light。 */
function readSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** 初始主题：用户偏好 > 系统偏好。 */
function getInitialTheme(): Theme {
  return readStoredTheme() ?? readSystemTheme();
}

/** 把主题写到 <html> 的 className 上（驱动 Tailwind v4 dark 变体）。 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

/**
 * 主题状态 hook。
 * - 单一信息源：localStorage（用户偏好）+ system（回退）。
 * - 副作用只触碰 DOM classList 与 localStorage，组件不直接接触。
 * - localStorage 异常（隐私模式 / 配额耗尽 / SecurityError）下仍可切换，仅不持久化。
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // 持久化失败兜底：当前会话仍生效，刷新后回到系统默认。
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}