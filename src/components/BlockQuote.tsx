import React from 'react';
import { Quote } from 'lucide-react';

interface BlockQuoteAuthor {
  name: string;
  avatar?: string;
}

interface BlockQuoteProps {
  preline?: string;
  subline?: string;
  author?: BlockQuoteAuthor;
  className?: string;
  children: React.ReactNode;
}

const BlockQuote: React.FC<BlockQuoteProps> = ({
  preline,
  subline,
  author,
  className = '',
  children
}) => {
  return (
    <figure
      className={`glass-panel rounded-[2rem] border border-cyan-400/15 bg-cyan-500/10 p-6 md:p-7 space-y-5 ${className}`.trim()}
    >
      {preline && (
        <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300 font-black">
          {preline}
        </p>
      )}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-black/25 border border-cyan-300/10 text-cyan-300 flex items-center justify-center">
          <Quote size={20} />
        </div>

        <div className="min-w-0 space-y-3">
          <blockquote className="text-lg md:text-xl text-white font-serif italic leading-relaxed">
            “{children}”
          </blockquote>

          {subline && (
            <p className="text-sm text-white/45 font-light leading-relaxed">
              {subline}
            </p>
          )}
        </div>
      </div>

      {author && (
        <figcaption className="pt-4 border-t border-white/10 flex items-center gap-3">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-11 h-11 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300">
              <Quote size={16} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/75 font-black">
              {author.name}
            </p>
          </div>
        </figcaption>
      )}
    </figure>
  );
};

export default BlockQuote;
