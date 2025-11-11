import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';

const UserReview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // Reseñas de usuarios
  const reviews = [
    {
      id: 1,
      name: 'Juan Pérez',
      rating: 5,
      comment: 'Increíble calidad de las remeras! El diseño es único y la tela es super cómoda. Definitivamente voy a comprar más.',
      image: 'https://picsum.photos/400/500?random=1',
      date: 'Hace 2 días'
    },
    {
      id: 2,
      name: 'María González',
      rating: 5,
      comment: 'Me encantó el estilo urbano de Glitch. La remera que compré tiene un fit perfecto y los detalles son impresionantes.',
      image: 'https://picsum.photos/400/500?random=2',
      date: 'Hace 1 semana'
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      rating: 4,
      comment: 'Muy buen producto, la entrega fue rápida y el empaque excelente. El diseño es tal cual se ve en las fotos.',
      image: 'https://picsum.photos/400/500?random=3',
      date: 'Hace 2 semanas'
    }
  ];

  // Manejar el loop manualmente cuando llega al final
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        if (swiperRef.current.activeIndex === reviews.length - 1) {
          // Si está en el último slide, volver al primero
          setTimeout(() => {
            swiperRef.current?.slideTo(0);
          }, 3000);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section className="w-full bg-gris py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experiencias reales de personas que confiaron en Glitch
          </p>
        </div>

        {/* Contenedor de Cards y Texto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Cards a la izquierda */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards, Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                speed={800}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex % reviews.length)}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setActiveIndex(0);
                }}
                className="w-80 h-96"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id}>
                    <div 
                      className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                      style={{
                        backgroundImage: `url('/patron-fondo-glitch.svg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <img 
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Texto a la derecha */}
          <div className="text-white">
            <div className="transition-all duration-500">
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < reviews[activeIndex].rating ? 'text-verde' : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Comentario */}
              <p className="text-xl text-gray-300 mb-6 leading-relaxed italic">
                "{reviews[activeIndex].comment}"
              </p>

              {/* Información del usuario */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-verde font-bold text-lg">{reviews[activeIndex].name}</p>
                <p className="text-gray-500 text-sm">{reviews[activeIndex].date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserReview;
