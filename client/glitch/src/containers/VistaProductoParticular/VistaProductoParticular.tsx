import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import RemerasPruebas from '../../../public/Remeras/RemerasPrueba.json';
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "../../components/QuantitySelector";
import AddToCartButton from "../../components/AddToCartButton";
import ShippingCalculator from "./ShippingCalculator";

const VistaProductoParticular = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const product = RemerasPruebas.find(item => item.id === parseInt(id || '0'));

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gris flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-verde mb-4">Producto no encontrado</h1>
          <p className="text-gray-400">El producto que buscas no existe.</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Agregar producto al carrito
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity,
      stock: product.stock
    });

    setTimeout(() => {
      setIsSubmitting(false);
      // Mostrar notificación o feedback visual (opcional)
      console.log('Producto agregado al carrito exitosamente');
    }, 500);
  };

  const isValid = selectedSize !== '' && quantity > 0 && quantity <= product.stock;

  return (
    <div className="min-h-screen bg-gris pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Columna Izquierda - Galería */}
            <div>
              <ImageGallery 
                productId={product.id} 
                productName={product.title} 
              />
            </div>

            {/* Columna Derecha - Información */}
            <div className="flex flex-col">
              <ProductInfo
                title={product.title}
                price={product.price}
                description={product.descripcion}
              />

              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />

              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  maxQuantity={product.stock}
                  stock={product.stock}
                  onQuantityChange={handleQuantityChange}
                />
  
                <AddToCartButton
                  isValid={isValid}
                  isSubmitting={isSubmitting}
                  stock={product.stock}
                />
              </div>
              
              <ShippingCalculator />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VistaProductoParticular;