import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ordersAPI } from "../../../services/api";
import { Order } from "../../../types/product.types";

const VistaOrdenesAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Cargar órdenes desde el backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await ordersAPI.getAll();
        // Manejar tanto arrays directos como objetos con .data
        const orders = Array.isArray(response) ? response : (response as any).data || [];
        console.log('📦 Órdenes recibidas:', orders);
        console.log('📦 Primera orden (detalle):', orders[0]);
        setOrders(orders);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar órdenes:', err);
        setError('Error al cargar las órdenes');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Función para ordenar por prioridad de estado
  const sortByPriority = (a: Order, b: Order) => {
    const priorityMap: Record<Order["status"], number> = {
      PENDING: 1,
      PAYMENT_PENDING: 2,
      PAID: 3,
      PREPARING: 4,
      SHIPPED: 5,
      DELIVERED: 6,
      CANCELLED: 7,
      REFUNDED: 8
    };
    const priorityDiff = priorityMap[a.status] - priorityMap[b.status];
    
    // Si tienen el mismo estado, ordenar por fecha (más reciente primero)
    if (priorityDiff === 0) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    return priorityDiff;
  };

  const filteredOrders = orders
    .filter((order) => {
      const customerName = order.guestName || 'Usuario invitado';
      const orderId = order.id ? order.id.toString() : '';
      const matchesSearch =
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.guestEmail && order.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || order.status === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    })
    .sort(sortByPriority);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
      case "PAYMENT_PENDING":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500";
      case "PAID":
      case "PREPARING":
      case "SHIPPED":
      case "DELIVERED":
        return "bg-verde bg-opacity-20 text-verde border-verde";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-500 bg-opacity-20 text-red-400 border-red-500";
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

  const handleStatusChange = async (orderId: string, newStatus: "confirmed" | "cancelled") => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      // Actualizar estado local
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado de la orden');
    }
  };

  const pendingCount = orders.filter((o) => o.status === "PENDING" || o.status === "PAYMENT_PENDING").length;
  const confirmedCount = orders.filter((o) => o.status === "PAID" || o.status === "PREPARING" || o.status === "SHIPPED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED" || o.status === "REFUNDED").length;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-verde border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando órdenes...</p>
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
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Gestión de Órdenes
        </h1>
        <p className="text-gray-400">
          Administrá las órdenes de compra y su estado
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-gris border-2 border-verde rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Órdenes</p>
              <p className="text-3xl font-bold text-white">{orders.length}</p>
            </div>
            <div className="p-4 bg-verde bg-opacity-20 rounded-lg">
              <svg
                className="w-8 h-8 text-verde"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gris border-2 border-yellow-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">En Confirmación</p>
              <p className="text-3xl font-bold text-yellow-400">
                {pendingCount}
              </p>
            </div>
            <div className="p-4 bg-yellow-500 bg-opacity-20 rounded-lg">
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gris border-2 border-verde rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Confirmadas</p>
              <p className="text-3xl font-bold text-verde">
                {confirmedCount}
              </p>
            </div>
            <div className="p-4 bg-verde bg-opacity-20 rounded-lg">
              <svg
                className="w-8 h-8 text-verde"
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
            </div>
          </div>
        </div>

        <div className="bg-gris border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Canceladas</p>
              <p className="text-3xl font-bold text-red-400">
                {cancelledCount}
              </p>
            </div>
            <div className="p-4 bg-red-500 bg-opacity-20 rounded-lg">
              <svg
                className="w-8 h-8 text-red-400"
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
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por número de orden o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-gris border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-verde transition-colors"
          />
          <svg
            className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-verde text-gris"
                : "bg-gris border border-gray-600 text-gray-300 hover:border-verde"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              statusFilter === "pending"
                ? "bg-yellow-500 text-gris"
                : "bg-gris border border-gray-600 text-gray-300 hover:border-yellow-500"
            }`}
          >
            En Confirmación ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("confirmed")}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              statusFilter === "confirmed"
                ? "bg-verde text-gris"
                : "bg-gris border border-gray-600 text-gray-300 hover:border-verde"
            }`}
          >
            Confirmadas ({confirmedCount})
          </button>
          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              statusFilter === "cancelled"
                ? "bg-red-500 text-gris"
                : "bg-gris border border-gray-600 text-gray-300 hover:border-red-500"
            }`}
          >
            Canceladas ({cancelledCount})
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gris border-2 border-verde rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-azul border-b-2 border-verde">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-verde uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedOrders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-azul transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-verde font-bold">
                      #{order.id ? String(order.id).padStart(8, '0') : 'N/A'}
                    </div>
                    <div className="text-gray-400 text-sm">ID: {order.id || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {order.guestName || 'Usuario invitado'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {order.guestEmail || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-AR") : 'N/A'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    {order.items?.length || 0}{" "}
                    {(order.items?.length || 0) === 1 ? "producto" : "productos"}
                  </td>
                  <td className="px-6 py-4 text-verde font-bold text-lg">
                    ${order.total ? order.total.toLocaleString() : '0'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                        order.status || 'pending'
                      )}`}
                    >
                      {getStatusText(order.status || 'pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Ver Detalles */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => order.id && navigate(`/admin/ordenes/${order.id}`)}
                        className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors"
                        title="Ver detalles"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </motion.button>

                      {/* Confirmar (solo si está pendiente) */}
                      {(order.status === "PENDING" || order.status === "PAYMENT_PENDING") && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => order.id && handleStatusChange(order.id.toString(), "PAID")}
                          className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors"
                          title="Confirmar orden"
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
                        </motion.button>
                      )}

                      {/* Cancelar (solo si NO está cancelada ni completada) */}
                      {(order.status === "PENDING" || order.status === "PAYMENT_PENDING" || order.status === "PAID" || order.status === "PREPARING") && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (window.confirm("¿Estás seguro de cancelar esta orden?")) {
                              order.id && handleStatusChange(order.id.toString(), "CANCELLED");
                            }
                          }}
                          className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-red-500 hover:text-red-500 transition-colors"
                          title="Cancelar orden"
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
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-azul border-t-2 border-verde">
            <div className="text-gray-400 text-sm">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)} de{" "}
              {filteredOrders.length} órdenes
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gris border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded transition-colors ${
                      currentPage === page
                        ? "bg-verde text-gris"
                        : "bg-gris border border-gray-600 text-gray-300 hover:border-verde hover:text-verde"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gris border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-400 text-lg">No se encontraron órdenes</p>
        </motion.div>
      )}
    </div>
  );
};

export default VistaOrdenesAdmin;
