import ParticleCanvas from './ParticleCanvas'
import ThemeToggle from './ThemeToggle'

function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-slate-50 px-6 py-16 text-slate-950 dark:bg-slate-950 dark:text-white"
    >
      <ParticleCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.24),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.24),transparent_38%)]"
      />

      <div className="absolute right-6 top-24 z-10 sm:right-10 sm:top-24">
        <ThemeToggle />
      </div>

      <div className="relative z-10 max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
          天马行空
        </p>
        <h1
          id="hero-title"
          className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          小飞侠
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
          喜欢漫无边际去追逐梦的背影
        </p>
        <a
          href="#projects"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/20"
        >
          查看我的项目
        </a>
      </div>
    </section>
  )
}

export default Hero
