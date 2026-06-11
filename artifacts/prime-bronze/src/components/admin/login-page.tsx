import { useState } from 'react';
import { useLocation } from 'wouter';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { setAuth } from '@/lib/auth';

export function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAuth(data.token, data.user);
        window.location.href = '/admin';
      } else {
        toast.error(data?.error ?? 'Email ou senha inválidos');
      }
    } catch {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto ring-2 ring-[#D4AF37]/30">
            <img src="/images/logo.jpeg" alt="Prime Bronze" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mt-4">Painel Administrativo</h1>
          <p className="text-white/50 text-sm mt-1">Prime Bronze</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10 space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 pl-11 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 pl-11 pr-11 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
