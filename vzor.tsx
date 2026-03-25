import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Heart, Briefcase, DoorOpen, Home as HomeIcon,
  ShieldCheck, Instagram, Facebook, Globe, Users,
  Quote, Sparkles, Send, Volume2,
  Phone, Mail, ExternalLink, MessageSquare,
  Rocket, Paintbrush, Monitor, Key, Landmark, FileText, Film, Smartphone,
  Star, Calendar, Award, TrendingUp, Clock, Eye,
  BookOpen, Newspaper, Target, ArrowRight, MapPin, ChevronUp, Loader2
} from 'lucide-react';

// ═══════════════════════════════════════════════════
// KONFIGURACE A DATA
// ═══════════════════════════════════════════════════

const apiKey = ""; // API klíč prostředí doplní automaticky

const NAV_ITEMS = [
  { id: 'home',     label: 'Domů',    num: '01' },
  { id: 'about',    label: 'O nás',   num: '02' },
  { id: 'pillars',  label: 'Pilíře',  num: '03' },
  { id: 'stories',  label: 'Příběhy', num: '04' },
  { id: 'news',     label: 'Novinky', num: '05' },
  { id: 'projects', label: 'Projekty',num: '06' },
  { id: 'contacts', label: 'Kontakt', num: '07' },
];

const PILLARS = [
  {
    id: 'jailbreak', title: 'JAILBREAK',
    description: 'Pomoc lidem ve výkonu trestu a po něm.',
    fullDesc: 'Poskytujeme mentoring a přípravu na svobodný život již během VTOS. Snižujeme recidivu skrze reálnou adaptaci.',
    icon: <DoorOpen size={28}/>, stats: '340+ podpořených',
    tags: ['Vězení', 'Adaptace', 'Mentoring'],
  },
  {
    id: 'rework', title: 'REWORK',
    description: 'Integrace handicapovaných a nezaměstnaných skrze práci.',
    fullDesc: 'Budujeme chráněné dílny a spolupracujeme s úřady na rekvalifikaci lidí, kteří mají chuť pracovat, ale měli smůlu.',
    icon: <Briefcase size={28}/>, stats: '180+ zaměstnaných',
    tags: ['Práce', 'Rekvalifikace', 'Dílny'],
  },
  {
    id: 'bodzlomu', title: 'BOD ZLOMU',
    description: 'Provázení dětí z dětských domovů do dospělosti.',
    fullDesc: 'Dobrovolníci jako velcí bratři a sestry pomáhají dětem v kritickém bodě odchodu z ústavní péče.',
    icon: <Heart size={28}/>, stats: '95+ dětí',
    tags: ['Děti', 'Dobrovolníci', 'Budoucnost'],
  },
  {
    id: 'streetwise', title: 'STREETWISE',
    description: 'První kontakt a pomoc lidem na ulici.',
    fullDesc: 'Zajišťujeme základní potřeby, hygienu a jídlo, abychom skrze důvěru našli příčinu situace a začali ji řešit.',
    icon: <HomeIcon size={28}/>, stats: '520+ kontaktů',
    tags: ['Ulice', 'Důvěra', 'Pomoc'],
  },
  {
    id: 'stabilizace', title: 'STABILIZACE',
    description: 'Udržení životní změny a plná integrace.',
    fullDesc: 'Závěrečná fáze, která zajišťuje, že dosažená změna je udržitelná a člověk je plnohodnotnou součástí společnosti.',
    icon: <ShieldCheck size={28}/>, stats: '78% úspěšnost',
    tags: ['Stabilita', 'Udržitelnost', 'Růst'],
  },
];

const STORIES = [
  { name: 'Martin K.', pillar: 'JAILBREAK', quote: 'REST||ART mi dal práci a hlavně víru v sebe. Dnes vedu normální život.', outcome: 'Pracuje jako svářeč' },
  { name: 'Tereza M.', pillar: 'BOD ZLOMU', quote: 'Tady mi pomohli najít první bydlení i odvahu studovat vysokou školu.', outcome: 'Studuje VŠ, pracuje' },
  { name: 'Jakub R.', pillar: 'STREETWISE', quote: 'Po dvou letech na ulici jsem konečně našel cestu zpět. Díky za trpělivost.', outcome: 'Azylové bydlení, v programu REWORK' },
];

