import { useEffect, useState, useCallback, Suspense } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, Sun, Moon, Check, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string;
}

interface Slot {
  time: string;
  available: boolean;
}

function BookingForm() {
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const preselectedService = search.get('servico') ?? '';

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>(preselectedService);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data ?? []);
        if (preselectedService) setSelectedService(preselectedService);
      })
      .catch(() => setServices([]));
  }, [preselectedService]);

  const fetchSlots = useCallback(async (date: string, serviceId: string) => {
    if (!date || !serviceId) return;
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/public/slots?date=${date}&serviceId=${serviceId}`);
      const data = await res.json();
      setSlots(data?.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchSlots(selectedDate, selectedService);
      setSelectedTime('');
    }
  }, [selectedDate, selectedService, fetchSlots]);

  // Get min date (today)
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const currentService = services.find((s) => s?.id === selectedService);

  const handleSubmit = async () => {
    if (!clientName || !clientPhone) {
      toast.error('Preencha nome e telefone');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientEmail,
          serviceId: selectedService,
          date: selectedDate,
          startTime: selectedTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Erro ao agendar');
        return;
      }
      setBookingResult(data);
      setStep(5);
    } catch {
      toast.error('Erro ao agendar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  const openWhatsApp = () => {
    const svcName = currentService?.name ?? '';
    const msg = encodeURIComponent(
      `Olá! Gostaria de confirmar meu agendamento no Prime Bronze:\n\n· Data: ${formatDate(selectedDate)}\n· Horário: ${selectedTime}\n· Serviço: ${svcName}\n· Nome: ${clientName}\n· Telefone: ${clientPhone}`
    );
    window.open(`https://wa.me/5521965068219?text=${msg}`, '_blank');
  };

  if (step === 5 && bookingResult) {
    return (
      <section className="py-16">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] rounded-xl p-8 border border-[#D4AF37]/20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Agendamento Realizado!</h2>
            <p className="text-white/50 mt-2 text-sm">Confirme pelo WhatsApp para garantir sua vaga</p>

            <div className="mt-6 bg-black/40 rounded-lg p-4 text-left space-y-2">
              <p className="text-white/70 text-sm"><span className="text-[#D4AF37]">Serviço:</span> {currentService?.name ?? ''}</p>
              <p className="text-white/70 text-sm"><span className="text-[#D4AF37]">Data:</span> {formatDate(selectedDate)}</p>
              <p className="text-white/70 text-sm"><span className="text-[#D4AF37]">Horário:</span> {selectedTime}</p>
              <p className="text-white/70 text-sm"><span className="text-[#D4AF37]">Valor:</span> {formatPrice(currentService?.price ?? 0)}</p>
            </div>

            <button
              onClick={openWhatsApp}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Confirmar no WhatsApp
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-[700px] mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
            Agendar <span className="text-gold-gradient">Horário</span>
          </h1>
          <p className="text-white/50 mt-2">Escolha o serviço, data e horário</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/40'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#D4AF37]" /> Escolha o Serviço
              </h2>
              <div className="grid gap-3">
                {(services ?? []).map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => { setSelectedService(svc.id); setStep(2); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedService === svc.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40'
                        : 'bg-[#111] border-white/5 hover:border-[#D4AF37]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {svc?.category === 'TRATAMENTO' ? <Moon className="w-5 h-5 text-[#D4AF37]" /> : <Sun className="w-5 h-5 text-[#D4AF37]" />}
                        <div>
                          <p className="font-semibold text-white">{svc?.name ?? ''}</p>
                          <p className="text-white/40 text-xs">{svc?.duration ?? 0} min</p>
                        </div>
                      </div>
                      <p className="text-[#D4AF37] font-bold">R$ {svc?.price?.toFixed?.(2)?.replace?.('.', ',') ?? '0,00'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" /> Escolha a Data
              </h2>
              <input
                type="date"
                min={minDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#111] border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none [color-scheme:dark]"
              />
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button
                  onClick={() => selectedDate && setStep(3)}
                  disabled={!selectedDate}
                  className="flex items-center gap-2 bg-gold-gradient text-black font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" /> Escolha o Horário
              </h2>
              {slotsLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[1,2,3,4,5,6,7,8].map((i) => <div key={i} className="h-12 bg-[#111] rounded-lg animate-pulse" />)}
                </div>
              ) : (slots ?? []).length === 0 ? (
                <p className="text-white/40 text-center py-8">Nenhum horário disponível nesta data</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {(slots ?? []).map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? 'bg-[#D4AF37] text-black'
                          : slot.available
                          ? 'bg-[#111] text-white hover:border-[#D4AF37]/40 border border-white/5'
                          : 'bg-[#111] text-white/20 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {slot?.time ?? ''}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button
                  onClick={() => selectedTime && setStep(4)}
                  disabled={!selectedTime}
                  className="flex items-center gap-2 bg-gold-gradient text-black font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Client Info */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" /> Seus Dados
              </h2>

              {/* Summary */}
              <div className="bg-[#111] rounded-xl p-4 mb-6 border border-[#D4AF37]/10">
                <p className="text-white/50 text-xs mb-2">Resumo do agendamento</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-white"><span className="text-[#D4AF37]">Serviço:</span> {currentService?.name ?? ''}</span>
                  <span className="text-white"><span className="text-[#D4AF37]">Data:</span> {formatDate(selectedDate)}</span>
                  <span className="text-white"><span className="text-[#D4AF37]">Horário:</span> {selectedTime}</span>
                  <span className="text-white"><span className="text-[#D4AF37]">Valor:</span> R$ {currentService?.price?.toFixed?.(2)?.replace?.('.', ',') ?? '0,00'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Nome completo *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-4 pl-11 rounded-xl bg-[#111] border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="tel"
                    placeholder="Telefone/WhatsApp *"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-4 pl-11 rounded-xl bg-[#111] border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email (opcional)"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-4 pl-11 rounded-xl bg-[#111] border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !clientName || !clientPhone}
                  className="flex items-center gap-2 bg-gold-gradient text-black font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function BookingPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-white/40">Carregando...</div>}>
      <BookingForm />
    </Suspense>
  );
}
