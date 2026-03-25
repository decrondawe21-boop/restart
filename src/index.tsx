import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import BlogPage, { type BlogPost } from './pages/BlogPage';
import ContactModal from './components/ContactModal';
import { 
  Menu, X, ArrowRight, Heart, Briefcase, DoorOpen, Home, 
  ShieldCheck, Leaf, Instagram, Facebook, Globe, Users, 
  ChevronRight, ChevronUp, Quote, Sparkles, Send, Loader2, Volume2,
  MapPin, Phone, Mail, ExternalLink, MessageSquare, LayoutGrid,
  Rocket, Paintbrush, Monitor, Key, Landmark, FileText, Film, Smartphone, RefreshCw,
  Target, TrendingDown, TrendingUp, CheckCircle, Wallet, Activity, BarChart,
  Lightbulb, Flag, Workflow, Building2, Gavel, Award,
  AlertCircle, Link, MessageCircle, ShieldAlert, ArrowDownRight, Zap,
  Fingerprint, HeartHandshake, Scale, Eye, HelpCircle, Sun, Moon
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
  isMain?: boolean;
}

type PageKey =
  | 'home'
  | 'about'
  | 'pillars'
  | 'pillar-jailbreak'
  | 'pillar-rework'
  | 'pillar-rework-analyza'
  | 'pillar-rework-implementace'
  | 'pillar-streetwise'
  | 'pillar-reset'
  | 'pillar-mistozlomu'
  | 'pillar-stabilizace'
  | 'stories'
  | 'news'
  | 'projects'
  | 'blog'
  | 'contacts'
  | 'zamer-uvod'
  | 'zamer-cile'
  | 'zamer-rozpocet'
  | 'zamer-prinos'
  | 'zamer-harmonogram'
  | 'zamer-programy';

const pagePathMap: Record<PageKey, string> = {
  home: '/',
  about: '/o-nas',
  pillars: '/pilire',
  'pillar-jailbreak': '/pilire/jailbreak',
  'pillar-rework': '/pilire/rework',
  'pillar-rework-analyza': '/pilire/rework/analyza',
  'pillar-rework-implementace': '/pilire/rework/implementace',
  'pillar-streetwise': '/pilire/streetwise',
  'pillar-reset': '/pilire/reset',
  'pillar-mistozlomu': '/pilire/misto-zlomu',
  'pillar-stabilizace': '/pilire/stabilizace',
  stories: '/pribehy',
  news: '/novinky',
  projects: '/projekty',
  blog: '/blog',
  contacts: '/kontakty',
  'zamer-uvod': '/investicni-zamer/uvod',
  'zamer-cile': '/investicni-zamer/cile',
  'zamer-rozpocet': '/investicni-zamer/rozpocet',
  'zamer-prinos': '/investicni-zamer/prinos',
  'zamer-harmonogram': '/investicni-zamer/harmonogram',
  'zamer-programy': '/investicni-zamer/programy'
};

