import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { sortGalleryGroups, type GalleryGroup, type GalleryImageItem } from '../lib/siteSettings';

interface GalleryPageProps {
  groups: GalleryGroup[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
}

const dateFormatter = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const formatGalleryDate = (value: string) => {
  if (!value) return 'Bez data';
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
};

const galleryFilterValues: Record<GalleryImageItem['filter'], string> = {
  none: 'none',
  mono: 'grayscale(1) contrast(1.05)',
  warm: 'sepia(0.22) saturate(1.1) hue-rotate(-8deg) brightness(1.02)',
  cool: 'saturate(0.95) hue-rotate(10deg) contrast(1.02) brightness(1.01)',
  dramatic: 'contrast(1.18) saturate(1.18) brightness(0.96)',
  soft: 'brightness(1.05) saturate(0.9) contrast(0.96)'
};

const getGalleryImageStyle = (image: GalleryImageItem): React.CSSProperties => ({
  objectFit: image.fit,
  objectPosition: `${image.focusX}% ${image.focusY}%`,
  transform: `scale(${image.zoom})`,
  filter: galleryFilterValues[image.filter],
  transformOrigin: 'center center'
});

const GalleryPage: React.FC<GalleryPageProps> = ({
  groups,
  eyebrow = 'Galerie REST||ART',
  title = 'Fotografie',
  highlight = 'z projektu',
  description = 'Veřejný vizuální archiv projektu REST||ART INTEGRACE rozdělený podle data, tématu a jednotlivých momentů v terénu.'
}) => {
  const publishedGroups = useMemo(
    () => sortGalleryGroups(groups).filter((group) => group.published && group.images.length > 0),
    [groups]
  );

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeGroup = useMemo(
    () => publishedGroups.find((group) => group.id === activeGroupId) ?? null,
    [activeGroupId, publishedGroups]
  );

  useEffect(() => {
    if (!activeGroup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveGroupId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeGroup]);

  useEffect(() => {
    if (!activeGroup) {
      setActiveImageIndex(0);
      return;
    }

    if (activeImageIndex >= activeGroup.images.length) {
      setActiveImageIndex(0);
    }
  }, [activeGroup, activeImageIndex]);

  const handleOpenGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setActiveImageIndex(0);
  };

  const activeImage = activeGroup?.images[activeImageIndex] ?? null;
  const hasMultipleImages = (activeGroup?.images.length ?? 0) > 1;

  const showPrevImage = () => {
    if (!activeGroup) return;
    setActiveImageIndex((prev) => (prev - 1 + activeGroup.images.length) % activeGroup.images.length);
  };

  const showNextImage = () => {
    if (!activeGroup) return;
    setActiveImageIndex((prev) => (prev + 1) % activeGroup.images.length);
  };

  return (
    <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-12">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
              {eyebrow}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
              {title} <br />
              <span className="text-cyan-300 headline-thin">{highlight}</span>
            </h2>
          </div>
          <p className="text-white/40 font-light max-w-xl text-sm leading-relaxed">{description}</p>
        </div>

        {publishedGroups.length === 0 ? (
          <div className="glass-panel rounded-[2.8rem] border-white/10 p-10 md:p-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Galerie REST||ART</p>
            <h3 className="mt-4 text-3xl font-black text-white">Zatím tu nejsou publikované skupiny fotek.</h3>
            <p className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed text-white/45">
              Jakmile budou zveřejněny první fotografie, objeví se tady automaticky rozdělené podle data a tématu.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {publishedGroups.map((group) => {
              const coverImage = group.images[0];

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleOpenGroup(group.id)}
                  className="group glass-panel overflow-hidden rounded-[2.2rem] border-white/10 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25"
                >
                  <div className="relative overflow-hidden border-b border-white/10 bg-black/20">
                    <img
                      src={coverImage.url}
                      alt={coverImage.alt || group.title}
                      style={getGalleryImageStyle(coverImage)}
                      className="aspect-[4/3] w-full bg-[#061416] p-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                          {formatGalleryDate(group.eventDate)}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/85">
                        <Images size={12} />
                        {group.images.length}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="line-clamp-2 text-xl font-black uppercase leading-tight text-white group-hover:text-cyan-300 transition-colors">
                      {group.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-white/46">
                      {group.description.trim().length > 0 ? group.description : coverImage.caption || 'Otevřít složku galerie'}
                    </p>
                    <div className="pt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/28">
                      Otevřít složku
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeGroup && activeImage && (
        <div className="fixed inset-0 z-[220] overflow-y-auto p-4 md:p-8">
          <button
            type="button"
            aria-label="Zavřít galerii"
            onClick={() => setActiveGroupId(null)}
            className="absolute inset-0 bg-[#010708]/68 backdrop-blur-md"
          />

          <div className="relative z-10 mx-auto my-4 w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[2.8rem] border border-cyan-400/15 bg-[#041013]/86 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-[#041013]/92 px-5 py-5 backdrop-blur-xl md:px-7">
              <div className="min-w-0 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
                  {formatGalleryDate(activeGroup.eventDate)}
                </p>
                <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight text-white">
                  {activeGroup.title}
                </h3>
                {activeGroup.description.trim().length > 0 && (
                  <p className="max-w-2xl text-sm leading-relaxed text-white/45">
                    {activeGroup.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveGroupId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
                aria-label="Zavřít galerii"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr),280px] md:p-7">
              <div className="space-y-4">
                <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/25 md:min-h-[420px]">
                  <img
                    src={activeImage.url}
                    alt={activeImage.alt || `${activeGroup.title} ${activeImageIndex + 1}`}
                    style={getGalleryImageStyle(activeImage)}
                    className="max-h-[65vh] w-full bg-[#061416] p-4"
                  />

                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={showPrevImage}
                        className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/55 text-white/80 transition hover:border-cyan-400/30 hover:text-cyan-300"
                        aria-label="Předchozí obrázek"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={showNextImage}
                        className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/55 text-white/80 transition hover:border-cyan-400/30 hover:text-cyan-300"
                        aria-label="Další obrázek"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/82">
                    {activeImageIndex + 1} / {activeGroup.images.length}
                  </div>
                </div>

                {hasMultipleImages && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {activeGroup.images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`shrink-0 overflow-hidden rounded-[1.4rem] border transition ${
                          index === activeImageIndex
                            ? 'border-cyan-400/40 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]'
                            : 'border-white/10 opacity-70 hover:border-cyan-400/20 hover:opacity-100'
                        }`}
                        aria-label={`Zobrazit obrázek ${index + 1}`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `${activeGroup.title} ${index + 1}`}
                          style={getGalleryImageStyle(image)}
                          className="h-20 w-28 bg-[#061416] p-1.5"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-4 rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
                    Aktivní snímek
                  </p>
                  <h4 className="mt-3 text-xl font-black leading-tight text-white">
                    {activeImage.alt || `${activeGroup.title} ${activeImageIndex + 1}`}
                  </h4>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Popis</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {activeImage.caption || activeImage.alt || activeGroup.description || 'Bez doplňkového popisu.'}
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4 space-y-3 text-sm text-white/52">
                  <div className="flex items-center justify-between gap-3">
                    <span>Snímků ve složce</span>
                    <span className="font-semibold text-white">{activeGroup.images.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Datum</span>
                    <span className="font-semibold text-cyan-300">{formatGalleryDate(activeGroup.eventDate)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Zobrazení</span>
                    <span className="font-semibold text-emerald-300">Slideshow</span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-white/34">
                  Otevřená složka galerie se slideshow a rychlým přepínáním mezi jednotlivými snímky.
                </p>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
