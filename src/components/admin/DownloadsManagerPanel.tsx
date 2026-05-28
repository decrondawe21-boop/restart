import {
  Download,
  Eye,
  EyeOff,
  FileText,
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
  deleteMediaLibraryAsset,
  fetchSiteSettings,
  saveSiteSetting,
  uploadPublicFileToStorage
} from '../../lib/cms';
import {
  defaultDownloadLibrary,
  downloadLibrarySettingKey,
  normalizeDownloadLibrary,
  type DownloadFileCategory,
  type DownloadFileEntry,
  type DownloadLibrarySettings
} from '../../lib/siteSettings';

const createId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const categoryLabels: Record<DownloadFileCategory, string> = {
  documents: 'Dokumenty',
  programs: 'Programy'
};

const formatBytes = (value?: number) => {
  if (!value || value <= 0) return '';
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} kB`;
  return `${(value / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
};

const fileTypeFromName = (fileName: string) => fileName.split('.').pop()?.toUpperCase() || 'SOUBOR';

const DownloadsManagerPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<DownloadLibrarySettings>(defaultDownloadLibrary);
  const [activeCategory, setActiveCategory] = useState<DownloadFileCategory>('documents');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('PDF');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const visibleCount = useMemo(() => files.filter((file) => file.visible).length, [files]);
  const categoryFiles = useMemo(
    () => files.filter((file) => file.category === activeCategory),
    [activeCategory, files]
  );

  const syncDownloads = async () => {
    setIsLoading(true);
    setError('');
    setNotice('');

    try {
      const records = await fetchSiteSettings([downloadLibrarySettingKey]);
      setFiles(normalizeDownloadLibrary(records[0]?.value_json));
    } catch (caughtError) {
      setFiles(defaultDownloadLibrary);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení souborů selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void syncDownloads();
  }, []);

  const persistFiles = async (nextFiles: DownloadLibrarySettings, successMessage: string) => {
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      await saveSiteSetting(downloadLibrarySettingKey, nextFiles);
      setFiles(nextFiles);
      setNotice(successMessage);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení knihovny souborů selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectedFile = (file: File | null) => {
    setSelectedFile(file);
    if (!file) return;

    setFileType(fileTypeFromName(file.name));
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vyber nejdřív soubor k nahrání.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const uploaded = await uploadPublicFileToStorage(selectedFile, `downloads/${activeCategory}`);
      const entry: DownloadFileEntry = {
        id: createId('download-file'),
        title: title.trim() || selectedFile.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
        description: description.trim() || 'Veřejný soubor ke stažení.',
        category: activeCategory,
        fileType: (fileType.trim() || fileTypeFromName(selectedFile.name)).toUpperCase(),
        url: uploaded.url,
        path: uploaded.path,
        sizeBytes: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        visible: true
      };
      const nextFiles = [entry, ...files];
      await saveSiteSetting(downloadLibrarySettingKey, nextFiles);
      setFiles(nextFiles);
      setTitle('');
      setDescription('');
      setFileType('PDF');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setNotice('Soubor je nahraný a veřejně dostupný v sekci Ke stažení.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nahrání souboru selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFile = (id: string, patch: Partial<DownloadFileEntry>) => {
    const nextFiles = files.map((file) => (file.id === id ? { ...file, ...patch } : file));
    setFiles(nextFiles);
  };

  const saveCurrentFiles = async () => {
    await persistFiles(files, 'Knihovna souborů byla uložena.');
  };

  const deleteFile = async (file: DownloadFileEntry) => {
    if (!window.confirm(`Opravdu chceš odstranit soubor „${file.title}“ z veřejné knihovny?`)) return;

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      if (file.path) {
        await deleteMediaLibraryAsset(file.path);
      }

      const nextFiles = files.filter((currentFile) => currentFile.id !== file.id);
      await saveSiteSetting(downloadLibrarySettingKey, nextFiles);
      setFiles(nextFiles);
      setNotice('Soubor byl odstraněn z veřejné knihovny.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Odstranění souboru selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
              <Download size={14} />
              Veřejné soubory
            </div>
            <h2 className="text-3xl font-black uppercase text-white md:text-5xl">
              Ke stažení <span className="headline-thin text-cyan-300">pro veřejnost</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/45">
              Nahraj PDF, ZIP, Office dokumenty nebo textové podklady. Každý uložený soubor se zobrazí jako veřejná karta
              na stránkách Dokumenty nebo Programy.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            {[
              ['Celkem', files.length],
              ['Viditelné', visibleCount],
              ['Aktivní', categoryLabels[activeCategory]]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{label}</p>
                <p className="mt-3 text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(notice || error) && (
        <div
          className={`rounded-[2rem] border px-5 py-4 text-sm font-semibold ${
            error ? 'border-red-500/25 bg-red-500/10 text-red-100' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          {error || notice}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
        <aside className="glass-panel rounded-[3rem] border-white/10 p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Nový soubor</p>
              <h3 className="mt-2 text-2xl font-black text-white">Nahrát podklad</h3>
            </div>
            {isSaving && <Loader2 size={18} className="animate-spin text-cyan-300" />}
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-2">
            {(['documents', 'programs'] as DownloadFileCategory[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-[1.2rem] px-3 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
                  activeCategory === category ? 'bg-cyan-500 text-black' : 'text-white/45 hover:text-cyan-300'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Soubor</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.rtf,application/pdf"
                onChange={(event) => handleSelectedFile(event.target.files?.[0] ?? null)}
                className="mt-2 w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-[0.16em] file:text-black"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Název</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Např. Intake form"
                className="mt-2 w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/30"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Popis</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Krátce popiš, pro koho soubor je a k čemu slouží."
                rows={4}
                className="mt-2 w-full resize-none rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/30"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Typ</span>
              <input
                value={fileType}
                onChange={(event) => setFileType(event.target.value)}
                className="mt-2 w-full rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-3 text-sm uppercase text-white outline-none transition focus:border-cyan-400/30"
              />
            </label>

            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={isSaving || !selectedFile}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Nahrát a publikovat
            </button>
          </div>
        </aside>

        <div className="glass-panel rounded-[3rem] border-white/10 p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Knihovna</p>
              <h3 className="mt-2 text-2xl font-black text-white">{categoryLabels[activeCategory]}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void syncDownloads()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/60 transition hover:border-cyan-400/25 hover:text-cyan-300"
              >
                <RefreshCw size={14} />
                Obnovit
              </button>
              <button
                type="button"
                onClick={() => void saveCurrentFiles()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 transition hover:border-cyan-400/35 disabled:opacity-45"
              >
                <Save size={14} />
                Uložit změny
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-6 text-white/50">
              <Loader2 size={17} className="animate-spin text-cyan-300" />
              Načítám veřejné soubory...
            </div>
          ) : categoryFiles.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] px-5 py-8 text-center">
              <Plus size={22} className="mx-auto text-cyan-300" />
              <p className="mt-3 text-sm text-white/45">V této kategorii zatím není žádný soubor.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {categoryFiles.map((file) => (
                <article key={file.id} className="rounded-[2rem] border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-500/10 text-cyan-300">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-cyan-400/15 bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                            {file.fileType}
                          </span>
                          {formatBytes(file.sizeBytes) && (
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                              {formatBytes(file.sizeBytes)}
                            </span>
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${file.visible ? 'text-emerald-300' : 'text-white/25'}`}>
                            {file.visible ? 'Viditelné' : 'Skryté'}
                          </span>
                        </div>

                        <input
                          value={file.title}
                          onChange={(event) => updateFile(file.id, { title: event.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-lg font-black text-white outline-none transition focus:border-cyan-400/30"
                        />
                        <textarea
                          value={file.description}
                          onChange={(event) => updateFile(file.id, { description: event.target.value })}
                          rows={2}
                          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/55 outline-none transition focus:border-cyan-400/30"
                        />
                        <div className="flex min-w-0 items-center gap-2 text-xs text-white/35">
                          <Link2 size={13} className="shrink-0" />
                          <span className="truncate">{file.url}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-500/10 text-cyan-200 transition hover:border-cyan-400/35"
                        aria-label={`Otevřít ${file.title}`}
                        title="Otevřít veřejný soubor"
                      >
                        <Download size={15} />
                      </a>
                      <button
                        type="button"
                        onClick={() => updateFile(file.id, { visible: !file.visible })}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-cyan-400/25 hover:text-cyan-300"
                        aria-label={file.visible ? `Skrýt ${file.title}` : `Zobrazit ${file.title}`}
                        title={file.visible ? 'Skrýt z webu' : 'Zobrazit na webu'}
                      >
                        {file.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteFile(file)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/15"
                        aria-label={`Odstranit ${file.title}`}
                        title="Odstranit soubor"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DownloadsManagerPanel;
