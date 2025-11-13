interface CartSummaryProps {
  subtotal: number;
  shippingCost?: number;
  discount?: number;
}

const CartSummary = ({ subtotal, shippingCost = 0, discount = 0 }: CartSummaryProps) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const total = subtotal + shippingCost - discount;

  return (
    <div className="space-y-3 py-4">
      {/* Subtotal inicial */}
      <div className="flex items-center justify-between text-white">
        <span className="text-sm">Subtotal</span>
        <span className="font-semibold">{formatPrice(subtotal)}</span>
      </div>

      {/* Costo de envío (si existe) */}
      {shippingCost > 0 && (
        <div className="flex items-center justify-between text-white">
          <span className="text-sm">Envío</span>
          <span className="font-semibold">{formatPrice(shippingCost)}</span>
        </div>
      )}

      {/* Descuento (si existe) */}
      {discount > 0 && (
        <div className="flex items-center justify-between text-verde">
          <span className="text-sm">Descuento</span>
          <span className="font-semibold">-{formatPrice(discount)}</span>
        </div>
      )}

      {/* Total final */}
      {(shippingCost > 0 || discount > 0) && (
        <div className="flex items-center justify-between text-white pt-3 border-t border-gray-700">
          <span className="text-sm font-semibold">Total</span>
          <span className="font-bold text-lg">{formatPrice(total)}</span>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
