
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Sun, Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/recepcao.jpeg"
          alt="Estúdio Prime Bronze"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-[#D4AF37]/50">
            <img src="/images/logo.jpeg" alt="Prime Bronze" className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Sun className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Bronzeamento Artificial</span>
            <Sun className="w-5 h-5" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-white">Prime </span>
            <span className="text-gold-gradient">Bronze</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-xl">
            Seu Brilho, Nossa Paixão. O melhor bronzeamento artificial de Mesquita com equipamentos de última geração.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/agendar"
              className="flex items-center justify-center gap-2 bg-gold-gradient text-black font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-base"
            >
              <Calendar className="w-5 h-5" />
              Agendar Horário
            </Link>
            <Link
              href="/servicos"
              className="flex items-center justify-center gap-2 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold px-8 py-3.5 rounded-full hover:bg-[#D4AF37]/10 transition-colors text-base"
            >
              Ver Serviços
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
