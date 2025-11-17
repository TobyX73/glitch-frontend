import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { productsAPI, categoriesAPI, type Category } from "../../../services/api";
import type { Product } from "../../../types/product.types";

const VistaProductosAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const itemsPerPage = 10;

  // Cargar productos desde el backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getAll();
        // Manejar tanto arrays directos como objetos con .data
        const products = Array.isArray(response) ? response : (response as any).data || [];
        setProducts(products);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await productsAPI.delete(id.toString());
        // Actualizar lista eliminando el producto
        setProducts(products.filter(p => p.id !== id));
      } catch (err: any) {
        console.error('Error al eliminar producto:', err);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('El nombre de la categoría es requerido');
      return;
    }

    setIsCreatingCategory(true);
    try {
      await categoriesAPI.create({
        name: newCategoryName,
        description: newCategoryDescription || undefined,
      });
      alert('✅ Categoría creada exitosamente');
      setShowCategoryModal(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
    } catch (err: any) {
      console.error('Error al crear categoría:', err);
      alert(`❌ Error: ${err.response?.data?.message || 'No se pudo crear la categoría'}`);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-verde border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando productos...</p>
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
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Gestión de Productos
        </h1>
        <p className="text-gray-400">Administrá el catálogo de productos</p>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-500"
        >
          {error}
        </motion.div>
      )}

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

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Create Category Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-gray-600 text-gray-300 rounded font-bold hover:border-verde hover:text-verde transition-all duration-300"
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Crear Categoría
          </motion.button>

          {/* Create Product Button */}
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
        </div>
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
                      src={
                        product.mainImage ||
                        (product.images && product.images[0]
                          ? typeof product.images[0] === 'string'
                            ? product.images[0]
                            : (product.images[0] as any).url
                          : "/placeholder.jpg")
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {product.name || 'Sin nombre'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {typeof product.category === 'object' ? product.category?.name : product.category || 'Sin categoría'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-verde font-semibold">
                    ${(product.basePrice || product.price || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-black ${
                        (product.totalStock || product.stock || 0) > 10
                          ? "bg-verde"
                          : (product.totalStock || product.stock || 0) > 0
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {product.totalStock || product.stock || 0} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.variants && product.variants.length > 0 ? (
                        product.variants.map((variant: { size: string; stock: number }) => (
                          <span
                            key={variant.size}
                            className="px-2 py-1 bg-gris border border-verde text-verde text-xs rounded font-semibold"
                          >
                            {variant.size}
                          </span>
                        ))
                      ) : product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map((size: string) => (
                          <span
                            key={size}
                            className="px-2 py-1 bg-gris border border-verde text-verde text-xs rounded font-semibold"
                          >
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">Sin talles</span>
                      )}
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
                        className="p-2 bg-verde text-gris rounded hover:bg-opacity-90 transition-colors"
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
                        className="p-2 bg-verde text-gris rounded hover:bg-opacity-90 transition-colors"
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

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gris rounded-lg p-8 max-w-md w-full border-2 border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Crear Nueva Categoría
            </h2>

            <div className="space-y-4 mb-6">
              {/* Nombre */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej: Remeras, Buzos, Accesorios"
                  className="w-full px-4 py-3 bg-azul border-2 border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Descripción de la categoría"
                  rows={3}
                  className="w-full px-4 py-3 bg-azul border-2 border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName('');
                  setNewCategoryDescription('');
                }}
                disabled={isCreatingCategory}
                className="flex-1 px-6 py-3 bg-azul border-2 border-gray-600 text-gray-300 rounded font-bold hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={isCreatingCategory || !newCategoryName.trim()}
                className="flex-1 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingCategory ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VistaProductosAdmin;
