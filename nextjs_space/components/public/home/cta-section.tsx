'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Phone } from 'lucide-react';

export function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/empresaria.jpeg" alt="Prime Bronze" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-[1200px] mx-auto px-4 text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
          Pronta para ficar <span className="text-gold-gradient">dourada</span>?
        </h2>
        <p className="text-white/60 mt-4 max-w-lg mx-auto">
          Agende agora mesmo e garanta o melhor bronze de Mesquita. Vagas limitadas!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/agendar"
            className="flex items-center justify-center gap-2 bg-gold-gradient text-black font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <Calendar className="w-5 h-5" />
            Agendar Horário
          </Link>
          <a
            href="https://wa.me/5521965068219"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-green-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
