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
      <label className="block text-white font-semibold mb-3">Cantidad</label>
      <div className="flex items-center gap-0 w-32 mt-5">
        <button
          type="button"
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-10 h-11 border-2 border-white bg-gris text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-verde hover:text-gris transition-all flex items-center justify-center font-bold cursor-pointer"
        >
          −
        </button>
        
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          className="w-12 h-11 text-center border-t-2 border-b-2 border-white bg-gris text-white font-semibold flex items-center justify-center"
          readOnly
        />
        
        <button
          type="button"
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={quantity >= maxQuantity}
          className="w-10 h-11 border-2 border-white bg-gris text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-verde hover:text-gris transition-all flex items-center justify-center font-bold cursor-pointer"
        >
          +
        </button>
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default QuantitySelector;
