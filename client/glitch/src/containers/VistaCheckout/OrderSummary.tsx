import { useCart } from '../../context/CartContext';

const OrderSummary = () => {
  const { state } = useCart();

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const shippingCost = 0; // Puedes calcular esto según la lógica de envío
  const discount = 0; // Puedes aplicar cupones aquí
  const total = state.totalPrice + shippingCost - discount;

  return (
    <div className="bg-azul-oscuro rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-white mb-6">Your cart</h2>

      {/* Lista de productos */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {state.items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex gap-4">
            {/* Imagen */}
            <div className="w-20 h-20 bg-gray-700 rounded flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
              <p className="text-gray-400 text-xs mb-2">
                Size {item.size}
              </p>
              <p className="text-gray-400 text-xs">
                Quantity: {item.quantity}
              </p>
            </div>

            {/* Precio */}
            <div className="text-white text-sm font-semibold">
              {item.price}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de precios */}
      <div className="border-t border-gray-700 pt-4 space-y-3">
        <div className="flex justify-between text-white">
          <span className="text-sm">Subtotal</span>
          <span className="font-semibold">{formatPrice(state.totalPrice)}</span>
        </div>

        <div className="flex justify-between text-white">
          <span className="text-sm">Shipping</span>
          <span className="font-semibold">
            {shippingCost === 0 ? 'Calculated at the next step' : formatPrice(shippingCost)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-verde">
            <span className="text-sm">Discount</span>
            <span className="font-semibold">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-white pt-3 border-t border-gray-700">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
