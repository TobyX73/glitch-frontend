import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ordersAPI } from "../../../services/api";
import type { Order } from "../../../types/product.types";

const VerOrden = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError("ID de orden no válido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await ordersAPI.getById(parseInt(id));
        console.log("📦 Orden recibida:", response);
        
        // El backend puede devolver { data: order } o directamente order
        const orderData: Order = (response as any).data || response;
        setOrder(orderData);
        setAdminNotes(orderData.notes || "");
        setError("");
      } catch (error: any) {
        console.error("❌ Error al cargar orden:", error);
        setError(error.response?.data?.message || "Error al cargar la orden");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order) return;

    const statusMessages: Record<string, string> = {
      'PENDING': '¿Marcar como pendiente?',
      'PAYMENT_PENDING': '¿Marcar como pendiente de pago?',
      'PAID': '¿Confirmar el pago?',
      'PREPARING': '¿Marcar como en preparación?',
      'SHIPPED': '¿Marcar como enviada?',
      'DELIVERED': '¿Marcar como entregada?',
      'CANCELLED': '¿Estás seguro de cancelar esta orden?',
      'REFUNDED': '¿Marcar como reembolsada?',
    };

    const confirmMessage = statusMessages[newStatus] || '¿Actualizar el estado?';

    if (!window.confirm(confirmMessage)) return;

    try {
      const updatedOrder = await ordersAPI.updateStatus(order.id.toString(), newStatus);
      console.log("✅ Estado actualizado:", updatedOrder);
      
      // Actualizar orden en el estado local
      const orderData: Order = (updatedOrder as any).data || updatedOrder;
      setOrder(orderData);
    } catch (error: any) {
      console.error("❌ Error al actualizar estado:", error);
      alert(error.response?.data?.message || "Error al actualizar el estado de la orden");
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;

    setIsSavingNotes(true);
    try {
      // Nota: El backend actual puede no tener endpoint para actualizar notas
      // Si existe, debería ser: PATCH /orders/:id con { notes: adminNotes }
      console.log("💾 Guardando notas para orden:", order.id);
      
      // Por ahora, solo actualizamos el estado local
      setOrder({
        ...order,
        notes: adminNotes,
      });

      alert("Notas guardadas correctamente (solo localmente - implementar endpoint en backend)");
    } catch (error: any) {
      console.error("❌ Error al guardar notas:", error);
      alert("Error al guardar las notas");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
      case "PAYMENT_PENDING":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500";
      case "PAID":
      case "PREPARING":
        return "bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500";
      case "SHIPPED":
        return "bg-purple-500 bg-opacity-20 text-purple-400 border-purple-500";
      case "DELIVERED":
        return "bg-verde bg-opacity-20 text-verde border-verde";
      case "CANCELLED":
        return "bg-red-500 bg-opacity-20 text-red-400 border-red-500";
      case "REFUNDED":
        return "bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PAYMENT_PENDING":
        return "Pago Pendiente";
      case "PAID":
        return "Pagada";
      case "PREPARING":
        return "En Preparación";
      case "SHIPPED":
        return "Enviada";
      case "DELIVERED":
        return "Entregada";
      case "CANCELLED":
        return "Cancelada";
      case "REFUNDED":
        return "Reembolsada";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-verde border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-6 text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || "Orden no encontrada"}
          </p>
          <button
            onClick={() => navigate("/admin/ordenes")}
            className="px-6 py-3 bg-verde text-gris font-bold rounded hover:bg-opacity-90 transition-all"
          >
            Volver al Listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Detalle de Orden
          </h1>
          <p className="text-verde font-bold text-xl">#{order.id}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/ordenes")}
            className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-gray-600 text-gray-300 rounded font-bold hover:border-verde hover:text-verde transition-all"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </motion.button>

          {/* Botones de cambio de estado según estado actual */}
          {order.status === "PENDING" && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusChange("PAID")}
                className="flex items-center gap-2 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Marcar como Pagada
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatusChange("CANCELLED")}
                className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-red-500 text-red-500 rounded font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </motion.button>
            </>
          )}

          {order.status === "PAID" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("PREPARING")}
              className="flex items-center gap-2 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all"
            >
              Marcar como En Preparación
            </motion.button>
          )}

          {order.status === "PREPARING" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("SHIPPED")}
              className="flex items-center gap-2 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all"
            >
              Marcar como Enviada
            </motion.button>
          )}

          {order.status === "SHIPPED" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("DELIVERED")}
              className="flex items-center gap-2 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all"
            >
              Marcar como Entregada
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gris border-2 border-verde rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-verde">Estado de la Orden</h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>

            {/* Info básica */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Orden ID:</span>
                <span className="text-white font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fecha:</span>
                <span className="text-white font-semibold">
                  {new Date(order.createdAt).toLocaleString("es-AR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado de Pago:</span>
                <span className="text-white font-semibold">
                  {order.payment?.status || 'Pendiente'}
                </span>
              </div>
              {order.mpExternalReference && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Referencia MP:</span>
                  <span className="text-white font-semibold">{order.mpExternalReference}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gris border-2 border-verde rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-verde mb-6">
              Productos ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-azul border border-gray-600 rounded-lg p-4 hover:border-verde transition-colors"
                >
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded border border-gray-600"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <span className="text-gray-400">
                        Cantidad: {item.quantity}
                      </span>
                    </div>
                    <p className="text-verde font-bold text-lg">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Subtotal</p>
                    <p className="text-white font-bold text-lg">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t-2 border-verde space-y-3">
              <div className="flex justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span className="text-verde">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Admin Notes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gris border-2 border-verde rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-verde mb-4">
              Notas Internas
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Estas notas son solo para administradores y no son visibles para
              el cliente
            </p>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-azul border-2 border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors resize-none mb-4"
              placeholder="Agregar notas sobre esta orden..."
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="px-6 py-3 bg-verde text-gris font-bold rounded hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingNotes ? "Guardando..." : "Guardar Notas"}
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column - Customer Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Customer Details */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h2 className="text-2xl font-bold text-verde mb-6">
              Información del Cliente
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Nombre
                </label>
                <p className="text-white font-semibold">
                  {order.guestName || 'Usuario registrado'}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Email
                </label>
                <p className="text-white font-semibold">
                  {order.guestEmail || 'No disponible'}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Dirección de Envío
                </label>
                <p className="text-white font-semibold">
                  {order.shippingInfo.street}, {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h2 className="text-2xl font-bold text-verde mb-6">
              Información de la Orden
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Número de Orden</span>
                <span className="text-white font-semibold">
                  #{order.id}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fecha de Creación</span>
                <span className="text-white font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Hora</span>
                <span className="text-white font-semibold">
                  {new Date(order.createdAt).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total de Productos</span>
                <span className="text-white font-semibold">
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                <span className="text-gray-400">Total a Pagar</span>
                <span className="text-verde font-bold text-xl">
                  ${order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerOrden;
