import React, { useId } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export interface PieChartDatum {
  name: string;
  value: number;
  color?: string;
}

interface PieChartCardProps {
  title: string;
  description?: string;
  data: PieChartDatum[];
  height?: number;
  className?: string;
}

const defaultColors = [
  '#f59e0b',
  '#f97316',
  '#f43f5e',
  '#ec4899',
  '#38bdf8',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#fb7185'
];

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  description,
  data,
  height = 360,
  className = ''
}) => {
  const gradientSeed = useId().replace(/:/g, '');

  return (
    <div className={`glass-panel p-8 rounded-[3rem] border-white/10 space-y-6 ${className}`.trim()}>
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-black">Interaktivní graf</p>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {description && (
          <p className="text-sm text-white/45 font-light leading-relaxed max-w-3xl">{description}</p>
        )}
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {data.map((entry, index) => {
                const color = entry.color ?? defaultColors[index % defaultColors.length];
                return (
                  <linearGradient
                    id={`${gradientSeed}-pie-${index}`}
                    key={`${gradientSeed}-pie-${entry.name}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.72} />
                  </linearGradient>
                );
              })}
            </defs>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="46%"
              outerRadius="70%"
              innerRadius="0%"
              stroke="rgba(5, 17, 17, 0.72)"
              strokeWidth={2}
              paddingAngle={1}
              labelLine={false}
              label={({ percent }) =>
                percent && percent > 0 ? `${Math.round(percent * 100)}%` : ''
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={`url(#${gradientSeed}-pie-${index})`}
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [`${value ?? 0} %`, String(name ?? '')]}
              contentStyle={{
                background: 'rgba(5, 17, 17, 0.92)',
                border: '1px solid rgba(34, 211, 238, 0.18)',
                borderRadius: '1rem',
                color: 'rgba(255,255,255,0.92)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)'
              }}
              itemStyle={{ color: 'rgba(255,255,255,0.9)' }}
              labelStyle={{ color: 'rgba(255,255,255,0.58)' }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: 20,
                fontSize: '12px',
                color: 'var(--chart-muted)',
                lineHeight: 1.7
              }}
              formatter={(value, entry, index) => {
                const item = data[index];
                return (
                  <span style={{ color: 'var(--chart-muted)' }}>
                    {value} <strong style={{ color: 'var(--chart-text)' }}>{item?.value} %</strong>
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartCard;
