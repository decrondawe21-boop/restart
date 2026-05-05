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
  Trash2,
  Upload
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

  const handleCreateGroup = () => {
    const nextGroup = createEmptyGroup();
    updateGroups((current) => [nextGroup, ...current]);
    setSelectedGroupId(nextGroup.id);
    setNotice('Nová galerie je připravená. Doplň nadpis, datum a ulož změny.');
  };

  const handleDeleteGroup = () => {
    if (!selectedGroup) return;
    if (!window.confirm(`Opravdu chceš odstranit galerii „${selectedGroup.title}“?`)) return;

    const removedId = selectedGroup.id;
    updateGroups((current) => current.filter((group) => group.id !== removedId));
    setSelectedGroupId((current) => (current === removedId ? null : current));
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
      updateSelectedGroupImages((current) => [
        ...current,
        {
          id: createId('gallery-image'),
          url: uploadedUrl,
          alt: selectedGroup.title,
          caption: ''
        }
      ]);
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
      updateSelectedGroupImages((current) => [
        ...current,
        {
          id: createId('gallery-image'),
          url: uploadedUrl,
          alt: selectedGroup.title,
          caption: ''
        }
      ]);
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
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-white/45">
            Každá galerie drží vlastní datum, nadpis, popis a sadu obrázků. Po publikaci se okamžitě objeví na veřejné stránce.
          </p>
          <button
            type="button"
            onClick={handleCreateGroup}
            className="mt-6 inline-flex items-center gap-2 rounded-[1.5rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400"
          >
            <Plus size={15} />
            Založit galerii
          </button>
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
              <p className="mt-3 max-w-3xl text-sm text-white/40">
                Tady upravíš datum, nadpis, popis, publikaci a jednotlivé obrázky. Veřejná stránka zobrazuje jen publikované skupiny s alespoň jedním snímkem.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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
          </div>

          <div className="mt-8 space-y-4">
            {selectedGroup.images.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-5 py-6 text-sm text-white/45">
                Zatím tu nejsou žádné obrázky. Přidej první snímek přes URL nebo upload.
              </div>
            ) : (
              selectedGroup.images.map((image, index) => (
                <div
                  key={image.id}
                  className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 lg:grid-cols-[220px,1fr]"
                >
                  <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/20">
                    <img src={image.url} alt={image.alt || selectedGroup.title} className="aspect-[4/3] w-full object-cover" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">
                        Obrázek {index + 1}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedGroupImages((current) => moveItem(current, index, index - 1))
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
                          title="Posunout nahoru"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedGroupImages((current) => moveItem(current, index, index + 1))
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
                          title="Posunout dolů"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedGroupImages((current) =>
                              current.filter((currentImage) => currentImage.id !== image.id)
                            )
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/15"
                          title="Odebrat obrázek"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel label="Alt text" hint="Přístupný popis obrázku. Pomáhá čtečkám i SEO." />
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(event) =>
                          updateSelectedGroupImages((current) =>
                            current.map((currentImage) =>
                              currentImage.id === image.id
                                ? { ...currentImage, alt: event.target.value }
                                : currentImage
                            )
                          )
                        }
                        className="w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel label="Popisek" hint="Veřejný krátký popis zobrazený pod fotkou v galerii." />
                      <textarea
                        value={image.caption}
                        onChange={(event) =>
                          updateSelectedGroupImages((current) =>
                            current.map((currentImage) =>
                              currentImage.id === image.id
                                ? { ...currentImage, caption: event.target.value }
                                : currentImage
                            )
                          )
                        }
                        rows={3}
                        className="w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/35 break-all">
                      {image.url}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[2.8rem] border-white/10 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Jak funguje galerie</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ['1. Založ skupinu', 'Každá galerie má svůj nadpis, datum a vlastní blok obrázků.'],
            ['2. Přidej fotky', 'Nahrávej soubory nebo URL, doplň alt texty a veřejné popisky.'],
            ['3. Publikuj', 'Přepni skupinu do veřejného režimu a ulož. Menu i stránka se propíšou automaticky.']
          ].map(([title, text]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{title}</p>
              <p className="mt-2 text-sm text-white/40">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[330px,1fr]">
        <aside className="glass-panel rounded-[3rem] border-white/10 p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Skupiny galerie</p>
              <h2 className="mt-2 text-2xl font-black text-white">Seznam galerií</h2>
            </div>
            <button
              type="button"
              onClick={() => void syncGalleryGroups()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
              title="Obnovit galerii"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {[
              ['Skupiny', groups.length],
              ['Publikované', publishedGroupsCount],
              ['Obrázky', totalImages]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{label}</p>
                <p className="mt-3 text-2xl font-black text-white">{value}</p>
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
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full rounded-[1.8rem] border px-4 py-4 text-left transition ${
                    selectedGroupId === group.id
                      ? 'border-cyan-400/30 bg-cyan-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
                      {group.eventDate || 'Bez data'}
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                        group.published
                          ? 'bg-emerald-500/10 text-emerald-200'
                          : 'bg-white/10 text-white/45'
                      }`}
                    >
                      {group.published ? 'Veřejná' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white">{group.title}</h3>
                  <p className="mt-2 text-sm text-white/40">
                    {group.images.length} {group.images.length === 1 ? 'obrázek' : group.images.length < 5 ? 'obrázky' : 'obrázků'}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="space-y-6">
          {renderSelectedGroupEditor()}

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
                  {isDirty
                    ? 'Máš rozpracované změny. Klikni na Uložit galerii, aby se propsaly na veřejný web.'
                    : 'Galerie je synchronizovaná s databází. Nové publikované skupiny se zobrazí i ve veřejném menu a na stránce Galerie.'}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GalleryManagerPanel;
