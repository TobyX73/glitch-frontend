import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deliveryAPI } from '../../services/api';

interface ShippingCalculatorProps {
  cartItems: { id: number; quantity: number }[];
  onShippingSelect?: (cost: number) => void;
}

interface ShippingOption {
  type: 'domicilio' | 'sucursal';
  price: number;
  days: number;
}

const ShippingCalculator = ({ cartItems, onShippingSelect }: ShippingCalculatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<{
    domicilio?: ShippingOption;
    sucursal?: ShippingOption;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<'domicilio' | 'sucursal' | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!postalCode || postalCode.length !== 4 || !/^\d{4}$/.test(postalCode)) {
      setError('Ingresá un código postal válido (4 dígitos)');
      return;
    }

    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      setCalculating(true);
      setError(null);
      setShippingOptions(null);
      setSelectedOption(null);
      
      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const result = await deliveryAPI.calculateShippingWithOptions({
        postalCode: postalCode,
        items
      });

      setShippingOptions(result);
    } catch (err: any) {
      console.error('Error al calcular envío:', err);
      setError(err.response?.data?.message || 'No se pudo calcular el envío');
    } finally {
      setCalculating(false);
    }
  };

  const handleSelectOption = (option: 'domicilio' | 'sucursal') => {
    setSelectedOption(option);
    const selected = shippingOptions?.[option];
    if (selected && onShippingSelect) {
      onShippingSelect(selected.price);
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
                type="tel"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Código postal (4 dígitos)"
                maxLength={4}
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
            
            {/* Resultados */}
            {shippingOptions && (
              <div className="mt-3 space-y-2">
                {/* Opción Domicilio */}
                {shippingOptions.domicilio && (
                  <div 
                    className={`p-3 border cursor-pointer transition-all ${
                      selectedOption === 'domicilio' 
                        ? 'bg-azul-oscuro border-verde' 
                        : 'bg-gris border-gray-600 hover:border-verde'
                    }`}
                    onClick={() => handleSelectOption('domicilio')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-semibold">Envío a domicilio</p>
                        <p className="text-gray-400 text-xs">{shippingOptions.domicilio.days} días hábiles</p>
                      </div>
                      <p className="text-verde font-bold">${shippingOptions.domicilio.price.toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                )}

                {/* Opción Sucursal */}
                {shippingOptions.sucursal && (
                  <div 
                    className={`p-3 border cursor-pointer transition-all ${
                      selectedOption === 'sucursal' 
                        ? 'bg-azul-oscuro border-verde' 
                        : 'bg-gris border-gray-600 hover:border-verde'
                    }`}
                    onClick={() => handleSelectOption('sucursal')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-semibold">Retiro en sucursal</p>
                        <p className="text-gray-400 text-xs">{shippingOptions.sucursal.days} días hábiles</p>
                      </div>
                      <p className="text-verde font-bold">${shippingOptions.sucursal.price.toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                )}
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
