import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deliveryAPI } from '../../services/api';

interface ShippingCalculatorProps {
  cartItems: { id: number; quantity: number }[];
}

const ShippingCalculator = ({ cartItems }: ShippingCalculatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      setCalculating(true);
      setError(null);
      
      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const result = await deliveryAPI.calculateShipping({
        zipCode: postalCode,
        items
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
    <div className="border-b border-gray-700 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white hover:text-verde transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium">Calcular costo de envío</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Código postal"
                className="flex-1 px-3 py-2 bg-gris border border-gray-600 text-white text-sm focus:outline-none focus:border-verde placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleCalculate}
                disabled={calculating}
                className="px-4 py-2 bg-gris border border-white text-white text-sm hover:bg-verde hover:text-gris transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {calculating ? 'Calculando...' : 'Calcular'}
              </button>
            </div>
            
            {/* Resultado */}
            {shippingCost && (
              <div className="mt-3 p-3 bg-azul-oscuro border border-verde rounded">
                <p className="text-verde font-semibold">${shippingCost.cost.toLocaleString('es-AR')}</p>
                <p className="text-white text-xs">{shippingCost.carrier}</p>
                <p className="text-gray-400 text-xs">{shippingCost.estimatedDays}</p>
              </div>
            )}
            
            {/* Error */}
            {error && (
              <p className="mt-2 text-red-500 text-xs">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShippingCalculator;
