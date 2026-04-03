import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AlertCircle, KeyRound, Loader2, Lock, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isCurrentUserAdmin } from '../lib/cms';
import { DEFAULT_ADMIN_EMAIL, supabase } from '../lib/supabase';

interface AdminLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  isAdmin: boolean;
}

const AdminLoginDialog: React.FC<AdminLoginDialogProps> = ({ isOpen, onClose, session, isAdmin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
      setNotice('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      const hasAccess = await isCurrentUserAdmin();
      if (!hasAccess) {
        throw new Error('Přihlášení proběhlo, ale tento účet není ve whitelistu adminů.');
      }

      onClose();
      navigate('/admin');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Přihlášení selhalo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setNotice('Účet byl odhlášen.');
  };

  return (
    <div className="fixed inset-0 z-[135] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-8" onClick={onClose}>
      <div
        className="glass-panel relative w-full max-w-2xl rounded-[2.5rem] border-cyan-400/20 p-8 md:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl bg-white/5 p-3 text-cyan-400 transition-all hover:bg-white/10"
          aria-label="Zavřít admin login"
        >
          <X size={22} />
        </button>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              <ShieldCheck size={14} />
              Admin Login
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black uppercase leading-tight text-white md:text-5xl">
                Přístup do <span className="headline-thin text-cyan-300">editoru</span>
              </h3>
              <p className="max-w-xl text-sm font-light leading-relaxed text-white/45">
                Přihlašovací dialog je dostupný přímo z veřejného menu. Přístup získají jen účty z admin whitelistu
                projektu.
              </p>
            </div>
          </div>

          {session && isAdmin ? (
            <div className="space-y-5 rounded-[2rem] border border-cyan-400/15 bg-cyan-500/5 p-6">
              <div className="flex items-center gap-3 text-cyan-300">
                <ShieldCheck size={18} />
                <p className="text-xs font-black uppercase tracking-[0.24em]">Admin účet je aktivní</p>
              </div>
              <p className="text-sm text-white/60">
                Přihlášený účet <span className="font-semibold text-white">{session.user.email}</span> už má admin
                oprávnění.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/admin');
                  }}
                  className="inline-flex items-center gap-2 rounded-[1.4rem] bg-cyan-500 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-cyan-400"
                >
                  <KeyRound size={15} />
                  Otevřít editor
                </button>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="inline-flex items-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.22em] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  Odhlásit účet
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Admin e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition focus:border-cyan-400/30"
                  placeholder={DEFAULT_ADMIN_EMAIL}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400">Heslo</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-[1.6rem] border border-white/10 bg-white/[0.04] py-4 pl-12 pr-5 text-white outline-none transition focus:border-cyan-400/30"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 rounded-[1.6rem] bg-cyan-500 px-6 py-4 text-xs font-black uppercase tracking-[0.24em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
              >
                {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                Přihlásit do editoru
              </button>

              {notice && <p className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">{notice}</p>}
              {error && (
                <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.18em]">
                    <AlertCircle size={14} />
                    Chyba
                  </div>
                  {error}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoginDialog;
