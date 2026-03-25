# REST||ART — Dark/Light Mode + 7 stránek

## Systém témat

**CSS proměnné** — jeden `class="lm"` na root divu přepíná celý web.
**Toggle button** — ☀️ / 🌙 v navbaru i v slide-out menu.
**Light mode paleta:** `#f0fdf9` bg · `#0e7490` akcent · bílé glass panely.

---

```jsx
import React, { useState, useEffect } from 'react';
import {
  Menu, X, Heart, Briefcase, DoorOpen, Home as HomeIcon, ShieldCheck,
  Instagram, Facebook, Globe, Users, Quote, Sparkles, Send, Volume2,
  Phone, Mail, ExternalLink, Rocket, Paintbrush, Monitor, Key, Landmark,
  FileText, Film, Smartphone, Star, Calendar, Award, TrendingUp, Clock,
  Eye, Newspaper, Target, ArrowRight, MapPin, Sun, Moon
} from 'lucide-react';

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

const apiKey = "";

const NAV_ITEMS = [
  { id: 'home',     label: 'Domů',     num: '01' },
  { id: 'about',    label: 'O nás',    num: '02' },
  { id: 'pillars',  label: 'Pilíře',   num: '03' },
  { id: 'stories',  label: 'Příběhy',  num: '04' },
  { id: 'news',     label: 'Novinky',  num: '05' },
  { id: 'projects', label: 'Projekty', num: '06' },
  { id: 'contacts', label: 'Kontakt',  num: '07' },
];

const PILLARS = [
  { id: 'jailbreak',   title: 'JAILBREAK',   description: 'Pomoc lidem ve výkonu trestu a po něm.',                  fullDesc: 'Spolupracujeme s věznicemi, poskytujeme vzdělání, mentoring a přípravu na svobodný život. Náš program snižuje recidivu.',              icon: <DoorOpen size={28}/>,   stats: '340+ podpořených',   tags: ['Mentoring','Vzdělání','Restart'] },
  { id: 'rework',      title: 'REWORK',       description: 'Integrace handicapovaných a nezaměstnaných skrze práci.',  fullDesc: 'Vytváříme pracovní příležitosti pro lidi s handicapem a dlouhodobě nezaměstnané. Inkluzivní prostředí v partnerských firmách.',          icon: <Briefcase size={28}/>,  stats: '180+ zaměstnaných',  tags: ['Práce','Inkluze','Rozvoj'] },
  { id: 'bodzlomu',    title: 'BOD ZLOMU',    description: 'Provázení dětí z dětských domovů do dospělosti.',         fullDesc: 'Doprovázíme mladé lidi opouštějící institucionální péči. Nabízíme bydlení, vzdělání a emocionální podporu na cestě k samostatnosti.',   icon: <Heart size={28}/>,      stats: '95+ dětí',            tags: ['Děti','Bydlení','Budoucnost'] },
  { id: 'streetwise',  title: 'STREETWISE',   description: 'První kontakt a pomoc lidem na ulici.',                   fullDesc: 'Terénní pracovníci každý den vyrážejí do ulic. Poskytujeme základní potřeby, zdravotní péči a cestu zpět do společnosti.',               icon: <HomeIcon size={28}/>,   stats: '520+ kontaktů/měs.', tags: ['Terén','Zdraví','Přístřeší'] },
  { id: 'stabilizace', title: 'STABILIZACE',  description: 'Udržení životní změny a plná integrace.',                fullDesc: 'Dlouhodobé provázení klientů po akutní fázi. Pomáháme s udržením bydlení, práce a sociálních vztahů. Prevence návratu do krize.',       icon: <ShieldCheck size={28}/>, stats: '78% úspěšnost',       tags: ['Podpora','Stabilita','Prevence'] },
];

const STORIES = [
  { name: 'Martin K.', age: 34, pillar: 'JAILBREAK',  quote: 'Po 5 letech jsem nevěřil, že mám šanci. REST||ART mi dal práci, byt a hlavně víru v sebe.',                outcome: 'Pracuje jako svářeč, má vlastní byt' },
  { name: 'Tereza M.', age: 22, pillar: 'BOD ZLOMU',  quote: 'Z dětského domova jsem odcházela s kufrem a strachem. Tady mi pomohli najít první práci i domov.',         outcome: 'Studuje VŠ, pracuje part-time' },
  { name: 'Jakub R.',  age: 45, pillar: 'STREETWISE', quote: 'Dva roky jsem žil pod mostem. Jeden rozhovor s terénním pracovníkem změnil vše.',                          outcome: 'Azylové bydlení, v programu REWORK' },
  { name: 'Eva S.',    age: 28, pillar: 'REWORK',      quote: 'S roztroušenou sklerózou mi každý říkal, že práci nenajdu. REST||ART dokázal opak.',                      outcome: 'Grafička na částečný úvazek' },
];

const NEWS = [
  { id: 1, date: '12. 3. 2026', title: 'JAILBREAK rozšiřuje program do 3 nových věznic',       excerpt: 'Vstupujeme do spolupráce s věznicemi Plzeň, Brno a Liberec. Více než 200 nových účastníků.',                          tag: 'JAILBREAK',  readTime: '3 min', views: '1.2k' },
  { id: 2, date: '5. 3. 2026',  title: 'REST||ART získal ocenění za společenskou odpovědnost', excerpt: 'Na ceremoniálu v Praze jsme převzali cenu Firma roku v kategorii Sociální inovace.',                                   tag: 'Ocenění',    readTime: '2 min', views: '3.4k' },
  { id: 3, date: '28. 2. 2026', title: 'Nové partnerství s Magistrátem hl. města Prahy',       excerpt: 'Podpis memoranda otevírá dveře k systémové změně v přístupu k bezdomovectví.',                                         tag: 'STREETWISE', readTime: '4 min', views: '890' },
  { id: 4, date: '15. 2. 2026', title: 'BOD ZLOMU: 100. klient úspěšně osamostatněn',          excerpt: 'Tomáš (23) je 100. mladý člověk, který díky programu stojí na vlastních nohách.',                                     tag: 'BOD ZLOMU',  readTime: '5 min', views: '2.1k' },
];

const TEAM = [
  { name: 'David Kozák',       role: 'Zakladatel & CEO' },
  { name: 'Jana Novotná',      role: 'Ředitelka programů' },
  { name: 'Tomáš Veselý',      role: 'Vedoucí JAILBREAK' },
  { name: 'Lucie Pospíšilová', role: 'Vedoucí BOD ZLOMU' },
];

const KOZAK_PROJECTS = [
  { name: 'Online program pro správu firem',  url: 'https://studio.david-kozak.com',     desc: 'Komplexní nástroj pro řízení projektů, týmu a financí.', icon: <Rocket /> },
  { name: 'Online generátor AI obrázků',      url: 'https://imaginator.david-kozak.com', desc: 'Tvořte unikátní digitální umění s pomocí AI.',           icon: <Paintbrush /> },
  { name: 'Web-prezentační portfolio',        url: 'https://dk.david-kozak.com',          desc: 'Galerie autorských webových designů.',                   icon: <Monitor /> },
  { name: 'Osobní rozvoj a mentoring',        url: 'https://zaosobni.david-kozak.com',    desc: 'Cesta k sebepoznání a osobnímu růstu.',                  icon: <Key /> },
  { name: 'Architekt pravdy',                 url: 'https://sites.google.com/davidkozakinternational.org/dkisro/domů', desc: 'Zkoumání hlubokých pravd a principů reality.', icon: <Landmark /> },
  { name: 'Online životopis',                 url: 'https://zivotopis.david-kozak.com',   desc: 'Přehled vzdělání a zkušeností Davida Kozáka.',           icon: <FileText /> },
  { name: 'Animátorský web',                  url: 'https://new.david-kozak.com',         desc: 'Prezentace animací a motion design projektů.',           icon: <Film /> },
  { name: 'Animátorský web (Silver)',         url: 'https://silver.david-kozak.com',      desc: 'Zaměřeno na high-end digitální animace.',                icon: <Film /> },
  { name: 'Aplikace firemní',                 url: 'https://appka.david-kozak.com',       desc: 'Vlastní firemní aplikace pro mobilní zařízení.',         icon: <Smartphone /> },
];

// ═══════════════════════════════════════════════════
// CSS — THEME VARIABLES + UTILITY CLASSES
// ═══════════════════════════════════════════════════

const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');

/* ── DARK (výchozí) ─────────────────────────────── */
:root {
  --c-bg:       #051111;
  --c-text:     rgba(255,255,255,0.90);
  --c-mid:      rgba(255,255,255,0.55);
  --c-muted:    rgba(255,255,255,0.38);
  --c-faint:    rgba(255,255,255,0.20);
  --c-accent:   #22d3ee;
  --c-acc-bg:   rgba(34,211,238,0.10);
  --c-acc-bdr:  rgba(34,211,238,0.20);
  --c-glass:    rgba(255,255,255,0.025);
  --c-glass-bdr:rgba(0,242,234,0.08);
  --c-hover:    rgba(34,211,238,0.05);
  --c-input:    rgba(0,0,0,0.22);
  --c-inp-bdr:  rgba(255,255,255,0.07);
  --c-divide:   rgba(255,255,255,0.07);
  --c-tag:      rgba(34,211,238,0.10);
  --c-tag-bdr:  rgba(34,211,238,0.22);
  --c-btn-text: #000000;
  --c-glow:     0 0 40px rgba(0,242,234,0.25), 0 0 80px rgba(0,242,234,0.10);
  --c-aura1:    rgba(20,184,166,0.12);
  --c-aura2:    rgba(6,182,212,0.08);
  --c-aura3:    rgba(6,78,59,0.12);
  --c-grid:     rgba(0,242,234,0.025);
  --c-nav:      rgba(5,17,17,0.97);
  --c-blob1:    rgba(20,184,166,0.18);
  --c-blob2:    rgba(6,182,212,0.14);
  --c-footer:   rgba(13,47,47,0.25);
}

/* ── LIGHT ──────────────────────────────────────── */
.lm {
  --c-bg:       #f0fdf9;
  --c-text:     #0c2020;
  --c-mid:      rgba(12,32,32,0.65);
  --c-muted:    rgba(12,32,32,0.45);
  --c-faint:    rgba(12,32,32,0.26);
  --c-accent:   #0e7490;
  --c-acc-bg:   rgba(14,116,144,0.09);
  --c-acc-bdr:  rgba(14,116,144,0.22);
  --c-glass:    rgba(255,255,255,0.82);
  --c-glass-bdr:rgba(14,116,144,0.10);
  --c-hover:    rgba(14,116,144,0.06);
  --c-input:    rgba(255,255,255,0.95);
  --c-inp-bdr:  rgba(14,116,144,0.16);
  --c-divide:   rgba(14,116,144,0.10);
  --c-tag:      rgba(14,116,144,0.09);
  --c-tag-bdr:  rgba(14,116,144,0.24);
  --c-btn-text: #ffffff;
  --c-glow:     0 0 30px rgba(14,116,144,0.18), 0 0 60px rgba(14,116,144,0.08);
  --c-aura1:    rgba(20,184,166,0.18);
  --c-aura2:    rgba(6,182,212,0.12);
  --c-aura3:    rgba(167,243,208,0.40);
  --c-grid:     rgba(14,116,144,0.025);
  --c-nav:      rgba(240,253,249,0.97);
  --c-blob1:    rgba(20,184,166,0.22);
  --c-blob2:    rgba(6,182,212,0.16);
  --c-footer:   rgba(220,253,245,0.60);
}

/* ── UTILITY CLASSES ────────────────────────────── */
.t-text    { color: var(--c-text); }
.t-mid     { color: var(--c-mid); }
.t-muted   { color: var(--c-muted); }
.t-faint   { color: var(--c-faint); }
.t-accent  { color: var(--c-accent); }
.t-acc-bg  { background: var(--c-acc-bg); }
.t-acc-bdr { border-color: var(--c-acc-bdr) !important; }
.t-input   { background: var(--c-input) !important; border-color: var(--c-inp-bdr) !important; color: var(--c-text) !important; }
.t-input::placeholder { color: var(--c-muted) !important; }
.t-divide  { border-color: var(--c-divide) !important; }
.t-tag     { background: var(--c-tag); border-color: var(--c-tag-bdr); color: var(--c-accent); }
.t-btn     { background: var(--c-accent); color: var(--c-btn-text); }
.t-btn:hover { opacity: 0.88; }
.card-h:hover { background: var(--c-hover) !important; }
.glass-panel  { background: var(--c-glass) !important; border: 1px solid var(--c-glass-bdr) !important; backdrop-filter: blur(16px); }
.text-glow-cyan { text-shadow: var(--c-glow); color: var(--c-text) !important; }
.title-h { transition: color .2s; }
.card-h:hover .title-h { color: var(--c-accent); }
select option  { background: var(--c-bg); color: var(--c-text); }

/* ── ANIMACE ────────────────────────────────────── */
@keyframes bounce-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
.animate-bounce-slow { animation: bounce-slow 10s ease-in-out infinite; }
.font-serif { font-family: 'Playfair Display', Georgia, serif; }
* { scrollbar-width: thin; scrollbar-color: var(--c-accent) transparent; }
`;

