import { useEffect, useState, useCallback } from 'react';
import { Calendar, Search, Filter, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  service: { id: string; name: string; price: number };
}

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

const statusColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMADO: 'bg-blue-500/20 text-blue-400',
  CONCLUIDO: 'bg-green-500/20 text-green-400',
  CANCELADO: 'bg-red-500/20 text-red-400',
};

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.set('filter', filterType);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterDate) params.set('date', filterDate);
      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();
      setBookings(data ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDate, filterType]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success('Status atualizado');
        fetchBookings();
      } else {
        toast.error('Erro ao atualizar');
      }
    } catch {
      toast.error('Erro ao atualizar');
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('pt-BR');
    } catch {
      return d;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Agendamentos</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setFilterDate(''); }}
          className="px-3 py-2 rounded-lg bg-[#111] border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
        >
          <option value="all">Todos</option>
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#111] border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => { setFilterDate(e.target.value); setFilterType('all'); }}
          className="px-3 py-2 rounded-lg bg-[#111] border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none [color-scheme:dark]"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] rounded-xl border border-white/5 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-white/40">Carregando...</div>
        ) : (bookings ?? []).length === 0 ? (
          <div className="p-8 text-center text-white/40">Nenhum agendamento encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-white/40 font-medium">Cliente</th>
                <th className="text-left p-4 text-white/40 font-medium">Serviço</th>
                <th className="text-left p-4 text-white/40 font-medium">Data</th>
                <th className="text-left p-4 text-white/40 font-medium">Horário</th>
                <th className="text-left p-4 text-white/40 font-medium">Status</th>
                <th className="text-left p-4 text-white/40 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(bookings ?? []).map((b) => (
                <tr key={b?.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <p className="text-white font-medium">{b?.clientName ?? ''}</p>
                    <p className="text-white/40 text-xs">{b?.clientPhone ?? ''}</p>
                  </td>
                  <td className="p-4 text-white/70">{b?.service?.name ?? ''}</td>
                  <td className="p-4 text-white/70">{formatDate(b?.date ?? '')}</td>
                  <td className="p-4 text-white/70">{b?.startTime ?? ''} - {b?.endTime ?? ''}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b?.status ?? ''] ?? ''}`}>
                      {b?.status ?? ''}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {b?.status === 'PENDENTE' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'CONFIRMADO')} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400" title="Confirmar">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(b.id, 'CANCELADO')} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400" title="Cancelar">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {b?.status === 'CONFIRMADO' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'CONCLUIDO')} className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400" title="Concluir">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(b.id, 'CANCELADO')} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400" title="Cancelar">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
