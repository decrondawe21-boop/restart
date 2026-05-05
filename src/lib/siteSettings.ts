import { publicContact, type PublicContactInfo } from './publicContact';
export type { PublicContactInfo } from './publicContact';

export const homepageLayoutSettingKey = 'homepage_layout';
export const homepageMediaSlotsSettingKey = 'homepage_media_slots';
export const homepageWidgetContentSettingKey = 'homepage_widget_content';
export const globalPublicContactSettingKey = 'global_public_contact';
export const legalPageContentSettingKey = 'legal_page_content';
export const globalNavigationSettingKey = 'global_navigation';
export const pageIntroContentSettingKey = 'page_intro_content';
export const galleryGroupsSettingKey = 'gallery_groups';
export type LegalPageKey = 'privacy' | 'terms' | 'cookies';
export type SocialLinkKey = 'instagram' | 'facebook' | 'globe';
export type PageIntroKey =
  | 'about'
  | 'pillars'
  | 'stories'
  | 'news'
  | 'blog'
  | 'gallery'
  | 'projects'
  | 'contacts';
export type NavigationItemKey =
  | 'home'
  | 'about-root'
  | 'about-stories'
  | 'about-news'
  | 'about-blog'
  | 'about-contacts'
  | 'gallery'
  | 'downloads-root'
  | 'downloads-documents'
  | 'downloads-programs'
  | 'pillars-root'
  | 'pillar-jailbreak'
  | 'pillar-rework'
  | 'pillar-rework-analyza'
  | 'pillar-rework-implementace'
  | 'pillar-streetwise'
  | 'pillar-reset'
  | 'pillar-mistozlomu'
  | 'pillar-stabilizace'
  | 'projects'
  | 'invest-root'
  | 'zamer-cile'
  | 'zamer-rozpocet'
  | 'zamer-prinos'
  | 'zamer-harmonogram'
  | 'zamer-programy';

export type HomepageSectionId =
  | 'header-reveal'
  | 'hero-intro'
  | 'stats'
  | 'topic-pages'
  | 'legacy-storyline'
  | 'brochures'
  | 'ai-assistant'
  | 'pillars';

export interface HomepageSectionDefinition {
  id: HomepageSectionId;
  label: string;
  description: string;
}

export interface HomepageSectionSetting {
  id: HomepageSectionId;
  visible: boolean;
}

export const homepageSectionDefinitions: HomepageSectionDefinition[] = [
  {
    id: 'header-reveal',
    label: 'Úvodní video header',
    description: 'Velké video/logo nahoře před samotnou hero sekcí.'
  },
  {
    id: 'hero-intro',
    label: 'Hero intro',
    description: 'Hlavní claim, CTA tlačítka a hlavní vizuál projektu.'
  },
  {
    id: 'stats',
    label: 'Statistiky',
    description: 'Tři hlavní hodnoty projektu v kartách pod hero.'
  },
  {
    id: 'topic-pages',
    label: 'Rozdělení obsahu',
    description: 'Přehled hlavních tematických stránek a vstupů.'
  },
  {
    id: 'legacy-storyline',
    label: 'Dlouhá homepage osa',
    description: 'Velké obsahové sekce, claimy, monetizace a narativní bloky.'
  },
  {
    id: 'brochures',
    label: 'Brožury',
    description: 'PDF a vizuální brožury s možností otevření dokumentů.'
  },
  {
    id: 'ai-assistant',
    label: 'AI asistent',
    description: 'Interaktivní textarea a navržený restart plán.'
  },
  {
    id: 'pillars',
    label: 'Šest pilířů',
    description: 'Přehled pilířů s odkazy na detailní stránky.'
  }
];

export type HomepageMediaSlotId =
  | 'hero-main-image'
  | 'manifest-silence'
  | 'manifest-everything-has-time'
  | 'manifest-challenge'
  | 'unity-poster'
  | 'why-not-nonprofit';

export interface HomepageMediaSlotDefinition {
  id: HomepageMediaSlotId;
  label: string;
  description: string;
  recommendedAspect: string;
}

export interface HomepageMediaSlotSetting {
  id: HomepageMediaSlotId;
  src: string;
  alt: string;
  caption: string;
}

export type HomepageWidgetId = 'hero-intro' | 'topic-pages' | 'ai-assistant';

export interface HomepageWidgetDefinition {
  id: HomepageWidgetId;
  label: string;
  description: string;
}

export interface HeroIntroWidgetContent {
  badge: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  mottoEyebrow: string;
  mottoQuote: string;
  mottoBody: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  imageQuote: string;
}

export interface TopicPagesWidgetContent {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
}

