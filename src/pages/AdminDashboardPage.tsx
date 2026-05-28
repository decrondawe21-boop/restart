import type { Session } from '@supabase/supabase-js';
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FilePlus2,
  FileText,
  HelpCircle,
  House,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Upload,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminInfoTooltip from '../components/admin/AdminInfoTooltip';
import AdminStickyActionBar from '../components/admin/AdminStickyActionBar';
import DownloadsManagerPanel from '../components/admin/DownloadsManagerPanel';
import GlobalSettingsPanel, { type SitePanel } from '../components/admin/GlobalSettingsPanel';
import GalleryManagerPanel from '../components/admin/GalleryManagerPanel';
import HomepageBuilderPanel from '../components/admin/HomepageBuilderPanel';
import InvestmentSettingsPanel from '../components/admin/InvestmentSettingsPanel';
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
import type { HomepageMediaSlotId, HomepageWidgetId, PageIntroKey } from '../lib/siteSettings';
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

type AdminView = 'content' | 'homepage' | 'site' | 'gallery' | 'downloads' | 'investment';
type SidebarGroupId =
  | 'homepage'
  | 'about'
  | 'gallery'
  | 'downloads'
  | 'pillars'
  | 'projects'
  | 'investment'
  | 'legal'
  | 'general';

interface HomepageFocusState {
  mode: 'media' | 'widget';
  slotId: HomepageMediaSlotId;
  widgetId: HomepageWidgetId;
}

