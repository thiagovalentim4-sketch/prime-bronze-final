import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { authOptions } from '@/lib/auth';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Prime Bronze</h1>
          <p className="text-gray-400">Área Administrativa</p>
        </div>

        <LoginForm />

        <div className="mt-6 p-4 bg-[#0a0a0a] border border-[#333] rounded-lg text-center text-sm text-gray-400">
          <p className="font-bold text-[#D4AF37] mb-2">Demonstração:</p>
          <p>Email: admin@primebronze.com.br</p>
          <p>Senha: senha123</p>
        </div>
      </div>
    </div>
  );
}