export interface AiAssistantWidgetContent {
  badge: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  loadingLabel: string;
  resultLabel: string;
}

export interface HomepageWidgetContentSettings {
  heroIntro: HeroIntroWidgetContent;
  topicPages: TopicPagesWidgetContent;
  aiAssistant: AiAssistantWidgetContent;
}

export interface SiteLegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface SiteLegalPageEntry {
  eyebrow: string;
  title: string;
  description: string;
  sections: SiteLegalSection[];
}

export type LegalPageContentSettings = Record<LegalPageKey, SiteLegalPageEntry>;

export interface NavigationItemDefinition {
  key: NavigationItemKey;
  label: string;
  description: string;
  group: string;
  depth: number;
}

export interface NavigationItemSetting {
  key: NavigationItemKey;
  label: string;
  visible: boolean;
}

export interface FooterLegalLinkSetting {
  key: LegalPageKey;
  label: string;
  visible: boolean;
}

export interface SocialLinkSetting {
  key: SocialLinkKey;
  label: string;
  url: string;
  visible: boolean;
}

export interface SiteNavigationSettings {
  menuItems: NavigationItemSetting[];
  footerLinks: FooterLegalLinkSetting[];
  socialLinks: SocialLinkSetting[];
  footerTagline: string;
  footerCopyright: string;
  footerRights: string;
  footerDesignCredit: string;
}

export interface PageIntroDefinition {
  key: PageIntroKey;
  label: string;
  description: string;
}

export interface PageIntroEntry {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
}

export type PageIntroContentSettings = Record<PageIntroKey, PageIntroEntry>;

