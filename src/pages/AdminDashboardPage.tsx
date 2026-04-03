import type { Session } from '@supabase/supabase-js';
import {
  AlertCircle,
  FilePlus2,
  HelpCircle,
  ImagePlus,
  Loader2,
  LogOut,
  Menu,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  LayoutTemplate,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomepageBuilderPanel from '../components/admin/HomepageBuilderPanel';
import MatrixFxHero from '../components/MatrixFxHero';
import RichTextEditor from '../components/admin/RichTextEditor';
import {
  deleteEntry,
  fetchAdminEntries,
  isCurrentUserAdmin,
  saveEntry,
  slugify,
  type CmsEntry,
  type CmsEntryInput,
  type CmsEntryType,
  uploadImageFileToStorage,
  uploadImageFromUrlToStorage
} from '../lib/cms';
import { supabase } from '../lib/supabase';

interface AdminDashboardPageProps {
  session: Session | null;
  authReady: boolean;
  isAdmin: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

interface EditableEntry extends CmsEntryInput {
  id?: string;
}

const toLocalDateTime = (value: string | null | undefined) => {
  if (!value) return '';
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const fromLocalDateTime = (value: string) => {
  if (!value) return null;
  return new Date(value).toISOString();
};

const createEmptyEntry = (type: CmsEntryType): EditableEntry => ({
  type,
  title: '',
  slug: '',
  category: type === 'news' ? 'Aktualita' : 'Blog',
  excerpt: '',
  content_html: '<p></p>',
  cover_image_url: '',
  source_url: '',
  status: 'draft',
  published_at: new Date().toISOString()
});

const formatAdminDate = (value: string | null | undefined) => {
  if (!value) return 'právě teď';

  return new Intl.DateTimeFormat('cs-CZ', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
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

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  session,
  authReady,
  isAdmin,
  isDark,
  onToggleTheme
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [entries, setEntries] = useState<CmsEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminView, setAdminView] = useState<'content' | 'homepage'>('content');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeType, setActiveType] = useState<CmsEntryType>('news');
  const [editorState, setEditorState] = useState<EditableEntry>(createEmptyEntry('news'));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const syncAdminEntries = async () => {
    setIsLoading(true);
    setError('');

    try {
      const hasAccess = await isCurrentUserAdmin();
      if (!hasAccess) {
        throw new Error('Přihlášený účet už nemá admin oprávnění.');
      }

      const data = await fetchAdminEntries();
      setEntries(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení CMS obsahu selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authReady && session && isAdmin) {
      void syncAdminEntries();
    }
  }, [authReady, isAdmin, session]);

  const filteredEntries = useMemo(
    () => entries.filter((entry) => entry.type === activeType),
    [activeType, entries]
  );

  const dashboardStats = useMemo(() => {
    const publishedCount = entries.filter((entry) => entry.status === 'published').length;
    const draftCount = entries.filter((entry) => entry.status === 'draft').length;
    const newsCount = entries.filter((entry) => entry.type === 'news').length;
    const blogCount = entries.filter((entry) => entry.type === 'blog').length;

    return {
      total: entries.length,
      published: publishedCount,
      drafts: draftCount,
      news: newsCount,
      blog: blogCount
    };
  }, [entries]);

  useEffect(() => {
    const selectedEntry = filteredEntries.find((entry) => entry.id === selectedId);
    if (selectedEntry) {
      setEditorState({
        ...selectedEntry
      });
      setAssetUrl(selectedEntry.cover_image_url ?? '');
      return;
    }

    if (!selectedId) {
      setEditorState((prev) => (prev.type === activeType && !prev.id ? prev : createEmptyEntry(activeType)));
    }
  }, [activeType, filteredEntries, selectedId]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

  if (authReady && (!session || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSelectEntry = (entry: CmsEntry) => {
    setSelectedId(entry.id);
    setEditorState({ ...entry });
    setAssetUrl(entry.cover_image_url ?? '');
    setNotice('');
    setError('');
  };

  const handleNewEntry = (type: CmsEntryType) => {
    setActiveType(type);
    setSelectedId(null);
    setAssetUrl('');
    setEditorState(createEmptyEntry(type));
    setNotice('');
    setError('');
  };

  const handleDeleteEntry = async (entry: Pick<CmsEntry, 'id' | 'title' | 'type'>) => {
    if (!window.confirm(`Opravdu chceš odstranit položku „${entry.title}“?`)) return;

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      await deleteEntry(entry.id);
      setEntries((prev) => prev.filter((currentEntry) => currentEntry.id !== entry.id));

      if (selectedId === entry.id) {
        setSelectedId(null);
        setAssetUrl('');
        setEditorState(createEmptyEntry(entry.type));
      }

      setNotice(`Položka „${entry.title}“ byla smazána.`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Mazání selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!editorState.title.trim()) {
      setError('Nadpis je povinný.');
      return;
    }

    const payload: CmsEntryInput = {
      ...editorState,
      slug: editorState.slug.trim() || slugify(editorState.title),
      excerpt: editorState.excerpt.trim(),
      title: editorState.title.trim(),
      category: editorState.category.trim() || (editorState.type === 'news' ? 'Aktualita' : 'Blog'),
      cover_image_url: editorState.cover_image_url?.trim() || null,
      source_url: editorState.source_url?.trim() || null,
      published_at: editorState.published_at
    };

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const saved = await saveEntry(payload);
      setEntries((prev) => {
        const next = prev.filter((entry) => entry.id !== saved.id);
        return [saved, ...next].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      });
      setSelectedId(saved.id);
      setEditorState({ ...saved });
      setNotice(`Položka „${saved.title}“ byla uložena.`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await handleDeleteEntry({
      id: selectedId,
      title: editorState.title || 'bez názvu',
      type: editorState.type
    });
  };

  const handleImportFromUrl = async () => {
    if (!assetUrl.trim()) return;
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const uploadedUrl = await uploadImageFromUrlToStorage(assetUrl.trim(), `cms/${editorState.type}`);
      setEditorState((prev) => ({ ...prev, cover_image_url: uploadedUrl }));
      setNotice('Obrázek byl načten z URL a uložen do Supabase Storage.');
    } catch (caughtError) {
      setEditorState((prev) => ({ ...prev, cover_image_url: assetUrl.trim() }));
      setNotice(
        'Upload z URL se nepovedl kvůli omezení zdrojového serveru. URL jsem připojil přímo jako cover.'
      );
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
      const uploadedUrl = await uploadImageFileToStorage(file, `cms/${editorState.type}`);
      setEditorState((prev) => ({ ...prev, cover_image_url: uploadedUrl }));
      setAssetUrl(uploadedUrl);
      setNotice('Soubor byl nahrán do Supabase Storage.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Upload souboru selhal.');
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition duration-300 ${
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed left-4 top-4 bottom-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-[3rem] border border-white/10 bg-[#031114]/96 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
              <ShieldCheck size={13} />
              Admin menu
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-white">Řídicí lišta</h2>
              <p className="mt-2 text-sm text-white/40">Rychlé přepínání editorů, obsahu a operací bez hledání v dlouhé stránce.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
            aria-label="Zavřít admin menu"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto pr-1">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Pracovní plochy</p>
            <div className="mt-4 space-y-3">
              {([
                ['content', 'Obsahový editor', 'Aktuality, blog a publikace.'],
                ['homepage', 'Homepage builder', 'Sekce, sloty a widgety.']
              ] as const).map(([view, title, description]) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    setAdminView(view);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full rounded-[1.6rem] border px-4 py-4 text-left transition ${
                    adminView === view
                      ? 'border-cyan-400/30 bg-cyan-500/10'
                      : 'border-white/10 bg-black/20 hover:border-cyan-400/20'
                  }`}
                >
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-white">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {adminView === 'content' && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Typ obsahu</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {([
                  ['news', 'Aktuality'],
                  ['blog', 'Blog']
                ] as Array<[CmsEntryType, string]>).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActiveType(type);
                      setSelectedId(null);
                      setIsSidebarOpen(false);
                    }}
                    className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                      activeType === type
                        ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200'
                        : 'border-white/10 bg-black/20 text-white/60 hover:border-cyan-400/20'
                    }`}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.18em]">{label}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/35">
                      {type === 'news' ? 'Krátké zprávy, výzvy a oznámení.' : 'Delší texty a rozšířený obsah.'}
                    </p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  handleNewEntry(activeType);
                  setIsSidebarOpen(false);
                }}
                className="mt-4 flex w-full items-center gap-3 rounded-[1.6rem] border border-dashed border-cyan-400/20 bg-cyan-500/5 px-4 py-4 text-left transition hover:border-cyan-400/35"
              >
                <FilePlus2 size={16} className="text-cyan-300" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Nová položka</p>
                  <p className="mt-1 text-sm text-white/40">Okamžitě otevře prázdný editor pro {activeType === 'news' ? 'aktualitu' : 'blog'}.</p>
                </div>
              </button>
            </div>
          )}

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Rychlé akce</p>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => void syncAdminEntries()}
                className="flex w-full items-center gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-left text-white/65 transition hover:border-cyan-400/20 hover:text-cyan-300"
              >
                <RefreshCw size={16} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Obnovit data</p>
                  <p className="mt-1 text-sm text-white/35">Natáhne čerstvý stav ze Supabase.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex w-full items-center gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-left text-white/65 transition hover:border-cyan-400/20 hover:text-cyan-300"
              >
                <ShieldCheck size={16} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em]">{isDark ? 'Přepnout na light' : 'Přepnout na dark'}</p>
                  <p className="mt-1 text-sm text-white/35">Rychlá změna motivu administrační vrstvy.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-4 text-left text-red-100 transition hover:bg-red-500/15"
              >
                <LogOut size={16} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Odhlásit</p>
                  <p className="mt-1 text-sm text-red-100/70">Bezpečně ukončí administrační relaci.</p>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Stav systému</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-black text-white">{dashboardStats.total}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Záznamy</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="text-2xl font-black text-white">{dashboardStats.published}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Publikováno</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="mx-auto max-w-[1700px] space-y-8">
        <div className="glass-panel flex flex-col gap-5 rounded-[3rem] border-white/10 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              <ShieldCheck size={14} />
              Admin Panel
            </div>
            <h1 className="text-3xl font-black uppercase text-white md:text-5xl">
              Editor <span className="headline-thin text-cyan-300">webu</span>
            </h1>
            <p className="text-sm font-light text-white/45">
              Přihlášený účet: <span className="font-semibold text-white">{session?.user.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-300 transition hover:border-cyan-400/35 hover:bg-cyan-500/15"
            >
              <Menu size={15} />
              Lišta
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => void syncAdminEntries()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              <RefreshCw size={15} />
              Obnovit
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-red-200 transition hover:bg-red-500/15"
            >
              <LogOut size={15} />
              Odhlásit
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-[2.8rem] border-white/10 p-3">
          <div className="mb-4 px-3 pt-3">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Přepínač pracovních ploch</p>
            <h2 className="mt-3 text-2xl font-black text-white">Editor jako dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm text-white/40">
              Místo malých přepínačů máš teď větší pracovní karty. Přeskakuješ mezi obsahem, homepage builderem a rychlými akcemi bez ztráty kontextu.
            </p>
          </div>
          <div className="grid gap-3 xl:grid-cols-3">
            {([
              ['content', 'Obsah a články', 'Aktuality, blog a rich text editor.', adminView === 'content' ? `Aktivní: ${activeType === 'news' ? 'Aktuality' : 'Blog'}` : `${dashboardStats.total} záznamů`],
              ['homepage', 'Homepage builder', 'Widgety, pořadí sekcí a fixní obrazové sloty.', 'Sekce, sloty a widgety'],
              ['create', 'Rychlý start', 'Otevři nový záznam nebo vysouvací menu s operacemi.', adminView === 'content' ? 'Nová položka / menu' : 'Menu / obnovit']
            ] as const).map(([view, title, description, meta]) => (
              <button
                key={view}
                type="button"
                onClick={() => {
                  if (view === 'create') {
                    if (adminView === 'content') {
                      handleNewEntry(activeType);
                    } else {
                      setIsSidebarOpen(true);
                    }
                    return;
                  }
                  setAdminView(view);
                }}
                className={`rounded-[2rem] px-5 py-4 text-left transition ${
                  adminView === view
                    ? 'bg-cyan-500 text-black'
                    : 'bg-white/[0.03] text-white/70 hover:border-cyan-400/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em]">{title}</p>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${adminView === view ? 'bg-black/10 text-black/70' : 'bg-black/20 text-white/35'}`}>
                    {meta}
                  </span>
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${adminView === view ? 'text-black/70' : 'text-white/40'}`}>
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Dashboard</p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  {adminView === 'homepage' ? 'Řízení homepage' : 'Obsahový přehled'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-white/40">
                  {adminView === 'homepage'
                    ? 'Tady dává MatrixFx smysl jako vizuální identita dashboardu, ne pod formuláři. Homepage builder tak má vlastní orientační vrstvu a přehled klíčových stavů.'
                    : 'Admin panel má nově i dashboard vrstvu. Vidíš rychlý stav obsahu, publikace a můžeš se rychle rozhodnout, co upravit dál.'}
                </p>
              </div>
              <div className="hidden rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-right md:block">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Aktivní režim</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-white">
                  {adminView === 'homepage' ? 'Homepage Builder' : activeType === 'news' ? 'Aktuality' : 'Blog'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: 'Všechny záznamy',
                  value: dashboardStats.total,
                  description: 'Součet aktualit a blogových článků v CMS.',
                  icon: <ShieldCheck size={18} />,
                  accent: 'text-cyan-300',
                  bg: 'bg-cyan-500/10'
                },
                {
                  label: 'Publikováno',
                  value: dashboardStats.published,
                  description: 'Obsah viditelný na veřejném webu.',
                  icon: <Save size={18} />,
                  accent: 'text-emerald-300',
                  bg: 'bg-emerald-500/10'
                },
                {
                  label: 'Drafty',
                  value: dashboardStats.drafts,
                  description: 'Rozpracované položky jen pro admin.',
                  icon: <PencilLine size={18} />,
                  accent: 'text-amber-300',
                  bg: 'bg-amber-500/10'
                },
                {
                  label: 'Homepage sloty',
                  value: '6',
                  description: 'Pevné obrazové pozice připravené pro builder.',
                  icon: <LayoutTemplate size={18} />,
                  accent: 'text-teal-300',
                  bg: 'bg-teal-500/10'
                }
              ].map((card) => (
                <div key={card.label} className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.accent}`}>
                      {card.icon}
                    </div>
                    <p className="text-3xl font-black text-white">{card.value}</p>
                  </div>
                  <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">{card.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[2.2rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Aktuality vs. blog</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-2xl font-black text-white">{dashboardStats.news}</p>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Aktuality</p>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-2xl font-black text-white">{dashboardStats.blog}</p>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Blog</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.2rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Doporučení</p>
                <p className="mt-4 text-sm leading-relaxed text-white/45">
                  MatrixFx nechávám v přehledových blocích a ne pod vstupními poli. Admin tak zůstává čitelný, ale má vlastní
                  identitu a nepůsobí jako čistý CRUD bez značky.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[3rem] border-white/10 p-4">
            <MatrixFxHero
              isDark={isDark}
              darkLogoSrc="/images/podklady/branding/logo-9.png"
              lightLogoSrc="/images/podklady/branding/logo-main.png"
              darkLogoAlt="REST||ART admin dashboard"
              lightLogoAlt="REST||ART admin dashboard"
              revealFrom="bottom"
              label={adminView === 'homepage' ? 'Homepage Builder' : 'Admin Dashboard'}
              description={
                adminView === 'homepage'
                  ? 'Přesouvej sekce, měň pevné sloty a postupně objektivizuj homepage do editovatelných widgetů.'
                  : 'Spravuj aktuality, blog a veřejný obsah v jednom prostředí se silnější vizuální identitou.'
              }
              bulge={{ type: 'ripple', duration: 4, intensity: 14, repeat: true }}
            />
          </div>
        </div>

        {adminView === 'homepage' ? (
          <HomepageBuilderPanel />
        ) : (
          <div className="grid gap-8 xl:grid-cols-[360px,1fr]">
          <aside className="glass-panel rounded-[3rem] border-white/10 p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Obsah</p>
                <h2 className="mt-2 text-2xl font-black text-white">Sekce</h2>
              </div>
              <button
                type="button"
                onClick={() => handleNewEntry(activeType)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-black transition hover:bg-cyan-400"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-[2rem] border border-white/10 bg-white/[0.03] p-2">
              {([
                ['news', 'Aktuality'],
                ['blog', 'Blog']
              ] as Array<[CmsEntryType, string]>).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveType(type);
                    setSelectedId(null);
                  }}
                  className={`rounded-[1.3rem] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] transition ${
                    activeType === type ? 'bg-cyan-500 text-black' : 'text-white/45 hover:text-cyan-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleNewEntry(activeType)}
                className="flex w-full items-center gap-3 rounded-[1.8rem] border border-dashed border-cyan-400/20 bg-cyan-500/5 px-4 py-4 text-left transition hover:border-cyan-400/35"
              >
                <FilePlus2 size={16} className="text-cyan-300" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Nová položka</p>
                  <p className="text-sm text-white/45">Prázdný záznam pro {activeType === 'news' ? 'aktualitu' : 'blog'}.</p>
                </div>
              </button>

              {isLoading ? (
                <div className="flex items-center gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-white/50">
                  <Loader2 size={16} className="animate-spin" />
                  Načítám CMS záznamy…
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/45">
                  Zatím tu nejsou žádné záznamy pro {activeType === 'news' ? 'aktuality' : 'blog'}.
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`w-full rounded-[1.8rem] border px-4 py-4 text-left transition ${
                      selectedId === entry.id
                        ? 'border-cyan-400/30 bg-cyan-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/20'
                    }`}
                  >
                    <button type="button" onClick={() => handleSelectEntry(entry)} className="w-full text-left">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{entry.category}</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">{entry.status}</p>
                      </div>
                      <h3 className="mt-3 text-lg font-black text-white">{entry.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-white/45">{entry.excerpt}</p>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
                        Upraveno {formatAdminDate(entry.updated_at)}
                      </p>
                    </button>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
                      <button
                        type="button"
                        onClick={() => handleSelectEntry(entry)}
                        className="inline-flex items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
                        title={`Upravit položku ${entry.title}`}
                      >
                        <PencilLine size={12} />
                        Upravit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteEntry(entry)}
                        className="inline-flex items-center gap-2 rounded-[1.2rem] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/15"
                        title={`Smazat položku ${entry.title}`}
                      >
                        <Trash2 size={12} />
                        Smazat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                    {editorState.id ? 'Editace záznamu' : 'Nový záznam'}
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-white">
                    {editorState.id ? 'Obsahový editor' : 'Vytvořit novinku'}
                  </h2>
                  <p className="mt-3 text-sm text-white/40">
                    {editorState.id
                      ? `Aktivně upravuješ „${editorState.title || 'bez názvu'}“. Poslední změna ${formatAdminDate((editorState as CmsEntry).updated_at)}.`
                      : 'Vytváříš nový záznam. Po uložení se objeví v seznamu vlevo a podle stavu i na veřejném webu.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-[1.6rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    Uložit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!selectedId || isSaving}
                    className="inline-flex items-center gap-2 rounded-[1.6rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-red-200 transition hover:bg-red-500/15 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                    Smazat
                  </button>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel label="Nadpis" hint="Hlavní titulek článku nebo aktuality. Použije se v kartě i v detailu po rozkliknutí." />
                  <input
                    type="text"
                    value={editorState.title}
                    onChange={(event) =>
                      setEditorState((prev) => ({
                        ...prev,
                        title: event.target.value,
                        slug: prev.slug || slugify(event.target.value)
                      }))
                    }
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel label="Slug" hint="URL identifikátor záznamu. Doporučeně bez diakritiky a mezer, systém ho umí generovat automaticky z nadpisu." />
                  <input
                    type="text"
                    value={editorState.slug}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel label="Kategorie" hint="Krátký štítek v kartě článku. Například Aktualita, Analýza, Postpenitenciární péče nebo Značka." />
                  <input
                    type="text"
                    value={editorState.category}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel label="Typ" hint="Rozlišuje, jestli se záznam objeví v sekci Aktuality nebo Blog." />
                    <select
                      value={editorState.type}
                      onChange={(event) =>
                        setEditorState((prev) => ({
                          ...prev,
                          type: event.target.value as CmsEntryType
                        }))
                      }
                      className="w-full rounded-[1.5rem] border border-white/10 bg-[#061012] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    >
                      <option value="news">Aktualita</option>
                      <option value="blog">Blog</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <FieldLabel label="Stav" hint="Draft zůstane jen v adminu. Published se propíše na veřejný web a bude veřejně čitelný přes Supabase API." />
                    <select
                      value={editorState.status}
                      onChange={(event) =>
                        setEditorState((prev) => ({
                          ...prev,
                          status: event.target.value as 'draft' | 'published'
                        }))
                      }
                      className="w-full rounded-[1.5rem] border border-white/10 bg-[#061012] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <FieldLabel label="Publikovat" hint="Datum a čas, podle kterého se řadí veřejné články. Můžeš ho nastavit dopředu i zpětně." />
                  <input
                    type="datetime-local"
                    value={toLocalDateTime(editorState.published_at)}
                    onChange={(event) =>
                      setEditorState((prev) => ({
                        ...prev,
                        published_at: fromLocalDateTime(event.target.value)
                      }))
                    }
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <FieldLabel label="Perex" hint="Krátké shrnutí pro kartu článku. Zobrazí se v seznamu a na začátku detailu." />
                  <textarea
                    value={editorState.excerpt}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, excerpt: event.target.value }))}
                    rows={4}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <FieldLabel label="Zdroj / odkaz" hint="Volitelný externí odkaz na PDF, tiskovou zprávu nebo původní dokument. V detailu článku se zobrazí tlačítko Zdroj." />
                  <input
                    type="url"
                    value={editorState.source_url ?? ''}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, source_url: event.target.value }))}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
              <div className="space-y-6">
                <div className="glass-panel rounded-[3rem] border-white/10 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <PencilLine size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Rich text</p>
                      <h3 className="mt-1 text-2xl font-black text-white">Obsah článku</h3>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-white/40">
                    Editor podporuje nadpisy, seznamy, citace, odkazy i obrázky vkládané přes URL.
                  </p>
                  <RichTextEditor
                    value={editorState.content_html}
                    onChange={(content) => setEditorState((prev) => ({ ...prev, content_html: content }))}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel rounded-[3rem] border-white/10 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <ImagePlus size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Cover média</p>
                      <h3 className="mt-1 text-2xl font-black text-white">Obrázek z URL nebo souboru</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FieldLabel label="Zdrojová URL média" hint="Sem vlož veřejnou URL obrázku. Můžeš ji buď uložit do Supabase Storage, nebo použít přímo bez uploadu." />
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
                          setEditorState((prev) => ({ ...prev, cover_image_url: assetUrl.trim() }));
                          setNotice('Obrázek byl nastaven přímo přes URL bez uploadu.');
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

                    <div className="space-y-2">
                      <FieldLabel label="Cover URL" hint="Finální obrázek, který se použije na veřejné kartě a v detailu článku. Může být uložený ve Storage nebo externě." />
                      <input
                        type="url"
                        value={editorState.cover_image_url ?? ''}
                        onChange={(event) => setEditorState((prev) => ({ ...prev, cover_image_url: event.target.value }))}
                        className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                      />
                    </div>

                    <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.03]">
                      {editorState.cover_image_url ? (
                        <img
                          src={editorState.cover_image_url}
                          alt={editorState.title || 'Náhled cover obrázku'}
                          className="aspect-[16/10] w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center text-sm text-white/30">Zatím bez cover obrázku</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-[3rem] border-white/10 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Stav operace</p>
                  <div className="mt-4 space-y-3">
                    {notice && <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">{notice}</div>}
                    {error && (
                      <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.18em] text-red-200">
                          <AlertCircle size={14} />
                          Chyba
                        </div>
                        {error}
                      </div>
                    )}
                    {!notice && !error && (
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                        Editor je připravený. Uložením se změny promítnou do Supabase a na veřejný web.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
