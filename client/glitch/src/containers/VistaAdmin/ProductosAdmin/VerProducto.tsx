import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

const VerProducto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // TODO: Cargar datos del producto desde el backend
  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data - reemplazar con fetch real
        const mockProduct: Product = {
          id: parseInt(id || "0"),
          name: "Remera Cyberpunk 2077",
          description:
            "Remera de algodón 100% con diseño exclusivo inspirado en Cyberpunk 2077. Estampado de alta calidad que no se destiñe. Ideal para gamers y fanáticos del género cyberpunk.",
          price: 15000,
          stock: 25,
          images: [
            "/productos/remera1.jpg",
            "/productos/remera2.jpg",
            "/productos/remera3.jpg",
          ],
          sizes: ["S", "M", "L", "XL"],
          category: "Remeras",
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
        };

        setProduct(mockProduct);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        setError("Error al cargar el producto");
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      // TODO: Implementar DELETE al backend
      console.log("Eliminar producto:", id);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/admin/productos");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto. Intentá nuevamente.");
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-verde border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-6 text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || "Producto no encontrado"}
          </p>
          <button
            onClick={() => navigate("/admin/productos")}
            className="px-6 py-3 bg-verde text-gris font-bold rounded hover:bg-opacity-90 transition-all"
          >
            Volver al Listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Detalle del Producto
          </h1>
          <p className="text-gray-400">ID: #{product.id}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/productos")}
            className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-gray-600 text-gray-300 rounded font-bold hover:border-verde hover:text-verde transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/admin/productos/editar/${product.id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-red-500 text-red-500 rounded font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gris border-2 border-verde rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-verde mb-6">Imágenes</h2>

          {/* Main Image */}
          <div className="relative mb-4">
            <img
              src={product.images[currentImageIndex] || "/placeholder.jpg"}
              alt={`${product.name} - ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover rounded border-2 border-gray-600"
            />

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-gris bg-opacity-80 border-2 border-verde text-verde rounded-full hover:bg-verde hover:text-gris transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gris bg-opacity-80 border-2 border-verde text-verde rounded-full hover:bg-verde hover:text-gris transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-gris bg-opacity-80 border border-verde text-verde rounded font-bold">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 rounded overflow-hidden transition-all ${
                    currentImageIndex === index
                      ? "border-verde"
                      : "border-gray-600 hover:border-verde"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h2 className="text-2xl font-bold text-verde mb-6">
              Información Básica
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Nombre
                </label>
                <p className="text-white text-xl font-bold">{product.name}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Descripción
                </label>
                <p className="text-white">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Categoría
                  </label>
                  <p className="text-white font-semibold">{product.category}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Precio
                  </label>
                  <p className="text-verde text-2xl font-bold">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Stock
                </label>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded font-semibold ${
                      product.stock > 10
                        ? "bg-verde bg-opacity-20 text-verde"
                        : product.stock > 0
                        ? "bg-yellow-500 bg-opacity-20 text-yellow-500"
                        : "bg-red-500 bg-opacity-20 text-red-500"
                    }`}
                  >
                    {product.stock} unidades
                  </span>
                  {product.stock <= 10 && product.stock > 0 && (
                    <span className="text-yellow-500 text-sm">
                      ⚠️ Stock bajo
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="text-red-500 text-sm">
                      🚫 Sin stock
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">
                  Tallas Disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-4 py-2 bg-azul border-2 border-verde text-verde rounded font-semibold"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h2 className="text-2xl font-bold text-verde mb-6">Metadatos</h2>

            <div className="space-y-3">
              {product.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Fecha de creación</span>
                  <span className="text-white font-semibold">
                    {new Date(product.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
              )}

              {product.updatedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Última actualización</span>
                  <span className="text-white font-semibold">
                    {new Date(product.updatedAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-400">ID del producto</span>
                <span className="text-white font-semibold">#{product.id}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h2 className="text-2xl font-bold text-verde mb-6">Estado</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    product.stock > 0 ? "bg-verde" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-white font-semibold">
                  {product.stock > 0 ? "Activo" : "Sin Stock"}
                </span>
              </div>

              {product.stock > 0 && (
                <p className="text-gray-400 text-sm">
                  El producto está visible para los clientes en la tienda
                </p>
              )}

              {product.stock === 0 && (
                <p className="text-gray-400 text-sm">
                  El producto no se muestra en la tienda por falta de stock
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerProducto;
