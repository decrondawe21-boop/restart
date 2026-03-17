import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Heart, Briefcase, DoorOpen, Home, 
  ShieldCheck, Leaf, Instagram, Facebook, Globe, Users, 
  ChevronRight, Quote, Sparkles, Send, Loader2, Volume2,
  MapPin, Phone, Mail, ExternalLink, MessageSquare, LayoutGrid,
  Rocket, Paintbrush, Monitor, Key, Landmark, FileText, Film, Smartphone
} from 'lucide-react';

const apiKey = ""; // Klíč poskytne prostředí

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
  const fetchWithRetry = async (url, options, maxRetries = 5) => {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
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

  const pcmToWav = (base64Pcm, sampleRate) => {
    const pcmBuffer = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
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
  const pillars = [
    { id: 'jailbreak', title: 'JAILBREAK', description: 'Pomoc lidem ve výkonu trestu a po něm.', icon: <DoorOpen />, color: 'cyan' },
    { id: 'rework', title: 'REWORK', description: 'Integrace handicapovaných a nezaměstnaných skrze práci.', icon: <Briefcase />, color: 'teal' },
    { id: 'bodzlomu', title: 'BOD ZLOMU', description: 'Provázení dětí z dětských domovů do dospělosti.', icon: <Heart />, color: 'emerald' },
    { id: 'streetwise', title: 'STREETWISE', description: 'První kontakt a pomoc lidem na ulici.', icon: <Home />, color: 'cyan' },
    { id: 'stabilizace', title: 'STABILIZACE', description: 'Udržení životní změny a plná integrace.', icon: <ShieldCheck />, color: 'teal' }
  ];

  // Projects data from the provided image
  const kozakProjects = [
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
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-cyan-400/20 pb-10">
                <h2 className="text-5xl md:text-7xl font-serif text-white uppercase text-glow-cyan leading-tight">Vizionář <br /><span className="text-cyan-400 italic font-light">& Design</span></h2>
                <a href="https://davidkozak.social" target="_blank" className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-cyan-500/10 transition-all text-xs font-bold tracking-widest uppercase">Portfolio Majitele <ExternalLink size={14}/></a>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kozakProjects.map(p => (
                  <a key={p.name} href={p.url} target="_blank" className="glass-panel p-8 rounded-[2.5rem] group hover:bg-cyan-500/5 transition-all flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-cyan-500/10 p-4 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform">{p.icon}</div>
                      <ExternalLink className="text-white/20 group-hover:text-cyan-400 transition-all" size={18} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-cyan-400 transition-colors">{p.name}</h3>
                    <p className="text-white/40 font-light text-sm flex-grow leading-relaxed">{p.desc}</p>
                    <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-cyan-400/50 uppercase tracking-widest font-black">
                      Otevřít Projekt
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                <h2 className="text-5xl md:text-7xl font-serif text-white uppercase text-glow-cyan leading-tight">Kontaktujte <span className="text-cyan-400 italic">nás</span></h2>
                <div className="grid gap-6">
                  <div className="glass-panel p-8 rounded-3xl flex items-center gap-6">
                    <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400"><Phone /></div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Telefon</p>
                      <p className="text-2xl font-black">705 217 251</p>
                    </div>
                  </div>
                  <div className="glass-panel p-8 rounded-3xl flex items-center gap-6">
                    <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400"><Mail /></div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Email</p>
                      <p className="text-2xl font-black">kozak@d-international.eu</p>
                    </div>
                  </div>
                  <a href="https://international.david-kozak.com" target="_blank" className="glass-panel p-8 rounded-3xl flex items-center gap-6 hover:bg-cyan-500/5 transition-all group">
                    <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform"><Globe /></div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Firma</p>
                      <p className="text-xl font-bold">international.david-kozak.com</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="glass-panel p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 pointer-events-none"><MessageSquare size={150} /></div>
                <h3 className="text-2xl font-serif mb-8 italic">Máte dotaz na tým Integrace?</h3>
                <form className="space-y-4 relative z-10">
                  <input type="text" placeholder="Vaše jméno" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-cyan-400 outline-none transition-all placeholder:text-white/20" />
                  <input type="email" placeholder="Váš email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-cyan-400 outline-none transition-all placeholder:text-white/20" />
                  <textarea placeholder="Jak vám můžeme pomoci?" className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-cyan-400 outline-none resize-none transition-all placeholder:text-white/20" />
                  <button type="button" className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all shadow-lg flex items-center justify-center gap-2">Odeslat Zprávu <Send size={16}/></button>
                </form>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* 1. HEAD VIDEO / ANIMATION */}
            <header className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden rounded-b-[45%] md:rounded-b-[65%] shadow-[0_20px_50px_rgba(0,242,234,0.15)] bg-[#051111]">
              <div className="absolute inset-0 opacity-40">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[800px] filter drop-shadow-[0_0_15px_rgba(0,242,234,0.5)]">
                  <path d="M100 180 Q100 140 100 100" stroke="#00F2EA" strokeWidth="2.5" fill="none" />
                  <path d="M100 130 Q130 110 160 90" stroke="#00F2EA" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M100 130 Q70 110 40 90" stroke="#00F2EA" strokeWidth="1" fill="none" opacity="0.6" />
                </svg>
              </div>
              <div className="relative z-20 text-center space-y-4">
                <h1 className="text-6xl md:text-[10rem] font-serif text-white font-black tracking-tighter text-glow-cyan animate-pulse">
                  REST<span className="text-cyan-400/50 italic">||</span>ART
                </h1>
                <p className="text-cyan-300/60 font-light tracking-[0.5em] uppercase text-xs md:text-xl">Integrace Společnosti</p>
              </div>
              <div className="absolute inset-0 bg-[#2D5A27]/45 mix-blend-multiply pointer-events-none"></div>
            </header>

            {/* 2. HERO SECTION */}
            <section className="relative py-24 px-6">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                  <div className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-widest uppercase bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-400/20">
                    David Kozák International, s.r.o.
                  </div>
                  <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight">
                    Druhou šanci si <br className="hidden md:block" /> zaslouží <span className="text-cyan-400 italic">každý.</span>
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
            <section className="py-24 px-6">
              <div className="max-w-4xl mx-auto glass-panel p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none animate-pulse"><Sparkles size={100} className="text-cyan-400" /></div>
                <h3 className="text-3xl font-serif flex items-center gap-3">✨ Restart s AI <Sparkles className="text-cyan-400" /></h3>
                <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Popište svou situaci... (např. 'Hledám práci po propuštění')" className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-white/20 resize-none" />
                <div className="flex gap-4">
                  <button onClick={generateRestartPath} disabled={isLoading} className="flex-1 bg-cyan-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20">{isLoading ? "Generuji..." : "✨ Analyzovat příběh"}</button>
                  {aiResponse && <button onClick={speakPath} disabled={isSpeaking} className="bg-white/10 px-6 rounded-xl border border-white/10 hover:bg-white/20 transition-all"><Volume2 /></button>}
                </div>
                {aiResponse && <div className="mt-8 p-8 bg-cyan-500/5 border border-cyan-400/20 rounded-[2rem] text-white/80 font-light leading-relaxed animate-in slide-in-from-bottom-4 duration-500">{aiResponse}</div>}
              </div>
            </section>

            {/* 4. PILLARS */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pillars.map(p => (
                  <div key={p.id} className="glass-panel p-10 rounded-[3rem] group hover:-translate-y-2 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">{p.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest leading-tight">{p.title}</h3>
                    <p className="text-white/40 text-base mb-6 font-light leading-relaxed">{p.description}</p>
                    <div className="h-1 w-12 bg-cyan-400/30 rounded-full group-hover:w-full transition-all duration-500"></div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#051111] text-white/90 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Background Aura */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-bounce-slow"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-emerald-900/20 rounded-full blur-[150px]"></div>
      </div>

      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-bounce-slow { animation: bounce-slow 10s ease-in-out infinite; }
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(0, 242, 234, 0.1); }
        .text-glow-cyan { text-shadow: 0 0 10px rgba(0, 242, 234, 0.5), 0 0 20px rgba(0, 242, 234, 0.2); }
      `}</style>

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
          
          <button onClick={() => setCurrentPage('home')} className="group flex items-center gap-6 text-3xl md:text-5xl font-serif text-white uppercase hover:text-cyan-400 transition-all">
            <span className="text-sm md:text-lg text-cyan-400 font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">01</span>
            O projektu
          </button>
          <button onClick={() => setCurrentPage('projects')} className="group flex items-center gap-6 text-3xl md:text-5xl font-serif text-white uppercase hover:text-cyan-400 transition-all">
            <span className="text-sm md:text-lg text-cyan-400 font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">02</span>
            Projekty
          </button>
          <button onClick={() => setCurrentPage('contacts')} className="group flex items-center gap-6 text-3xl md:text-5xl font-serif text-white uppercase hover:text-cyan-400 transition-all">
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
      <footer className="py-20 relative z-10 px-6">
        <div className="max-w-7xl mx-auto glass-panel p-16 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-12 bg-[#0D2F2F]/40 border-cyan-400/5">
          <div className="space-y-4 text-center md:text-left">
            <div className="text-4xl font-black tracking-tighter text-glow-cyan leading-none">REST<span className="text-white/20 mx-1">||</span>ART</div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Iniciativa David Kozák International</p>
          </div>
          <div className="flex gap-10 text-cyan-400/30">
            <Instagram className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
            <Facebook className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
            <Globe className="hover:text-cyan-400 cursor-pointer transition-colors" size={28} />
          </div>
        </div>
        <div className="text-center mt-12 text-[10px] text-white/10 uppercase tracking-[0.5em]">
          Design by DK Studio © 2024
        </div>
      </footer>
    </div>
  );
};

export default App;