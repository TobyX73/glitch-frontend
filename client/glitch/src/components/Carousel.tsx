import { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides del carousel con los assets locales
  const slides = [
    {
      id: 1,
      background: '/gif banner.gif',
      type: 'gif'
    }
  ];

  // Auto-play del carousel (cambia cada 6 segundos)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-azul">
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative flex items-center justify-center"
          >
            {slide.type === 'gif' ? (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${slide.background}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ) : (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url('${slide.background}')`,
                  backgroundSize: '400px',
                  backgroundRepeat: 'repeat'
                }}
              />
            )}
            
            {/* Contenido principal */}
            <div className="relative z-10 w-full h-full px-16">
              {/* Grid Layout con posiciones específicas */}
              <div className="grid grid-cols-12 grid-rows-12 h-full">
                {/* Logo en la parte superior izquierda */}
                <div className="col-start-1 col-span-5 row-start-3 row-span-2 flex items-center">
                  <img 
                    src="/logo-entero.svg" 
                    alt="Glitch Logo" 
                    className="w-full max-w-[500px]"
                  />
                </div>
                
                {/* "your" en el centro-derecha superior */}
                <div className="col-start-6 col-span-2 row-start-4 row-span-4 flex items-center justify-end">
                  <h2 className="text-7xl font-bold text-white italic">
                    your
                  </h2>
                </div>
                
                {/* "style" en el centro-derecha inferior */}
                <div className="col-start-7 col-span-5 row-start-7 row-span-3 flex items-start justify-end">
                  <h2 className="text-7xl font-bold text-white italic">
                    style
                  </h2>
                </div>
                
                {/* "Comprá ahora" centrado en la parte inferior */}
                <div className="col-start-5 col-span-4 row-start-9 row-span-1 flex items-center justify-center">
                  <button className="text-verde text-2xl font-bold italic transition-transform duration-300 hover:scale-105">
                    <h1>Comprá ahora</h1>
                  </button>
                </div>
                
                {/* Flecha centrada debajo del texto */}
                <div className="col-start-5 col-span-4 row-start-10 row-span-1 flex items-start justify-center mt-6">
                  <img 
                    src="/flecha-abajo.svg" 
                    alt="Flecha abajo" 
                    className="w-12 h-12 animate-bounce"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-1 transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 bg-verde'
                : 'w-8 bg-white bg-opacity-30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
