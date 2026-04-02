import React, { useId } from 'react';

type GaugeHue = 'success' | 'neutral' | 'danger' | 'accent' | [number, number];

interface RadialGaugeProps {
  width?: number;
  height?: number;
  value: number;
  unit?: string;
  hue?: GaugeHue;
  startAngle?: number;
  endAngle?: number;
  edgePad?: number;
  thickness?: number;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const polarToCartesian = (center: number, radius: number, angle: number) => {
  const radians = ((180 - angle) * Math.PI) / 180;
  return {
    x: center + (radius * Math.cos(radians)),
    y: center - (radius * Math.sin(radians))
  };
};

const describeArc = (center: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(center, radius, startAngle);
  const end = polarToCartesian(center, radius, endAngle);
  const sweep = ((((endAngle - startAngle) % 360) + 360) % 360) || 360;
  const largeArcFlag = sweep > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

const resolveHue = (hue: GaugeHue): [string, string] => {
  if (Array.isArray(hue)) {
    return [
      `hsl(${hue[0]} 84% 62%)`,
      `hsl(${hue[1]} 82% 58%)`
    ];
  }

  switch (hue) {
    case 'success':
      return ['#34d399', '#14b8a6'];
    case 'danger':
      return ['#fb7185', '#f97316'];
    case 'neutral':
      return ['#67e8f9', '#38bdf8'];
    case 'accent':
    default:
      return ['#22d3ee', '#14b8a6'];
  }
};

const formatValue = (value: number) => value.toLocaleString('cs-CZ', {
  minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  maximumFractionDigits: 1
});

const RadialGauge: React.FC<RadialGaugeProps> = ({
  width = 260,
  height = 260,
  value,
  unit = '%',
  hue = 'accent',
  startAngle = 0,
  endAngle = 360,
  edgePad = 0,
  thickness = 14,
  className = ''
}) => {
  const safeValue = clamp(value, 0, 100);
  const center = 100;
  const radius = 64;
  const gradientId = useId().replace(/:/g, '');
  const [startColor, endColor] = resolveHue(hue);

  const normalizedStart = startAngle + edgePad;
  const normalizedEnd = endAngle - edgePad;
  const sweep = ((((normalizedEnd - normalizedStart) % 360) + 360) % 360) || 360;
  const isFullCircle = Math.abs(sweep - 360) < 0.001;
  const arcPath = describeArc(center, radius, normalizedStart, normalizedStart + sweep);

  return (
    <div
      className={`radial-gauge ${className}`.trim()}
      style={{ width, height }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${gradientId}-gradient`} x1="12%" y1="88%" x2="88%" y2="12%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
          <filter id={`${gradientId}-glow`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius - thickness - 10}
          fill="var(--chart-surface)"
          stroke="var(--chart-surface-border)"
          strokeWidth="1"
        />

        {isFullCircle ? (
          <>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--chart-track)"
              strokeWidth={thickness}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={`url(#${gradientId}-gradient)`}
              strokeWidth={thickness}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${safeValue} 100`}
              strokeDashoffset="25"
              filter={`url(#${gradientId}-glow)`}
            />
          </>
        ) : (
          <>
            <path
              d={arcPath}
              fill="none"
              stroke="var(--chart-track)"
              strokeWidth={thickness}
              strokeLinecap="round"
            />
            <path
              d={arcPath}
              fill="none"
              stroke={`url(#${gradientId}-gradient)`}
              strokeWidth={thickness}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${safeValue} 100`}
              filter={`url(#${gradientId}-glow)`}
            />
          </>
        )}

        <text
          x={center}
          y="92"
          textAnchor="middle"
          style={{ fill: 'var(--chart-text)', fontSize: '2rem', fontWeight: 900 }}
        >
          {formatValue(safeValue)}
        </text>
        <text
          x={center}
          y="115"
          textAnchor="middle"
          style={{ fill: 'var(--chart-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.22em' }}
        >
          {unit}
        </text>
      </svg>
    </div>
  );
};

export default RadialGauge;
