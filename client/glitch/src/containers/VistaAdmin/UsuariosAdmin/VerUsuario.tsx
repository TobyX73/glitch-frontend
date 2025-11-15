import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
}

const VerUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // TODO: Cargar datos del usuario y sus órdenes desde el backend
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data - reemplazar con fetch real
        const mockUser: User = {
          id: parseInt(id || "0"),
          name: "Juan Pérez",
          email: "juan.perez@email.com",
          phone: "+54 11 1234-5678",
          address: "Av. Corrientes 1234, CABA, Buenos Aires",
          createdAt: "2024-01-15",
        };

        const mockOrders: Order[] = [
          {
            id: 1,
            orderNumber: "ORD-2024-001",
            date: "2024-03-15",
            status: "completed",
            total: 28000,
            items: [
              {
                id: 1,
                productName: "Remera Cyberpunk 2077",
                quantity: 1,
                price: 15000,
                size: "L",
              },
              {
                id: 2,
                productName: "Hoodie GTA V",
                quantity: 1,
                price: 13000,
                size: "XL",
              },
            ],
          },
          {
            id: 2,
            orderNumber: "ORD-2024-012",
            date: "2024-04-20",
            status: "completed",
            total: 15000,
            items: [
              {
                id: 3,
                productName: "Remera The Witcher",
                quantity: 1,
                price: 15000,
                size: "M",
              },
            ],
          },
          {
            id: 3,
            orderNumber: "ORD-2024-045",
            date: "2024-05-10",
            status: "processing",
            total: 32000,
            items: [
              {
                id: 4,
                productName: "Buzo Fortnite",
                quantity: 2,
                price: 16000,
                size: "L",
              },
            ],
          },
          {
            id: 4,
            orderNumber: "ORD-2024-067",
            date: "2024-06-05",
            status: "pending",
            total: 45000,
            items: [
              {
                id: 5,
                productName: "Remera God of War",
                quantity: 1,
                price: 15000,
                size: "XL",
              },
              {
                id: 6,
                productName: "Hoodie Minecraft",
                quantity: 1,
                price: 30000,
                size: "L",
              },
            ],
          },
          {
            id: 5,
            orderNumber: "ORD-2024-089",
            date: "2024-07-12",
            status: "cancelled",
            total: 20000,
            items: [
              {
                id: 7,
                productName: "Remera League of Legends",
                quantity: 1,
                price: 20000,
                size: "M",
              },
            ],
          },
        ];

        setUser(mockUser);
        setOrders(mockOrders);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        setError("Error al cargar el usuario");
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-verde bg-opacity-20 text-verde";
      case "processing":
        return "bg-blue-500 bg-opacity-20 text-blue-400";
      case "pending":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400";
      case "cancelled":
        return "bg-red-500 bg-opacity-20 text-red-400";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "Completada";
      case "processing":
        return "En Proceso";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
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
                  {user.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                {user.name}
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
                  Teléfono
                </label>
                <p className="text-white font-semibold">{user.phone}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Dirección
                </label>
                <p className="text-white font-semibold">{user.address}</p>
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
                  {orders.filter((o) => o.status === "completed").length}
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
                          {order.orderNumber}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.date).toLocaleDateString("es-AR", {
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
                            <span className="px-2 py-1 bg-gris border border-verde text-verde text-xs rounded">
                              {item.size}
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
                      onClick={() => setSelectedOrder(order)}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gris border-2 border-verde rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Detalle de Orden
                </h2>
                <p className="text-verde font-bold text-xl">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-azul rounded transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-400 hover:text-white"
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
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Fecha
                  </label>
                  <p className="text-white font-semibold">
                    {new Date(selectedOrder.date).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Estado
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-verde font-bold text-lg mb-3">
                  Productos
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-azul border border-gray-600 rounded p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-semibold mb-1">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-400">
                              Cantidad: {item.quantity}
                            </span>
                            <span className="px-2 py-1 bg-gris border border-verde text-verde text-xs rounded">
                              Talla: {item.size}
                            </span>
                          </div>
                        </div>
                        <p className="text-verde font-bold text-lg">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-verde pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-xl font-bold">
                    Total
                  </span>
                  <span className="text-verde text-3xl font-bold">
                    ${selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VerUsuario;
