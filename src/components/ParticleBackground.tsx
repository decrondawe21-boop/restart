import React, { useEffect, useRef } from 'react';

type RgbColor = [number, number, number];

interface ParticleBackgroundProps {
  isDark: boolean;
  interactive?: boolean;
  density?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  alpha: number;
  color: RgbColor;
  phase: number;
  depth: number;
}

const darkPalette: RgbColor[] = [
  [34, 211, 238],
  [20, 184, 166],
  [250, 204, 21]
];

const lightPalette: RgbColor[] = [
  [14, 116, 144],
  [13, 148, 136],
  [202, 138, 4]
];

const rgba = ([r, g, b]: RgbColor, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const clampParticleCount = (width: number, height: number, density: number) => {
  const areaCount = Math.round(((width * height) / 22000) * density);
  return Math.max(58, Math.min(176, areaCount));
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  isDark,
  interactive = true,
  density = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const palette = isDark ? darkPalette : lightPalette;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, active: false };

    let particles: Particle[] = [];
    let frameId = 0;
    let width = 0;
    let height = 0;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isDark ? 0.14 : 0.1),
      vy: (Math.random() - 0.5) * (isDark ? 0.14 : 0.1),
      baseRadius: 0.6 + (Math.random() * 2.8),
      alpha: (isDark ? 0.12 : 0.08) + (Math.random() * (isDark ? 0.2 : 0.12)),
      color: palette[Math.floor(Math.random() * palette.length)],
      phase: Math.random() * Math.PI * 2,
      depth: 0.7 + (Math.random() * 1.3)
    });

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: clampParticleCount(width, height, density) }, createParticle);
    };

    const drawParticle = (particle: Particle, time: number) => {
      const pulse = 1 + (Math.sin((time * 0.0011) + particle.phase) * 0.18);
      const radius = particle.baseRadius * pulse;
      const glowRadius = radius * (isDark ? 7 : 5.4);
      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        glowRadius
      );

      gradient.addColorStop(0, rgba(particle.color, Math.min(1, particle.alpha * (isDark ? 1.2 : 1.35))));
      gradient.addColorStop(0.32, rgba(particle.color, particle.alpha * (isDark ? 0.28 : 0.22)));
      gradient.addColorStop(1, rgba(particle.color, 0));

      context.beginPath();
      context.fillStyle = gradient;
      context.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = rgba(particle.color, Math.min(1, particle.alpha + (isDark ? 0.22 : 0.16)));
      context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const animate = (time: number) => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.x += particle.vx * particle.depth;
          particle.y += particle.vy * particle.depth;

          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;

          if (interactive && pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;
            const influenceRadius = 180;

            if (distance < influenceRadius) {
              const force = (influenceRadius - distance) / influenceRadius;
              particle.x += (dx / distance) * force * 1.25;
              particle.y += (dy / distance) * force * 1.25;
            }
          }
        }

        drawParticle(particle, time);
      });

      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    resizeCanvas();
    frameId = window.requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [density, interactive, isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 h-full w-full pointer-events-none ${className}`.trim()}
      style={{
        opacity: isDark ? 0.92 : 0.7
      }}
    />
  );
};

export default ParticleBackground;
