import React, { useState, useEffect } from 'react';
import {
  Menu, X, Heart, Briefcase, DoorOpen, Home as HomeIcon, ShieldCheck,
  Instagram, Facebook, Globe, Users, Quote, Sparkles, Send, Volume2,
  Phone, Mail, ExternalLink, Rocket, Paintbrush, Monitor, Key, Landmark,
  FileText, Film, Smartphone, Star, Calendar, Award, TrendingUp, Clock,
  Eye, Newspaper, Target, ArrowRight, MapPin, Sun, Moon, ChevronUp, Loader2
} from 'lucide-react';

// ═══════════════════════════════════════════════════
// KONFIGURACE A DATA
// ═══════════════════════════════════════════════════

const apiKey = ""; // API klíč doplní prostředí

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
  { id: 'jailbreak',   title: 'JAILBREAK',   description: 'Pomoc lidem ve výkonu trestu a po něm.',                  fullDesc: 'Spolupracujeme s věznicemi, poskytujeme vzdělání, mentoring a přípravu na svobodný život. Náš program snižuje recidivu a vrací lidi do společnosti.', icon: <DoorOpen size={28}/>,   stats: '340+ podpořených',   tags: ['Mentoring','Vzdělání','Restart'] },
  { id: 'rework',      title: 'REWORK',       description: 'Integrace handicapovaných a nezaměstnaných skrze práci.',  fullDesc: 'Vytváříme pracovní příležitosti pro lidi s handicapem a dlouhodobě nezaměstnané. Budujeme chráněné dílny a propojujeme talenty s inkluzivními firmami.', icon: <Briefcase size={28}/>,  stats: '180+ zaměstnaných',  tags: ['Práce','Inkluze','Rozvoj'] },
  { id: 'bodzlomu',    title: 'BOD ZLOMU',    description: 'Provázení dětí z dětských domovů do dospělosti.',         fullDesc: 'Doprovázíme mladé lidi opouštějící institucionální péči. Nabízíme bydlení, vzdělání a emocionální podporu jako "velký bratr nebo sestra".',   icon: <Heart size={28}/>,      stats: '95+ dětí',            tags: ['Děti','Bydlení','Budoucnost'] },
  { id: 'streetwise',  title: 'STREETWISE',   description: 'První kontakt a pomoc lidem na ulici.',                   fullDesc: 'Terénní pracovníci vyrážejí do ulic, aby navázali kontakt s lidmi bez domova. Poskytujeme základní potřeby, hygienu a cestu zpět skrze důvěru.', icon: <HomeIcon size={28}/>,   stats: '520+ kontaktů/měs.', tags: ['Terén','Zdraví','Přístřeší'] },
  { id: 'stabilizace', title: 'STABILIZACE',  description: 'Udržení životní změny a plná integrace.',                fullDesc: 'Dlouhodobé provázení klientů po akutní fázi. Pomáháme s udržením bydlení, stabilní prací a sociálními vztahy. Prevence návratu do krize.',       icon: <ShieldCheck size={28}/>, stats: '78% úspěšnost',       tags: ['Podpora','Stabilita','Prevence'] },
];

const STORIES = [
  { name: 'Martin K.', age: 34, pillar: 'JAILBREAK',  quote: 'Po 5 letech jsem nevěřil, že mám šanci. REST||ART mi dal práci a hlavně víru v sebe.', outcome: 'Pracuje jako svářeč' },
  { name: 'Tereza M.', age: 22, pillar: 'BOD ZLOMU',  quote: 'Z dětského domova jsem odcházela se strachem. Tady mi pomohli najít první práci i domov.', outcome: 'Studuje VŠ, pracuje' },
  { name: 'Jakub R.',  age: 45, pillar: 'STREETWISE', quote: 'Dva roky jsem žil na ulici. Jeden rozhovor s terénním pracovníkem změnil vše.', outcome: 'Azylové bydlení' },
  { name: 'Eva S.',    age: 28, pillar: 'REWORK',      quote: 'S mým handicapem mi každý říkal, že práci nenajdu. Tady mi dali skutečnou šanci.', outcome: 'Grafička' },
];

