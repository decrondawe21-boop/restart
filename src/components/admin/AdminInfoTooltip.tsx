import { HelpCircle } from 'lucide-react';
import React from 'react';

interface AdminInfoTooltipProps {
  title: string;
  description?: string;
  items?: string[];
  align?: 'left' | 'right';
  label?: string;
}

const AdminInfoTooltip: React.FC<AdminInfoTooltipProps> = ({
  title,
  description,
  items = [],
  align = 'right',
  label = 'Info'
}) => (
  <div className="group relative inline-flex">
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 transition hover:border-cyan-400/25 hover:text-cyan-300"
      aria-label={title}
    >
      <HelpCircle size={14} />
      <span>{label}</span>
    </button>

    <div
      className={`pointer-events-none absolute top-full z-30 mt-3 w-[320px] rounded-[1.6rem] border border-cyan-400/20 bg-[#041013]/96 p-4 text-left text-xs leading-relaxed text-white/72 opacity-0 shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${
        align === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{title}</p>
      {description && <p className="mt-3">{description}</p>}
      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[2px] text-cyan-300">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default AdminInfoTooltip;
