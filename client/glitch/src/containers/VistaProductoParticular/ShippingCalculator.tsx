import { useState } from 'react';
import { deliveryAPI } from '../../services/api';

interface ShippingCalculatorProps {
  productId: number;
}

const ShippingCalculator = ({ productId }: ShippingCalculatorProps) => {
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<{
    cost: number;
    estimatedDays: string;
    carrier: string;
  } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!postalCode || postalCode.length < 4) {
      setError('Ingresá un código postal válido');
      return;
    }

    try {
      setCalculating(true);
      setError(null);
      
      const result = await deliveryAPI.calculateShipping({
        zipCode: postalCode,
        items: [{ productId, quantity: 1 }]
      });

      setShippingCost(result);
    } catch (err: any) {
      console.error('Error al calcular envío:', err);
      setError(err.response?.data?.message || 'No se pudo calcular el envío');
    } finally {
      setCalculating(false);
    }
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
          disabled={calculating}
          className="px-6 py-3 bg-gris text-white border-gray-600 border-2 font-semibold mr- hover:bg-verde hover:text-gris transition-all duration-300 italic cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <h1>{calculating ? 'Calculando...' : 'Calcular'}</h1>
        </button>
      </div>
      
      {/* Resultado */}
      {shippingCost && (
        <div className="mt-3 p-4 bg-azul-oscuro border border-verde rounded">
          <p className="text-verde font-semibold text-lg">${shippingCost.cost.toLocaleString('es-AR')}</p>
          <p className="text-white text-sm">{shippingCost.carrier}</p>
          <p className="text-gray-400 text-xs">{shippingCost.estimatedDays}</p>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default ShippingCalculator;
