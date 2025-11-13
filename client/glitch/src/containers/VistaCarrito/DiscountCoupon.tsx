import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscountCouponProps {
  onApply: (coupon: string) => void;
}

const DiscountCoupon = ({ onApply }: DiscountCouponProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState('');

  const handleApply = () => {
    if (coupon.trim()) {
      onApply(coupon);
      console.log('Aplicando cupón:', coupon);
    }
  };

  return (
    <div className="border-b border-gray-700 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white hover:text-verde transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium">Cupón de descuento</span>
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
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Cupón"
                className="flex-1 px-3 py-2 bg-gris border border-gray-600 text-white text-sm focus:outline-none focus:border-verde placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 bg-gris border border-white text-white text-sm hover:bg-verde hover:text-gris transition-all cursor-pointer"
              >
                Validar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscountCoupon;
