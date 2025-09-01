import { useState } from "react";
import { useParams } from "react-router-dom";
import RemerasPruebas from '../../../public/Remeras/RemerasPrueba.json';
import SizeSelector from "../../components/SizeSelector";
import QuantitySelector from "../../components/QuantitySelector";
import AddToCartButton from "../../components/AddToCartButton";

export function VistaFormProducto() {
  const { id } = useParams();
  const product = RemerasPruebas.find(item => item.id === parseInt(id || '0'));

  const [formData, setFormData] = useState({
    size: '',
    quantity: 1
  });

  const [errors, setErrors] = useState<{size?: string; quantity?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const maxQuantity = Math.min(product.stock, 10);

  const handleSizeChange = (size: string) => {
    setFormData(prev => ({ ...prev, size }));
    if (errors.size) {
      setErrors(prev => ({ ...prev, size: undefined }));
    }
  };

  const handleQuantityChange = (quantity: number) => {
    const validQuantity = Math.max(1, Math.min(quantity, maxQuantity));
    setFormData(prev => ({ ...prev, quantity: validQuantity }));
  };

  const validateForm = () => {
    const newErrors: { size?: string; quantity?: string } = {};
    if (!formData.size) newErrors.size = 'Selecciona un talle';
    if (formData.quantity > product.stock) newErrors.quantity = 'Stock insuficiente';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {

      console.log('Agregando al carrito:', {
        productId: product.id,
        title: product.title,
        price: product.price,
        size: formData.size,
        quantity: formData.quantity,
        total: calculateTotal()
      });
      
      alert('¡Producto agregado al carrito!');
      
    } catch (error) {
      alert('Error al agregar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const price = parseFloat(product.price.replace(/[$.,]/g, ''));
    return price * formData.quantity;
  };
  
  const isFormValid = Boolean(formData.size && formData.quantity > 0 && formData.quantity <= product.stock);

  return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <SizeSelector
          sizes={availableSizes}
          selectedSize={formData.size}
          onSizeChange={handleSizeChange}
          error={errors.size}
        />

        <QuantitySelector
          quantity={formData.quantity}
          maxQuantity={maxQuantity}
          stock={product.stock}
          onQuantityChange={handleQuantityChange}
          error={errors.quantity}
        />

        <AddToCartButton
          isValid={isFormValid}
          isSubmitting={isSubmitting}
          stock={product.stock}
        />
      </form>
  );
}

export default VistaFormProducto;
