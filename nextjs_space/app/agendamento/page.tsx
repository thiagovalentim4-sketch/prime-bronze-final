import { BookingForm } from '@/components/BookingForm';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-[#1a1a1a]">
      {/* Header */}
      <div className="border-b border-[#D4AF37] bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Prime Bronze</h1>
          <p className="text-gray-400">Realize seu agendamento de bronzeamento</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Sobre Prime Bronze</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Experiência completa em bronzeamento artificial com equipamentos de última geração.
                Venha conhecer nossa estrutura premium!
              </p>
            </div>

            {/* Schedule */}
            <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Horário de Funcionamento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Segunda - Sexta</span>
                  <span className="text-[#D4AF37]">09:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="text-[#D4AF37]">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-[#D4AF37]">Fechado</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Contato</h3>
              <div className="space-y-2 text-sm">
                <p>📱 <span className="text-[#D4AF37]">(21) 96506-8219</span></p>
                <p>📧 contato@primebronze.com.br</p>
                <p>📍 Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ</p>
              </div>
            </div>

            {/* Services */}
            <div className="bg-[#0a0a0a] border border-[#D4AF37] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Nossos Serviços</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Bronzeamento 10 min</span>
                  <span className="text-[#D4AF37]">R$ 25</span>
                </li>
                <li className="flex justify-between">
                  <span>Bronzeamento 15 min</span>
                  <span className="text-[#D4AF37]">R$ 35</span>
                </li>
                <li className="flex justify-between">
                  <span>Bronzeamento 20 min</span>
                  <span className="text-[#D4AF37]">R$ 45</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}