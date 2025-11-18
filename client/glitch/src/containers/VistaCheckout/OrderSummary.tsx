import { useCart } from '../../context/CartContext';

const OrderSummary = () => {
  const { state } = useCart();

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const shippingCost = state.shippingInfo?.cost;
  const discount = 0; // Puedes aplicar cupones aquí
  const total = state.totalPrice + (shippingCost || 0) - discount;

  return (
    <div className="bg-black border-2 border-verde rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-white mb-6">Tu carrito</h2>

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
                Talle {item.size}
              </p>
              <p className="text-gray-400 text-xs">
                Cantidad: {item.quantity}
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
          <span className="text-sm">Envío</span>
          <span className="font-semibold">
            {typeof shippingCost === 'number' && state.shippingInfo
              ? formatPrice(shippingCost)
              : <span className="text-gray-500">Elegí una opción de envío</span>}
          </span>
        </div>

        {state.shippingInfo && (
          <p className="text-xs text-gray-400">
            {state.shippingInfo.type === 'domicilio' ? '📦 A domicilio' : '🏪 A sucursal'}
            {state.shippingInfo.estimatedDays && ` • ${state.shippingInfo.estimatedDays} días`}
          </p>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-verde">
            <span className="text-sm">Descuento</span>
            <span className="font-semibold">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-white pt-3 border-t border-gray-700">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold text-verde">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
