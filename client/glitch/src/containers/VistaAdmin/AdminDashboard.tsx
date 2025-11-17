import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { productsAPI, ordersAPI, usersAPI } from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estadísticas desde el backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('🔄 AdminDashboard - Iniciando carga de estadísticas...');
        setIsLoading(true);
        
        // Cargar datos en paralelo
        console.log('📡 Llamando a las APIs...');
        const [products, orders, users] = await Promise.all([
          productsAPI.getAll(),
          ordersAPI.getAll(),
          usersAPI.getAll(),
        ]);

        console.log('✅ Datos recibidos:');
        console.log('  - Productos:', products);
        console.log('  - Productos (tipo):', typeof products, 'isArray:', Array.isArray(products));
        console.log('  - Órdenes:', orders);
        console.log('  - Órdenes (tipo):', typeof orders, 'isArray:', Array.isArray(orders));
        console.log('  - Usuarios:', users);
        console.log('  - Usuarios (tipo):', typeof users, 'isArray:', Array.isArray(users));

        // Si no son arrays, intentar acceder a .data
        const productsArray = Array.isArray(products) ? products : (products as any).data || [];
        const ordersArray = Array.isArray(orders) ? orders : (orders as any).data || [];
        const usersArray = Array.isArray(users) ? users : (users as any).data || [];

        console.log('🔧 Arrays procesados:');
        console.log('  - productsArray:', productsArray);
        console.log('  - ordersArray:', ordersArray);
        console.log('  - usersArray:', usersArray);

        // Contar órdenes pendientes (PENDING y PAYMENT_PENDING)
        const pendingOrders = ordersArray.filter(
          (order: any) => order.status === 'PENDING' || order.status === 'PAYMENT_PENDING'
        ).length;

        const newStats = {
          totalProducts: productsArray.length,
          pendingOrders: pendingOrders,
          totalUsers: usersArray.length,
        };

        console.log('📊 Estadísticas calculadas:', newStats);
        setStats(newStats);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
        console.error('Detalles del error:', error);
      } finally {
        console.log('🏁 Finalizando carga (isLoading = false)');
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsCards = [
    {
      title: "Productos",
      count: stats.totalProducts,
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      path: "/admin/productos",
      color: "verde",
    },
    {
      title: "Órdenes Pendientes",
      count: stats.pendingOrders,
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      path: "/admin/ordenes",
      color: "verde",
    },
    {
      title: "Usuarios Registrados",
      count: stats.totalUsers,
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      path: "/admin/usuarios",
      color: "verde",
    },
  ];

  return (
    <div className="p-8">
      {/* Saludo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Bienvenido, Admin! 👋
        </h1>
        <p className="text-gray-400 text-lg">
          Aca podés gestionar la tienda
        </p>
      </motion.div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-verde border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando estadísticas...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => navigate(stat.path)}
            className="bg-azul border-2 border-verde rounded-lg p-6 cursor-pointer hover:bg-verde hover:border-verde transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-verde group-hover:text-gris transition-colors">
                {stat.icon}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="text-4xl font-bold text-verde group-hover:text-gris transition-colors"
              >
                {stat.count}
              </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-gris transition-colors">
              {stat.title}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-gray-400 group-hover:text-gris transition-colors">
              <span className="text-sm">Ver detalles</span>
              <svg
                className="w-4 h-4"
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
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sección de acceso rápido (opcional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 bg-azul border border-gray-700 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/productos/nuevo")}
            className="flex items-center gap-3 px-4 py-3 bg-gris border-2 border-verde text-verde rounded font-semibold hover:bg-verde hover:text-gris transition-all duration-300"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Nuevo Producto
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/ordenes")}
            className="flex items-center gap-3 px-4 py-3 bg-gris border-2 border-verde text-verde rounded font-semibold hover:bg-verde hover:text-gris transition-all duration-300"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Ver Órdenes Pendientes
          </motion.button>
        </div>
      </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
