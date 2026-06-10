import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { BookingsTable } from '@/components/BookingsTable';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-[#D4AF37] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient-gold">Prime Bronze</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{session.user?.email}</span>
            <a
              href="/api/auth/signout"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Sair
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Stats Cards */}
          <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Hoje</p>
            <p className="text-2xl font-bold text-[#D4AF37]">0</p>
            <p className="text-xs text-gray-500">Agendamentos</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Pendentes</p>
            <p className="text-2xl font-bold text-[#D4AF37]">0</p>
            <p className="text-xs text-gray-500">Confirmações</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Este Mês</p>
            <p className="text-2xl font-bold text-[#D4AF37]">R$ 0</p>
            <p className="text-xs text-gray-500">Receita</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Clientes</p>
            <p className="text-2xl font-bold text-[#D4AF37]">0</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-6">
          <BookingsTable />
        </div>
      </main>
    </div>
  );
}