import { publicContact, type PublicContactInfo } from './publicContact';
export type { PublicContactInfo } from './publicContact';

export const homepageLayoutSettingKey = 'homepage_layout';
export const homepageMediaSlotsSettingKey = 'homepage_media_slots';
export const homepageWidgetContentSettingKey = 'homepage_widget_content';
export const globalPublicContactSettingKey = 'global_public_contact';
export const legalPageContentSettingKey = 'legal_page_content';
export const globalNavigationSettingKey = 'global_navigation';
export const pageIntroContentSettingKey = 'page_intro_content';
export const investmentIntroContextSettingKey = 'investment_intro_context';
export const investmentReturnContentSettingKey = 'investment_return_content';
export const galleryGroupsSettingKey = 'gallery_groups';
export const downloadLibrarySettingKey = 'download_library';
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
  | 'donate'
  | 'contacts';
export type NavigationItemKey =
  | 'home'
  | 'donate'
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

export interface InvestmentIntroPersonEntry {
  id: string;
  name: string;
  detail: string;
}

export interface InvestmentIntroContextSettings {
  eyebrow: string;
  description: string;
  people: InvestmentIntroPersonEntry[];
}

export interface InvestmentReturnBenefitEntry {
  title: string;
  value: string;
  description: string;
  accent: 'white' | 'cyan';
}

export interface InvestmentReturnFigureEntry {
  label: string;
  value: string;
  accent: 'white' | 'cyan';
}

export interface InvestmentReturnScenarioEntry {
  participantsLabel: string;
  systemCost: string;
  reintegrationCost: string;
  savings: string;
}

export interface InvestmentReturnContentSettings {
  headerEyebrow: string;
  headerTitleLead: string;
  headerTitleAccent: string;
  headerDescription: string;
  benefits: InvestmentReturnBenefitEntry[];
  recidivismEyebrow: string;
  recidivismTitle: string;
  recidivismDescription: string;
  keyFiguresEyebrow: string;
  keyFiguresTitle: string;
  keyFiguresDescription: string;
  keyFigures: InvestmentReturnFigureEntry[];
  noInterventionEyebrow: string;
  noInterventionTitle: string;
  noInterventionDescription: string;
  noInterventionFigures: InvestmentReturnFigureEntry[];
  withInterventionEyebrow: string;
  withInterventionTitle: string;
  withInterventionDescription: string;
  withInterventionFigures: InvestmentReturnFigureEntry[];
  scenariosEyebrow: string;
  scenariosTitle: string;
  scenariosDescription: string;
  scenarios: InvestmentReturnScenarioEntry[];
  historicalNote: string;
}

