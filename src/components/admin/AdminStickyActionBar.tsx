import { AlertCircle, CheckCircle2, CircleDot, ExternalLink, Loader2 } from 'lucide-react';
import React from 'react';

interface AdminStickyActionBarProps {
  title: string;
  status?: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  message?: string;
  previewHref?: string;
  previewLabel?: string;
  actions: React.ReactNode;
}

const statusMeta: Record<NonNullable<AdminStickyActionBarProps['status']>, {
  icon: React.ReactNode;
  label: string;
  className: string;
}> = {
  idle: {
    icon: <CircleDot size={14} />,
    label: 'Připraveno',
    className: 'border-white/10 bg-white/[0.04] text-white/55'
  },
  dirty: {
    icon: <CircleDot size={14} className="text-cyan-300" />,
    label: 'Neuloženo',
    className: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-100'
  },
  saving: {
    icon: <Loader2 size={14} className="animate-spin" />,
    label: 'Ukládám',
    className: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-100'
  },
  saved: {
    icon: <CheckCircle2 size={14} />,
    label: 'Uloženo',
    className: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
  },
  error: {
    icon: <AlertCircle size={14} />,
    label: 'Chyba',
    className: 'border-red-500/25 bg-red-500/10 text-red-100'
  }
};

const AdminStickyActionBar: React.FC<AdminStickyActionBarProps> = ({
  title,
  status = 'idle',
  message,
  previewHref,
  previewLabel = 'Náhled',
  actions
}) => {
  const meta = statusMeta[status];

  return (
    <div className="sticky bottom-4 z-40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-[#041013]/92 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${meta.className}`}>
              {meta.icon}
              {meta.label}
            </span>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/72">{title}</p>
          </div>
          {message && <p className="mt-1 line-clamp-1 text-xs text-white/42">{message}</p>}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
              title="Otevřít veřejný náhled v nové kartě"
            >
              <ExternalLink size={14} />
              {previewLabel}
            </a>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default AdminStickyActionBar;
