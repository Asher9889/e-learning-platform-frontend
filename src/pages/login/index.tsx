import React, { useState, useId, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import loginbackground  from '../../assets/images/loginPage/loginBackground.webp';
import loginbackground1 from '../../assets/images/loginPage/loginBackground1.webp';
import DotBackgroundDemo from '@/components/dot-background-demo';
import { Button } from '@/components/ui/button';
import { useLogin } from './hooks/useLogin';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { toast } from 'sonner';
import loginSchema    from './schema/login.schema';
import registerSchema from './schema/register.schema';
import type { TLoginSchema } from './types/login.types';
import type { TRegisterSchema } from './types/register.types';
import LoginForm    from '../../components/login/LoginForm';
import RegisterForm from '../../components/login/RegisterForm';

const LoginPage: React.FC = () => {
  const uid = useId();

  const [isSignUp,   setIsSignUp]   = useState(false);
  const [regSuccess, setRegSuccess] = useState('');
  const [apiError,   setApiError]   = useState('');

  const loginMutation = useLogin();
  const navigate      = useNavigate();

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    control: regControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors, isSubmitting: regSubmitting },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', regEmail: '', regPass: '' },
  });

  const onLogin = useCallback(async (data: TLoginSchema) => {
    setApiError('');
    try {
      const response = await loginMutation.mutateAsync({ email: data.email, password: data.password });
      console.log(response, 'response');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setApiError(getApiErrorMessage(err));
    }
  }, [loginMutation, navigate]);

  const onRegister = useCallback(async (_data: TRegisterSchema) => {
    console.log(_data,"onRegister")
    await new Promise((r) => setTimeout(r, 800));
    setRegSuccess('Account created! Please log in.');
    setTimeout(() => { setIsSignUp(false); setRegSuccess(''); }, 1800);
  }, []);

  const switchToLogin  = useCallback(() => { setIsSignUp(false); setApiError(''); }, []);
  const switchToSignUp = useCallback(() => { setIsSignUp(true);  setApiError(''); }, []);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-enter { animation: fadeSlideUp 0.35s ease both; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      <div className="flex items-center justify-center min-h-screen w-full bg-background text-foreground overflow-hidden">

        {/* ── MOBILE LAYOUT ──────────────────────────────────────────── */}
        <div className="md:hidden flex flex-col w-full min-h-screen">
          <div
            className="relative flex flex-col items-center justify-center py-12 px-6"
            style={{
              backgroundImage: `url(${isSignUp ? loginbackground1 : loginbackground})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              minHeight: '220px', transition: 'background-image 0.5s ease',
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

          <div className="flex bg-gray-800 border-b border-white/10">
            <Button unstyled type="button" onClick={switchToLogin}
              className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase transition-all
                ${!isSignUp ? 'text-white border-b-2 border-blue-500 bg-blue-600/10' : 'text-white/40 hover:text-white/70'}`}>
              Sign In
            </Button>
            <Button unstyled type="button" onClick={switchToSignUp}
              className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase transition-all
                ${isSignUp ? 'text-white border-b-2 border-blue-500 bg-blue-600/10' : 'text-white/40 hover:text-white/70'}`}>
              Register
            </Button>
          </div>

          <div className="flex-1 bg-card text-card-foreground px-6 py-8">
            {!isSignUp ? (
              <div className="form-enter">
                <LoginForm
                  uid={uid} variant="mobile"
                  control={loginControl} errors={loginErrors}
                  isSubmitting={loginSubmitting} apiError={apiError}
                  onSubmit={handleLoginSubmit(onLogin)}
                  onSwitchSignUp={switchToSignUp}
                />
              </div>
            ) : (
              <div className="form-enter">
                <RegisterForm
                  uid={uid} variant="mobile"
                  control={regControl} errors={regErrors}
                  isSubmitting={regSubmitting} regSuccess={regSuccess}
                  onSubmit={handleRegisterSubmit(onRegister)}
                  onSwitchLogin={switchToLogin}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ─────────────────────────────────────────── */}
        <div className="hidden md:flex relative w-full h-screen shadow-2xl overflow-hidden">

          <div className={`
            absolute top-0 w-1/2 h-full z-20
            transition-transform duration-700 ease-in-out
            ${isSignUp ? 'translate-x-full' : 'translate-x-0'}
          `}>
            <DotBackgroundDemo>
              <div className="h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600" />

                {/* LOGIN */}
                <div className={`
                  absolute inset-0 flex flex-col items-center justify-center px-10
                  transition-all duration-500
                  ${!isSignUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}>
                  <div className="w-full max-w-sm">
                    <h1 className="text-white text-2xl font-black uppercase tracking-widest text-center mb-1">Sign In</h1>
                    <p className="text-white/50 text-xs text-center tracking-wider mb-8">Welcome back to E·LEARNING</p>
                    <LoginForm
                      uid={uid} variant="desktop"
                      control={loginControl} errors={loginErrors}
                      isSubmitting={loginSubmitting} apiError={apiError}
                      onSubmit={handleLoginSubmit(onLogin)}
                      onSwitchSignUp={switchToSignUp}
                    />
                    <p className="text-center text-white/30 text-xs mt-6">
                      New here?{' '}
                      <Button unstyled type="button" onClick={switchToSignUp} className="text-blue-300 hover:text-white underline underline-offset-2 transition-colors">
                        Create an account
                      </Button>
                    </p>
                  </div>
                </div>

                {/* REGISTER */}
                <div className={`
                  absolute inset-0 flex flex-col items-center justify-center px-10
                  transition-all duration-500
                  ${isSignUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}>
                  <div className="w-full max-w-sm">
                    <h1 className="text-white text-2xl font-black uppercase tracking-widest text-center mb-1">Register</h1>
                    <p className="text-white/50 text-xs text-center tracking-wider mb-8">Join E·LEARNING today</p>
                    <RegisterForm
                      uid={uid} variant="desktop"
                      control={regControl} errors={regErrors}
                      isSubmitting={regSubmitting} regSuccess={regSuccess}
                      onSubmit={handleRegisterSubmit(onRegister)}
                      onSwitchLogin={switchToLogin}
                    />
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

          {/* LEFT PANEL */}
          <div
            className="absolute left-0 top-0 w-1/2 h-full flex flex-col items-center bg-gray-500 justify-center pb-16 px-8 bg-contain bg-center"
            style={{ backgroundImage: `url(${loginbackground})` }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 text-center flex flex-col justify-center items-center text-white">
              <h2 className="text-2xl font-black tracking-widest mb-1">E·LEARNING</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-8">Your Learning Journey Starts Here</p>
              <Button unstyled type="button" onClick={switchToLogin}
                className={`px-8 py-2.5 border-2 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all duration-300
                  ${!isSignUp ? 'bg-white text-gray-900 border-white' : 'border-white/50 text-white hover:border-white hover:bg-white/10'}`}>
                Login
              </Button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className="absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center pb-16 px-8 bg-contain bg-center"
            style={{ backgroundImage: `url(${loginbackground1})` }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 text-center text-white">
              <h2 className="text-2xl font-black tracking-widest mb-1">E·LEARNING</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-8">Join Thousands of Learners</p>
              <Button unstyled type="button" onClick={switchToSignUp}
                className={`px-8 py-2.5 border-2 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all duration-300
                  ${isSignUp ? 'bg-white text-gray-900 border-white' : 'border-white/50 text-white hover:border-white hover:bg-white/10'}`}>
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