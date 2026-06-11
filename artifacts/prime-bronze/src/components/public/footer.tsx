
import { Link } from 'wouter';
import { MapPin, Phone, Clock } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-black border-t border-[#D4AF37]/20">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img src="/images/logo.jpeg" alt="Prime Bronze" className="w-full h-full object-cover" />
            </div>
            <p className="text-[#D4AF37] font-display font-bold text-lg">Prime Bronze</p>
            <p className="text-white/50 text-sm italic">Seu Brilho, Nossa Paixão</p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-white/70">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
              <span>Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>(21) 96506-8219</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Seg-Sex: 9h-20h | Sáb: 9h-18h | Dom: 8h-12h</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[#D4AF37] font-semibold text-sm">Navegação</p>
            <Link href="/servicos" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">Serviços</Link>
            <Link href="/promocoes" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">Promoções</Link>
            <Link href="/faq" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">Perguntas Frequentes</Link>
            <Link href="/cuidados" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">Cuidados</Link>
            <Link href="/sobre" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">Sobre</Link>
            <Link href="/agendar" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">Agendar</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © 2026 Prime Bronze. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
