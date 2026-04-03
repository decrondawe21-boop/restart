import {
  FileText,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import MatrixFxHero from '../MatrixFxHero';
import { fetchSiteSettings, saveSiteSetting } from '../../lib/cms';
import {
  defaultLegalPageContent,
  defaultPublicContactInfo,
  globalPublicContactSettingKey,
  legalPageContentSettingKey,
  normalizeLegalPageContent,
  normalizePublicContactInfo,
  type LegalPageContentSettings,
  type LegalPageKey,
  type PublicContactInfo,
  type SiteLegalSection
} from '../../lib/siteSettings';

interface GlobalSettingsPanelProps {
  isDark: boolean;
}

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

const arrayToTextareaValue = (items?: string[]) => (items ?? []).join('\n');
const textareaToArray = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({ isDark }) => {
  const [contact, setContact] = useState<PublicContactInfo>(defaultPublicContactInfo);
  const [legalPages, setLegalPages] = useState<LegalPageContentSettings>(defaultLegalPageContent);
  const [selectedPanel, setSelectedPanel] = useState<'contact' | LegalPageKey>('contact');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const selectedLegalPage = selectedPanel === 'contact' ? null : legalPages[selectedPanel];

  const quickStats = useMemo(
    () => [
      {
        label: 'Kontaktní pole',
        value: 12,
        description: 'Veřejné firemní údaje napojené na footer, kontakty a obsah.',
        accent: 'text-cyan-300',
        bg: 'bg-cyan-500/10'
      },
      {
        label: 'Právní overlaye',
        value: 3,
        description: 'Skleněné modaly Ochrana údajů, Podmínky užití a Cookies.',
        accent: 'text-emerald-300',
        bg: 'bg-emerald-500/10'
      },
      {
        label: 'Editovatelné sekce',
        value: Object.values(legalPages).reduce((sum, page) => sum + page.sections.length, 0),
        description: 'Součet textových bloků připravených pro úpravy.',
        accent: 'text-amber-300',
        bg: 'bg-amber-500/10'
      }
    ],
    [legalPages]
  );

  const syncSettings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const records = await fetchSiteSettings([globalPublicContactSettingKey, legalPageContentSettingKey]);
      const byKey = new Map(records.map((record) => [record.key, record.value_json]));

      setContact(normalizePublicContactInfo(byKey.get(globalPublicContactSettingKey)));
      setLegalPages(normalizeLegalPageContent(byKey.get(legalPageContentSettingKey)));
    } catch (caughtError) {
      setContact(defaultPublicContactInfo);
      setLegalPages(defaultLegalPageContent);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení globálních nastavení selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void syncSettings();
  }, []);

  const updateContact = <T extends keyof PublicContactInfo>(key: T, value: PublicContactInfo[T]) => {
    setContact((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateLegalPage = <T extends keyof LegalPageContentSettings[LegalPageKey]>(
    pageKey: LegalPageKey,
    field: T,
    value: LegalPageContentSettings[LegalPageKey][T]
  ) => {
    setLegalPages((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value
      }
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
          sectionIndex === index
            ? {
                ...section,
                [field]: value
              }
            : section
        )
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setNotice('');
    setError('');

    try {
      await Promise.all([
        saveSiteSetting(globalPublicContactSettingKey, contact),
        saveSiteSetting(legalPageContentSettingKey, legalPages)
      ]);
      setNotice('Globální nastavení bylo uloženo. Footer, kontakt a právní overlaye teď čtou nové hodnoty z databáze.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení globálních nastavení selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setContact(defaultPublicContactInfo);
    setLegalPages(defaultLegalPageContent);
    setSelectedPanel('contact');
    setNotice('Lokálně jsem obnovil výchozí hodnoty. Pro propsání na web je ještě ulož.');
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[2.8rem] border-white/10 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Jak upravit webové nastavení</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ['1. Vyber oblast', 'Klikni na Veřejné kontakty nebo jednu z právních stránek.'],
            ['2. Přepiš obsah', 'Uprav texty, kontakty nebo celé bloky overlaye.'],
            ['3. Ulož nastavení', 'Klikni na Uložit nastavení a změny se propíšou na web.']
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
            darkLogoAlt="Globální nastavení webu"
            lightLogoAlt="Globální nastavení webu"
            revealFrom="bottom"
            label="Globální nastavení"
            description="Spravuj kontaktní údaje, footer a texty právních overlayů. Tohle je další vrstva nad homepage builderem."
            bulge={{ type: 'ripple', duration: 4, intensity: 12, repeat: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
              <h2 className="mt-2 text-2xl font-black text-white">Sekce nastavení</h2>
            </div>
            <button
              type="button"
              onClick={() => void syncSettings()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
              title="Obnovit globální nastavení"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedPanel('contact')}
              className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedPanel === 'contact'
                  ? 'border-cyan-400/30 bg-cyan-500/10'
                  : 'border-white/10 bg-black/20 hover:border-cyan-400/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-cyan-300" />
                <div>
                  <p className="text-sm font-black text-white">Veřejné kontakty</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/35">Firma, adresa, telefon, email a oba weby.</p>
                </div>
              </div>
            </button>

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
                    <p className="mt-1 text-xs leading-relaxed text-white/35">Glassmorph overlay otevřený nad stránkou.</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Krok 2 a 3</p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  {selectedPanel === 'contact' ? 'Kontakty a footer' : legalPageLabels[selectedPanel]}
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-white/40">
                  {selectedPanel === 'contact'
                    ? 'Tahle karta řídí veřejné firemní údaje a to, co se zobrazuje v kontaktech, footeru a dalších veřejných blocích.'
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

            {isLoading ? (
              <div className="flex items-center gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-white/50">
                <Loader2 size={16} className="animate-spin" />
                Načítám globální nastavení…
              </div>
            ) : selectedPanel === 'contact' ? (
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
                  <FieldLabel label="Email" hint="Hlavní veřejný e-mail. Použije se i v právních textech, pokud tam zůstane default." />
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
            ) : (
              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel label="Eyebrow" hint="Malý horní štítek overlaye." />
                    <input value={selectedLegalPage?.eyebrow ?? ''} onChange={(event) => updateLegalPage(selectedPanel, 'eyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel label="Titulek" hint="Hlavní nadpis právní stránky." />
                    <input value={selectedLegalPage?.title ?? ''} onChange={(event) => updateLegalPage(selectedPanel, 'title', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <FieldLabel label="Popis" hint="Úvodní vysvětlení hned pod titulkem." />
                    <textarea value={selectedLegalPage?.description ?? ''} onChange={(event) => updateLegalPage(selectedPanel, 'description', event.target.value)} rows={3} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
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
                          <input value={section.heading} onChange={(event) => updateLegalSection(selectedPanel, index, 'heading', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                        </div>
                        <div className="space-y-2">
                          <FieldLabel label="Odstavce" hint="Jeden odstavec na řádek." />
                          <textarea value={arrayToTextareaValue(section.paragraphs)} onChange={(event) => updateLegalSection(selectedPanel, index, 'paragraphs', textareaToArray(event.target.value))} rows={6} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                        </div>
                        <div className="space-y-2">
                          <FieldLabel label="Bullets" hint="Jeden bullet bod na řádek." />
                          <textarea value={arrayToTextareaValue(section.bullets)} onChange={(event) => updateLegalSection(selectedPanel, index, 'bullets', textareaToArray(event.target.value))} rows={6} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr,0.98fr]">
            <div className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-white/[0.03]">
              {selectedPanel === 'contact' ? (
                <div className="space-y-5 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled footeru</p>
                  <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-xl font-black text-white">{contact.companyName}</p>
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
              ) : (
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
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-[2.6rem] border-white/10 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Stav operace</p>
                <div className="mt-4 space-y-3">
                  {notice && <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">{notice}</div>}
                  {error && <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                  {!notice && !error && (
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                      Veřejné kontakty a právní obsah se ukládají do `site_settings` a veřejný web je načítá se stejným fallback principem jako homepage builder.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">Co je teď hotové</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/45">
                  <li>Editace veřejných kontaktních údajů bez zásahu do kódu.</li>
                  <li>Správa footerových a kontaktních textů z jednoho místa.</li>
                  <li>Plně editovatelné overlay stránky Ochrana údajů, Podmínky užití a Cookies.</li>
                  <li>Náhled aktuálního výstupu přímo v adminu před uložením.</li>
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