export interface GalleryImageItem {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

export interface GalleryGroup {
  id: string;
  title: string;
  eventDate: string;
  description: string;
  published: boolean;
  images: GalleryImageItem[];
}

export type GalleryGroupsSettings = GalleryGroup[];

export const navigationItemDefinitions: NavigationItemDefinition[] = [
  { key: 'home', label: 'Domů', description: 'Úvodní vstup na homepage.', group: 'Hlavní menu', depth: 0 },
  { key: 'about-root', label: 'O nás', description: 'Základní rozcestník identitní a obsahové vrstvy.', group: 'Hlavní menu', depth: 0 },
  { key: 'about-stories', label: 'Příběhy', description: 'Skutečné příběhy a restarty.', group: 'O nás', depth: 1 },
  { key: 'about-news', label: 'Novinky a aktuality', description: 'Krátké novinky a veřejná oznámení.', group: 'O nás', depth: 1 },
  { key: 'about-blog', label: 'Blog / Archiv', description: 'Komentáře, analýzy a archivnější texty.', group: 'O nás', depth: 1 },
  { key: 'about-contacts', label: 'Kontakty (mini okno)', description: 'Kontakt otevřený jako modal.', group: 'O nás', depth: 1 },
  { key: 'gallery', label: 'Galerie', description: 'Veřejná galerie fotek rozdělená podle data a tématu.', group: 'Hlavní menu', depth: 0 },
  { key: 'downloads-root', label: 'Ke stažení', description: 'Veřejná knihovna souborů ke stažení.', group: 'Hlavní menu', depth: 0 },
  { key: 'downloads-documents', label: 'Dokumenty', description: 'Registrační formulář, grafy, výroční zprávy a další dokumenty.', group: 'Ke stažení', depth: 1 },
  { key: 'downloads-programs', label: 'Programy', description: 'Instalační soubory, nástroje a programové balíčky.', group: 'Ke stažení', depth: 1 },
  { key: 'pillars-root', label: 'Pilíře', description: 'Přehled šesti pilířů integrace.', group: 'Hlavní menu', depth: 0 },
  { key: 'pillar-jailbreak', label: 'JAILBREAK', description: 'Detail programu JAILBREAK.', group: 'Pilíře', depth: 1 },
  { key: 'pillar-rework', label: 'REWORK', description: 'Detail programu REWORK.', group: 'Pilíře', depth: 1 },
  { key: 'pillar-rework-analyza', label: 'Analýza trhu', description: 'Podstránka REWORK analýza trhu.', group: 'REWORK', depth: 2 },
  { key: 'pillar-rework-implementace', label: 'Implementace', description: 'Podstránka REWORK implementace.', group: 'REWORK', depth: 2 },
  { key: 'pillar-streetwise', label: 'STREETWISE', description: 'Detail programu STREETWISE.', group: 'Pilíře', depth: 1 },
  { key: 'pillar-reset', label: 'RESET', description: 'Detail programu RESET.', group: 'Pilíře', depth: 1 },
  { key: 'pillar-mistozlomu', label: 'MÍSTO ZLOMU', description: 'Detail programu MÍSTO ZLOMU.', group: 'Pilíře', depth: 1 },
  { key: 'pillar-stabilizace', label: 'STABILIZACE', description: 'Detail programu STABILIZACE.', group: 'Pilíře', depth: 1 },
  { key: 'projects', label: 'Projekty', description: 'Ecosystem a další projekty Davida Kozáka.', group: 'Hlavní menu', depth: 0 },
  { key: 'invest-root', label: 'Investiční záměr', description: 'Rozcestník investičního rámce projektu.', group: 'Hlavní menu', depth: 0 },
  { key: 'zamer-cile', label: 'Hlavní cíle investice', description: 'Strategické cíle investice.', group: 'Investiční záměr', depth: 1 },
  { key: 'zamer-rozpocet', label: 'Výše investice', description: 'Rozpočet, náklady a struktura výdajů.', group: 'Investiční záměr', depth: 1 },
  { key: 'zamer-prinos', label: 'Návratnost a přínos', description: 'Dopad, ROI a návratnost.', group: 'Investiční záměr', depth: 1 },
  { key: 'zamer-harmonogram', label: 'Harmonogram', description: 'Časový plán a fáze realizace.', group: 'Investiční záměr', depth: 1 },
  { key: 'zamer-programy', label: 'Přehled programů OPZ+', description: 'Přehled programových linií.', group: 'Investiční záměr', depth: 1 }
];

export const pageIntroDefinitions: PageIntroDefinition[] = [
  { key: 'about', label: 'O nás', description: 'Hlavní identitní vstup pro značku DKI a REST||ART.' },
  { key: 'pillars', label: 'Pilíře', description: 'Úvodní nadpis a popis sekce pilířů.' },
  { key: 'stories', label: 'Příběhy', description: 'Header příběhů a skutečných restartů.' },
  { key: 'news', label: 'Aktuality', description: 'Header stránky Novinky a aktuality.' },
  { key: 'blog', label: 'Blog', description: 'Header stránky Blog / Archiv.' },
  { key: 'gallery', label: 'Galerie', description: 'Header veřejné galerie.' },
  { key: 'projects', label: 'Projekty', description: 'Header stránky Projekty a ecosystem.' },
  { key: 'contacts', label: 'Kontakty', description: 'Header kontaktní stránky.' }
];

export const homepageMediaSlotDefinitions: HomepageMediaSlotDefinition[] = [
  {
    id: 'hero-main-image',
    label: 'Hero hlavní obrázek',
    description: 'Velký pravý vizuál v horní hero sekci homepage.',
    recommendedAspect: 'portrét / 5:7'
  },
  {
    id: 'manifest-silence',
    label: 'Claim Stačí ticho',
    description: 'Levá claim karta v sekci Značka druhé šance.',
    recommendedAspect: 'poster / 4:5'
  },
  {
    id: 'manifest-everything-has-time',
    label: 'Claim Všechno má svůj čas',
    description: 'Pravá claim karta v sekci Značka druhé šance.',
    recommendedAspect: 'poster / 4:5'
  },
  {
    id: 'manifest-challenge',
    label: 'Výzva plakát',
    description: 'Vizuál u CTA bloku Výzva.',
    recommendedAspect: 'čtverec / 1:1'
  },
  {
    id: 'unity-poster',
    label: 'Sjednocená odpovědnost',
    description: 'Poster pod citací v sekci Sjednocená odpovědnost.',
    recommendedAspect: 'krajina / 4:3'
  },
  {
    id: 'why-not-nonprofit',
    label: 'Proč nejsme jen neziskovka',
    description: 'Hlavní plakát monetizační sekce na homepage.',
    recommendedAspect: 'poster / volnější'
  }
];

export const defaultHomepageLayout: HomepageSectionSetting[] = homepageSectionDefinitions.map(({ id }) => ({
  id,
  visible: true
}));

export const defaultHomepageMediaSlots: HomepageMediaSlotSetting[] = homepageMediaSlotDefinitions.map(({ id }) => ({
  id,
  src: '',
  alt: '',
  caption: ''
}));

export const homepageWidgetDefinitions: HomepageWidgetDefinition[] = [
  {
    id: 'hero-intro',
    label: 'Hero texty',
    description: 'Badge, headline, motto a CTA tlačítka horní hero sekce.'
  },
  {
    id: 'topic-pages',
    label: 'Rozdělení obsahu',
    description: 'Nadpis a eyebrow sekce s hlavními stránkami.'
  },
  {
    id: 'ai-assistant',
    label: 'AI asistent',
    description: 'Nadpis, popis, placeholder a CTA texty AI sekce.'
  }
];

export const defaultHomepageWidgetContent: HomepageWidgetContentSettings = {
  heroIntro: {
    badge: 'David Kozák International, s.r.o.',
    titleLead: 'Druhou šanci si zaslouží',
    titleAccent: 'každý.',
    description:
      'Homepage znovu spojuje hlavní články a zpracované sekce do jednoho proudu. Zároveň zůstává zachované rozdělení do samostatných stránek a detailů v menu.',
    mottoEyebrow: 'Motto projektu',
    mottoQuote: '"Každý příběh má právo pokračovat."',
    mottoBody:
      'Druhá šance není slogan do kampaně. Je to pracovní metoda, která vrací člověka zpět do vztahů, práce a důvěry.',
    primaryCtaLabel: 'PŘEJÍT NA PILÍŘE',
    secondaryCtaLabel: 'O PROJEKTU',
    imageQuote: '"Každý příběh má právo pokračovat."'
  },
  topicPages: {
    eyebrow: 'Rozdělení obsahu',
    titleLead: 'Nové stránky',
    titleAccent: 'podle tématu'
  },
  aiAssistant: {
    badge: 'AI Integrační Asistent',
    titleLead: 'Váš plán',
    titleAccent: 'restartu',
    description: 'Napište nám o své situaci a naše AI vám navrhne první kroky podle pilířů Integrace.',
    placeholder: "Popište svou situaci... (např. 'Právě jsem vyšel z výkonu trestu a nemám kde bydlet')",
    submitLabel: 'Analyzovat příběh',
    loadingLabel: 'Analyzuji...',
    resultLabel: 'Navržený plán integrace'
  }
};

export const defaultPublicContactInfo: PublicContactInfo = {
  ...publicContact
};

export const defaultSiteNavigationSettings: SiteNavigationSettings = {
  menuItems: navigationItemDefinitions.map(({ key, label }) => ({
    key,
    label,
    visible: true
  })),
  footerLinks: [
    { key: 'privacy', label: 'Ochrana údajů', visible: true },
    { key: 'terms', label: 'Podmínky užití', visible: true },
    { key: 'cookies', label: 'Cookies', visible: true }
  ],
  socialLinks: [
    { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/', visible: true },
    { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/', visible: true },
    { key: 'globe', label: 'Web REST||ART', url: publicContact.primaryWebsiteUrl, visible: true }
  ],
  footerTagline: 'Iniciativa David Kozák International',
  footerCopyright: '© 2026 REST||ART INTEGRACE',
  footerRights: 'Všechna práva vyhrazena',
  footerDesignCredit: 'DK Studio'
};

export const defaultGalleryGroups: GalleryGroupsSettings = [];

export const defaultPageIntroContent: PageIntroContentSettings = {
  about: {
    eyebrow: 'O nás',
    titleLead: 'DKI s.r.o. &',
    titleAccent: 'REST||ART Integrace',
    description:
      'REST||ART, JAILBREAK, REWORK a další podprogramy tvoří jednu značku, která propojuje vnitřní proměnu, estetiku, profesionální rámec a každodenní realitu.'
  },
  pillars: {
    eyebrow: 'Pilíře',
    titleLead: 'Šest pilířů',
    titleAccent: 'integrace',
    description: 'Každý pilíř představuje klíčovou fázi integrace, která zajišťuje udržitelnou životní změnu.'
  },
  stories: {
    eyebrow: 'Příběhy',
    titleLead: 'Skutečné',
    titleAccent: 'restarty',
    description: 'Příběhy lidí, kteří prošli pádem, změnou a reálným návratem do práce, důvěry a života.'
  },
  news: {
    eyebrow: 'Aktuality REST||ART',
    titleLead: 'Novinky',
    titleAccent: 'a aktuality',
    description:
      'Aktuální dění, postpenitenciární podpora, milníky projektu a konkrétní kroky, ke kterým se REST||ART veřejně připojuje.'
  },
  blog: {
    eyebrow: 'Blog REST||ART',
    titleLead: 'Komentáře',
    titleAccent: 'a analýzy',
    description: 'Hloubkové texty o návratnosti, práci, reintegraci a principu druhé šance v systému REST||ART.'
  },
  gallery: {
    eyebrow: 'Galerie REST||ART',
    titleLead: 'Fotografie',
    titleAccent: 'z projektu',
    description: 'Skupiny fotek podle data a tématu. Veřejný vizuální archiv akcí, materiálů a momentů z integrační práce.'
  },
  projects: {
    eyebrow: 'Ecosystem David Kozák',
    titleLead: 'Vizionář',
    titleAccent: '& Design',
    description: 'Síť navazujících projektů, platforem a digitálních výstupů, které rozšiřují značku DKI mimo samotný REST||ART.'
  },
  contacts: {
    eyebrow: 'Jsme tu pro vás',
    titleLead: 'Kontaktujte',
    titleAccent: 'nás',
    description: 'Máte dotaz nebo se chcete zapojit? Napište nám nebo zavolejte. Každý kontakt je krokem k lepší budoucnosti.'
  }
};

export const defaultLegalPageContent: LegalPageContentSettings = {
  privacy: {
    eyebrow: 'Ochrana údajů',
    title: 'Ochrana osobních údajů',
    description:
      'Tato stránka shrnuje, jak REST||ART pracuje s kontaktními údaji, poptávkami, partnerskou komunikací a obsahem z administrace webu.',
    sections: [
      {
        heading: 'Jaké údaje zpracováváme',
        bullets: [
          'identifikační a kontaktní údaje odeslané přes formuláře nebo e-mail',
          'obsah zpráv, poptávek, žádostí o spolupráci a administrativní komunikace',
          'technické údaje o návštěvě webu v rozsahu potřebném pro bezpečný provoz'
        ]
      },
      {
        heading: 'Účel zpracování',
        paragraphs: [
          'Údaje používáme výhradně pro komunikaci, zajištění provozu webu, vyřízení dotazů, správu obsahu a navazující projektovou spolupráci.',
          'REST||ART nepoužívá osobní údaje k agresivnímu marketingu ani k jejich dalšímu prodeji třetím stranám.'
        ]
      },
      {
        heading: 'Správa a bezpečnost',
        paragraphs: [
          'Přístup k administraci je omezený pouze na schválené admin účty. Obsahový systém je provozovaný přes Supabase Auth, databázi a storage s řízenými oprávněními.',
          `Pokud chceš řešit výmaz, opravu nebo export údajů, kontaktuj nás na ${publicContact.email}.`
        ]
      }
    ]
  },
  terms: {
    eyebrow: 'Podmínky užití',
    title: 'Podmínky užití webu',
    description:
      'Web REST||ART slouží jako prezentační, informační a obsahová platforma projektu. Níže je základní rámec, ve kterém se obsah a služby používají.',
    sections: [
      {
        heading: 'Používání obsahu',
        paragraphs: [
          'Texty, claimy, vizuály, analytické výstupy a projektové materiály jsou určeny pro informování veřejnosti, partnerů a institucí o aktivitách REST||ART.',
          'Bez předchozí dohody není dovoleno vydávat obsah webu za vlastní nebo ho používat způsobem, který poškozuje značku nebo projekt.'
        ]
      },
      {
        heading: 'Dostupnost a změny',
        bullets: [
          'obsah webu se může průběžně měnit podle vývoje projektu',
          'administrace může dočasně upravovat nebo stahovat části webu bez předchozího upozornění',
          'veřejné informace mají informativní charakter a nenahrazují individuální smluvní ujednání'
        ]
      },
      {
        heading: 'Odpovědnost',
        paragraphs: [
          'REST||ART usiluje o maximální přesnost a aktuálnost. Přesto nenese odpovědnost za škody vzniklé pouze z interpretace veřejného obsahu bez návazné konzultace.',
          'Pro oficiální spolupráci, nabídky nebo právně závazné kroky vždy používej přímý kontakt s projektem.'
        ]
      }
    ]
  },
  cookies: {
    eyebrow: 'Cookies',
    title: 'Zásady cookies',
    description:
      'Web používá jen technicky přiměřené prvky nutné pro fungování rozhraní, přihlášení do administrace a zachování základního uživatelského nastavení.',
    sections: [
      {
        heading: 'Co se ukládá',
        bullets: [
          'volba světlého nebo tmavého režimu v localStorage',
          'autentizační session pro administraci spravovaná Supabase Auth',
          'technické údaje potřebné pro bezpečnost a provoz připojených služeb'
        ]
      },
      {
        heading: 'Na co cookies nepoužíváme',
        bullets: [
          'neprodáváme data třetím stranám',
          'nepoužíváme je pro agresivní reklamní targeting',
          'bez dalšího rozšíření webu nepoužíváme rozsáhlé behaviorální trackování'
        ]
      },
      {
        heading: 'Jak můžeš nastavení ovlivnit',
        paragraphs: [
          'Cookies a lokální data můžeš odstranit v nastavení prohlížeče. Tím se ale můžeš odhlásit z administrace nebo přijít o uložené preference webu.',
          'Pokud později nasadíme analytické nebo marketingové skripty, bude potřeba tuhle sekci rozšířit o podrobnější správu souhlasů.'
        ]
      }
    ]
  }
};

const homepageSectionIds = new Set<HomepageSectionId>(homepageSectionDefinitions.map(({ id }) => id));
const homepageMediaSlotIds = new Set<HomepageMediaSlotId>(homepageMediaSlotDefinitions.map(({ id }) => id));

export const normalizeHomepageLayout = (value: unknown): HomepageSectionSetting[] => {
  const normalized: HomepageSectionSetting[] = [];
  const seen = new Set<HomepageSectionId>();

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (!item || typeof item !== 'object') return;

      const rawId = (item as { id?: unknown }).id;
      if (typeof rawId !== 'string' || !homepageSectionIds.has(rawId as HomepageSectionId)) return;

      const id = rawId as HomepageSectionId;
      if (seen.has(id)) return;

      seen.add(id);
      normalized.push({
        id,
        visible: (item as { visible?: unknown }).visible !== false
      });
    });
  }