interface MenuNode {
  key: string;
  label: string;
  id?: PageKey | 'contacts-modal';
  children?: MenuNode[];
}

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const savedTheme = window.localStorage.getItem('restart-theme');
    if (savedTheme === 'light') return false;
    if (savedTheme === 'dark') return true;
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const resolvedPath = normalizedPath === pagePathMap.contacts ? pagePathMap.home : normalizedPath;
  const currentPage =
    (Object.entries(pagePathMap).find(([, path]) => path === resolvedPath)?.[0] as PageKey | undefined) ?? 'home';

  const goToPage = (page: PageKey) => {
    navigate(pagePathMap[page]);
  };

  const [expandedMenuKeys, setExpandedMenuKeys] = useState<string[]>([]);

  const toggleMenuNode = (key: string) => {
    setExpandedMenuKeys((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  const isNodeActive = (node: MenuNode): boolean => {
    if (node.id && node.id !== 'contacts-modal' && node.id === currentPage) return true;
    return node.children?.some((child) => isNodeActive(child)) ?? false;
  };

  const findMenuPath = (nodes: MenuNode[], target: PageKey, acc: string[] = []): string[] | null => {
    for (const node of nodes) {
      const nextAcc = [...acc, node.key];
      if (node.id === target) return nextAcc;
      if (node.children) {
        const found = findMenuPath(node.children, target, nextAcc);
        if (found) return found;
      }
    }
    return null;
  };

  const handleMenuNavigation = (id: PageKey | 'contacts-modal') => {
    if (id === 'contacts-modal') {
      setIsContactModalOpen(true);
      setIsMenuOpen(false);
      return;
    }
    goToPage(id);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('restart-theme', isDark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const homeStatItems = [
    { target: 127, suffix: '+', label: 'Klientů v integračním procesu' },
    { target: 6, suffix: '', label: 'Aktivních programů REST||ART' },
    { target: 78, suffix: '%', label: 'Úspěšnost stabilizace' }
  ];
  const [animatedStats, setAnimatedStats] = useState<number[]>(homeStatItems.map(() => 0));
  
  // Gemini AI state
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentPage !== 'home') return;

    let frame = 0;
    let start: number | null = null;
    const duration = 1200;
    setAnimatedStats(homeStatItems.map(() => 0));

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedStats(homeStatItems.map((item) => Math.floor(item.target * progress)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [currentPage]);

  // Scroll na začátek při změně stránky
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    if (!isContactModalOpen && !isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isContactModalOpen) setIsContactModalOpen(false);
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isContactModalOpen, isMenuOpen]);

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
    { id: 'jailbreak', title: 'JAILBREAK', description: 'Reintegrace osob po výkonu trestu. Pomoc s doklady, rodinnými vazbami a diskrétní mapování (tajná fáze).', icon: <DoorOpen />, color: 'cyan', isMain: true },
    { id: 'rework', title: 'REWORK', description: 'Pracovní aktivace a integrace nezaměstnaných skrze přímé zaměstnání a mentoring (včetně zahraničí).', icon: <Briefcase />, color: 'teal', isMain: true },
    { id: 'streetwise', title: 'STREETWISE', description: 'Terénní práce s lidmi na ulici a závislými. Budování důvěry, hygienické balíčky a mobilní týmy.', icon: <Home />, color: 'cyan', isMain: true },
    { id: 'reset', title: 'RESET', description: 'Nová životní cesta a restart osobních hodnot skrze vnitřní rozhodnutí a motivaci.', icon: <RefreshCw />, color: 'emerald' },
    { id: 'bodzlomu', title: 'BOD ZLOMU', description: 'Provázení dětí z dětských domovů do dospělosti – prevence recidivy a selhání.', icon: <Heart />, color: 'emerald' },
    { id: 'stabilizace', title: 'STABILIZACE', description: 'Udržení životní změny, plná integrace a budování národní značky důvěry.', icon: <ShieldCheck />, color: 'teal' }
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

  const navTree: MenuNode[] = [
    { key: 'home', label: 'Domů', id: 'home' },
    {
      key: 'about-root',
      label: 'O nás',
      id: 'about',
      children: [
        { key: 'about-stories', label: 'Příběhy', id: 'stories' },
        { key: 'about-news', label: 'Novinky a aktuality', id: 'news' },
        { key: 'about-blog', label: 'Blog / Archiv', id: 'blog' },
        { key: 'about-contacts', label: 'Kontakty (mini okno)', id: 'contacts-modal' }
      ]
    },
    {
      key: 'pillars-root',
      label: 'Pilíře',
      id: 'pillars',
      children: [
        { key: 'pillar-jailbreak', label: 'JAILBREAK', id: 'pillar-jailbreak' },
        {
          key: 'pillar-rework',
          label: 'REWORK',
          id: 'pillar-rework',
          children: [
            { key: 'pillar-rework-analyza', label: 'Analýza trhu', id: 'pillar-rework-analyza' },
            { key: 'pillar-rework-implementace', label: 'Implementace', id: 'pillar-rework-implementace' }
          ]
        },
        { key: 'pillar-streetwise', label: 'STREETWISE', id: 'pillar-streetwise' },
        { key: 'pillar-reset', label: 'RESET', id: 'pillar-reset' },
        { key: 'pillar-mistozlomu', label: 'MÍSTO ZLOMU', id: 'pillar-mistozlomu' },
        { key: 'pillar-stabilizace', label: 'STABILIZACE', id: 'pillar-stabilizace' }
      ]
    },
    { key: 'projects', label: 'Projekty', id: 'projects' },
    {
      key: 'invest-root',
      label: 'Investiční záměr',
      id: 'zamer-uvod',
      children: [
        { key: 'zamer-cile', label: 'Hlavní cíle investice', id: 'zamer-cile' },
        { key: 'zamer-rozpocet', label: 'Výše investice', id: 'zamer-rozpocet' },
        { key: 'zamer-prinos', label: 'Návratnost a přínos', id: 'zamer-prinos' },
        { key: 'zamer-harmonogram', label: 'Harmonogram', id: 'zamer-harmonogram' },
        { key: 'zamer-programy', label: 'Přehled programů OPZ+', id: 'zamer-programy' }
      ]
    }
  ];

  useEffect(() => {
    const activePathKeys = findMenuPath(navTree, currentPage);
    if (!activePathKeys) return;
    setExpandedMenuKeys((prev) => [...new Set([...prev, ...activePathKeys])]);
  }, [currentPage]);

  const routablePages: PageKey[] = [
    'home',
    'about',
    'pillars',
    'pillar-jailbreak',
    'pillar-rework',
    'pillar-rework-analyza',
    'pillar-rework-implementace',
    'pillar-streetwise',
    'pillar-reset',
    'pillar-mistozlomu',
    'pillar-stabilizace',
    'stories',
    'news',
    'projects',
    'blog',
    'zamer-uvod',
    'zamer-cile',
    'zamer-rozpocet',
    'zamer-prinos',
    'zamer-harmonogram',
    'zamer-programy'
  ];

  const investmentGoals = [
    "Založení stabilního integračního centra (1× hlavní zázemí, 2× regionální pobočky).",
    "Vybudování školících, terapeutických a pracovních kapacit.",
    "Vybavení pro tréninkové pracoviště.",
    "Zahájení a financování prvních tří programů (JAILBREAK, REWORK, STREETWISE).",
    "Zajištění odborného personálu, koordinátorů a mentorů."
  ];

  const investmentCosts = [
    { area: "Pronájem a úpravy prostor", amount: "3 000 000 Kč" },
    { area: "Vybavení (IT, nábytek, dílny)", amount: "1 500 000 Kč" },
    { area: "Školení a akreditace", amount: "750 000 Kč" },
    { area: "Mzdy odborného týmu (12 měsíců)", amount: "4 800 000 Kč" },
    { area: "Marketing a PR", amount: "600 000 Kč" },
    { area: "Právní a administrativní služby", amount: "350 000 Kč" },
    { area: "Rezerva (10 %)", amount: "1 100 000 Kč" }
  ];

  const investmentBenefits = [
    {
      title: "Sociální návratnost",
      description: "Snížení recidivy, podpora soběstačnosti a prevence kriminality.",
      icon: <TrendingDown />
    },
    {
      title: "Ekonomická návratnost",
      description: "Zapojení lidí do práce a snížení závislosti na sociálních dávkách.",
      icon: <TrendingUp />
    },
    {
      title: "Společenský přínos",
      description: "Stabilizace komunit, vyšší bezpečnost a obnova lidské důstojnosti.",
      icon: <ShieldCheck />
    }
  ];

  const projectTimeline = [
    { phase: "Příprava a dokumentace", date: "červen-červenec 2025" },
    { phase: "Schvalování a smlouvy", date: "srpen 2025" },
    { phase: "Zahájení pilotní fáze", date: "září 2025" },
    { phase: "První vyhodnocení", date: "únor 2026" }
  ];

  const opzPrograms = [
    {
      name: "JAILBREAK",
      target: "Osoby po výkonu trestu",
      activities: "Návštěvy VTOS, mentoring, terapeutická podpora, rekvalifikace.",
      goal: "Snížení recidivy a úspěšná reintegrace.",
      duration: "6-12 měsíců dle profilu klienta"
    },
    {
      name: "REWORK",
      target: "Dlouhodobě nezaměstnaní",
      activities: "Rekvalifikace, kariérní poradenství, pracovní asistence.",
      goal: "Zvýšení zaměstnatelnosti a pracovní stabilizace.",
      duration: "4-8 měsíců dle potřeb"
    },
    {
      name: "STREETWISE",
      target: "Osoby bez domova a závislí",
      activities: "Ubytování, detox, komunitní zapojení, práce v terénu.",
      goal: "Obnovení důstojnosti a integrace.",
      duration: "6-9 měsíců včetně intenzivní intervence"
    },
    {
      name: "RESET",
      target: "Osoby v těžké životní situaci, potřebující nový začátek",
      activities: "Vzdělávání, podpora při hledání bydlení a práce.",
      goal: "Restart života a soběstačnost.",
      duration: "3-6 měsíců + následná podpora"
    },
    {
      name: "MÍSTO ZLOMU",
      target: "Mládež z dětských domovů a ústavů",
      activities: "Mentoring, tréninkové byty, zážitková pedagogika.",
      goal: "Prevence kriminality a podpora samostatného života.",
      duration: "9 měsíců + opora při přechodu"
    },
    {
      name: "STABILIZACE",
      target: "Osoby po změně, které potřebují podporu",
      activities: "Pracovní asistence, komunitní opora, zdravotní péče.",
      goal: "Dlouhodobá stabilizace a začlenění do společnosti.",
      duration: "Individuálně 6+ měsíců"
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      title: "Spuštění pilotní fáze REST||ART INTEGRACE",
      date: "září 2025",
      category: "Projekt",
      excerpt: "Pilotní provoz zahájen ve vybraných lokalitách. Fokus na JAILBREAK, REWORK a STREETWISE."
    },
    {
      title: "První průběžné výsledky programu REWORK",
      date: "listopad 2025",
      category: "Dopad",
      excerpt: "Vyhodnocujeme první měsíce pracovních asistencí, rekvalifikací a zaměstnanecké stability."
    },
    {
      title: "Rozšiřujeme síť partnerství pro rok 2026",
      date: "leden 2026",
      category: "Partnerství",
      excerpt: "Navazujeme spolupráci s institucemi, zaměstnavateli a odborníky pro další etapu projektu."
    }
  ];

  const storyHighlights = [
    {
      name: "Martin K.",
      pillar: "JAILBREAK",
      quote: "REST||ART mi dal práci a hlavně víru v sebe. Dnes vedu normální život.",
      outcome: "Pracuje jako svářeč",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900"
    },
    {
      name: "Tereza M.",
      pillar: "MÍSTO ZLOMU",
      quote: "Tady mi pomohli najít první bydlení i odvahu studovat vysokou školu.",
      outcome: "Studuje VŠ a pracuje",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=900"
    },
    {
      name: "Jakub R.",
      pillar: "STREETWISE",
      quote: "Po dvou letech na ulici jsem konečně našel cestu zpět. Díky za trpělivost.",
      outcome: "Azylové bydlení, program REWORK",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=900"
    }
  ];

  const pillarRoadmap = [
    { id: 'jailbreak', stat: '78% úspěšnost', focus: 'Práce s lidmi po VTOS, asistence a bezpečný návrat do společnosti.' },
    { id: 'rework', stat: '120+ pracovních vstupů', focus: 'Rekvalifikace, přímé napojení na zaměstnavatele a stabilizace práce.' },
    { id: 'streetwise', stat: 'Terén 7 dní v týdnu', focus: 'Street outreach, krizová podpora, budování důvěry a základní stabilizace.' },
    { id: 'reset', stat: 'Program 3-6 měsíců', focus: 'Restart osobních cílů, motivace a návrat k dennímu režimu.' },
    { id: 'bodzlomu', stat: 'Mládež 17-26 let', focus: 'Podpora mladých při přechodu z ústavní péče do samostatného života.' },
    { id: 'stabilizace', stat: '6+ měsíců follow-up', focus: 'Dlouhodobé udržení změny, bydlení, zdraví a komunitní opora.' }
  ];

  const pillarPageMap: Record<string, PageKey> = {
    jailbreak: 'pillar-jailbreak',
    rework: 'pillar-rework',
    streetwise: 'pillar-streetwise',
    reset: 'pillar-reset',
    bodzlomu: 'pillar-mistozlomu',
    stabilizace: 'pillar-stabilizace'
  };

  const reworkMarketRows = [
    { date: '31.01.2025', uoz: '320 516', vpm: '83 323', ratio: '3.85' },
    { date: '28.02.2025', uoz: '326 223', vpm: '88 062', ratio: '3.70' },
    { date: '31.03.2025', uoz: '322 140', vpm: '91 752', ratio: '3.51' },
    { date: '30.04.2025', uoz: '318 540', vpm: '95 798', ratio: '3.33' }
  ];

  const reworkIntegrationRows = [
    { act: 'Diagnostika & Plán', phase: '1 - Motivace', tool: 'Interní / ÚP' },
    { act: 'Rekvalifikace', phase: '2 - Školení', tool: 'ÚP kurz' },
    { act: 'Asistovaná pozice', phase: '3 - Adaptace', tool: 'SÚPM' },
    { act: 'Mentoring', phase: '3 - Adaptace', tool: 'Příspěvek' },
    { act: 'Dluhové poradenství', phase: '2-4 - Podpora', tool: 'Projektový' },
    { act: 'Zprostředkování', phase: '5 - Volný trh', tool: 'Spolupráce' }
  ];

  const implementationPhases = [
    { step: 'FÁZE 1', title: 'Identifikace a oslovení', desc: 'Mapování a vstupní kontakt s cílovou skupinou.' },
    { step: 'FÁZE 2', title: 'První intervence', desc: 'Mentoring, smluvní rámec a počáteční podpora.' },
    { step: 'FÁZE 3', title: 'Pracovní aktivace', desc: 'Rekvalifikace, trénink a spolupráce s ÚP.' },
    { step: 'FÁZE 4', title: 'Stabilizace a opora', desc: 'Ubytování, návazné služby a terénní tým.' },
    { step: 'FÁZE 5', title: 'Udržení a autonomie', desc: 'Přechod do civilní sítě a posílení samostatnosti.' }
  ];

  const implementationMilestones = [
    { time: '09/2025', title: 'Zahájení & Příprava', desc: 'Formální spuštění projektu a příprava infrastruktury.' },
    { time: '11/2025', title: 'Investiční fáze', desc: 'Pořízení vybavení, rekonstrukce a školící zázemí.' },
    { time: '01/2026', title: 'Pilotní spuštění', desc: 'Prvních 10 účastníků v mentoringovém systému.' },
    { time: '04/2026', title: 'Provoz Jiřice', desc: 'Zahájení práce v Jiřicích (VTOS + civil).' },
    { time: '08/2026', title: 'Škálování', desc: 'Navýšení kapacity na 50 účastníků ročně.' },
    { time: '12/2026', title: 'Vyhodnocení', desc: 'Kompletace první fáze a transformace v INTEGR!A.' }
  ];

  const renderSimplePillarPage = (config: {
    badge: string;
    title: string;
    accent: string;
    target: string;
    activities: string;
    goal: string;
    duration: string;
    icon: React.ReactElement;
  }) => (
    <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4 border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
            {config.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
            {config.title} <br />
            <span className="text-cyan-300 headline-thin">{config.accent}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[auto,1fr] gap-8">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 h-fit">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              {React.cloneElement(config.icon as React.ReactElement<{ size?: number }>, { size: 30 })}
            </div>
          </div>
          <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-white/10 space-y-6">
            <div className="space-y-4 text-white/60 font-light">
              <p><span className="text-white font-semibold">Cílová skupina:</span> {config.target}</p>
              <p><span className="text-white font-semibold">Klíčové aktivity:</span> {config.activities}</p>
              <p><span className="text-white font-semibold">Cíl:</span> {config.goal}</p>
              <p><span className="text-white font-semibold">Délka:</span> {config.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = (page: PageKey) => {
    switch(page) {
      case 'home':
        return (
          <>
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
                <div className="absolute inset-0 bg-black/70 pointer-events-none" />
              </div>

              <div className="relative z-20 text-center space-y-4">
                <h1 className="text-5xl md:text-[8rem] font-serif text-white font-black tracking-tighter text-glow-cyan animate-pulse">
                  REST<span className="text-cyan-400/50 italic">||</span>ART
                </h1>
                <p className="text-cyan-300/60 font-light tracking-[0.5em] uppercase text-xs md:text-xl">Integrace Společnosti</p>
              </div>
            </header>

            <section className="relative py-24 px-6">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                  <div className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-widest uppercase bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-400/20">
                    David Kozák International, s.r.o.
                  </div>
                  <h2 className="text-4xl md:text-7xl text-white leading-tight text-glow-cyan">
                    Druhou šanci si <br className="hidden md:block" /> zaslouží <span className="text-cyan-300 headline-thin">každý.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light">
                    Přecházíme na čisté vícestránkové uspořádání. Každá oblast má vlastní stránku, vlastní navigaci a jasný kontext.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button onClick={() => goToPage('pillars')} className="bg-cyan-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:shadow-cyan-500/30 shadow-xl transition-all">PŘEJÍT NA PILÍŘE</button>
                    <button onClick={() => goToPage('news')} className="glass-panel text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">NOVINKY</button>
                  </div>
                </div>
                <div className="relative group lg:-mt-40">
                  <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-700 border-[16px] border-white/5 bg-white/5">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" alt="Integrace" className="hero-desat w-full h-[600px] object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-10 left-10 text-white italic text-2xl font-serif drop-shadow-lg">"Každý příběh má právo pokračovat."</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-12 px-6 max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {homeStatItems.map((item, idx) => (
                  <div key={item.label} className="glass-panel p-8 rounded-3xl text-center group hover:-translate-y-1 transition-all duration-500 border-white/10">
                    <p className="text-5xl md:text-6xl font-black text-glow-cyan leading-none mb-4">
                      {animatedStats[idx]}{item.suffix}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 font-black">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-16 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="space-y-4 mb-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-black">Rozdělení obsahu</p>
                  <h3 className="text-4xl md:text-6xl text-white uppercase leading-none">
                    Nové stránky <span className="text-cyan-300 headline-thin">podle tématu</span>
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 'about' as PageKey, title: 'O nás', text: 'Mise, tým, fungování integračního centra.', icon: <Users size={20} /> },
                    { id: 'pillars' as PageKey, title: 'Pilíře', text: 'Přehled všech programů a detailní podstránky.', icon: <LayoutGrid size={20} /> },
                    { id: 'pillar-rework' as PageKey, title: 'REWORK', text: 'Samostatná stránka programu + analýza + implementace.', icon: <Briefcase size={20} /> },
                    { id: 'stories' as PageKey, title: 'Příběhy', text: 'Skutečné příběhy a průběžné výsledky restartu.', icon: <Quote size={20} /> },
                    { id: 'news' as PageKey, title: 'Novinky', text: 'Aktuality a průběžné milníky projektu.', icon: <FileText size={20} /> },
                    { id: 'zamer-uvod' as PageKey, title: 'Investiční záměr', text: 'Kompletní podklady OPZ+ v samostatných stránkách.', icon: <BarChart size={20} /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => goToPage(item.id)}
                      className="glass-panel p-8 rounded-[2.5rem] border-white/10 hover:border-cyan-400/30 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                        {item.icon}
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                      <p className="text-sm text-white/45 font-light leading-relaxed mt-3">{item.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 px-6 relative">
              <div className="max-w-4xl mx-auto glass-panel p-12 rounded-[4rem] space-y-8 relative overflow-hidden border-cyan-400/10">
                <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none animate-pulse-glow"><Sparkles size={250} className="text-cyan-400" /></div>

                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> AI Integrační Asistent
                  </div>
                  <h3 className="text-4xl md:text-5xl text-white text-glow-cyan">Váš plán <span className="text-cyan-300 headline-thin">restartu</span></h3>
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
                        {isLoading ? 'Analyzuji...' : 'Analyzovat příběh'}
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
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        );
      case 'pillar-jailbreak': {
        const program = opzPrograms.find((item) => item.name === 'JAILBREAK');
        if (!program) return null;
        return renderSimplePillarPage({
          badge: 'Pilíř 1 | JAILBREAK',
          title: 'JAILBREAK',
          accent: 'reintegrace po VTOS',
          target: program.target,
          activities: program.activities,
          goal: program.goal,
          duration: program.duration,
          icon: <DoorOpen />
        });
      }
      case 'pillar-streetwise': {
        const program = opzPrograms.find((item) => item.name === 'STREETWISE');
        if (!program) return null;
        return renderSimplePillarPage({
          badge: 'Pilíř 3 | STREETWISE',
          title: 'STREETWISE',
          accent: 'terénní intervence',
          target: program.target,
          activities: program.activities,
          goal: program.goal,
          duration: program.duration,
          icon: <Home />
        });
      }
      case 'pillar-reset': {
        const program = opzPrograms.find((item) => item.name === 'RESET');
        if (!program) return null;
        return renderSimplePillarPage({
          badge: 'Pilíř 4 | RESET',
          title: 'RESET',
          accent: 'nový začátek',
          target: program.target,
          activities: program.activities,
          goal: program.goal,
          duration: program.duration,
          icon: <RefreshCw />
        });
      }
      case 'pillar-mistozlomu': {
        const program = opzPrograms.find((item) => item.name === 'MÍSTO ZLOMU');
        if (!program) return null;
        return renderSimplePillarPage({
          badge: 'Pilíř 5 | MÍSTO ZLOMU',
          title: 'MÍSTO ZLOMU',
          accent: 'přechod mládeže',
          target: program.target,
          activities: program.activities,
          goal: program.goal,
          duration: program.duration,
          icon: <Heart />
        });
      }
      case 'pillar-stabilizace': {
        const program = opzPrograms.find((item) => item.name === 'STABILIZACE');
        if (!program) return null;
        return renderSimplePillarPage({
          badge: 'Pilíř 6 | STABILIZACE',
          title: 'STABILIZACE',
          accent: 'dlouhodobá opora',
          target: program.target,
          activities: program.activities,
          goal: program.goal,
          duration: program.duration,
          icon: <ShieldCheck />
        });
      }
      case 'pillar-rework':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/10 pb-10">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    Pilíř 2 | REWORK
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                    RE<span className="text-cyan-300 headline-thin">WORK</span>
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-white/20 uppercase tracking-widest font-black">
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500" /> David Kozák International s.r.o.</div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500" /> IČO: 23143614</div>
                  <div className="flex items-center gap-2 md:col-span-2"><div className="w-1 h-1 bg-cyan-500" /> Drážďanská 51/52, 400 07 Ústí nad Labem</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  { icon: <BarChart />, title: '1. VÝCHOZÍ SITUACE', text: 'Program REWORK vzniká jako odpověď na zásadní nesoulad mezi počtem uchazečů o zaměstnání a dostupnými pracovními místy.' },
                  { icon: <Target />, title: '2. CÍL PROGRAMU', text: 'Příprava osob v evidenci ÚP na úspěšný nástup do stabilního zaměstnání formou diagnostiky, rekvalifikací a mentoringu.' },
                  { icon: <Users />, title: '3. CÍLOVÁ SKUPINA', text: 'Dlouhodobě nezaměstnaní, osoby bez praxe, lidé se zadlužením, po závislostech či s bariérami vzdělání.' },
                  { icon: <Activity />, title: '4. KLÍČOVÉ AKTIVITY', text: 'Individuální plány, rekvalifikační kurzy, simulované pracovní pozice, finanční poradenství a asistence.' },
                  { icon: <Wallet />, title: '5. ZDROJE A PODPORA', text: 'SÚPM, příspěvky na zapracování, rekvalifikace ÚP a navazující doprovodné služby.' },
                  { icon: <CheckCircle />, title: '6. ZÁVĚREČNÉ HODNOCENÍ', text: 'Model umožňuje bezpečný pracovní nácvik, obnovení dovedností a následný přechod na otevřený trh práce.' }
                ].map((card, i) => (
                  <div key={i} className="glass-panel p-10 rounded-[3rem] space-y-6 hover:bg-cyan-500/5 transition-all group border-white/10">
                    <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-black tracking-widest uppercase text-white group-hover:text-cyan-400 transition-colors">{card.title}</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-cyan-400/20 bg-cyan-500/[0.02] space-y-8">
                <h3 className="text-3xl text-white font-black uppercase tracking-[1.5px]">REWORK <span className="text-cyan-300 headline-thin">submenu</span></h3>
                <p className="text-white/45 font-light max-w-3xl">
                  Program REWORK má samostatnou 3. úroveň navigace. V menu najdete podstránky Analýza trhu a Implementace.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => goToPage('pillar-rework-analyza')} className="bg-cyan-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-cyan-400 transition-all">
                    Otevřít Analýzu
                  </button>
                  <button onClick={() => goToPage('pillar-rework-implementace')} className="glass-panel px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white hover:bg-white/10 transition-all">
                    Otevřít Implementaci
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pillar-rework-analyza':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="space-y-4 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                  Pilíře / REWORK / Analýza
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Analýza trhu <br /><span className="text-cyan-300 headline-thin">REWORK</span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-panel rounded-[3rem] overflow-hidden border-white/10">
                  <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-white/40">Srovnání Poptávka / Nabídka</span>
                    <TrendingDown size={16} className="text-cyan-400" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                          <th className="p-6 font-black">Datum</th>
                          <th className="p-6 font-black">Uchazeči (UOZ)</th>
                          <th className="p-6 font-black">Místa (VPM)</th>
                          <th className="p-6 font-black text-cyan-400">Poměr</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-white/60">
                        {reworkMarketRows.map((row) => (
                          <tr key={row.date} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-6 font-mono text-xs">{row.date}</td>
                            <td className="p-6 font-bold text-white/80">{row.uoz}</td>
                            <td className="p-6 font-bold text-white/80">{row.vpm}</td>
                            <td className="p-6 font-black text-cyan-400">{row.ratio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-panel rounded-[3rem] overflow-hidden border-white/10">
                  <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-white/40">Fáze integrace REWORK</span>
                    <TrendingUp size={16} className="text-teal-400" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                          <th className="p-6 font-black">Aktivita</th>
                          <th className="p-6 font-black">Fáze</th>
                          <th className="p-6 font-black text-teal-400">Nástroj ÚP</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-white/60">
                        {reworkIntegrationRows.map((row) => (
                          <tr key={row.act} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-6 font-bold text-white/80">{row.act}</td>
                            <td className="p-6 text-xs">{row.phase}</td>
                            <td className="p-6 font-black text-teal-400 uppercase text-[10px] tracking-widest">{row.tool}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-400/20 p-8 rounded-3xl w-fit">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Ratio UOZ / VPM</p>
                <p className="text-4xl font-black text-white">3.3 - 3.8</p>
              </div>
            </div>
          </div>
        );
      case 'pillar-rework-implementace':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-14">
              <div className="space-y-4 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-[10px] tracking-[0.3em] font-black uppercase">
                  Pilíře / REWORK / Implementace
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Implementační <br /><span className="text-teal-300 headline-thin">plán</span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  {implementationPhases.map((phase) => (
                    <div key={phase.step} className="glass-panel p-6 rounded-2xl flex items-center gap-6 border-white/10 hover:border-cyan-400/20 transition-all group">
                      <div className="text-xs font-black text-cyan-400/40 group-hover:text-cyan-400 transition-colors w-12">{phase.step}</div>
                      <div className="h-8 w-px bg-white/10" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">{phase.title}</h4>
                        <p className="text-xs text-white/30 font-light">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                  {implementationMilestones.map((milestone) => (
                    <div key={milestone.time} className="relative pl-12 group">
                      <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] group-hover:scale-150 transition-transform" />
                      <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">{milestone.time}</div>
                      <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">{milestone.title}</h4>
                      <p className="text-xs text-white/30 font-light leading-relaxed">{milestone.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
                {[
                  { label: 'Počet osob', value: 'KPI 01', icon: <Users size={16} /> },
                  { label: 'Zaměstnanost', value: 'KPI 02', icon: <Briefcase size={16} /> },
                  { label: 'Mentoring', value: 'KPI 03', icon: <Heart size={16} /> },
                  { label: 'Stabilní bydlení', value: 'KPI 04', icon: <Home size={16} /> },
                  { label: 'Snížení recidivy', value: 'KPI 05', icon: <ShieldCheck size={16} /> },
                  { label: 'Absence drog', value: 'KPI 06', icon: <Activity size={16} /> }
                ].map((kpi) => (
                  <div key={kpi.value} className="glass-panel p-6 rounded-2xl text-center space-y-3 hover:bg-cyan-500/5 transition-all border-white/10">
                    <div className="text-cyan-400 mx-auto w-fit">{kpi.icon}</div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{kpi.value}</div>
                    <div className="text-xs font-bold text-white/80 leading-tight">{kpi.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-14">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    O nás
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                    REST<span className="text-cyan-400/60">||</span>ART <br />
                    <span className="text-cyan-300 headline-thin">Integrace</span>
                  </h2>
                </div>
                <p className="text-white/40 font-light max-w-md">
                  Propojujeme sociální práci, pracovní integraci a lidský přístup do jednoho funkčního systému.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-white/10 space-y-6">
                  <h3 className="text-3xl text-white font-black tracking-[1.5px] uppercase">Naše mise</h3>
                  <p className="text-white/55 font-light leading-relaxed">
                    Vytváříme cestu zpět pro lidi po výkonu trestu, bez domova, v závislostech nebo v dlouhodobé nezaměstnanosti.
                    Cílem je důstojnost, stabilita a samostatnost.
                  </p>
                  <p className="text-white/40 font-light leading-relaxed">
                    Pracujeme mezi institucemi, obcemi, zaměstnavateli a odborníky. Nejsme jen program, jsme integrační infrastruktura.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: <Users size={24} />, title: 'Komunitní přístup', text: 'Tým s osobní zkušeností i odbornou praxí.' },
                    { icon: <HeartHandshake size={24} />, title: 'Druhá šance', text: 'Každý klient má individuální plán a mentora.' },
                    { icon: <Workflow size={24} />, title: 'Napříč sektory', text: 'Koordinace mezi veřejným a soukromým sektorem.' },
                    { icon: <ShieldCheck size={24} />, title: 'Měřitelný dopad', text: 'Sledujeme stabilizaci, zaměstnání a prevenci recidivy.' }
                  ].map((item, idx) => (
                    <div key={idx} className="glass-panel p-8 rounded-[2rem] border-white/10 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <h4 className="text-lg font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-white/45 font-light leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'pillars':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-14">
              <div className="space-y-5 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                  Pilíře
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Šest pilířů <span className="text-cyan-300 headline-thin">integrace</span>
                </h2>
              </div>

              <div className="space-y-8">
                {pillars.map((pillar) => {
                  const detail = pillarRoadmap.find((entry) => entry.id === pillar.id);
                  const targetPage = pillarPageMap[pillar.id];
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => {
                        if (targetPage) goToPage(targetPage);
                      }}
                      className="w-full text-left glass-panel p-8 md:p-12 rounded-[3rem] border-white/10 grid lg:grid-cols-[auto,1fr,auto] gap-8 items-center group hover:border-cyan-400/25 transition-all"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        {React.cloneElement(pillar.icon as React.ReactElement<{ size?: number }>, { size: 30 })}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-white/45 font-light leading-relaxed">{detail?.focus ?? pillar.description}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black mb-1">Výsledek / směr</p>
                        <p className="text-xl font-bold text-cyan-400">{detail?.stat ?? 'Aktivní'}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-black mt-3">Otevřít detail</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'stories':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-14">
              <div className="space-y-5 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                  Příběhy
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Skutečné <span className="text-cyan-300 headline-thin">restarty</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {storyHighlights.map((story) => (
                  <article key={story.name} className="glass-panel p-8 rounded-[2.5rem] border-white/10 hover:border-cyan-400/25 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group">
                    <div className="h-52 rounded-2xl overflow-hidden border border-white/10 mb-6">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    </div>
                    <p className="text-[10px] text-cyan-400 uppercase tracking-[0.25em] font-black mb-2">{story.pillar}</p>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{story.name}</h3>
                    <p className="text-white/50 font-light italic leading-relaxed mb-6">"{story.quote}"</p>
                    <div className="mt-auto pt-5 border-t border-white/10">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-black mb-1">Aktuální stav</p>
                      <p className="text-sm text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">{story.outcome}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        );
      case 'news':
        return <BlogPage posts={blogPosts} />;
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
                  <h2 className="text-4xl md:text-6xl text-white uppercase text-glow-cyan leading-tight">Vizionář <br /><span className="text-cyan-300 headline-thin">& Design</span></h2>
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
      case 'blog':
        return <BlogPage posts={blogPosts} />;
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
                    <h2 className="text-5xl md:text-[4.5rem] text-white uppercase text-glow-cyan leading-[0.9]">Kontaktujte <br /><span className="text-cyan-300 headline-thin">nás</span></h2>
                    <p className="text-xl text-white/40 font-light max-w-md leading-relaxed">
                      Máte dotaz nebo se chcete zapojit? Napište nám nebo zavolejte. Každý kontakt je krokem k lepší budoucnosti.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <div className="glass-panel p-10 rounded-[2.5rem] space-y-6 border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center"><Landmark size={32} /></div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-1 font-black">Firma</p>
                          <p className="text-2xl font-bold text-white/90">DAVID KOZÁK INTERNATIONAL S.R.O.</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5 text-sm text-white/40 font-light">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">Sídlo</p>
                          <p>Drážďanská 51/52<br />400 07 Ústí nad Labem</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">Identifikace</p>
                          <p>IČO: 23143614<br />DIČ: CZ23143614</p>
                        </div>
                        <div className="md:col-span-2 pt-2 italic text-[10px] leading-relaxed">
                          Zapsaná v obchodním rejstříku vedeném Krajským soudem v Ústí nad Labem, oddíl C, vložka 53832
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { icon: <Phone />, label: 'Telefon', value: '+420 705 217 251', sub: 'Po-Pá: 9:00 - 17:00' },
                        { icon: <Mail />, label: 'Email', value: 'info@david-kozak.com', sub: 'Odpovídáme do 24h' },
                      ].map((item, i) => (
                        <div key={i} className="glass-panel p-10 rounded-[2.5rem] flex items-center gap-8 border-white/5 hover:border-cyan-400/20 transition-all group">
                          <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-1 font-black">{item.label}</p>
                            <p className="text-xl font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{item.value}</p>
                            <p className="text-xs text-white/20 mt-1 font-light">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <a href="https://www.david-kozak.com" target="_blank" className="glass-panel p-10 rounded-[2.5rem] flex items-center gap-8 border-white/5 hover:border-cyan-400/20 transition-all group">
                      <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                        <Globe />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-1 font-black">Web</p>
                        <p className="text-2xl font-bold text-white/90 group-hover:text-cyan-400 transition-colors">www.david-kozak.com</p>
                      </div>
                      <ExternalLink size={20} className="text-white/10 group-hover:text-cyan-400 transition-all" />
                    </a>
                  </div>
                </div>

                <div className="glass-panel p-12 md:p-16 rounded-[4rem] relative overflow-hidden border-cyan-400/10 bg-cyan-500/[0.02]">
                  <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none"><MessageSquare size={200} /></div>
                  <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-3xl text-white font-black uppercase tracking-[1.5px]">Napište nám <span className="text-cyan-300 headline-thin">zprávu</span></h3>
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
      case 'zamer-uvod':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-10 border-b border-white/10 pb-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    Investiční záměr | červen 2025
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                    REST<span className="text-cyan-400/60">||</span>ART <br />
                    <span className="text-cyan-300 headline-thin">Integrace</span>
                  </h2>
                  <p className="text-xl text-white/50 font-light max-w-3xl leading-relaxed">
                    Komplexní podpora reintegrace znevýhodněných osob v režimu sociálně odpovědného podnikání.
                  </p>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 w-full lg:max-w-md space-y-4">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-black">Základní údaje</p>
                  <div className="space-y-3 text-sm text-white/70 font-light">
                    <p><span className="text-white/40">Společnost:</span> DAVID KOZÁK INTERNATIONAL S.R.O.</p>
                    <p><span className="text-white/40">Projekt:</span> REST||ART INTEGRACE</p>
                    <p><span className="text-white/40">Účel:</span> Příloha k žádosti o podporu z OPZ+</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-white/10 space-y-6">
                <h3 className="text-2xl font-bold text-white uppercase tracking-widest">I. Úvod</h3>
                <p className="text-white/50 font-light leading-relaxed">
                  Projekt REST||ART INTEGRACE je zaměřen na resocializaci, rekvalifikaci a začlenění osob, které se ocitly v těžké životní situaci.
                  Cílovou skupinou jsou zejména osoby po výkonu trestu, lidé bez domova, osoby se závislostí, dlouhodobě nezaměstnaní a mládež z ústavní péče.
                </p>
                <p className="text-white/50 font-light leading-relaxed">
                  Projekt funguje v rámci obchodní společnosti a kombinuje podnikatelský přístup s měřitelným společenským dopadem.
                </p>
              </div>
            </div>
          </div>
        );
      case 'zamer-cile':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/10 pb-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    II. Hlavní cíle investice
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                    Co chceme <br /><span className="text-cyan-300 headline-thin">vybudovat</span>
                  </h2>
                </div>
                <p className="text-white/40 font-light max-w-md text-sm">
                  Investice je navržena pro vybudování funkční infrastruktury a spuštění pilotního provozu.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {investmentGoals.map((goal, idx) => (
                  <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border-white/10 flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                      <Target size={22} />
                    </div>
                    <p className="text-white/60 font-light leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'zamer-rozpocet':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/10 pb-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    III. Výše požadované investice
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                    Investiční <br /><span className="text-cyan-300 headline-thin">rozpočet</span>
                  </h2>
                </div>
                <div className="glass-panel p-8 rounded-[2rem] border-white/10">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-black mb-1">Celkem</p>
                  <p className="text-4xl font-black text-white text-glow-cyan">12 100 000 Kč</p>
                </div>
              </div>

              <div className="glass-panel rounded-[3rem] overflow-hidden border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/10 bg-white/5">
                        <th className="p-6 md:p-8 font-black">Oblast investice</th>
                        <th className="p-6 md:p-8 font-black text-right">Náklady</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-white/70">
                      {investmentCosts.map((row, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-6 md:p-8 font-light">{row.area}</td>
                          <td className="p-6 md:p-8 text-right font-black text-cyan-400/90">{row.amount}</td>
                        </tr>
                      ))}
                      <tr className="bg-cyan-500/5">
                        <td className="p-6 md:p-8 font-black uppercase tracking-widest text-white/60 text-xs">Celkem</td>
                        <td className="p-6 md:p-8 text-right font-black text-white text-2xl">12 100 000 Kč</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'zamer-prinos':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="space-y-4 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                  IV. Návratnost a přínos
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Důvod <span className="text-cyan-300 headline-thin">investovat</span>
                </h2>
                <p className="text-white/40 font-light max-w-3xl">
                  Projekt je nastaven jako kombinace sociálního dopadu, ekonomické efektivity a dlouhodobé stabilizace komunit.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {investmentBenefits.map((benefit, idx) => (
                  <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border-white/10 space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      {React.cloneElement(benefit.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                    </div>
                    <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'zamer-harmonogram':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="space-y-4 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                  V. Harmonogram
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Postup <span className="text-cyan-300 headline-thin">realizace</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {projectTimeline.map((item, idx) => (
                  <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-black">
                        Fáze {idx + 1}
                      </span>
                      <CheckCircle size={18} className="text-cyan-400/70" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{item.phase}</h3>
                    <p className="text-white/50 font-light">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'zamer-programy':
        return (
          <div className="pt-32 pb-20 px-6 animate-in fade-in duration-1000 relative overflow-hidden">
            <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="space-y-4 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                  Přehled programů OPZ+
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                  Programy <span className="text-cyan-300 headline-thin">REST||ART</span>
                </h2>
                <p className="text-white/40 font-light max-w-3xl">
                  Programy jsou kombinovatelné dle potřeb klienta a využívají jednotný pětifázový rámec:
                  identifikace, intervence, stabilizace, podpora, přechod.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {opzPrograms.map((program, idx) => (
                  <div key={program.name} className="glass-panel p-8 rounded-[2.5rem] border-white/10 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-bold text-white uppercase tracking-widest">{program.name}</h3>
                      <span className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-black">Program {idx + 1}</span>
                    </div>
                    <div className="space-y-3 text-sm text-white/60 font-light">
                      <p><span className="text-white font-semibold">Cílová skupina:</span> {program.target}</p>
                      <p><span className="text-white font-semibold">Klíčové aktivity:</span> {program.activities}</p>
                      <p><span className="text-white font-semibold">Cíl:</span> {program.goal}</p>
                      <p><span className="text-white font-semibold">Délka:</span> {program.duration}</p>
                    </div>
                  </div>
                ))}
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
                <h1 className="text-5xl md:text-[8rem] font-serif text-white font-black tracking-tighter text-glow-cyan animate-pulse">
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
                  <h2 className="text-4xl md:text-7xl text-white leading-tight text-glow-cyan">
                    Druhou šanci si <br className="hidden md:block" /> zaslouží <span className="text-cyan-300 headline-thin">každý.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light">
                    REST||ART Integrace je kostra nové společnosti. Budujeme udržitelný systém pro ty, které svět přestal vidět.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button onClick={() => goToPage('projects')} className="bg-cyan-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:shadow-cyan-500/30 shadow-xl transition-all">NAŠE PROJEKTY</button>
                    <button onClick={() => goToPage('about')} className="glass-panel text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">O NÁS</button>
                  </div>
                </div>
                <div className="relative group lg:-mt-40">
                  <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-700 border-[16px] border-white/5 bg-white/5">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" alt="Integrace" className="hero-desat w-full h-[600px] object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-10 left-10 text-white italic text-2xl font-serif drop-shadow-lg">"Každý příběh má právo pokračovat."</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-12 px-6 max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {homeStatItems.map((item, idx) => (
                  <div key={item.label} className="glass-panel p-8 rounded-3xl text-center group hover:-translate-y-1 transition-all duration-500 border-white/10">
                    <p className="text-5xl md:text-6xl font-black text-glow-cyan leading-none mb-4">
                      {animatedStats[idx]}{item.suffix}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 font-black">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2.1 MANIFEST: TOTO NENÍ DALŠÍ PROJEKT */}
            <section className="py-32 px-6 relative overflow-hidden bg-[#0D2F2F]/5">
              <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10">
                <div className="space-y-4">
                  <h3 className="text-cyan-400 font-black tracking-[0.4em] text-xs uppercase">Značka druhé šance</h3>
                  <h2 className="text-4xl md:text-7xl text-white tracking-tighter uppercase leading-none">
                    "<span className="font-thin">Toto není</span>
                    <br />
                    <span className="text-glow-cyan font-extrabold">další projekt</span>"
                  </h2>
                </div>
                
                <div className="space-y-12 text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-4xl mx-auto">
                  <p className="italic font-serif text-3xl md:text-4xl text-white">
                    REST||ART není tabulka, není výkaz, není značka pro obálku žádosti. REST||ART je odpověď.
                  </p>
                  <p className="text-white/40">
                    Odpověď na ticho v systému, který roky přehlíží ty, kteří padli. Odpověď na absenci propojení mezi těmi, kteří by měli táhnout za jeden provaz – úřady, neziskové organizace, zaměstnavatelé, státní sektor, lidé s osobní zkušeností.
                  </p>
                  <div className="p-8 md:p-12 rounded-[3rem] bg-white/5 border border-white/10 text-left space-y-6">
                    <p className="text-lg italic leading-relaxed">
                      "My jsme nezačali s grantem. Začali jsme se zážitkem. Se skutečností. S každým člověkem, který se snažil vrátit zpět – a místo otevřených dveří našel jen stigma, bariéru a další pád."
                    </p>
                    <div className="h-px bg-white/10 w-20" />
                    <p className="text-base text-cyan-400/80 font-bold uppercase tracking-widest">Co nabízíme?</p>
                    <p className="text-white/60 text-lg">
                      Nabízíme směr. Nabízíme koncept, který nesoupeří – ale spojuje. Možnost pracovat jako jeden tým napříč institucemi – ne pro výkaz, ale pro výsledek.
                    </p>
                  </div>
                  <p className="text-white/40 text-lg">
                    REST||ART je struktura. Ale především je to morální rozhodnutí. Rozhodnutí neotáčet hlavu pryč. Rozhodnutí nezůstat potichu, když víme, že se dá konat jinak. Rozhodnutí vytvořit značku, která bude znamením podpory – a zároveň závazkem.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 pt-12">
                  {[
                    { label: "Partnerství bez rivality", icon: <Link size={20} /> },
                    { label: "Morální rozhodnutí", icon: <Fingerprint size={20} /> },
                    { label: "Závazek ke změně", icon: <Heart size={20} /> }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors text-center">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* VÝZVA */}
                <div className="pt-24 space-y-10 border-t border-white/5">
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-black font-sans text-white uppercase tracking-[1.5px]">VÝZVA</h3>
                    <p className="text-white/40 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                      Pokud sdílíte tuto vizi – přidejte se. Nemusíte mít připravený rozpočet. Stačí, že máte otevřené srdce, jasný pohled a vůli táhnout.
                    </p>
                  </div>
                  <button onClick={() => setIsContactModalOpen(true)} className="bg-white text-black px-12 py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-cyan-400 transition-all shadow-2xl shadow-white/5">
                    CHCI SE PŘIDAT
                  </button>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,242,234,0.05)_0%,transparent_70%)] pointer-events-none" />
            </section>

             {/* 2.2 MORÁLNÍ KODEX REST||ART */}
             <section className="py-24 px-6 relative overflow-hidden bg-black/40">
               <div className="max-w-7xl mx-auto">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 border-b border-white/5 pb-10">
                   <div className="space-y-6">
                     <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                       Páteř naší práce
                     </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">
                      Morální <br />
                      <span className="text-cyan-300 font-thin font-sans text-glow-cyan tracking-[1.5px]">Kodex</span>
                    </h2>
                   </div>
                   <p className="text-white/30 font-light max-w-sm text-sm leading-relaxed">
                     Tento kodex tvoří závazek vůči všem, kteří s námi vstupují do kontaktu – ať už jako klient, kolega, partner nebo podporovatel.
                   </p>
                 </div>
 
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                     { title: "Člověk na prvním místě", text: "Každý má právo na druhou šanci – bez předsudků, bez stigmat.", icon: <HeartHandshake /> },
                     { title: "Čest a respekt", text: "Veškerá komunikace vychází z principu otevřenosti a lidské důstojnosti.", icon: <Scale /> },
                     { title: "Spolupracujeme, nesoupeříme", text: "Usilujeme o propojení sektorů, nikoli o konkurenci.", icon: <Workflow /> },
                     { title: "Zodpovědná pomoc", text: "Neposkytujeme alibi, ale prostor pro růst. Nabízíme podporu, nikoli závislost.", icon: <ShieldCheck /> },
                     { title: "Smysl a efektivita", text: "Hledáme lidsky i systémově oprávněné kroky. Kombinujeme srdce s rozumem.", icon: <Zap /> },
                     { title: "Nezapomínáme na příběh", text: "Člověk není statistika. Každý má své jméno, kontext a důvod.", icon: <Fingerprint /> },
                     { title: "Kultura důvěry", text: "To, co děláme uvnitř projektu, musí rezonovat i navenek.", icon: <Eye /> },
                     { title: "Inovace a růst", text: "Věříme v kreativitu jako nástroj pro růst jednotlivce i systému.", icon: <Lightbulb /> }
                   ].map((item, i) => (
                     <div key={i} className="glass-panel p-8 rounded-[2.5rem] space-y-4 hover:border-cyan-400/30 transition-all group">
                       <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                       </div>
                       <h3 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                       <p className="text-xs text-white/40 font-light leading-relaxed">{item.text}</p>
                     </div>
                   ))}
                 </div>
               </div>
             </section>

             {/* 2.3 SKUTEČNÉ PŘÍBĚHY ZMĚNY */}
             <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Důkaz, že to jde
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                      Příběhy <br /><span className="text-glow-cyan font-thin font-sans tracking-[1.5px]">REST||ARTU</span>
                    </h2>
                    <p className="text-xl text-white/40 font-light max-w-2xl mx-auto">
                      Změna vychází zevnitř. REST||ART staví na motivaci a inspiraci skrze lidi, kteří už svou cestu našli.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    {[
                      {
                        name: "Erik Horváth",
                        tag: "Bývalý dealer & vězeň",
                        now: "Elektrikář & Otec rodiny",
                        text: "Erik prošel restartem skrze práci v zahraničí. Dnes je vyléčený ze závislosti, pracuje jako elektrikář a žije se svou rodinou, která má zpět svého otce.",
                        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                      },
                      {
                        name: "Mio Prešíč",
                        tag: "Bývalý vězeň",
                        now: "Spolumajitel sítě automyček",
                        text: "Díky spolupráci s DKI s.r.o. a dvouleté práci v Německu nalezl Mio novou cestu. Dnes je úspěšným podnikatelem a inspirací pro ostatní.",
                        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
                      }
                    ].map((story, i) => (
                      <div key={i} className="glass-panel p-8 md:p-12 rounded-[4rem] border-white/5 flex flex-col md:flex-row gap-10 hover:bg-white/[0.02] transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none text-cyan-400"><Quote size={120} /></div>
                        <div className="w-full md:w-48 h-64 md:h-auto rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white/5">
                          <img src={story.img} alt={story.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="space-y-6 relative z-10">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400/60">{story.tag}</span>
                            <h3 className="text-3xl font-black text-white">{story.name}</h3>
                            <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest block">{story.now}</span>
                          </div>
                          <p className="text-white/40 font-light leading-relaxed italic">
                            "{story.text}"
                          </p>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                            <div className="w-8 h-px bg-white/10" /> Real Story
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </section>

            {/* 2.5 ANOTACE PROJEKTU */}
            <section className="py-24 px-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
              
              <div className="max-w-7xl mx-auto">
                <div className="glass-panel p-12 md:p-20 rounded-[4rem] border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -rotate-12">
                    <LayoutGrid size={300} className="text-cyan-400" />
                  </div>
                  
                  <div className="relative z-10 space-y-12">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                        Anotace Projektu
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-glow-cyan">
                        REST<span className="text-cyan-400/50 mx-1">||</span>ART INTEGRACE
                      </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                      <div className="space-y-8">
                        <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
                          REST||ART INTEGRACE je komplexní program sociálního začlenění a profesní obnovy zaměřený na osoby ohrožené exkluzí (vězni, bezdomovci, závislí).
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Navýšení kapacity</h5>
                            <p className="text-xl font-bold text-white">+ 50 účastníků / rok</p>
                          </div>
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-teal-400">Nová místa</h5>
                            <p className="text-xl font-bold text-white">10 pracovních míst</p>
                          </div>
                        </div>
                        <p className="text-sm text-white/30 font-light leading-relaxed">
                          Cílem investice je vybudovat stabilní zázemí, pořízení technického vybavení, rekonstrukci prostor pro školení, mentoring a terapeutické aktivity.
                        </p>
                      </div>

                      <div className="space-y-10 bg-white/5 p-10 rounded-[3rem] border border-white/5">
                        <div className="space-y-4">
                          <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-black">Investiční Záměr</h4>
                          <p className="text-3xl font-bold text-white leading-tight">14 000 000 Kč</p>
                          <p className="text-sm text-white/30 font-light leading-relaxed">
                            Prostředky jsou směřovány do infrastruktury programu, školících místností a technického zázemí pro pracovní nácvik v pilotních lokalitách.
                          </p>
                        </div>
                        
                        <div className="h-px bg-white/10 w-full" />

                        <div className="space-y-4">
                          <h4 className="text-[10px] uppercase tracking-[0.4em] text-teal-400 font-black">Udržitelnost & Vize</h4>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400"><Rocket size={24} /></div>
                            <p className="text-2xl font-bold text-white">INTEGR!A</p>
                          </div>
                          <p className="text-sm text-white/30 font-light leading-relaxed">
                            Vytvoření hybridního sociálního podniku, který reinvestuje výnosy zpět do dalšího rozvoje a stability programu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.52 PROVOZNÍ ROZPOČET */}
            <section className="py-24 px-6 relative overflow-hidden bg-black/40">
              <div className="max-w-7xl mx-auto space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Finanční Udržitelnost
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">Provozní <br /><span className="text-cyan-300 headline-thin">Rozpočet</span></h2>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-400/20 p-8 rounded-3xl">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Celkový roční náklad</p>
                    <p className="text-4xl font-black text-white">2 970 000 Kč</p>
                  </div>
                </div>

                <div className="glass-panel rounded-[3rem] overflow-hidden border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5 bg-white/5">
                          <th className="p-8 font-black">Kategorie</th>
                          <th className="p-8 font-black">Příklad výdajů</th>
                          <th className="p-8 font-black text-right">Měsíční náklad</th>
                          <th className="p-8 font-black text-right text-cyan-400">Roční náklad</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-white/60">
                        {[
                          { cat: "Osobní náklady", ex: "Koordinátor, referenti, psycholog, lektor", m: "120 000 Kč", y: "1 440 000 Kč" },
                          { cat: "Služby", ex: "Právní služby, účetní, externí mentoři", m: "30 000 Kč", y: "360 000 Kč" },
                          { cat: "Jazykové kurzy", ex: "Výuka NJ/AJ, učebnice, lektor externí / interní", m: "20 000 Kč", y: "240 000 Kč" },
                          { cat: "Materiál", ex: "Vzdělávací pomůcky, pracovní vybavení, tiskoviny", m: "15 000 Kč", y: "180 000 Kč" },
                          { cat: "Provozní náklady", ex: "Kancelář, energie, internet, technika", m: "25 000 Kč", y: "300 000 Kč" },
                          { cat: "Cestovné", ex: "Výjezdy do věznic, klientů, doprovod", m: "10 000 Kč", y: "120 000 Kč" },
                          { cat: "Publicita a PR", ex: "Web, letáky, výroční zpráva, transparentnost", m: "5 000 Kč", y: "60 000 Kč" },
                          { cat: "Nepřímé náklady", ex: "Paušál 10 % z přímých nákladů", m: "-", y: "270 000 Kč" }
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-8 font-bold text-white/80">{row.cat}</td>
                            <td className="p-8 text-xs font-light text-white/40">{row.ex}</td>
                            <td className="p-8 text-right font-mono text-xs">{row.m}</td>
                            <td className="p-8 text-right font-black text-cyan-400/80 group-hover:text-cyan-400 transition-colors">{row.y}</td>
                          </tr>
                        ))}
                        <tr className="bg-cyan-500/5">
                          <td colSpan={3} className="p-8 text-right font-black uppercase tracking-widest text-white/40 text-xs">Celkový Roční Rozpočet</td>
                          <td className="p-8 text-right font-black text-2xl text-white text-glow-cyan">2 970 000 Kč</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8">
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-cyan-400">
                      <Wallet size={20} />
                      <h4 className="font-black uppercase tracking-widest text-xs">Udržitelnost</h4>
                    </div>
                    <p className="text-xs text-white/30 font-light leading-relaxed">
                      Projekt počítá s vícezdrojovým financováním kombinujícím vlastní výnosy z pracovní integrace, dotace a partnerství se soukromým sektorem.
                    </p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-teal-400">
                      <BarChart size={20} />
                      <h4 className="font-black uppercase tracking-widest text-xs">Efektivita výdajů</h4>
                    </div>
                    <p className="text-xs text-white/30 font-light leading-relaxed">
                      Každá investovaná koruna do prevence a reintegrace šetří státu 13 korun v nákladech na vězeňství a sociální systém.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.55 SÍŤ PARTNERSTVÍ & PROGRAMY */}
            <section className="py-24 px-6 relative bg-black/20">
              <div className="max-w-7xl mx-auto space-y-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Spolupráce & Systém
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">Síť <br /><span className="text-cyan-300 headline-thin">Partnerství</span></h2>
                  </div>
                  <p className="text-white/30 font-light max-w-sm text-sm leading-relaxed">
                    REST||ART není izolovaný projekt. Je to zastřešující platforma pro státní sféru, neziskový sektor a komerční partnery.
                  </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                  {[
                    { title: "Vězeňská služba ČR", items: ["GŘ VSČR", "Jiřice", "Stráž p. R.", "Rýnovice", "Kynšperk", "Slavkov", "Valdice", "Brno"], icon: <ShieldCheck /> },
                    { title: "Státní správa", items: ["MPSV", "Ministerstvo vnitra", "MPO", "Hospodářská komora", "ÚP Ústí n. L.", "ÚP Česká Lípa", "ÚP Liberec"], icon: <Landmark /> },
                    { title: "Neziskový sektor", items: ["Rubikon Centrum", "Romodrom", "Volonté", "K SRDCI KLÍČ", "CSS Děčín", "CSS Ústí n. L."], icon: <HeartHandshake /> },
                    { title: "Strategické Cíle", items: ["Regionální pobočky", "Národní značka", "Evropská úroveň (ESF+)", "Erasmus+ spolupráce"], icon: <Globe /> }
                  ].map((cat, i) => (
                    <div key={i} className="glass-panel p-8 rounded-[3rem] border-white/5 space-y-6 hover:bg-white/[0.02] transition-all">
                      <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
                        {React.cloneElement(cat.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-widest uppercase border-b border-white/5 pb-4">{cat.title}</h3>
                      <ul className="space-y-3">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-3 text-xs text-white/40 font-light group cursor-default">
                            <div className="w-1 h-1 rounded-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-colors" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Tabulka Programů */}
                <div className="space-y-12 pt-20">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center"><LayoutGrid size={24} /></div>
                    <h3 className="text-3xl text-white font-black uppercase tracking-[1.5px]">Programy v <span className="text-cyan-300 headline-thin">detailu</span></h3>
                  </div>

                  <div className="glass-panel rounded-[3rem] overflow-hidden border-white/5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5 bg-white/5">
                            <th className="p-8 font-black">Program</th>
                            <th className="p-8 font-black">Zaměření</th>
                            <th className="p-8 font-black">Klíčové prvky</th>
                            <th className="p-8 font-black">Místa realizace</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-white/60">
                          {[
                            { name: "JAILBREAK", target: "Práce s odsouzenými", features: "Podpora ve VTOS, úřední záležitosti, po VTOS práce v cizině (3m trial v NO).", places: "Věznice, Neziskovky" },
                            { name: "REWORK", target: "Nezaměstnaní", features: "Kurzy, stáže, poradenství, rekvalifikace, přímé zaměstnání.", places: "ÚP, Firmy, Centra" },
                            { name: "STREETWISE", target: "Lidé bez domova", features: "Motivace, hygiena, ubytování, budování důvěry.", places: "Terén, Nízkoprahy" },
                            { name: "RESET", target: "Drogově závislí", features: "Rehabilitace, práce, terapie, zapojení jako dobrovolníci/lektoři.", places: "K-centra, Ubytovny" },
                            { name: "MÍSTO ZLOMU", target: "Prevence mládeže", features: "Mentoring, přednášky o řemeslech, komunitní aktivity.", places: "Dětské domovy, Školy" },
                            { name: "STABILIZACE", target: "Udržení změny", features: "Bydlení, stabilní práce, komunitní začlenění.", places: "Integrační centra" }
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                              <td className="p-8 font-black text-cyan-400 tracking-widest">{row.name}</td>
                              <td className="p-8 font-bold text-white/80">{row.target}</td>
                              <td className="p-8 font-light text-white/40 leading-relaxed text-xs">{row.features}</td>
                              <td className="p-8 text-xs font-mono opacity-50">{row.places}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.6 DETAILNÍ PROJEKT: REWORK */}
            <section className="py-24 px-6 relative bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent">
              <div className="max-w-7xl mx-auto space-y-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Detailní Projektový Záměr
                    </div>
                    <h2 className="text-4xl md:text-7xl text-white uppercase leading-tight text-glow-cyan">
                      RE<span className="text-cyan-300 headline-thin">WORK</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-xs text-white/20 uppercase tracking-widest font-black">
                      <div className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500" /> David Kozák International s.r.o.</div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500" /> IČO: 23143614</div>
                      <div className="flex items-center gap-2 md:col-span-2"><div className="w-1 h-1 bg-cyan-500" /> Drážďanská 51/52, 400 07 Ústí nad Labem</div>
                    </div>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400"><Users size={32} /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Zodpovědná osoba</p>
                      <p className="text-xl font-bold text-white">David Kozák</p>
                      <p className="text-xs text-cyan-400 font-light">Majitel projektu</p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {[
                    { icon: <BarChart />, title: "1. VÝCHOZÍ SITUACE", text: "Program REWORK vzniká jako odpověď na zásadní nesoulad mezi počtem uchazečů o zaměstnání a dostupnými pracovními místy. V regionech se pohybuje nad 3–4 uchazeči na 1 VPM." },
                    { icon: <Target />, title: "2. CÍL PROGRAMU", text: "Příprava osob v evidenci ÚP na úspěšný nástup do stabilního zaměstnání formou diagnostiky, rekvalifikací a dlouhodobého mentoringu." },
                    { icon: <Users />, title: "3. CÍLOVÁ SKUPINA", text: "Dlouhodobě nezaměstnaní, osoby bez praxe, lidé se zadlužením, po závislostech či s bariérami v oblasti vzdělání a trestní minulosti." },
                    { icon: <Activity />, title: "4. KLÍČOVÉ AKTIVITY", text: "Individuální plány, rekvalifikační kurzy, simulované pracovní pozice, finanční poradenství a asistence při hledání běžného zaměstnání." },
                    { icon: <Wallet />, title: "5. ZDROJE A PODPORA", text: "Aktivní využití SÚPM (společensky účelná pracovní místa), příspěvky na zapracování, rekvalifikace z ÚP a doprovodné služby." },
                    { icon: <CheckCircle />, title: "6. ZÁVĚREČNÉ HODNOCENÍ", text: "Vytváříme model, který umožňuje osobám před přímým nástupem do zaměstnání absolvovat nácvik, zažít úspěch a obnovit dovednosti." }
                  ].map((card, i) => (
                    <div key={i} className="glass-panel p-10 rounded-[3rem] space-y-6 hover:bg-cyan-500/5 transition-all group">
                      <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {card.icon}
                      </div>
                      <h3 className="text-lg font-black tracking-widest uppercase text-white group-hover:text-cyan-400 transition-colors">{card.title}</h3>
                      <p className="text-sm text-white/40 font-light leading-relaxed">{card.text}</p>
                    </div>
                  ))}
                </div>

                {/* Statistiky a tabulky */}
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <h3 className="text-3xl text-white font-black uppercase tracking-[1.5px]">Analýza trhu & <span className="text-cyan-300 headline-thin">efektivita</span></h3>
                    <div className="flex gap-4">
                      <div className="bg-cyan-500/10 border border-cyan-400/20 px-6 py-3 rounded-2xl">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block mb-1">Ratio UOZ/VPM</span>
                        <span className="text-2xl font-black text-white">3.3 - 3.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="glass-panel rounded-[3rem] overflow-hidden border-white/5">
                      <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-white/40">Srovnání Poptávka / Nabídka</span>
                        <TrendingDown size={16} className="text-cyan-400" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                              <th className="p-6 font-black">Datum</th>
                              <th className="p-6 font-black">Uchazeči (UOZ)</th>
                              <th className="p-6 font-black">Místa (VPM)</th>
                              <th className="p-6 font-black text-cyan-400">Poměr (na 1 VPM)</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-white/60">
                            {[
                              { date: "31.01.2025", uoz: "320 516", vpm: "83 323", ratio: "3.85" },
                              { date: "28.02.2025", uoz: "326 223", vpm: "88 062", ratio: "3.70" },
                              { date: "31.03.2025", uoz: "322 140", vpm: "91 752", ratio: "3.51" },
                              { date: "30.04.2025", uoz: "318 540", vpm: "95 798", ratio: "3.33" }
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-6 font-mono text-xs">{row.date}</td>
                                <td className="p-6 font-bold text-white/80">{row.uoz}</td>
                                <td className="p-6 font-bold text-white/80">{row.vpm}</td>
                                <td className="p-6 font-black text-cyan-400">{row.ratio}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="glass-panel rounded-[3rem] overflow-hidden border-white/5">
                      <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-white/40">Fáze integrace REWORK</span>
                        <TrendingUp size={16} className="text-teal-400" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                              <th className="p-6 font-black">Aktivita</th>
                              <th className="p-6 font-black">Fáze</th>
                              <th className="p-6 font-black text-teal-400">Nástroj ÚP</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-white/60">
                            {[
                              { act: "Diagnostika & Plán", phase: "1 - Motivace", tool: "Interní / ÚP" },
                              { act: "Rekvalifikace", phase: "2 - Školení", tool: "ÚP kurz" },
                              { act: "Asistovaná pozice", phase: "3 - Adaptace", tool: "SÚPM" },
                              { act: "Mentoring", phase: "3 - Adaptace", tool: "Příspěvek" },
                              { act: "Dluhové poradenství", phase: "2-4 - Podpora", tool: "Projektový" },
                              { act: "Zprostředkování", phase: "5 - Volný trh", tool: "Spolupráce" }
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-6 font-bold text-white/80">{row.act}</td>
                                <td className="p-6 text-xs">{row.phase}</td>
                                <td className="p-6 font-black text-teal-400 uppercase text-[10px] tracking-widest">{row.tool}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.7 VIZE A STRATEGIE */}
            <section className="py-24 px-6 relative overflow-hidden">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Kapitola 2.1: Cíl Projektu
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-glow-cyan uppercase leading-tight">
                      Vize sociální <br /><span className="text-cyan-300 headline-thin">reintegrace</span>
                    </h2>
                  </div>
                  
                  <div className="space-y-8 text-xl text-white/70 font-light leading-relaxed">
                    <p>
                      Cílem projektu REST||ART je vytvořit komplexní, propojený systém sociální reintegrace, který přetváří jednotlivce bez budoucnosti ve stabilní součást společnosti.
                    </p>
                    <p className="text-lg text-white/40">
                      Nechceme se pouštět do iluze, že změníme celý systém. Ale chceme změnit způsob, jakým se k jednotlivcům na jeho okraji přistupuje. Zaměřujeme se na dlouhodobé problémy – nezaměstnanost, recidivu, závislosti – a hledáme způsob, jak z nich vytvořit fungující sílu.
                    </p>
                  </div>

                  <div className="glass-panel p-8 rounded-[2.5rem] border-cyan-400/10 bg-cyan-500/[0.02] space-y-4">
                    <div className="flex items-center gap-4 text-cyan-400">
                      <Workflow size={24} />
                      <h4 className="font-bold tracking-widest uppercase text-xs">Zastřešující platforma</h4>
                    </div>
                    <p className="text-sm text-white/40 font-light leading-relaxed">
                      REST||ART usiluje o propojení všech aktérů. Chceme vytvořit platformu, pod kterou nebude nutné bojovat o dotace, ale kde bude balík koordinovaně přerozdělen podle skutečné potřeby.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-[4rem] blur-3xl -z-10 animate-pulse" />
                  <div className="glass-panel p-12 md:p-16 rounded-[4rem] border-white/5 space-y-12">
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center"><Flag size={32} /></div>
                      <h3 className="text-3xl text-white font-black uppercase tracking-[1.5px]">Definice <span className="text-cyan-300 headline-thin">úspěchu</span></h3>
                      <p className="text-white/50 font-light leading-relaxed italic text-lg">
                        "Úspěch není grant. Úspěch je člověk, který byl dřív v base nebo na ulici – a dnes má práci, bydlení a je inspirací pro ostatní."
                      </p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400"><Award size={20} /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white/80">Ambasadoři změny</h4>
                      </div>
                      <p className="text-sm text-white/30 font-light leading-relaxed">
                        U osob závislých počítáme s jejich zaměstnáním přímo pod značkou DKI jako ambasadorů, kteří sdílejí svou zkušenost. Podmínkou je potvrzená abstinence a spolupráce se sociálními službami.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.8 PILOTNÍ PLÁN: JIŘICE */}
            <section className="py-24 px-6 relative bg-[#0D2F2F]/10">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1 relative group">
                    <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white/5 shadow-2xl transition-all duration-700 group-hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="bg-black/60 p-12 space-y-8 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400"><Building2 size={28} /></div>
                          <div>
                            <h4 className="text-xl font-bold text-white uppercase tracking-widest">Věznice Jiřice</h4>
                            <p className="text-xs text-cyan-400 font-light">Lokace pilotního plánu</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-white/60 text-sm font-light">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Pronájem skladové haly
                          </div>
                          <div className="flex items-center gap-4 text-white/60 text-sm font-light">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Zaměstnávání osob ve výkonu trestu
                          </div>
                          <div className="flex items-center gap-4 text-white/60 text-sm font-light">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Dohled VSČR + civilní pracovníci
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="order-1 lg:order-2 space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                      Konkrétní Pilotní Plán
                    </div>
                    <h2 className="text-5xl md:text-6xl text-white uppercase leading-tight text-glow-cyan">
                      JAILBREAK <br /><span className="text-cyan-300 headline-thin">+ REWORK + STREETWISE</span>
                    </h2>
                    <p className="text-lg text-white/40 font-light leading-relaxed">
                      V tomto prostoru lze zaměstnat osoby ve výkonu trestu, ale také civilní pracovníky z řad dlouhodobě nezaměstnaných nebo lidí bez domova. Tím se propojuje několik cílových skupin v jednom provozu.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Logistika & Bezpečnost</h5>
                        <p className="text-xs text-white/40 leading-relaxed font-light">Zajišťují státní složky (ÚP, věznice).</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-teal-400">Terénní práce</h5>
                        <p className="text-xs text-white/40 leading-relaxed font-light">Zajišťuje neziskový sektor.</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/20 italic font-light">
                      Tento model slouží jako důkazní prvek pro rozvoj a duplikaci REST||ART v dalších regionech.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.85 METODIKA & ČASOVÝ PLÁN */}
            <section className="py-24 px-6 relative overflow-hidden bg-black/40">
              <div className="max-w-7xl mx-auto space-y-24">
                <div className="grid lg:grid-cols-2 gap-20">
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                        Jak pracujeme
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">Fázový model <br /><span className="text-cyan-300 headline-thin">Metodiky</span></h2>
                    </div>

                    <div className="space-y-4">
                      {[
                        { step: "FÁZE 1", title: "Identifikace a oslovení", desc: "Mapování a vstupní kontakt s cílovou skupinou." },
                        { step: "FÁZE 2", title: "První intervence", desc: "Mentoring, smluvní rámec a počáteční podpora." },
                        { step: "FÁZE 3", title: "Pracovní aktivace", desc: "Rekvalifikace, trénink a spolupráce s ÚP." },
                        { step: "FÁZE 4", title: "Stabilizace a opora", desc: "Ubytování, návazné služby a terénní tým." },
                        { step: "FÁZE 5", title: "Udržení a autonomie", desc: "Přechod do civilní sítě a posílení samostatnosti." }
                      ].map((phase, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-6 border-white/5 hover:border-cyan-400/20 transition-all group">
                          <div className="text-xs font-black text-cyan-400/40 group-hover:text-cyan-400 transition-colors w-12">{phase.step}</div>
                          <div className="h-8 w-px bg-white/10" />
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">{phase.title}</h4>
                            <p className="text-xs text-white/30 font-light">{phase.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/5 border border-teal-400/20 text-teal-400 text-[10px] tracking-[0.3em] font-black uppercase">
                        Milníky Realizace
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">Časová <br /><span className="text-teal-300 headline-thin">Osa 2025+</span></h2>
                    </div>

                    <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                      {[
                        { time: "09/2025", title: "Zahájení & Příprava", desc: "Formální spuštění projektu a příprava infrastruktury." },
                        { time: "11/2025", title: "Investiční fáze", desc: "Pořízení vybavení, rekonstrukce a školící zázemí." },
                        { time: "01/2026", title: "Pilotní spuštění", desc: "Prvních 10 účastníků v mentoringovém systému." },
                        { time: "04/2026", title: "Provoz Jiřice", desc: "Zahájení práce v Jiřicích (VTOS + civil)." },
                        { time: "08/2026", title: "Škálování", desc: "Navýšení kapacity na 50 účastníků ročně." },
                        { time: "12/2026", title: "Vyhodnocení", desc: "Kompletace první fáze a transformace v INTEGR!A." }
                      ].map((milestone, i) => (
                        <div key={i} className="relative pl-12 group">
                          <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] group-hover:scale-150 transition-transform" />
                          <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">{milestone.time}</div>
                          <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">{milestone.title}</h4>
                          <p className="text-xs text-white/30 font-light leading-relaxed">{milestone.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Indikátory Úspěšnosti */}
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 pt-12 border-t border-white/5">
                  {[
                    { label: "Počet osob", value: "KPI 01", icon: <Users size={16} /> },
                    { label: "Zaměstnanost", value: "KPI 02", icon: <Briefcase size={16} /> },
                    { label: "Mentoring", value: "KPI 03", icon: <Heart size={16} /> },
                    { label: "Stabilní bydlení", value: "KPI 04", icon: <Home size={16} /> },
                    { label: "Snížení recidivy", value: "KPI 05", icon: <ShieldCheck size={16} /> },
                    { label: "Absence drog", value: "KPI 06", icon: <Activity size={16} /> }
                  ].map((kpi, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl text-center space-y-3 hover:bg-cyan-500/5 transition-all">
                      <div className="text-cyan-400 mx-auto w-fit">{kpi.icon}</div>
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{kpi.value}</div>
                      <div className="text-xs font-bold text-white/80 leading-tight">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2.9 NARATIVNÍ SEKCE: CESTA K RECIDIVĚ */}
            <section className="py-24 px-6 relative bg-[#051111]">
              <div className="max-w-7xl mx-auto space-y-32">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    Příčina a Následek
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-tight">
                    Kde to <span className="text-red-400 headline-thin">začíná?</span>
                  </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 relative">
                  {/* Connecting lines for desktop */}
                  <div className="hidden lg:block absolute top-1/2 left-1/3 w-1/6 h-px bg-gradient-to-r from-red-500/50 to-transparent -translate-y-1/2" />
                  <div className="hidden lg:block absolute top-1/2 left-2/3 w-1/6 h-px bg-gradient-to-r from-red-500/50 to-transparent -translate-y-1/2" />

                  {/* BOD ZLOMU */}
                  <div className="glass-panel p-10 rounded-[3rem] border-red-500/10 space-y-8 relative group hover:border-red-500/30 transition-all">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><ShieldAlert size={32} /></div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black tracking-widest text-white uppercase">BOD ZLOMU</h3>
                      <p className="text-white/40 font-light leading-relaxed">
                        U mnoha lidí začíná příběh v dětském domově. Bez rodinných vzorců, bez vztahových kotvicích bodů. Tam se láme charakter.
                      </p>
                    </div>
                    <ul className="space-y-3 text-[10px] text-red-400/60 font-black uppercase tracking-widest">
                      <li className="flex items-center gap-2">👉 Přizpůsobení skupině</li>
                      <li className="flex items-center gap-2">👉 Rezignace & Ztráta motivace</li>
                      <li className="flex items-center gap-2">👉 Útěky z reality (závislosti)</li>
                      <li className="flex items-center gap-2">👉 Odmítání autorit (kriminalita)</li>
                    </ul>
                  </div>

                  {/* JAILBREAK (RIZIKO) */}
                  <div className="glass-panel p-10 rounded-[3rem] border-red-500/10 space-y-8 relative group hover:border-red-500/30 transition-all lg:mt-12">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Gavel size={32} /></div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black tracking-widest text-white uppercase">JAILBREAK</h3>
                      <p className="text-white/40 font-light leading-relaxed">
                        Po výkonu trestu chybí důvěra, zázemí a přijetí. Bez změny prostředí se člověk vrací tam, kde selhal.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400 font-bold italic">
                      "Recidiva není otázka šance. Je to jistota."
                    </div>
                  </div>

                  {/* REWORK (RIZIKO) */}
                  <div className="glass-panel p-10 rounded-[3rem] border-red-500/10 space-y-8 relative group hover:border-red-500/30 transition-all lg:mt-24">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingDown size={32} /></div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black tracking-widest text-white uppercase">REWORK</h3>
                      <p className="text-white/40 font-light leading-relaxed">
                        Naučená bezmoc. Zvyk "mít za nic". Neřešení problémů, dokud se nehroutí. Cesta zpět k zoufalství a krádežím.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-red-500 animate-pulse">
                      <AlertCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Kritický řetězec selhání</span>
                    </div>
                  </div>
                </div>

                {/* PROČ TO NEFUNGUJE */}
                <div className="grid lg:grid-cols-2 gap-16 items-center pt-20">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[1.5px] leading-tight">Proč to <span className="text-red-400 headline-thin">nefunguje?</span></h2>
                    <p className="text-xl text-white/40 font-light leading-relaxed">
                      Každý článek systému – ústav, úřad, neziskovka, kurátor, terapeut – funguje sám za sebe. Není tu jeden jazyk. Jeden cíl. Jedna značka odpovědnosti.
                    </p>
                    <div className="flex gap-4">
                      <div className="w-px h-20 bg-gradient-to-b from-red-500 to-transparent" />
                      <p className="text-sm text-white/30 italic font-light max-w-sm">
                        Fragmentace systému je největší bariérou skutečné životní změny.
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel p-12 md:p-16 rounded-[4rem] border-cyan-400/20 bg-cyan-500/[0.02] space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none"><Zap size={200} className="text-cyan-400" /></div>
                    <div className="space-y-6 relative z-10">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                        Řešení = REST||ART
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-widest uppercase">Sjednocená <br /><span className="text-cyan-300 headline-thin">odpovědnost</span></h3>
                      <p className="text-white/60 font-light leading-relaxed">
                        REST||ART není jen soubor programů. Je to strukturovaná cesta, kde jeden program navazuje na druhý. Systém, který konečně spolu mluví.
                      </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 italic font-serif text-xl text-cyan-100 leading-relaxed">
                      "Nečekáme, až lidé spadnou. Ale ani je nenecháme ležet."
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.92 KLÍČOVÁ ČÍSLA: EKONOMIKA VS. REINTEGRACE */}
            <section className="py-24 px-6 relative overflow-hidden bg-[#0D2F2F]/10">
              <div className="max-w-7xl mx-auto space-y-20">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                    Ekonomický Dopad
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-tight">
                    Klíčová <span className="text-cyan-300 headline-thin">čísla</span>
                  </h2>
                  <p className="text-xl text-white/40 font-light">
                    Vězeňství není jen sociální téma. Je to obrovská zátěž pro státní rozpočet, kterou lze efektivně snížit.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Náklady na vězeňství */}
                  <div className="glass-panel p-10 md:p-16 rounded-[4rem] border-red-500/10 bg-red-500/[0.02] space-y-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none text-red-500 group-hover:scale-110 transition-transform"><TrendingUp size={200} /></div>
                    <div className="space-y-6 relative z-10">
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest border-b border-red-500/20 pb-6">Náklady na vězeňství</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-red-400/60 uppercase tracking-widest">Denně / 1 vězeň</p>
                          <p className="text-4xl font-bold text-white leading-none">1 773 Kč</p>
                          <p className="text-[10px] text-white/20 font-light italic">Průměr za rok 2022</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-red-400/60 uppercase tracking-widest">Ročně / 1 vězeň</p>
                          <p className="text-4xl font-bold text-white leading-none">647 145 Kč</p>
                        </div>
                      </div>

                      <div className="pt-8 space-y-4">
                        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20">
                          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Celkové roční náklady ČR</p>
                          <p className="text-5xl font-black text-white tracking-tighter">13,5 mld. Kč</p>
                        </div>
                        <div className="flex items-center gap-4 text-red-400">
                          <div className="w-16 h-1 bg-red-500" />
                          <p className="text-xs font-black uppercase tracking-widest">Míra recidivy v ČR: až 70 %</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cesta REST||ART */}
                  <div className="glass-panel p-10 md:p-16 rounded-[4rem] border-cyan-400/20 bg-cyan-500/[0.02] space-y-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none text-cyan-400 group-hover:scale-110 transition-transform"><TrendingDown size={200} /></div>
                    <div className="space-y-6 relative z-10">
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest border-b border-cyan-400/20 pb-6">Cesta REST||ART</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Náklady na reintegraci</p>
                          <p className="text-4xl font-bold text-white leading-none">50 000 Kč</p>
                          <p className="text-[10px] text-white/20 font-light italic">Investice do změny / 1 vězeň</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Míra recidivy</p>
                          <p className="text-4xl font-bold text-cyan-400 leading-none">17 %</p>
                          <p className="text-[10px] text-white/20 font-light italic">Při zapojení do programů</p>
                        </div>
                      </div>

                      <div className="pt-8 space-y-6">
                        <div className="p-8 rounded-3xl bg-cyan-500/10 border border-cyan-400/20">
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">Návratnost investice</p>
                          <div className="flex items-end gap-3">
                            <p className="text-5xl font-black text-white tracking-tighter">13x</p>
                            <p className="text-sm text-white/40 mb-2 font-light leading-tight">Nižší náklady oproti jednomu roku ve vězení.</p>
                          </div>
                        </div>
                        <p className="text-xs text-white/30 font-light leading-relaxed italic">
                          "Měníme záporná čísla rozpočtu na ty kladná. Investice do člověka je nejvýnosnější strategií státu."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

             {/* 2.95 SERVIS, PŘÍNOS & TÝM */}
             <section className="py-24 px-6 relative overflow-hidden bg-black/40">
               <div className="max-w-7xl mx-auto space-y-24">
                 <div className="grid lg:grid-cols-2 gap-20">
                   <div className="space-y-12">
                     <div className="space-y-6">
                       <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-400/20 text-cyan-400 text-[10px] tracking-[0.3em] font-black uppercase">
                         Co nabízíme
                       </div>
                       <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">Servis pro <br /><span className="text-cyan-300 headline-thin">Účastníky</span></h2>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-6">
                       {[
                         { title: "Zaměstnání", text: "Přímé propojení na partnery v zahraničí (Německo). Reálné zakázky, ne umělá místa.", icon: <Briefcase /> },
                         { title: "Mentoring", text: "Podpora od lidí s osobní zkušeností (VTOS, závislosti). Průvodce změnou.", icon: <HeartHandshake /> },
                         { title: "Ubytování", text: "Pomoc při hledání a administrativa ve spolupráci se sociálními službami.", icon: <Home /> },
                         { title: "Rekvalifikace", text: "Vlastní vzdělávací moduly a spolupráce s ÚP na kurzech.", icon: <Award /> },
                         { title: "Práce s institucemi", text: "Překládáme potřeby klientů do jazyka systému. Jednáme za vás.", icon: <Landmark /> }
                       ].map((service, i) => (
                         <div key={i} className="glass-panel p-6 rounded-2xl space-y-3 border-white/5 hover:bg-cyan-500/5 transition-all group">
                           <div className="text-cyan-400 group-hover:scale-110 transition-transform">{React.cloneElement(service.icon as React.ReactElement<{ size?: number }>, { size: 20 })}</div>
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest">{service.title}</h4>
                           <p className="text-[10px] text-white/40 font-light leading-relaxed">{service.text}</p>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="space-y-12">
                     <div className="space-y-6">
                       <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/5 border border-teal-400/20 text-teal-400 text-[10px] tracking-[0.3em] font-black uppercase">
                         Pro Partnery
                       </div>
                       <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">Přínos <br /><span className="text-teal-300 headline-thin">Veřejnosti</span></h2>
                     </div>

                     <div className="space-y-6">
                       <div className="glass-panel p-8 rounded-[3rem] border-teal-500/10 bg-teal-500/[0.02] space-y-4">
                         <h4 className="font-bold text-white uppercase tracking-widest text-sm">Značka Odpovědnosti</h4>
                         <p className="text-sm text-white/40 font-light leading-relaxed">
                           Firmám nabízíme partnerství značky REST||ART. Je to vyjádření: „Pomáháme, protože chceme.“ Investice do člověka snižuje náklady státu na sociální dávky a recidivu.
                         </p>
                       </div>
                       
                       <div className="glass-panel p-8 rounded-[3rem] border-white/5 space-y-6">
                         <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale border-2 border-cyan-400/20">
                             <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" alt="David Kozák" className="w-full h-full object-cover" />
                           </div>
                           <div>
                             <h4 className="text-xl font-bold text-white">David Kozák</h4>
                             <p className="text-xs text-cyan-400 font-black uppercase tracking-widest">Zakladatel & Visionář</p>
                           </div>
                         </div>
                         <p className="text-xs text-white/40 font-light leading-relaxed italic">
                           "Do projektu vnáším osobní zkušenost i praktické dovednosti z oblasti sociální integrace a pracovní migrace. Náš tým tvoří zkušení koordinátoři, lektory a terénní pracovníci."
                         </p>
                       </div>
                     </div>
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
                  <h3 className="text-4xl md:text-5xl text-white text-glow-cyan">Váš plán <span className="text-cyan-300 headline-thin">restartu</span></h3>
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
                    Pět pilířů <br /><span className="text-cyan-300 headline-thin">restartu</span>
                  </h2>
                  <div className="h-1 w-24 bg-cyan-500 rounded-full" />
                </div>
                <p className="text-white/40 max-w-md font-light text-right">
                  Každý pilíř představuje klíčovou fázi integrace, která zajišťuje udržitelnou životní změnu.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pillars.map((p, idx) => (
                  <div key={p.id} className={`glass-panel p-10 rounded-[3rem] group hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col h-full border-cyan-400/5 hover:border-cyan-400/30 ${p.isMain ? 'ring-1 ring-cyan-500/20' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                        {React.cloneElement(p.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">0{idx + 1}</span>
                        {p.isMain && <span className="text-[8px] bg-cyan-500 text-black px-2 py-0.5 rounded-full font-black uppercase mt-2">Hlavní</span>}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest leading-tight relative z-10 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                    <p className="text-white/40 text-base mb-8 font-light leading-relaxed relative z-10 group-hover:text-white/60 transition-colors flex-grow">{p.description}</p>
                    <div className={`h-1 w-12 rounded-full group-hover:w-full transition-all duration-700 relative z-10 ${p.isMain ? 'bg-cyan-400' : 'bg-cyan-400/30'}`}></div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  const renderMenuNodes = (nodes: MenuNode[], depth = 0) => (
    <div className={depth === 0 ? 'space-y-2' : 'space-y-1 mt-2'}>
      {nodes.map((node) => {
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = expandedMenuKeys.includes(node.key);
        const isActive = isNodeActive(node);
        const rowPadding = depth === 0 ? 'px-3' : depth === 1 ? 'pl-7 pr-3' : 'pl-11 pr-3';
        const labelClass =
          depth === 0
            ? 'text-sm font-semibold uppercase tracking-wide'
            : depth === 1
              ? 'text-xs font-semibold uppercase tracking-wide'
              : 'text-[11px] font-semibold uppercase tracking-[0.08em]';

        if (hasChildren) {
          return (
            <div key={node.key} className="glass-panel rounded-xl border-white/10">
              <button
                onClick={() => toggleMenuNode(node.key)}
                className={`w-full flex items-center justify-between ${rowPadding} py-3 rounded-xl transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-white/80 hover:bg-white/10 hover:text-cyan-300'
                }`}
                aria-expanded={isExpanded}
                aria-controls={`submenu-${node.key}`}
              >
                <span className={`${labelClass} leading-tight`}>{node.label}</span>
                <ChevronRight size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isExpanded && (
                <div id={`submenu-${node.key}`} className="pb-2">
                  {node.id && (
                    <button
                      onClick={() => handleMenuNavigation(node.id as PageKey | 'contacts-modal')}
                      className={`w-full text-left py-2 ${depth === 0 ? 'pl-7 pr-3' : 'pl-11 pr-3'} text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
                        node.id === currentPage ? 'text-cyan-300' : 'text-white/45 hover:text-cyan-300'
                      }`}
                    >
                      Přehled: {node.label}
                    </button>
                  )}
                  {renderMenuNodes(node.children ?? [], depth + 1)}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={node.key}
            onClick={() => handleMenuNavigation(node.id as PageKey | 'contacts-modal')}
            className={`w-full flex items-center justify-between ${rowPadding} py-3 rounded-xl transition-all ${
              isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-white/80 hover:bg-white/10 hover:text-cyan-300'
            }`}
          >
            <span className={`${labelClass} leading-tight`}>{node.label}</span>
          </button>
        );
      })}
    </div>
  );

  const ContactModalRoute = () => {
    useEffect(() => {
      setIsContactModalOpen(true);
      navigate(pagePathMap.home, { replace: true });
    }, [navigate]);

    return null;
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden relative antialiased transition-colors duration-500 ${isDark ? 'theme-dark bg-[#051111] text-white/90' : 'theme-light bg-[#f0fdf9] text-slate-900'}`}>
      <div
        className="fixed top-0 left-0 h-1 z-[140] transition-all duration-300"
        style={{
          width: `${scrollProgress}%`,
          background: isDark ? '#06b6d4' : '#0e7490',
          boxShadow: isDark ? '0 0 15px #00F2EA' : '0 0 15px rgba(14,116,144,0.45)'
        }}
      />

      {/* Background Aura */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse" style={{ background: isDark ? 'rgba(13,148,136,0.20)' : 'rgba(20,184,166,0.14)' }} />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] animate-bounce-slow" style={{ background: isDark ? 'rgba(6,182,212,0.10)' : 'rgba(14,116,144,0.10)' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full blur-[150px]" style={{ background: isDark ? 'rgba(6,78,59,0.20)' : 'rgba(45,212,191,0.12)' }} />
        <img
          src="/images/silhouette-oak-tree-isolated-white-background-44662890.webp"
          alt=""
          className={`tree-watermark-photo ${isDark ? 'tree-watermark-photo-dark' : 'tree-watermark-photo-light'}`}
          aria-hidden="true"
        />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 px-6 py-4 ${scrolled ? 'glass-panel py-2 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => goToPage('home')} className="text-2xl font-black tracking-tighter flex items-center text-glow-cyan cursor-pointer group">
            REST<span className="text-cyan-400 mx-1 group-hover:scale-110 transition-transform">||</span>ART
            <span className="ml-2 text-[10px] font-light tracking-[0.2em] uppercase hidden sm:block text-white/50">Integrace</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className={`p-3 rounded-2xl transition-all mr-3 ${scrolled ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'}`}
              aria-label={isDark ? 'Přepnout do light mode' : 'Přepnout do dark mode'}
              title={isDark ? 'Přepnout do light mode' : 'Přepnout do dark mode'}
            >
              {isDark ? <Sun className="text-cyan-400" size={18} /> : <Moon className="text-cyan-500" size={18} />}
            </button>
            <button 
              className={`p-3 rounded-2xl transition-all ${scrolled ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'}`} 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="text-cyan-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* COMPACT SLIDE-OUT MENU */}
      <div className={`fixed inset-0 z-[120] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button
          aria-label="Zavřít menu"
          onClick={() => setIsMenuOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        />

        <aside className={`absolute top-0 right-0 h-full w-[min(88vw,380px)] md:w-[420px] glass-panel ${isDark ? 'bg-[#051111]/95 border-cyan-400/20' : 'bg-[#f0fdf9]/95 border-cyan-900/10'} border-l transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-400">Navigace</p>
            <button onClick={() => setIsMenuOpen(false)} className="text-cyan-400 p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="px-3 text-[10px] uppercase tracking-[0.25em] text-white/30 font-black">Rozevírací seznam navigace</p>
            {renderMenuNodes(navTree)}
          </div>

          <div className="p-5 border-t border-white/10 flex items-center justify-center gap-6">
            <Instagram className="text-white/35 hover:text-cyan-400 cursor-pointer transition-colors" size={20} />
            <Facebook className="text-white/35 hover:text-cyan-400 cursor-pointer transition-colors" size={20} />
            <Globe className="text-white/35 hover:text-cyan-400 cursor-pointer transition-colors" size={20} />
          </div>
        </aside>
      </div>

      <Routes>
        {routablePages.map((page) => (
          <Route key={page} path={pagePathMap[page]} element={renderContent(page)} />
        ))}
        <Route path={pagePathMap.contacts} element={<ContactModalRoute />} />
        <Route path="*" element={<Navigate to={pagePathMap.home} replace />} />
      </Routes>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* MAGICKÝ OBRÁZEK PŘED FOOTEREM */}
      <section className="relative w-full h-[420px] md:h-[500px] overflow-hidden flex items-center justify-center my-16 group">
        <div className="absolute inset-0 z-0">
          <img src="Gemini_Generated_Image_cbpno7cbpno7cbpn.jpg" alt="Vizuál" className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[8000ms]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051111] via-transparent to-[#051111]"></div>
          <div className="absolute inset-0 bg-[#051111]/40"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl space-y-6">
          <Quote size={48} className="text-cyan-400/30 mx-auto group-hover:scale-110 transition-transform duration-700" />
          <h3 className="text-2xl md:text-5xl font-serif italic text-white drop-shadow-2xl leading-tight">
            <span className="neon-quote-mark">"</span>
            Na nikoho se nezapomíná. Každý si zaslouží druhou šanci.
            <span className="neon-quote-mark neon-quote-mark-end">"</span>
          </h3>
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
              <div className="space-y-2">
                <p className="text-white/40 text-sm font-bold">DAVID KOZÁK INTERNATIONAL S.R.O.</p>
                <p className="text-white/20 text-[10px] leading-relaxed max-w-sm font-light">
                  Drážďanská 51/52, 400 07 Ústí nad Labem<br />
                  Tel: +420 705 217 251<br />
                  IČO: 23143614 | DIČ: CZ23143614<br />
                  Spisová značka: C 53832 u Krajského soudu v Ústí nad Labem
                </p>
              </div>
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

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Zpět nahoru"
          title="Zpět nahoru"
          className={`fixed bottom-8 right-8 z-[150] glass-panel rounded-full p-4 shadow-2xl transition-all hover:scale-110 active:scale-95 ${
            isDark ? 'text-cyan-400' : 'text-cyan-700'
          }`}
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default App;


