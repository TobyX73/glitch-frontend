import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import RemerasPruebas from "../../../public/Remeras/RemerasPrueba.json";
import OrderBy from "./OrderBy";
import Filters from "./Filters";

type SortOption = "newest-oldest" | "oldest-newest" | "price-low-high" | "price-high-low";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  stock: number;
  descripcion: string;
  color?: string;
  corte?: string;
  categoria?: string;
  date?: string;
}

const VistaIndexProducto = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [displayedCount, setDisplayedCount] = useState(12);
  const [sortBy, setSortBy] = useState<SortOption>("newest-oldest");
  
  // Filtros
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCortes, setSelectedCortes] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);

  const itemsPerBatch = 12;

  // Mock data con fechas para ordenamiento
  const productsWithFilters: Product[] = RemerasPruebas.map((product, index) => ({
    ...product,
    date: new Date(2024, 0, index + 1).toISOString() // Fechas mock
  }));

  // Función para parsear precio
  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[$.]/g, "").replace(",", "."));
  };

  // Aplicar filtros por búsqueda en título
  let filteredProducts = productsWithFilters.filter(product => {
    const titleLower = product.title.toLowerCase();
    
    const matchColor = selectedColors.length === 0 || 
      selectedColors.some(color => titleLower.includes(color.toLowerCase()));
      
    const matchCorte = selectedCortes.length === 0 || 
      selectedCortes.some(corte => titleLower.includes(corte.toLowerCase()));
      
    const matchCategoria = selectedCategorias.length === 0 || 
      selectedCategorias.some(categoria => titleLower.includes(categoria.toLowerCase()));
      
    return matchColor && matchCorte && matchCategoria;
  });

  // Aplicar ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return parsePrice(a.price) - parsePrice(b.price);
      case "price-high-low":
        return parsePrice(b.price) - parsePrice(a.price);
      case "newest-oldest":
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      case "oldest-newest":
        return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
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
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    stock={item.stock}
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

