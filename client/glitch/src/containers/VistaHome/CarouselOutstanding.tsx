import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import VerMasButton from '../../components/VerMasButton';

const CarouselOutstanding = () => {
  // Productos destacados
  const products = [
    {
      id: 1,
      name: 'Hollow Knight - Blanco Oversize',
      price: '$30.000,00',
      image: '/HollowKnight/d1-blanco-oversize.png'
    },
    {
      id: 2,
      name: 'Hollow Knight - Negro Oversize',
      price: '$30.000,00',
      image: '/HollowKnight/d1-negro-oversize.png'
    },
    {
      id: 3,
      name: 'Hotline Miami',
      price: '$32.000,00',
      image: '/HotlineMiami/Asset 3.png'
    },
    {
      id: 4,
      name: 'Hotline Miami',
      price: '$32.000,00',
      image: '/HotlineMiami/Asset 5.png'
    },
    {
      id: 5,
      name: 'Hollow Knight - Blanco Oversize Esp',
      price: '$30.000,00',
      image: '/HollowKnight/d2-blanco-oversize.png'
    },
    {
      id: 6,
      name: 'Hotline Miami',
      price: '$32.000,00',
      image: '/HotlineMiami/Asset 7.png'
    }
  ];

  return (
    <section className="w-full bg-gris py-16">
      {/* Título */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Drops destacados</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Aca podes ver nuestros productos mas vendidos!
        </p>
      </div>

      {/* Carousel con Swiper Loop Infinito */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <Swiper
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={30}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          loop={true}
          loopedSlides={6}
          speed={3000}
          freeMode={true}
          freeModeMomentum={false}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className="pb-8"
        >
          {products.map((product, index) => (
            <SwiperSlide key={`${product.id}-${index}`}>
              <div 
                className="w-full h-96 rounded-3xl flex items-center justify-center p-6 overflow-hidden bg-azul-oscuro border border-gray-700 hover:border-verde transition-all shadow-xl">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Botón Ver más */}
      <div className="flex justify-center mt-8">
        <VerMasButton />
      </div>
    </section>
  );
};

export default CarouselOutstanding;
