import { profile } from '../data/profile';
import HeroBackground from './HeroBackground';
import ThemeToggle from './ThemeToggle';

/** 字段值非空（含非纯空白）时返回 true。 */
function hasContent(s: string): boolean {
  return s.trim().length > 0;
}

/**
 * 首屏 Hero 区块（spec「Hero 内容展示」「Hero 视觉背景」）。
 * 三层叠加（自下而上）：
 *   1. CSS 渐变底层（bg-gradient-to-br ... to-accent/20，theme-aware）
 *   2. Canvas 粒子层（<HeroBackground />，绝对定位 -z-10）
 *   3. 居中内容（h1 + 职业 + 自我介绍 + CTA）+ 右上角 <ThemeToggle />
 *
 * 全屏高度使用 100svh / 100dvh（design D8），移动端地址栏弹起/收起无跳动。
 * 打印态：粒子与 CTA / 切换按钮均 print:hidden。
 *
 * id="hero"（design D5 / add-navigation 协调改动）：仅属性补全，
 *   不改 aria-label / 内容 / spec，作为顶部 Nav "首页" 链接的锚点目标。
 */
function Hero() {
  return (
    <section
      id="hero"
      aria-label="自我介绍"
      className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/20 px-6 py-16 md:min-h-[100dvh]"
    >
      <HeroBackground />

      {/* ThemeToggle 容器：add-navigation 引入后，Hero 顶部被 Nav (h-14 ≈ 56px) 遮挡，
       *   故从 top-4 改为 top-[calc(theme(spacing.14)+0.5rem)] = 64px，既避开 Nav 又不破坏
       *   spec「Hero 右上角」的语义（仍位于 Hero 内部右侧顶部）。 */}
      <div className="absolute right-4 top-[calc(theme(spacing.14)+0.5rem)] z-10 print:hidden">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {hasContent(profile.name) && (
          <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            {profile.name}
          </h1>
        )}

        {hasContent(profile.role) && (
          <p role="doc-subtitle" className="mt-3 text-lg text-muted md:text-xl">
            {profile.role}
          </p>
        )}

        {hasContent(profile.intro) && (
          <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
            {profile.intro}
          </p>
        )}

        {hasContent(profile.ctaLabel) && (
          <a
            href={profile.ctaHref}
            className="mt-10 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background print:hidden"
          >
            {profile.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}

export default Hero;