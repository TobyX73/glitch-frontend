import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import VistaIndexCarrito from "../containers/VistaCarrito/VistaIndexCarrito"

function Navbar(){
  const { getTotalItems } = useCart();
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <>
      <nav className="relative flex bg-azul text-verde justify-between items-center px-8 py-6">

      <div className="flex gap-6 items-center z-10">
        <Link 
          to="/productos" 
          className="transition-transform duration-300 hover:text-white font- hover:scale-105">
          Productos
        </Link>
        <Link 
          to="/contacto" 
          className="transition-transform duration-300 hover:text-white font- hover:scale-105">
          Contáctanos
        </Link>
        <Link 
          to="/nosotros" 
          className="transition-transform duration-300 hover:text-white font- hover:scale-105">
          Nosotros
        </Link>
        {authState.isAdmin && (
          <Link 
            to="/admin" 
            className="transition-transform duration-300 hover:text-white font- hover:scale-105">
            Panel de Admin
          </Link>
        )}
      </div>

      <Link 
        to="/" 
        className="absolute left-1/2 -translate-x-1/2 transition-transform duration-300 hover:scale-110 z-20 pb-3"> 
        <img 
          src="/glitch-sin-relleno.svg" 
          alt="logo-glitch" 
          className="h-20 w-auto"
        /> 
      </Link>
      
      <div className="flex items-center gap-6 z-10">
        <button
          onClick={() => setIsCartOpen(true)}
          className="transition-transform duration-300 hover:text-white flex items-center gap-2 hover:scale-105 cursor-pointer bg-transparent border-none"
        >
          <img 
            src="/carrito.svg" 
            alt="icono-carrito" 
            className="h-6 w-6"
          />
          {totalItems > 0 && (
            <span className="font-semibold">{totalItems}</span>
          )}
        </button>

        {/* Usuario autenticado o Login */}
        {authState.isAuthenticated && authState.user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="transition-transform duration-300 hover:text-white flex items-center gap-2 hover:scale-105 bg-transparent border-none cursor-pointer"
            >
              <img 
                src="/user 1.svg" 
                alt="icono-usuario" 
                className="h-6 w-6"
              />
              <span className="font-medium">
                {authState.user.firstName}
              </span>
            </button>

            {/* Menú desplegable */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-azul border-2 border-verde rounded-lg shadow-xl z-50">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-verde">
                    <p className="font-semibold text-verde">
                      {authState.user.firstName} {authState.user.lastName}
                    </p>
                    <p className="text-xs">{authState.user.email}</p>
                    {authState.isAdmin && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-verde text-azul rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  <Link
                    to="/mis-ordenes"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-verde hover:bg-verde hover:text-azul transition-colors"
                  >
                    Mis Órdenes
                  </Link>
                  
                  <Link
                    to="/perfil"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-verde hover:bg-verde hover:text-azul transition-colors"
                  >
                    Mi Perfil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            className="transition-transform duration-300 hover:text-white flex items-center gap-2 hover:scale-105">
            <img 
              src="/user 1.svg" 
              alt="icono-usuario" 
              className="h-6 w-6"
            />
            <span className="font-medium">Iniciar sesión</span>
          </Link>
        )}
      </div>
    </nav>

    {/* Sidebar del carrito */}
    <VistaIndexCarrito 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)} 
    />
  </>
  )
}

export default Navbar