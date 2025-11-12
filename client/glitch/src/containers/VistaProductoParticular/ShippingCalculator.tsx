import { useState } from 'react';

const ShippingCalculator = () => {
  const [postalCode, setPostalCode] = useState('');

  const handleCalculate = () => {
    // Función para conectar con el backend después
    console.log('Calculando envío para código postal:', postalCode);
  };

  return (
    <div className="mt-6">
      <label className="block text-white font-semibold mb-3">
        Calcular costo de envío
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Código postal"
          className="flex-1 px-4 py-3  border border-gray-600 text-white placeholder-gray-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCalculate}
          className="px-6 py-3 bg-gris text-white border-gray-600 border-2 font-semibold mr- hover:bg-verde hover:text-gris transition-all duration-300 italic cursor-pointer"
        >
          <h1>Calcular</h1>
        </button>
      </div>
    </div>
  );
};

export default ShippingCalculator;
