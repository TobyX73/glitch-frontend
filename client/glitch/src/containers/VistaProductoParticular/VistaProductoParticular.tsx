import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { productsAPI } from "../../services/api";
import type { Product } from "../../types/product.types";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "../../components/QuantitySelector";
import AddToCartButton from "../../components/AddToCartButton";
import ShippingCalculator from "./ShippingCalculator";

const VistaProductoParticular = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      if (!id) {
        setError('ID de producto inválido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productsAPI.getById(parseInt(id));
        
        if (!productData.isActive) {
          setError('Este producto no está disponible');
          setProduct(null);
        } else {
          setProduct(productData);
          // Seleccionar primera talla disponible con stock
          const firstAvailableSize = productData.variants.find(v => v.stock > 0);
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize.size);
          }
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    
    // Obtener el stock de la talla seleccionada
    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    const maxStock = selectedVariant?.stock || product.totalStock;
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSubmitting(true);
    
    // Agregar producto al carrito
    addItem({
      id: product.id,
      title: product.name,
      price: `$${product.basePrice.toLocaleString('es-AR')}`,
      image: product.mainImage || product.images[0]?.url || '',
      size: selectedSize,
      quantity: quantity,
      stock: product.totalStock
    });

    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Producto agregado al carrito exitosamente');
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gris flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde mx-auto mb-4"></div>
          <p className="text-verde text-xl font-semibold">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gris flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-verde mb-4">{error || 'Producto no encontrado'}</h1>
          <p className="text-gray-400">El producto que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  // Calcular stock de la talla seleccionada
  const selectedVariant = product.variants.find(v => v.size === selectedSize);
  const maxStock = selectedVariant?.stock || product.totalStock;
  const isValid = selectedSize !== '' && quantity > 0 && quantity <= maxStock;

  return (
    <div className="min-h-screen bg-gris pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Columna Izquierda - Galería */}
            <div>
              <ImageGallery 
                images={product.images}
                productName={product.name} 
              />
            </div>

            {/* Columna Derecha - Información */}
            <div className="flex flex-col">
              <ProductInfo
                title={product.name}
                price={`$${product.basePrice.toLocaleString('es-AR')}`}
                description={product.description}
              />

              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                variants={product.variants}
              />

              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  maxQuantity={maxStock}
                  stock={maxStock}
                  onQuantityChange={handleQuantityChange}
                />
  
                <AddToCartButton
                  isValid={isValid}
                  isSubmitting={isSubmitting}
                  stock={maxStock}
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