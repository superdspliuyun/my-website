import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const drawingCanvas = canvas
    const drawingContext = context

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const parent = canvas.parentElement ?? canvas
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let animationFrame = 0

    function resizeCanvas() {
      const bounds = parent.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      width = bounds.width
      height = bounds.height
      drawingCanvas.width = Math.max(1, Math.floor(width * pixelRatio))
      drawingCanvas.height = Math.max(1, Math.floor(height * pixelRatio))
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = Math.max(18, Math.min(70, Math.floor((width * height) / 18000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        radius: Math.random() * 1.5 + 0.5,
      }))

      draw()
    }

    function draw() {
      const isDark = document.documentElement.classList.contains('dark')
      const particleColor = isDark ? 'rgba(103, 232, 249, 0.7)' : 'rgba(8, 145, 178, 0.55)'
      const lineColor = isDark ? 'rgba(103, 232, 249, 0.14)' : 'rgba(8, 145, 178, 0.12)'

      drawingContext.clearRect(0, 0, width, height)
      drawingContext.fillStyle = particleColor
      drawingContext.strokeStyle = lineColor
      drawingContext.lineWidth = 1

      for (const particle of particles) {
        drawingContext.beginPath()
        drawingContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        drawingContext.fill()
      }

      for (let index = 0; index < particles.length; index += 1) {
        for (let neighborIndex = index + 1; neighborIndex < particles.length; neighborIndex += 1) {
          const particle = particles[index]
          const neighbor = particles[neighborIndex]
          const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)

          if (distance < 130) {
            drawingContext.globalAlpha = 1 - distance / 130
            drawingContext.beginPath()
            drawingContext.moveTo(particle.x, particle.y)
            drawingContext.lineTo(neighbor.x, neighbor.y)
            drawingContext.stroke()
          }
        }
      }

      drawingContext.globalAlpha = 1
    }

    function animate() {
      if (reducedMotionQuery.matches || document.visibilityState !== 'visible') {
        draw()
        return
      }

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -10 || particle.x > width + 10) particle.vx *= -1
        if (particle.y < -10 || particle.y > height + 10) particle.vy *= -1
      }

      draw()
      animationFrame = window.requestAnimationFrame(animate)
    }

    function startAnimation() {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(animate)
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        startAnimation()
      } else {
        window.cancelAnimationFrame(animationFrame)
        draw()
      }
    }

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resizeCanvas) : null
    resizeObserver?.observe(parent)
    window.addEventListener('resize', resizeCanvas)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const themeObserver = new MutationObserver(draw)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    resizeCanvas()
    startAnimation()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}

export default ParticleCanvas
