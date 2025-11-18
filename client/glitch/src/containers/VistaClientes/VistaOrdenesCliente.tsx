import { useState, useEffect } from 'react';
import { ordersAPI, productsAPI } from '../../services/api';
import type { Order } from '../../services/api';
import type { Product } from '../../types/product.types';

interface OrderWithProducts extends Order {
  productsData?: Product[];
}

const VistaOrdenesCliente = () => {
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getUserOrders();
      
      // Cargar información de productos para cada orden
      const ordersWithProducts = await Promise.all(
        data.map(async (order) => {
          try {
            const productsData = await Promise.all(
              order.items.map(async (item) => {
                try {
                  return await productsAPI.getById(item.productId);
                } catch {
                  return null;
                }
              })
            );
            return {
              ...order,
              productsData: productsData.filter((p): p is Product => p !== null)
            };
          } catch {
            return order;
          }
        })
      );
      
      setOrders(ordersWithProducts);
    } catch (err: any) {
      console.error('Error cargando órdenes:', err);
      setError(err.response?.data?.message || 'Error al cargar tus órdenes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-900 text-green-300 border-green-500';
      case 'SHIPPED':
        return 'bg-blue-900 text-blue-300 border-blue-500';
      case 'PREPARING':
      case 'PAID':
        return 'bg-yellow-900 text-yellow-300 border-yellow-500';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-900 text-red-300 border-red-500';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Pendiente',
      PAYMENT_PENDING: 'Pago Pendiente',
      PAID: 'Pagado',
      PREPARING: 'Preparando',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
      REFUNDED: 'Reembolsado'
    };
    return statusMap[status] || status;
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gris pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-verde mx-auto mb-4"></div>
          <p className="text-verde text-xl font-semibold">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mis Órdenes</h1>
          <p className="text-gray-400">Seguí el estado de tus pedidos</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-500 rounded">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-azul-oscuro border border-gray-700 rounded">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-400 text-xl mb-6">No tenés órdenes todavía</p>
            <a
              href="/productos"
              className="inline-block px-8 py-3 bg-verde text-gris font-semibold hover:bg-opacity-90 transition-all rounded"
            >
              Explorar Productos
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-azul-oscuro border border-gray-700 hover:border-verde transition-all overflow-hidden"
              >
                {/* Header de la orden */}
                <div 
                  onClick={() => toggleOrder(order.id)}
                  className="p-6 cursor-pointer hover:bg-opacity-50 hover:bg-gray-800 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-white text-lg font-semibold">Orden #{order.id}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        {new Date(order.createdAt || '').toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-verde text-2xl font-bold">${order.total.toLocaleString('es-AR')}</p>
                      {order.paymentStatus && (
                        <p className="text-gray-400 text-sm mt-1">
                          Pago: {order.paymentStatus === 'PAID' ? 'Completado' : 'Pendiente'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalle expandible */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-700 p-6 bg-gris bg-opacity-50">
                    {/* Lista de productos */}
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-4">Productos</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => {
                          const product = order.productsData?.find(p => p.id === item.productId);
                          return (
                            <div key={idx} className="flex items-center gap-4 bg-azul-oscuro p-3 rounded border border-gray-700">
                              {product?.imageURLs && product.imageURLs.length > 0 ? (
                                <img 
                                  src={product.imageURLs[0]} 
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-white font-medium">
                                  {product?.name || `Producto #${item.productId}`}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Cantidad: {item.quantity} {item.size && `• Talle: ${item.size}`}
                                </p>
                              </div>
                              <p className="text-verde font-semibold">${item.price.toLocaleString('es-AR')}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dirección de envío */}
                    {order.shippingAddress && (
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">Dirección de Envío</h4>
                        <p className="text-gray-300 bg-azul-oscuro p-3 rounded border border-gray-700">
                          {order.shippingAddress}
                        </p>
                      </div>
                    )}

                    {/* Notas */}
                    {order.notes && (
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">Notas</h4>
                        <p className="text-gray-300 bg-azul-oscuro p-3 rounded border border-gray-700">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Timeline de estados */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-white font-semibold mb-4">Estado del Pedido</h4>
                      <div className="flex items-center justify-between relative">
                        {/* Línea de progreso */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-700">
                          <div 
                            className="h-full bg-verde transition-all duration-500"
                            style={{
                              width: order.status === 'DELIVERED' ? '100%' :
                                     order.status === 'SHIPPED' ? '75%' :
                                     order.status === 'PREPARING' || order.status === 'PAID' ? '50%' : '25%'
                            }}
                          />
                        </div>
                        
                        {/* Puntos de progreso */}
                        {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'].map((status, idx) => (
                          <div key={status} className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                              ${['PENDING', 'PAYMENT_PENDING'].includes(order.status) && idx === 0 ? 'bg-verde border-verde' :
                                order.status === 'PAID' && idx <= 1 ? 'bg-verde border-verde' :
                                order.status === 'PREPARING' && idx <= 1 ? 'bg-verde border-verde' :
                                order.status === 'SHIPPED' && idx <= 2 ? 'bg-verde border-verde' :
                                order.status === 'DELIVERED' && idx <= 3 ? 'bg-verde border-verde' :
                                'bg-gray-700 border-gray-600'}`}
                            >
                              {idx < (['PENDING', 'PAYMENT_PENDING'].includes(order.status) ? 0 :
                                      order.status === 'PAID' || order.status === 'PREPARING' ? 2 :
                                      order.status === 'SHIPPED' ? 3 :
                                      order.status === 'DELIVERED' ? 4 : 0) && (
                                <svg className="w-4 h-4 text-gris" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center whitespace-nowrap">
                              {getStatusText(status)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaOrdenesCliente;
