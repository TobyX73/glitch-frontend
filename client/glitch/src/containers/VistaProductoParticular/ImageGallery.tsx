import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { ProductImage } from '../../types/product.types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  // Ordenar imágenes por order, imagen principal primero
  const sortedImages = [...images].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return a.order - b.order;
  });

  // Si no hay imágenes, mostrar placeholder
  if (!sortedImages || sortedImages.length === 0) {
    return (
      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          <p className="text-gray-400">Sin imagen disponible</p>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div 
      className="flex flex-col gap-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Swiper Principal */}
      <Swiper
        onSwiper={setMainSwiper}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full aspect-square rounded-lg overflow-hidden"
      >
        {sortedImages.map((image) => (
          <SwiperSlide key={image.id || image.url}>
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <img
                src={image.url}
                alt={`${productName} - ${image.isMain ? 'Principal' : `Vista ${image.order}`}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2">
          {sortedImages.slice(0, 4).map((image, index) => (
            <div 
              key={image.id || image.url}
              onClick={() => mainSwiper?.slideTo(index)}
              className="cursor-pointer w-20 h-20 bg-gray-200 overflow-hidden hover:ring-2 hover:ring-verde transition-all"
            >
              <img
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ImageGallery;
