import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sun, Moon, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const services = [
  { name: 'Paredão Duplo - 1h', price: 'R$ 39,99', duration: '60 min', icon: Sun, desc: 'Bronze uniforme e natural' },
  { name: 'Paredão Duplo - 1h30', price: 'R$ 49,99', duration: '90 min', icon: Sun, desc: 'Bronze mais intenso' },
  { name: 'Paredão Duplo - 2h', price: 'R$ 59,99', duration: '120 min', icon: Sun, desc: 'Máxima intensidade' },
  { name: 'Banho de Lua', price: 'R$ 9,99', duration: '30 min', icon: Moon, desc: 'Clareamento corporal' },
];

export function ServicesPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">Nossos <span className="text-gold-gradient">Serviços</span></h2>
          <p className="text-white/50 mt-3 max-w-md mx-auto">Tratamentos profissionais com equipamentos de última geração</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/5 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-white text-base">{svc.name}</h3>
                <p className="text-white/40 text-sm mt-1">{svc.desc}</p>
                <div className="flex items-center gap-2 mt-3 text-white/50 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{svc.duration}</span>
                </div>
                <p className="text-[#D4AF37] font-bold text-xl mt-3">{svc.price}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold hover:underline"
          >
            Ver todos os serviços <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
