export const homepageLayoutSettingKey = 'homepage_layout';
export const homepageMediaSlotsSettingKey = 'homepage_media_slots';
export const homepageWidgetContentSettingKey = 'homepage_widget_content';

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
