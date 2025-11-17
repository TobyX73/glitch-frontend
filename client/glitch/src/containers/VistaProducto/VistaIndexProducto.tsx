import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import OrderBy from "./OrderBy";
import Filters from "./Filters";
import { productsAPI, categoriesAPI } from "../../services/api";
import type { Product, Category } from "../../types/product.types";

type SortOption = "newest-oldest" | "oldest-newest" | "price-low-high" | "price-high-low";

const VistaIndexProducto = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [displayedCount, setDisplayedCount] = useState(12);
  const [sortBy, setSortBy] = useState<SortOption>("newest-oldest");
  
  // Filtros
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCortes, setSelectedCortes] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        
        // Filtrar solo productos activos
        const activeProducts = productsData.filter(p => p.isActive);
        setProducts(activeProducts);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const itemsPerBatch = 12;

  // Aplicar filtros
  let filteredProducts = products.filter(product => {
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();
    const categoryLower = product.category.name.toLowerCase();
    
    const matchColor = selectedColors.length === 0 || 
      selectedColors.some(color => 
        nameLower.includes(color.toLowerCase()) || 
        descLower.includes(color.toLowerCase())
      );
      
    const matchCorte = selectedCortes.length === 0 || 
      selectedCortes.some(corte => 
        nameLower.includes(corte.toLowerCase()) || 
        descLower.includes(corte.toLowerCase())
      );
      
    const matchCategoria = selectedCategorias.length === 0 || 
      selectedCategorias.some(categoria => 
        categoryLower.includes(categoria.toLowerCase()) || 
        product.categoryId === parseInt(categoria) ||
        categoria.toLowerCase() === categoryLower
      );
      
    return matchColor && matchCorte && matchCategoria;
  });

  // Aplicar ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.basePrice - b.basePrice;
      case "price-high-low":
        return b.basePrice - a.basePrice;
      case "newest-oldest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest-newest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  // useEffect para sincronizar paginación con filtros
  useEffect(() => {
    // Reset a 12 cuando cambian los filtros o el ordenamiento
    setDisplayedCount(12);
  }, [selectedColors, selectedCortes, selectedCategorias, sortBy]);

  // Productos visibles con paginación
  const visibleProducts = sortedProducts.slice(0, Math.min(displayedCount, sortedProducts.length));
  const hasMoreProducts = displayedCount < sortedProducts.length;

  const loadMoreProducts = () => {
    setDisplayedCount(prev => Math.min(prev + itemsPerBatch, sortedProducts.length));
  };

  // Manejadores de filtros
  const toggleFilter = (filterType: "color" | "corte" | "categoria", value: string) => {
    if (filterType === "color") {
      setSelectedColors(prev => 
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    } else if (filterType === "corte") {
      setSelectedCortes(prev => 
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    } else if (filterType === "categoria") {
      setSelectedCategorias(prev => 
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    }
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gris p-8 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde mx-auto mb-4"></div>
          <p className="text-verde text-xl font-semibold">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gris p-8 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-verde text-xl font-semibold">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gris p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Sidebar de Filtros */}
          <div className="col-span-3 space-y-6">
            <OrderBy sortBy={sortBy} onSortChange={handleSortChange} />
            <Filters
              selectedColors={selectedColors}
              selectedCortes={selectedCortes}
              selectedCategorias={selectedCategorias}
              onToggleFilter={toggleFilter}
              categories={categories}
            />
          </div>

          {/* Grid de Productos */}
          <div className="col-span-9">
            <motion.div
              key={`${selectedColors.join()}-${selectedCortes.join()}-${selectedCategorias.join()}-${sortBy}`}
              className="grid grid-cols-3 gap-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {visibleProducts.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      transition: { duration: 0.4 }
                    }
                  }}
                >
                  <ProductCard 
                    id={item.id}
                    title={item.name}
                    price={`$${item.basePrice.toLocaleString('es-AR')}`}
                    image={item.mainImage || item.images[0]?.url || ''}
                    stock={item.totalStock}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Botón Ver Más */}
            {hasMoreProducts && (
              <div className="flex justify-center">
                <button
                  onClick={loadMoreProducts}
                  className="bg-gris text-verde border-2 border-verde px-8 py-3 rounded-lg hover:bg-verde hover:text-gris transition-all duration-300 font-semibold"
                >
                  Ver más
                </button>
              </div>
            )}

            {!hasMoreProducts && visibleProducts.length > 0 && (
              <div className="flex justify-center">
                <p className="text-verde text-lg font-semibold">
                  No hay más productos
                </p>
              </div>
            )}

            {visibleProducts.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <p className="text-verde text-xl font-semibold">
                  No se encontraron productos con estos filtros
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VistaIndexProducto;

