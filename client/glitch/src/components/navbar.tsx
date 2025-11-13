import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import VistaIndexCarrito from "../containers/VistaCarrito/VistaIndexCarrito"

function Navbar(){
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isCartOpen, setIsCartOpen] = useState(false);

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
          to="/clientes" 
          className="transition-transform duration-300 hover:text-white font- hover:scale-105">
          Contáctanos
        </Link>
        <Link 
          to="/nosotros" 
          className="transition-transform duration-300 hover:text-white font- hover:scale-105">
          Nosotros
        </Link>
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