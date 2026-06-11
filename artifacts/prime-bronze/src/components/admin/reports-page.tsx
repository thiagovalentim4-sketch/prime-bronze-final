import { useEffect, useState } from 'react';
import { Calendar, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authHeaders } from '@/lib/auth';

interface ReportData {
  period: string;
  totalBookings: number;
  totalRevenue: number;
  completed: number;
  pending: number;
  cancelled: number;
  topServices: { name: string; count: number; revenue: number }[];
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/reports?period=${activeTab}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const tabs = [
    { key: 'daily' as const, label: 'Diário', icon: Calendar },
    { key: 'weekly' as const, label: 'Semanal', icon: TrendingUp },
    { key: 'monthly' as const, label: 'Mensal', icon: BarChart3 },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Relatórios</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#111] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111] rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Agendamentos</p>
                  <p className="text-white font-bold text-xl">{data?.totalBookings ?? 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111] rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Receita</p>
                  <p className="text-white font-bold text-xl">
                    R$ {((data?.totalRevenue ?? 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111] rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Concluídos</p>
                  <p className="text-white font-bold text-xl">{data?.completed ?? 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111] rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Pendentes</p>
                  <p className="text-white font-bold text-xl">{data?.pending ?? 0}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Top services */}
          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <h2 className="font-semibold text-white mb-4">Serviços mais agendados</h2>
            {(data?.topServices ?? []).length === 0 ? (
              <div className="text-center text-white/40 text-sm py-8">Nenhum dado disponível</div>
            ) : (
              <div className="space-y-3">
                {(data?.topServices ?? []).map((svc, i) => (
                  <div key={svc.name} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm">{svc.name}</span>
                        <span className="text-white/60 text-sm">{svc.count} agendamentos</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((svc.count / (data?.topServices?.[0]?.count ?? 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-[#D4AF37] rounded-full"
                        />
                      </div>
                    </div>
                    <div className="text-[#D4AF37] font-bold text-sm w-24 text-right">
                      R$ {(svc.revenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
