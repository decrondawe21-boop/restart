import { AlertCircle, ChevronDown, HelpCircle, Loader2, RefreshCw, Save } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { fetchSiteSettings, saveSiteSetting } from '../../lib/cms';
import {
  defaultInvestmentReturnContent,
  investmentReturnContentSettingKey,
  normalizeInvestmentReturnContent,
  type InvestmentReturnContentSettings
} from '../../lib/siteSettings';
import AdminInfoTooltip from './AdminInfoTooltip';
import AdminStickyActionBar from './AdminStickyActionBar';

interface InvestmentSettingsPanelProps {
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

const amountPreviewClass = (accent: 'white' | 'cyan') =>
  `amount-glow text-3xl leading-none ${accent === 'cyan' ? 'text-cyan-300' : 'text-white'}`;

type InvestmentEditorSection = 'header' | 'benefits' | 'recidivism' | 'comparison' | 'scenarios';

const AdminAccordionSection: React.FC<{
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, description, isOpen, onToggle, children }) => (
  <div className="glass-panel overflow-hidden rounded-[2.2rem] border-white/10">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03] md:px-6"
      aria-expanded={isOpen}
    >
      <span>
        <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-white/45">{description}</span>
      </span>
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70">
        <ChevronDown size={16} className={`transition ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} />
      </span>
    </button>
    {isOpen && <div className="border-t border-white/10 p-5 md:p-6">{children}</div>}
  </div>
);

const InvestmentSettingsPanel: React.FC<InvestmentSettingsPanelProps> = () => {
  const [content, setContent] = useState<InvestmentReturnContentSettings>(defaultInvestmentReturnContent);
  const [savedContent, setSavedContent] = useState<InvestmentReturnContentSettings>(defaultInvestmentReturnContent);
  const [openSections, setOpenSections] = useState<Record<InvestmentEditorSection, boolean>>({
    header: true,
    benefits: true,
    recidivism: false,
    comparison: false,
    scenarios: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void syncSettings();
  }, []);

  const syncSettings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const records = await fetchSiteSettings([investmentReturnContentSettingKey]);
      const record = records.find((item) => item.key === investmentReturnContentSettingKey);
      const normalizedContent = normalizeInvestmentReturnContent(record?.value_json);
      setContent(normalizedContent);
      setSavedContent(normalizedContent);
    } catch (caughtError) {
      setContent(defaultInvestmentReturnContent);
      setSavedContent(defaultInvestmentReturnContent);
      setError(caughtError instanceof Error ? caughtError.message : 'Načtení investiční sekce selhalo.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent]
  );

  const updateContent = <T extends keyof InvestmentReturnContentSettings>(
    key: T,
    value: InvestmentReturnContentSettings[T]
  ) => {
    setNotice('');
    setError('');
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateBenefit = (
    index: number,
    patch: Partial<InvestmentReturnContentSettings['benefits'][number]>
  ) => {
    setNotice('');
    setError('');
    setContent((prev) => ({
      ...prev,
      benefits: prev.benefits.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    }));
  };

  const updateFigureGroup = (
    key: 'keyFigures' | 'noInterventionFigures' | 'withInterventionFigures',
    index: number,
    patch: Partial<InvestmentReturnContentSettings[typeof key][number]>
  ) => {
    setNotice('');
    setError('');
    setContent((prev) => ({
      ...prev,
      [key]: prev[key].map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    }));
  };

  const updateScenario = (
    index: number,
    patch: Partial<InvestmentReturnContentSettings['scenarios'][number]>
  ) => {
    setNotice('');
    setError('');
    setContent((prev) => ({
      ...prev,
      scenarios: prev.scenarios.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setNotice('');
    setError('');

    try {
      await saveSiteSetting(investmentReturnContentSettingKey, content);
      setSavedContent(content);
      setNotice('Sekce Návratnost a přínos byla uložena. Veřejná stránka teď čte nové hodnoty z databáze.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Uložení investiční sekce selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setContent(defaultInvestmentReturnContent);
    setNotice('Lokálně jsem obnovil výchozí stav sekce. Pro propsání na web je ještě potřeba uložit.');
    setError('');
  };

  const toggleSection = (section: InvestmentEditorSection) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderEditorSection = (
    section: InvestmentEditorSection,
    title: string,
    description: string,
    children: React.ReactNode
  ) => (
    <AdminAccordionSection
      title={title}
      description={description}
      isOpen={openSections[section]}
      onToggle={() => toggleSection(section)}
    >
      {children}
    </AdminAccordionSection>
  );

  const renderFigureGroup = (
    title: string,
    items: InvestmentReturnContentSettings['keyFigures'],
    onChange: (index: number, patch: Partial<InvestmentReturnContentSettings['keyFigures'][number]>) => void
  ) => (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 space-y-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white">{title}</p>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="grid gap-4 md:grid-cols-[1fr,1fr,180px] rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
          <div className="space-y-2">
            <FieldLabel label="Label" hint="Krátký horní popis částky nebo čísla." />
            <input
              value={item.label}
              onChange={(event) => onChange(index, { label: event.target.value })}
              className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Hodnota" hint="Hlavní zobrazené číslo, částka nebo text." />
            <input
              value={item.value}
              onChange={(event) => onChange(index, { value: event.target.value })}
              className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Zvýraznění" hint="Cyan pro klíčovou částku, white pro ostatní hodnoty." />
            <select
              value={item.accent}
              onChange={(event) => onChange(index, { accent: event.target.value as 'white' | 'cyan' })}
              className="w-full rounded-[1.3rem] border border-white/10 bg-[#061012] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30"
            >
              <option value="white">white</option>
              <option value="cyan">cyan</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="glass-panel rounded-[3rem] border-white/10 p-8 text-white/60">
        <div className="flex items-center gap-3">
          <Loader2 size={18} className="animate-spin" />
          Načítám editor investiční sekce…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminStickyActionBar
        title="Investiční záměr"
        status={error ? 'error' : isSaving ? 'saving' : isDirty ? 'dirty' : notice ? 'saved' : 'idle'}
        previewHref="/investicni-zamer/prinos"
        message={error || notice || (isDirty ? 'Sekce má neuložené změny.' : 'Velké částky, klíčová čísla a scénáře návratnosti.')}
        actions={
          <>
            <button
              type="button"
              onClick={syncSettings}
              disabled={isSaving || isLoading}
              className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:opacity-50"
            >
              <RefreshCw size={14} />
              Obnovit
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="inline-flex h-10 items-center gap-2 rounded-[1.2rem] bg-cyan-500 px-4 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-cyan-400 disabled:opacity-55"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Uložit
            </button>
          </>
        }
      />

      <div className="glass-panel rounded-[3rem] border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Investiční záměr</p>
            <h2 className="mt-2 text-3xl font-black text-white">Návratnost a přínos</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <AdminInfoTooltip
              title="Jak funguje ROI editor"
              description="Samostatný editor pro veřejnou stránku Investiční záměr / Přínos. Tady upravíš velké částky, klíčová čísla, scénáře úspor i texty kolem nich bez zásahu do onepage editoru."
              items={[
                'Upravuješ veřejnou stránku Investiční záměr / Přínos.',
                'Velké částky, benefity a scénáře úspor se ukládají samostatně.',
                'Po uložení se změny okamžitě propsají na web.'
              ]}
              label="Nápověda"
            />
            <button
              type="button"
              onClick={syncSettings}
              className="inline-flex items-center gap-2 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              <RefreshCw size={15} />
              Obnovit
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              <RefreshCw size={15} />
              Výchozí stav
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="inline-flex items-center gap-2 rounded-[1.6rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Uložit sekci
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
        <section className="space-y-6">
          {renderEditorSection(
            'header',
            'Header stránky',
            'Eyebrow, hlavní nadpis a úvodní popis veřejné stránky.',
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel label="Eyebrow" hint="Malý horní štítek stránky." />
                <input value={content.headerEyebrow} onChange={(event) => updateContent('headerEyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
              <div className="space-y-2">
                <FieldLabel label="Popis" hint="Úvodní vysvětlení pod hlavním nadpisem." />
                <textarea value={content.headerDescription} onChange={(event) => updateContent('headerDescription', event.target.value)} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
              <div className="space-y-2">
                <FieldLabel label="Title lead" hint="První část velkého nadpisu." />
                <input value={content.headerTitleLead} onChange={(event) => updateContent('headerTitleLead', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
              <div className="space-y-2">
                <FieldLabel label="Title accent" hint="Zvýrazněná část hlavního nadpisu." />
                <input value={content.headerTitleAccent} onChange={(event) => updateContent('headerTitleAccent', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
            </div>
          )}

          {renderEditorSection(
            'benefits',
            'Hlavní karty s dopadem',
            'Tři rychle čitelné karty s částkami, hodnotami a krátkým vysvětlením.',
            <div className="space-y-5">
              {content.benefits.map((benefit, index) => (
                <div key={`benefit-${index}`} className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5 space-y-4">
                  <div className="grid gap-4 md:grid-cols-[0.95fr,1.05fr,180px]">
                    <div className="space-y-2">
                      <FieldLabel label="Titulek" hint="Nadpis karty." />
                      <input value={benefit.title} onChange={(event) => updateBenefit(index, { title: event.target.value })} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel label="Hodnota" hint="Velká částka nebo zvýrazněná hodnota v kartě." />
                      <input value={benefit.value} onChange={(event) => updateBenefit(index, { value: event.target.value })} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel label="Zvýraznění" hint="Cyan pro klíčový údaj, white pro doplňkový." />
                      <select value={benefit.accent} onChange={(event) => updateBenefit(index, { accent: event.target.value as 'white' | 'cyan' })} className="w-full rounded-[1.3rem] border border-white/10 bg-[#061012] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30">
                        <option value="white">white</option>
                        <option value="cyan">cyan</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel label="Popis" hint="Krátké vysvětlení pod velkou hodnotou." />
                    <textarea value={benefit.description} onChange={(event) => updateBenefit(index, { description: event.target.value })} rows={3} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {renderEditorSection(
            'recidivism',
            'Recidiva a klíčová čísla',
            'Texty pro vysvětlení systémového problému a mřížku hlavních metrik.',
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel label="Levá karta eyebrow" hint="Například Cesta k recidivě." />
                  <input value={content.recidivismEyebrow} onChange={(event) => updateContent('recidivismEyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="Levá karta titulek" hint="Hlavní nadpis červeného bloku." />
                  <input value={content.recidivismTitle} onChange={(event) => updateContent('recidivismTitle', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <FieldLabel label="Levá karta popis" hint="Vysvětlení systémové cesty k recidivě." />
                  <textarea value={content.recidivismDescription} onChange={(event) => updateContent('recidivismDescription', event.target.value)} rows={5} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel label="Pravá karta eyebrow" hint="Například Klíčová čísla." />
                  <input value={content.keyFiguresEyebrow} onChange={(event) => updateContent('keyFiguresEyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="Pravá karta titulek" hint="Nadpis bloku s klíčovými čísly." />
                  <input value={content.keyFiguresTitle} onChange={(event) => updateContent('keyFiguresTitle', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <FieldLabel label="Pravá karta popis" hint="Krátké vysvětlení pod mřížkou čísel." />
                  <textarea value={content.keyFiguresDescription} onChange={(event) => updateContent('keyFiguresDescription', event.target.value)} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
              </div>

              {renderFigureGroup('Klíčová čísla', content.keyFigures, (index, patch) => updateFigureGroup('keyFigures', index, patch))}
            </div>
          )}

          {renderEditorSection(
            'comparison',
            'Srovnání scénářů',
            'Dvě karty pro variantu bez intervence a s intervencí včetně částek.',
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 space-y-5">
                <div className="space-y-2">
                  <FieldLabel label="Bez intervence eyebrow" hint="Štítek levé srovnávací karty." />
                  <input value={content.noInterventionEyebrow} onChange={(event) => updateContent('noInterventionEyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="Bez intervence titulek" hint="Hlavní titulek levé karty." />
                  <input value={content.noInterventionTitle} onChange={(event) => updateContent('noInterventionTitle', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="Bez intervence popis" hint="Text pod srovnávacími částkami." />
                  <textarea value={content.noInterventionDescription} onChange={(event) => updateContent('noInterventionDescription', event.target.value)} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                {renderFigureGroup('Bez intervence - částky', content.noInterventionFigures, (index, patch) => updateFigureGroup('noInterventionFigures', index, patch))}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 space-y-5">
                <div className="space-y-2">
                  <FieldLabel label="S intervencí eyebrow" hint="Štítek pravé srovnávací karty." />
                  <input value={content.withInterventionEyebrow} onChange={(event) => updateContent('withInterventionEyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="S intervencí titulek" hint="Hlavní titulek pravé karty." />
                  <input value={content.withInterventionTitle} onChange={(event) => updateContent('withInterventionTitle', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="S intervencí popis" hint="Text pod srovnávacími částkami." />
                  <textarea value={content.withInterventionDescription} onChange={(event) => updateContent('withInterventionDescription', event.target.value)} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                {renderFigureGroup('S intervencí - částky', content.withInterventionFigures, (index, patch) => updateFigureGroup('withInterventionFigures', index, patch))}
              </div>
            </div>
          )}

          {renderEditorSection(
            'scenarios',
            'Modelové scénáře',
            'Kapacita, náklady bez programu, náklady s programem a výsledná úspora.',
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel label="Scénáře eyebrow" hint="Štítek bloku s modelovými scénáři." />
                  <input value={content.scenariosEyebrow} onChange={(event) => updateContent('scenariosEyebrow', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2">
                  <FieldLabel label="Scénáře titulek" hint="Hlavní nadpis bloku úspor podle kapacity." />
                  <input value={content.scenariosTitle} onChange={(event) => updateContent('scenariosTitle', event.target.value)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <FieldLabel label="Scénáře popis" hint="Krátká pomocná věta nad tabulkou scénářů." />
                  <textarea value={content.scenariosDescription} onChange={(event) => updateContent('scenariosDescription', event.target.value)} rows={3} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                </div>
              </div>

              {content.scenarios.map((scenario, index) => (
                <div key={`scenario-${index}`} className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                      <FieldLabel label="Kapacita" hint="Například 25 lidí / rok." />
                      <input value={scenario.participantsLabel} onChange={(event) => updateScenario(index, { participantsLabel: event.target.value })} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel label="Bez programu" hint="Celková roční částka bez intervence." />
                      <input value={scenario.systemCost} onChange={(event) => updateScenario(index, { systemCost: event.target.value })} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel label="S programem" hint="Celková roční částka s aktivním programem." />
                      <input value={scenario.reintegrationCost} onChange={(event) => updateScenario(index, { reintegrationCost: event.target.value })} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel label="Roční úspora" hint="Výsledná zvýrazněná úspora pro daný scénář." />
                      <input value={scenario.savings} onChange={(event) => updateScenario(index, { savings: event.target.value })} className="w-full rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <FieldLabel label="Spodní poznámka" hint="Závěrečný vysvětlující odstavec pod monetizační sekcí." />
                <textarea value={content.historicalNote} onChange={(event) => updateContent('historicalNote', event.target.value)} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-cyan-400/30" />
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-[3rem] border-white/10 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Náhled sekce</p>
            <div className="mt-5 space-y-5">
              <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
                <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-cyan-400">
                  {content.headerEyebrow}
                </div>
                <h3 className="mt-4 text-4xl font-black uppercase leading-none text-white">
                  {content.headerTitleLead} <span className="headline-thin text-cyan-300">{content.headerTitleAccent}</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/45">{content.headerDescription}</p>
              </div>

              {content.benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-black text-white">{benefit.title}</p>
                  <p className={`mt-4 ${amountPreviewClass(benefit.accent)}`}>{benefit.value}</p>
                  <p className="mt-4 text-sm leading-relaxed text-white/45">{benefit.description}</p>
                </div>
              ))}

              <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5 space-y-4">
                <p className="text-sm font-black text-white">{content.keyFiguresTitle}</p>
                <div className="grid gap-3">
                  {content.keyFigures.map((item) => (
                    <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{item.label}</p>
                      <p className={`mt-3 ${amountPreviewClass(item.accent)}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5 space-y-4">
                <p className="text-sm font-black text-white">{content.scenariosTitle}</p>
                <div className="grid gap-3">
                  {content.scenarios.map((scenario) => (
                    <div key={scenario.participantsLabel} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">{scenario.participantsLabel}</p>
                      <p className={`mt-3 ${amountPreviewClass('cyan')}`}>{scenario.savings}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {(notice || error) && (
            <div className="glass-panel rounded-[2.6rem] border-white/10 p-6">
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
        </aside>
      </div>
    </div>
  );
};

export default InvestmentSettingsPanel;
