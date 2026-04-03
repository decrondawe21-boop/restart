export const homepageLayoutSettingKey = 'homepage_layout';
export const homepageMediaSlotsSettingKey = 'homepage_media_slots';

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
