import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import RemerasPruebas from "../../../public/Remeras/RemerasPrueba.json";

const VistaIndexProducto = () => {
  
  useEffect (() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [displayedCount, setDisplayedCount] = useState(12);
  const itemsPerBatch = 12;

  // Productos a mostrar
  const visibleProducts = RemerasPruebas.slice(0, displayedCount);
  const hasMoreProducts = displayedCount < RemerasPruebas.length;

  // Función para cargar más productos
  const loadMoreProducts = () => {
    setDisplayedCount(prev => prev + itemsPerBatch);
  };

  return (
    <section className="flex flex-col items-center min-h-screen p-8">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8"> Nuestros Productos </h2>
      
        <section className="min-hv-screen p-6 flex justify-center">
            <div className="max-w-6xl w-full">
                <div className="grid grid-cols-4 gap-8 mb-8">
                 {visibleProducts.map((item) => (  
                    <ProductCard 
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        image={item.image}
                        stock={item.stock}
                    />
                 ))}  
                </div>
            </div>
        </section>

        {hasMoreProducts && (
          <div className="flex justify-center">
            <button
              onClick={loadMoreProducts}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Cargar más productos
            </button>
          </div>
        )}

        {!hasMoreProducts && (
          <div className="flex justify-center">
            <p className="text-gray-600 text-lg">
              Llegaste al final 
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VistaIndexProducto

