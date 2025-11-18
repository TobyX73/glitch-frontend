
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { ordersAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

interface PaymentMethodsProps {
  shippingData: any; // Datos del formulario de envío
  cartItems: any[]; // Items del carrito
  goToConfirmation: () => void;
}

const PaymentMethods = ({ shippingData, cartItems, goToConfirmation }: PaymentMethodsProps) => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar Mercado Pago con tu Public Key
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey);
    }
  }, []);

  // Validar que la info de envío esté presente y correcta
  const isShippingValid = () => {
    // shippingInfo del CartContext
    const shipping = state.shippingInfo;
    if (!shipping) return false;
    if (!shipping.type || !shipping.cost || !shipping.postalCode) return false;
    return true;
  };

  // Función para crear la preferencia de pago
  const createPreference = async () => {
    setLoading(true);
    setError(null);

    // Validar datos de envío
    if (!isShippingValid()) {
      setError('Debes calcular y seleccionar una opción de envío antes de pagar.');
      setLoading(false);
      return;
    }

    try {
      const shipping = state.shippingInfo;

      if (!shipping) {
        setError('Información de envío no disponible.');
        setLoading(false);
      return;
      }      

      // Preparar shippingAddress como objeto
      const shippingAddress = {
        address: shippingData.address,
        apartment: shippingData.apartment,
        city: shippingData.city,
        zipCode: shippingData.zipCode,
        type: shipping.type,
        cost: shipping.cost,
        estimatedDays: shipping.estimatedDays,
        postalCode: shipping.postalCode,
        province: shipping.province || ''
      };

      // Preparar items del carrito
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, '')),
        size: item.size
      }));

      // guestName = firstName + lastName
      const guestName = `${shippingData.firstName} ${shippingData.lastName}`.trim();

      // Enviar todos los datos relevantes al backend
      const checkoutData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: 'mercadopago',
        guestEmail: shippingData.email,
        guestName
      };

      // Crear orden en el backend
      const response = await ordersAPI.checkoutComplete(checkoutData);

      // El backend devuelve { order, preferenceId }
      if (response.preferenceId) {
        setPreferenceId(response.preferenceId);
        setOrderId(response.order.id);
      } else {
        throw new Error('No se recibió preference ID del backend');
      }
    } catch (error: any) {
      console.error('Error al crear la preferencia de pago:', error);
      setError(error.response?.data?.message || 'Error al procesar el pago. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Método de Pago</h2>

      <div className="space-y-4">
        <p className="text-gray-400 text-sm mb-6">
          Selecciona tu método de pago preferido para completar la compra de forma segura.
        </p>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900 border border-red-500 rounded">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Botón para crear preferencia o mostrar Checkout Pro oficial */}
        {/* Simulación: al hacer click, pasa directo a la confirmación */}
        <button
          type="button"
          onClick={goToConfirmation}
          className="w-full p-6 bg-gris border-2 border-gray-600 rounded hover:border-verde transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.20.0/mercadopago/logo__large_plus.png" alt="Mercado Pago" className="w-16 h-16 bg-white rounded-lg object-contain p-2" />
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg group-hover:text-verde transition-colors">
                  Pagar con Mercado Pago
                </h3>
                <p className="text-gray-400 text-sm">
                  Paga con tarjetas, efectivo o dinero en cuenta
                </p>
              </div>
            </div>
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-verde transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
        {/* Fin simulación */}
        {/*
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => {
                // Redirigir a la URL oficial de Checkout Pro
                window.open(`https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`, '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all shadow-lg text-lg"
            >
              <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.20.0/mercadopago/logo__large_plus.png" alt="Mercado Pago" className="w-8 h-8 bg-white rounded object-contain p-1" />
              Ir a pagar con Mercado Pago
            </button>
            <span className="text-xs text-gray-400">Serás redirigido a Mercado Pago para completar el pago de forma segura.</span>
          </div>
        )}
        */}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-azul-oscuro rounded border border-gray-700">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-verde flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-white text-sm font-medium">Compra 100% segura</p>
              <p className="text-gray-400 text-xs mt-1">
                Tus datos están protegidos y la transacción es totalmente segura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
