import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

const LegalPageModal: React.FC<LegalPageModalProps> = ({
  isOpen,
  onClose,
  eyebrow,
  title,
  description,
  sections
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[134] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-8" onClick={onClose}>
      <div
        className="glass-panel relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2.6rem] border-cyan-400/20 p-8 md:p-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl bg-white/5 p-3 text-cyan-400 transition-all hover:bg-white/10"
          aria-label={`Zavřít stránku ${title}`}
        >
          <X size={22} />
        </button>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              <ShieldCheck size={14} />
              {eyebrow}
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black uppercase leading-tight text-white md:text-5xl">{title}</h3>
              <p className="max-w-3xl text-sm font-light leading-relaxed text-white/45 md:text-base">{description}</p>
            </div>
          </div>

          <div className="space-y-5">
            {sections.map((section) => (
              <section key={section.heading} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <h4 className="text-xl font-black text-white">{section.heading}</h4>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-3 text-sm text-white/65 md:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-cyan-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPageModal;
