import type { Session } from '@supabase/supabase-js';
import {
  AlertCircle,
  FilePlus2,
  ImagePlus,
  Loader2,
  LogOut,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Upload
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
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

  useEffect(() => {
    const selectedEntry = filteredEntries.find((entry) => entry.id === selectedId);
    if (selectedEntry) {
      setEditorState({
        ...selectedEntry
      });
      return;
    }

    if (!selectedId) {
      setEditorState((prev) => (prev.type === activeType && !prev.id ? prev : createEmptyEntry(activeType)));
    }
  }, [activeType, filteredEntries, selectedId]);

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
    if (!window.confirm('Opravdu chceš tuto položku odstranit?')) return;

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      await deleteEntry(selectedId);
      setEntries((prev) => prev.filter((entry) => entry.id !== selectedId));
      setSelectedId(null);
      setEditorState(createEmptyEntry(activeType));
      setNotice('Položka byla smazána.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Mazání selhalo.');
    } finally {
      setIsSaving(false);
    }
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
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleSelectEntry(entry)}
                    className={`w-full rounded-[1.8rem] border px-4 py-4 text-left transition ${
                      selectedId === entry.id
                        ? 'border-cyan-400/30 bg-cyan-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">{entry.category}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">{entry.status}</p>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-white">{entry.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-white/45">{entry.excerpt}</p>
                  </button>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Nadpis</label>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Slug</label>
                  <input
                    type="text"
                    value={editorState.slug}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Kategorie</label>
                  <input
                    type="text"
                    value={editorState.category}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Typ</label>
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
                    <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Stav</label>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Publikovat</label>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Perex</label>
                  <textarea
                    value={editorState.excerpt}
                    onChange={(event) => setEditorState((prev) => ({ ...prev, excerpt: event.target.value }))}
                    rows={4}
                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Zdroj / odkaz</label>
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
                      <label className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Cover URL</label>
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
      </div>
    </div>
  );
};

export default AdminDashboardPage;
