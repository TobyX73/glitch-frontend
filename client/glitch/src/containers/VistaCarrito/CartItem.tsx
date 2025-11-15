import type { CartItem as CartItemType } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const formatPrice = (price: string) => {
    return price;
  };

  return (
    <div className="flex gap-4 py-4">
      {/* Imagen del producto */}
      <div className="w-20 h-20 bg-gray-700 rounded flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
          <p className="text-gray-400 text-xs">Talle: {item.size}</p>
        </div>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-6 h-6 border border-white bg-gris text-white disabled:opacity-30 hover:bg-verde hover:text-gris transition-all flex items-center justify-center text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            −
          </button>

          <span className="w-8 text-center text-white text-sm font-semibold">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="w-6 h-6 border border-white bg-gris text-white disabled:opacity-30 hover:bg-verde hover:text-gris transition-all flex items-center justify-center text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Precio */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors text-xs cursor-pointer"
          title="Eliminar producto"
        >
          ✕
        </button>
        <p className="text-white font-semibold text-sm">{formatPrice(item.price)}</p>
      </div>
    </div>
  );
};

export default CartItem;
