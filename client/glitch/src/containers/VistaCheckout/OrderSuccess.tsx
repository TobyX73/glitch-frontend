import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import type { Order } from '../../services/api';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const paymentStatus = searchParams.get('status');
    
    if (orderId) {
      loadOrder(parseInt(orderId));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const loadOrder = async (orderId: number) => {
    try {
      const orderData = await ordersAPI.getById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error cargando orden:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gris flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde mx-auto mb-4"></div>
          <p className="text-verde text-xl font-semibold">Verificando tu orden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-8">
        <div className="bg-azul-oscuro border border-verde p-8 text-center">
          {/* Ícono de éxito */}
          <div className="w-20 h-20 bg-verde bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-verde" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">¡Orden Confirmada!</h1>
          
          {order ? (
            <>
              <p className="text-gray-300 mb-2">Tu orden #{order.id} ha sido creada exitosamente.</p>
              <p className="text-gray-400 text-sm mb-6">
                Total: <span className="text-verde font-bold text-xl">${order.total.toLocaleString('es-AR')}</span>
              </p>
              
              <div className="bg-gris p-4 rounded border border-gray-700 mb-6">
                <p className="text-gray-300 text-sm mb-2">
                  <strong className="text-white">Estado:</strong> {order.status === 'PAYMENT_PENDING' ? 'Esperando pago' : 'Pagado'}
                </p>
                {order.shippingAddress && (
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Envío a:</strong> {order.shippingAddress}
                  </p>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-8">
                Te enviamos un correo con los detalles de tu compra.
                Podés seguir el estado de tu pedido en "Mis Órdenes".
              </p>
            </>
          ) : (
            <p className="text-gray-300 mb-6">
              Tu orden ha sido procesada. Podés ver los detalles en la sección "Mis Órdenes".
            </p>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/mis-ordenes')}
              className="px-8 py-3 bg-verde text-gris font-semibold hover:bg-opacity-90 transition-all"
            >
              Ver Mis Órdenes
            </button>
            <button
              onClick={() => navigate('/productos')}
              className="px-8 py-3 bg-transparent border-2 border-verde text-verde font-semibold hover:bg-verde hover:text-gris transition-all"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
