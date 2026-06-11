import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Zap, Heart, Star, Sparkles, ThumbsUp } from 'lucide-react';

const benefits = [
  { icon: Zap, title: 'Equipamentos Modernos', desc: 'Paredão duplo de última geração para resultados incríveis' },
  { icon: Shield, title: 'Segurança', desc: 'Profissionais treinados e protocolos de segurança' },
  { icon: Heart, title: 'Cuidado com a Pele', desc: 'Orientações personalizadas para cada tipo de pele' },
  { icon: Star, title: 'Resultado Natural', desc: 'Bronze dourado e uniforme em todo o corpo' },
  { icon: Sparkles, title: 'Ambiente Premium', desc: 'Espaço aconchegante e climatizado' },
  { icon: ThumbsUp, title: 'Melhor Preço', desc: 'Valores acessíveis com a melhor qualidade' },
];

export function BenefitsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-[#080808]">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">Por que escolher o <span className="text-gold-gradient">Prime Bronze</span>?</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-xl bg-[#111] border border-white/5 hover:border-[#D4AF37]/20 transition-all"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{b.title}</h3>
                  <p className="text-white/40 text-xs mt-1">{b.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
