import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
}

const VistaProductosAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // TODO: Reemplazar con datos del backend
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Remera Cyberpunk 2077",
      description: "Remera de algodón con diseño exclusivo",
      price: 15000,
      stock: 25,
      images: ["/productos/remera1.jpg"],
      sizes: ["S", "M", "L", "XL"],
      category: "Remeras",
    },
    {
      id: 2,
      name: "Hoodie GTA V",
      description: "Buzo con capucha estampado",
      price: 28000,
      stock: 15,
      images: ["/productos/hoodie1.jpg"],
      sizes: ["M", "L", "XL", "XXL"],
      category: "Buzos",
    },
    // Agregar más productos de prueba...
  ];

  const [products] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      // TODO: Implementar delete con backend
      console.log("Eliminar producto:", id);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Gestión de Productos
        </h1>
        <p className="text-gray-400">Administrá el catálogo de productos</p>
      </motion.div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-gris border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors"
          />
          <svg
            className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Create Button */}
        <Link to="/admin/productos/nuevo">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-verde text-verde rounded font-bold hover:bg-verde hover:text-gris transition-all duration-300"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Producto
          </motion.button>
        </Link>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gris border-2 border-verde rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-azul border-b-2 border-verde">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Tallas
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-verde uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-azul transition-colors"
                >
                  <td className="px-6 py-4">
                    <img
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {product.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-verde font-semibold">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 10
                          ? "bg-verde bg-opacity-20 text-verde"
                          : "bg-red-500 bg-opacity-20 text-red-500"
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 bg-azul border border-verde text-verde text-xs rounded"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Ver */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          navigate(`/admin/productos/${product.id}`)
                        }
                        className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors"
                        title="Ver detalles"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </motion.button>

                      {/* Editar */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          navigate(`/admin/productos/editar/${product.id}`)
                        }
                        className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors"
                        title="Editar"
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
                      </motion.button>

                      {/* Eliminar */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-red-500 hover:text-red-500 transition-colors"
                        title="Eliminar"
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
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-azul border-t-2 border-verde">
            <div className="text-gray-400 text-sm">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)} de{" "}
              {filteredProducts.length} productos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gris border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded transition-colors ${
                      currentPage === page
                        ? "bg-verde text-gris"
                        : "bg-gris border border-gray-600 text-gray-300 hover:border-verde hover:text-verde"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gris border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-400 text-lg">No se encontraron productos</p>
        </motion.div>
      )}
    </div>
  );
};

export default VistaProductosAdmin;
