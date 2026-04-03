import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  HelpCircle,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Upload
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MatrixFxHero from '../MatrixFxHero';
import {
  fetchSiteSettings,
  saveSiteSetting,
  uploadImageFileToStorage,
  uploadImageFromUrlToStorage
} from '../../lib/cms';
import {
  defaultHomepageLayout,
  defaultHomepageMediaSlots,
  homepageLayoutSettingKey,
  homepageMediaSlotDefinitions,
  homepageMediaSlotsSettingKey,
  homepageSectionDefinitions,
  normalizeHomepageLayout,
  normalizeHomepageMediaSlots,
  type HomepageMediaSlotId,
  type HomepageMediaSlotSetting,
  type HomepageSectionSetting
} from '../../lib/siteSettings';

const BuilderFieldLabel: React.FC<{ label: string; hint: string }> = ({ label, hint }) => (
  <div className="flex items-center gap-2">
    <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{label}</label>
    <div className="group relative">
      <HelpCircle size={13} className="cursor-help text-white/25 transition group-hover:text-cyan-300" />
      <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-72 rounded-[1.2rem] border border-cyan-400/20 bg-[#041013]/96 px-4 py-3 text-xs font-medium leading-relaxed text-white/70 opacity-0 shadow-2xl shadow-black/30 transition duration-200 group-hover:opacity-100">
        {hint}
      </div>
    </div>
  </div>
);

const HomepageBuilderPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [layout, setLayout] = useState<HomepageSectionSetting[]>(defaultHomepageLayout);
  const [slots, setSlots] = useState<HomepageMediaSlotSetting[]>(defaultHomepageMediaSlots);
  const [selectedSlotId, setSelectedSlotId] = useState<HomepageMediaSlotId>(homepageMediaSlotDefinitions[0].id);
  const [assetUrl, setAssetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) ?? defaultHomepageMediaSlots[0],
    [selectedSlotId, slots]
  );

  const visibleSectionsCount = useMemo(() => layout.filter((section) => section.visible).length, [layout]);
  const hiddenSectionsCount = layout.length - visibleSectionsCount;
  const customizedSlotsCount = useMemo(
    () => slots.filter((slot) => slot.src.trim().length > 0).length,
    [slots]
  );
  const firstVisibleSection = useMemo(() => layout.find((section) => section.visible)?.id ?? null, [layout]);
  const firstVisibleSectionLabel =
    homepageSectionDefinitions.find((section) => section.id === firstVisibleSection)?.label ?? 'Žádná sekce';

  const syncHomepageSettings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const records = await fetchSiteSettings([homepageLayoutSettingKey, homepageMediaSlotsSettingKey]);
      const recordsByKey = new Map(records.map((record) => [record.key, record.value_json]));

      setLayout(normalizeHomepageLayout(recordsByKey.get(homepageLayoutSettingKey)));
      setSlots(normalizeHomepageMediaSlots(recordsByKey.get(homepageMediaSlotsSettingKey)));
    } catch (caughtError) {
      setLayout(defaultHomepageLayout);
      setSlots(defaultHomepageMediaSlots);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení nastavení homepage selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void syncHomepageSettings();
  }, []);

  useEffect(() => {
    setAssetUrl(selectedSlot.src);
  }, [selectedSlot]);

  const updateSlot = (patch: Partial<HomepageMediaSlotSetting>) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === selectedSlotId
          ? {
              ...slot,
              ...patch
            }
          : slot
      )
    );
  };

  const moveSection = (id: HomepageSectionSetting['id'], direction: -1 | 1) => {
    setLayout((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleImportFromUrl = async () => {
    if (!assetUrl.trim()) return;

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const uploadedUrl = await uploadImageFromUrlToStorage(assetUrl.trim(), `homepage/${selectedSlotId}`);
      updateSlot({ src: uploadedUrl });
      setAssetUrl(uploadedUrl);
      setNotice('Obrázek homepage byl načten z URL a uložen do Supabase Storage.');
    } catch (caughtError) {
      updateSlot({ src: assetUrl.trim() });
      setNotice('Upload z URL se nepovedl, ale odkaz jsem nastavil přímo do slotu.');
      setError(caughtError instanceof Error ? caughtError.message : 'Upload z URL selhal.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const uploadedUrl = await uploadImageFileToStorage(file, `homepage/${selectedSlotId}`);
      updateSlot({ src: uploadedUrl });
      setAssetUrl(uploadedUrl);
      setNotice('Soubor byl nahrán do Supabase Storage a přiřazen vybranému slotu.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nahrání souboru selhalo.');
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveHomepage = async () => {
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      await Promise.all([
        saveSiteSetting(homepageLayoutSettingKey, layout),
        saveSiteSetting(homepageMediaSlotsSettingKey, slots)
      ]);

      setNotice('Homepage builder byl uložen. Veřejná homepage teď čte nové pořadí sekcí a obrazové sloty.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení homepage builderu selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setLayout(defaultHomepageLayout);
    setSlots(defaultHomepageMediaSlots);
    setSelectedSlotId(homepageMediaSlotDefinitions[0].id);
    setAssetUrl('');
    setNotice('Lokálně jsem obnovil výchozí konfiguraci. Pro propsání na web ji ještě ulož.');
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.02fr,0.98fr]">
        <div className="glass-panel rounded-[3rem] border-white/10 p-4">
          <MatrixFxHero
            isDark
            darkLogoSrc="/images/podklady/branding/logo-9.png"
            lightLogoSrc="/images/podklady/branding/logo-main.png"
            darkLogoAlt="Homepage builder dashboard"
            lightLogoAlt="Homepage builder dashboard"
            revealFrom="bottom"
            label="Homepage Builder"
            description="Spravuj pevné pozice, řazení sekcí a postupně přetvářej homepage z hardcoded layoutu do editovatelných widgetů."
            bulge={{ type: 'ripple', duration: 4, intensity: 14, repeat: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              label: 'Viditelné sekce',
              value: visibleSectionsCount,
              description: 'Kolik homepage bloků je právě zapnutých.',
              accent: 'text-cyan-300',
              bg: 'bg-cyan-500/10'
            },
            {
              label: 'Skryté sekce',
              value: hiddenSectionsCount,
              description: 'Sekce vypnuté pro veřejnou homepage.',
              accent: 'text-amber-300',
              bg: 'bg-amber-500/10'
            },
            {
              label: 'Vlastní sloty',
              value: customizedSlotsCount,
              description: 'Počet obrazových pozic s vlastním uloženým obrázkem.',
              accent: 'text-emerald-300',
              bg: 'bg-emerald-500/10'
            },
            {
              label: 'První sekce',
              value: firstVisibleSectionLabel,
              description: 'První viditelný blok podle aktuálního pořadí.',
              accent: 'text-teal-300',
              bg: 'bg-teal-500/10'
            }
          ].map((card) => (
            <div key={card.label} className="glass-panel rounded-[2.4rem] border-white/10 p-5">
              <div className={`inline-flex rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${card.bg} ${card.accent}`}>
                {card.label}
              </div>
              <p className="mt-5 text-2xl font-black text-white md:text-3xl">{card.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/40">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
      <aside className="glass-panel rounded-[3rem] border-white/10 p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Homepage builder</p>
            <h2 className="mt-2 text-2xl font-black text-white">Widgety a sloty</h2>
          </div>
          <button
            type="button"
            onClick={() => void syncHomepageSettings()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
            title="Obnovit nastavení homepage"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center gap-3">
              <LayoutTemplate size={16} className="text-cyan-300" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Sekce</p>
                <p className="text-sm text-white/45">Zapnutí, vypnutí a řazení homepage bloků.</p>
              </div>
            </div>

            <div className="space-y-3">
              {layout.map((item, index) => {
                const definition = homepageSectionDefinitions.find((section) => section.id === item.id);
                if (!definition) return null;

                return (
                  <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">{definition.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/35">{definition.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLayout((prev) =>
                            prev.map((section) =>
                              section.id === item.id
                                ? {
                                    ...section,
                                    visible: !section.visible
                                  }
                                : section
                            )
                          )
                        }
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
                          item.visible
                            ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300'
                            : 'border-white/10 bg-white/[0.03] text-white/35'
                        }`}
                        title={item.visible ? 'Skrýt sekci' : 'Zobrazit sekci'}
                      >
                        {item.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSection(item.id, -1)}
                        disabled={index === 0}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-30"
                        title="Posunout nahoru"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(item.id, 1)}
                        disabled={index === layout.length - 1}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-30"
                        title="Posunout dolů"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center gap-3">
              <ImagePlus size={16} className="text-cyan-300" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Obrazové sloty</p>
                <p className="text-sm text-white/45">Pevné pozice na homepage bez zásahu do kódu.</p>
              </div>
            </div>

            <div className="space-y-3">
              {homepageMediaSlotDefinitions.map((slot) => {
                const current = slots.find((item) => item.id === slot.id);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                      selectedSlotId === slot.id
                        ? 'border-cyan-400/30 bg-cyan-500/10'
                        : 'border-white/10 bg-black/20 hover:border-cyan-400/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{slot.label}</p>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">{slot.recommendedAspect}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-white/35">{slot.description}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-cyan-400/70">
                      {current?.src ? 'vlastní obrázek nastaven' : 'zatím fallback z kódu'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Správa homepage</p>
              <h2 className="mt-2 text-3xl font-black text-white">Postranní panel úprav</h2>
              <p className="mt-3 max-w-3xl text-sm text-white/40">
                Tahle první verze objektivizuje homepage jako seznam widgetů a fixních slotů. Sekce teď můžeš přeskupovat,
                vypínat a měnit klíčové vizuály bez editace `index.tsx`.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-2 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                <RefreshCw size={15} />
                Výchozí stav
              </button>
              <button
                type="button"
                onClick={handleSaveHomepage}
                disabled={isSaving || isLoading}
                className="inline-flex items-center gap-2 rounded-[1.6rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Uložit homepage
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-white/50">
              <Loader2 size={16} className="animate-spin" />
              Načítám konfiguraci homepage…
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-cyan-300" />
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Aktivní roadmapa homepage</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {layout.map((section, index) => {
                      const label =
                        homepageSectionDefinitions.find((definition) => definition.id === section.id)?.label ?? section.id;

                      return (
                        <div
                          key={section.id}
                          className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${
                            section.visible
                              ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200'
                              : 'border-white/10 bg-white/[0.03] text-white/30'
                          }`}
                        >
                          {index + 1}. {label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Aktivní slot</p>
                  <p className="mt-3 text-lg font-black text-white">{homepageMediaSlotDefinitions.find((slot) => slot.id === selectedSlotId)?.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/40">
                    {selectedSlot.src ? 'Používá vlastní obrázek uložený přes builder.' : 'Stále používá fallback z kódu.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Vybraný slot</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {homepageMediaSlotDefinitions.find((slot) => slot.id === selectedSlotId)?.label}
                  </h3>
                  <p className="mt-3 text-sm text-white/40">
                    {homepageMediaSlotDefinitions.find((slot) => slot.id === selectedSlotId)?.description}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <BuilderFieldLabel label="Zdrojová URL média" hint="Vlož veřejnou URL obrázku. Můžeš ji jen použít přímo, nebo se ji pokusit uložit do Supabase Storage." />
                    <input
                      type="url"
                      value={assetUrl}
                      onChange={(event) => setAssetUrl(event.target.value)}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <BuilderFieldLabel label="Alt text" hint="Přístupný popis obrázku. Použije se jako alt atribut obrázku na webu." />
                    <input
                      type="text"
                      value={selectedSlot.alt}
                      onChange={(event) => updateSlot({ alt: event.target.value })}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <BuilderFieldLabel label="Caption" hint="Popisek pro lightbox a zvětšené zobrazení, kde ho komponenta používá." />
                    <input
                      type="text"
                      value={selectedSlot.caption}
                      onChange={(event) => updateSlot({ caption: event.target.value })}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleImportFromUrl}
                    disabled={isSaving || !assetUrl.trim()}
                    className="inline-flex items-center gap-2 rounded-[1.4rem] bg-cyan-500 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-60"
                  >
                    <Upload size={15} />
                    Nahrát z URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateSlot({ src: assetUrl.trim() });
                      setNotice('Slot používá externí URL přímo bez uploadu.');
                      setError('');
                    }}
                    className="inline-flex items-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    <ImagePlus size={15} />
                    Použít URL přímo
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    <Upload size={15} />
                    Nahrát soubor
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadFile}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-white/[0.03]">
                  {selectedSlot.src ? (
                    <img
                      src={selectedSlot.src}
                      alt={selectedSlot.alt || 'Náhled homepage slotu'}
                      className="aspect-[5/4] w-full object-contain bg-black/40 p-4"
                    />
                  ) : (
                    <div className="flex aspect-[5/4] items-center justify-center px-8 text-center text-sm text-white/30">
                      Pro tenhle slot zatím není uložen vlastní obrázek. Veřejný web používá fallback z kódu.
                    </div>
                  )}
                </div>

                <div className="glass-panel rounded-[2.6rem] border-white/10 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Stav operace</p>
                  <div className="mt-4 space-y-3">
                    {notice && (
                      <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">
                        {notice}
                      </div>
                    )}
                    {error && (
                      <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}
                    {!notice && !error && (
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                        Pořadí sekcí i obrazové sloty se ukládají do Supabase a veřejná homepage je čte s fallbackem na dnešní hardcoded verzi.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Co je teď hotové</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/45">
                    <li>Zapínání a vypínání hlavních homepage sekcí.</li>
                    <li>Řazení sekcí bez zásahu do kódu.</li>
                    <li>Správa několika klíčových fixních obrazových pozic.</li>
                    <li>Upload obrázků z URL i souboru přes Supabase Storage.</li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
};

export default HomepageBuilderPanel;
