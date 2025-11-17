import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { usersAPI, ordersAPI } from "../../../services/api";
import type { User, Order } from "../../../types/product.types";

const VerUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (!id) {
        setError("ID de usuario no válido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Cargar datos del usuario
        const userResponse = await usersAPI.getById(id);
        console.log("👤 Usuario recibido:", userResponse);
        const userData: User = (userResponse as any).data || userResponse;
        setUser(userData);

        // Cargar todas las órdenes y filtrar por userId
        const ordersResponse = await ordersAPI.getAll();
        console.log("📦 Órdenes recibidas:", ordersResponse);
        const allOrders: Order[] = Array.isArray(ordersResponse) 
          ? ordersResponse 
          : (ordersResponse as any).data || [];
        
        // Filtrar órdenes del usuario
        const userOrders = allOrders.filter(order => order.userId === parseInt(id));
        console.log("📦 Órdenes del usuario:", userOrders);
        setOrders(userOrders);
        
        setError("");
      } catch (error: any) {
        console.error("❌ Error al cargar usuario:", error);
        setError(error.response?.data?.message || "Error al cargar el usuario");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
      case "PAYMENT_PENDING":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400";
      case "PAID":
      case "PREPARING":
        return "bg-blue-500 bg-opacity-20 text-blue-400";
      case "SHIPPED":
        return "bg-purple-500 bg-opacity-20 text-purple-400";
      case "DELIVERED":
        return "bg-verde bg-opacity-20 text-verde";
      case "CANCELLED":
        return "bg-red-500 bg-opacity-20 text-red-400";
      case "REFUNDED":
        return "bg-orange-500 bg-opacity-20 text-orange-400";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400";
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
          <p className="text-gray-400">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-6 text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || "Usuario no encontrado"}
          </p>
          <button
            onClick={() => navigate("/admin/usuarios")}
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
            Detalle del Usuario
          </h1>
          <p className="text-gray-400">ID: #{user.id}</p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/usuarios")}
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Profile Card */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-verde bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <span className="text-verde font-bold text-4xl">
                  {(user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                {user.firstName} {user.lastName}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Email
                </label>
                <p className="text-white font-semibold">{user.email}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Rol
                </label>
                <p className="text-white font-semibold capitalize">
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Miembro desde
                </label>
                <p className="text-white font-semibold">
                  {new Date(user.createdAt).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h3 className="text-xl font-bold text-verde mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total de Órdenes</span>
                <span className="text-white font-bold text-xl">
                  {orders.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completadas</span>
                <span className="text-verde font-bold text-xl">
                  {orders.filter((o) => o.status === "DELIVERED").length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-gris border-2 border-verde rounded-lg p-6">
            <h2 className="text-2xl font-bold text-verde mb-6">
              Historial de Órdenes ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
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
                <p className="text-gray-400 text-lg">
                  Este usuario no tiene órdenes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-azul border border-gray-600 rounded-lg p-5 hover:border-verde transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          Orden #{order.id}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                        <p className="text-verde font-bold text-xl mt-2">
                          ${order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-700 pt-4 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400">
                              {item.quantity}x
                            </span>
                            <span className="text-white font-semibold">
                              {item.productName}
                            </span>
                          </div>
                          <span className="text-white font-semibold">
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/admin/ordenes/${order.id}`)}
                      className="mt-4 w-full px-4 py-2 bg-gris border border-gray-600 text-gray-300 rounded font-semibold hover:border-verde hover:text-verde transition-all"
                    >
                      Ver Detalles
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerUsuario;
