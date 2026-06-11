import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Sparkles, X, Droplets, Sun, Shield } from 'lucide-react';

const antesItems = [
  {
    title: 'Esfolie a pele',
    desc: 'A esfoliação remove células mortas, deixa a pele mais lisa e uniforme, garantindo um bronzeado perfeito.',
    icon: Sparkles,
  },
  {
    title: 'Não passe produtos',
    desc: 'Não aplique hidratantes, óleos, desodorantes, perfumes ou protetores antes da sessão. Qualquer produto pode criar uma barreira na pele.',
    icon: X,
  },
  {
    title: 'Pele limpa e seca',
    desc: 'A pele deve estar totalmente limpa, seca e livre de produtos para absorver o bronzeamento de forma uniforme.',
    icon: Droplets,
  },
];

const aposItems = [
  {
    title: 'Hidrate a pele',
    desc: 'Mantenha a pele sempre hidratada após o bronzeamento. A hidratação prolonga o resultado e evita ressecamento.',
    icon: Droplets,
  },
  {
    title: 'Evite banhos muito quentes',
    desc: 'Banhos muito quentes podem remover o bronzeamento mais rápido. Prefira água morna.',
    icon: Sun,
  },
  {
    title: 'Use protetor solar',
    desc: 'Mesmo com o bronzeamento artificial, é importante usar protetor solar ao se expor ao sol natural.',
    icon: Shield,
  },
  {
    title: 'Não esfolie nos primeiros 3 dias',
    desc: 'Evite esfoliação ou produtos ácidos nos primeiros 3 dias para não remover o bronzeamento.',
    icon: Heart,
  },
];

export function CuidadosPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            Cuidados <span className="text-gold-gradient">Prime Bronze</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Antes e após a sessão para um resultado perfeito
          </p>
        </motion.div>

        {/* Before section */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sun className="w-6 h-6 text-[#D4AF37]" />
            Antes da Sessão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {antesItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* After section */}
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#D4AF37]" />
            Após a Sessão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aposItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
