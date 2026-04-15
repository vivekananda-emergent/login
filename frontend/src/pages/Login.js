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

          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-sm text-zinc-500 text-center">
              Demo credentials: <span className="font-medium text-zinc-900">admin@example.com</span> / <span className="font-medium text-zinc-900">admin123</span>
            </p>
          </motion.div>
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