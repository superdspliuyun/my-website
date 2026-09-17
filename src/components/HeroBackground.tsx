import { useEffect, useRef } from 'react';

/* 粒子数与性能档位（tasks 5.3 / design "限制 DPR 上限、节流 resize"） */
const BASE_PARTICLES = 60;
const REDUCED_PARTICLES = 30;
const LOW_CORE_THRESHOLD = 4;
const MAX_DPR = 2;
const LINK_DISTANCE = 120;

/**
 * 根据 navigator.hardwareConcurrency 调整粒子数（tasks 5.3）：
 * - < 4 核：减半为 30 颗（避免低端机卡顿）
 * - ≥ 4 核：60 颗（封顶，不再增长）
 */
function getParticleCount(): number {
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores < LOW_CORE_THRESHOLD) return REDUCED_PARTICLES;
  return BASE_PARTICLES;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

/**
 * Hero 粒子背景层。
 * - Canvas 2D 手写（design D1：不用 tsparticles / three.js）。
 * - RAF 循环 + prefers-reduced-motion 监听（spec「减少动效时跳过动画」）。
 * - ResizeObserver + rAF 节流 resize（design D8）。
 * - 粒子颜色通过 getComputedStyle 读取 --particle-color，
 *   下一帧自动应用主题切换（design D7）。
 * - aria-hidden="true" + pointer-events-none：装饰层，不参与交互 / 无障碍树。
 * - print:hidden：打印时不输出（与 index.css 的 @media print 兜底）。
 */
function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    let prefersReduced = reducedMotionQuery.matches;

    const particleCount = getParticleCount();
    const particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let width = 0;
    let height = 0;

    function readColor(): string {
      const v = getComputedStyle(canvas!).getPropertyValue('--particle-color');
      return v.trim() || '#94a3b8';
    }

    function resizeCanvas(): void {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles(): void {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function step(): void {
      if (!ctx || width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const color = readColor();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;

      // 粒子位置 + 边缘反弹
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 近邻连线（透明度按距离衰减）
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < LINK_DISTANCE * LINK_DISTANCE) {
            const alpha = 1 - Math.sqrt(dist2) / LINK_DISTANCE;
            ctx.globalAlpha = alpha * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(step);
    }

    function start(): void {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(step);
    }

    function stop(): void {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    // resize 节流：rAF 合并多次 ResizeObserver 回调
    let resizePending = false;
    const ro = new ResizeObserver(() => {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        resizePending = false;
        resizeCanvas();
        if (particles.length === 0 && width > 0 && height > 0) {
          initParticles();
        }
      });
    });
    ro.observe(canvas);

    // 初次 setup
    resizeCanvas();
    initParticles();
    if (!prefersReduced) start();

    // 系统设置变更：暂停 / 恢复
    const onMotionChange = (e: MediaQueryListEvent): void => {
      prefersReduced = e.matches;
      if (prefersReduced) stop();
      else start();
    };
    reducedMotionQuery.addEventListener('change', onMotionChange);

    return () => {
      stop();
      ro.disconnect();
      reducedMotionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full print:hidden"
    />
  );
}

export default HeroBackground;