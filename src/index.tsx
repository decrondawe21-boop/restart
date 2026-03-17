import React, { useState, useEffect } from 'react';
import './index.css';
import { 
  Menu, X, ArrowRight, Heart, Briefcase, DoorOpen, Home, 
  ShieldCheck, Leaf, Instagram, Facebook, Globe, Users, 
  ChevronRight, Quote, Sparkles, Send, Loader2, Volume2,
  MapPin, Phone, Mail, ExternalLink, MessageSquare, LayoutGrid,
  Rocket, Paintbrush, Monitor, Key, Landmark, FileText, Film, Smartphone
} from 'lucide-react';

const apiKey = ""; // Klíč poskytne prostředí

interface Project {
  name: string;
  url: string;
  desc: string;
  icon: React.ReactElement;
}

interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'projects' | 'contacts'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Gemini AI state
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll na začátek při změně stránky
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [currentPage]);

  // --- Gemini API Logic ---
  const fetchWithRetry = async (url: string, fetchOptions: RequestInit, maxRetries = 5) => {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, fetchOptions);
        if (response.ok) return await response.json();
        if (response.status !== 429 && response.status < 500) break;
      } catch (e) { if (i === maxRetries - 1) throw e; }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
    throw new Error("Chyba spojení s AI.");
  };

  const generateRestartPath = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setAiResponse("");
    setError("");
    const systemPrompt = "Jsi empatický asistent projektu REST||ART Integrace. Navrhni plán restartu pomocí pilířů: JAILBREAK, REWORK, BOD ZLOMU, STREETWISE a STABILIZACE. Piš česky a povzbudivě.";
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
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Zkuste to znovu.");
    } catch (err) { setError("Spojení selhalo."); } finally { setIsLoading(false); }
  };

  const pcmToWav = (base64Pcm: string, sampleRate: number) => {
    const pcmBuffer = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (offset: number, str: string) => { 
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
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
          contents: [{ parts: [{ text: `Řekni hřejivě česky: ${aiResponse}` }] }],
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

  // Pillars - Integrated (no external links for Jailbreak/Bod Zlomu as they are here)
  const pillars: Pillar[] = [
    { id: 'jailbreak', title: 'JAILBREAK', description: 'Pomoc lidem ve výkonu trestu a po něm.', icon: <DoorOpen />, color: 'cyan' },
    { id: 'rework', title: 'REWORK', description: 'Integrace handicapovaných a nezaměstnaných skrze práci.', icon: <Briefcase />, color: 'teal' },
    { id: 'bodzlomu', title: 'BOD ZLOMU', description: 'Provázení dětí z dětských domovů do dospělosti.', icon: <Heart />, color: 'emerald' },
    { id: 'streetwise', title: 'STREETWISE', description: 'První kontakt a pomoc lidem na ulici.', icon: <Home />, color: 'cyan' },
    { id: 'stabilizace', title: 'STABILIZACE', description: 'Udržení životní změny a plná integrace.', icon: <ShieldCheck />, color: 'teal' }
  ];

  // Projects data from the provided image
  const kozakProjects: Project[] = [
    { name: "Online program pro správu firem", url: "https://studio.david-kozak.com", desc: "Komplexní nástroj pro řízení projektů, týmu a financí.", icon: <Rocket /> },
    { name: "Online generátor AI obrázků", url: "https://imaginator.david-kozak.com", desc: "Tvořte unikátní digitální umění s pomocí AI.", icon: <Paintbrush /> },
    { name: "Web-prezentační portfolio", url: "https://dk.david-kozak.com", desc: "Galerie autorských webových designů.", icon: <Monitor /> },
    { name: "Osobní rozvoj a mentoring", url: "https://zaosobni.david-kozak.com", desc: "Cesta k sebepoznání a osobnímu růstu.", icon: <Key /> },
    { name: "Architekt pravdy", url: "https://sites.google.com/davidkozakinternational.org/dkisro/domů", desc: "Zkoumání hlubokých pravd a principů reality.", icon: <Landmark /> },
    { name: "Online životopis", url: "https://zivotopis.david-kozak.com", desc: "Přehled vzdělání a zkušeností Davida Kozáka.", icon: <FileText /> },
    { name: "Animátorský web", url: "https://new.david-kozak.com", desc: "Prezentace animací a motion design projektů.", icon: <Film /> },
    { name: "Animátorský web (Silver)", url: "https://silver.david-kozak.com", desc: "Zaměřeno na high-end digitální animace.", icon: <Film /> },
    { name: "Aplikace firemní", url: "https://appka.david-kozak.com", desc: "Vlastní firemní aplikace pro mobilní zařízení.", icon: <Smartphone /> }
  ];

  const renderContent = () => {
    switch(currentPage) {
      case 'projects':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-cyan-400/10 pb-16">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    Ecosystem David Kozák
                  </div>
                  <h2 className="text-6xl md:text-8xl text-white uppercase text-glow-cyan leading-tight">Vizionář <br /><span className="text-cyan-400 italic font-serif">& Design</span></h2>
                </div>
                <a href="https://davidkozak.social" target="_blank" className="group bg-white text-black px-10 py-5 rounded-2xl flex items-center gap-3 hover:bg-cyan-400 transition-all text-xs font-black tracking-widest uppercase shadow-xl shadow-cyan-500/10">
                  Portfolio Majitele <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kozakProjects.map((p, idx) => (
                  <a key={p.name} href={p.url} target="_blank" className="glass-panel p-10 rounded-[3.5rem] group hover:-translate-y-3 transition-all duration-500 flex flex-col h-full border-white/5 hover:border-cyan-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                        {React.cloneElement(p.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-2">Project 0{idx + 1}</span>
                        <ExternalLink className="text-white/20 group-hover:text-cyan-400 transition-all" size={20} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-cyan-400 transition-colors relative z-10">{p.name}</h3>
                    <p className="text-white/40 font-light text-base flex-grow leading-relaxed relative z-10 group-hover:text-white/60 transition-colors">{p.desc}</p>
                    
                    <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                      <span className="text-[10px] text-cyan-400/50 uppercase tracking-[0.2em] font-black group-hover:text-cyan-400 transition-colors">Prozkoumat web</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-start">
                <div className="space-y-16">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Jsme tu pro vás
                    </div>
                    <h2 className="text-6xl md:text-[5.5rem] text-white uppercase text-glow-cyan leading-[0.9]">Kontaktujte <br /><span className="text-cyan-400 italic font-serif">nás</span></h2>
                    <p className="text-xl text-white/40 font-light max-w-md leading-relaxed">
                      Máte dotaz nebo se chcete zapojit? Napište nám nebo zavolejte. Každý kontakt je krokem k lepší budoucnosti.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {[
                      { icon: <Phone />, label: 'Telefon', value: '+420 705 217 251', sub: 'Po-Pá: 9:00 - 17:00' },
                      { icon: <Mail />, label: 'Email', value: 'kozak@d-international.eu', sub: 'Odpovídáme do 24h' },
                    ].map((item, i) => (
                      <div key={i} className="glass-panel p-10 rounded-[2.5rem] flex items-center gap-8 border-white/5 hover:border-cyan-400/20 transition-all group">
                        <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-1 font-black">{item.label}</p>
                          <p className="text-2xl font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{item.value}</p>
                          <p className="text-xs text-white/20 mt-1 font-light">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                    
                    <a href="https://international.david-kozak.com" target="_blank" className="glass-panel p-10 rounded-[2.5rem] flex items-center gap-8 border-white/5 hover:border-cyan-400/20 transition-all group">
                      <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                        <Globe />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-1 font-black">Firma</p>
                        <p className="text-2xl font-bold text-white/90 group-hover:text-cyan-400 transition-colors">international.david-kozak.com</p>
                      </div>
                      <ExternalLink size={20} className="text-white/10 group-hover:text-cyan-400 transition-all" />
                    </a>
                  </div>
                </div>

                <div className="glass-panel p-12 md:p-16 rounded-[4rem] relative overflow-hidden border-cyan-400/10 bg-cyan-500/[0.02]">
                  <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none"><MessageSquare size={200} /></div>
                  <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-serif text-white italic">Napište nám zprávu</h3>
                      <p className="text-white/30 font-light text-sm">Vaše zpráva bude doručena přímo našemu týmu.</p>
                    </div>
                    
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-black">Vaše jméno</label>
                          <input type="text" placeholder="Jan Novák" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 focus:border-cyan-400 outline-none transition-all placeholder:text-white/10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-black">Váš email</label>
                          <input type="email" placeholder="jan@email.cz" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 focus:border-cyan-400 outline-none transition-all placeholder:text-white/10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-black">Jak vám můžeme pomoci?</label>
                        <textarea placeholder="Popište nám svůj dotaz..." className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-6 focus:border-cyan-400 outline-none resize-none transition-all placeholder:text-white/10" />
                      </div>
                      <button type="button" className="w-full bg-cyan-500 text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/20 flex items-center justify-center gap-3 group">
                        Odeslat Zprávu <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* 1. HEAD VIDEO / ANIMATION */}
            <header className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden rounded-b-[45%] md:rounded-b-[65%] shadow-[0_20px_50px_rgba(0,242,234,0.15)] bg-[#051111]">
              <div className="absolute inset-0 z-0">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover opacity-80"
                >
                   <source src="/videos/Logo_Reveal_REST_ART_Integrace.mp4" type="video/mp4" />
                 </video>
                 {/* Overlay layer */}
                 <div className="absolute inset-0 bg-black/70 pointer-events-none" />
               </div>
              
              <div className="relative z-20 text-center space-y-4">
                <h1 className="text-6xl md:text-[10rem] font-serif text-white font-black tracking-tighter text-glow-cyan animate-pulse">
                  REST<span className="text-cyan-400/50 italic">||</span>ART
                </h1>
                <p className="text-cyan-300/60 font-light tracking-[0.5em] uppercase text-xs md:text-xl">Integrace Společnosti</p>
              </div>
            </header>

            {/* 2. HERO SECTION */}
            <section className="relative py-24 px-6">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                  <div className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-widest uppercase bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-400/20">
                    David Kozák International, s.r.o.
                  </div>
                  <h2 className="text-5xl md:text-8xl text-white leading-tight text-glow-cyan">
                    Druhou šanci si <br className="hidden md:block" /> zaslouží <span className="text-cyan-400 italic font-serif">každý.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light">
                    REST||ART Integrace je kostra nové společnosti. Budujeme udržitelný systém pro ty, které svět přestal vidět.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button onClick={() => setCurrentPage('projects')} className="bg-cyan-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:shadow-cyan-500/30 shadow-xl transition-all">NAŠE PROJEKTY</button>
                    <button className="glass-panel text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">O NÁS</button>
                  </div>
                </div>
                <div className="relative group lg:-mt-40">
                  <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-700 border-[16px] border-white/5 bg-white/5">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" alt="Integrace" className="w-full h-[600px] object-cover opacity-60 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-10 left-10 text-white italic text-2xl font-serif drop-shadow-lg">"Každý příběh má právo pokračovat."</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. GEMINI AI */}
            <section className="py-24 px-6 relative">
              <div className="max-w-4xl mx-auto glass-panel p-12 rounded-[4rem] space-y-8 relative overflow-hidden border-cyan-400/10">
                <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none animate-pulse-glow"><Sparkles size={250} className="text-cyan-400" /></div>
                
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> AI Integrační Asistent
                  </div>
                  <h3 className="text-4xl md:text-5xl text-white text-glow-cyan">Váš plán <span className="text-cyan-400 italic font-serif">restartu</span></h3>
                  <p className="text-white/40 font-light max-w-2xl mx-auto">Napište nám o své situaci a naše AI vám navrhne první kroky podle pilířů Integrace.</p>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="relative group">
                    <textarea 
                      value={userInput} 
                      onChange={(e) => setUserInput(e.target.value)} 
                      placeholder="Popište svou situaci... (např. 'Právě jsem vyšel z výkonu trestu a nemám kde bydlet')" 
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-white/10 resize-none text-lg font-light leading-relaxed" 
                    />
                    <div className="absolute bottom-6 right-6 flex gap-3">
                      <button 
                        onClick={generateRestartPath} 
                        disabled={isLoading || !userInput.trim()} 
                        className="bg-cyan-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-3"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        {isLoading ? "Analyzuji..." : "Analyzovat příběh"}
                      </button>
                    </div>
                  </div>

                  {aiResponse && (
                    <div className="bg-cyan-500/5 border border-cyan-400/20 rounded-[3rem] p-10 md:p-14 text-white/80 font-light leading-relaxed animate-in slide-in-from-bottom-8 duration-700 relative group">
                      <div className="flex justify-between items-center mb-8 border-b border-cyan-400/10 pb-6">
                        <div className="flex items-center gap-3 text-cyan-400">
                          <Sparkles size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Navržený plán integrace</span>
                        </div>
                        <button 
                          onClick={speakPath} 
                          disabled={isSpeaking} 
                          className={`p-4 rounded-2xl transition-all ${isSpeaking ? 'bg-cyan-500 text-black animate-pulse' : 'bg-white/5 text-white/40 hover:text-cyan-400 hover:bg-white/10'}`}
                        >
                          <Volume2 size={20} />
                        </button>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="italic font-serif text-xl md:text-2xl text-white/90 leading-relaxed">
                          "{aiResponse}"
                        </p>
                      </div>
                      <div className="mt-10 pt-6 border-t border-cyan-400/10 flex justify-between items-center">
                        <span className="text-[10px] text-white/20 uppercase tracking-widest">Generováno pomocí Gemini AI</span>
                        <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20" />
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 4. PILLARS */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl text-white uppercase leading-tight text-glow-cyan">
                    Pět pilířů <br /><span className="text-cyan-400 italic font-serif">restartu</span>
                  </h2>
                  <div className="h-1 w-24 bg-cyan-500 rounded-full" />
                </div>
                <p className="text-white/40 max-w-md font-light text-right">
                  Každý pilíř představuje klíčovou fázi integrace, která zajišťuje udržitelnou životní změnu.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pillars.map((p, idx) => (
                  <div key={p.id} className="glass-panel p-10 rounded-[3rem] group hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col h-full border-cyan-400/5 hover:border-cyan-400/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                        {React.cloneElement(p.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
                      </div>
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">0{idx + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest leading-tight relative z-10 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                    <p className="text-white/40 text-base mb-8 font-light leading-relaxed relative z-10 group-hover:text-white/60 transition-colors flex-grow">{p.description}</p>
                    <div className="h-1 w-12 bg-cyan-400/30 rounded-full group-hover:w-full transition-all duration-700 relative z-10"></div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#051111] text-white/90 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative antialiased">
      {/* Background Aura */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-bounce-slow"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-emerald-900/20 rounded-full blur-[150px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 px-6 py-4 ${scrolled ? 'glass-panel py-2 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => setCurrentPage('home')} className="text-2xl font-black tracking-tighter flex items-center text-glow-cyan cursor-pointer group">
            REST<span className="text-cyan-400 mx-1 group-hover:scale-110 transition-transform">||</span>ART
            <span className="ml-2 text-[10px] font-light tracking-[0.2em] uppercase hidden sm:block text-white/50">Integrace</span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <button className="hidden sm:block bg-cyan-500/20 border border-cyan-400/50 text-cyan-100 px-6 py-2 rounded-full text-xs font-black tracking-widest hover:bg-cyan-400 transition-all hover:text-black">ZAPOJIT SE</button>
            {/* Hamburger for BOTH Desktop and Mobile */}
            <button 
              className={`p-3 rounded-2xl transition-all ${scrolled ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'}`} 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="text-cyan-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* SLIDE-OUT MENU (Full Navigation) */}
      <div className={`fixed inset-0 z-[120] glass-panel bg-[#051111]/95 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col items-center justify-center h-full space-y-8 relative">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-cyan-400 p-4 hover:scale-110 transition-transform"><X size={32} /></button>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5 pointer-events-none"><Users size={400} /></div>
          
          <button onClick={() => setCurrentPage('home')} className="group flex items-center gap-6 text-3xl md:text-5xl text-white uppercase hover:text-cyan-400 transition-all">
            <span className="text-sm md:text-lg text-cyan-400 font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">01</span>
            O projektu
          </button>
          <button onClick={() => setCurrentPage('projects')} className="group flex items-center gap-6 text-3xl md:text-5xl text-white uppercase hover:text-cyan-400 transition-all">
            <span className="text-sm md:text-lg text-cyan-400 font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">02</span>
            Projekty
          </button>
          <button onClick={() => setCurrentPage('contacts')} className="group flex items-center gap-6 text-3xl md:text-5xl text-white uppercase hover:text-cyan-400 transition-all">
            <span className="text-sm md:text-lg text-cyan-400 font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">03</span>
            Kontakty
          </button>
          
          <div className="pt-12 flex gap-8">
            <Instagram className="text-white/20 hover:text-cyan-400 cursor-pointer transition-colors" size={24} />
            <Facebook className="text-white/20 hover:text-cyan-400 cursor-pointer transition-colors" size={24} />
            <Globe className="text-white/20 hover:text-cyan-400 cursor-pointer transition-colors" size={24} />
          </div>
        </div>
      </div>

      {renderContent()}

      {/* MAGICKÝ OBRÁZEK PŘED FOOTEREM */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center my-20">
        <div className="absolute inset-0 z-0">
          <img src="Gemini_Generated_Image_cbpno7cbpno7cbpn.jpg" alt="Vizuál" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-[#051111]"></div>
          <div className="absolute inset-0 bg-[#051111]/40"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl space-y-8">
          <Quote size={60} className="text-cyan-400/30 mx-auto" />
          <h3 className="text-3xl md:text-6xl font-serif italic text-white drop-shadow-2xl">"Na nikoho se nezapomíná. Každý si zaslouží druhou šanci."</h3>
          <div className="h-1 w-20 bg-cyan-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-16 md:p-20 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-16 bg-[#0D2F2F]/20 border-cyan-400/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            
            <div className="space-y-8 text-center md:text-left relative z-10">
              <div className="space-y-4">
                <div className="text-5xl font-black tracking-tighter text-glow-cyan leading-none">REST<span className="text-white/10 mx-1">||</span>ART</div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black">Iniciativa David Kozák International</p>
              </div>
              <p className="text-white/20 text-sm font-light max-w-sm leading-relaxed">
                Budujeme systémovou podporu pro udržitelný návrat do společnosti a důstojný život pro každého.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-10 relative z-10">
              <div className="flex gap-8 text-cyan-400/20">
                <Instagram className="hover:text-cyan-400 hover:scale-110 cursor-pointer transition-all" size={32} />
                <Facebook className="hover:text-cyan-400 hover:scale-110 cursor-pointer transition-all" size={32} />
                <Globe className="hover:text-cyan-400 hover:scale-110 cursor-pointer transition-all" size={32} />
              </div>
              <div className="text-center md:text-right space-y-2">
                <p className="text-[10px] text-white/10 uppercase tracking-[0.3em] font-black">© 2024 REST||ART INTEGRACE</p>
                <p className="text-[10px] text-white/5 uppercase tracking-[0.2em]">Všechna práva vyhrazena</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 px-10">
            <div className="flex gap-8">
              {['Ochrana údajů', 'Podmínky užití', 'Cookies'].map(item => (
                <a key={item} href="#" className="text-[9px] text-white/10 uppercase tracking-widest hover:text-white/30 transition-colors">{item}</a>
              ))}
            </div>
            <div className="text-[9px] text-white/10 uppercase tracking-widest flex items-center gap-2">
              Design by <span className="text-white/20 font-black">DK Studio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