const NEWS = [
  { id: 1, date: '12. 3. 2026', title: 'JAILBREAK rozšiřuje program do nových regionů', excerpt: 'V březnu 2026 vstupujeme do spolupráce s věznicemi na Moravě. Více než 200 nových účastníků.', tag: 'Aktuality' },
  { id: 2, date: '5. 3. 2026',  title: 'REST||ART získal ocenění za sociální inovace', excerpt: 'Na slavnostním ceremoniálu jsme převzali cenu za náš unikátní model integrace.', tag: 'Ocenění' },
  { id: 3, date: '28. 2. 2026', title: 'Nové partnerství s David Kozák International', excerpt: 'Prohloubení spolupráce přinese více pracovních míst pro naše klienty.', tag: 'Partnerství' },
];

const KOZAK_PROJECTS = [
  { name: 'Online program pro správu firem',  url: 'https://studio.david-kozak.com',     desc: 'Komplexní nástroj pro řízení projektů, týmu a financí.', icon: <Rocket /> },
  { name: 'Online generátor AI obrázků',      url: 'https://imaginator.david-kozak.com', desc: 'Tvořte unikátní digitální umění s pomocí AI.',           icon: <Paintbrush /> },
  { name: 'Web-prezentační portfolio',        url: 'https://dk.david-kozak.com',          desc: 'Galerie autorských webových designů.',                   icon: <Monitor /> },
  { name: 'Osobní rozvoj a mentoring',        url: 'https://zaosobni.david-kozak.com',    desc: 'Cesta k sebepoznání a osobnímu růstu.',                  icon: <Key /> },
  { name: 'Architekt pravdy',                 url: 'https://sites.google.com/davidkozakinternational.org/dkisro/domů', desc: 'Zkoumání hlubokých pravd a principů reality.', icon: <Landmark /> },
  { name: 'Online životopis',                 url: 'https://zivotopis.david-kozak.com',   desc: 'Přehled vzdělání a zkušeností Davida Kozáka.',           icon: <FileText /> },
  { name: 'Animátorský web',                  url: 'https://new.david-kozak.com',         desc: 'Prezentace animací a motion design projektů.',           icon: <Film /> },
  { name: 'Animátorský web (Silver)',         url: 'https://silver.david-kozak.com',      desc: 'High-end digitální animace a efekty.',                   icon: <Film /> },
  { name: 'Aplikace firemní',                 url: 'https://appka.david-kozak.com',       desc: 'Vlastní firemní aplikace pro mobilní zařízení.',         icon: <Smartphone /> },
];

// ═══════════════════════════════════════════════════
// CSS STYLY (Proměnné témat)
// ═══════════════════════════════════════════════════

const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');

:root {
  --c-bg:       #051111;
  --c-text:     rgba(255,255,255,0.90);
  --c-mid:      rgba(255,255,255,0.55);
  --c-muted:    rgba(255,255,255,0.30);
  --c-accent:   #22d3ee;
  --c-acc-bg:   rgba(34,211,238,0.10);
  --c-acc-bdr:  rgba(34,211,238,0.20);
  --c-glass:    rgba(255,255,255,0.025);
  --c-glass-bdr:rgba(0,242,234,0.08);
  --c-glow:     0 0 30px rgba(0,242,234,0.25);
  --c-aura1:    rgba(20,184,166,0.10);
  --c-aura2:    rgba(6,182,212,0.06);
  --c-nav-bg:   rgba(5,17,17,0.85);
}

.lm {
  --c-bg:       #f0fdf9;
  --c-text:     #0c2020;
  --c-mid:      rgba(12,32,32,0.65);
  --c-muted:    rgba(12,32,32,0.40);
  --c-accent:   #0e7490;
  --c-acc-bg:   rgba(14,116,144,0.08);
  --c-acc-bdr:  rgba(14,116,144,0.18);
  --c-glass:    rgba(255,255,255,0.85);
  --c-glass-bdr:rgba(14,116,144,0.10);
  --c-glow:     0 0 20px rgba(14,116,144,0.15);
  --c-aura1:    rgba(20,184,166,0.15);
  --c-aura2:    rgba(6,182,212,0.10);
  --c-nav-bg:   rgba(240,253,249,0.92);
}

