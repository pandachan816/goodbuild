'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr('登入失敗：email 或密碼錯誤');
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
            <Lock className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">PRIME BUILD 後台</h1>
          <p className="text-sm text-slate-400">管理員登入</p>
        </div>

        {err && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">
            {err}
          </p>
        )}

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? '登入中...' : '登入'}
        </button>
      </form>
    </div>
  );
}