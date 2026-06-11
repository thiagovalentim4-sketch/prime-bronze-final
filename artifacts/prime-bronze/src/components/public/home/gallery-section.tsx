
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Camera } from 'lucide-react';

const images = [
  { src: '/images/recepcao.jpeg', alt: 'Recepção do estúdio' },
  { src: '/images/equipamento.jpeg', alt: 'Equipamento de bronzeamento' },
  { src: '/images/sala.jpeg', alt: 'Sala de preparação' },
];

export function GallerySection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-black">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-3">
            <Camera className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Nosso Espaço</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
            Conheça o <span className="text-gold-gradient">Estúdio</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