export interface GalleryImageItem {
  id: string;
  url: string;
  alt: string;
  caption: string;
  fit: 'contain' | 'cover';
  zoom: number;
  focusX: number;
  focusY: number;
  filter: 'none' | 'mono' | 'warm' | 'cool' | 'dramatic' | 'soft';
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

export type DownloadFileCategory = 'documents' | 'programs';

export interface DownloadFileEntry {
  id: string;
  title: string;
  description: string;
  category: DownloadFileCategory;
  fileType: string;
  url: string;
  path?: string;
  sizeBytes?: number;
  uploadedAt?: string;
  visible: boolean;
}

export type DownloadLibrarySettings = DownloadFileEntry[];

export const navigationItemDefinitions: NavigationItemDefinition[] = [
  { key: 'home', label: 'Domů', description: 'Úvodní vstup na homepage.', group: 'Hlavní menu', depth: 0 },
  { key: 'donate', label: 'DONATE - podpořte nás!', description: 'Darovací stránka s výzvami a Stripe odkazem.', group: 'Hlavní menu', depth: 0 },
  { key: 'about-root', label: 'O nás', description: 'Základní rozcestník identitní a obsahové vrstvy.', group: 'Hlavní menu', depth: 0 },
  { key: 'about-stories', label: 'Příběhy', description: 'Skutečné příběhy a restarty.', group: 'O nás', depth: 1 },
  { key: 'about-news', label: 'Novinky a aktuality', description: 'Krátké novinky a veřejná oznámení.', group: 'O nás', depth: 1 },
  { key: 'about-blog', label: 'Blog / Archiv', description: 'Komentáře, analýzy a archivnější texty.', group: 'O nás', depth: 1 },
  { key: 'about-contacts', label: 'Kontakty', description: 'Rychlý kontaktní vstup z menu.', group: 'O nás', depth: 1 },
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
  { key: 'donate', label: 'Donate', description: 'Header darovací stránky a výzvy k podpoře.' },
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
      'REST||ART Integrace propojuje postpenitenciární podporu, práci, bydlení, mentoring a dlouhodobou stabilizaci. Druhá šance tu není fráze, ale konkrétní plán návratu do života.',
    mottoEyebrow: 'Motto projektu',
    mottoQuote: '"Každý příběh má právo pokračovat."',
    mottoBody:
      'Druhá šance není slogan do kampaně. Je to pracovní metoda, která vrací člověka zpět do vztahů, práce a důvěry.',
    primaryCtaLabel: 'PŘEJÍT NA PILÍŘE',
    secondaryCtaLabel: 'O PROJEKTU',
    imageQuote: '"Každý příběh má právo pokračovat."'
  },
  topicPages: {
    eyebrow: 'Mapa projektu',
    titleLead: 'Všechny vstupy',
    titleAccent: 'na jednom místě'
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
  footerDesignCredit: 'David Kozák International'
};

export const defaultGalleryGroups: GalleryGroupsSettings = [];

export const defaultDownloadLibrary: DownloadLibrarySettings = [
  {
    id: 'rest-art-fotodokumentace-2026',
    title: 'REST||ART fotodokumentace 2026',
    description: 'Veřejný fotografický podklad pro prezentaci projektu, komunikaci s partnery a grantové výstupy.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_FOTODOKUMENTACE_2026_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-fundraising-deck-2026',
    title: 'REST||ART fundraising deck 2026',
    description: 'Prezentační deck pro jednání s dárci, partnery a institucemi.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_FUNDRAISING_DECK_2026_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-grant-fundraising-balicek-2026',
    title: 'Grantový a fundraisingový balíček 2026',
    description: 'Souhrnný balíček pro granty, fundraising a partnerskou komunikaci REST||ART.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_GRANT_FUNDRAISING_BALICEK_2026_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-impact-summary-template-2026',
    title: 'Impact summary template 2026',
    description: 'Šablona stručného dopadového souhrnu pro veřejné a partnerské reporty.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_IMPACT_SUMMARY_2026_TEMPLATE_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-kpi-evaluace-framework',
    title: 'KPI a evaluace framework',
    description: 'Rámec pro sledování metrik, výsledků a vyhodnocení programu.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_KPI_EVALUACE_FRAMEWORK_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-one-page-projekt-2026',
    title: 'One-page projekt 2026',
    description: 'Jednostránkový veřejný souhrn projektu REST||ART INTEGRACE.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_ONE_PAGE_PROJEKT_2026_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-pribehy-klientu-template',
    title: 'Příběhy klientů - template',
    description: 'Šablona pro bezpečné a konzistentní zpracování klientských příběhů.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_PRIBEHY_KLIENTU_TEMPLATE_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-zakladni-rozpocet-2026',
    title: 'Základní rozpočet 2026',
    description: 'Základní rozpočtový podklad projektu pro plánování a jednání.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_ZAKLADNI_ROZPOCET_2026_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-canva-master-system',
    title: 'Canva master system',
    description: 'Brandový a produkční systém pro tvorbu vizuálních materiálů REST||ART.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_CANVA_MASTER_SYSTEM_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-evaluacni-system',
    title: 'Evaluační systém',
    description: 'Struktura vyhodnocování programu, dopadu a navazujících kroků.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_EVALUACNI_SYSTEM_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-exit-form',
    title: 'Exit form',
    description: 'Výstupní formulář pro uzavření programu a závěrečné zhodnocení.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_EXIT_FORM_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-follow-up-tracking-karta',
    title: 'Follow-up tracking karta',
    description: 'Karta pro sledování navazující podpory, kontaktů a stabilizačních kroků.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_FOLLOW_UP_TRACKING_KARTA_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-gdpr-balicek',
    title: 'GDPR balíček',
    description: 'Sada podkladů pro práci se souhlasy, citlivými údaji a dokumentací klientů.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_GDPR_BALICEK_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-intake-form',
    title: 'Intake form',
    description: 'Vstupní formulář pro první kontakt, mapování situace a zařazení do programu.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_INTAKE_FORM_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-interni-metodika',
    title: 'Interní metodika',
    description: 'Metodický rámec pro týmovou práci, klientský proces a vedení programu.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_INTERNI_METODIKA_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-kniha-klienta',
    title: 'Kniha klienta',
    description: 'Klientský průvodce procesem, úkoly, stabilizací a navazující podporou.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_KNIHA_KLIENTA_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-krizovy-formular',
    title: 'Krizový formulář',
    description: 'Formulář pro zachycení krizové situace, rizik a okamžitých opatření.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_KRIZOVY_FORMULAR_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-obecny-dotaznik',
    title: 'Obecný dotazník pro všechny programy',
    description: 'Společný dotazník pro vstupní orientaci napříč programy REST||ART.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_OBECNY_DOTAZNIK_VSECHNY_PROGRAMY_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-peer-mentoring-karta',
    title: 'Peer mentoring karta',
    description: 'Podklad pro práci peer mentora a průběžné zachycení podpory klienta.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_PEER_MENTORING_KARTA_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-popis-projektu-2026-msp',
    title: 'Popis projektu 2026 - MSp návrh',
    description: 'Projektový popis určený pro institucionální a grantový kontext.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_POPIS_PROJEKTU_2026_MSp_NAVRH.pdf',
    visible: true
  },
  {
    id: 'rest-art-reportovaci-formulare',
    title: 'Reportovací formuláře',
    description: 'Sada formulářů pro pravidelné reportování, týmové vyhodnocení a kontrolu kroků.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_REPORTOVACI_FORMULARE_v1_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-scoring-system-v1',
    title: 'Scoring system v1',
    description: 'První verze scoringového rámce pro vyhodnocení potřeb a rizik.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_SCORING_SYSTEM_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-scoring-system-v2',
    title: 'Scoring system v2',
    description: 'Aktualizovaná verze scoringového rámce pro klientskou práci.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_SCORING_SYSTEM_v2_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-stabilizacni-index-master-v4',
    title: 'Stabilizační index master v4',
    description: 'Hlavní stabilizační index pro sledování posunu klienta a intervenčních kroků.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_STABILIZACNI_INDEX_MASTER_v4_OPRAVENO_PROOF.pdf',
    visible: true
  },
  {
    id: 'rest-art-stabilizacni-index-master-v3',
    title: 'Stabilizační index master v3',
    description: 'Čistá flattened verze stabilizačního indexu pro archiv a srovnání verzí.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_STABILIZACNI_INDEX_MASTER_v3_CLEAN_FLATTENED.pdf',
    visible: true
  },
  {
    id: 'restart-mereni-vysledku-programu',
    title: 'Měření výsledků programu',
    description: 'Podklad pro měření výsledků, cílů a dopadu programu REST||ART.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/RESTART_mereni_vysledku_programu.pdf',
    visible: true
  },
  {
    id: 'rest-art-stanovy-or-podklady',
    title: 'Stanovy a OR podklady',
    description: 'Organizační a rejstříkové podklady pro projektový a právní rámec.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_STANOVY_OR_PODKLADY_v1.pdf',
    visible: true
  },
  {
    id: 'rest-art-strucny-impact-report-template',
    title: 'Stručný impact report - template',
    description: 'Šablona stručného impact reportu pro veřejné výstupy a partnery.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_STRUCNY_IMPACT_REPORT_v1_TEMPLATE.pdf',
    visible: true
  },
  {
    id: 'rest-art-top-skills-workflow',
    title: 'Top skills workflow',
    description: 'Workflow kompetencí a praktických kroků pro klientskou i týmovou práci.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/REST_ART_TOP_SKILLS_WORKFLOW.pdf',
    visible: true
  },
  {
    id: 'restart-budget-template-2026',
    title: 'Budget template 2026',
    description: 'Rozpočtová šablona pro plánování projektových nákladů a grantů.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/RESTART_budget_template_2026.pdf',
    visible: true
  },
  {
    id: 'restart-grantova-strategie-2026',
    title: 'Grantová strategie 2026',
    description: 'Strategický přehled grantových směrů, priorit a návazných kroků.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/RESTART_grantova_strategie_2026.pdf',
    visible: true
  },
  {
    id: 'restart-grantovy-prehlad-2026-cz',
    title: 'Grantový přehled 2026 CZ',
    description: 'Český přehled grantových příležitostí a plánovacích bodů pro rok 2026.',
    category: 'documents',
    fileType: 'PDF',
    url: '/downloads/rest-art/RESTART_grantovy_prehlad_2026_CZ.pdf',
    visible: true
  },
  {
    id: 'restart-kniha-klientu-metriky',
    title: 'Kniha klientů - metriky',
    description: 'Metrický podklad ke knize klientů a vyhodnocování stabilizačního procesu.',
    category: 'programs',
    fileType: 'PDF',
    url: '/downloads/rest-art/RESTART_kniha_klientu_METRIKY.pdf',
    visible: true
  }
];

export const defaultInvestmentIntroContext: InvestmentIntroContextSettings = {
  eyebrow: 'Osobní kontext a reálný základ',
  description:
    'Projekt vznikl díky osobní zkušenosti zakladatele a na základě skutečných příběhů lidí, kteří prošli výkonem trestu a skrze práci mimo ČR našli novou cestu.',
  people: [
    {
      id: 'invest-person-erik-horvath',
      name: 'Erik Horváth',
      detail: 'bývalý vězeň, dnes elektrikář, abstinence a návrat k rodině'
    },
    {
      id: 'invest-person-mio-presic',
      name: 'Mio Prešíč',
      detail: 'po dvouleté práci v Německu spoluvlastník sítě automyček'
    },
    {
      id: 'invest-person-petr-hojda',
      name: 'Petr Hojda',
      detail: 'pracuje jako pomocný dělník'
    },
    {
      id: 'invest-person-jaroslav-majer',
      name: 'Jaroslav Majer',
      detail: 'aktuálně ve věznici Bělušice, podaná žádost o podmíněné propuštění'
    },
    {
      id: 'invest-person-jiri-kaleja',
      name: 'Kaleja Jiří',
      detail: 'aktuálně ve věznici Bělušice, podaná žádost o podmíněné propuštění'
    },
    {
      id: 'invest-person-miroslav-reindl',
      name: 'Miroslav Reindl',
      detail: 'boj o návrat nezletilého syna z pěstounské péče k otci, stabilní práce i zázemí'
    }
  ]
};

export const defaultInvestmentReturnContent: InvestmentReturnContentSettings = {
  headerEyebrow: 'IV. Návratnost a přínos',
  headerTitleLead: 'Důvod',
  headerTitleAccent: 'investovat',
  headerDescription:
    'Projekt je nastaven jako kombinace sociálního dopadu, ekonomické efektivity a dlouhodobé stabilizace komunit.',
  benefits: [
    {
      title: 'Roční úspora na 1 účastníka',
      value: '550 000 Kč',
      description: 'Konzervativní model počítá s rozdílem 600 000 Kč v selhávajícím systému oproti 50 000 Kč v programu REST||ART.',
      accent: 'cyan'
    },
    {
      title: 'Návratnost investice',
      value: '26 lidí',
      description: 'Samotná infrastrukturní investice 14,2 mil. Kč se podle tohoto modelu vrací při stabilizaci 26 lidí v ročním horizontu.',
      accent: 'white'
    },
    {
      title: 'Pokles recidivy',
      value: '-53 p. b.',
      description: 'Cílem je posun z 70 % na 17 % při propojení programů JAILBREAK, REWORK, STREETWISE a návazné stabilizace.',
      accent: 'white'
    }
  ],
  recidivismEyebrow: 'Cesta k recidivě',
  recidivismTitle: 'Kde to začíná',
  recidivismDescription:
    'Mladý člověk bez zázemí, propuštěný vězeň bez práce nebo člověk po léčbě bez návazné podpory se často vrací do stejného prostředí, které ho do krize dostalo. Bez jednoho cíle, jednoho plánu a návazné práce systém jen čeká na další selhání.',
  keyFiguresEyebrow: 'Klíčová čísla',
  keyFiguresTitle: 'Ekonomika vs. reintegrace',
  keyFiguresDescription:
    'Smysl investice není jen úspora. Každý stabilizovaný člověk znamená menší tlak na věznice, sociální systém, obce, rodiny i zaměstnavatele.',
  keyFigures: [
    { label: 'Systém / osoba / rok', value: '600 000 Kč', accent: 'white' },
    { label: 'Reintegrace / osoba / rok', value: '50 000 Kč', accent: 'white' },
    { label: 'Úspora / osoba / rok', value: '550 000 Kč', accent: 'cyan' }
  ],
  noInterventionEyebrow: 'Bez intervence',
  noInterventionTitle: 'Selhávající systém',
  noInterventionDescription:
    'Náklad vzniká bez stabilizačního efektu a bez skutečného návratu člověka do práce, bydlení a odpovědnosti.',
  noInterventionFigures: [
    { label: 'Model / osoba / rok', value: '600 000 Kč', accent: 'white' },
    { label: 'Historický údaj 2022', value: '647 145 Kč', accent: 'white' }
  ],
  withInterventionEyebrow: 'S intervencí REST||ART',
  withInterventionTitle: 'Plán úspor a návratnosti',
  withInterventionDescription:
    'Každý člověk, který se nevrátí do recidivy a místo toho pracuje, generuje úsporu a zároveň obnovuje bezpečnost i důvěru v komunitě.',
  withInterventionFigures: [
    { label: 'Reintegrace / osoba / rok', value: '50 000 Kč', accent: 'white' },
    { label: 'Úspora / osoba / rok', value: '550 000 Kč', accent: 'cyan' }
  ],
  scenariosEyebrow: 'Modelové scénáře',
  scenariosTitle: 'Plán úspor podle kapacity',
  scenariosDescription:
    'Výpočty níže pracují s konzervativní roční úsporou 550 000 Kč na jednoho stabilizovaného účastníka.',
  scenarios: [
    { participantsLabel: '10 lidí / rok', systemCost: '6 000 000 Kč', reintegrationCost: '500 000 Kč', savings: '5 500 000 Kč' },
    { participantsLabel: '25 lidí / rok', systemCost: '15 000 000 Kč', reintegrationCost: '1 250 000 Kč', savings: '13 750 000 Kč' },
    { participantsLabel: '50 lidí / rok', systemCost: '30 000 000 Kč', reintegrationCost: '2 500 000 Kč', savings: '27 500 000 Kč' },
    { participantsLabel: '100 lidí / rok', systemCost: '60 000 000 Kč', reintegrationCost: '5 000 000 Kč', savings: '55 000 000 Kč' }
  ],
  historicalNote:
    'Historický údaj vězeňství ukazuje rozdíl až 597 145 Kč na osobu a rok. Investiční záměr ale drží opatrnější plánovací model, aby byl dopad projektu obhajitelný i bez nadsazených předpokladů.'
};

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
  donate: {
    eyebrow: 'DONATE',
    titleLead: 'Podpořte',
    titleAccent: 'nás',
    description:
      'Každý dar pomáhá měnit druhou šanci v konkrétní kroky: mentoring, práci, stabilizaci, materiály a návrat lidí zpět do života.'
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
  const normalizedPhone = asNonEmptyString(source.phone, defaultPublicContactInfo.phone);
  const normalizedEmail = asNonEmptyString(source.email, defaultPublicContactInfo.email);
  const compactPhone = normalizedPhone.replace(/\s+/g, '');
  const phone =
    ['+420705224435', '+420775189574'].includes(compactPhone)
      ? defaultPublicContactInfo.phone
      : normalizedPhone;
  const email =
    ['kozak@d-international.eu', 'info@david-kozak.com'].includes(normalizedEmail.trim().toLowerCase())
      ? defaultPublicContactInfo.email
      : normalizedEmail;

  return {
    companyName: asNonEmptyString(source.companyName, defaultPublicContactInfo.companyName),
    companyNameUpper: asNonEmptyString(source.companyNameUpper, defaultPublicContactInfo.companyNameUpper),
    addressLine: asNonEmptyString(source.addressLine, defaultPublicContactInfo.addressLine),
    cityLine: asNonEmptyString(source.cityLine, defaultPublicContactInfo.cityLine),
    phone,
    email,
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

    const normalizedLabel = asNonEmptyString(entry?.label, label);
    const displayLabel =
      key === 'about-contacts' &&
      ['kontakty (mini okno)', 'kontakty (miniokno)', 'rychlý kontakt'].includes(normalizedLabel.trim().toLowerCase())
        ? label
        : normalizedLabel;

    return {
      key,
      label: displayLabel,
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

export const normalizeInvestmentIntroContext = (value: unknown): InvestmentIntroContextSettings => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const rawPeople = Array.isArray(source.people) ? source.people : defaultInvestmentIntroContext.people;

  const people = rawPeople
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, index) => ({
      id: asNonEmptyString(item.id, `investment-intro-person-${index + 1}`),
      name: asNonEmptyString(item.name, `Příběh ${index + 1}`),
      detail: asNonEmptyString(item.detail, '')
    }))
    .filter((item) => item.name.trim().length > 0 || item.detail.trim().length > 0);

  return {
    eyebrow: asNonEmptyString(source.eyebrow, defaultInvestmentIntroContext.eyebrow),
    description: asNonEmptyString(source.description, defaultInvestmentIntroContext.description),
    people: people.length > 0 ? people : defaultInvestmentIntroContext.people
  };
};

export const normalizeInvestmentReturnContent = (value: unknown): InvestmentReturnContentSettings => {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const asBenefitArray = Array.isArray(source.benefits) ? source.benefits : defaultInvestmentReturnContent.benefits;
  const asKeyFigures = Array.isArray(source.keyFigures) ? source.keyFigures : defaultInvestmentReturnContent.keyFigures;
  const asNoInterventionFigures = Array.isArray(source.noInterventionFigures)
    ? source.noInterventionFigures
    : defaultInvestmentReturnContent.noInterventionFigures;
  const asWithInterventionFigures = Array.isArray(source.withInterventionFigures)
    ? source.withInterventionFigures
    : defaultInvestmentReturnContent.withInterventionFigures;
  const asScenarios = Array.isArray(source.scenarios) ? source.scenarios : defaultInvestmentReturnContent.scenarios;

  return {
    headerEyebrow: asNonEmptyString(source.headerEyebrow, defaultInvestmentReturnContent.headerEyebrow),
    headerTitleLead: asNonEmptyString(source.headerTitleLead, defaultInvestmentReturnContent.headerTitleLead),
    headerTitleAccent: asNonEmptyString(source.headerTitleAccent, defaultInvestmentReturnContent.headerTitleAccent),
    headerDescription: asNonEmptyString(source.headerDescription, defaultInvestmentReturnContent.headerDescription),
    benefits: defaultInvestmentReturnContent.benefits.map((fallback, index) => {
      const entry = asBenefitArray[index] && typeof asBenefitArray[index] === 'object'
        ? (asBenefitArray[index] as Record<string, unknown>)
        : {};
      return {
        title: asNonEmptyString(entry.title, fallback.title),
        value: asNonEmptyString(entry.value, fallback.value),
        description: asNonEmptyString(entry.description, fallback.description),
        accent: entry.accent === 'white' || entry.accent === 'cyan' ? entry.accent : fallback.accent
      };
    }),
    recidivismEyebrow: asNonEmptyString(source.recidivismEyebrow, defaultInvestmentReturnContent.recidivismEyebrow),
    recidivismTitle: asNonEmptyString(source.recidivismTitle, defaultInvestmentReturnContent.recidivismTitle),
    recidivismDescription: asNonEmptyString(source.recidivismDescription, defaultInvestmentReturnContent.recidivismDescription),
    keyFiguresEyebrow: asNonEmptyString(source.keyFiguresEyebrow, defaultInvestmentReturnContent.keyFiguresEyebrow),
    keyFiguresTitle: asNonEmptyString(source.keyFiguresTitle, defaultInvestmentReturnContent.keyFiguresTitle),
    keyFiguresDescription: asNonEmptyString(source.keyFiguresDescription, defaultInvestmentReturnContent.keyFiguresDescription),
    keyFigures: defaultInvestmentReturnContent.keyFigures.map((fallback, index) => {
      const entry = asKeyFigures[index] && typeof asKeyFigures[index] === 'object'
        ? (asKeyFigures[index] as Record<string, unknown>)
        : {};
      return {
        label: asNonEmptyString(entry.label, fallback.label),
        value: asNonEmptyString(entry.value, fallback.value),
        accent: entry.accent === 'white' || entry.accent === 'cyan' ? entry.accent : fallback.accent
      };
    }),
    noInterventionEyebrow: asNonEmptyString(source.noInterventionEyebrow, defaultInvestmentReturnContent.noInterventionEyebrow),
    noInterventionTitle: asNonEmptyString(source.noInterventionTitle, defaultInvestmentReturnContent.noInterventionTitle),
    noInterventionDescription: asNonEmptyString(source.noInterventionDescription, defaultInvestmentReturnContent.noInterventionDescription),
    noInterventionFigures: defaultInvestmentReturnContent.noInterventionFigures.map((fallback, index) => {
      const entry = asNoInterventionFigures[index] && typeof asNoInterventionFigures[index] === 'object'
        ? (asNoInterventionFigures[index] as Record<string, unknown>)
        : {};
      return {
        label: asNonEmptyString(entry.label, fallback.label),
        value: asNonEmptyString(entry.value, fallback.value),
        accent: entry.accent === 'white' || entry.accent === 'cyan' ? entry.accent : fallback.accent
      };
    }),
    withInterventionEyebrow: asNonEmptyString(source.withInterventionEyebrow, defaultInvestmentReturnContent.withInterventionEyebrow),
    withInterventionTitle: asNonEmptyString(source.withInterventionTitle, defaultInvestmentReturnContent.withInterventionTitle),
    withInterventionDescription: asNonEmptyString(source.withInterventionDescription, defaultInvestmentReturnContent.withInterventionDescription),
    withInterventionFigures: defaultInvestmentReturnContent.withInterventionFigures.map((fallback, index) => {
      const entry = asWithInterventionFigures[index] && typeof asWithInterventionFigures[index] === 'object'
        ? (asWithInterventionFigures[index] as Record<string, unknown>)
        : {};
      return {
        label: asNonEmptyString(entry.label, fallback.label),
        value: asNonEmptyString(entry.value, fallback.value),
        accent: entry.accent === 'white' || entry.accent === 'cyan' ? entry.accent : fallback.accent
      };
    }),
    scenariosEyebrow: asNonEmptyString(source.scenariosEyebrow, defaultInvestmentReturnContent.scenariosEyebrow),
    scenariosTitle: asNonEmptyString(source.scenariosTitle, defaultInvestmentReturnContent.scenariosTitle),
    scenariosDescription: asNonEmptyString(source.scenariosDescription, defaultInvestmentReturnContent.scenariosDescription),
    scenarios: defaultInvestmentReturnContent.scenarios.map((fallback, index) => {
      const entry = asScenarios[index] && typeof asScenarios[index] === 'object'
        ? (asScenarios[index] as Record<string, unknown>)
        : {};
      return {
        participantsLabel: asNonEmptyString(entry.participantsLabel, fallback.participantsLabel),
        systemCost: asNonEmptyString(entry.systemCost, fallback.systemCost),
        reintegrationCost: asNonEmptyString(entry.reintegrationCost, fallback.reintegrationCost),
        savings: asNonEmptyString(entry.savings, fallback.savings)
      };
    }),
    historicalNote: asNonEmptyString(source.historicalNote, defaultInvestmentReturnContent.historicalNote)
  };
};

export const normalizeDownloadLibrary = (value: unknown): DownloadLibrarySettings => {
  if (!Array.isArray(value)) {
    return defaultDownloadLibrary;
  }

  const normalized = value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, index) => {
      const category: DownloadFileCategory = item.category === 'programs' ? 'programs' : 'documents';
      const url = typeof item.url === 'string' ? item.url.trim() : '';

      return {
        id: asNonEmptyString(item.id, `download-file-${index + 1}`),
        title: asNonEmptyString(item.title, `Soubor ${index + 1}`),
        description: asNonEmptyString(item.description, 'Veřejný soubor ke stažení.'),
        category,
        fileType: asNonEmptyString(item.fileType, 'Soubor').toUpperCase(),
        url,
        path: typeof item.path === 'string' && item.path.trim().length > 0 ? item.path : undefined,
        sizeBytes:
          typeof item.sizeBytes === 'number' && Number.isFinite(item.sizeBytes) && item.sizeBytes > 0
            ? item.sizeBytes
            : undefined,
        uploadedAt:
          typeof item.uploadedAt === 'string' && item.uploadedAt.trim().length > 0
            ? item.uploadedAt
            : undefined,
        visible: item.visible !== false
      };
    })
    .filter((item) => item.url.length > 0);

  return normalized.length > 0 ? normalized : defaultDownloadLibrary;
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

  const normalizeGalleryImageFit = (rawValue: unknown): GalleryImageItem['fit'] =>
    rawValue === 'cover' ? 'cover' : 'contain';

  const normalizeGalleryImageFilter = (rawValue: unknown): GalleryImageItem['filter'] => {
    switch (rawValue) {
      case 'mono':
      case 'warm':
      case 'cool':
      case 'dramatic':
      case 'soft':
        return rawValue;
      default:
        return 'none';
    }
  };

  const normalizeGalleryRange = (rawValue: unknown, fallback: number, min: number, max: number) => {
    const numeric = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(max, Math.max(min, numeric));
  };

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
              caption: typeof image.caption === 'string' ? image.caption : '',
              fit: normalizeGalleryImageFit(image.fit),
              zoom: normalizeGalleryRange(image.zoom, 1, 1, 2.5),
              focusX: normalizeGalleryRange(image.focusX, 50, 0, 100),
              focusY: normalizeGalleryRange(image.focusY, 50, 0, 100),
              filter: normalizeGalleryImageFilter(image.filter)
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