  defaultHomepageLayout.forEach((item) => {
    if (!seen.has(item.id)) {
      normalized.push(item);
    }
  });

  return normalized;
};

export const normalizeHomepageMediaSlots = (value: unknown): HomepageMediaSlotSetting[] => {
  const byId = new Map<HomepageMediaSlotId, HomepageMediaSlotSetting>();

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (!item || typeof item !== 'object') return;

      const rawId = (item as { id?: unknown }).id;
      if (typeof rawId !== 'string' || !homepageMediaSlotIds.has(rawId as HomepageMediaSlotId)) return;

      byId.set(rawId as HomepageMediaSlotId, {
        id: rawId as HomepageMediaSlotId,
        src: typeof (item as { src?: unknown }).src === 'string' ? (item as { src: string }).src : '',
        alt: typeof (item as { alt?: unknown }).alt === 'string' ? (item as { alt: string }).alt : '',
        caption:
          typeof (item as { caption?: unknown }).caption === 'string'
            ? (item as { caption: string }).caption
            : ''
      });
    });
  }

  return homepageMediaSlotDefinitions.map(({ id }) => byId.get(id) ?? {
    id,
    src: '',
    alt: '',
    caption: ''
  });
};

const asNonEmptyString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback;

export const normalizeHomepageWidgetContent = (value: unknown): HomepageWidgetContentSettings => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const heroSource =
    source.heroIntro && typeof source.heroIntro === 'object'
      ? (source.heroIntro as Record<string, unknown>)
      : {};
  const topicSource =
    source.topicPages && typeof source.topicPages === 'object'
      ? (source.topicPages as Record<string, unknown>)
      : {};
  const aiSource =
    source.aiAssistant && typeof source.aiAssistant === 'object'
      ? (source.aiAssistant as Record<string, unknown>)
      : {};

  return {
    heroIntro: {
      badge: asNonEmptyString(heroSource.badge, defaultHomepageWidgetContent.heroIntro.badge),
      titleLead: asNonEmptyString(heroSource.titleLead, defaultHomepageWidgetContent.heroIntro.titleLead),
      titleAccent: asNonEmptyString(heroSource.titleAccent, defaultHomepageWidgetContent.heroIntro.titleAccent),
      description: asNonEmptyString(heroSource.description, defaultHomepageWidgetContent.heroIntro.description),
      mottoEyebrow: asNonEmptyString(heroSource.mottoEyebrow, defaultHomepageWidgetContent.heroIntro.mottoEyebrow),
      mottoQuote: asNonEmptyString(heroSource.mottoQuote, defaultHomepageWidgetContent.heroIntro.mottoQuote),
      mottoBody: asNonEmptyString(heroSource.mottoBody, defaultHomepageWidgetContent.heroIntro.mottoBody),
      primaryCtaLabel: asNonEmptyString(
        heroSource.primaryCtaLabel,
        defaultHomepageWidgetContent.heroIntro.primaryCtaLabel
      ),
      secondaryCtaLabel: asNonEmptyString(
        heroSource.secondaryCtaLabel,
        defaultHomepageWidgetContent.heroIntro.secondaryCtaLabel
      ),
      imageQuote: asNonEmptyString(heroSource.imageQuote, defaultHomepageWidgetContent.heroIntro.imageQuote)
    },
    topicPages: {
      eyebrow: asNonEmptyString(topicSource.eyebrow, defaultHomepageWidgetContent.topicPages.eyebrow),
      titleLead: asNonEmptyString(topicSource.titleLead, defaultHomepageWidgetContent.topicPages.titleLead),
      titleAccent: asNonEmptyString(topicSource.titleAccent, defaultHomepageWidgetContent.topicPages.titleAccent)
    },
    aiAssistant: {
      badge: asNonEmptyString(aiSource.badge, defaultHomepageWidgetContent.aiAssistant.badge),
      titleLead: asNonEmptyString(aiSource.titleLead, defaultHomepageWidgetContent.aiAssistant.titleLead),
      titleAccent: asNonEmptyString(aiSource.titleAccent, defaultHomepageWidgetContent.aiAssistant.titleAccent),
      description: asNonEmptyString(aiSource.description, defaultHomepageWidgetContent.aiAssistant.description),
      placeholder: asNonEmptyString(aiSource.placeholder, defaultHomepageWidgetContent.aiAssistant.placeholder),
      submitLabel: asNonEmptyString(aiSource.submitLabel, defaultHomepageWidgetContent.aiAssistant.submitLabel),
      loadingLabel: asNonEmptyString(aiSource.loadingLabel, defaultHomepageWidgetContent.aiAssistant.loadingLabel),
      resultLabel: asNonEmptyString(aiSource.resultLabel, defaultHomepageWidgetContent.aiAssistant.resultLabel)
    }
  };
};

