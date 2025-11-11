import { motion } from 'framer-motion';

const UserReview = () => {
  // URL de Instagram de Glitch
  const instagramUrl = "https://www.instagram.com/glitch"; // Reemplaza con tu usuario real

  return (
    <section className="w-full bg-gris py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid: Texto a la izquierda, Fotos a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texto a la izquierda */}
          <div className="text-white space-y-6">
            {/* Estrellas */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-8 h-8 text-verde"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Título */}
            <h2 className="text-5xl font-bold italic">
              Más de 15.000 clientes felices
            </h2>

            {/* Frase de marketing */}
            <p className="text-2xl text-gray-300 italic">
              Nuestro mejor marketing sos vos 😉
            </p>

            {/* Botón a Instagram */}
            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-verde text-gris px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              ver fotos reales 📸
            </a>
          </div>

          {/* Fotos a la derecha con animación */}
          <div className="flex justify-center lg:justify-start gap-4">
            {/* Foto 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-64 h-80 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://picsum.photos/400/600?random=10"
                alt="Cliente Glitch 1"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Foto 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="w-64 h-80 rounded-3xl overflow-hidden shadow-2xl mt-8"
            >
              <img 
                src="https://picsum.photos/400/600?random=11"
                alt="Cliente Glitch 2"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserReview;
