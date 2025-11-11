import { motion } from 'framer-motion';

const UserReview = () => {
  const instagramUrl = "https://www.instagram.com/stories/highlights/18058603493564156/?hl=es";

  return (
    <section className="w-full bg-gris h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
          

          <div className="text-white space-y-6">

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


            <h2 className="text-5xl font-bold italic">
              Más de 50 clientes contentos
            </h2>


            <p className="text-2xl text-gray-300 italic">
              Agradecidos siempre con ustedes 🙌
            </p>

            <a 
              href={instagramUrl}
              target="_blank"
              className="inline-block bg-gris text-verde hover:bg-verde hover:text-gris transition-colors duration-300 border-verde border-2 px-8 py-3 font-bold text-lg"
            >
              <h1> Ver fotos reales 📸 </h1>
            </a>
          </div>

          {/* Fotos a la derecha - 2 fotos superpuestas */}
          <div className="flex items-center justify-center">
            {/* Foto 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-72 h-96 rounded-3xl overflow-hidden shadow-2xl z-20"
            >
              <img 
                src="https://picsum.photos/450/600?random=10"
                alt="Cliente Glitch 1"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Foto 2 - Superpuesta con margen negativo */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="w-72 h-96 rounded-3xl overflow-hidden shadow-2xl -ml-16 mt-12 z-10"
            >
              <img 
                src="https://picsum.photos/450/600?random=11"
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