export const normalizePublicContactInfo = (value: unknown): PublicContactInfo => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  return {
    companyName: asNonEmptyString(source.companyName, defaultPublicContactInfo.companyName),
    companyNameUpper: asNonEmptyString(source.companyNameUpper, defaultPublicContactInfo.companyNameUpper),
    addressLine: asNonEmptyString(source.addressLine, defaultPublicContactInfo.addressLine),
    cityLine: asNonEmptyString(source.cityLine, defaultPublicContactInfo.cityLine),
    phone: asNonEmptyString(source.phone, defaultPublicContactInfo.phone),
    email: asNonEmptyString(source.email, defaultPublicContactInfo.email),
    primaryWebsite: asNonEmptyString(source.primaryWebsite, defaultPublicContactInfo.primaryWebsite),
    primaryWebsiteUrl: asNonEmptyString(source.primaryWebsiteUrl, defaultPublicContactInfo.primaryWebsiteUrl),
    secondaryWebsite: asNonEmptyString(source.secondaryWebsite, defaultPublicContactInfo.secondaryWebsite),
    secondaryWebsiteUrl: asNonEmptyString(source.secondaryWebsiteUrl, defaultPublicContactInfo.secondaryWebsiteUrl),
    registrationNote: asNonEmptyString(source.registrationNote, defaultPublicContactInfo.registrationNote),
    companyMeta: asNonEmptyString(source.companyMeta, defaultPublicContactInfo.companyMeta)
  };
};

