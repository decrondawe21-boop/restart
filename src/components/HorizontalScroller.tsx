import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
  ariaLabel?: string;
}

const scrollButtonClass =
  'pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#061b1f]/90 text-cyan-200 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-cyan-300/45 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-300/40';

const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  className = '',
  viewportClassName = '',
  ariaLabel = 'Vodorovný posuvník'
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const updateScrollButtonsVisibility = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollPosition = scroller.scrollWidth - scroller.clientWidth;
    const isScrollable = maxScrollPosition > 1;

    setShowPrevButton(isScrollable && scroller.scrollLeft > 1);
    setShowNextButton(isScrollable && scroller.scrollLeft < maxScrollPosition - 1);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    updateScrollButtonsVisibility();
    scroller.addEventListener('scroll', updateScrollButtonsVisibility, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollButtonsVisibility);
    resizeObserver.observe(scroller);

    return () => {
      scroller.removeEventListener('scroll', updateScrollButtonsVisibility);
      resizeObserver.disconnect();
    };
  }, [updateScrollButtonsVisibility]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollButtonsVisibility);
    return () => window.cancelAnimationFrame(frame);
  }, [children, updateScrollButtonsVisibility]);

  const handleScroll = (direction: 'previous' | 'next') => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollAmount = Math.max(scroller.clientWidth * 0.72, 280);
    scroller.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`relative ${className}`}>
      {showPrevButton && (
        <div className="pointer-events-none absolute left-0 top-0 z-20 flex h-full w-24 items-center justify-start bg-gradient-to-r from-[#051111] via-[#051111]/80 to-transparent pl-2">
          <button
            type="button"
            aria-label="Předchozí programy"
            onClick={() => handleScroll('previous')}
            className={scrollButtonClass}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}

      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${viewportClassName}`}
      >
        {children}
      </div>

      {showNextButton && (
        <div className="pointer-events-none absolute right-0 top-0 z-20 flex h-full w-24 items-center justify-end bg-gradient-to-l from-[#051111] via-[#051111]/80 to-transparent pr-2">
          <button
            type="button"
            aria-label="Další programy"
            onClick={() => handleScroll('next')}
            className={scrollButtonClass}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalScroller;
