import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  active: boolean;
  category: string;
  sortOrder: number;
}

export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', description: '', duration: 60, price: 0, category: 'BRONZEAMENTO', active: true, sortOrder: 0 });

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data ?? []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', duration: 60, price: 0, category: 'BRONZEAMENTO', active: true, sortOrder: 0 });
    setShowForm(true);
  };

  const openEdit = (svc: Service) => {
    setEditing(svc);
    setForm({
      name: svc?.name ?? '',
      description: svc?.description ?? '',
      duration: svc?.duration ?? 60,
      price: svc?.price ?? 0,
      category: svc?.category ?? 'BRONZEAMENTO',
      active: svc?.active ?? true,
      sortOrder: svc?.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      const res = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editing ? 'Serviço atualizado' : 'Serviço criado');
        setShowForm(false);
        fetchServices();
      } else {
        const data = await res.json();
        toast.error(data?.error ?? 'Erro');
      }
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  const toggleActive = async (svc: Service) => {
    try {
      await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: svc.id, active: !svc.active }),
      });
      fetchServices();
    } catch {
      toast.error('Erro');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Serviços</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gold-gradient text-black font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#111] rounded-xl p-6 w-full max-w-md border border-[#D4AF37]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">{editing ? 'Editar' : 'Novo'} Serviço</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome do serviço"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
              <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none h-20 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs block mb-1">Duração (min)</label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs block mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="BRONZEAMENTO">Bronzeamento</option>
                <option value="TRATAMENTO">Tratamento</option>
              </select>
              <button type="submit" className="w-full bg-gold-gradient text-black font-bold py-3 rounded-lg hover:opacity-90">
                {editing ? 'Salvar' : 'Criar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="grid gap-3">
        {loading ? (
          [1,2,3].map((i) => <div key={i} className="h-20 bg-[#111] rounded-xl animate-pulse" />)
        ) : (services ?? []).map((svc) => (
          <div key={svc?.id} className={`bg-[#111] rounded-xl p-4 border transition-all ${
            svc?.active ? 'border-white/5' : 'border-white/5 opacity-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  {svc?.category === 'TRATAMENTO' ? <Moon className="w-5 h-5 text-[#D4AF37]" /> : <Sun className="w-5 h-5 text-[#D4AF37]" />}
                </div>
                <div>
                  <p className="text-white font-medium">{svc?.name ?? ''}</p>
                  <p className="text-white/40 text-xs">{svc?.duration ?? 0}min | R$ {svc?.price?.toFixed?.(2)?.replace?.('.', ',') ?? '0,00'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(svc)}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    svc?.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {svc?.active ? 'Ativo' : 'Inativo'}
                </button>
                <button onClick={() => openEdit(svc)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