export const normalizeSiteNavigationSettings = (value: unknown): SiteNavigationSettings => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const rawMenuItems = Array.isArray(source.menuItems) ? source.menuItems : [];
  const rawFooterLinks = Array.isArray(source.footerLinks) ? source.footerLinks : [];
  const rawSocialLinks = Array.isArray(source.socialLinks) ? source.socialLinks : [];

  const menuItems = navigationItemDefinitions.map(({ key, label }) => {
    const entry =
      rawMenuItems.find(
        (item): item is { key: NavigationItemKey; label?: unknown; visible?: unknown } =>
          Boolean(item) && typeof item === 'object' && (item as { key?: unknown }).key === key
      ) ?? null;

    return {
      key,
      label: asNonEmptyString(entry?.label, label),
      visible: entry?.visible !== false
    };
  });

  const footerLinks = (['privacy', 'terms', 'cookies'] as LegalPageKey[]).map((key) => {
    const fallback = defaultSiteNavigationSettings.footerLinks.find((item) => item.key === key)!;
    const entry =
      rawFooterLinks.find(
        (item): item is { key: LegalPageKey; label?: unknown; visible?: unknown } =>
          Boolean(item) && typeof item === 'object' && (item as { key?: unknown }).key === key
      ) ?? null;

    return {
      key,
      label: asNonEmptyString(entry?.label, fallback.label),
      visible: entry?.visible !== false
    };
  });

  const socialLinks = (['instagram', 'facebook', 'globe'] as SocialLinkKey[]).map((key) => {
    const fallback = defaultSiteNavigationSettings.socialLinks.find((item) => item.key === key)!;
    const entry =
      rawSocialLinks.find(
        (item): item is { key: SocialLinkKey; label?: unknown; url?: unknown; visible?: unknown } =>
          Boolean(item) && typeof item === 'object' && (item as { key?: unknown }).key === key
      ) ?? null;

    return {
      key,
      label: asNonEmptyString(entry?.label, fallback.label),
      url: asNonEmptyString(entry?.url, fallback.url),
      visible: entry?.visible !== false
    };
  });

  return {
    menuItems,
    footerLinks,
    socialLinks,
    footerTagline: asNonEmptyString(source.footerTagline, defaultSiteNavigationSettings.footerTagline),
    footerCopyright: asNonEmptyString(source.footerCopyright, defaultSiteNavigationSettings.footerCopyright),
    footerRights: asNonEmptyString(source.footerRights, defaultSiteNavigationSettings.footerRights),
    footerDesignCredit: asNonEmptyString(source.footerDesignCredit, defaultSiteNavigationSettings.footerDesignCredit)
  };
};

