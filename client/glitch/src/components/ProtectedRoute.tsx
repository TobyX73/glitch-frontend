import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { state } = useAuth();

  // 🐛 DEBUG: Ver el estado de autenticación
  console.log('🔍 ProtectedRoute - Estado:', {
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
    requireAdmin,
    loading: state.loading,
    userRole: state.user?.role,
    userName: state.user ? `${state.user.firstName} ${state.user.lastName}` : 'No user'
  });

  // Mientras está cargando, mostrar un loader
  if (state.loading) {
    console.log('⏳ Cargando autenticación...');
    return (
      <div className="min-h-screen bg-gris flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde"></div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!state.isAuthenticated) {
    console.warn('❌ No autenticado - Redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no es admin, redirigir a home
  if (requireAdmin && !state.isAdmin) {
    console.warn('❌ Acceso denegado - No es admin');
    console.log('👤 Usuario actual:', state.user);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Acceso permitido');
  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
