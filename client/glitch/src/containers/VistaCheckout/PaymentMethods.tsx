import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { ordersAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

interface PaymentMethodsProps {
  shippingData: any; // Datos del formulario de envío
  cartItems: any[]; // Items del carrito
}

const PaymentMethods = ({ shippingData, cartItems }: PaymentMethodsProps) => {
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

  // Función para crear la preferencia de pago
  const createPreference = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar dirección de envío
      const shippingAddress = `${shippingData.address}, ${shippingData.apartment ? shippingData.apartment + ', ' : ''}${shippingData.city}, CP: ${shippingData.zipCode}`;
      
      // Preparar items del carrito
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
      }));
      
      // Crear orden en el backend
      const checkoutData = {
        items: orderItems,
        shippingAddress: shippingAddress,
        paymentMethod: 'mercadopago'
      };
      
      console.log('Creando orden con:', checkoutData);
      
      const response = await ordersAPI.checkoutComplete(checkoutData);
      
      console.log('Respuesta del backend:', response);
      
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

        {/* Botón para crear preferencia o mostrar Wallet de Mercado Pago */}
        {!preferenceId ? (
          <button
            type="button"
            onClick={createPreference}
            disabled={loading}
            className="w-full p-6 bg-gris border-2 border-gray-600 rounded hover:border-verde transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-500">MP</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-lg group-hover:text-verde transition-colors">
                    {loading ? 'Preparando pago...' : 'Mercado Pago'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Paga con tarjetas, efectivo o dinero en cuenta
                  </p>
                </div>
              </div>
              {!loading && (
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
              )}
            </div>
          </button>
        ) : (
          <div className="w-full">
            {/* Botón oficial de Mercado Pago */}
            <Wallet
              initialization={{ preferenceId }}
            />
            
            {/* Nota para desarrollo */}
            {preferenceId === 'TEST-PREFERENCE-ID-PLACEHOLDER' && (
              <div className="mt-4 p-3 bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded">
                <p className="text-yellow-400 text-xs">
                  ⚠️ Modo de prueba: Conecta tu backend en PaymentMethods.tsx línea 32
                </p>
              </div>
            )}
          </div>
        )}

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