export const normalizePageIntroContent = (value: unknown): PageIntroContentSettings => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const normalizedEntries = {} as PageIntroContentSettings;

  pageIntroDefinitions.forEach(({ key }) => {
    const fallback = defaultPageIntroContent[key];
    const entrySource =
      source[key] && typeof source[key] === 'object' ? (source[key] as Record<string, unknown>) : {};

    normalizedEntries[key] = {
      eyebrow: asNonEmptyString(entrySource.eyebrow, fallback.eyebrow),
      titleLead: asNonEmptyString(entrySource.titleLead, fallback.titleLead),
      titleAccent: asNonEmptyString(entrySource.titleAccent, fallback.titleAccent),
      description: asNonEmptyString(entrySource.description, fallback.description)
    };
  });

  return normalizedEntries;
};

const parseGalleryDate = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortGalleryGroups = (groups: GalleryGroupsSettings): GalleryGroupsSettings =>
  [...groups].sort((left, right) => {
    const dateDelta = parseGalleryDate(right.eventDate) - parseGalleryDate(left.eventDate);
    if (dateDelta !== 0) return dateDelta;
    return left.title.localeCompare(right.title, 'cs');
  });

export const normalizeGalleryGroups = (value: unknown): GalleryGroupsSettings => {
  if (!Array.isArray(value)) {
    return defaultGalleryGroups;
  }

  const normalized = value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, index) => {
      const images = Array.isArray(item.images)
        ? item.images
            .filter((image): image is Record<string, unknown> => Boolean(image) && typeof image === 'object')
            .map((image, imageIndex) => ({
              id: asNonEmptyString(image.id, `gallery-image-${index + 1}-${imageIndex + 1}`),
              url: typeof image.url === 'string' ? image.url : '',
              alt: typeof image.alt === 'string' ? image.alt : '',
              caption: typeof image.caption === 'string' ? image.caption : ''
            }))
            .filter((image) => image.url.trim().length > 0)
        : [];

      return {
        id: asNonEmptyString(item.id, `gallery-group-${index + 1}`),
        title: asNonEmptyString(item.title, `Galerie ${index + 1}`),
        eventDate: typeof item.eventDate === 'string' ? item.eventDate : '',
        description: typeof item.description === 'string' ? item.description : '',
        published: item.published === true,
        images
      };
    });

  return sortGalleryGroups(normalized);
};

