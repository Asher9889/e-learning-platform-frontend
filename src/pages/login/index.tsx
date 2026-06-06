import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import loginbackground from '../../assets/images/loginPage/loginBackground.webp';
import loginbackground1 from '../../assets/images/loginPage/loginBackground1.webp';
import DotBackgroundDemo from '@/components/dot-background-demo';
import { Button } from '@/components/ui/button';
import { useLogin } from '../../hooks/useAuth';
// ─── Eye icon (inline, no extra dep) ──────────────────────────────────────
const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ─── Spinner ───────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
);

// ─── Input Field Component ─────────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
  showToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id, label, type = 'text', value, onChange, autoComplete, placeholder, showToggle,
}) => {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-xs font-medium text-white/70 tracking-wider uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="
            w-full bg-white/10 px-4 py-3 rounded-xl text-white text-sm
            border border-white/20 placeholder-white/40
            outline-none focus:border-white/60 focus:bg-white/15
            transition-all duration-200 pr-10
          "
        />
        {showToggle && (
          <Button
            // type="Button"
            unstyled
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={visible} />
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const uid = useId();

  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  // UI state
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      // Redux dispatch ho chuka hoga
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Login failed");
    }
  };

  // ── Register handler (stub — wire to your API) ───────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regEmail.trim() || !regPass) { setRegError('Please fill in all fields.'); return; }
    if (regPass.length < 8) { setRegError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setRegError('');
    // TODO: replace with actual register API call
    // const res = await authService.register({ name, email: regEmail, password: regPass });
    await new Promise((r) => setTimeout(r, 800)); // remove when real API ready
    setLoading(false);
    setRegSuccess('Account created! Please log in.');
    setTimeout(() => { setIsSignUp(false); setRegSuccess(''); }, 1800);
  };

  // ── Switch panel ─────────────────────────────────────────────────────────
  const switchToLogin = () => { setIsSignUp(false); setError(''); setRegError(''); };
  const switchToSignUp = () => { setIsSignUp(true); setError(''); setRegError(''); };

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-enter { animation: fadeSlideUp 0.35s ease both; }

        /* Shake on error */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      <div className="flex items-center justify-center min-h-screen w-full bg-background text-foreground overflow-hidden">

        {/*
          ── LAYOUT STRATEGY ──────────────────────────────────────────────
          Mobile  (<md): stacked — branding top, form bottom, tab switcher
          Desktop (≥md): side-by-side sliding panel (original concept, fixed)
        */}

        {/* ── MOBILE LAYOUT ──────────────────────────────────────────── */}
        <div className="md:hidden flex flex-col w-full min-h-screen">

          {/* Branding Banner */}
          <div
            className="relative flex flex-col items-center justify-center py-12 px-6"
            style={{
              backgroundImage: `url(${isSignUp ? loginbackground1 : loginbackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '220px',
              transition: 'background-image 0.5s ease',
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 text-center text-white">
              <h1 className="text-3xl font-black tracking-widest">E·LEARNING</h1>
              <p className="text-xs tracking-[0.3em] text-white/70 mt-1 uppercase">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-800 border-b border-white/10">
            <Button
              unstyled
              onClick={switchToLogin}
              className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase transition-all
                ${!isSignUp ? 'text-white border-b-2 border-blue-500 bg-blue-600/10' : 'text-white/40 hover:text-white/70'}`}
            >
              Sign In
            </Button>
            <Button
              unstyled
              onClick={switchToSignUp}
              className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase transition-all
                ${isSignUp ? 'text-white border-b-2 border-blue-500 bg-blue-600/10' : 'text-white/40 hover:text-white/70'}`}
            >
              Register
            </Button>
          </div>

          {/* Form area */}
          <div className="flex-1 bg-card text-card-foreground px-6 py-8">
            {!isSignUp ? (
              <form key="login-mobile" className="form-enter flex flex-col gap-5" onSubmit={handleLogin} noValidate>
                <InputField id={`${uid}-m-email`} label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
                <InputField id={`${uid}-m-pass`} label="Password" value={password} onChange={setPassword} autoComplete="current-password" placeholder="••••••••" showToggle />

                {error && (
                  <div className="shake flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                    <span>⚠</span> {error}
                  </div>
                )}

                <Button
                  unstyled
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3.5 bg-primary text-primary-foreground hover:opacity-90 active:scale-95
                    text-white font-bold rounded-xl tracking-widest uppercase text-sm
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Signing in…</> : 'Login'}
                </Button>

                <p className="text-center text-white/40 text-xs">
                  No account?{' '}
                  <Button unstyled type="button" onClick={switchToSignUp} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                    Register here
                  </Button>
                </p>
              </form>
            ) : (
              <form key="register-mobile" className="form-enter flex flex-col gap-5" onSubmit={handleRegister} noValidate>
                <InputField id={`${uid}-m-name`} label="Full Name" value={name} onChange={setName} autoComplete="name" placeholder="John Doe" />
                <InputField id={`${uid}-m-regemail`} label="Email" type="email" value={regEmail} onChange={setRegEmail} autoComplete="email" placeholder="you@example.com" />
                <InputField id={`${uid}-m-regpass`} label="Password" value={regPass} onChange={setRegPass} autoComplete="new-password" placeholder="Min. 8 characters" showToggle />

                {regError && (
                  <div className="shake flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                    <span>⚠</span> {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="flex items-center gap-2 bg-green-500/15 border border-green-400/30 text-green-300 text-sm px-4 py-3 rounded-xl">
                    <span>✓</span> {regSuccess}
                  </div>
                )}

                <Button
                  unstyled
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3.5 bg-primary text-primary-foreground hover:opacity-90 active:scale-95
                    text-white font-bold rounded-xl tracking-widest uppercase text-sm
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Creating…</> : 'Create Account'}
                </Button>

                <p className="text-center text-white/40 text-xs">
                  Have an account?{' '}
                  <Button unstyled type="button" onClick={switchToLogin} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                    Sign in
                  </Button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ─────────────────────────────────────────── */}
        <div className="hidden md:flex relative w-full h-screen shadow-2xl overflow-hidden">

          {/* Blue Sliding Panel — holds both forms ───────────────────── */}

          <div
            className={`
              absolute top-0 w-1/2 h-full  z-20
              transition-transform duration-700 ease-in-out
              ${isSignUp ? 'translate-x-full' : 'translate-x-0'}
            `}
          >
            <DotBackgroundDemo>
              <div className=' h-full'>
                {/* Decorative gradient top bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600" />

                {/* ── LOGIN FORM ── */}
                <div
                  className={`
                absolute inset-0 flex flex-col items-center justify-center px-10
                transition-all duration-500
                ${!isSignUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
              `}
                >

                  <div className="w-full max-w-sm">
                    <h1 className="text-white text-2xl font-black uppercase tracking-widest text-center mb-1">
                      Sign In
                    </h1>
                    <p className="text-white/50 text-xs text-center tracking-wider mb-8">
                      Welcome back to E·LEARNING
                    </p>

                    <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5 z-60">
                      <InputField id={`${uid}-d-email`} label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
                      <InputField id={`${uid}-d-pass`} label="Password" value={password} onChange={setPassword} autoComplete="current-password" placeholder="••••••••" showToggle />

                      {error && (
                        <div className="shake flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 text-xs px-3 py-2.5 rounded-lg">
                          <span>⚠</span> {error}
                        </div>
                      )}

                      <Button
                        unstyled
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full py-3.5 bg-white text-blue-700 font-black rounded-xl
                      hover:bg-blue-50 active:scale-95 tracking-widest uppercase text-sm
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <><span className="text-blue-600"><Spinner /></span> Signing in…</>
                        ) : 'Login'}
                      </Button>
                    </form>

                    <p className="text-center text-white/30 text-xs mt-6">
                      New here?{' '}
                      <Button unstyled type="button" onClick={switchToSignUp} className="text-blue-300 hover:text-white underline underline-offset-2 transition-colors">
                        Create an account
                      </Button>
                    </p>
                  </div>
                </div>

                {/* ── REGISTER FORM ── */}
                <div
                  className={`
                absolute inset-0 flex flex-col items-center justify-center px-10
                transition-all duration-500
                ${isSignUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
              `}
                >
                  <div className="w-full max-w-sm">
                    <h1 className="text-white text-2xl font-black uppercase tracking-widest text-center mb-1">
                      Register
                    </h1>
                    <p className="text-white/50 text-xs text-center tracking-wider mb-8">
                      Join E·LEARNING today
                    </p>

                    <form onSubmit={handleRegister} noValidate className="flex flex-col gap-5">
                      <InputField id={`${uid}-d-name`} label="Full Name" value={name} onChange={setName} autoComplete="name" placeholder="John Doe" />
                      <InputField id={`${uid}-d-regemail`} label="Email" type="email" value={regEmail} onChange={setRegEmail} autoComplete="email" placeholder="you@example.com" />
                      <InputField id={`${uid}-d-regpass`} label="Password" value={regPass} onChange={setRegPass} autoComplete="new-password" placeholder="Min. 8 characters" showToggle />

                      {regError && (
                        <div className="shake flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 text-xs px-3 py-2.5 rounded-lg">
                          <span>⚠</span> {regError}
                        </div>
                      )}
                      {regSuccess && (
                        <div className="flex items-center gap-2 bg-green-500/15 border border-green-400/30 text-green-300 text-xs px-3 py-2.5 rounded-lg">
                          <span>✓</span> {regSuccess}
                        </div>
                      )}

                      <Button
                        unstyled
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full py-3.5 bg-white text-blue-700 font-black rounded-xl
                      hover:bg-blue-50 active:scale-95 tracking-widest uppercase text-sm
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <><span className="text-blue-600"><Spinner /></span> Creating…</>
                        ) : 'Create Account'}
                      </Button>
                    </form>

                    <p className="text-center text-white/30 text-xs mt-6">
                      Already registered?{' '}
                      <Button unstyled type="button" onClick={switchToLogin} className="text-blue-300 hover:text-white underline underline-offset-2 transition-colors">
                        Sign in
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </DotBackgroundDemo>
          </div>


          {/* ── LEFT BACKGROUND PANEL ─────────────────────────────────── */}
          <div
            className="absolute left-0 top-0 w-1/2 h-full flex flex-col items-center bg-gray-500 justify-center pb-16 px-8 bg-contain bg-center"
            style={{ backgroundImage: `url(${loginbackground})` }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 text-center  flex flex-col justify-center items-center  text-white">
              <h2 className="text-2xl font-black tracking-widest mb-1">E·LEARNING</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-8">
                Your Learning Journey Starts Here
              </p>
              <Button
                unstyled
                onClick={switchToLogin}
                className={`
                  px-8 py-2.5 border-2 rounded-xl text-sm font-semibold tracking-widest uppercase
                  transition-all duration-300
                  ${!isSignUp
                    ? 'bg-white text-gray-900 border-white'
                    : 'border-white/50 text-white hover:border-white hover:bg-white/10'}
                `}
              >
                Login
              </Button>
            </div>
          </div>

          {/* ── RIGHT BACKGROUND PANEL ────────────────────────────────── */}
          <div
            className="absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center pb-16 px-8 bg-contain bg-center"
            style={{ backgroundImage: `url(${loginbackground1})` }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 text-center text-white">
              <h2 className="text-2xl font-black tracking-widest mb-1">E·LEARNING</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-8">
                Join Thousands of Learners
              </p>
              <Button
                unstyled
                onClick={switchToSignUp}
                className={`
                  px-8 py-2.5 border-2 rounded-xl text-sm font-semibold tracking-widest uppercase
                  transition-all duration-300
                  ${isSignUp
                    ? 'bg-white text-gray-900 border-white'
                    : 'border-white/50 text-white hover:border-white hover:bg-white/10'}
                `}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;