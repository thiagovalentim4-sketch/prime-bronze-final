import { useEffect, useState, useCallback } from 'react';
import { Settings, Clock, Hash, Save } from 'lucide-react';
import { toast } from 'sonner';

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

interface BusinessHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface SettingsData {
  slotInterval: number;
  maxSimultaneous: number;
  whatsappNumber: string;
  address: string;
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({ slotInterval: 30, maxSimultaneous: 2, whatsappNumber: '', address: '' });
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data?.settings ?? { slotInterval: 30, maxSimultaneous: 2, whatsappNumber: '', address: '' });
      setHours(data?.hours ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, hours }),
      });
      if (res.ok) {
        toast.success('Configurações salvas');
      } else {
        toast.error('Erro ao salvar');
      }
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const updateHour = (dayOfWeek: number, field: string, value: any) => {
    setHours((prev) =>
      (prev ?? []).map((h) =>
        h?.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  if (loading) {
    return <div className="text-center text-white/40 py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Configurações</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gold-gradient text-black font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-[#111] rounded-xl p-6 border border-white/5 mb-6">
        <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-[#D4AF37]" /> Configurações Gerais
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/40 text-xs block mb-1">Intervalo de Slots (min)</label>
            <input
              type="number"
              value={settings?.slotInterval ?? 30}
              onChange={(e) => setSettings({ ...(settings ?? {}), slotInterval: Number(e.target.value) } as SettingsData)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs block mb-1">Nº de Equipamentos</label>
            <input
              type="number"
              value={settings?.maxSimultaneous ?? 2}
              onChange={(e) => setSettings({ ...(settings ?? {}), maxSimultaneous: Number(e.target.value) } as SettingsData)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs block mb-1">WhatsApp</label>
            <input
              type="text"
              value={settings?.whatsappNumber ?? ''}
              onChange={(e) => setSettings({ ...(settings ?? {}), whatsappNumber: e.target.value } as SettingsData)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs block mb-1">Endereço</label>
            <input
              type="text"
              value={settings?.address ?? ''}
              onChange={(e) => setSettings({ ...(settings ?? {}), address: e.target.value } as SettingsData)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-[#111] rounded-xl p-6 border border-white/5">
        <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#D4AF37]" /> Horário de Funcionamento
        </h2>
        <div className="space-y-3">
          {(hours ?? []).sort((a, b) => (a?.dayOfWeek ?? 0) - (b?.dayOfWeek ?? 0)).map((h) => (
            <div key={h?.id} className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 w-28">
                <input
                  type="checkbox"
                  checked={h?.isOpen ?? false}
                  onChange={(e) => updateHour(h?.dayOfWeek ?? 0, 'isOpen', e.target.checked)}
                  className="rounded accent-[#D4AF37]"
                />
                <span className={`text-sm ${h?.isOpen ? 'text-white' : 'text-white/30'}`}>
                  {dayNames[h?.dayOfWeek ?? 0] ?? ''}
                </span>
              </label>
              {h?.isOpen && (
                <>
                  <input
                    type="time"
                    value={h?.openTime ?? '09:00'}
                    onChange={(e) => updateHour(h?.dayOfWeek ?? 0, 'openTime', e.target.value)}
                    className="p-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none [color-scheme:dark]"
                  />
                  <span className="text-white/30">até</span>
                  <input
                    type="time"
                    value={h?.closeTime ?? '20:00'}
                    onChange={(e) => updateHour(h?.dayOfWeek ?? 0, 'closeTime', e.target.value)}
                    className="p-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none [color-scheme:dark]"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
