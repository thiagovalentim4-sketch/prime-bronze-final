'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

export function ContactPage() {
  return (
    <section className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            <span className="text-gold-gradient">Contato</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Entre em contato ou visite nosso estúdio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Endereço</h3>
                  <p className="text-white/50 text-sm">Rua Guaratá, 30 - Santa Terezinha</p>
                  <p className="text-white/50 text-sm">Mesquita - RJ</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Telefone / WhatsApp</h3>
                  <p className="text-white/50 text-sm">(21) 96506-8219</p>
                </div>
              </div>
              <a
                href="https://wa.me/5521965068219?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Prime%20Bronze."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </div>

            <div className="bg-[#111] rounded-xl p-6 border border-[#D4AF37]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Horário de Funcionamento</h3>
                  <p className="text-white/50 text-sm">Segunda a Sexta: 9h às 20h</p>
                  <p className="text-white/50 text-sm">Sábado: 9h às 18h</p>
                  <p className="text-white/50 text-sm">Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl overflow-hidden border border-[#D4AF37]/10 h-[400px] md:h-full min-h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.5!2d-43.39!3d-22.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ2JzEyLjAiUyA0M8KwMjMnMjQuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Prime Bronze"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
