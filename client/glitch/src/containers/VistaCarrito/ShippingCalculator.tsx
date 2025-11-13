import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShippingCalculatorProps {
  onCalculate: (postalCode: string) => void;
}

const ShippingCalculator = ({ onCalculate }: ShippingCalculatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postalCode, setPostalCode] = useState('');

  const handleCalculate = () => {
    if (postalCode.trim()) {
      onCalculate(postalCode);
      console.log('Calculando envío para código postal:', postalCode);
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
                className="px-4 py-2 bg-gris border border-white text-white text-sm hover:bg-verde hover:text-gris transition-all cursor-pointer"
              >
                Calcular
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShippingCalculator;
