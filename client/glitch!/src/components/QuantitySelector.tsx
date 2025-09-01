interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;
  error?: string;
}

export function QuantitySelector({ quantity, maxQuantity, onQuantityChange, error }: QuantitySelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Cantidad</label>
      <div className="flex items-center gap-0 w-32">
        <button
          type="button"
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-10 h-10 border border-gray-300 rounded-l bg-white disabled:opacity-50 hover:bg-gray-50 flex items-center justify-center"
        >
          −
        </button>
        
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          className="w-12 h-10 text-center border-t border-b border-gray-300 bg-white"
          readOnly
        />
        
        <button
          type="button"
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={quantity >= maxQuantity}
          className="w-10 h-10 border border-gray-300 rounded-r bg-white disabled:opacity-50 hover:bg-gray-50 flex items-center justify-center"
        >
          +
        </button>
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default QuantitySelector;
