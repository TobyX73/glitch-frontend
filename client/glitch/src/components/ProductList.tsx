import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard"
import { productsAPI } from "../services/api";
import type { Product } from "../types/product.types";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        // Mostrar solo los primeros 4 productos activos
        const activeProducts = response.filter(p => p.isActive).slice(0, 4);
        setProducts(activeProducts);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde mx-auto mb-4"></div>
          <p className="text-verde text-xl font-semibold">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6 flex justify-center">
        <div className="w-full text-center">
          <p className="text-xl font-semibold text-verde">{error}</p>
        </div>
      </section>
    );
  }

  const visibleProducts = products;

    return (
        <section className="p-6 flex justify-center">
            <div className="w-full">
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                 {visibleProducts.map((item) => (  
                    <motion.div
                        key={item.id}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { 
                                opacity: 1, 
                                y: 0,
                                transition: { duration: 0.5 }
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
            </div>
        </section>
    )
}

export default ProductList;