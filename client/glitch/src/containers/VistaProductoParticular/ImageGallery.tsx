import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ImageGalleryProps {
  productId: number;
  productName: string;
}

const ImageGallery = ({ productId, productName }: ImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Generar 4 imágenes placeholder de Lorem Picsum
  const images = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/seed/${productId}-${i}/600/600`,
    thumbnail: `https://picsum.photos/seed/${productId}-${i}/150/150`,
    alt: `${productName} - Vista ${i + 1}`
  }));
  return (
    <motion.div 
      className="flex flex-col gap-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Swiper Principal */}
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full aspect-square rounded-lg overflow-hidden"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={8}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full h-20"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id} className="cursor-pointer h-20">
            <div className="w-full h-20 bg-gray-200 rounded overflow-hidden hover:ring-2 hover:ring-verde transition-all">
              <img
                src={image.thumbnail}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};



export default ImageGallery;
