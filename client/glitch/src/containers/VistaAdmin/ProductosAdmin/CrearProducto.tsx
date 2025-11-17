import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api, { productsAPI, categoriesAPI, uploadsAPI } from "../../../services/api";
import type { Category } from "../../../types/product.types";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  sizes: string[];
  images: File[];
}

interface SizeStock {
  [size: string]: string; // size -> stock amount
}

const CrearProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: [],
    images: [],
  });

  const [sizeStocks, setSizeStocks] = useState<SizeStock>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
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
    setFormData((prev) => {
      const isRemoving = prev.sizes.includes(size);
      
      if (isRemoving) {
        // Eliminar talla y su stock
        const newSizeStocks = { ...sizeStocks };
        delete newSizeStocks[size];
        setSizeStocks(newSizeStocks);
        
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s !== size),
        };
      } else {
        // Agregar talla con stock inicial 0
        setSizeStocks((prev) => ({ ...prev, [size]: "0" }));
        
        return {
          ...prev,
          sizes: [...prev.sizes, size],
        };
      }
    });
  };

  const handleSizeStockChange = (size: string, stock: string) => {
    setSizeStocks((prev) => ({ ...prev, [size]: stock }));
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

    if (!formData.category) {
      newErrors.category = "Seleccioná una categoría";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "Seleccioná al menos un talle";
    }

    // Validar que cada talla tenga stock >= 0
    for (const size of formData.sizes) {
      const stock = parseInt(sizeStocks[size] || "0");
      if (isNaN(stock) || stock < 0) {
        newErrors.sizeStock = "Todos los talles deben tener stock válido (>= 0)";
        break;
      }
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
    setUploadProgress("");

    try {
      console.log("📤 Datos del formulario:", formData);
      console.log("📏 Tallas con stock:", sizeStocks);
      console.log("🖼️ Imágenes seleccionadas:", formData.images.length);

      // ========== PASO 1: Subir imágenes a Cloudinary ==========
      setUploadProgress(`Subiendo imágenes (0/${formData.images.length})...`);
      const uploadedImages: { url: string; order: number; isMain: boolean }[] = [];

      for (let i = 0; i < formData.images.length; i++) {
        const imageFile = formData.images[i];
        console.log(`🖼️ Subiendo imagen ${i + 1}/${formData.images.length}:`, imageFile.name);
        setUploadProgress(`Subiendo imágenes (${i + 1}/${formData.images.length})...`);

        try {
          const uploadResult = await uploadsAPI.uploadImage(imageFile);
          console.log(`✅ Imagen ${i + 1} subida:`, uploadResult.url);

          uploadedImages.push({
            url: uploadResult.url,
            order: i,
            isMain: i === 0, // Primera imagen es la principal
          });
        } catch (uploadError: any) {
          console.error(`❌ Error al subir imagen ${i + 1}:`, uploadError);
          throw new Error(`Error al subir imagen ${i + 1}: ${uploadError.response?.data?.message || uploadError.message}`);
        }
      }

      console.log("✅ Todas las imágenes subidas:", uploadedImages);

      // ========== PASO 2: Construir variants desde sizeStocks ==========
      const variants = formData.sizes.map((size) => ({
        size,
        stock: parseInt(sizeStocks[size] || "0", 10),
      }));

      console.log("📦 Variants construidos:", variants);

      // ========== PASO 3: Construir payload final ==========
      const productData = {
        name: formData.name,
        basePrice: parseFloat(formData.price),
        categoryId: parseInt(formData.category, 10),
        description: formData.description,
        images: uploadedImages,
        variants,
        isActive: true,
      };

      console.log("📤 PAYLOAD COMPLETO:", JSON.stringify(productData, null, 2));

      // ========== PASO 4: Crear producto en el backend ==========
      setUploadProgress("Creando producto...");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás autenticado. Por favor, iniciá sesión.");
      }

      const response = await api.post("/products", productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Producto creado exitosamente:", response.data);

      alert("✅ Producto creado exitosamente");
      navigate("/admin/productos");
    } catch (error: any) {
      console.error("❌ Error al crear producto:", error);
      console.log("Respuesta del servidor:", error.response?.data);
      console.log("Status:", error.response?.status);
      console.log("Error completo:", {
        message: error.message,
        response: error.response,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error desconocido al crear el producto";

      setErrors({
        submit: errorMessage,
      });

      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
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
                Precio Base *
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
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Tallas */}
            <div className="md:col-span-2">
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

            {/* Stock por Talla */}
            {formData.sizes.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-white font-semibold mb-3">
                  Stock por Talla *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.sizes.map((size) => (
                    <div key={size}>
                      <label className="block text-gray-400 text-sm mb-1">
                        Talla {size}
                      </label>
                      <input
                        type="number"
                        value={sizeStocks[size] || "0"}
                        onChange={(e) => handleSizeStockChange(size, e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 bg-azul border-2 border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                {errors.sizeStock && (
                  <p className="text-red-500 text-sm mt-2">{errors.sizeStock}</p>
                )}
              </div>
            )}
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
        <div className="flex flex-col gap-4">
          {/* Progress indicator */}
          {uploadProgress && (
            <div className="p-4 bg-verde bg-opacity-20 border border-verde rounded text-verde">
              <div className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5 text-verde"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{uploadProgress}</span>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-verde text-gris font-bold rounded text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Procesando..." : "Guardar Producto"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/admin/productos")}
              disabled={isSubmitting}
              className="px-8 py-4 bg-gris border-2 border-gray-600 text-gray-300 font-bold rounded text-lg hover:border-verde hover:text-verde transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default CrearProducto;