.glass-panel { background: var(--c-glass); border: 1px solid var(--c-glass-bdr); backdrop-filter: blur(16px); }
.text-glow-cyan { text-shadow: var(--c-glow); }
.font-serif { font-family: 'Playfair Display', serif; }
`;

// ═══════════════════════════════════════════════════
// POMOCNÉ KOMPONENTY
// ═══════════════════════════════════════════════════

const PageHeader = ({ title, accent, subtitle }) => (
  <div className="pt-40 pb-16 px-6">
    <div className="max-w-7xl mx-auto">
      <span className="inline-flex items-center gap-2 font-bold text-[10px] tracking-[0.3em] uppercase mb-8" style={{ color: 'var(--c-accent)' }}>
        {subtitle}
      </span>
      <h2 className="text-6xl md:text-9xl font-serif uppercase leading-none" style={{ color: 'var(--c-text)' }}>
        {title}<br/>
        <span className="italic font-light" style={{ color: 'var(--c-accent)' }}>{accent}</span>
      </h2>
      <div className="mt-8 h-px w-full" style={{ background: 'linear-gradient(90deg, var(--c-accent), transparent)' }} />
    </div>
  </div>
);

const StatCard = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, ''), 10) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] text-center group hover:-translate-y-2 transition-all duration-500">
      <div className="mb-4 flex justify-center transition-opacity opacity-40 group-hover:opacity-100" style={{ color: 'var(--c-accent)' }}>{icon}</div>
      <div className="text-5xl font-black mb-2 text-glow-cyan" style={{ color: 'var(--c-text)' }}>{value.replace(/\d+/, count)}</div>
      <div className="text-[10px] uppercase tracking-widest font-black" style={{ color: 'var(--c-muted)' }}>{label}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// STRÁNKU RENDERING LOGIKA
// ═══════════════════════════════════════════════════

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Gemini State
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
      setScrolled(winScroll > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  }, [currentPage]);

  // AI Funkce
  const generateRestartPath = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true); setAiResponse(""); setError("");
    const sys = "Jsi empatický asistent REST||ART Integrace. Navrhni plán restartu skrze pilíře: JAILBREAK, REWORK, BOD ZLOMU, STREETWISE a STABILIZACE. Piš česky a povzbudivě.";
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }], systemInstruction: { parts: [{ text: sys }] } })
      });
      const data = await res.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Zkuste to znovu.");
    } catch { setError("Spojení selhalo."); } finally { setIsLoading(false); }
  };

  const speakPath = async () => {
    if (!aiResponse || isSpeaking) return; setIsSpeaking(true);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Řekni hřejivě česky: ${aiResponse}` }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } } } })
      });
      const data = await res.json();
      const pcmData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (pcmData) {
        const audio = new Audio(URL.createObjectURL(new Blob([Uint8Array.from(atob(pcmData), c => c.charCodeAt(0))], { type: 'audio/wav' }))); // Zjednodušený blob pro náhled
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch { setIsSpeaking(false); }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Naše" accent="Mise" subtitle="Kdo jsme" />
          <div className="max-w-7xl mx-auto px-6 pb-32 space-y-24">
             <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                   <h3 className="text-4xl font-serif leading-tight">Budujeme svět, kde se na <span style={{ color: 'var(--c-accent)' }}>nikoho nezapomíná</span>.</h3>
                   <p style={{ color: 'var(--c-mid)' }} className="text-xl font-light leading-relaxed">REST||ART Integrace pod záštitou David Kozák International restrukturalizuje osudy lidí na okraji společnosti.</p>
                   <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="glass-panel p-6 rounded-2xl">
                         <Target style={{ color: 'var(--c-accent)' }} className="mb-3" />
                         <p className="font-bold text-sm uppercase tracking-widest mb-1">Mise</p>
                         <p style={{ color: 'var(--c-muted)' }} className="text-xs">Systémová integrace skrze práci a komunitu.</p>
                      </div>
                      <div className="glass-panel p-6 rounded-2xl">
                         <Users style={{ color: 'var(--c-accent)' }} className="mb-3" />
                         <p className="font-bold text-sm uppercase tracking-widest mb-1">Přístup</p>
                         <p style={{ color: 'var(--c-muted)' }} className="text-xs">Individuální mentoring a druhá šance.</p>
                      </div>
                   </div>
                </div>
                <div className="glass-panel p-16 rounded-[4rem] text-center relative overflow-hidden bg-cyan-500/5">
                   <Quote className="mx-auto mb-8 opacity-20" size={60} style={{ color: 'var(--c-accent)' }} />
                   <p className="text-3xl italic font-serif leading-relaxed">"Skutečná síla společnosti se pozná podle toho, jak se stará o ty nejzranitelnější."</p>
                   <p className="mt-8 font-black uppercase tracking-[0.4em] text-[10px]" style={{ color: 'var(--c-accent)' }}>David Kozák</p>
                </div>
             </div>
          </div>
        </div>
      );
      case 'pillars': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Pět fází" accent="Integrace" subtitle="Náš Systém" />
          <div className="max-w-6xl mx-auto px-6 pb-32 space-y-8">
            {PILLARS.map((p, i) => (
              <div key={p.id} className="glass-panel p-10 rounded-[3.5rem] group hover:bg-cyan-500/5 transition-all">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <span className="text-7xl font-serif font-black opacity-10 select-none">0{i+1}</span>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl" style={{ background: 'var(--c-acc-bg)', color: 'var(--c-accent)' }}>{p.icon}</div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{p.title}</h3>
                    <p style={{ color: 'var(--c-mid)' }} className="font-light text-lg">{p.fullDesc}</p>
                    <div className="flex gap-4 pt-4">
                       <span style={{ color: 'var(--c-accent)' }} className="text-xs font-black uppercase tracking-widest">{p.stats}</span>
                       <div className="flex gap-2">
                          {p.tags.map(t => <span key={t} className="text-[9px] uppercase tracking-widest px-2 py-1 border rounded-full opacity-30">{t}</span>)}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'stories': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Příběhy" accent="nových začátků" subtitle="Lidský dopad" />
          <div className="max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-2 gap-8">
            {STORIES.map((s, i) => (
              <div key={i} className="glass-panel p-12 rounded-[4rem] relative group hover:-translate-y-2 transition-all">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_,idx) => <Star key={idx} size={14} fill="var(--c-accent)" style={{ color: 'var(--c-accent)' }} />)}
                  </div>
                  <span style={{ background: 'var(--c-acc-bg)', color: 'var(--c-accent)' }} className="text-[10px] font-black uppercase px-3 py-1 rounded-full border border-cyan-400/20">{s.pillar}</span>
                </div>
                <p className="text-2xl font-serif italic leading-relaxed mb-10 opacity-80">"{s.quote}"</p>
                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <p className="text-xl font-bold">{s.name}</p>
                    <p className="text-xs uppercase tracking-widest opacity-40">{s.age} let</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--c-accent)' }}>Výsledek</p>
                    <p className="font-medium opacity-60">{s.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'news': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Aktuality" accent="& Novinky" subtitle="Co je nového" />
          <div className="max-w-7xl mx-auto px-6 pb-32 grid lg:grid-cols-3 gap-8">
            {NEWS.map(n => (
              <div key={n.id} className="glass-panel p-10 rounded-[3rem] space-y-6 group cursor-pointer hover:bg-cyan-500/5 transition-all flex flex-col">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span>{n.date}</span>
                  <span style={{ color: 'var(--c-accent)' }}>{n.tag}</span>
                </div>
                <h3 className="text-2xl font-bold leading-tight group-hover:text-cyan-400 transition-colors flex-1">{n.title}</h3>
                <p style={{ color: 'var(--c-mid)' }} className="text-sm font-light leading-relaxed">{n.excerpt}</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] pt-6 border-t border-white/5" style={{ color: 'var(--c-accent)' }}>Číst dál <ArrowRight size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      );
      case 'projects': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Portfolio" accent="& Vizionář" subtitle="David Kozák Studio" />
          <div className="max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-6">
            {KOZAK_PROJECTS.map(p => (
              <a key={p.name} href={p.url} target="_blank" className="glass-panel p-8 rounded-[2.5rem] group hover:bg-cyan-500/5 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div style={{ background: 'var(--c-acc-bg)', color: 'var(--c-accent)' }} className="p-4 rounded-2xl group-hover:scale-110 transition-transform">{p.icon}</div>
                  <ExternalLink className="opacity-20 group-hover:opacity-100 transition-opacity" size={18} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2 leading-none group-hover:text-cyan-400 transition-colors">{p.name}</h3>
                <p style={{ color: 'var(--c-muted)' }} className="text-sm font-light flex-1">{p.desc}</p>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                   Navštívit web <ArrowRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      );
      case 'contacts': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Spojte se" accent="s námi" subtitle="Kontakt" />
          <div className="max-w-7xl mx-auto px-6 pb-32 grid lg:grid-cols-2 gap-20">
             <div className="space-y-6">
                {[
                  { icon: <Phone size={24} />, label: "Telefon", val: "705 217 251" },
                  { icon: <Mail size={24} />, label: "E-mail", val: "kozak@d-international.eu" },
                  { icon: <Globe size={24} />, label: "Web", val: "international.david-kozak.com" }
                ].map(c => (
                  <div key={c.label} className="glass-panel p-10 rounded-3xl flex items-center gap-8 group">
                    <div style={{ background: 'var(--c-acc-bg)', color: 'var(--c-accent)' }} className="p-5 rounded-2xl group-hover:rotate-12 transition-transform">{c.icon}</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-1">{c.label}</p>
                      <p className="text-2xl font-black">{c.val}</p>
                    </div>
                  </div>
                ))}
             </div>
             <div className="glass-panel p-12 rounded-[4rem] relative overflow-hidden">
                <h3 className="text-3xl font-serif italic mb-8">Napište nám zprávu</h3>
                <form className="space-y-4">
                   <input type="text" placeholder="Vaše jméno" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-400" />
                   <input type="email" placeholder="Váš e-mail" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-400" />
                   <textarea placeholder="S čím vám můžeme pomoci?" className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-400 resize-none" />
                   <button type="button" className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-[1.01]" style={{ background: 'var(--c-accent)', color: '#000' }}>Odeslat zprávu</button>
                </form>
             </div>
          </div>
        </div>
      );
      default: return (
        <div className="animate-in fade-in duration-700">
          <header className="relative min-h-screen flex items-center justify-center overflow-hidden rounded-b-[45%] md:rounded-b-[65%] bg-[#051111] z-10 shadow-2xl">
            <div className="absolute inset-0 opacity-40">
              <svg viewBox="0 0 200 200" className="w-full h-full max-w-[900px] filter drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                 <path d="M100 180 Q100 140 100 100" stroke="#22d3ee" strokeWidth="2.5" fill="none" className="animate-in slide-in-from-bottom duration-1000" />
                 <path d="M100 130 Q140 110 170 80" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.4" />
                 <path d="M100 130 Q60 110 30 80" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.4" />
                 <circle cx="100" cy="80" r="40" fill="url(#cyanHero)" opacity="0.1" className="animate-pulse" />
                 <defs><radialGradient id="cyanHero"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="transparent"/></radialGradient></defs>
              </svg>
            </div>
            <div className="relative z-20 text-center space-y-6 px-6">
              <div style={{ color: 'var(--c-accent)' }} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">David Kozák International</div>
              <h1 className="text-8xl md:text-[14rem] font-serif font-black tracking-tighter leading-none text-white text-glow-cyan animate-pulse">REST<span className="italic opacity-30">||</span>ART</h1>
              <p className="text-white/60 font-light tracking-[0.6em] uppercase text-xs md:text-2xl mt-4">Integrace Společnosti</p>
            </div>
            <div className="absolute inset-0 bg-[#2D5A27]/40 mix-blend-multiply pointer-events-none"></div>
          </header>

          <section className="py-32 px-6">
             <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10 animate-in slide-in-from-left duration-1000">
                   <h2 className="text-6xl md:text-8xl font-serif uppercase leading-[0.9] tracking-tighter">Druhou šanci si <br /><span style={{ color: 'var(--c-accent)' }} className="italic">každý zaslouží.</span></h2>
                   <p className="text-2xl font-light opacity-60 leading-relaxed max-w-xl">Na nikoho se nezapomíná. Budujeme systém, který vrací lidi z okraje zpět do pevného středu fungující společnosti.</p>
                   <div className="flex flex-wrap gap-6 pt-6">
                      <button onClick={() => setCurrentPage('pillars')} className="px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-2xl" style={{ background: 'var(--c-accent)', color: '#000' }}>Naše pilíře</button>
                      <button onClick={() => setCurrentPage('projects')} className="glass-panel px-12 py-5 rounded-2xl font-bold transition-all hover:bg-white/5">Naše portfolia</button>
                   </div>
                </div>
                <div className="relative group lg:-mt-40">
                   <div className="relative rounded-[4rem] overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-1000 border-[20px] border-white/5 bg-white/5">
                      <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=1200" alt="Restart" className="w-full h-[650px] object-cover opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-transparent" />
                      <div className="absolute bottom-12 left-12 right-12 text-white italic text-3xl font-serif leading-tight">"Každý příběh má právo na pokračování."</div>
                   </div>
                </div>
             </div>
          </section>

          <section className="py-24 px-6 max-w-5xl mx-auto glass-panel p-16 rounded-[5rem] space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none animate-pulse"><Sparkles size={150} style={{ color: 'var(--c-accent)' }} /></div>
             <div className="space-y-2">
                <h3 className="text-5xl font-serif">✨ Restart s AI</h3>
                <p className="opacity-40 text-xl font-light">Analyzujte svůj příběh skrze naši inteligentní platformu.</p>
             </div>
             <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Popište svou situaci (např. 'Hledám práci po návratu z výkonu trestu...')" className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-8 text-xl font-light focus:border-cyan-400 outline-none resize-none transition-all placeholder:text-white/10" />
             <div className="flex gap-6">
                <button onClick={generateRestartPath} disabled={isLoading || !userInput.trim()} className="flex-1 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl disabled:opacity-30 flex items-center justify-center gap-3 transition-all hover:opacity-90" style={{ background: 'var(--c-accent)', color: '#000' }}>
                   {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18}/>} Analyzovat situaci
                </button>
                {aiResponse && <button onClick={speakPath} disabled={isSpeaking} className="glass-panel px-10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all">{isSpeaking ? <Loader2 className="animate-spin" /> : <Volume2 size={24}/>}</button>}
             </div>
             {aiResponse && <div className="mt-12 p-10 rounded-[3rem] text-xl font-light leading-relaxed animate-in slide-in-from-bottom-8 duration-700 bg-cyan-500/5 border border-cyan-400/20">{aiResponse}</div>}
          </section>

          <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
             <StatCard value="850+" label="Restrukturalizovaných životů" icon={<Users size={32}/>} />
             <StatCard value="12" label="Dílen programu REWORK" icon={<Briefcase size={32}/>} />
             <StatCard value="92%" label="Udržitelnost integrační změny" icon={<TrendingUp size={32}/>} />
          </section>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${isDark ? '' : 'lm'}`} style={{ background: 'var(--c-bg)', color: 'var(--c-text)', transition: 'background 0.4s, color 0.4s' }}>
      <style>{THEME_CSS}</style>
      
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 h-[3px] z-[200] transition-all duration-75" style={{ width: `${scrollProgress}%`, background: 'var(--c-accent)', boxShadow: '0 0 15px var(--c-accent)' }} />

      {/* Auras */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] animate-pulse" style={{ background: 'var(--c-aura1)' }} />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-bounce-slow" style={{ background: 'var(--c-aura2)' }} />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 px-6 py-6 ${scrolled ? 'glass-panel py-3 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="text-3xl font-serif font-black tracking-tighter flex items-center text-glow-cyan group active:scale-95 transition-transform">
             REST<span className="opacity-30 italic mx-0.5" style={{ color: 'var(--c-accent)' }}>||</span>ART
             <span className="ml-3 text-[10px] font-sans font-black tracking-[0.4em] uppercase hidden sm:block opacity-40">Integrace</span>
          </button>
          
          <div className="flex items-center gap-6">
             <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl glass-panel text-cyan-400 hover:scale-110 transition-all">{isDark ? <Sun size={20}/> : <Moon size={20}/>}</button>
             <button onClick={() => setIsMenuOpen(true)} className={`p-4 rounded-2xl transition-all glass-panel group`}>
                <Menu size={24} style={{ color: 'var(--c-accent)' }} className="group-hover:rotate-180 transition-transform duration-500" />
             </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu */}
      <div className={`fixed inset-0 z-[120] transition-all duration-700 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
         <div className={`absolute top-0 right-0 h-full w-full md:w-[45%] glass-panel bg-[#051111]/95 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-12 flex flex-col items-center md:items-start justify-center h-full space-y-8 relative">
               <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 p-4 hover:scale-110 transition-transform active:scale-90" style={{ color: 'var(--c-accent)' }}><X size={40}/></button>
               <div className="flex flex-col space-y-4 w-full">
                  {NAV_ITEMS.map(item => (
                    <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`group flex items-center gap-8 text-4xl md:text-6xl font-serif uppercase text-left transition-all hover:translate-x-4 ${currentPage === item.id ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}>
                       <span className="text-sm font-black opacity-20 group-hover:opacity-100" style={{ color: 'var(--c-accent)' }}>{item.num}</span>
                       {item.label}
                    </button>
                  ))}
               </div>
               <div className="pt-20 flex gap-10 border-t border-white/5 w-full">
                  <Instagram className="opacity-30 hover:opacity-100 cursor-pointer transition-all" />
                  <Facebook className="opacity-30 hover:opacity-100 cursor-pointer transition-all" />
                  <Globe className="opacity-30 hover:opacity-100 cursor-pointer transition-all" />
               </div>
            </div>
         </div>
      </div>

      <main className="relative z-10">{renderPage()}</main>

      {/* Magic Image Section */}
      <section className="relative w-full h-[600px] overflow-hidden flex items-center justify-center my-20 group">
         <div className="absolute inset-0 z-0">
            <img src="Gemini_Generated_Image_cbpno7cbpno7cbpn.jpg" alt="Vizuál" className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[10s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-[#051111]" />
            <div className="absolute inset-0 bg-[#051111]/40" />
         </div>
         <div className="relative z-10 text-center px-6 max-w-4xl space-y-10">
            <Quote size={80} className="mx-auto animate-pulse opacity-20" style={{ color: 'var(--c-accent)' }} />
            <h3 className="text-4xl md:text-7xl font-serif italic text-white drop-shadow-2xl leading-tight">"Na nikoho se nezapomíná. <br /><span style={{ color: 'var(--c-accent)' }}>Druhou šanci si zaslouží každý.</span>"</h3>
            <div className="h-1 w-32 bg-cyan-400/30 mx-auto rounded-full" />
         </div>
      </section>

      {/* Footer */}
      <footer className="py-24 relative z-10 px-6">
         <div className="max-w-7xl mx-auto glass-panel p-16 md:p-24 rounded-[5rem] grid lg:grid-cols-3 gap-20 bg-[#0D2F2F]/40 border-cyan-400/5">
            <div className="space-y-8">
               <div className="text-5xl font-black tracking-tighter text-glow-cyan leading-none font-serif">REST<span className="opacity-20 mx-1">||</span>ART</div>
               <p style={{ color: 'var(--c-mid)' }} className="text-sm font-light leading-relaxed">Stavíme mosty pro ty, kteří ztratili cestu. Pod záštitou David Kozák International budujeme udržitelný model sociální integrace.</p>
            </div>
            <div className="grid grid-cols-2 gap-12">
               <div className="space-y-6">
                  <p className="text-[10px] uppercase font-black tracking-[0.4em]" style={{ color: 'var(--c-accent)' }}>Navigace</p>
                  <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest opacity-50">
                     <button onClick={() => setCurrentPage('home')} className="hover:text-cyan-400 text-left transition-colors">Domů</button>
                     <button onClick={() => setCurrentPage('about')} className="hover:text-cyan-400 text-left transition-colors">O nás</button>
                     <button onClick={() => setCurrentPage('pillars')} className="hover:text-cyan-400 text-left transition-colors">Pilíře</button>
                     <button onClick={() => setCurrentPage('projects')} className="hover:text-cyan-400 text-left transition-colors">Projekty</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <p className="text-[10px] uppercase font-black tracking-[0.4em]" style={{ color: 'var(--c-accent)' }}>Odkazy</p>
                  <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest opacity-50">
                     <a href="https://davidkozak.social" target="_blank" className="hover:text-cyan-400 transition-colors">Portfolio</a>
                     <a href="https://international.david-kozak.com" target="_blank" className="hover:text-cyan-400 transition-colors">Firma</a>
                     <a href="https://jailbreak.cz" target="_blank" className="hover:text-cyan-400 transition-colors">Jailbreak</a>
                  </div>
               </div>
            </div>
            <div className="space-y-10 flex flex-col justify-between">
               <div className="space-y-4">
                  <p className="text-[10px] uppercase font-black tracking-[0.4em]" style={{ color: 'var(--c-accent)' }}>Sledujte nás</p>
                  <div className="flex gap-10 opacity-30">
                     <Instagram className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
                     <Facebook className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
                     <Globe className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
                  </div>
               </div>
               <p className="text-[10px] opacity-20 uppercase font-black tracking-[0.5em]">Design by DK Studio © 2026</p>
            </div>
         </div>
      </footer>

      {/* Scroll Top */}
      {scrolled && <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="fixed bottom-10 right-10 p-5 glass-panel rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-[200] animate-in fade-in" style={{ color: 'var(--c-accent)' }}><ChevronUp size={24}/></button>}
    </div>
  );
};

export default App;