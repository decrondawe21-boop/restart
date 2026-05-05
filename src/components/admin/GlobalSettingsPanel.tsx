import {
  Copy,
  Facebook,
  FileText,
  Globe,
  HelpCircle,
  ImagePlus,
  Instagram,
  LayoutTemplate,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Upload
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MatrixFxHero from '../MatrixFxHero';
import {
  deleteMediaLibraryAsset,
  fetchSiteSettings,
  listMediaLibraryAssets,
  saveSiteSetting,
  uploadImageFileToStorage,
  uploadImageFromUrlToStorage,
  type MediaLibraryAsset
} from '../../lib/cms';
import {
  defaultLegalPageContent,
  defaultPageIntroContent,
  defaultPublicContactInfo,
  defaultSiteNavigationSettings,
  globalNavigationSettingKey,
  globalPublicContactSettingKey,
  legalPageContentSettingKey,
  navigationItemDefinitions,
  normalizeLegalPageContent,
  normalizePageIntroContent,
  normalizePublicContactInfo,
  normalizeSiteNavigationSettings,
  pageIntroContentSettingKey,
  pageIntroDefinitions,
  type FooterLegalLinkSetting,
  type LegalPageContentSettings,
  type LegalPageKey,
  type PageIntroContentSettings,
  type PageIntroKey,
  type PublicContactInfo,
  type SiteLegalSection,
  type SiteNavigationSettings,
  type SocialLinkKey
} from '../../lib/siteSettings';

interface GlobalSettingsPanelProps {
  isDark: boolean;
}

type SitePanel = 'contact' | 'navigation' | 'pages' | 'media' | LegalPageKey;

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

const legalPageLabels: Record<LegalPageKey, string> = {
  privacy: 'Ochrana údajů',
  terms: 'Podmínky užití',
  cookies: 'Cookies'
};

const socialLabels: Record<SocialLinkKey, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  globe: 'Web / Globe'
};

const socialIcons: Record<SocialLinkKey, React.ReactElement> = {
  instagram: <Instagram size={16} className="text-cyan-300" />,
  facebook: <Facebook size={16} className="text-cyan-300" />,
  globe: <Globe size={16} className="text-cyan-300" />
};

const panelLabels: Record<Exclude<SitePanel, LegalPageKey>, string> = {
  contact: 'Kontakty a footer',
  navigation: 'Menu, footer linky a sociální sítě',
  pages: 'Jednoduchý page builder',
  media: 'Media knihovna'
};

