import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  slide: string | React.ReactNode;
  alt: string;
}

interface CarouselProps {
  items?: CarouselItem[];
  indicator?: 'line' | 'thumbnail';
  aspectRatio?: string;
  controls?: boolean;
  sizes?: string;
  revealedByDefault?: boolean;
  auto?: boolean;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items = [],
  indicator = 'line',
  aspectRatio = '16 / 9',
  controls = true,
  sizes,
  revealedByDefault = false,
  auto = false,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeItems = useMemo(() => items.filter(Boolean), [items]);
  const hasMultiple = safeItems.length > 1;

  useEffect(() => {
    if (!auto || !hasMultiple) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeItems.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [auto, hasMultiple, safeItems.length]);

  if (safeItems.length === 0) return null;

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % safeItems.length);

  return (
    <div className={`carousel-fx group/carousel ${className}`.trim()}>
      <div className="carousel-fx-stage" style={{ aspectRatio }}>
        <div
          className="carousel-fx-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {safeItems.map((item, index) => (
            <div key={`${item.alt}-${index}`} className="carousel-fx-slide">
              {typeof item.slide === 'string' ? (
                <img
                  src={item.slide}
                  alt={item.alt}
                  sizes={sizes}
                  className="carousel-fx-image"
                />
              ) : (
                <div className="h-full w-full">{item.slide}</div>
              )}
            </div>
          ))}
        </div>

        {controls && hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Předchozí slide"
              className={`carousel-fx-control left-4 ${revealedByDefault ? 'opacity-100' : 'opacity-0 group-hover/carousel:opacity-100'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Další slide"
              className={`carousel-fx-control right-4 ${revealedByDefault ? 'opacity-100' : 'opacity-0 group-hover/carousel:opacity-100'}`}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {hasMultiple && indicator === 'line' && (
        <div className={`carousel-fx-lines ${revealedByDefault ? 'opacity-100' : 'opacity-0 group-hover/carousel:opacity-100'}`}>
          {safeItems.map((item, index) => (
            <button
              key={`${item.alt}-line-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`carousel-fx-line ${index === activeIndex ? 'carousel-fx-line-active' : ''}`}
              aria-label={`Přejít na slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {hasMultiple && indicator === 'thumbnail' && (
        <div className={`carousel-fx-thumbnails ${revealedByDefault ? 'opacity-100' : 'opacity-0 group-hover/carousel:opacity-100'}`}>
          {safeItems.map((item, index) => (
            <button
              key={`${item.alt}-thumb-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`carousel-fx-thumb ${index === activeIndex ? 'carousel-fx-thumb-active' : ''}`}
              aria-label={`Přejít na slide ${index + 1}`}
            >
              {typeof item.slide === 'string' ? (
                <img src={item.slide} alt={item.alt} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/60 font-black px-3">{item.alt}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
