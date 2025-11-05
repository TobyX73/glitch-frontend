import { useCart } from "../../context/CartContext";
import type { CartItem } from "../../context/CartContext";

function VistaCarrito() {
  const { state, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id, item.size);
    } else {
      updateQuantity(item.id, item.size, newQuantity);
    }
  };

  const formatPrice = (price: string) => {
    return price;
  };

  const formatTotalPrice = (totalPrice: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(totalPrice);
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Tu carrito está vacío</div>
          <a 
            href="/productos" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver productos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Carrito de Compras</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600">Talle: {item.size}</p>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    🗑️
                  </button>
                </div>

                {item.quantity >= item.stock && (
                  <div className="mt-2 text-sm text-amber-600">
                    Stock máximo alcanzado ({item.stock} disponibles)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Productos ({state.totalItems})</span>
                <span>{formatTotalPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatTotalPrice(getTotalPrice())}</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Proceder al pago
            </button>

            <button className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { VistaCarrito }