const NEWS = [
  { id: 1, date: '12. 3. 2026', title: 'JAILBREAK rozšiřuje program do nových regionů', excerpt: 'Vstupujeme do spolupráce s dalšími věznicemi. Cílem je podpořit 200 dalších klientů.', tag: 'Aktuality' },
  { id: 2, date: '5. 3. 2026', title: 'Ocenění za společenskou odpovědnost', excerpt: 'Naše úsilí v integraci získalo uznání na celostátní úrovni v kategorii Sociální inovace.', tag: 'Ocenění' },
];

const KOZAK_PROJECTS = [
  { name: "Online program pro správu firem", url: "https://studio.david-kozak.com", desc: "Nástroj pro řízení projektů, týmu a financí.", icon: <Rocket /> },
  { name: "Online generátor AI obrázků", url: "https://imaginator.david-kozak.com", desc: "Tvořte unikátní digitální umění s pomocí AI.", icon: <Paintbrush /> },
  { name: "Web-prezentační portfolio", url: "https://dk.david-kozak.com", desc: "Galerie autorských webových designů.", icon: <Monitor /> },
  { name: "Osobní rozvoj a mentoring", url: "https://zaosobni.david-kozak.com", desc: "Cesta k sebepoznání a osobnímu růstu.", icon: <Key /> },
  { name: "Architekt pravdy", url: "https://sites.google.com/davidkozakinternational.org/dkisro/domů", desc: "Filozofie a zkoumání principů reality.", icon: <Landmark /> },
  { name: "Online životopis", url: "https://zivotopis.david-kozak.com", desc: "Přehled dovedností a zkušeností Davida Kozáka.", icon: <FileText /> },
  { name: "Animátorský web", url: "https://new.david-kozak.com", desc: "Prezentace motion design projektů.", icon: <Film /> },
  { name: "Animátorský web (Silver)", url: "https://silver.david-kozak.com", desc: "High-end digitální animace a efekty.", icon: <Film /> },
  { name: "Aplikace firemní", url: "https://appka.david-kozak.com", desc: "Vlastní aplikace pro komunikaci a data.", icon: <Smartphone /> }
];

// ═══════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════

const PageHeader = ({ title, accent, subtitle }) => (
  <div className="pt-40 pb-16 px-6">
    <div className="max-w-7xl mx-auto">
      <span className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-widest uppercase bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-400/20 mb-8">
        {subtitle}
      </span>
      <h2 className="text-5xl md:text-8xl font-serif text-white uppercase text-glow-cyan leading-tight">
        {title}<br/>
        <span className="text-cyan-400 italic font-light">{accent}</span>
      </h2>
      <div className="mt-8 h-px w-full bg-gradient-to-r from-cyan-400/50 via-cyan-400/10 to-transparent" />
    </div>
  </div>
);

const StatCard = ({ value, label, icon }) => (
  <div className="glass-panel p-8 rounded-3xl text-center group hover:-translate-y-1 transition-all duration-500">
    <div className="text-cyan-400 mb-4 flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>
    <div className="text-5xl font-black text-glow-cyan mb-2 tracking-tighter">{value}</div>
    <div className="text-white/35 text-xs uppercase tracking-widest font-bold">{label}</div>
  </div>
);

