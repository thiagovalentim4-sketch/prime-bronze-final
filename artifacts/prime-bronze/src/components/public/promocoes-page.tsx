import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Gift, Sparkles } from 'lucide-react';

export function PromocoesPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-[800px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-3">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Ofertas</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            <span className="text-gold-gradient">Promoções</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Fique por dentro das nossas promoções exclusivas
          </p>
        </motion.div>

        <motion.a
          href="https://www.instagram.com/primebronze2026"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="block bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-2xl border border-[#D4AF37]/20 p-8 md:p-12 text-center hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
            <Instagram className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Entre no nosso Instagram
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-md mx-auto mb-2">
            Para saber as promoções do mês e ficar por dentro de todas as novidades do Prime Bronze
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-[#D4AF37] font-semibold text-lg">@primebronze2026</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/40 text-sm">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Clique para acessar nosso perfil</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
        </motion.a>
      </div>
    </section>
  );
}
