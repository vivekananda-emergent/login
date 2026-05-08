import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[2fr_3fr]">
      {/* Left Side - Form */}
      <div className="bg-white flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-10 space-y-2">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900">
              Welcome back
            </h1>
            <p className="text-base text-zinc-600 leading-relaxed">
              Sign in to continue to your account
            </p>
          </motion.div>

          {error && (
            <motion.div
              variants={itemVariants}
              className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-700 text-sm"
              data-testid="login-error-message"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={handleGoogleLogin}
            className="bg-white border border-zinc-200 text-black rounded-none h-14 font-medium hover:bg-zinc-50 transition-colors flex items-center justify-center gap-3 w-full mb-8"
            data-testid="google-login-button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </motion.button>

          <motion.div variants={itemVariants} className="flex items-center gap-4 my-8 text-sm text-zinc-400 before:flex-1 before:h-px before:bg-zinc-200 after:flex-1 after:h-px after:bg-zinc-200">
            or sign in with email
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium tracking-wide text-zinc-900 uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-none h-14 px-4 text-base transition-colors hover:bg-zinc-200 focus:bg-white focus:ring-2 focus:ring-black focus:outline-none placeholder:text-zinc-400"
                placeholder="name@company.com"
                required
                data-testid="login-email-input"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium tracking-wide text-zinc-900 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-100 border-none rounded-none h-14 px-4 pr-12 text-base transition-colors hover:bg-zinc-200 focus:bg-white focus:ring-2 focus:ring-black focus:outline-none placeholder:text-zinc-400"
                  placeholder="Enter your password"
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded-none h-14 font-medium text-base hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group w-full disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative w-full h-full bg-zinc-100 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/28302486/pexels-photo-28302486.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1500&w=1000"
          alt="Modern architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white z-10">
          <h2 className="text-3xl font-medium tracking-tight leading-snug mb-4">
            Built for teams that move fast
          </h2>
          <p className="text-sm font-medium tracking-widest uppercase opacity-80">
            Secure · Reliable · Modern
          </p>
        </div>
      </div>
    </div>
  );
}
