import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  notes?: string;
  timeline: TimelineEvent[];
}

interface OrderItem {
  id: number;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  size: string;
}

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
}

const VerOrden = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // TODO: Cargar datos de la orden desde el backend
  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data - reemplazar con fetch real
        const mockOrder: Order = {
          id: parseInt(id || "0"),
          orderNumber: "ORD-2024-001",
          date: "2024-11-14T10:30:00",
          status: "pending",
          customer: {
            name: "Juan Pérez",
            email: "juan.perez@email.com",
            phone: "+54 11 1234-5678",
            address: "Av. Corrientes 1234, Piso 5, Dpto B, CABA, Buenos Aires",
          },
          items: [
            {
              id: 1,
              productName: "Remera Cyberpunk 2077",
              image: "/productos/remera1.jpg",
              quantity: 1,
              price: 15000,
              size: "L",
            },
            {
              id: 2,
              productName: "Hoodie GTA V",
              image: "/productos/hoodie1.jpg",
              quantity: 1,
              price: 13000,
              size: "XL",
            },
          ],
          subtotal: 28000,
          shipping: 2500,
          total: 30500,
          notes: "",
          timeline: [
            {
              status: "created",
              date: "2024-11-14T10:30:00",
              description: "Orden creada por el cliente",
            },
            {
              status: "pending",
              date: "2024-11-14T10:31:00",
              description: "Esperando confirmación del administrador",
            },
          ],
        };

        setOrder(mockOrder);
        setAdminNotes(mockOrder.notes || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar orden:", error);
        setError("Error al cargar la orden");
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: "confirmed" | "cancelled") => {
    if (!order) return;

    const confirmMessage =
      newStatus === "confirmed"
        ? "¿Estás seguro de confirmar esta orden?"
        : "¿Estás seguro de cancelar esta orden?";

    if (!window.confirm(confirmMessage)) return;

    try {
      // TODO: Implementar actualización en el backend
      const newEvent: TimelineEvent = {
        status: newStatus,
        date: new Date().toISOString(),
        description:
          newStatus === "confirmed"
            ? "Orden confirmada por el administrador"
            : "Orden cancelada por el administrador",
      };

      setOrder({
        ...order,
        status: newStatus,
        timeline: [...order.timeline, newEvent],
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la orden");
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;

    setIsSavingNotes(true);
    try {
      // TODO: Implementar guardado en el backend
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOrder({
        ...order,
        notes: adminNotes,
      });

      alert("Notas guardadas correctamente");
    } catch (error) {
      console.error("Error al guardar notas:", error);
      alert("Error al guardar las notas");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500";
      case "confirmed":
        return "bg-verde bg-opacity-20 text-verde border-verde";
      case "cancelled":
        return "bg-red-500 bg-opacity-20 text-red-400 border-red-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "En Confirmación";
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
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
          <p className="text-verde font-bold text-xl">{order.orderNumber}</p>
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

          {order.status === "pending" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("confirmed")}
              className="flex items-center gap-2 px-6 py-3 bg-verde text-gris rounded font-bold hover:bg-opacity-90 transition-all"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Confirmar Orden
            </motion.button>
          )}

          {(order.status === "pending" || order.status === "confirmed") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("cancelled")}
              className="flex items-center gap-2 px-6 py-3 bg-gris border-2 border-red-500 text-red-500 rounded font-bold hover:bg-red-500 hover:text-white transition-all"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancelar Orden
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

            {/* Timeline */}
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === order.timeline.length - 1
                          ? "bg-verde"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    {index < order.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-600 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-white font-semibold">
                      {event.description}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(event.date).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}
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
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded border border-gray-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <span className="text-gray-400">
                        Cantidad: {item.quantity}
                      </span>
                      <span className="px-2 py-1 bg-gris border border-verde text-verde text-xs rounded">
                        Talla: {item.size}
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
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envío</span>
                <span>${order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white text-xl font-bold pt-3 border-t border-gray-600">
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
                <p className="text-white font-semibold">{order.customer.name}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Email
                </label>
                <p className="text-white font-semibold">
                  {order.customer.email}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Teléfono
                </label>
                <p className="text-white font-semibold">
                  {order.customer.phone}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Dirección de Envío
                </label>
                <p className="text-white font-semibold">
                  {order.customer.address}
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
                  {order.orderNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fecha de Creación</span>
                <span className="text-white font-semibold">
                  {new Date(order.date).toLocaleDateString("es-AR")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Hora</span>
                <span className="text-white font-semibold">
                  {new Date(order.date).toLocaleTimeString("es-AR", {
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
