import { motion } from "framer-motion";

const VistaIndexNosotros = () => {
  return (
    <div className="min-h-screen bg-gris pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo animado */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-12"
        >
          <motion.img
            src="/logo-entero.svg"
            alt="Glitch Logo"
            className="h-32 w-auto"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-white">¿Quiénes</span>{" "}
            <span className="text-verde">somos?</span>
          </h1>
        </motion.div>

        {/* Contenido principal */}
        <div className="space-y-12">
          {/* Primera sección */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-azul-oscuro border border-gray-700 rounded-lg p-8"
          >
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Somos una pareja de gamers que estaba harta de no encontrar ropa
              urbana sobre juegos que nos gustan.
            </p>
          </motion.div>

          {/* Segunda sección */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-azul-oscuro border border-gray-700 rounded-lg p-8"
          >
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Así se nos ocurrió crear{" "}
              <span className="text-verde font-semibold">glitch!</span>
              <br />
              Con diseños propios y exclusivos.
            </p>
          </motion.div>

          {/* Tercera sección */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-azul-oscuro border border-gray-700 rounded-lg p-8"
          >
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Cada prenda que hacemos nace de nuestras ganas de mezclar el
              gaming con el streetwear, para que puedas llevar lo que te gusta
              con orgullo.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VistaIndexNosotros;
