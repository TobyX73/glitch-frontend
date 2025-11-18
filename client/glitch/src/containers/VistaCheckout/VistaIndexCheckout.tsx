import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CheckoutSteps from './CheckoutSteps';
import ShippingForm from './ShippingForm';
import PaymentMethods from './PaymentMethods';
import OrderConfirmation from './OrderConfirmation';
import OrderSummary from './OrderSummary';

interface ShippingFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  zipCode: string;
  shippingType: 'home' | 'branch';
  branch?: string;
}

const VistaIndexCheckout = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (state.items.length === 0 && currentStep !== 3) {
      navigate('/productos');
    }
  }, [state.items.length, currentStep, navigate]);

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(2);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gris pt-18 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white text-center mb-8 mr-4">Checkout</h1>

        {/* Indicador de pasos (solo en pasos 1 y 2) */}
        {currentStep < 3 && <CheckoutSteps currentStep={currentStep} />}

        {/* Paso 3: Confirmación (fuera del grid, centrado) */}
        {currentStep === 3 && (
          <div className="w-full">
            <OrderConfirmation />
          </div>
        )}

        {/* Layout: Formulario + Sidebar (solo pasos 1 y 2) */}
        {currentStep < 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Formularios (2/3) */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <ShippingForm onSubmit={handleShippingSubmit} />
              )}

              {currentStep === 2 && (
                <div>
                  <PaymentMethods 
                    shippingData={shippingData}
                    cartItems={state.items}
                    goToConfirmation={() => setCurrentStep(3)}
                  />
                  
                  {/* Botón para volver */}
                  <button
                    onClick={handleBackToStep1}
                    className="mt-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Volver a información de envío
                  </button>
                </div>
              )}
            </div>

            {/* Columna derecha - Resumen (1/3) */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaIndexCheckout;
