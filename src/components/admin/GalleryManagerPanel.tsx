import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Eye,
  EyeOff,
  HelpCircle,
  ImagePlus,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchSiteSettings,
  saveSiteSetting,
  uploadImageFileToStorage,
  uploadImageFromUrlToStorage
} from '../../lib/cms';
import {
  defaultGalleryGroups,
  galleryGroupsSettingKey,
  normalizeGalleryGroups,
  sortGalleryGroups,
  type GalleryGroup,
  type GalleryImageItem
} from '../../lib/siteSettings';
import AdminInfoTooltip from './AdminInfoTooltip';
import AdminStickyActionBar from './AdminStickyActionBar';

const createId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyGroup = (): GalleryGroup => ({
  id: createId('gallery-group'),
  title: 'Nová galerie',
  eventDate: new Date().toISOString().slice(0, 10),
  description: '',
  published: false,
  images: []
});

const createGalleryImageItem = (url: string, fallbackAlt: string): GalleryImageItem => ({
  id: createId('gallery-image'),
  url,
  alt: fallbackAlt,
  caption: '',
  fit: 'contain',
  zoom: 1,
  focusX: 50,
  focusY: 50,
  filter: 'none'
});

const galleryFilterLabels: Record<GalleryImageItem['filter'], string> = {
  none: 'Bez filtru',
  mono: 'Mono',
  warm: 'Warm',
  cool: 'Cool',
  dramatic: 'Dramatic',
  soft: 'Soft'
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

const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const FieldLabel: React.FC<{ label: string; hint: string }> = ({ label, hint }) => (
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

const GalleryManagerPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [groups, setGroups] = useState(defaultGalleryGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAssetBusy, setIsAssetBusy] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );
  const selectedImage = useMemo(
    () => selectedGroup?.images.find((image) => image.id === selectedImageId) ?? null,
    [selectedGroup, selectedImageId]
  );
  const selectedImageIndex = useMemo(
    () => selectedGroup?.images.findIndex((image) => image.id === selectedImageId) ?? -1,
    [selectedGroup, selectedImageId]
  );

  const totalImages = useMemo(
    () => groups.reduce((sum, group) => sum + group.images.length, 0),
    [groups]
  );

  const publishedGroupsCount = useMemo(
    () => groups.filter((group) => group.published).length,
    [groups]
  );

  const syncGalleryGroups = async () => {
    setIsLoading(true);
    setError('');

    try {
      const records = await fetchSiteSettings([galleryGroupsSettingKey]);
      const nextGroups = normalizeGalleryGroups(records[0]?.value_json);
      setGroups(nextGroups);
      setSelectedGroupId((current) => {
        if (current && nextGroups.some((group) => group.id === current)) return current;
        return nextGroups[0]?.id ?? null;
      });
      setIsDirty(false);
    } catch (caughtError) {
      setGroups(defaultGalleryGroups);
      setSelectedGroupId(null);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení galerie selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void syncGalleryGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId && groups.some((group) => group.id === selectedGroupId)) return;
    setSelectedGroupId(groups[0]?.id ?? null);
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (!selectedImageId) return;
    if (selectedGroup?.images.some((image) => image.id === selectedImageId)) return;
    setSelectedImageId(null);
  }, [selectedGroup, selectedImageId]);

  useEffect(() => {
    if (!selectedImageId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImageId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedImageId]);

  const updateGroups = (updater: (current: GalleryGroup[]) => GalleryGroup[]) => {
    setGroups((current) => sortGalleryGroups(updater(current)));
    setIsDirty(true);
    setNotice('');
    setError('');
  };

  const updateSelectedGroup = (patch: Partial<GalleryGroup>) => {
    if (!selectedGroupId) return;
    updateGroups((current) =>
      current.map((group) => (group.id === selectedGroupId ? { ...group, ...patch } : group))
    );
  };

  const updateSelectedGroupImages = (updater: (images: GalleryImageItem[]) => GalleryImageItem[]) => {
    if (!selectedGroupId) return;
    updateGroups((current) =>
      current.map((group) =>
        group.id === selectedGroupId ? { ...group, images: updater(group.images) } : group
      )
    );
  };

  const updateSelectedImage = (imageId: string, patch: Partial<GalleryImageItem>) => {
    updateSelectedGroupImages((current) =>
      current.map((image) => (image.id === imageId ? { ...image, ...patch } : image))
    );
  };

  const removeSelectedImage = (imageId: string) => {
    updateSelectedGroupImages((current) => current.filter((image) => image.id !== imageId));
    setSelectedImageId((current) => (current === imageId ? null : current));
  };

  const handleCreateGroup = () => {
    const nextGroup = createEmptyGroup();
    updateGroups((current) => [nextGroup, ...current]);
    setSelectedGroupId(nextGroup.id);
    setSelectedImageId(null);
    setNotice('Nová galerie je připravená. Doplň nadpis, datum a ulož změny.');
  };

  const handleDeleteGroup = () => {
    if (!selectedGroup) return;
    if (!window.confirm(`Opravdu chceš odstranit galerii „${selectedGroup.title}“?`)) return;

    const removedId = selectedGroup.id;
    updateGroups((current) => current.filter((group) => group.id !== removedId));
    setSelectedGroupId((current) => (current === removedId ? null : current));
    setSelectedImageId(null);
    setNotice(`Galerie „${selectedGroup.title}“ je odebraná z pracovního stavu. Klikni na Uložit, aby se smazání propsalo do databáze.`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      await saveSiteSetting(galleryGroupsSettingKey, groups);
      setIsDirty(false);
      setNotice('Galerie byla uložena. Veřejná stránka i menu teď čtou aktuální skupiny z databáze.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení galerie selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadFromUrl = async () => {
    if (!selectedGroup || !assetUrl.trim()) return;

    setIsAssetBusy(true);
    setError('');
    setNotice('');

    try {
      const uploadedUrl = await uploadImageFromUrlToStorage(assetUrl.trim(), `gallery/${selectedGroup.id}`);
      const nextImage = createGalleryImageItem(uploadedUrl, selectedGroup.title);
      updateSelectedGroupImages((current) => [
        ...current,
        nextImage
      ]);
      setSelectedImageId(nextImage.id);
      setAssetUrl('');
      setNotice('Obrázek byl přidaný do galerie. Změnu ještě potvrď tlačítkem Uložit.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Import obrázku z URL selhal.');
    } finally {
      setIsAssetBusy(false);
    }
  };

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!selectedGroup || !file) return;

    setIsAssetBusy(true);
    setError('');
    setNotice('');

    try {
      const uploadedUrl = await uploadImageFileToStorage(file, `gallery/${selectedGroup.id}`);
      const nextImage = createGalleryImageItem(uploadedUrl, selectedGroup.title);
      updateSelectedGroupImages((current) => [
        ...current,
        nextImage
      ]);
      setSelectedImageId(nextImage.id);
      setNotice('Soubor byl nahraný do galerie. Změnu ještě potvrď tlačítkem Uložit.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nahrání souboru selhalo.');
    } finally {
      setIsAssetBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderSelectedGroupEditor = () => {
    if (!selectedGroup) {
      return (
        <div className="rounded-[2.4rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Galerie ještě nezačala</p>
          <h3 className="mt-4 text-3xl font-black text-white">Vyber skupinu nebo založ novou.</h3>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <AdminInfoTooltip
              title="Nová galerie"
              description="Každá galerie drží vlastní datum, nadpis, popis a sadu obrázků. Po publikaci se objeví na veřejné stránce."
              label="Nápověda"
              align="left"
            />
            <button
              type="button"
              onClick={handleCreateGroup}
              className="inline-flex items-center gap-2 rounded-[1.5rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400"
            >
              <Plus size={15} />
              Založit galerii
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="glass-panel rounded-[3rem] border-white/10 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                Skupina fotografií
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">Detail galerie</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <AdminInfoTooltip
                title="Detail galerie"
                description="Tady upravíš datum, nadpis, popis, publikaci a jednotlivé obrázky. Veřejná stránka zobrazuje jen publikované skupiny s alespoň jedním snímkem."
                label="Nápověda"
                align="left"
              />
              <button
                type="button"
                onClick={handleDeleteGroup}
                className="inline-flex items-center gap-2 rounded-[1.6rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-red-200 transition hover:bg-red-500/15"
              >
                <Trash2 size={15} />
                Smazat skupinu
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-[1.6rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Uložit galerii
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel label="Nadpis skupiny" hint="Název celé galerie. Veřejně se ukáže jako hlavní nadpis daného bloku." />
              <input
                type="text"
                value={selectedGroup.title}
                onChange={(event) => updateSelectedGroup({ title: event.target.value })}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
              />
            </div>

            <div className="space-y-2">
              <FieldLabel label="Datum" hint="Používá se pro řazení i veřejný štítek nad galerií." />
              <div className="relative">
                <input
                  type="date"
                  value={selectedGroup.eventDate}
                  onChange={(event) => updateSelectedGroup({ eventDate: event.target.value })}
                  className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 pr-12 text-white outline-none transition focus:border-cyan-400/30"
                />
                <CalendarDays size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300" />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <FieldLabel label="Popis skupiny" hint="Krátký veřejný kontext. Může to být akce, lokalita, program nebo stručné vysvětlení." />
              <textarea
                value={selectedGroup.description}
                onChange={(event) => updateSelectedGroup({ description: event.target.value })}
                rows={4}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => updateSelectedGroup({ published: !selectedGroup.published })}
                className={`inline-flex items-center gap-3 rounded-[1.6rem] border px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition ${
                  selectedGroup.published
                    ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                    : 'border-white/10 bg-white/[0.04] text-white/65 hover:border-cyan-400/30 hover:text-cyan-300'
                }`}
              >
                {selectedGroup.published ? <Eye size={15} /> : <EyeOff size={15} />}
                {selectedGroup.published ? 'Publikováno' : 'Pouze v adminu'}
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[3rem] border-white/10 p-6">
          <div className="mb-6 flex items-center gap-3">
            <ImagePlus size={18} className="text-cyan-400" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Obrázky galerie</p>
              <h3 className="mt-1 text-2xl font-black text-white">Přidání z URL nebo souboru</h3>
            </div>
          </div>

          <div className="space-y-4">
            <FieldLabel label="Zdrojová URL obrázku" hint="Vlož veřejnou URL obrázku a systém ji nahraje do storage pod danou galerii." />
            <input
              type="url"
              value={assetUrl}
              onChange={(event) => setAssetUrl(event.target.value)}
              className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
              placeholder="https://..."
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleUploadFromUrl}
                disabled={isAssetBusy || !assetUrl.trim()}
                className="inline-flex items-center gap-2 rounded-[1.4rem] bg-cyan-500 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-60"
              >
                {isAssetBusy ? <Loader2 size={15} className="animate-spin" /> : <Link2 size={15} />}
                Přidat z URL
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAssetBusy}
                className="inline-flex items-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-60"
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
            <p className="text-xs leading-relaxed text-white/38">
              Lokální soubory se před uploadem automaticky zmenší a zkomprimují pro web, aby galerie
              netahala zbytečně velké originály.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-400">Správa snímků</p>
                <h3 className="mt-2 text-2xl font-black text-white">Miniatury a rychlé úpravy</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                <SlidersHorizontal size={14} />
                {selectedGroup.images.length} {selectedGroup.images.length === 1 ? 'snímek' : selectedGroup.images.length < 5 ? 'snímky' : 'snímků'}
              </div>
            </div>

            {selectedGroup.images.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-5 py-6 text-sm text-white/45">
                Zatím tu nejsou žádné obrázky. Přidej první snímek přes URL nebo upload.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {selectedGroup.images.map((image, index) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03]"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedImageId(image.id)}
                      className="group relative block w-full overflow-hidden border-b border-white/10 bg-black/25 text-left"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || selectedGroup.title}
                        style={getGalleryImageStyle(image)}
                        className="aspect-[5/3] w-full bg-[#061416] p-1.5 transition duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute left-2 top-2 inline-flex items-center rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/85">
                        {index + 1}
                      </div>
                      {image.filter !== 'none' && (
                        <div className="absolute right-2 top-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-300">
                          {galleryFilterLabels[image.filter]}
                        </div>
                      )}
                    </button>

                    <div className="space-y-3 p-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
                          Obrázek {index + 1}
                        </p>
                        <h4 className="mt-1.5 line-clamp-1 text-xs font-black text-white">
                          {image.alt.trim().length > 0 ? image.alt : selectedGroup.title}
                        </h4>
                        <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-white/40">
                          {image.caption.trim().length > 0 ? image.caption : 'Bez popisku'}
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => updateSelectedGroupImages((current) => moveItem(current, index, index - 1))}
                          disabled={index === 0}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-35"
                          title="Posunout nahoru"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSelectedGroupImages((current) => moveItem(current, index, index + 1))}
                          disabled={index === selectedGroup.images.length - 1}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-35"
                          title="Posunout dolů"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedImageId(image.id)}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-500/8 text-cyan-200 transition hover:border-cyan-400/30 hover:text-cyan-100"
                          title="Otevřít editor"
                        >
                          <Search size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(image.id)}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/15"
                          title="Odebrat obrázek"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderImageEditorModal = () => {
    if (!selectedGroup || !selectedImage) return null;

    return (
      <div className="fixed inset-0 z-[260] p-4 md:p-8">
        <button
          type="button"
          aria-label="Zavřít editor obrázku"
          onClick={() => setSelectedImageId(null)}
          className="absolute inset-0 bg-[#010708]/70 backdrop-blur-md"
        />

        <div className="relative z-10 mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2.8rem] border border-cyan-400/15 bg-[#041013]/88 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#041013]/92 px-5 py-5 backdrop-blur-xl md:px-7">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
                Editor snímku {selectedImageIndex + 1}
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {selectedImage.alt.trim().length > 0 ? selectedImage.alt : selectedGroup.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/42">
                Úpravy jsou nedestruktivní. Měníš způsob zobrazení náhledu a veřejné prezentace, ne původní soubor.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedImageId(null)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
              aria-label="Zavřít editor obrázku"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid max-h-[calc(100vh-8rem)] gap-6 overflow-y-auto p-5 xl:grid-cols-[minmax(0,1.1fr),380px] md:p-7">
            <section className="space-y-5">
              <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[2.4rem] border border-white/10 bg-black/25 md:min-h-[520px]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || selectedGroup.title}
                  style={getGalleryImageStyle(selectedImage)}
                  className="h-full w-full bg-[#061416] p-4 transition duration-200"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Režim</p>
                  <p className="mt-3 text-lg font-black text-white">
                    {selectedImage.fit === 'cover' ? 'Výřez / cover' : 'Celý obrázek / contain'}
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Zoom</p>
                  <p className="mt-3 text-lg font-black text-white">{selectedImage.zoom.toFixed(2)}×</p>
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Filtr</p>
                  <p className="mt-3 text-lg font-black text-white">{galleryFilterLabels[selectedImage.filter]}</p>
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FieldLabel label="Alt text" hint="Přístupný popis obrázku. Pomáhá čtečkám i SEO." />
                    <input
                      type="text"
                      value={selectedImage.alt}
                      onChange={(event) => updateSelectedImage(selectedImage.id, { alt: event.target.value })}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel label="Popisek" hint="Veřejný krátký popis zobrazený pod fotkou v galerii." />
                    <textarea
                      value={selectedImage.caption}
                      onChange={(event) => updateSelectedImage(selectedImage.id, { caption: event.target.value })}
                      rows={4}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Výřez a zobrazení</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {([
                    ['contain', 'Celý snímek'],
                    ['cover', 'Ořez / výřez']
                  ] as const).map(([fit, label]) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => updateSelectedImage(selectedImage.id, { fit })}
                      className={`rounded-[1.4rem] border px-4 py-4 text-left text-xs font-black uppercase tracking-[0.18em] transition ${
                        selectedImage.fit === fit
                          ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100'
                          : 'border-white/10 bg-black/20 text-white/60 hover:border-cyan-400/20 hover:text-cyan-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel label="Zoom" hint="Přiblížení náhledu a veřejného zobrazení tohoto snímku." />
                      <div className="text-xs font-semibold text-cyan-200">{selectedImage.zoom.toFixed(2)}×</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedImage(selectedImage.id, {
                            zoom: Math.max(1, Number((selectedImage.zoom - 0.1).toFixed(2)))
                          })
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                        aria-label="Oddálit obrázek"
                      >
                        <ZoomOut size={15} />
                      </button>
                      <input
                        type="range"
                        min={1}
                        max={2.5}
                        step={0.05}
                        value={selectedImage.zoom}
                        onChange={(event) =>
                          updateSelectedImage(selectedImage.id, { zoom: Number(event.target.value) })
                        }
                        className="h-2 w-full cursor-pointer accent-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedImage(selectedImage.id, {
                            zoom: Math.min(2.5, Number((selectedImage.zoom + 0.1).toFixed(2)))
                          })
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                        aria-label="Přiblížit obrázek"
                      >
                        <ZoomIn size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel label="Horizontální fokus" hint="Určuje, která část obrázku zůstane v centru výřezu." />
                      <div className="text-xs font-semibold text-white/55">{Math.round(selectedImage.focusX)}%</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={selectedImage.focusX}
                      onChange={(event) =>
                        updateSelectedImage(selectedImage.id, { focusX: Number(event.target.value) })
                      }
                      className="h-2 w-full cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel label="Vertikální fokus" hint="Posouvá výřez nahoru nebo dolů." />
                      <div className="text-xs font-semibold text-white/55">{Math.round(selectedImage.focusY)}%</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={selectedImage.focusY}
                      onChange={(event) =>
                        updateSelectedImage(selectedImage.id, { focusY: Number(event.target.value) })
                      }
                      className="h-2 w-full cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Filtry</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {(Object.keys(galleryFilterLabels) as GalleryImageItem['filter'][]).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => updateSelectedImage(selectedImage.id, { filter })}
                      className={`rounded-[1.4rem] border px-4 py-4 text-left text-xs font-black uppercase tracking-[0.18em] transition ${
                        selectedImage.filter === filter
                          ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100'
                          : 'border-white/10 bg-black/20 text-white/60 hover:border-cyan-400/20 hover:text-cyan-200'
                      }`}
                    >
                      {galleryFilterLabels[filter]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Akce se snímkem</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      selectedImageIndex > 0 &&
                      updateSelectedGroupImages((current) => moveItem(current, selectedImageIndex, selectedImageIndex - 1))
                    }
                    disabled={selectedImageIndex <= 0}
                    className="inline-flex h-12 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/20 text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-35"
                    title="Posunout obrázek nahoru"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      selectedImageIndex >= 0 &&
                      selectedImageIndex < selectedGroup.images.length - 1 &&
                      updateSelectedGroupImages((current) => moveItem(current, selectedImageIndex, selectedImageIndex + 1))
                    }
                    disabled={selectedImageIndex < 0 || selectedImageIndex >= selectedGroup.images.length - 1}
                    className="inline-flex h-12 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/20 text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-35"
                    title="Posunout obrázek dolů"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(selectedImage.id)}
                    className="inline-flex h-12 items-center justify-center rounded-[1.4rem] border border-red-500/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/15"
                    title="Smazat obrázek"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-black/20 px-4 py-3 text-xs leading-relaxed text-white/35 break-all">
                  {selectedImage.url}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  };

    return (
      <div className="space-y-8">
        <AdminStickyActionBar
          title={selectedGroup ? `Galerie · ${selectedGroup.title}` : 'Galerie'}
          status={error ? 'error' : isSaving ? 'saving' : isDirty ? 'dirty' : notice ? 'saved' : 'idle'}
          previewHref="/galerie"
          message={
            error ||
            notice ||
            (isDirty ? 'Máš rozpracované změny. Ulož je, aby se propsaly na veřejný web.' : 'Změny galerie jsou pod kontrolou.')
          }
          actions={
            <>
              <button
                type="button"
                onClick={() => void syncGalleryGroups()}
                disabled={isSaving || isLoading}
                className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Obnovit
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] bg-cyan-500 px-4 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-cyan-400 disabled:opacity-55"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Uložit
              </button>
            </>
          }
        />

        <div className="grid gap-8 xl:grid-cols-[330px,1fr]">
        <aside className="glass-panel rounded-[3rem] border-white/10 p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Skupiny galerie</p>
              <h2 className="mt-2 text-2xl font-black text-white">Seznam galerií</h2>
            </div>
            <div className="flex items-center gap-3">
              <AdminInfoTooltip
                title="Jak funguje galerie"
                description="Nápověda je schovaná sem, aby seznam skupin zůstal krátký a pracovní."
                items={[
                  'Každá galerie má vlastní nadpis, datum a blok obrázků.',
                  'Fotky přidáš přes upload nebo URL a můžeš je dál upravovat po jedné.',
                  'Publikované skupiny se po uložení propíšou na veřejný web.'
                ]}
                label="Nápověda"
                align="left"
              />
              <button
                type="button"
                onClick={() => void syncGalleryGroups()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                title="Obnovit galerii"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ['Skupiny', groups.length],
              ['Publikované', publishedGroupsCount],
              ['Obrázky', totalImages]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-3 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{label}</p>
                <p className="mt-3 text-xl font-black text-white md:text-2xl">{value}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCreateGroup}
            className="mt-5 flex w-full items-center gap-3 rounded-[1.8rem] border border-dashed border-cyan-400/20 bg-cyan-500/5 px-4 py-4 text-left transition hover:border-cyan-400/35"
          >
            <Plus size={16} className="text-cyan-300" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Nová galerie</p>
              <p className="mt-1 text-sm text-white/40">Připraví prázdnou skupinu s dnešním datem.</p>
            </div>
          </button>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-white/50">
                <Loader2 size={16} className="animate-spin" />
                Načítám galerie…
              </div>
            ) : groups.length === 0 ? (
              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/45">
                Zatím tu nejsou žádné galerie.
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className={`w-full rounded-[1.8rem] border px-4 py-4 text-left transition ${
                    selectedGroupId === group.id
                      ? 'border-cyan-400/30 bg-cyan-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setSelectedImageId(null);
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
                        {group.eventDate || 'Bez data'}
                      </p>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          group.published
                            ? 'bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]'
                            : 'bg-white/20'
                        }`}
                        title={group.published ? 'Veřejná galerie' : 'Draft galerie'}
                      />
                    </div>
                    <h3 className="mt-3 text-lg font-black text-white">{group.title}</h3>
                    <p className="mt-2 text-sm text-white/40">
                      {group.images.length} {group.images.length === 1 ? 'obrázek' : group.images.length < 5 ? 'obrázky' : 'obrázků'}
                    </p>
                  </button>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setSelectedImageId(null);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-500/8 text-cyan-200 transition hover:border-cyan-400/30 hover:text-cyan-100"
                      title={`Otevřít galerii ${group.title}`}
                      aria-label={`Otevřít galerii ${group.title}`}
                    >
                      <Search size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="space-y-6">
          {renderSelectedGroupEditor()}

          {(notice || error || isDirty) && (
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
                {!notice && !error && isDirty && (
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                    Máš rozpracované změny. Klikni na Uložit galerii, aby se propsaly na veřejný web.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {renderImageEditorModal()}
    </div>
  );
};

export default GalleryManagerPanel;
