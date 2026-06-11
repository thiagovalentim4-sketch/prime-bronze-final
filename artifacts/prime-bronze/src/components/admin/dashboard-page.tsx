import { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { authHeaders } from '@/lib/auth';

interface Stats {
  todayBookings: number;
  weekBookings: number;
  pendingBookings: number;
  todayRevenue: number;
  weekRevenue: number;
}

interface BookingSummary {
  id: string;
  clientName: string;
  startTime: string;
  endTime: string;
  status: string;
  service: { name: string };
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayBookings, setTodayBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats', { headers: authHeaders() }).then((r) => r.json()),
      fetch('/api/admin/bookings?filter=today', { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([s, b]) => {
        setStats(s ?? null);
        setTodayBookings(Array.isArray(b) ? b : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Agendamentos Hoje', value: stats?.todayBookings ?? 0, icon: Calendar, color: '#D4AF37' },
    { label: 'Agendamentos Semana', value: stats?.weekBookings ?? 0, icon: TrendingUp, color: '#60B5FF' },
    { label: 'Pendentes', value: stats?.pendingBookings ?? 0, icon: Clock, color: '#FF9149' },
    { label: 'Receita Hoje', value: `R$ ${(stats?.todayRevenue ?? 0)?.toFixed?.(2)?.replace?.('.', ',') ?? '0,00'}`, icon: DollarSign, color: '#80D8C3' },
  ];

  const statusColors: Record<string, string> = {
    PENDENTE: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMADO: 'bg-blue-500/20 text-blue-400',
    CONCLUIDO: 'bg-green-500/20 text-green-400',
    CANCELADO: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-28 bg-[#111] rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">{card.label}</p>
                      <p className="text-white font-bold text-xl">{card.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-semibold text-white">Agendamentos de Hoje</h2>
            </div>
            {(todayBookings ?? []).length === 0 ? (
              <div className="p-8 text-center text-white/40 text-sm">Nenhum agendamento para hoje</div>
            ) : (
              <div className="divide-y divide-white/5">
                {(todayBookings ?? []).map((b: BookingSummary) => (
                  <div key={b?.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{b?.clientName ?? ''}</p>
                        <p className="text-white/40 text-xs">{b?.service?.name ?? ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-sm">{b?.startTime ?? ''} - {b?.endTime ?? ''}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b?.status ?? ''] ?? 'bg-white/10 text-white/60'}`}>
                        {b?.status ?? ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
