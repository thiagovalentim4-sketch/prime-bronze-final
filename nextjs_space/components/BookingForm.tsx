'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatPhoneDisplay } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface BookingFormProps {
  onSuccess?: () => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    date: '',
    startTime: '',
    notes: '',
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services');
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar agendamento');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Agendamento realizado com sucesso!');
      setFormData({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        serviceId: '',
        date: '',
        startTime: '',
        notes: '',
      });
      setStep(1);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    const formatted = formatPhoneDisplay(cleaned);
    setFormData({ ...formData, clientPhone: cleaned });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.clientPhone) {
        toast.error('Preencha nome e telefone');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.serviceId) {
        toast.error('Selecione um serviço');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.date || !formData.startTime) {
        toast.error('Selecione data e horário');
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    mutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#0a0a0a] border border-[#D4AF37] rounded-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 mx-1 rounded ${
                s <= step ? 'bg-[#D4AF37]' : 'bg-[#333]'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-400">
          Etapa {step} de 4
        </p>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#D4AF37]">Seus Dados</h3>
          <div>
            <label className="block text-sm mb-2">Nome Completo</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Telefone</label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 bg-black border border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="(21) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email (opcional)</label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="seu@email.com"
            />
          </div>
        </div>
      )}

      {/* Step 2: Service Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#D4AF37]">Escolha um Serviço</h3>
          <div className="space-y-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setFormData({ ...formData, serviceId: service.id })}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  formData.serviceId === service.id
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                    : 'border-[#333] bg-black text-white hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{service.name}</p>
                    <p className="text-sm opacity-75">{service.duration} min</p>
                  </div>
                  <p className="font-bold">R$ {service.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Date and Time */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#D4AF37]">Data e Horário</h3>
          <div>
            <label className="block text-sm mb-2">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Horário</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#D4AF37]">Confirme seus Dados</h3>
          <div className="bg-black p-4 rounded-lg space-y-2 border border-[#333]">
            <p><span className="text-[#D4AF37]">Nome:</span> {formData.clientName}</p>
            <p><span className="text-[#D4AF37]">Telefone:</span> {formData.clientPhone}</p>
            <p><span className="text-[#D4AF37]">Serviço:</span> {services.find(s => s.id === formData.serviceId)?.name}</p>
            <p><span className="text-[#D4AF37]">Data:</span> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>
            <p><span className="text-[#D4AF37]">Horário:</span> {formData.startTime}</p>
          </div>
          <div>
            <label className="block text-sm mb-2">Observações (opcional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              rows={3}
              placeholder="Alguma observação especial?"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black transition"
          >
            Voltar
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="flex-1 btn-gold"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex-1 btn-gold disabled:opacity-50"
          >
            {mutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        )}
      </div>
    </div>
  );
}