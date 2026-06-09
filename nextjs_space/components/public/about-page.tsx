'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sun, Heart, Star, Shield } from 'lucide-react';

export function AboutPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            Sobre o <span className="text-gold-gradient">Prime Bronze</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Seu Brilho, Nossa Paixão
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative aspect-[3/4] rounded-xl overflow-hidden"
          >
            <Image src="/images/empresaria.jpeg" alt="Proprietária do Prime Bronze" fill className="object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              Nossa História
            </h2>
            <p className="text-white/60 leading-relaxed">
              O Prime Bronze nasceu da paixão por beleza e autoestima. Localizado no coração de Mesquita, no bairro Santa Terezinha, nosso estúdio oferece o que há de melhor em bronzeamento artificial.
            </p>
            <p className="text-white/60 leading-relaxed">
              Com equipamentos de última geração, incluindo paredão duplo e tratamentos complementares como o Banho de Lua, garantimos resultados profissionais com total segurança e conforto.
            </p>
            <p className="text-white/60 leading-relaxed">
              Mantenha sua pele saudável, com uma alimentação em dia e a hidratação impecável. Nosso compromisso é realçar sua beleza natural com o bronze perfeito.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { icon: Sun, label: 'Equipamentos Modernos' },
                { icon: Heart, label: 'Cuidado Personalizado' },
                { icon: Star, label: 'Resultado Premium' },
                { icon: Shield, label: 'Total Segurança' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-white/70">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
