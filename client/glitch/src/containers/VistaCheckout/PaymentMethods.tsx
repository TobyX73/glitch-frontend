import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface PaymentMethodsProps {
  shippingData: any; // Datos del formulario de envío
  cartItems: any[]; // Items del carrito
}

const PaymentMethods = ({ shippingData, cartItems }: PaymentMethodsProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    
    try {
      // TODO: Reemplaza esta URL con la de tu backend
      // Ejemplo: const response = await fetch('http://localhost:3000/api/create-preference', {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: parseFloat(item.price.replace(/[^0-9.-]+/g, '')),
            currency_id: 'ARS'
          })),
          payer: {
            name: shippingData.firstName,
            surname: shippingData.lastName,
            email: shippingData.email,
          },
          shipments: {
            cost: 0,
            mode: shippingData.shippingType === 'home' ? 'custom' : 'not_specified'
          },
          back_urls: {
            success: `${window.location.origin}/checkout/success`,
            failure: `${window.location.origin}/checkout/failure`,
            pending: `${window.location.origin}/checkout/pending`
          },
          auto_return: 'approved'
        })
      });

      const data = await response.json();
      setPreferenceId(data.preferenceId);
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      
      // PLACEHOLDER: Preferencia de ejemplo para testing
      // Cuando conectes tu backend, elimina esta línea
      setPreferenceId('TEST-PREFERENCE-ID-PLACEHOLDER');
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
