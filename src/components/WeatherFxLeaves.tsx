import React, { useEffect, useRef } from 'react';

interface WeatherFxLeavesProps {
  colors: string[];
  intensity?: number;
  speed?: number;
  angle?: number;
  fadeStart?: number;
  fadeEnd?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface LeafParticle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color1: string;
  color2: string;
  opacity: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  rotation3D: number;
  rotation3DSpeed: number;
  depth: number;
}

const WeatherFxLeaves: React.FC<WeatherFxLeavesProps> = ({
  colors,
  intensity = 50,
  speed = 0.6,
  angle = 5,
  fadeStart = 0.5,
  fadeEnd = 0.78,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<LeafParticle[]>([]);
  const timeRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const colorKey = colors.join('|');

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let canvasWidth = 0;
    let canvasHeight = 0;

    const resolveColors = () =>
      colors.map((color) => {
        const computed = getComputedStyle(container).getPropertyValue(`--${color}`).trim();
        return computed || color;
      });

    const createLeaves = (parsedColors: string[]) => {
      const angleRad = (angle * Math.PI) / 180;
      const horizontalOffset = Math.abs(Math.tan(angleRad) * canvasHeight);
      const particles: LeafParticle[] = [];

      for (let index = 0; index < intensity; index += 1) {
        const depth = Math.random();
        const width = 8 + depth * 12;
        const height = width * (0.6 + Math.random() * 0.4);
        const spawnWidth = canvasWidth + horizontalOffset * 2;
        const spawnX = Math.random() * spawnWidth - horizontalOffset;
        const colorIndex = Math.floor(Math.random() * parsedColors.length);
        const color1 = parsedColors[colorIndex];
        const color2 = parsedColors[Math.min(colorIndex + 1, parsedColors.length - 1)];

        particles.push({
          x: spawnX,
          y: Math.random() * canvasHeight * 0.65 - canvasHeight * 0.45,
          width,
          height,
          speed: (0.4 + depth * 0.8) * speed,
          color1,
          color2,
          opacity: 0.6 + depth * 0.3,
          swayAmplitude: 30 + Math.random() * 50,
          swaySpeed: 0.3 + Math.random() * 0.7,
          swayOffset: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          rotation3D: Math.random() * Math.PI * 2,
          rotation3DSpeed: (Math.random() - 0.5) * 0.06,
          depth
        });
      }

      return particles;
    };

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(2, 0, 0, 2, 0, 0);
      particlesRef.current = createLeaves(resolveColors());
    };

    const drawLeaf = (leaf: LeafParticle, swayX: number) => {
      const scaleXRaw = Math.cos(leaf.rotation3D);
      const scaleX = scaleXRaw > 0 ? Math.max(0.15, scaleXRaw) : Math.min(-0.15, scaleXRaw);
      const opacityMultiplier = Math.max(0.5, Math.abs(scaleXRaw * 0.3 + 0.7));
      const fadeStartY = canvasHeight * fadeStart;
      const fadeEndY = canvasHeight * fadeEnd;
      const fadeProgress = Math.min(Math.max((leaf.y - fadeStartY) / Math.max(fadeEndY - fadeStartY, 1), 0), 1);
      const verticalFade = 1 - fadeProgress;

      context.save();
      context.translate(leaf.x + swayX, leaf.y);
      context.rotate(leaf.rotation);
      context.scale(scaleX, 1);
      context.globalAlpha = leaf.opacity * opacityMultiplier * verticalFade;
      context.shadowColor = leaf.color2;
      context.shadowBlur = 10 + leaf.depth * 10;

      const gradient = context.createLinearGradient(-leaf.width / 2, 0, leaf.width / 2, 0);
      gradient.addColorStop(0, leaf.color1);
      gradient.addColorStop(0.5, leaf.color2);
      gradient.addColorStop(1, leaf.color1);

      context.fillStyle = gradient;
      context.beginPath();
      const halfWidth = leaf.width / 2;
      const halfHeight = leaf.height / 2;
      context.moveTo(0, -halfHeight);
      context.bezierCurveTo(halfWidth * 0.7, -halfHeight * 0.5, halfWidth * 0.7, halfHeight * 0.5, 0, halfHeight);
      context.bezierCurveTo(-halfWidth * 0.7, halfHeight * 0.5, -halfWidth * 0.7, -halfHeight * 0.5, 0, -halfHeight);
      context.fill();
      context.restore();
    };

    const animate = (timestamp: number) => {
      const previousTimestamp = lastFrameRef.current ?? timestamp;
      lastFrameRef.current = timestamp;
      const deltaSeconds = Math.min(Math.max((timestamp - previousTimestamp) / 1000, 0), 0.05);
      const frameScale = deltaSeconds * 60;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      timeRef.current += deltaSeconds;

      const angleRad = (angle * Math.PI) / 180;
      const dx = Math.sin(angleRad);
      const dy = Math.cos(angleRad);
      const horizontalOffset = Math.abs(Math.tan(angleRad) * canvasHeight);
      const resetY = canvasHeight * fadeEnd;

      particlesRef.current.forEach((leaf) => {
        const swayX = Math.sin(timeRef.current * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
        leaf.rotation += leaf.rotationSpeed * frameScale;
        leaf.rotation3D += leaf.rotation3DSpeed * frameScale;
        leaf.y += leaf.speed * dy * frameScale;
        leaf.x += leaf.speed * dx * frameScale;

        const leftBound = -horizontalOffset - 100;
        const rightBound = canvasWidth + horizontalOffset + 100;
        if (leaf.y > resetY || leaf.x < leftBound || leaf.x > rightBound) {
          leaf.y = -leaf.height;
          const spawnWidth = canvasWidth + horizontalOffset * 2;
          leaf.x = Math.random() * spawnWidth - horizontalOffset;
          leaf.rotation = Math.random() * Math.PI * 2;
        }

        drawLeaf(leaf, swayX);
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      animationRef.current = window.requestAnimationFrame(animate);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    lastFrameRef.current = null;
    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [angle, colorKey, fadeEnd, fadeStart, intensity, speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default WeatherFxLeaves;
