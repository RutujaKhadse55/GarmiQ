import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('aarti.deshmukh@pmc.gov.in');
  const [password, setPassword] = useState('pmc2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both municipal officer email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.login(email, password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify your municipal credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('aarti.deshmukh@pmc.gov.in');
    setPassword('pmc2026');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#0C1B33] px-4 py-8 relative overflow-hidden select-none">
      {/* Background ambient radial glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-modal border border-[#DFEAF7] p-8 z-10 animate-fadeIn">
        {/* Brand & Emblem */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 shadow-lg shadow-amber-500/30 mb-3">
            <Sun className="w-8 h-8 text-white animate-spin-slow" />
          </div>

          <h2 className="text-2xl font-black text-[#102442] tracking-tight">
            Garmi<span className="text-amber-500">Q</span>
          </h2>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#0866D9]">
            Beat the Heat • Municipal Control Centre
          </div>
          <p className="text-xs text-[#7186A3] mt-1.5">
            Monitor heat risk. Protect communities.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102442] mb-1.5">
              Officer Email / PMC Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7186A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pmc.gov.in"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DFEAF7] bg-[#F4F8FD] text-xs text-[#102442] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102442] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7186A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter municipal password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DFEAF7] bg-[#F4F8FD] text-xs text-[#102442] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7186A3] hover:text-[#102442]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#0866D9] hover:bg-[#0756B8] text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Sign In to Municipal Console
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="mt-5 pt-4 border-t border-[#DFEAF7] text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] text-[#0866D9] hover:underline font-semibold"
          >
            Use Demo Officer Credentials (Dr. Aarti Deshmukh, PMC)
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <p>Pune Municipal Corporation • Disaster Management & Public Health</p>
        <p className="text-[11px] text-slate-500 mt-1">
          Authorized personnel only. Protected under Maharashtra Civic Safety Directives.
        </p>
      </div>
    </div>
  );
};
