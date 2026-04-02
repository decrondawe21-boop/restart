import React from 'react';

interface MatrixFxHeroProps {
  isDark: boolean;
  darkLogoSrc: string;
  lightLogoSrc: string;
  darkLogoAlt?: string;
  lightLogoAlt?: string;
  revealFrom?: 'center' | 'bottom';
  label?: string;
  description?: string;
  bulge?: {
    type?: 'soft' | 'ripple';
    duration?: number;
    intensity?: number;
    repeat?: boolean;
  };
}

type MatrixCellStyle = React.CSSProperties & {
  '--matrix-delay': string;
  '--matrix-flicker-duration': string;
  '--matrix-shift': string;
};

type MatrixPanelStyle = React.CSSProperties & {
  '--matrix-columns': string;
  '--matrix-bulge-duration': string;
  '--matrix-bulge-intensity': string;
};

const columns = 26;
const rows = 14;

const MatrixFxHero: React.FC<MatrixFxHeroProps> = ({
  isDark,
  darkLogoSrc,
  lightLogoSrc,
  darkLogoAlt = 'REST||ART dark logo',
  lightLogoAlt = 'REST||ART light logo',
  revealFrom = 'bottom',
  label = 'Restart',
  description = 'Restartuj své myšlení, Daruj Druhou šanci!',
  bulge
}) => {
  const resolvedBulge = {
    type: bulge?.type ?? 'ripple',
    duration: bulge?.duration ?? 4,
    intensity: bulge?.intensity ?? 15,
    repeat: bulge?.repeat ?? true
  };

  const panelStyle: MatrixPanelStyle = {
    '--matrix-columns': `${columns}`,
    '--matrix-bulge-duration': `${resolvedBulge.duration}s`,
    '--matrix-bulge-intensity': `${resolvedBulge.intensity}`
  };

  const cells = Array.from({ length: columns * rows }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const fromBottomOrder = rows - row - 1;
    const revealOrder =
      revealFrom === 'bottom'
        ? fromBottomOrder
        : Math.abs(row - Math.floor(rows / 2));

    const delay = revealOrder * 38 + (column % 6) * 14 + (index % 4) * 9;
    const flickerDuration = 1.9 + (index % 7) * 0.18;
    const shift = revealFrom === 'bottom' ? 14 + fromBottomOrder * 1.8 : 8 + revealOrder * 1.2;

    const style: MatrixCellStyle = {
      '--matrix-delay': `${delay}ms`,
      '--matrix-flicker-duration': `${flickerDuration}s`,
      '--matrix-shift': `${shift}px`
    };

    return { id: `matrix-cell-${index}`, style };
  });

  return (
    <div
      className={`matrix-fx-panel ${isDark ? 'matrix-fx-panel-dark' : 'matrix-fx-panel-light'} ${resolvedBulge.type === 'ripple' ? 'matrix-fx-panel-ripple' : ''} ${resolvedBulge.repeat ? 'matrix-fx-panel-repeat' : ''}`}
      style={panelStyle}
      aria-label="Brand panel s MatrixFX animací"
    >
      <div
        className={`matrix-fx-grid ${revealFrom === 'bottom' ? 'matrix-fx-grid-bottom' : 'matrix-fx-grid-center'}`}
        aria-hidden="true"
      >
        {cells.map((cell) => (
          <span key={cell.id} className="matrix-fx-cell" style={cell.style} />
        ))}
      </div>

      {resolvedBulge.type === 'ripple' && (
        <div className={`matrix-fx-ripple ${revealFrom === 'bottom' ? 'matrix-fx-ripple-bottom' : 'matrix-fx-ripple-center'}`} aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={`matrix-ripple-${index}`}
              className="matrix-fx-ripple-ring"
              style={{ animationDelay: `${(resolvedBulge.duration / 3) * index}s` }}
            />
          ))}
        </div>
      )}

      <div className={`matrix-fx-bulge ${revealFrom === 'bottom' ? 'matrix-fx-bulge-bottom' : 'matrix-fx-bulge-center'}`} aria-hidden="true" />

      <div className="matrix-fx-noise" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-8 py-10 text-center pointer-events-none">
        <div className="matrix-fx-logo-wrap">
          <img
            src={darkLogoSrc}
            alt={darkLogoAlt}
            className={`matrix-fx-logo ${isDark ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          />
          <img
            src={lightLogoSrc}
            alt={lightLogoAlt}
            className={`matrix-fx-logo ${isDark ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-cyan-400/80">{label}</p>
          <p className="text-sm md:text-base text-white/45 font-light max-w-md">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatrixFxHero;