// ═══════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════

const Tag = ({ children }) => (
  <span className="t-tag border text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">{children}</span>
);

const PageHeader = ({ title, accent, subtitle }) => (
  <div className="pt-40 pb-16 px-6">
    <div className="max-w-7xl mx-auto">
      <span className="inline-flex items-center gap-2 t-accent t-acc-bg border t-acc-bdr font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8">
        {subtitle}
      </span>
      <h2 className="text-6xl md:text-9xl font-serif uppercase text-glow-cyan leading-none">
        {title}<br/>
        <span className="t-accent italic font-light">{accent}</span>
      </h2>
      <div className="mt-8 h-px w-full" style={{ background: 'linear-gradient(90deg, var(--c-accent), transparent)' }} />
    </div>
  </div>
);

const StatCard = ({ value, label, icon }) => {
  const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(num / 60));
    const id = setInterval(() => { n += step; if (n >= num) { setCount(num); clearInterval(id); } else setCount(n); }, 25);
    return () => clearInterval(id);
  }, [num]);
  return (
    <div className="glass-panel p-8 rounded-3xl text-center group hover:-translate-y-1 transition-all duration-300">
      <div className="t-accent mb-4 flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>
      <div className="text-5xl font-black text-glow-cyan mb-2">{value.replace(/\d+/, count)}</div>
      <div className="t-muted text-xs uppercase tracking-widest font-bold">{label}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════

const HomePage = ({ setCurrentPage, userInput, setUserInput, aiResponse, isLoading, isSpeaking, error, generateRestartPath, speakPath }) => (
  <>
    {/* HERO */}
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(var(--c-grid) 1px,transparent 1px),linear-gradient(90deg,var(--c-grid) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"      style={{ background: 'var(--c-blob1)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ background: 'var(--c-blob2)', animationDelay: '1.5s' }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 t-accent t-acc-bg border t-acc-bdr text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--c-accent)' }} />
          David Kozák International, s.r.o.
        </div>
        <h1 className="text-8xl sm:text-[11rem] md:text-[15rem] font-serif font-black tracking-tighter text-glow-cyan leading-none">
          REST<span className="t-accent opacity-30 italic">||</span>ART
        </h1>
        <p className="text-xl md:text-2xl t-muted tracking-[0.35em] uppercase font-light">Integrace Společnosti</p>
        <p className="text-lg t-muted max-w-xl mx-auto font-light leading-relaxed">Druhou šanci si zaslouží každý. Budujeme udržitelný systém pro ty, které svět přestal vidět.</p>
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <button onClick={() => setCurrentPage('about')} className="t-btn px-10 py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:scale-105 shadow-xl transition-all">Zjistit více →</button>
          <button onClick={() => setCurrentPage('pillars')} className="glass-panel t-mid px-10 py-5 rounded-2xl font-bold text-sm hover:opacity-80 transition-all">Naše pilíře</button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 t-faint animate-bounce">
        <span className="text-[9px] uppercase tracking-widest">scroll</span>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, var(--c-accent), transparent)' }} />
      </div>
    </header>

    {/* STATS */}
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard value="1200+" label="Podpořených lidí"  icon={<Users size={26}/>} />
        <StatCard value="5"     label="Aktivních pilířů"  icon={<Target size={26}/>} />
        <StatCard value="78%"   label="Úspěšnost"         icon={<TrendingUp size={26}/>} />
        <StatCard value="8"     label="Let zkušeností"    icon={<Award size={26}/>} />
      </div>
    </section>

    {/* PILLARS PREVIEW */}
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14">
          <div>
            <p className="t-accent text-xs uppercase tracking-widest font-bold mb-3">Jak pomáháme</p>
            <h2 className="text-5xl md:text-6xl font-serif t-text">Pět <span className="t-accent italic">pilířů</span></h2>
          </div>
          <button onClick={() => setCurrentPage('pillars')} className="t-accent flex items-center gap-2 hover:gap-4 transition-all text-xs font-black uppercase tracking-widest mt-6 md:mt-0">Vše o pilířích <ArrowRight size={14}/></button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <div key={p.id} onClick={() => setCurrentPage('pillars')}
              className="glass-panel card-h p-8 rounded-[2.5rem] group hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden">
              <span className="absolute top-5 right-7 text-5xl font-black font-serif select-none t-faint">0{i+1}</span>
              <div className="w-12 h-12 t-acc-bg rounded-2xl flex items-center justify-center t-accent mb-6 group-hover:scale-110 transition-transform">{p.icon}</div>
              <h3 className="text-lg font-black mb-2 uppercase tracking-wider t-text title-h">{p.title}</h3>
              <p className="t-muted text-sm font-light leading-relaxed mb-4">{p.description}</p>
              <span className="text-xs t-accent font-bold uppercase tracking-widest opacity-70">{p.stats}</span>
              <div className="mt-4 h-px w-8 group-hover:w-full transition-all duration-700" style={{ background: 'var(--c-accent)', opacity: .3 }} />
            </div>
          ))}
          <button onClick={() => setCurrentPage('contacts')} className="glass-panel card-h p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all group">
            <div className="w-12 h-12 border-2 border-dashed rounded-2xl flex items-center justify-center t-muted transition-all" style={{ borderColor: 'var(--c-acc-bdr)' }}>
              <ArrowRight size={18}/>
            </div>
            <span className="t-muted text-xs uppercase tracking-widest font-bold">Zapojit se</span>
          </button>
        </div>
      </div>
    </section>

    {/* AI */}
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto glass-panel p-10 md:p-14 rounded-[3rem] space-y-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-40" style={{ background: 'var(--c-blob1)' }} />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 t-acc-bg rounded-xl flex items-center justify-center"><Sparkles size={14} className="t-accent"/></div>
            <span className="t-accent text-xs uppercase tracking-widest font-black">AI Asistent</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif t-text">Váš restart <span className="t-accent italic">začíná zde</span></h3>
          <p className="t-muted mt-2 font-light text-sm">Popište svou situaci — AI navrhne cestu vpřed skrze pilíře REST||ART.</p>
        </div>
        <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Popište svou situaci..."
          className="w-full h-40 rounded-2xl p-6 focus:outline-none transition-all resize-none text-sm leading-relaxed t-input border" />
        <div className="flex gap-3">
          <button onClick={generateRestartPath} disabled={isLoading}
            className="flex-1 t-btn py-4 rounded-xl font-black uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all">
            {isLoading ? <><span className="animate-spin inline-block">◌</span> Generuji...</> : <><Sparkles size={13}/> Analyzovat příběh</>}
          </button>
          {aiResponse && <button onClick={speakPath} disabled={isSpeaking} className="glass-panel px-6 rounded-xl t-muted border t-acc-bdr transition-all hover:opacity-80"><Volume2 size={18}/></button>}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {aiResponse && (
          <div className="p-8 t-acc-bg border t-acc-bdr rounded-2xl t-mid font-light leading-relaxed text-sm">
            <div className="flex items-center gap-2 mb-4"><Sparkles size={13} className="t-accent"/><span className="t-accent text-xs font-black uppercase tracking-widest">Váš plán restartu</span></div>
            {aiResponse}
          </div>
        )}
      </div>
    </section>

    {/* QUOTE */}
    <section className="relative py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(90deg, var(--c-blob1), transparent, var(--c-blob2))' }} />
      <div className="absolute top-0 left-0 w-full h-px opacity-30"    style={{ background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-full h-px opacity-30" style={{ background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)' }} />
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <Quote size={44} className="t-accent opacity-20 mx-auto"/>
        <blockquote className="text-3xl md:text-5xl font-serif italic t-mid leading-relaxed">"Na nikoho se nezapomíná. Každý si zaslouží druhou šanci."</blockquote>
        <p className="t-accent opacity-50 text-xs uppercase tracking-widest font-bold">— David Kozák, zakladatel</p>
      </div>
    </section>

    {/* NEWS PREVIEW */}
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <h2 className="text-4xl md:text-5xl font-serif t-text">Nejnovější <span className="t-accent italic">novinky</span></h2>
          <button onClick={() => setCurrentPage('news')} className="t-accent flex items-center gap-2 hover:gap-4 transition-all text-xs font-black uppercase tracking-widest mt-4 md:mt-0">Všechny novinky <ArrowRight size={14}/></button>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {NEWS.slice(0, 2).map(n => (
            <div key={n.id} onClick={() => setCurrentPage('news')} className="glass-panel card-h p-8 rounded-3xl group transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-5"><Tag>{n.tag}</Tag><span className="t-faint text-xs">{n.date}</span></div>
              <h4 className="text-xl font-bold mb-3 t-text title-h leading-snug">{n.title}</h4>
              <p className="t-muted text-sm font-light leading-relaxed">{n.excerpt}</p>
              <div className="flex items-center gap-4 mt-5 t-faint text-xs">
                <span className="flex items-center gap-1"><Clock size={11}/> {n.readTime}</span>
                <span className="flex items-center gap-1"><Eye size={11}/> {n.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════
// PAGE: ABOUT
// ═══════════════════════════════════════════════════

const AboutPage = () => (
  <div className="animate-in fade-in duration-700">
    <PageHeader title="O projektu" accent="& proč existujeme" subtitle="Kdo jsme" />
    <div className="px-6 pb-24 max-w-7xl mx-auto space-y-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-7">
          <h3 className="text-4xl md:text-6xl font-serif t-text leading-tight">Naše <span className="t-accent italic">mise</span></h3>
          <p className="t-mid text-lg leading-relaxed font-light">REST||ART Integrace vznikl jako odpověď na systémové selhání společnosti. Věříme, že každý člověk — bez ohledu na svou minulost — má právo na důstojný život.</p>
          <p className="t-muted leading-relaxed font-light">Nejsme charita. Jsme systémová změna. Propojujeme lidi v krizi s konkrétními nástroji, komunitou a příležitostmi skrze pět pilířů.</p>
          <div className="flex flex-wrap gap-2">
            {['Empatie','Systém','Změna','Komunita','Důstojnost'].map(t => (
              <span key={t} className="t-acc-bg border t-acc-bdr t-accent text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <div className="glass-panel p-10 rounded-[3rem] space-y-8">
          {[
            { label: 'Vize',    text: 'Společnost, kde nikdo nezůstává pozadu.',                  icon: <Eye size={18}/> },
            { label: 'Mise',    text: 'Systémová integrace skrze práci, bydlení a komunitu.',     icon: <Target size={18}/> },
            { label: 'Hodnoty', text: 'Empatie, transparentnost, měřitelné výsledky.',            icon: <Heart size={18}/> },
          ].map(item => (
            <div key={item.label} className="flex gap-5 items-start">
              <div className="w-10 h-10 t-acc-bg rounded-xl flex items-center justify-center t-accent shrink-0">{item.icon}</div>
              <div>
                <p className="t-accent text-xs font-black uppercase tracking-widest mb-1">{item.label}</p>
                <p className="t-mid font-light text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-4xl font-serif mb-16 text-center t-text">Naše <span className="t-accent italic">cesta</span></h3>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px opacity-40" style={{ background: 'linear-gradient(to bottom, var(--c-accent), transparent)' }} />
          {[
            { year: '2016', title: 'Vznik projektu',        desc: 'David Kozák zakládá první program pro lidi po výkonu trestu.' },
            { year: '2018', title: 'Expanze pilířů',         desc: 'Spuštění STREETWISE a BOD ZLOMU. Tým roste na 12 lidí.' },
            { year: '2020', title: 'Digitální transformace', desc: 'Zavádíme online platformu pro klienty a partnery.' },
            { year: '2023', title: 'Systémové partnerství',  desc: 'Memorandum s Magistrátem Praha, 800+ podpořených lidí.' },
            { year: '2026', title: 'REST||ART 2.0',          desc: 'Nová identita, AI asistent a expanze do 5 krajů.' },
          ].map((item, i) => (
            <div key={item.year} className={`relative flex gap-8 mb-10 items-start ${i%2===0?'md:flex-row':'md:flex-row-reverse'}`}>
              <div className="hidden md:block flex-1" />
              <div className="w-10 h-10 t-acc-bg border-2 t-acc-bdr rounded-full flex items-center justify-center z-10 shrink-0">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--c-accent)' }} />
              </div>
              <div className="flex-1 glass-panel p-7 rounded-2xl">
                <span className="t-accent text-xs font-black uppercase tracking-widest">{item.year}</span>
                <h4 className="text-lg font-bold mt-1 mb-2 t-text">{item.title}</h4>
                <p className="t-muted font-light text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h3 className="text-4xl font-serif mb-12 text-center t-text">Náš <span className="t-accent italic">tým</span></h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(m => (
            <div key={m.name} className="glass-panel card-h p-8 rounded-3xl text-center group transition-all">
              <div className="w-20 h-20 t-acc-bg rounded-full flex items-center justify-center mx-auto mb-5 border t-acc-bdr group-hover:scale-105 transition-transform">
                <Users size={28} className="t-accent opacity-40"/>
              </div>
              <h4 className="font-bold t-text">{m.name}</h4>
              <p className="t-muted text-xs uppercase tracking-widest mt-1 font-bold">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// PAGE: PILLARS (accordion)
// ═══════════════════════════════════════════════════

const PillarsPage = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader title="Pět pilířů" accent="integrace" subtitle="Systém pomoci" />
      <div className="px-6 pb-24 max-w-5xl mx-auto space-y-4">
        {PILLARS.map((p, i) => (
          <div key={p.id}
            className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${active === p.id ? 'card-h' : ''}`}
            onClick={() => setActive(active === p.id ? null : p.id)}>
            <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <span className="text-5xl font-black t-faint font-serif shrink-0 leading-none select-none">0{i+1}</span>
              <div className="w-12 h-12 t-acc-bg rounded-2xl flex items-center justify-center t-accent shrink-0">{p.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black uppercase tracking-wider mb-1 t-text">{p.title}</h3>
                <p className="t-muted text-sm">{p.description}</p>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <span className="t-accent font-black text-sm hidden sm:block">{p.stats}</span>
                <div className={`w-8 h-8 rounded-full border t-acc-bdr flex items-center justify-center t-accent transition-transform duration-300 ${active===p.id?'rotate-180':''}`}>↓</div>
              </div>
            </div>
            {active === p.id && (
              <div className="px-8 pb-8 border-t t-divide pt-8 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="t-mid leading-relaxed font-light">{p.fullDesc}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {p.tags.map(tag => <span key={tag} className="t-acc-bg t-accent border t-acc-bdr text-xs font-bold px-3 py-1.5 rounded-full">{tag}</span>)}
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between">
                  <div>
                    <p className="t-accent text-xs uppercase tracking-widest font-bold mb-3">Výsledky</p>
                    <div className="text-4xl font-black text-glow-cyan">{p.stats}</div>
                    <p className="t-faint text-sm mt-1">od začátku programu</p>
                  </div>
                  <button className="mt-6 t-acc-bg border t-acc-bdr t-accent text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:opacity-80 transition-all self-start">
                    Zapojit se →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// PAGE: STORIES
// ═══════════════════════════════════════════════════

const StoriesPage = ({ setCurrentPage }) => (
  <div className="animate-in fade-in duration-700">
    <PageHeader title="Příběhy" accent="změny" subtitle="Skutečné osudy" />
    <div className="px-6 pb-24 max-w-7xl mx-auto space-y-10">
      <p className="text-lg t-muted font-light max-w-xl">Za každým číslem je člověk. Tady jsou jejich příběhy — bez příkras, ale s nadějí.</p>
      <div className="grid md:grid-cols-2 gap-7">
        {STORIES.map((s, i) => (
          <div key={i} className="glass-panel card-h p-10 rounded-[3rem] group transition-all">
            <div className="flex items-center justify-between mb-7">
              <Tag>{s.pillar}</Tag>
              <div className="flex gap-0.5">{[...Array(5)].map((_,si) => <Star key={si} size={12} className="t-accent opacity-60 fill-current"/>)}</div>
            </div>
            <Quote size={28} className="t-accent opacity-20 mb-4"/>
            <blockquote className="text-xl font-serif italic t-mid leading-relaxed mb-8">"{s.quote}"</blockquote>
            <div className="border-t t-divide pt-7 flex items-center justify-between">
              <div><p className="font-bold t-text">{s.name}</p><p className="t-faint text-xs">{s.age} let</p></div>
              <div className="text-right"><p className="t-accent text-xs font-black uppercase tracking-wider">Dnes</p><p className="t-muted text-sm font-light">{s.outcome}</p></div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-panel p-16 rounded-[3rem] text-center space-y-5 t-acc-bg">
        <h3 className="text-4xl font-serif t-text">Váš příběh může být <span className="t-accent italic">další</span></h3>
        <p className="t-muted font-light max-w-md mx-auto">Ať je vaše situace jakákoliv — jsme tu. Prvním krokem je jediný kontakt.</p>
        <button onClick={() => setCurrentPage('contacts')} className="t-btn px-10 py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:scale-105 transition-all">
          Kontaktovat nás →
        </button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// PAGE: NEWS
// ═══════════════════════════════════════════════════

const NewsPage = () => (
  <div className="animate-in fade-in duration-700">
    <PageHeader title="Novinky" accent="& aktuality" subtitle="Co se děje" />
    <div className="px-6 pb-24 max-w-7xl mx-auto space-y-8">
      <div className="glass-panel rounded-[3rem] overflow-hidden group card-h transition-all cursor-pointer">
        <div className="grid lg:grid-cols-2">
          <div className="p-12 md:p-16 space-y-5">
            <Tag>{NEWS[0].tag}</Tag>
            <h3 className="text-3xl md:text-4xl font-serif t-text title-h leading-tight">{NEWS[0].title}</h3>
            <p className="t-muted font-light leading-relaxed">{NEWS[0].excerpt}</p>
            <div className="flex items-center gap-5 t-faint text-xs pt-2">
              <span className="flex items-center gap-1.5"><Calendar size={11}/> {NEWS[0].date}</span>
              <span className="flex items-center gap-1.5"><Clock size={11}/> {NEWS[0].readTime}</span>
              <span className="flex items-center gap-1.5"><Eye size={11}/> {NEWS[0].views}</span>
            </div>
          </div>
          <div className="t-acc-bg flex items-center justify-center p-16 min-h-[200px]">
            <Newspaper size={72} className="t-accent opacity-20"/>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NEWS.slice(1).map(n => (
          <div key={n.id} className="glass-panel card-h p-8 rounded-3xl group transition-all cursor-pointer flex flex-col">
            <Tag>{n.tag}</Tag>
            <h4 className="text-lg font-bold my-3 t-text title-h leading-snug flex-1">{n.title}</h4>
            <p className="t-muted text-sm font-light leading-relaxed mb-5">{n.excerpt}</p>
            <div className="flex items-center gap-4 t-faint text-xs border-t t-divide pt-4">
              <span className="flex items-center gap-1"><Calendar size={11}/> {n.date}</span>
              <span className="flex items-center gap-1"><Clock size={11}/> {n.readTime}</span>
              <span className="flex items-center gap-1 ml-auto"><Eye size={11}/> {n.views}</span>
            </div>
          </div>
        ))}
        {/* Newsletter */}
        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <div className="w-11 h-11 t-acc-bg rounded-xl flex items-center justify-center t-accent"><Mail size={18}/></div>
          <h4 className="text-lg font-bold t-text">Newsletter</h4>
          <p className="t-muted text-sm font-light">Novinky přímo do e-mailu.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Váš email" className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none t-input border"/>
            <button className="t-btn px-4 rounded-xl font-black text-sm hover:opacity-90 transition-all">→</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// PAGE: PROJECTS
// ═══════════════════════════════════════════════════

const ProjectsPage = () => (
  <div className="animate-in fade-in duration-700">
    <PageHeader title="Projekty" accent="DK Studio" subtitle="Vizionář & Design" />
    <div className="px-6 pb-24 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <p className="t-muted font-light max-w-lg">Digitální projekty pod hlavičkou David Kozák International — od podnikových nástrojů po AI a animace.</p>
        <a href="https://davidkozak.social" target="_blank" rel="noopener noreferrer"
          className="glass-panel card-h px-6 py-3 rounded-2xl flex items-center gap-2 transition-all text-xs font-bold tracking-widest uppercase whitespace-nowrap t-text">
          Portfolio majitele <ExternalLink size={13} className="t-accent"/>
        </a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {KOZAK_PROJECTS.map(p => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
            className="glass-panel card-h p-8 rounded-[2.5rem] group transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="t-acc-bg p-4 rounded-2xl t-accent group-hover:scale-110 transition-transform">{p.icon}</div>
              <ExternalLink className="t-faint group-hover:t-accent transition-all" size={15}/>
            </div>
            <h3 className="text-base font-bold mb-3 leading-tight t-text title-h flex-1">{p.name}</h3>
            <p className="t-muted font-light text-sm leading-relaxed">{p.desc}</p>
            <div className="mt-5 pt-4 border-t t-divide text-[10px] t-accent font-black uppercase tracking-widest opacity-50">Otevřít projekt →</div>
          </a>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// PAGE: CONTACTS
// ═══════════════════════════════════════════════════

const ContactsPage = () => (
  <div className="animate-in fade-in duration-700">
    <PageHeader title="Kontakt" accent="& spolupráce" subtitle="Jsme tu pro vás" />
    <div className="px-6 pb-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
      <div className="space-y-7">
        <p className="text-lg t-muted font-light leading-relaxed">Ať hledáte pomoc pro sebe, chcete se stát partnerem nebo podporovatelem — ozvěte se. Odpovídáme do 24 hodin.</p>
        <div className="space-y-3">
          {[
            { icon: <Phone size={20}/>,  label: 'Telefon', value: '705 217 251',                href: 'tel:705217251' },
            { icon: <Mail size={20}/>,   label: 'Email',   value: 'kozak@d-international.eu',  href: 'mailto:kozak@d-international.eu' },
            { icon: <Globe size={20}/>,  label: 'Web',     value: 'international.david-kozak.com', href: 'https://international.david-kozak.com' },
            { icon: <MapPin size={20}/>, label: 'Sídlo',   value: 'Praha, Česká republika',    href: null },
          ].map(item => (
            <div key={item.label}
              className={`glass-panel p-7 rounded-3xl flex items-center gap-5 ${item.href ? 'card-h cursor-pointer group transition-all' : ''}`}
              onClick={() => item.href && window.open(item.href)}>
              <div className="t-acc-bg p-3.5 rounded-xl t-accent shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div>
                <p className="t-faint text-xs uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-lg font-bold t-text">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-panel p-7 rounded-3xl">
          <p className="t-faint text-xs uppercase tracking-widest font-bold mb-5">Sledujte nás</p>
          <div className="flex gap-3">
            {[{ icon: <Instagram size={18}/>, l: 'Instagram' }, { icon: <Facebook size={18}/>, l: 'Facebook' }, { icon: <Globe size={18}/>, l: 'Web' }].map(s => (
              <button key={s.l} className="flex items-center gap-2 t-acc-bg border t-acc-bdr t-muted hover:t-accent px-4 py-2.5 rounded-xl transition-all text-xs font-bold">
                {s.icon} {s.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-panel p-10 md:p-14 rounded-[3rem] relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-40" style={{ background: 'var(--c-blob1)' }} />
        <h3 className="text-3xl font-serif italic mb-8 t-text">Napište nám <span className="t-accent">zprávu</span></h3>
        <form className="space-y-4 relative z-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Jméno"    className="w-full rounded-2xl p-5 focus:outline-none transition-all text-sm t-input border"/>
            <input type="text" placeholder="Příjmení" className="w-full rounded-2xl p-5 focus:outline-none transition-all text-sm t-input border"/>
          </div>
          <input type="email" placeholder="E-mail" className="w-full rounded-2xl p-5 focus:outline-none transition-all text-sm t-input border"/>
          <select defaultValue="" className="w-full rounded-2xl p-5 focus:outline-none transition-all text-sm t-input border appearance-none">
            <option value="" disabled>Téma zprávy</option>
            <option>Potřebuji pomoc</option>
            <option>Partnerství / Spolupráce</option>
            <option>Podpora / Dárcovství</option>
            <option>Média / Tisk</option>
            <option>Jiné</option>
          </select>
          <textarea placeholder="Jak vám můžeme pomoci?" className="w-full h-36 rounded-2xl p-5 focus:outline-none resize-none transition-all text-sm t-input border"/>
          <button type="button" className="w-full t-btn py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.01] transition-all shadow-lg flex items-center justify-center gap-2">
            Odeslat zprávu <Send size={14}/>
          </button>
        </form>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════

const App = () => {
  const [isDark,      setIsDark]      = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [scrollProg,  setScrollProg]  = useState(0);
  const [showTop,     setShowTop]     = useState(false);

  const [userInput,  setUserInput]  = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 50);
      setScrollProg(max > 0 ? (y / max) * 100 : 0);
      setShowTop(y > 600);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }, [currentPage]);

  const fetchRetry = async (url, opts, n = 5) => {
    let delay = 1000;
    for (let i = 0; i < n; i++) {
      try { const r = await fetch(url, opts); if (r.ok) return await r.json(); if (r.status !== 429 && r.status < 500) break; }
      catch (e) { if (i === n - 1) throw e; }
      await new Promise(r => setTimeout(r, delay)); delay *= 2;
    }
    throw new Error('Chyba spojení.');
  };

  const generateRestartPath = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true); setAiResponse(''); setError('');
    const sys = 'Jsi empatický asistent projektu REST||ART Integrace. Navrhni plán restartu pomocí pilířů: JAILBREAK, REWORK, BOD ZLOMU, STREETWISE a STABILIZACE. Piš česky a povzbudivě.';
    try {
      const d = await fetchRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }], systemInstruction: { parts: [{ text: sys }] } }) }
      );
      setAiResponse(d.candidates?.[0]?.content?.parts?.[0]?.text || 'Zkuste to znovu.');
    } catch { setError('Spojení selhalo.'); } finally { setIsLoading(false); }
  };

  const pcmToWav = (b, sr) => {
    const p = Uint8Array.from(atob(b), c => c.charCodeAt(0)), h = new ArrayBuffer(44), v = new DataView(h);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0,'RIFF'); v.setUint32(4,32+p.length,true); w(8,'WAVE'); w(12,'fmt ');
    v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,sr,true);
    v.setUint32(28,sr*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,p.length,true);
    return new Blob([h, p], { type: 'audio/wav' });
  };

  const speakPath = async () => {
    if (!aiResponse || isSpeaking) return; setIsSpeaking(true);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `Řekni hřejivě česky: ${aiResponse}` }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } } } }) });
      const re = await r.json(), pd = re.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (pd) { const a = new Audio(URL.createObjectURL(pcmToWav(pd, 24000))); a.onended = () => setIsSpeaking(false); a.play(); }
      else setIsSpeaking(false);
    } catch { setIsSpeaking(false); }
  };

  const pp = { setCurrentPage, userInput, setUserInput, aiResponse, setAiResponse, isLoading, setIsLoading, isSpeaking, setIsSpeaking, error, setError, generateRestartPath, speakPath };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':    return <AboutPage />;
      case 'pillars':  return <PillarsPage />;
      case 'stories':  return <StoriesPage setCurrentPage={setCurrentPage} />;
      case 'news':     return <NewsPage />;
      case 'projects': return <ProjectsPage />;
      case 'contacts': return <ContactsPage />;
      default:         return <HomePage {...pp} />;
    }
  };

  // ─── Toggle button (reused in navbar + menu) ─────────────────
  const ThemeToggle = ({ full = false }) => (
    <button onClick={() => setIsDark(d => !d)}
      className={`flex items-center gap-2 t-acc-bg border t-acc-bdr t-accent rounded-xl transition-all hover:opacity-80 ${full ? 'px-4 py-2.5 text-xs font-bold' : 'p-2.5'}`}
      title={isDark ? 'Světlý režim' : 'Tmavý režim'}>
      {isDark ? <Sun size={16}/> : <Moon size={16}/>}
      {full && (isDark ? 'Světlý' : 'Tmavý')}
    </button>
  );

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden relative ${isDark ? '' : 'lm'}`}
      style={{ background: 'var(--c-bg)', color: 'var(--c-text)', transition: 'background .4s, color .3s' }}>

      <style>{THEME_CSS}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 z-[200] h-[2px] pointer-events-none transition-all duration-75"
        style={{ width: `${scrollProg}%`, background: 'var(--c-accent)' }} />

      {/* Aura blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"      style={{ background: 'var(--c-aura1)' }} />
        <div className="absolute top-[40%] -right-[5%] w-[500px] h-[500px] rounded-full blur-[100px] animate-bounce-slow" style={{ background: 'var(--c-aura2)' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[700px] h-[700px] rounded-full blur-[150px]"               style={{ background: 'var(--c-aura3)' }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 px-6 ${scrolled ? 'py-3 shadow-2xl' : 'py-5'}`}
        style={scrolled ? { background: 'var(--c-nav)' } : {}}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="text-2xl font-black tracking-tighter flex items-center text-glow-cyan cursor-pointer group font-serif">
            REST<span className="t-accent opacity-30 mx-0.5 group-hover:opacity-60 transition-opacity italic">||</span>ART
            <span className="ml-3 text-[9px] font-sans font-light tracking-[0.3em] uppercase hidden sm:block t-faint">Integrace</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.slice(1, -1).map(item => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${currentPage === item.id ? 
```