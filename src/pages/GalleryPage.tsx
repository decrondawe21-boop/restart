import React, { useMemo } from 'react';
import MediaEnlarge from '../components/MediaEnlarge';
import { sortGalleryGroups, type GalleryGroup } from '../lib/siteSettings';

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
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Galerie čeká na obsah</p>
            <h3 className="mt-4 text-3xl font-black text-white">Zatím tu nejsou publikované skupiny fotek.</h3>
            <p className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed text-white/45">
              Jakmile v administraci přidáš první skupinu, nastavíš datum, nadpis a publikuješ ji, objeví se tady automaticky.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {publishedGroups.map((group) => (
              <article
                key={group.id}
                className="glass-panel rounded-[2.8rem] border-white/10 p-6 md:p-8 lg:p-10 space-y-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                      {formatGalleryDate(group.eventDate)}
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-tight">
                        {group.title}
                      </h3>
                      {group.description.trim().length > 0 && (
                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/48">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-white/10 bg-black/20 px-5 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Snímků</p>
                    <p className="mt-2 text-3xl font-black text-cyan-300">{group.images.length}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 ${
                        group.images.length === 1 ? 'sm:col-span-2 xl:col-span-3' : ''
                      }`}
                    >
                      <MediaEnlarge
                        src={image.url}
                        alt={image.alt || `${group.title} ${index + 1}`}
                        caption={image.caption || image.alt || group.title}
                        className="aspect-[4/3]"
                        imgClassName="h-full"
                      />
                      {(image.caption.trim().length > 0 || image.alt.trim().length > 0) && (
                        <div className="px-5 py-4">
                          <p className="text-sm leading-relaxed text-white/52">
                            {image.caption || image.alt}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