const normalizeLegalSection = (value: unknown, fallback?: SiteLegalSection): SiteLegalSection => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const paragraphs = Array.isArray(source.paragraphs)
    ? source.paragraphs.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : fallback?.paragraphs ?? [];
  const bullets = Array.isArray(source.bullets)
    ? source.bullets.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : fallback?.bullets ?? [];

  return {
    heading: asNonEmptyString(source.heading, fallback?.heading ?? 'Sekce'),
    paragraphs,
    bullets
  };
};

export const normalizeLegalPageContent = (value: unknown): LegalPageContentSettings => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  const buildPage = (key: LegalPageKey): SiteLegalPageEntry => {
    const fallback = defaultLegalPageContent[key];
    const pageSource = source[key] && typeof source[key] === 'object' ? (source[key] as Record<string, unknown>) : {};
    const rawSections = Array.isArray(pageSource.sections) ? pageSource.sections : fallback.sections;
    const sections = rawSections.map((section, index) => normalizeLegalSection(section, fallback.sections[index]));

    return {
      eyebrow: asNonEmptyString(pageSource.eyebrow, fallback.eyebrow),
      title: asNonEmptyString(pageSource.title, fallback.title),
      description: asNonEmptyString(pageSource.description, fallback.description),
      sections: sections.length > 0 ? sections : fallback.sections
    };
  };

  return {
    privacy: buildPage('privacy'),
    terms: buildPage('terms'),
    cookies: buildPage('cookies')
  };
};
