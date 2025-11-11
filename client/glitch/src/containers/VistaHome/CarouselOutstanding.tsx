import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import VerMasButton from '../../components/VerMasButton';

const CarouselOutstanding = () => {
  // Productos destacados
  const products = [
    {
      id: 1,
      name: 'Remera Destacada 1',
      price: '$30.000,00',
      image: '/oversize blanco-01 6.svg'
    },
    {
      id: 2,
      name: 'Remera Destacada 2',
      price: '$32.000,00',
      image: '/oversize blanco-02.svg'
    },
    {
      id: 3,
      name: 'Remera Destacada 3',
      price: '$28.000,00',
      image: '/oversize blanco-01 6.svg'
    },
    {
      id: 4,
      name: 'Remera Destacada 4',
      price: '$31.000,00',
      image: '/oversize blanco-02.svg'
    },
    {
      id: 5,
      name: 'Remera Destacada 5',
      price: '$29.000,00',
      image: '/oversize blanco-01 6.svg'
    },
    {
      id: 6,
      name: 'Remera Destacada 6',
      price: '$33.000,00',
      image: '/oversize blanco-02.svg'
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

      {/* Carousel con Swiper CoverFlow */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: true,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          speed={800}
          loopAdditionalSlides={1}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="pb-16"
        >
          {products.map((product, index) => (
            <SwiperSlide key={`${product.id}-${index}`} className="!w-80">
              <div 
                className="w-full h-96 rounded-3xl flex items-center justify-center p-6 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
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
