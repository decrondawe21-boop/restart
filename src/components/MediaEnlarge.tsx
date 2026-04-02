import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Expand, X } from 'lucide-react';

interface MediaEnlargeProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  objectFit?: 'cover' | 'contain';
  caption?: string;
}

const MediaEnlarge: React.FC<MediaEnlargeProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  objectFit = 'cover',
  caption
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const modal = useMemo(() => {
    if (!mounted || !isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0"
          aria-label="Zavřít zvětšený obrázek"
        />

        <div
          className="relative z-10 w-full max-w-7xl glass-panel rounded-[2.8rem] border-cyan-400/20 p-4 md:p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] animate-in fade-in duration-300"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 z-20 p-3 rounded-2xl bg-black/55 text-cyan-300 hover:bg-black/70 transition-colors"
            aria-label="Zavřít"
          >
            <X size={20} />
          </button>

          <div className="rounded-[2.2rem] overflow-hidden bg-black/45 min-h-[260px] md:min-h-[360px] flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              className="w-auto h-auto max-w-full max-h-[calc(100vh-11rem)] object-contain"
            />
          </div>

          {(caption || alt) && (
            <div className="px-3 pt-4">
              <p className="text-sm text-white/55 font-light">{caption ?? alt}</p>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  }, [alt, caption, isOpen, mounted, src]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group/media relative block w-full overflow-hidden ${className}`.trim()}
        aria-label={`Zvětšit obrázek: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover/media:scale-[1.03] ${imgClassName}`.trim()}
        />
        <div className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/80 font-black opacity-0 group-hover/media:opacity-100 transition-opacity">
          <Expand size={14} />
          enlarge
        </div>
      </button>
      {modal}
    </>
  );
};

export default MediaEnlarge;