const arrayToTextareaValue = (items?: string[]) => (items ?? []).join('\n');
const textareaToArray = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const mediaFolders = [
  { key: 'media-library', label: 'Media library' },
  { key: 'homepage', label: 'Homepage sloty' },
  { key: 'gallery', label: 'Galerie' },
  { key: 'cms/news', label: 'Aktuality' },
  { key: 'cms/blog', label: 'Blog' }
] as const;

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({ isDark }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [contact, setContact] = useState<PublicContactInfo>(defaultPublicContactInfo);
  const [legalPages, setLegalPages] = useState<LegalPageContentSettings>(defaultLegalPageContent);
  const [navigation, setNavigation] = useState<SiteNavigationSettings>(defaultSiteNavigationSettings);
  const [pageIntros, setPageIntros] = useState<PageIntroContentSettings>(defaultPageIntroContent);
  const [selectedPanel, setSelectedPanel] = useState<SitePanel>('contact');
  const [selectedPageIntro, setSelectedPageIntro] = useState<PageIntroKey>('about');
  const [mediaFolder, setMediaFolder] = useState<string>(mediaFolders[0].key);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAssets, setMediaAssets] = useState<MediaLibraryAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isMediaBusy, setIsMediaBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const selectedLegalPage =
    selectedPanel === 'contact' || selectedPanel === 'navigation' || selectedPanel === 'pages' || selectedPanel === 'media'
      ? null
      : legalPages[selectedPanel];

  const groupedNavigationItems = useMemo(
    () =>
      navigationItemDefinitions.reduce<Record<string, typeof navigationItemDefinitions>>((acc, item) => {
        acc[item.group] ??= [];
        acc[item.group].push(item);
        return acc;
      }, {}),
    []
  );

  const visibleMenuCount = useMemo(
    () => navigation.menuItems.filter((item) => item.visible).length,
    [navigation.menuItems]
  );

  const quickStats = useMemo(
    () => [
      {
        label: 'Viditelné menu body',
        value: visibleMenuCount,
        description: 'Počet položek, které se reálně zobrazují v rozevíracím menu webu.',
        accent: 'text-cyan-300',
        bg: 'bg-cyan-500/10'
      },
      {
        label: 'Page headery',
        value: pageIntroDefinitions.length,
        description: 'Jednoduše editovatelné titulky pro další hlavní stránky webu.',
        accent: 'text-emerald-300',
        bg: 'bg-emerald-500/10'
      },
      {
        label: 'Právní overlaye',
        value: 3,
        description: 'Glassmorph modaly pro Ochranu údajů, Podmínky užití a Cookies.',
        accent: 'text-amber-300',
        bg: 'bg-amber-500/10'
      },
      {
        label: 'Assety ve složce',
        value: mediaAssets.length,
        description: 'Aktuálně načtené obrázky v otevřené složce media knihovny.',
        accent: 'text-teal-300',
        bg: 'bg-teal-500/10'
      }
    ],
    [mediaAssets.length, visibleMenuCount]
  );

  useEffect(() => {
    void (async () => {
      await Promise.all([syncSettings(), syncMediaAssets(mediaFolder)]);
    })();
  }, []);

  const syncSettings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const records = await fetchSiteSettings([
        globalPublicContactSettingKey,
        legalPageContentSettingKey,
        globalNavigationSettingKey,
        pageIntroContentSettingKey
      ]);
      const byKey = new Map(records.map((record) => [record.key, record.value_json]));

      setContact(normalizePublicContactInfo(byKey.get(globalPublicContactSettingKey)));
      setLegalPages(normalizeLegalPageContent(byKey.get(legalPageContentSettingKey)));
      setNavigation(normalizeSiteNavigationSettings(byKey.get(globalNavigationSettingKey)));
      setPageIntros(normalizePageIntroContent(byKey.get(pageIntroContentSettingKey)));
    } catch (caughtError) {
      setContact(defaultPublicContactInfo);
      setLegalPages(defaultLegalPageContent);
      setNavigation(defaultSiteNavigationSettings);
      setPageIntros(defaultPageIntroContent);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení webového nastavení selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncMediaAssets = async (folder = mediaFolder) => {
    setIsMediaLoading(true);
    setError('');

    try {
      const assets = await listMediaLibraryAssets(folder);
      setMediaAssets(assets);
    } catch (caughtError) {
      setMediaAssets([]);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení media knihovny selhalo.');
    } finally {
      setIsMediaLoading(false);
    }
  };

  const updateContact = <T extends keyof PublicContactInfo>(key: T, value: PublicContactInfo[T]) => {
    setContact((prev) => ({ ...prev, [key]: value }));
  };

  const updateLegalPage = <T extends keyof LegalPageContentSettings[LegalPageKey]>(
    pageKey: LegalPageKey,
    field: T,
    value: LegalPageContentSettings[LegalPageKey][T]
  ) => {
    setLegalPages((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value }
    }));
  };

  const updateLegalSection = (
    pageKey: LegalPageKey,
    index: number,
    field: keyof SiteLegalSection,
    value: string[] | string
  ) => {
    setLegalPages((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        sections: prev[pageKey].sections.map((section, sectionIndex) =>
          sectionIndex === index ? { ...section, [field]: value } : section
        )
      }
    }));
  };

  const updateNavigationMenuItem = (
    key: SiteNavigationSettings['menuItems'][number]['key'],
    patch: Partial<SiteNavigationSettings['menuItems'][number]>
  ) => {
    setNavigation((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) => (item.key === key ? { ...item, ...patch } : item))
    }));
  };

  const updateFooterLink = (key: FooterLegalLinkSetting['key'], patch: Partial<FooterLegalLinkSetting>) => {
    setNavigation((prev) => ({
      ...prev,
      footerLinks: prev.footerLinks.map((item) => (item.key === key ? { ...item, ...patch } : item))
    }));
  };

  const updateSocialLink = (
    key: SiteNavigationSettings['socialLinks'][number]['key'],
    patch: Partial<SiteNavigationSettings['socialLinks'][number]>
  ) => {
    setNavigation((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item) => (item.key === key ? { ...item, ...patch } : item))
    }));
  };

  const updatePageIntro = (key: PageIntroKey, patch: Partial<PageIntroContentSettings[PageIntroKey]>) => {
    setPageIntros((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setNotice('');
    setError('');

    try {
      await Promise.all([
        saveSiteSetting(globalPublicContactSettingKey, contact),
        saveSiteSetting(legalPageContentSettingKey, legalPages),
        saveSiteSetting(globalNavigationSettingKey, navigation),
        saveSiteSetting(pageIntroContentSettingKey, pageIntros)
      ]);
      setNotice('Webové nastavení bylo uloženo. Navigace, footer, sociální sítě i page headery teď čtou nové hodnoty z databáze.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení webového nastavení selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setContact(defaultPublicContactInfo);
    setLegalPages(defaultLegalPageContent);
    setNavigation(defaultSiteNavigationSettings);
    setPageIntros(defaultPageIntroContent);
    setSelectedPanel('contact');
    setSelectedPageIntro('about');
    setNotice('Lokálně jsem obnovil výchozí nastavení webu. Pro propsání na veřejný web je ještě ulož.');
    setError('');
  };

  const handleCopyMediaUrl = async (asset: MediaLibraryAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setNotice(`URL pro „${asset.name}“ jsem zkopíroval do schránky.`);
      setError('');
    } catch {
      window.prompt('Kopírování do schránky selhalo. Tady je URL:', asset.url);
    }
  };

  const handleMediaImportFromUrl = async () => {
    if (!mediaUrl.trim()) return;
    setIsMediaBusy(true);
    setNotice('');
    setError('');

    try {
      await uploadImageFromUrlToStorage(mediaUrl.trim(), mediaFolder);
      setNotice('Obrázek byl uložen do media knihovny.');
      setMediaUrl('');
      await syncMediaAssets(mediaFolder);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Upload obrázku z URL selhal.');
    } finally {
      setIsMediaBusy(false);
    }
  };

  const handleMediaUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsMediaBusy(true);
    setNotice('');
    setError('');

    try {
      await uploadImageFileToStorage(file, mediaFolder);
      setNotice('Soubor byl uložen do media knihovny.');
      await syncMediaAssets(mediaFolder);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nahrání souboru selhalo.');
    } finally {
      setIsMediaBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteMedia = async (asset: MediaLibraryAsset) => {
    if (!window.confirm(`Opravdu chceš odstranit soubor „${asset.name}“?`)) return;
    setIsMediaBusy(true);
    setNotice('');
    setError('');

    try {
      await deleteMediaLibraryAsset(asset.path);
      setNotice(`Soubor „${asset.name}“ byl odstraněn z bucketu.`);
      await syncMediaAssets(mediaFolder);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Mazání souboru selhalo.');
    } finally {
      setIsMediaBusy(false);
    }
  };

  const handleRefreshMediaFolder = async (folder: string) => {
    setMediaFolder(folder);
    await syncMediaAssets(folder);
  };

  const selectedPageIntroEntry = pageIntros[selectedPageIntro];
  const navigationPreviewItems = navigation.menuItems.filter((item) => item.visible);
  const footerPreviewLinks = navigation.footerLinks.filter((item) => item.visible);
  const socialPreviewLinks = navigation.socialLinks.filter((item) => item.visible && item.url.trim().length > 0);

  const renderContactEditor = () => (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <FieldLabel label="Firma" hint="Veřejný název firmy zobrazovaný napříč webem." />
        <input value={contact.companyName} onChange={(event) => updateContact('companyName', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Firma uppercase" hint="Verze pro výrazné titulky a nadpisy." />
        <input value={contact.companyNameUpper} onChange={(event) => updateContact('companyNameUpper', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Adresa" hint="Ulice a číslo popisné." />
        <input value={contact.addressLine} onChange={(event) => updateContact('addressLine', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Město" hint="PSČ a město." />
        <input value={contact.cityLine} onChange={(event) => updateContact('cityLine', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Telefon" hint="Hlavní veřejný telefon." />
        <input value={contact.phone} onChange={(event) => updateContact('phone', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Email" hint="Hlavní veřejný e-mail." />
        <input value={contact.email} onChange={(event) => updateContact('email', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Primární web" hint="Text odkazu na hlavní web." />
        <input value={contact.primaryWebsite} onChange={(event) => updateContact('primaryWebsite', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Primární URL" hint="Plná URL hlavního webu včetně https://." />
        <input value={contact.primaryWebsiteUrl} onChange={(event) => updateContact('primaryWebsiteUrl', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Sekundární web" hint="Text odkazu na druhý web." />
        <input value={contact.secondaryWebsite} onChange={(event) => updateContact('secondaryWebsite', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2">
        <FieldLabel label="Sekundární URL" hint="Plná URL druhého webu včetně https://." />
        <input value={contact.secondaryWebsiteUrl} onChange={(event) => updateContact('secondaryWebsiteUrl', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <FieldLabel label="Registrace" hint="Řádek s obchodním rejstříkem nebo právní identifikací." />
        <textarea value={contact.registrationNote} onChange={(event) => updateContact('registrationNote', event.target.value)} rows={3} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <FieldLabel label="Company meta" hint="Krátká řádka typu IČO / DIČ nebo další firemní metadata." />
        <input value={contact.companyMeta} onChange={(event) => updateContact('companyMeta', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
      </div>
    </div>
  );

  const renderNavigationEditor = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Menu a navigace</p>
          <p className="mt-2 text-sm text-white/40">Přepisuješ názvy položek a můžeš je skrýt. Struktura menu zůstává bezpečně pevná, takže nic nerozbiješ.</p>
        </div>

        {Object.entries(groupedNavigationItems).map(([group, items]) => (
          <div key={group} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white">{group}</p>
            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const current = navigation.menuItems.find((entry) => entry.key === item.key);
                const widthClass =
                  item.depth === 1 ? 'ml-4 w-[calc(100%-1rem)]' : item.depth === 2 ? 'ml-8 w-[calc(100%-2rem)]' : '';

                return (
                  <div key={item.key} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                          {item.depth === 0 ? 'Hlavní položka' : item.depth === 1 ? 'Podpoložka' : 'Třetí úroveň'}
                        </p>
                        <p className="mt-1 text-xs text-white/35">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateNavigationMenuItem(item.key, { visible: !current?.visible })}
                        className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                          current?.visible
                            ? 'bg-cyan-500 text-black'
                            : 'border border-white/10 bg-white/[0.04] text-white/60'
                        }`}
                      >
                        {current?.visible ? 'Viditelné' : 'Skryté'}
                      </button>
                    </div>
                    <input
                      value={current?.label ?? item.label}
                      onChange={(event) => updateNavigationMenuItem(item.key, { label: event.target.value })}
                      className={`rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30 ${widthClass || 'w-full'}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white">Footer rychlé odkazy</p>
          <div className="mt-4 space-y-3">
            {navigation.footerLinks.map((link) => (
              <div key={link.key} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-white">{legalPageLabels[link.key]}</p>
                  <button
                    type="button"
                    onClick={() => updateFooterLink(link.key, { visible: !link.visible })}
                    className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                      link.visible
                        ? 'bg-cyan-500 text-black'
                        : 'border border-white/10 bg-white/[0.04] text-white/60'
                    }`}
                  >
                    {link.visible ? 'Viditelné' : 'Skryté'}
                  </button>
                </div>
                <input
                  value={link.label}
                  onChange={(event) => updateFooterLink(link.key, { label: event.target.value })}
                  className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white">Sociální sítě a footer texty</p>
          <div className="mt-4 space-y-3">
            {navigation.socialLinks.map((link) => (
              <div key={link.key} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {socialIcons[link.key]}
                    <p className="text-sm font-black text-white">{socialLabels[link.key]}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSocialLink(link.key, { visible: !link.visible })}
                    className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                      link.visible
                        ? 'bg-cyan-500 text-black'
                        : 'border border-white/10 bg-white/[0.04] text-white/60'
                    }`}
                  >
                    {link.visible ? 'Viditelné' : 'Skryté'}
                  </button>
                </div>
                <input
                  value={link.label}
                  onChange={(event) => updateSocialLink(link.key, { label: event.target.value })}
                  placeholder="Label"
                  className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                />
                <input
                  value={link.url}
                  onChange={(event) => updateSocialLink(link.key, { url: event.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4">
            <div className="space-y-2">
              <FieldLabel label="Footer tagline" hint="Krátký řádek pod značkou REST||ART." />
              <input value={navigation.footerTagline} onChange={(event) => setNavigation((prev) => ({ ...prev, footerTagline: event.target.value }))} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
            </div>
            <div className="space-y-2">
              <FieldLabel label="Copyright" hint="Řádek ve spodní části footeru." />
              <input value={navigation.footerCopyright} onChange={(event) => setNavigation((prev) => ({ ...prev, footerCopyright: event.target.value }))} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
            </div>
            <div className="space-y-2">
              <FieldLabel label="Práva" hint="Krátký doplňkový text typu Všechna práva vyhrazena." />
              <input value={navigation.footerRights} onChange={(event) => setNavigation((prev) => ({ ...prev, footerRights: event.target.value }))} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
            </div>
            <div className="space-y-2">
              <FieldLabel label="Design credit" hint="Podpis designu ve spodní části footeru." />
              <input value={navigation.footerDesignCredit} onChange={(event) => setNavigation((prev) => ({ ...prev, footerDesignCredit: event.target.value }))} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPagesEditor = () => (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        {pageIntroDefinitions.map((definition) => (
          <button
            key={definition.key}
            type="button"
            onClick={() => setSelectedPageIntro(definition.key)}
            className={`rounded-[1.7rem] border px-4 py-4 text-left transition ${
              selectedPageIntro === definition.key
                ? 'border-cyan-400/30 bg-cyan-500/10'
                : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/20'
            }`}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white">{definition.label}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/35">{definition.description}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel label="Eyebrow" hint="Malý horní štítek stránky." />
          <input value={selectedPageIntroEntry.eyebrow} onChange={(event) => updatePageIntro(selectedPageIntro, { eyebrow: event.target.value })} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Popis" hint="Krátký úvodní text vpravo nebo pod headerem." />
          <textarea value={selectedPageIntroEntry.description} onChange={(event) => updatePageIntro(selectedPageIntro, { description: event.target.value })} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Title lead" hint="První část velkého nadpisu." />
          <input value={selectedPageIntroEntry.titleLead} onChange={(event) => updatePageIntro(selectedPageIntro, { titleLead: event.target.value })} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Title accent" hint="Druhá zvýrazněná část nadpisu." />
          <input value={selectedPageIntroEntry.titleAccent} onChange={(event) => updatePageIntro(selectedPageIntro, { titleAccent: event.target.value })} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
      </div>
    </div>
  );

  const renderMediaEditor = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {mediaFolders.map((folder) => (
          <button
            key={folder.key}
            type="button"
            onClick={() => void handleRefreshMediaFolder(folder.key)}
            className={`rounded-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] transition ${
              mediaFolder === folder.key
                ? 'bg-cyan-500 text-black'
                : 'border border-white/10 bg-white/[0.04] text-white/65 hover:border-cyan-400/30 hover:text-cyan-300'
            }`}
          >
            {folder.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel label="Aktivní složka" hint="Sem se ukládají nové soubory. Můžeš použít i vlastní cestu v bucketu." />
            <div className="flex gap-3">
              <input
                value={mediaFolder}
                onChange={(event) => setMediaFolder(event.target.value)}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
              />
              <button
                type="button"
                onClick={() => void syncMediaAssets(mediaFolder)}
                className="inline-flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                <RefreshCw size={14} />
                Načíst
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel label="Nahrát z URL" hint="Vloží veřejné URL obrázku a stáhne ho do zvolené složky bucketu." />
            <div className="flex gap-3">
              <input
                value={mediaUrl}
                onChange={(event) => setMediaUrl(event.target.value)}
                placeholder="https://..."
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
              />
              <button
                type="button"
                onClick={handleMediaImportFromUrl}
                disabled={isMediaBusy}
                className="inline-flex items-center gap-2 rounded-[1.5rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
              >
                {isMediaBusy ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                Import
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white">Nahrát soubor</p>
          <p className="mt-2 text-sm text-white/40">Rychlý upload do právě otevřené složky bez přepisování URL ručně.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isMediaBusy}
              className="inline-flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-70"
            >
              {isMediaBusy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Vybrat soubor
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleMediaUploadFile} />
          </div>
        </div>
      </div>

      {isMediaLoading ? (
        <div className="flex items-center gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-white/50">
          <Loader2 size={16} className="animate-spin" />
          Načítám media knihovnu…
        </div>
      ) : mediaAssets.length === 0 ? (
        <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/45">
          V této složce zatím nejsou žádné assety. Nahraj první obrázek souborem nebo z URL.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mediaAssets.map((asset) => (
            <div key={asset.path} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                <img src={asset.url} alt={asset.name} className="h-48 w-full object-cover" />
              </div>
              <div className="mt-4 space-y-2">
                <p className="line-clamp-1 text-sm font-black text-white">{asset.name}</p>
                <p className="line-clamp-1 text-[10px] uppercase tracking-[0.18em] text-white/30">{asset.path}</p>
                {asset.size ? <p className="text-xs text-white/35">{Math.round(asset.size / 1024)} KB</p> : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopyMediaUrl(asset)}
                  className="inline-flex items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <Copy size={12} />
                  URL
                </button>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <Globe size={12} />
                  Otevřít
                </a>
                <button
                  type="button"
                  onClick={() => void handleDeleteMedia(asset)}
                  className="inline-flex items-center gap-2 rounded-[1.2rem] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/15"
                >
                  <Trash2 size={12} />
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLegalEditor = () => (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel label="Eyebrow" hint="Malý horní štítek overlaye." />
          <input value={selectedLegalPage?.eyebrow ?? ''} onChange={(event) => updateLegalPage(selectedPanel as LegalPageKey, 'eyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Titulek" hint="Hlavní nadpis právní stránky." />
          <input value={selectedLegalPage?.title ?? ''} onChange={(event) => updateLegalPage(selectedPanel as LegalPageKey, 'title', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <FieldLabel label="Popis" hint="Úvodní vysvětlení hned pod titulkem." />
          <textarea value={selectedLegalPage?.description ?? ''} onChange={(event) => updateLegalPage(selectedPanel as LegalPageKey, 'description', event.target.value)} rows={3} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
        </div>
      </div>

      <div className="space-y-5">
        {selectedLegalPage?.sections.map((section, index) => (
          <div key={`${selectedPanel}-${index}`} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck size={16} className="text-cyan-300" />
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">Sekce {index + 1}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <FieldLabel label="Heading" hint="Titulek samostatného bloku uvnitř overlaye." />
                <input value={section.heading} onChange={(event) => updateLegalSection(selectedPanel as LegalPageKey, index, 'heading', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
              <div className="space-y-2">
                <FieldLabel label="Odstavce" hint="Jeden odstavec na řádek." />
                <textarea value={arrayToTextareaValue(section.paragraphs)} onChange={(event) => updateLegalSection(selectedPanel as LegalPageKey, index, 'paragraphs', textareaToArray(event.target.value))} rows={6} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
              <div className="space-y-2">
                <FieldLabel label="Bullets" hint="Jeden bullet bod na řádek." />
                <textarea value={arrayToTextareaValue(section.bullets)} onChange={(event) => updateLegalSection(selectedPanel as LegalPageKey, index, 'bullets', textareaToArray(event.target.value))} rows={6} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEditorContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-white/50">
          <Loader2 size={16} className="animate-spin" />
          Načítám webové nastavení…
        </div>
      );
    }

    if (selectedPanel === 'contact') return renderContactEditor();
    if (selectedPanel === 'navigation') return renderNavigationEditor();
    if (selectedPanel === 'pages') return renderPagesEditor();
    if (selectedPanel === 'media') return renderMediaEditor();
    return renderLegalEditor();
  };

  const renderPreviewContent = () => {
    if (selectedPanel === 'contact') {
      return (
        <div className="space-y-5 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled footeru</p>
          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
            <p className="text-xl font-black text-white">{contact.companyName}</p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">{navigation.footerTagline}</p>
            <div className="mt-4 space-y-2 text-sm text-white/50">
              <p className="flex items-center gap-2"><MapPin size={14} className="text-cyan-300" /> {contact.addressLine}, {contact.cityLine}</p>
              <p className="flex items-center gap-2"><Mail size={14} className="text-cyan-300" /> {contact.email}</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-cyan-300" /> {contact.phone}</p>
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-white/35">
              {contact.registrationNote}
              <div className="mt-2">{contact.companyMeta}</div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedPanel === 'navigation') {
      return (
        <div className="space-y-5 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled menu a footeru</p>
          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Viditelné menu</p>
                <div className="mt-3 space-y-2">
                  {navigationPreviewItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-black/20 px-3 py-3">
                      <span className="text-sm text-white">{item.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">{item.key}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4 space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Footer odkazy</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {footerPreviewLinks.map((item) => (
                      <span key={item.key} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Sociální sítě</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {socialPreviewLinks.map((item) => (
                      <span key={item.key} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                        {socialIcons[item.key]}
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-xs text-white/45">
                  <p>{navigation.footerCopyright}</p>
                  <p className="mt-2">{navigation.footerRights}</p>
                  <p className="mt-2">Design by {navigation.footerDesignCredit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedPanel === 'pages') {
      return (
        <div className="space-y-5 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled headeru stránky</p>
          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-cyan-400">
              {selectedPageIntroEntry.eyebrow}
            </div>
            <h3 className="mt-5 text-4xl font-black uppercase leading-none text-white">
              {selectedPageIntroEntry.titleLead}
              <br />
              <span className="headline-thin text-cyan-300">{selectedPageIntroEntry.titleAccent}</span>
            </h3>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/45">{selectedPageIntroEntry.description}</p>
          </div>
        </div>
      );
    }

    if (selectedPanel === 'media') {
      return (
        <div className="space-y-5 p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled knihovny</p>
          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-black text-white">{mediaFolder}</p>
                <p className="mt-2 text-sm text-white/40">Načteno {mediaAssets.length} assetů v aktuální složce.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                <ImagePlus size={14} />
                Storage preview
              </div>
            </div>
            {mediaAssets[0] ? (
              <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-white/10">
                <img src={mediaAssets[0].url} alt={mediaAssets[0].name} className="h-72 w-full object-cover" />
              </div>
            ) : (
              <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/45">
                V této složce zatím není náhledový asset.
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled overlaye</p>
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-cyan-400">
            <ShieldCheck size={13} />
            {selectedLegalPage?.eyebrow}
          </div>
          <h3 className="mt-5 text-3xl font-black uppercase text-white">{selectedLegalPage?.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/45">{selectedLegalPage?.description}</p>
          <div className="mt-5 space-y-4">
            {selectedLegalPage?.sections.map((section) => (
              <div key={section.heading} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-lg font-black text-white">{section.heading}</p>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-relaxed text-white/50">{paragraph}</p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-white/55">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[2.8rem] border-white/10 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Jak upravit webové nastavení</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ['1. Vyber oblast', 'Klikni na kontakty, navigaci, page builder, media knihovnu nebo právní overlay.'],
            ['2. Přepiš nebo nahraj', 'Uprav texty, viditelnost odkazů, nahraj nové obrázky nebo změň titulky stránek.'],
            ['3. Ulož a zkontroluj', 'Ulož nastavení a podívej se do náhledu, co přesně se propsalo na veřejný web.']
          ].map(([title, text]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{title}</p>
              <p className="mt-2 text-sm text-white/40">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr,0.98fr]">
        <div className="glass-panel rounded-[3rem] border-white/10 p-4">
          <MatrixFxHero
            isDark={isDark}
            darkLogoSrc="/images/podklady/branding/logo-9.png"
            lightLogoSrc="/images/podklady/branding/logo-main.png"
            darkLogoAlt="Webové nastavení"
            lightLogoAlt="Webové nastavení"
            revealFrom="bottom"
            label="Webový editor"
            description="Menu, footer, sociální sítě, další page headery i media knihovna teď žijí v jednom přehledném panelu."
            bulge={{ type: 'ripple', duration: 4, intensity: 12, repeat: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {quickStats.map((card) => (
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

      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <aside className="glass-panel rounded-[3rem] border-white/10 p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Krok 1</p>
              <h2 className="mt-2 text-2xl font-black text-white">Oblasti editoru</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                void syncSettings();
                void syncMediaAssets(mediaFolder);
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
              title="Obnovit webové nastavení"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {([
              ['contact', 'Kontakty a footer', 'Veřejné firemní údaje, weby a základ footeru.', <Phone size={16} className="text-cyan-300" />],
              ['navigation', 'Navigace a social', 'Menu body, footer linky a sociální sítě.', <Navigation size={16} className="text-cyan-300" />],
              ['pages', 'Page builder', 'Jednoduché headery pro další stránky.', <LayoutTemplate size={16} className="text-cyan-300" />],
              ['media', 'Media knihovna', 'Bucket s obrázky pro opakované použití.', <ImagePlus size={16} className="text-cyan-300" />]
            ] as Array<[Exclude<SitePanel, LegalPageKey>, string, string, React.ReactElement]>).map(([key, title, description, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPanel(key)}
                className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  selectedPanel === key
                    ? 'border-cyan-400/30 bg-cyan-500/10'
                    : 'border-white/10 bg-black/20 hover:border-cyan-400/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <p className="text-sm font-black text-white">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/35">{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Právní overlaye</p>
            <div className="space-y-2">
              {(Object.keys(legalPageLabels) as LegalPageKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPanel(key)}
                  className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                    selectedPanel === key
                      ? 'border-cyan-400/30 bg-cyan-500/10'
                      : 'border-white/10 bg-black/20 hover:border-cyan-400/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-cyan-300" />
                    <div>
                      <p className="text-sm font-black text-white">{legalPageLabels[key]}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/35">Glassmorph modal otevřený nad aktuální stránkou.</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Krok 2 a 3</p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  {selectedPanel in legalPageLabels ? legalPageLabels[selectedPanel as LegalPageKey] : panelLabels[selectedPanel as Exclude<SitePanel, LegalPageKey>]}
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-white/40">
                  {selectedPanel === 'contact'
                    ? 'Veřejné kontakty a základní footerové údaje. Tohle je místo pro e-mail, telefon, adresu a oba weby.'
                    : selectedPanel === 'navigation'
                      ? 'Tady řídíš názvy menu, jejich viditelnost, footer linky a sociální sítě. Struktura zůstává stabilní, ale texty a viditelnost jsou editovatelné.'
                      : selectedPanel === 'pages'
                        ? 'Jednoduchý page builder mění jen horní header dalších stránek. Je to záměrně bezpečné a přehledné.'
                        : selectedPanel === 'media'
                          ? 'Media knihovna je určená pro opakované používání assetů. Můžeš sem nahrávat obrázky souborem i URL a pak je používat v editoru obsahu nebo homepage.'
                          : 'Tady upravuješ celý právní overlay. Každý blok má heading, odstavce a bullet body.'}
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
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                  className="inline-flex items-center gap-2 rounded-[1.6rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Uložit nastavení
                </button>
              </div>
            </div>

            {renderEditorContent()}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr,0.98fr]">
            <div className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-white/[0.03]">
              {renderPreviewContent()}
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-[2.6rem] border-white/10 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Stav operace</p>
                <div className="mt-4 space-y-3">
                  {notice && <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">{notice}</div>}
                  {error && <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                  {!notice && !error && (
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                      Menu, footer, právní obsah a page headery se ukládají do `site_settings`. Media knihovna pracuje přímo s bucketem `cms-media`.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Co je teď hotové</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/45">
                  <li>Editace veřejných kontaktů a firemních webů z jednoho místa.</li>
                  <li>Správa názvů menu, footer linků a sociálních sítí bez zásahu do kódu.</li>
                  <li>Jednoduchý page builder pro další hlavní stránky webu.</li>
                  <li>Media knihovna s uploadem z URL, souboru a mazáním assetů.</li>
                  <li>Plně editovatelné overlay stránky Ochrana údajů, Podmínky užití a Cookies.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GlobalSettingsPanel;
