import type { ProductVariant } from "../../types/product.types";

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
  variants: ProductVariant[];
}

const SizeSelector = ({ selectedSize, onSizeChange, variants }: SizeSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-3">
        Talle
      </label>
      <div className="flex gap-3">
        {variants.map((variant) => {
          const isOutOfStock = variant.stock === 0;
          const isSelected = selectedSize === variant.size;
          const isExtraLarge = variant.size.length > 2; // XXL, XXXL, etc.
          
          return (
            <button
              key={variant.size}
              type="button"
              onClick={() => !isOutOfStock && onSizeChange(variant.size)}
              disabled={isOutOfStock}
              className={`${isExtraLarge ? 'min-w-[50px] px-3' : 'w-10'} h-10 border-2 font-semibold transition-all duration-200 relative ${
                isOutOfStock
                  ? 'border-gray-600 text-gray-600 cursor-not-allowed opacity-50'
                  : isSelected
                  ? 'border-verde bg-verde text-gris cursor-pointer'
                  : 'border-white text-white hover:border-verde hover:text-verde cursor-pointer'
              }`}
              title={isOutOfStock ? 'Sin stock' : `${variant.stock} disponibles`}
            >
              {variant.size}
              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="absolute w-full h-0.5 bg-gray-600 rotate-45"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {selectedSize && (
        <p className="text-gray-400 text-sm mt-2">
          {variants.find(v => v.size === selectedSize)?.stock || 0} unidades disponibles
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
