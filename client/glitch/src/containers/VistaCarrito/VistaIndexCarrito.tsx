import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import ShippingCalculator from './ShippingCalculator';
import DiscountCoupon from './DiscountCoupon';

interface VistaIndexCarritoProps {
  isOpen: boolean;
  onClose: () => void;
}

const VistaIndexCarrito = ({ isOpen, onClose }: VistaIndexCarritoProps) => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem /*, getTotalWithShipping */ } = useCart();
  const [discount, setDiscount] = useState<number>(0);

  const handleCouponApply = (coupon: string) => {
    console.log('Aplicando cupón:', coupon);
    setDiscount(5000);
  };

  const handleCheckout = () => {
    onClose(); // Cerrar el sidebar
    navigate('/checkout'); // Redirigir al checkout
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gris z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-white text-xl font-bold">Mi carrito</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-verde transition-colors text-2xl cursor-pointer"
              >
                
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {state.items.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-center">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="py-4">
                    {state.items.map((item) => (
                      <CartItem
                        key={`${item.id}-${item.size}`}
                        item={item}
                        onUpdateQuantity={(quantity) => updateQuantity(item.id, item.size, quantity)}
                        onRemove={() => removeItem(item.id, item.size)}
                      />
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <CartSummary subtotal={state.totalPrice} />
                  </div>

                  <ShippingCalculator 
                    cartItems={state.items.map(item => ({ id: item.id, quantity: item.quantity }))}
                  />

                  <DiscountCoupon onApply={handleCouponApply} />

                  {(state.shippingInfo || discount > 0) && (
                    <div className="py-4">
                      <CartSummary
                        subtotal={state.totalPrice}
                        shippingCost={state.shippingInfo?.cost || 0}
                        discount={discount}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="p-6 border-t border-gray-700">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 text-xl bg-gris border-2 border-verde text-verde font-semibold hover:bg-verde hover:text-gris transition-all cursor-pointer"
                >
                  <h1>Finalizar compra</h1>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VistaIndexCarrito;
