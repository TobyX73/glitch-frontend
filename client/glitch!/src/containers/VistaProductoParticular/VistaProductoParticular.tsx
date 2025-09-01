import { useParams } from "react-router-dom";
import RemerasPruebas from '../../../public/Remeras/RemerasPrueba.json';
import VistaFormProducto from "./VistaFormProducto";

const VistaProductoParticular = () => {
  const { id } = useParams();
  const product = RemerasPruebas.find(item => item.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-14 max-w-6xl">
      <section className="grid grid-cols-2 gap-12">
           <div className="flex flex-col items-center">
             <div className="mb-6">
               <img 
                 src={product.image} 
                 alt={product.title}
                 className="w-96 h-96 object-cover rounded-lg shadow-lg"
               />
             </div>
             
             <div className="bg-gray-50 p-4 rounded-lg">
               <h3 className="font-semibold text-lg mb-3">Descripción</h3>
               <p className="text-gray-700 text-sm leading-relaxed">
                 {product.descripcion}
               </p>
             </div>
           </div>

           <div className="flex flex-col">
             <div className="mb-6">
               <h1 className="text-3xl font-bol mb-4">
                 {product.title}
               </h1>
               <div className="text-3xl font-bold mb-4">
                 {product.price}
               </div>
             </div>
   
             <VistaFormProducto/>
           </div>
      </section>
    </div>
  );
}

export default VistaProductoParticular