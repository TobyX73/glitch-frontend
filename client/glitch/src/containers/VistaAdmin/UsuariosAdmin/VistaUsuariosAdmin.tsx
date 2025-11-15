import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  totalOrders: number;
}

const VistaUsuariosAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // TODO: Reemplazar con datos del backend
  const mockUsers: User[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+54 11 1234-5678",
      address: "Av. Corrientes 1234, CABA",
      createdAt: "2024-01-15",
      totalOrders: 5,
    },
    {
      id: 2,
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+54 11 2345-6789",
      address: "Calle Falsa 567, Buenos Aires",
      createdAt: "2024-02-20",
      totalOrders: 3,
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+54 11 3456-7890",
      address: "San Martín 890, Rosario",
      createdAt: "2024-03-10",
      totalOrders: 0,
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      phone: "+54 11 4567-8901",
      address: "Belgrano 234, Córdoba",
      createdAt: "2024-01-25",
      totalOrders: 8,
    },
    {
      id: 5,
      name: "Luis Fernández",
      email: "luis.fernandez@email.com",
      phone: "+54 11 5678-9012",
      address: "Mitre 456, Mendoza",
      createdAt: "2024-04-05",
      totalOrders: 2,
    },
  ];

  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
          Gestión de Usuarios
        </h1>
        <p className="text-gray-400">
          Visualizá los usuarios registrados y sus órdenes de compra
        </p>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-gris border-2 border-verde rounded-lg p-6 max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-white">{users.length}</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
        className="mb-6"
      >
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
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
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-verde uppercase tracking-wider">
                  Órdenes
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-verde uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-azul transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-verde bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-verde font-bold text-lg">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {user.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          ID: #{user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white text-sm">{user.email}</div>
                    <div className="text-gray-400 text-sm">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {user.totalOrders} órdenes
                    </div>
                    <div className="text-gray-400 text-sm">
                      Desde {new Date(user.createdAt).toLocaleDateString("es-AR")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Ver */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/admin/usuarios/${user.id}`)}
                        className="p-2 bg-azul border border-gray-600 text-gray-300 rounded hover:border-verde hover:text-verde transition-colors"
                        title="Ver detalles y órdenes"
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
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de{" "}
              {filteredUsers.length} usuarios
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
      {filteredUsers.length === 0 && (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="text-gray-400 text-lg">No se encontraron usuarios</p>
        </motion.div>
      )}
    </div>
  );
};

export default VistaUsuariosAdmin;
