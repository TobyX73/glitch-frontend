import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  totalProducts: number;
  total: number;
}

const VistaOrdenesAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const itemsPerPage = 10;

  // TODO: Reemplazar con datos del backend
  const mockOrders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customerName: "Juan Pérez",
      customerEmail: "juan.perez@email.com",
      date: "2024-11-14T10:30:00",
      status: "pending",
      totalProducts: 2,
      total: 28000,
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customerName: "María González",
      customerEmail: "maria.gonzalez@email.com",
      date: "2024-11-14T09:15:00",
      status: "pending",
      totalProducts: 1,
      total: 15000,
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customerName: "Carlos Rodríguez",
      customerEmail: "carlos.rodriguez@email.com",
      date: "2024-11-13T16:45:00",
      status: "pending",
      totalProducts: 3,
      total: 45000,
    },
    {
      id: 4,
      orderNumber: "ORD-2024-004",
      customerName: "Ana Martínez",
      customerEmail: "ana.martinez@email.com",
      date: "2024-11-13T14:20:00",
      status: "confirmed",
      totalProducts: 2,
      total: 32000,
    },
    {
      id: 5,
      orderNumber: "ORD-2024-005",
      customerName: "Luis Fernández",
      customerEmail: "luis.fernandez@email.com",
      date: "2024-11-12T11:00:00",
      status: "confirmed",
      totalProducts: 1,
      total: 20000,
    },
    {
      id: 6,
      orderNumber: "ORD-2024-006",
      customerName: "Sofía López",
      customerEmail: "sofia.lopez@email.com",
      date: "2024-11-12T08:30:00",
      status: "confirmed",
      totalProducts: 4,
      total: 60000,
    },
    {
      id: 7,
      orderNumber: "ORD-2024-007",
      customerName: "Diego Torres",
      customerEmail: "diego.torres@email.com",
      date: "2024-11-11T15:00:00",
      status: "cancelled",
      totalProducts: 2,
      total: 25000,
    },
    {
      id: 8,
      orderNumber: "ORD-2024-008",
      customerName: "Laura Sánchez",
      customerEmail: "laura.sanchez@email.com",
      date: "2024-11-10T12:45:00",
      status: "cancelled",
      totalProducts: 1,
      total: 18000,
    },
  ];

  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Función para ordenar por prioridad de estado
  const sortByPriority = (a: Order, b: Order) => {
    const priorityMap = { pending: 1, confirmed: 2, cancelled: 3 };
    const priorityDiff = priorityMap[a.status] - priorityMap[b.status];
    
    // Si tienen el mismo estado, ordenar por fecha (más reciente primero)
    if (priorityDiff === 0) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    return priorityDiff;
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

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

  const handleStatusChange = async (orderId: number, newStatus: "confirmed" | "cancelled") => {
    // TODO: Implementar actualización de estado en el backend
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;

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
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-azul transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-verde font-bold">
                      {order.orderNumber}
                    </div>
                    <div className="text-gray-400 text-sm">ID: #{order.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {order.customerName}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {new Date(order.date).toLocaleDateString("es-AR")}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(order.date).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    {order.totalProducts}{" "}
                    {order.totalProducts === 1 ? "producto" : "productos"}
                  </td>
                  <td className="px-6 py-4 text-verde font-bold text-lg">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Ver Detalles */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/admin/ordenes/${order.id}`)}
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
                      {order.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStatusChange(order.id, "confirmed")}
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

                      {/* Cancelar (solo si está pendiente o confirmada) */}
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (window.confirm("¿Estás seguro de cancelar esta orden?")) {
                              handleStatusChange(order.id, "cancelled");
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
