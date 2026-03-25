import React from 'react';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl glass-panel border-cyan-400/20 rounded-[2.5rem] p-8 md:p-12 relative max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 transition-all"
          aria-label="Zavřít kontaktní okno"
        >
          <X size={22} />
        </button>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-400">Kontaktní miniokno</p>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight">
              Kontaktujte <span className="text-cyan-300 headline-thin">nás</span>
            </h3>
            <p className="text-white/40 font-light max-w-2xl">
              Zůstáváte na aktuální stránce a formulář se otevře pouze v překryvném okně.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Firma</p>
                <p className="text-xl font-bold text-white">DAVID KOZÁK INTERNATIONAL S.R.O.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Telefon</p>
                <p className="text-lg font-bold text-cyan-400">+420 705 217 251</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Email</p>
                <p className="text-lg font-bold text-cyan-400">info@david-kozak.com</p>
              </div>
            </div>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Vaše jméno"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none placeholder:text-white/20"
              />
              <input
                type="email"
                placeholder="Váš email"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none placeholder:text-white/20"
              />
              <textarea
                placeholder="Jak vám můžeme pomoci?"
                className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none resize-none placeholder:text-white/20"
              />
              <button
                type="button"
                className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-cyan-400 transition-all"
              >
                Odeslat zprávu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
