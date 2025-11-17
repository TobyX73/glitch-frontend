import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { productsAPI, categoriesAPI } from "../../../services/api";
import type { Category } from "../../../types/product.types";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  sizes: string[];
  images: File[];
}

const CrearProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    sizes: [],
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // Cargar categorías desde el backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        // Manejar tanto arrays directos como objetos con .data
        const categories = Array.isArray(response) ? response : (response as any).data || [];
        setCategories(categories);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setErrors({ categories: 'Error al cargar las categorías' });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageFiles],
    }));

    // Create previews
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock debe ser mayor o igual a 0";
    }

    if (!formData.category) {
      newErrors.category = "Seleccioná una categoría";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "Seleccioná al menos un talle";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Agregá al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("sizes", JSON.stringify(formData.sizes));

      // Agregar imágenes
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Enviar al backend usando endpoint específico para FormData
      await productsAPI.createWithImages(formDataToSend);

      // Redirigir al listado
      navigate("/admin/productos");
    } catch (error: any) {
      console.error("Error al crear producto:", error);
      setErrors({ 
        submit: error.response?.data?.message || "Error al crear el producto. Intentá nuevamente." 
      });
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-4xl font-bold text-white mb-2">Crear Producto</h1>
        <p className="text-gray-400">Agregá un nuevo producto al catálogo</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="max-w-4xl"
      >
        {/* Error general */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-500">
            {errors.submit}
          </div>
        )}

        {/* Información básica */}
        <div className="bg-gris border-2 border-verde rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-verde mb-6">
            Información Básica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-azul border-2 ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors`}
                placeholder="Ej: Remera Cyberpunk 2077"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-azul border-2 ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors resize-none`}
                placeholder="Describí el producto..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 bg-azul border-2 ${
                  errors.price ? "border-red-500" : "border-gray-600"
                } rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-3 bg-azul border-2 ${
                  errors.stock ? "border-red-500" : "border-gray-600"
                } rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoadingCategories}
                className={`w-full px-4 py-3 bg-azul border-2 ${
                  errors.category ? "border-red-500" : "border-gray-600"
                } rounded text-white focus:outline-none focus:border-verde transition-colors disabled:opacity-50`}
              >
                <option value="">
                  {isLoadingCategories ? 'Cargando...' : 'Seleccioná una categoría'}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Tallas */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Tallas Disponibles *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-6 py-3 rounded font-semibold transition-all ${
                      formData.sizes.includes(size)
                        ? "bg-verde text-gris"
                        : "bg-azul border-2 border-gray-600 text-gray-300 hover:border-verde"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && (
                <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-gris border-2 border-verde rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-verde mb-6">
            Imágenes del Producto
          </h2>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? "border-verde bg-verde bg-opacity-10"
                : errors.images
                ? "border-red-500"
                : "border-gray-600"
            }`}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-white font-semibold mb-2">
              Arrastrá las imágenes aquí o
            </p>
            <label className="inline-block px-6 py-3 bg-verde text-gris font-bold rounded cursor-pointer hover:bg-opacity-90 transition-all">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              Seleccionar Archivos
            </label>
            <p className="text-gray-500 text-sm mt-2">
              PNG, JPG, GIF hasta 10MB
            </p>
          </div>

          {errors.images && (
            <p className="text-red-500 text-sm mt-2">{errors.images}</p>
          )}

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {imagePreviews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded border-2 border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-verde text-gris text-xs font-bold rounded">
                      Principal
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-verde text-gris font-bold rounded text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Guardar Producto"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate("/admin/productos")}
            className="px-8 py-4 bg-gris border-2 border-gray-600 text-gray-300 font-bold rounded text-lg hover:border-verde hover:text-verde transition-all"
          >
            Cancelar
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CrearProducto;
