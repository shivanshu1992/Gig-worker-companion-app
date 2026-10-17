'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { clientStorage } from '@/lib/storage/clientStorage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDemoLogin = () => {
    clientStorage.setDemoMode(true);
    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured) {
      // Supabase is not configured yet; automatically guide user to Demo Mode
      clientStorage.setDemoMode(true);
      router.push('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error('Supabase client unavailable');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      clientStorage.setDemoMode(false);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Gig Worker Companion
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">
          Sign In to Your Worker Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your real shift records, welfare trackers, and grievance tickets
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200/90 py-8 px-6 shadow-sm rounded-3xl sm:px-10 space-y-6">
          {/* Quick Demo Mode Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Want to explore without registering?</span>
            </div>
            <p className="text-[11px] text-amber-800">
              One-click instant access with realistic sample Indian gig shift data.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>Explore Instant Demo Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-emerald-700 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