// ═══════════════════════════════════════════════════
// HLAVNÍ APLIKACE
// ═══════════════════════════════════════════════════

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Gemini AI State
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
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

  // --- Gemini API Logic ---
  const fetchWithRetry = async (url, options, maxRetries = 5) => {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return await response.json();
        if (response.status !== 429 && response.status < 500) break;
      } catch (e) { if (i === maxRetries - 1) throw e; }
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
    throw new Error("Chyba AI spojení.");
  };

  const generateRestartPath = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setAiResponse("");
    setError("");
    const systemPrompt = "Jsi empatický asistent projektu REST||ART Integrace. Navrhni plán restartu pomocí pilířů: JAILBREAK, REWORK, BOD ZLOMU, STREETWISE a STABILIZACE. Piš česky a velmi povzbudivě.";
    try {
      const data = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "AI neodpovídá.");
    } catch (err) { setError("Spojení selhalo. Zkuste to znovu."); } finally { setIsLoading(false); }
  };

  const pcmToWav = (base64Pcm, sampleRate) => {
    const pcmBuffer = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
    writeString(0, 'RIFF'); view.setUint32(4, 32 + pcmBuffer.length, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
    view.setUint32(40, pcmBuffer.length, true);
    return new Blob([wavHeader, pcmBuffer], { type: 'audio/wav' });
  };

  const speakPath = async () => {
    if (!aiResponse || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Řekni vřele česky: ${aiResponse}` }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } } }
        })
      });
      const result = await response.json();
      const pcmData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (pcmData) {
        const audio = new Audio(URL.createObjectURL(pcmToWav(pcmData, 24000)));
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (err) { setIsSpeaking(false); }
  };

  // ═══════════════════════════════════════════════════
  // PAGE RENDERING
  // ═══════════════════════════════════════════════════

  const renderContent = () => {
    switch (currentPage) {
      case 'about': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Naše" accent="Mise" subtitle="O Projektu" />
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 pb-32">
            <div className="space-y-8">
              <h3 className="text-3xl font-serif text-white">Věříme v systémovou změnu.</h3>
              <p className="text-white/60 text-xl font-light leading-relaxed">
                REST||ART Integrace není jen charita. Je to ucelený model restrukturalizace osudů. 
                Pod záštitou David Kozák International budujeme svět, kde se na nikoho nezapomíná.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <Target className="text-cyan-400 mb-4" />
                  <p className="font-bold mb-2 uppercase tracking-widest text-xs">Vize</p>
                  <p className="text-white/40 text-sm">Vytvořit společnost, která umí integrovat lidi z okraje zpět do středu dění.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <Heart className="text-cyan-400 mb-4" />
                  <p className="font-bold mb-2 uppercase tracking-widest text-xs">Přístup</p>
                  <p className="text-white/40 text-sm">Pracujeme s příběhem, emocí a reálnou prací. Nejsme jen čísla v tabulce.</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-12 rounded-[4rem] flex flex-col justify-center text-center space-y-8 bg-cyan-500/5">
              <Quote className="text-cyan-400 mx-auto opacity-30" size={60} />
              <p className="text-3xl md:text-5xl font-serif italic text-white drop-shadow-lg leading-tight">
                "Každý si zaslouží druhou šanci. Skutečná síla společnosti se pozná podle toho, jak se stará o ty nejzranitelnější."
              </p>
              <p className="text-cyan-400 font-black tracking-widest uppercase text-xs">— David Kozák</p>
            </div>
          </div>
        </div>
      );

      case 'pillars': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Pět fází" accent="Integrace" subtitle="Naše Práce" />
          <div className="max-w-7xl mx-auto px-6 space-y-8 pb-32">
            {PILLARS.map((p, idx) => (
              <div key={p.id} className="glass-panel p-10 md:p-16 rounded-[4rem] grid lg:grid-cols-3 gap-12 group hover:bg-cyan-500/5 transition-all duration-700">
                <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                  <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                    {p.icon}
                  </div>
                  <h3 className="text-4xl font-black text-glow-cyan tracking-tighter mb-2">{p.title}</h3>
                  <div className="flex gap-2 mb-4 flex-wrap justify-center lg:justify-start">
                    {p.tags.map(t => <span key={t} className="text-[10px] border border-white/10 px-3 py-1 rounded-full text-white/30 uppercase">{t}</span>)}
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
                  <p className="text-2xl text-white font-light leading-relaxed">{p.fullDesc}</p>
                  <div className="flex items-center gap-4 text-cyan-400/60 font-bold uppercase tracking-widest text-xs border-t border-white/5 pt-6">
                    <TrendingUp size={16}/> {p.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'stories': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Živé" accent="Příběhy" subtitle="Dopad" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            {STORIES.map((s, i) => (
              <div key={i} className="glass-panel p-12 rounded-[3.5rem] flex flex-col h-full hover:-translate-y-2 transition-all">
                <div className="flex gap-1 text-cyan-400 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xl italic text-white/80 mb-10 flex-grow font-light leading-relaxed">"{s.quote}"</p>
                <div className="pt-8 border-t border-white/5">
                  <p className="font-bold text-white text-lg">{s.name}</p>
                  <p className="text-cyan-400/60 text-xs font-black uppercase tracking-widest mt-1 mb-4">Program {s.pillar}</p>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <Award size={16} className="text-white/20"/>
                    <p className="text-white/40 text-[11px] font-medium leading-tight">{s.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'news': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Nové" accent="Zprávy" subtitle="Aktuality" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 pb-32">
            {NEWS.map(n => (
              <div key={n.id} className="glass-panel rounded-[3.5rem] overflow-hidden group">
                <div className="p-12 space-y-6">
                  <div className="flex justify-between items-center text-xs font-black tracking-widest text-white/30 uppercase">
                    <span className="flex items-center gap-2"><Calendar size={14}/> {n.date}</span>
                    <span className="text-cyan-400/60">{n.tag}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">{n.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light">{n.excerpt}</p>
                  <button className="flex items-center gap-3 text-cyan-400 text-xs font-black tracking-[0.2em] pt-4 group-hover:gap-5 transition-all uppercase">Číst dál <ArrowRight size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'projects': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Vizionář" accent="& Design" subtitle="DK Studio" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
            {KOZAK_PROJECTS.map(p => (
              <a key={p.name} href={p.url} target="_blank" className="glass-panel p-10 rounded-[3rem] group hover:bg-cyan-500/5 transition-all flex flex-col h-full border-white/5 hover:border-cyan-400/20">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-cyan-500/10 p-5 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform">{p.icon}</div>
                  <ExternalLink className="text-white/20 group-hover:text-cyan-400 transition-all" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{p.name}</h3>
                <p className="text-white/30 font-light text-sm flex-grow leading-relaxed">{p.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] text-cyan-400/40 uppercase font-black tracking-[0.2em]">Navštívit</span>
                   <ArrowRight size={16} className="text-cyan-400/20 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      );

      case 'contacts': return (
        <div className="animate-in fade-in duration-700">
          <PageHeader title="Kde nás" accent="Najdete" subtitle="Kontakt" />
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 pb-32">
            <div className="space-y-12">
              <div className="grid gap-6">
                <div className="glass-panel p-10 rounded-3xl flex items-center gap-8 group">
                  <div className="bg-cyan-500/10 p-6 rounded-2xl text-cyan-400 group-hover:rotate-12 transition-transform"><Phone size={32} /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 font-black">Telefonní linka</p>
                    <p className="text-3xl font-black text-white">705 217 251</p>
                  </div>
                </div>
                <div className="glass-panel p-10 rounded-3xl flex items-center gap-8 group">
                  <div className="bg-cyan-500/10 p-6 rounded-2xl text-cyan-400 group-hover:rotate-12 transition-transform"><Mail size={32} /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 font-black">E-mailová adresa</p>
                    <p className="text-2xl md:text-3xl font-black text-white">kozak@d-international.eu</p>
                  </div>
                </div>
                <a href="https://international.david-kozak.com" target="_blank" className="glass-panel p-10 rounded-3xl flex items-center gap-8 hover:bg-cyan-500/5 transition-all group">
                  <div className="bg-cyan-500/10 p-6 rounded-2xl text-cyan-400 group-hover:rotate-12 transition-transform"><Globe size={32} /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1 font-black">Firemní sídlo</p>
                    <p className="text-xl md:text-2xl font-bold text-white/80 leading-none">international.david-kozak.com</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="glass-panel p-12 md:p-16 rounded-[4rem] relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none"><MessageSquare size={200} /></div>
              <h3 className="text-3xl font-serif mb-12 italic text-white">Máte dotaz na tým Integrace?</h3>
              <form className="space-y-6 relative z-10">
                <input type="text" placeholder="Vaše jméno" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-cyan-400 outline-none transition-all placeholder:text-white/20 text-white" />
                <input type="email" placeholder="Váš e-mail" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-cyan-400 outline-none transition-all placeholder:text-white/20 text-white" />
                <textarea placeholder="Vaše zpráva..." className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-cyan-400 outline-none resize-none transition-all placeholder:text-white/20 text-white" />
                <button type="button" className="w-full bg-cyan-500 text-black py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all shadow-2xl flex items-center justify-center gap-3">
                  Odeslat zprávu <Send size={20}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      );

      default: return (
        <>
          {/* 1. ANIMATED HEAD (HERO) */}
          <header className="relative w-full h-screen flex items-center justify-center overflow-hidden rounded-b-[45%] md:rounded-b-[65%] shadow-[0_20px_50px_rgba(0,242,234,0.15)] bg-[#051111] z-10">
            {/* SVG STROM ŽIVOTA */}
            <div className="absolute inset-0 opacity-40 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full max-w-[850px] filter drop-shadow-[0_0_20px_rgba(0,242,234,0.4)]">
                <path d="M100 180 Q100 140 100 100" stroke="#00F2EA" strokeWidth="2.5" fill="none" className="animate-in slide-in-from-bottom duration-1000" />
                <path d="M100 130 Q130 110 160 90" stroke="#00F2EA" strokeWidth="1" fill="none" opacity="0.6" className="animate-in fade-in duration-1000 delay-500" />
                <path d="M100 130 Q70 110 40 90" stroke="#00F2EA" strokeWidth="1" fill="none" opacity="0.6" className="animate-in fade-in duration-1000 delay-700" />
                <circle cx="100" cy="80" r="45" fill="url(#cyanGrad)" opacity="0.1" className="animate-pulse" />
                <defs>
                  <radialGradient id="cyanGrad">
                    <stop offset="0%" stopColor="#00F2EA" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <div className="relative z-20 text-center space-y-6 px-6">
              <div className="inline-flex items-center gap-3 text-cyan-400 font-black text-[10px] tracking-[0.5em] uppercase bg-cyan-500/5 px-6 py-2 rounded-full border border-cyan-400/20 backdrop-blur-md mb-4">
                 David Kozák International
              </div>
              <h1 className="text-7xl md:text-[12rem] font-serif text-white font-black tracking-tighter leading-none text-glow-cyan animate-pulse">
                REST<span className="text-cyan-400/40 italic">||</span>ART
              </h1>
              <p className="text-cyan-300/50 font-light tracking-[0.6em] uppercase text-[10px] md:text-2xl mt-4">Integrace Společnosti</p>
            </div>
            <div className="absolute inset-0 bg-[#2D5A27]/40 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyan-400/30 animate-bounce">
              <ChevronUp size={40} className="rotate-180"/>
            </div>
          </header>

          {/* 2. CORE HERO SECTION */}
          <section className="relative py-32 md:py-48 px-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 animate-in slide-in-from-left duration-1000">
                <h2 className="text-6xl md:text-[7rem] font-serif text-white leading-[0.9] tracking-tighter uppercase">
                  Druhou šanci si <br /><span className="text-cyan-400 italic">každý zaslouží.</span>
                </h2>
                <p className="text-2xl text-white/50 leading-relaxed font-light max-w-xl">
                  Na nikoho se nezapomíná. Budujeme systém, který dává lidem z okraje společnosti 
                  možnost stát se opět pevnou součástí celku.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button onClick={() => setCurrentPage('pillars')} className="bg-cyan-500 text-black px-12 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all uppercase tracking-widest">Zjistit jak</button>
                  <button onClick={() => setCurrentPage('projects')} className="glass-panel text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">Naše portfolia</button>
                </div>
              </div>
              <div className="relative group lg:-mt-40">
                <div className="relative rounded-[4rem] overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-1000 border-[20px] border-white/5 bg-white/5">
                  <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" alt="Integrace" className="w-full h-[650px] object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-12 left-12 right-12 text-white italic text-3xl font-serif leading-tight drop-shadow-2xl">
                    "Každý příběh si zaslouží důstojné pokračování."
                  </div>
                </div>
                <div className="absolute -z-10 -bottom-10 -left-10 w-full h-full bg-cyan-400/5 rounded-[4rem] rotate-6 blur-3xl opacity-50"></div>
              </div>
            </div>
          </section>

          {/* 3. GEMINI AI ENGINE (RESTART TOOL) */}
          <section className="py-32 px-6">
            <div className="max-w-5xl mx-auto glass-panel p-12 md:p-20 rounded-[5rem] space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none animate-pulse"><Sparkles size={150} className="text-cyan-400" /></div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-6xl font-serif text-white flex items-center gap-4">✨ Restart s AI</h3>
                <p className="text-white/40 text-xl font-light">Analyzujte svůj příběh pomocí naší inteligentní platformy.</p>
              </div>
              <textarea 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                placeholder="Popište svou situaci (např. 'Hledám práci po návratu z výkonu trestu, mám zkušenost s truhlařinou...')" 
                className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-8 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-white/10 resize-none text-xl font-light" 
              />
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={generateRestartPath} 
                  disabled={isLoading || !userInput.trim()} 
                  className="flex-1 bg-cyan-500 text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-400 transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>}
                  {isLoading ? "Generuji plán..." : "✨ Analyzovat situaci"}
                </button>
                {aiResponse && (
                  <button 
                    onClick={speakPath} 
                    disabled={isSpeaking} 
                    className="bg-white/10 px-10 py-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white"
                  >
                    {isSpeaking ? <Loader2 className="animate-spin"/> : <Volume2 size={24}/>}
                  </button>
                )}
              </div>
              {aiResponse && (
                <div className="mt-12 p-10 bg-cyan-500/5 border border-cyan-400/20 rounded-[3rem] text-white/80 font-light text-xl leading-relaxed animate-in slide-in-from-bottom-8 duration-700">
                  {aiResponse}
                </div>
              )}
              {error && <p className="text-red-400 text-center font-bold tracking-widest text-xs uppercase">{error}</p>}
            </div>
          </section>

          {/* 4. STATS ROW */}
          <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <StatCard value="850+" label="Restaurátovaných osudů" icon={<Users size={32}/>} />
            <StatCard value="12" label="Chráněných dílen REWORK" icon={<Briefcase size={32}/>} />
            <StatCard value="92%" label="Udržitelnost změn" icon={<TrendingUp size={32}/>} />
          </section>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#051111] text-white/90 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 h-1 bg-cyan-500 z-[110] transition-all duration-300" style={{ width: `${scrollProgress}%`, boxShadow: '0 0 15px #00F2EA' }} />

      {/* BACKGROUND AURA */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-bounce-slow"></div>
      </div>

      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-40px); } }
        .animate-bounce-slow { animation: bounce-slow 12s ease-in-out infinite; }
        .glass-panel { background: rgba(255, 255, 255, 0.025); backdrop-filter: blur(20px); border: 1px solid rgba(0, 242, 234, 0.08); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5); }
        .text-glow-cyan { text-shadow: 0 0 15px rgba(0, 242, 234, 0.5), 0 0 30px rgba(0, 242, 234, 0.2); }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 px-6 py-6 ${scrolled ? 'glass-panel py-3 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => setCurrentPage('home')} className="text-3xl font-black tracking-tighter flex items-center text-glow-cyan cursor-pointer group active:scale-95 transition-transform">
            REST<span className="text-cyan-400 mx-1 group-hover:scale-110 transition-transform">||</span>ART
            <span className="ml-3 text-[10px] font-black tracking-[0.4em] uppercase hidden sm:block text-white/40 group-hover:text-cyan-400/60 transition-colors">Integrace</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block bg-cyan-500/20 border border-cyan-400/40 text-cyan-100 px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest hover:bg-cyan-400 hover:text-black transition-all shadow-lg active:scale-95">ZAPOJIT SE</button>
            <button 
              className={`p-4 rounded-2xl transition-all active:scale-90 ${scrolled ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'}`} 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="text-cyan-400" size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* SLIDE-OUT MENU (RIGHT HALF) */}
      <div className={`fixed inset-0 z-[120] transition-opacity duration-700 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full md:w-1/2 glass-panel bg-[#051111]/95 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-12 flex flex-col items-center md:items-start justify-center h-full space-y-10 relative">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-cyan-400 p-4 hover:scale-110 transition-transform active:scale-90"><X size={36} /></button>
            
            <div className="flex flex-col space-y-4 w-full">
              {NAV_ITEMS.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)} 
                  className={`group flex items-center gap-8 text-4xl md:text-6xl font-serif text-white uppercase hover:text-cyan-400 transition-all text-left ${currentPage === item.id ? 'text-cyan-400' : ''}`}
                >
                  <span className="text-sm md:text-lg text-cyan-400 font-black tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity">{item.num}</span>
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="pt-20 flex gap-10 border-t border-white/5 w-full justify-center md:justify-start">
              <Instagram className="text-white/20 hover:text-cyan-400 cursor-pointer transition-all hover:scale-110" size={28} />
              <Facebook className="text-white/20 hover:text-cyan-400 cursor-pointer transition-all hover:scale-110" size={28} />
              <Globe className="text-white/20 hover:text-cyan-400 cursor-pointer transition-all hover:scale-110" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* RENDER CURRENT PAGE */}
      <main className="relative z-10">
        {renderContent()}
      </main>

      {/* UNIVERSAL MAGIC IMAGE SECTION (BEFORE FOOTER) */}
      <section className="relative w-full h-[600px] overflow-hidden flex items-center justify-center mb-20 group">
        <div className="absolute inset-0 z-0">
          <img src="Gemini_Generated_Image_cbpno7cbpno7cbpn.jpg" alt="Vizuál" className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[10s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-[#051111] opacity-100" />
          <div className="absolute inset-0 bg-[#051111]/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl space-y-10">
          <Quote size={80} className="text-cyan-400/20 mx-auto animate-pulse" />
          <h3 className="text-4xl md:text-7xl font-serif italic text-white drop-shadow-2xl leading-tight">
            "Na nikoho se nezapomíná. <br />
            <span className="text-cyan-400">Druhou šanci si zaslouží každý."</span>
          </h3>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 relative z-10 px-6">
        <div className="max-w-7xl mx-auto glass-panel p-16 md:p-24 rounded-[5rem] grid lg:grid-cols-3 gap-20 bg-[#0D2F2F]/40 border-cyan-400/5">
          <div className="space-y-8">
            <div className="text-5xl font-black tracking-tighter text-glow-cyan leading-none">REST<span className="text-white/20 mx-1">||</span>ART</div>
            <p className="text-sm text-white/30 font-light leading-relaxed">
              Změna začíná u nás. Stavíme mosty pro ty, kteří ztratili cestu. Pod záštitou David Kozák International.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.4em]">Navigace</p>
              <div className="flex flex-col gap-4 text-sm font-bold text-white/50">
                <button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors text-left uppercase tracking-widest">Domů</button>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors text-left uppercase tracking-widest">O nás</button>
                <button onClick={() => setCurrentPage('pillars')} className="hover:text-white transition-colors text-left uppercase tracking-widest">Pilíře</button>
                <button onClick={() => setCurrentPage('projects')} className="hover:text-white transition-colors text-left uppercase tracking-widest">Projekty</button>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.4em]">Odkazy</p>
              <div className="flex flex-col gap-4 text-sm font-bold text-white/50">
                <a href="https://davidkozak.social" target="_blank" className="hover:text-white transition-colors uppercase tracking-widest">Portfolio</a>
                <a href="https://jailbreak.cz" target="_blank" className="hover:text-white transition-colors uppercase tracking-widest">Jailbreak</a>
                <a href="https://bodzlomu.cz" target="_blank" className="hover:text-white transition-colors uppercase tracking-widest">Bod Zlomu</a>
              </div>
            </div>
          </div>
          <div className="space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.4em]">Sledujte nás</p>
              <div className="flex gap-10 text-cyan-400/50">
                <Instagram className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
                <Facebook className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
                <Globe className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
              </div>
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Design by DK Studio © 2026</p>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      {scrolled && (
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="fixed bottom-10 right-10 p-5 glass-panel text-cyan-400 rounded-full shadow-2xl hover:bg-cyan-500/20 active:scale-90 transition-all z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <ChevronUp size={24}/>
        </button>
      )}
    </div>
  );
};

export default App;