interface SiteFocusState {
  panel: SitePanel;
  pageIntro: PageIntroKey;
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
  const [adminView, setAdminView] = useState<AdminView>('content');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSidebarGroup, setExpandedSidebarGroup] = useState<SidebarGroupId>('about');
  const [homepageFocus, setHomepageFocus] = useState<HomepageFocusState>({
    mode: 'media',
    slotId: 'hero-main-image',
    widgetId: 'hero-intro'
  });
  const [siteFocus, setSiteFocus] = useState<SiteFocusState>({
    panel: 'contact',
    pageIntro: 'about'
  });
  const [activeType, setActiveType] = useState<CmsEntryType>('news');
  const [editorState, setEditorState] = useState<EditableEntry>(createEmptyEntry('news'));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const pageIntroLabels: Record<PageIntroKey, string> = {
    about: 'O nás',
    pillars: 'Pilíře',
    stories: 'Příběhy',
    news: 'Aktuality',
    blog: 'Blog / archiv',
    gallery: 'Galerie',
    projects: 'Projekty',
    donate: 'Donate',
    contacts: 'Kontakty'
  };

  const legalLabels: Record<Extract<SitePanel, 'privacy' | 'terms' | 'cookies'>, string> = {
    privacy: 'Ochrana údajů',
    terms: 'Podmínky užití',
    cookies: 'Cookies'
  };

  const getSidebarGroupForView = () => {
    if (adminView === 'homepage') return 'homepage';
    if (adminView === 'gallery') return 'gallery';
    if (adminView === 'downloads') return 'downloads';
    if (adminView === 'investment') return 'investment';
    if (adminView === 'content') return 'about';

    if (siteFocus.panel === 'pages') {
      if (siteFocus.pageIntro === 'pillars') return 'pillars';
      if (siteFocus.pageIntro === 'projects') return 'projects';
      if (siteFocus.pageIntro === 'gallery') return 'gallery';
      return 'about';
    }

    if (siteFocus.panel === 'privacy' || siteFocus.panel === 'terms' || siteFocus.panel === 'cookies') {
      return 'legal';
    }

    return 'general';
  };

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

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedId) ?? null,
    [entries, selectedId]
  );

  const editorHasUnsavedChanges = useMemo(() => {
    if (selectedEntry) {
      return (
        editorState.title !== selectedEntry.title ||
        editorState.slug !== selectedEntry.slug ||
        editorState.category !== selectedEntry.category ||
        editorState.excerpt !== selectedEntry.excerpt ||
        editorState.content_html !== selectedEntry.content_html ||
        (editorState.cover_image_url ?? '') !== (selectedEntry.cover_image_url ?? '') ||
        (editorState.source_url ?? '') !== (selectedEntry.source_url ?? '') ||
        editorState.status !== selectedEntry.status ||
        editorState.type !== selectedEntry.type ||
        editorState.published_at !== selectedEntry.published_at
      );
    }

    const defaultCategory = editorState.type === 'news' ? 'Aktualita' : 'Blog';
    return (
      editorState.title.trim().length > 0 ||
      editorState.slug.trim().length > 0 ||
      editorState.category !== defaultCategory ||
      editorState.excerpt.trim().length > 0 ||
      editorState.content_html !== '<p></p>' ||
      Boolean(editorState.cover_image_url?.trim()) ||
      Boolean(editorState.source_url?.trim()) ||
      editorState.status !== 'draft'
    );
  }, [editorState, selectedEntry]);

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
    setExpandedSidebarGroup(getSidebarGroupForView());
  }, [adminView, activeType, siteFocus.pageIntro, siteFocus.panel]);

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

  const openContentEditor = (type: CmsEntryType) => {
    setAdminView('content');
    setActiveType(type);
    setSelectedId(null);
    setNotice('');
    setError('');
  };

  const openHomepageBuilder = (target?: Partial<HomepageFocusState>) => {
    setAdminView('homepage');
    setHomepageFocus((prev) => ({
      ...prev,
      ...target
    }));
    setNotice('');
    setError('');
  };

  const openSiteEditor = (panel: SitePanel, pageIntro?: PageIntroKey) => {
    setAdminView('site');
    setSiteFocus((prev) => ({
      panel,
      pageIntro: pageIntro ?? prev.pageIntro
    }));
    setNotice('');
    setError('');
  };

  const openGalleryManager = () => {
    setAdminView('gallery');
    setSelectedId(null);
    setNotice('');
    setError('');
  };

  const openDownloadsManager = () => {
    setAdminView('downloads');
    setSelectedId(null);
    setNotice('');
    setError('');
  };

  const openInvestmentEditor = () => {
    setAdminView('investment');
    setNotice('');
    setError('');
  };

  const adminPageGroups = [
    {
      id: 'homepage',
      title: 'Homepage',
      summary: 'Hero, widgety a pořadí bloků úvodní stránky.',
      icon: <House size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Pořadí sekcí',
          summary: 'Zapnutí, vypnutí a řazení homepage bloků.',
          active: adminView === 'homepage',
          action: () => openHomepageBuilder({ mode: 'media' })
        },
        {
          label: 'Hero / média',
          summary: 'Hlavní hero obrázek a další vizuální sloty.',
          active: adminView === 'homepage' && homepageFocus.mode === 'media',
          action: () => openHomepageBuilder({ mode: 'media', slotId: 'hero-main-image' })
        },
        {
          label: 'Widgety',
          summary: 'Texty, CTA a obsahové widgety homepage.',
          active: adminView === 'homepage' && homepageFocus.mode === 'widget',
          action: () => openHomepageBuilder({ mode: 'widget', widgetId: 'hero-intro' })
        }
      ]
    },
    {
      id: 'about',
      title: 'O nás',
      summary: 'Hlavní stránka, příběhy, novinky, blog a kontakty.',
      icon: <FileText size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'O nás',
          summary: 'Header a úvodní text stránky O nás.',
          active: adminView === 'site' && siteFocus.panel === 'pages' && siteFocus.pageIntro === 'about',
          action: () => openSiteEditor('pages', 'about')
        },
        {
          label: 'Příběhy',
          summary: 'Header a text stránky Skutečné restarty.',
          active: adminView === 'site' && siteFocus.panel === 'pages' && siteFocus.pageIntro === 'stories',
          action: () => openSiteEditor('pages', 'stories')
        },
        {
          label: 'Aktuality',
          summary: 'Editor novinek a krátkých oznámení.',
          active: adminView === 'content' && activeType === 'news',
          action: () => openContentEditor('news')
        },
        {
          label: 'Blog / archiv',
          summary: 'Delší články, komentáře a archiv textů.',
          active: adminView === 'content' && activeType === 'blog',
          action: () => openContentEditor('blog')
        },
        {
          label: 'Kontakty',
          summary: 'Kontaktní údaje, formulář a footer.',
          active: adminView === 'site' && siteFocus.panel === 'contact',
          action: () => openSiteEditor('contact')
        }
      ]
    },
    {
      id: 'gallery',
      title: 'Galerie',
      summary: 'Veřejný header galerie a správa složek s fotkami.',
      icon: <ImagePlus size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Header stránky',
          summary: 'Nadpis a popis veřejné galerie.',
          active: adminView === 'site' && siteFocus.panel === 'pages' && siteFocus.pageIntro === 'gallery',
          action: () => openSiteEditor('pages', 'gallery')
        },
        {
          label: 'Složky a fotky',
          summary: 'Skupiny, datum, popisy a obrázky galerie.',
          active: adminView === 'gallery',
          action: () => openGalleryManager()
        }
      ]
    },
    {
      id: 'downloads',
      title: 'Ke stažení',
      summary: 'Dokumenty, názvy menu a soubory pro download.',
      icon: <Upload size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Soubory ke stažení',
          summary: 'Upload, popisy a viditelnost veřejných souborů.',
          active: adminView === 'downloads',
          action: () => openDownloadsManager()
        },
        {
          label: 'Menu ke stažení',
          summary: 'Názvy a viditelnost položek v menu.',
          active: adminView === 'site' && siteFocus.panel === 'navigation',
          action: () => openSiteEditor('navigation')
        }
      ]
    },
    {
      id: 'pillars',
      title: 'Pilíře',
      summary: 'Header pilířů a navigace programových detailů.',
      icon: <ShieldCheck size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Header sekce',
          summary: 'Úvodní nadpis a popis stránky Pilíře.',
          active: adminView === 'site' && siteFocus.panel === 'pages' && siteFocus.pageIntro === 'pillars',
          action: () => openSiteEditor('pages', 'pillars')
        },
        {
          label: 'Navigace pilířů',
          summary: 'JAILBREAK, REWORK a další položky v menu.',
          active: adminView === 'site' && siteFocus.panel === 'navigation',
          action: () => openSiteEditor('navigation')
        }
      ]
    },
    {
      id: 'projects',
      title: 'Projekty',
      summary: 'Header projektové stránky a navazující assety.',
      icon: <LayoutDashboard size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Header stránky',
          summary: 'Titulek a popis stránky Projekty.',
          active: adminView === 'site' && siteFocus.panel === 'pages' && siteFocus.pageIntro === 'projects',
          action: () => openSiteEditor('pages', 'projects')
        },
        {
          label: 'Media knihovna',
          summary: 'Obrázky a assety pro projektové výstupy.',
          active: adminView === 'site' && siteFocus.panel === 'media',
          action: () => openSiteEditor('media')
        }
      ]
    },
    {
      id: 'investment',
      title: 'Investiční záměr',
      summary: 'Úvodní kontext, ROI a veřejný přínos projektu.',
      icon: <TrendingUp size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Úvod a kontext',
          summary: 'Header, úvodní bloky a osobní kontext projektu.',
          active: adminView === 'site' && siteFocus.panel === 'pages',
          action: () => openSiteEditor('pages', 'projects')
        },
        {
          label: 'Návratnost a přínos',
          summary: 'Velké částky, scénáře úspor a ROI výpočty.',
          active: adminView === 'investment',
          action: () => openInvestmentEditor()
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal',
      summary: 'Právní overlaye otevřené nad veřejnou stránkou.',
      icon: <ShieldCheck size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Ochrana údajů',
          summary: 'Texty a body GDPR / ochrany osobních údajů.',
          active: adminView === 'site' && siteFocus.panel === 'privacy',
          action: () => openSiteEditor('privacy')
        },
        {
          label: 'Podmínky užití',
          summary: 'Pravidla používání obsahu a webu.',
          active: adminView === 'site' && siteFocus.panel === 'terms',
          action: () => openSiteEditor('terms')
        },
        {
          label: 'Cookies',
          summary: 'Cookie notice a související textace.',
          active: adminView === 'site' && siteFocus.panel === 'cookies',
          action: () => openSiteEditor('cookies')
        }
      ]
    },
    {
      id: 'general',
      title: 'Obecné nastavení',
      summary: 'Kontakty, navigace, page headery a media knihovna.',
      icon: <Settings2 size={16} className="text-cyan-300" />,
      items: [
        {
          label: 'Kontakty a footer',
          summary: 'Telefon, e-mail, adresa a footerové údaje.',
          active: adminView === 'site' && siteFocus.panel === 'contact',
          action: () => openSiteEditor('contact')
        },
        {
          label: 'Navigace menu',
          summary: 'Názvy, viditelnost a struktura veřejného menu.',
          active: adminView === 'site' && siteFocus.panel === 'navigation',
          action: () => openSiteEditor('navigation')
        },
        {
          label: 'Page headery',
          summary: 'Nadpisy a popisy hlavních veřejných stránek.',
          active: adminView === 'site' && siteFocus.panel === 'pages',
          action: () => openSiteEditor('pages', siteFocus.pageIntro)
        },
        {
          label: 'Media knihovna',
          summary: 'Sdílené assety pro homepage, CMS a další stránky.',
          active: adminView === 'site' && siteFocus.panel === 'media',
          action: () => openSiteEditor('media')
        }
      ]
    }
  ];

  const activeModeLabel =
    adminView === 'homepage'
      ? homepageFocus.mode === 'widget'
        ? 'Homepage · Widgety'
        : 'Homepage · Hero / média'
      : adminView === 'investment'
        ? 'Investiční záměr'
      : adminView === 'downloads'
        ? 'Ke stažení'
      : adminView === 'site'
          ? siteFocus.panel === 'pages'
            ? `Header: ${pageIntroLabels[siteFocus.pageIntro]}`
            : siteFocus.panel === 'contact'
              ? 'Kontakty a footer'
              : siteFocus.panel === 'navigation'
                ? 'Navigace webu'
                : siteFocus.panel === 'media'
                  ? 'Media knihovna'
                  : legalLabels[siteFocus.panel]
          : adminView === 'gallery'
            ? 'Galerie'
            : activeType === 'news'
              ? 'Aktuality'
              : 'Blog';

  const activeModeDescription =
    adminView === 'homepage'
      ? homepageFocus.mode === 'widget'
        ? 'Upravuješ texty, CTA a widgetové bloky homepage.'
        : 'Upravuješ vizuální sloty, hero a další média úvodní stránky.'
      : adminView === 'investment'
        ? 'Velké částky, scénáře úspor a text návratnosti.'
        : adminView === 'downloads'
          ? 'Veřejné dokumenty a programové podklady ke stažení.'
        : adminView === 'site'
          ? siteFocus.panel === 'pages'
            ? `Právě řešíš header a popis stránky „${pageIntroLabels[siteFocus.pageIntro]}“.`
            : siteFocus.panel === 'contact'
              ? 'Veřejné kontakty, formulář, adresa a footerové informace.'
              : siteFocus.panel === 'navigation'
                ? 'Viditelnost, názvy a struktura veřejného menu i footeru.'
                : siteFocus.panel === 'media'
                  ? 'Sdílené assety pro homepage, obsah a další části webu.'
                  : `Právě upravuješ overlay „${legalLabels[siteFocus.panel]}“.`
          : adminView === 'gallery'
            ? 'Skupiny fotek, datum, popisy a publikace.'
            : activeType === 'news'
              ? 'Krátké novinky, výzvy a veřejná oznámení.'
              : 'Delší články, editorial a rozšířený obsah.';

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
    <div className="admin-workspace min-h-screen px-6 py-8">
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition duration-300 ${
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed left-4 top-4 bottom-4 z-50 flex w-[min(52vw,760px)] max-w-[calc(100vw-2rem)] flex-col rounded-[3rem] border border-white/10 bg-[#031114]/96 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
              <ShieldCheck size={13} />
              Menu
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-white">Správa webu</h2>
              <p className="mt-2 text-sm text-white/40">Menu teď kopíruje veřejný web a otevírá rovnou správný editor.</p>
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

        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="rounded-[2rem] border border-cyan-400/15 bg-cyan-500/[0.04] p-4">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={16} className="text-cyan-300" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Aktivní část</p>
                <p className="mt-1 text-sm font-black uppercase tracking-[0.18em] text-white">{activeModeLabel}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {adminPageGroups.map((group) => {
              const isOpen = expandedSidebarGroup === group.id;
              const hasActiveItem = group.items.some((item) => item.active);

              return (
                <div
                  key={group.id}
                  className={`rounded-[1.5rem] border p-2.5 transition ${
                    hasActiveItem ? 'border-cyan-400/20 bg-cyan-500/[0.05]' : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSidebarGroup(group.id as SidebarGroupId)}
                    className="flex w-full items-center justify-between gap-3 rounded-[1.2rem] px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
                    title={group.summary}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
                        {group.icon}
                        {hasActiveItem && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-white">{group.title}</p>
                      </div>
                    </div>
                    <div className="text-white/40">
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-2 grid gap-2">
                      {group.items.map((item) => (
                        <button
                          key={`${group.id}-${item.label}`}
                          type="button"
                          onClick={() => {
                            item.action();
                            setIsSidebarOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-[1.1rem] border px-3 py-2.5 text-left transition ${
                            item.active
                              ? 'border-cyan-400/35 bg-cyan-500/12 text-cyan-100'
                              : 'border-white/10 bg-black/20 text-white/60 hover:border-cyan-400/20 hover:text-cyan-200'
                          }`}
                          title={item.summary}
                        >
                          <span className="min-w-0 truncate text-[11px] font-black uppercase tracking-[0.16em]">{item.label}</span>
                          <span className={`h-2 w-2 shrink-0 rounded-full ${item.active ? 'bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]' : 'bg-white/15'}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Akce</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => void syncAdminEntries()}
                className="flex flex-col items-center gap-2 rounded-[1.4rem] border border-white/10 bg-black/20 px-3 py-4 text-white/65 transition hover:border-cyan-400/20 hover:text-cyan-300"
                title="Obnovit data"
              >
                <RefreshCw size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Obnovit</span>
              </button>
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex flex-col items-center gap-2 rounded-[1.4rem] border border-white/10 bg-black/20 px-3 py-4 text-white/65 transition hover:border-cyan-400/20 hover:text-cyan-300"
                title={isDark ? 'Přepnout na light' : 'Přepnout na dark'}
              >
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex flex-col items-center gap-2 rounded-[1.4rem] border border-red-500/20 bg-red-500/10 px-3 py-4 text-red-100 transition hover:bg-red-500/15"
                title="Odhlásit"
              >
                <LogOut size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Odhlásit</span>
              </button>
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
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 transition hover:border-cyan-400/35 hover:bg-cyan-500/15"
              aria-label="Otevřít admin menu"
              title="Otevřít admin menu"
            >
              <Menu size={18} />
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

        <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Rychlý přehled</p>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                {activeModeLabel}
              </h2>
              <p className="text-sm leading-relaxed text-white/40">
                {activeModeDescription} Hlavní navigace adminu je teď schovaná do vysouvacího postranního menu pod ikonou vlevo nahoře.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[620px] xl:grid-cols-4">
              {[
                {
                  label: 'Záznamy',
                  value: dashboardStats.total,
                  accent: 'text-cyan-300',
                  bg: 'bg-cyan-500/10'
                },
                {
                  label: 'Publikováno',
                  value: dashboardStats.published,
                  accent: 'text-emerald-300',
                  bg: 'bg-emerald-500/10'
                },
                {
                  label: 'Drafty',
                  value: dashboardStats.drafts,
                  accent: 'text-amber-300',
                  bg: 'bg-amber-500/10'
                },
                {
                  label: adminView === 'content' ? 'Typ obsahu' : 'Režim',
                  value: adminView === 'content' ? (activeType === 'news' ? 'Aktuality' : 'Blog') : activeModeLabel,
                  accent: 'text-teal-300',
                  bg: 'bg-teal-500/10'
                }
              ].map((card) => (
                <div key={card.label} className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className={`inline-flex rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${card.bg} ${card.accent}`}>
                    {card.label}
                  </div>
                  <p className="mt-5 text-2xl font-black text-white md:text-3xl">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {adminView === 'homepage' ? (
          <HomepageBuilderPanel
            initialMode={homepageFocus.mode}
            initialSlotId={homepageFocus.slotId}
            initialWidgetId={homepageFocus.widgetId}
          />
        ) : adminView === 'investment' ? (
          <InvestmentSettingsPanel isDark={isDark} />
        ) : adminView === 'downloads' ? (
          <DownloadsManagerPanel />
        ) : adminView === 'site' ? (
          <GlobalSettingsPanel
            isDark={isDark}
            initialPanel={siteFocus.panel}
            initialPageIntro={siteFocus.pageIntro}
          />
        ) : adminView === 'gallery' ? (
          <GalleryManagerPanel />
        ) : (
          <div className="grid gap-8 xl:grid-cols-[360px,1fr]">
          <aside className="glass-panel rounded-[3rem] border-white/10 p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Krok 1 a 2</p>
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
                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectEntry(entry)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-500/8 text-cyan-200 transition hover:border-cyan-400/30 hover:text-cyan-100"
                        title={`Upravit položku ${entry.title}`}
                        aria-label={`Upravit položku ${entry.title}`}
                      >
                        <PencilLine size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteEntry(entry)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/15"
                        title={`Smazat položku ${entry.title}`}
                        aria-label={`Smazat položku ${entry.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="space-y-6">
            <AdminStickyActionBar
              title={editorState.id ? `CMS · ${editorState.title || 'bez názvu'}` : 'CMS · nový záznam'}
              status={error ? 'error' : isSaving ? 'saving' : editorHasUnsavedChanges ? 'dirty' : notice ? 'saved' : 'idle'}
              previewHref={editorState.type === 'news' ? '/novinky' : '/blog'}
              message={
                error ||
                notice ||
                (editorHasUnsavedChanges
                  ? 'Obsah má neuložené změny. Ulož je, aby se propsaly do CMS.'
                  : 'Obsahový editor je připravený.')
              }
              actions={
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] bg-cyan-500 px-4 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-cyan-400 disabled:opacity-55"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Uložit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!selectedId || isSaving}
                    className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] border border-red-500/20 bg-red-500/10 px-4 text-xs font-black uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/15 disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                    Smazat
                  </button>
                </>
              }
            />

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
                  <AdminInfoTooltip
                    title="Jak pracovat s obsahem"
                    description="Nápověda je schovaná sem, aby editor zůstal čistý a působil jako pracovní plocha, ne jako návodová stránka."
                    items={[
                      'Nejdřív vlevo zvol Aktuality nebo Blog a otevři konkrétní položku.',
                      'V editoru uprav text, cover obrázek, stav a datum publikace.',
                      'Po uložení se změny propíšou do CMS a podle stavu i na veřejný web.'
                    ]}
                    label="Nápověda"
                  />
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
                    <FieldLabel label="Zdrojová URL média" hint="Použij veřejnou URL obrázku. Můžeš ji buď uložit do Supabase Storage, nebo použít přímo bez uploadu." />
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
                    <p className="text-xs leading-relaxed text-white/38">
                      Lokální obrázky před uploadem automaticky zmenšíme a zkomprimujeme, aby cover
                      nebyl zbytečně těžký.
                    </p>

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

                {(notice || error) && (
                  <div className="glass-panel rounded-[3rem] border-white/10 p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Stav operace</p>
                    <div className="mt-4 space-y-3">
                      {notice && (
                        <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">
                          {notice}
                        </div>
                      )}
                      {error && (
                        <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                          <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.18em] text-red-200">
                            <AlertCircle size={14} />
                            Chyba
                          </div>
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
