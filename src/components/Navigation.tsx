const navigationItems = [
  { label: '首页', href: '#hero' },
  { label: '项目', href: '#projects' },
  { label: '联系我', href: '#contact' },
]

function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-200/70 bg-slate-50/90 text-slate-900 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/90 dark:text-white">
      <nav
        aria-label="主导航"
        className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-10"
      >
        <a
          href="#hero"
          className="shrink-0 rounded-md text-base font-bold tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500"
        >
          小飞侠
        </a>
        <ul className="flex items-center gap-3 text-sm font-medium sm:gap-6">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-md px-2 py-2 text-slate-600 transition-colors hover:text-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:text-slate-300 dark:hover:text-cyan-300"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
