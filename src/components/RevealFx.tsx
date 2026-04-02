import React, { useEffect, useRef, useState } from 'react';

interface RevealFxProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  translateY?: number;
}

type RevealStyle = React.CSSProperties & {
  '--reveal-delay': string;
  '--reveal-translate-y': string;
};

const RevealFx: React.FC<RevealFxProps> = ({
  children,
  className = '',
  delay = 0,
  translateY = 0.75
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: RevealStyle = {
    '--reveal-delay': `${delay}s`,
    '--reveal-translate-y': `${translateY}rem`
  };

  return (
    <div
      ref={ref}
      className={`reveal-fx ${isVisible ? 'reveal-fx-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};

export default RevealFx;
