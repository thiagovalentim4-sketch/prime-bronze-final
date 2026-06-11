import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'O que é o bronzeamento artificial?',
    answer: 'O bronzeamento artificial é um procedimento que utiliza equipamentos de última geração com luz UV controlada para estimular a produção de melanina na pele, proporcionando um bronzeado natural e uniforme sem a necessidade de exposição ao sol.',
  },
  {
    question: 'Quanto tempo dura a sessão?',
    answer: 'A duração varia conforme o serviço escolhido. O Bronzeamento Simples dura 30 minutos (1 lado) ou 60 minutos (2 lados). O Paredão Duplo também oferece 30 ou 60 minutos, com resultado mais intenso. O Banho de Lua tem duração de 45 minutos.',
  },
  {
    question: 'O bronzeamento artificial é seguro?',
    answer: 'Sim! Utilizamos equipamentos modernos e de qualidade, com controle de tempo e intensidade. A pele é avaliada antes de cada sessão e recomendamos sempre o uso de protetor labial e óculos de proteção.',
  },
  {
    question: 'Preciso agendar com antecedência?',
    answer: 'Recomendamos agendar com pelo menos 1 dia de antecedência para garantir seu horário. Você pode agendar diretamente pelo site ou pelo WhatsApp.',
  },
  {
    question: 'Posso fazer bronzeamento se estiver grávida?',
    answer: 'Não recomendamos o bronzeamento artificial durante a gravidez. É sempre melhor consultar seu médico antes de qualquer procedimento estético nesse período.',
  },
  {
    question: 'Como devo me preparar para a sessão?',
    answer: 'Esfolie a pele 24h antes, não passe hidratantes, óleos, desodorantes ou perfumes na pele no dia da sessão. A pele deve estar limpa, seca e livre de produtos.',
  },
  {
    question: 'Qual a diferença entre Bronzeamento Simples e Paredão Duplo?',
    answer: 'O Bronzeamento Simples utiliza um equipamento padrão com resultado natural. O Paredão Duplo utiliza equipamento duplo, proporcionando um bronze mais intenso e duradouro em menos tempo.',
  },
  {
    question: 'O que é o Banho de Lua?',
    answer: 'O Banho de Lua é um tratamento exclusivo que clareia e realça a pele, deixando-a com um brilho luminoso. É ideal para quem deseja uma pele mais clara e radiante.',
  },
  {
    question: 'Quanto tempo dura o resultado do bronzeamento?',
    answer: 'O resultado do bronzeamento artificial dura em média 7 a 10 dias, dependendo do tipo de pele e dos cuidados pós-sessão. Manter a hidratação da pele é fundamental para prolongar o resultado.',
  },
  {
    question: 'Qual é o endereço do estúdio?',
    answer: 'Estamos localizados na Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ.',
  },
];

function FaqItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#111] rounded-xl border border-[#D4AF37]/10 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-medium text-white text-sm pr-4">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed">
          {faq.answer}
        </div>
      )}
    </motion.div>
  );
}

export function FaqPage() {
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
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Dúvidas</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            Perguntas <span className="text-gold-gradient">Frequentes</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Tire suas dúvidas sobre o bronzeamento artificial
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.question} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
