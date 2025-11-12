interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

const sizes = ['S', 'M', 'L'];

const SizeSelector = ({ selectedSize, onSizeChange }: SizeSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-3">
        Talle
      </label>
      <div className="flex gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeChange(size)}
            className={`w-10 h-10 border-2 rounded font-semibold transition-all duration-200 cursor-pointer ${
              selectedSize === size
                ? 'border-verde bg-verde text-gris'
                : 'border-white text-white hover:border-verde hover:text-verde'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
