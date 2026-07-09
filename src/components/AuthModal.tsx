import React, { useState } from 'react';
import { Mail, Lock, User, X } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (isLogin) {
        // Real Supabase Login
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          setError(loginError.message);
          return;
        }

        if (data.user) {
          const userMeta = data.user.user_metadata;
          const userProfile: UserProfile = {
            name: userMeta?.name || email.split('@')[0],
            email: data.user.email || email,
            phone: userMeta?.phone || phone || '+91 98765 43210',
            address: userMeta?.address || address || '123 Brew Lane, Bengaluru',
            joinedDate: new Date(data.user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
          };

          // Save to local storage for quick access
          localStorage.setItem(`user_${email}`, JSON.stringify(userProfile));
          onLoginSuccess(userProfile);
          setSuccessMsg(`Welcome back, ${userProfile.name}!`);
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1500);
        }
      } else {
        // Real Supabase Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone: phone || '+91 98765 43210',
              address: address || '123 Brew Lane, Bengaluru'
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.user) {
          const userProfile: UserProfile = {
            name,
            email,
            phone: phone || '+91 98765 43210',
            address: address || '123 Brew Lane, Bengaluru',
            joinedDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
          };

          localStorage.setItem(`user_${email}`, JSON.stringify(userProfile));
          onLoginSuccess(userProfile);
          setSuccessMsg('Registration successful! Welcome to Brew Haven.');
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during authentication.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border border-[#C5A059] flex items-center justify-center rotate-45">
              <span className="-rotate-45 text-[9px] font-bold text-[#C5A059]">BH</span>
            </div>
            <span className="text-lg font-serif tracking-widest uppercase text-white">Brew Haven</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:text-[#C5A059] text-white/50 transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector Tabs */}
        <div className="flex border-b border-white/5 relative z-10 bg-black/40">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold text-center transition-colors border-b-2 ${
              isLogin 
                ? 'border-[#C5A059] text-[#C5A059]' 
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold text-center transition-colors border-b-2 ${
              !isLogin 
                ? 'border-[#C5A059] text-[#C5A059]' 
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            Join the Haven
          </button>
        </div>

        {/* Content Form */}
        <div className="p-8 relative z-10">
          {successMsg ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-2 border-[#C5A059] flex items-center justify-center rotate-45 mx-auto mb-8 bg-[#C5A059]/5 animate-pulse">
                <span className="-rotate-45 text-2xl text-[#C5A059]">✓</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Success</h3>
              <p className="text-sm text-white/60">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs px-4 py-2.5 rounded">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-white/50">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-white/50">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-white/50">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-white/50">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-white/50">Delivery Address (Optional)</label>
                    <textarea
                      placeholder="Flat, Building, Street, Area, Bengaluru"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#C5A059] hover:bg-[#A6864A] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-all transform hover:-translate-y-0.5 mt-2 cursor-pointer"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <p className="text-center text-[10px] text-white/40 mt-4 leading-normal">
                By continuing, you agree to Brew Haven's <br />
                <span className="text-[#C5A059] hover:underline cursor-pointer">Terms of Service</span> & <span className="text-[#C5A059] hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
