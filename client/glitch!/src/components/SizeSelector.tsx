interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  error?: string;
}

export function SizeSelector({ sizes, selectedSize, onSizeChange, error }: SizeSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Talle</label>
      <select
        value={selectedSize}
        onChange={(e) => onSizeChange(e.target.value)}
        className={`w-full p-3 border rounded-lg bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Seleccionar talle</option>
        {sizes.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default SizeSelector;
