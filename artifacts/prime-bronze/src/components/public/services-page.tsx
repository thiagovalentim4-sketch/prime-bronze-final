import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Clock, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string;
  active: boolean;
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/services')
      .then((r) => r.json())
      .then((data) => setServices(data ?? []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            Nossos <span className="text-gold-gradient">Serviços</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Conheça todos os tratamentos disponíveis no Prime Bronze
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-[#111] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(services ?? []).map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                      {svc?.category === 'especial' ? (
                        <Moon className="w-6 h-6 text-[#D4AF37]" />
                      ) : svc?.category === 'extra' ? (
                        <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                      ) : (
                        <Sun className="w-6 h-6 text-[#D4AF37]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{svc?.name ?? ''}</h3>
                      <div className="flex items-center gap-3 mt-1 text-white/40 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {svc?.duration ?? 0} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] font-bold text-2xl">{formatPrice(svc?.price ?? 0)}</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm mt-4">{svc?.description ?? ''}</p>
                <Link
                  href={`/agendar?servico=${svc?.id ?? ''}`}
                  className="inline-flex items-center gap-2 mt-4 bg-gold-gradient text-black font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  <Calendar className="w-4 h-4" />
                  Agendar
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
