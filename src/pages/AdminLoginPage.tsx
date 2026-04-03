import type { Session } from '@supabase/supabase-js';
import { AlertCircle, KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { DEFAULT_ADMIN_EMAIL, supabase } from '../lib/supabase';

interface AdminLoginPageProps {
  session: Session | null;
  authReady: boolean;
  isAdmin: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  session,
  authReady,
  isAdmin,
  isDark,
  onToggleTheme
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authReady && session && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [authReady, isAdmin, navigate, session]);

  if (authReady && session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        setNotice('Přihlášení proběhlo. Ověřuji oprávnění administrátora.');
      } else {
        const emailRedirectTo = `${window.location.origin}${window.location.pathname}#/admin/login`;
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo
          }
        });

        if (signUpError) throw signUpError;
        setNotice(
          'Admin účet byl založen. Pokud má projekt zapnuté potvrzení e-mailu, dokonči ověření a pak se přihlas.'
        );
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Přihlášení selhalo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setNotice('');
    setError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr,0.95fr]">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              CMS Admin
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-black uppercase leading-none text-white md:text-6xl">
                Správa <span className="headline-thin text-cyan-300">obsahu</span>
              </h1>
              <p className="max-w-xl text-sm font-light leading-relaxed text-white/45 md:text-base">
                Tady budeš spravovat aktuality, novinky, blog a obrazový obsah webu REST||ART. Přístup je omezený jen
                na schválené admin účty v Supabase.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <ShieldCheck size={18} />,
                  title: 'Jen pro admina',
                  text: 'Přístup ověřuje Supabase Auth a admin whitelist v databázi.'
                },
                {
                  icon: <KeyRound size={18} />,
                  title: 'Přihlášení heslem',
                  text: 'Používá se běžný e-mail + heslo. Žádný veřejný editor bez autentizace.'
                }
              ].map((item) => (
                <div key={item.title} className="glass-panel rounded-[2.4rem] border-white/10 p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-black text-white">{item.title}</h2>
                  <p className="mt-2 text-sm font-light leading-relaxed text-white/45">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[3rem] border-white/10 p-8 md:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Admin Login</p>
                <h2 className="mt-2 text-3xl font-black text-white">Přihlášení do editoru</h2>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/65 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>

            {session && authReady && !isAdmin ? (
              <div className="space-y-5 rounded-[2.4rem] border border-red-500/20 bg-red-500/10 p-6 text-sm text-white/65">
                <div className="flex items-center gap-3 text-red-300">
                  <AlertCircle size={18} />
                  <p className="font-black uppercase tracking-[0.22em]">Účet nemá admin oprávnění</p>
                </div>
                <p>
                  Přihlášení proběhlo, ale aktuální e-mail není vedený v admin whitelistu projektu. Zkontroluj seznam
                  adminů v tabulce <code>admin_users</code> v Supabase.
                </p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-2xl bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white transition hover:bg-white/15"
                >
                  Odhlásit
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
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

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
                      setNotice('');
                      setError('');
                    }}
                    className="text-xs font-black uppercase tracking-[0.22em] text-white/45 transition hover:text-cyan-300"
                  >
                    {mode === 'login' ? 'První založení admin účtu' : 'Zpět na přihlášení'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 rounded-[1.6rem] bg-cyan-500 px-6 py-4 text-xs font-black uppercase tracking-[0.24em] text-black transition hover:bg-cyan-400 disabled:opacity-70"
                  >
                    {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                    {mode === 'login' ? 'Přihlásit' : 'Založit admin účet'}
                  </button>
                </div>

                {notice && <p className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100/80">{notice}</p>}
                {error && <p className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
              </form>
            )}

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 text-sm text-white/45">
              Seedovaný admin whitelist počítá s e-mailem <span className="font-bold text-white">{DEFAULT_ADMIN_EMAIL}</span>.
              Pokud chceš jiný admin účet, změň záznam v tabulce <code>admin_users</code> v Supabase.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
