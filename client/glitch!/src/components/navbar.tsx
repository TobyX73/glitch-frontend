import { Link } from "react-router-dom"

function Navbar(){
  return (
    <nav className="flex bg-blue-800 p-4 text-white justify-between items-center">
  
        <div className="flex gap-4">
          <div>
            <Link to="/registro" className="hover:text-blue-200 transition-colors">Registrarse</Link>
          </div>
          <div>
            <Link to="/login" className="hover:text-blue-200 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
    
        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-200 transition-colors">Glitch</Link>
          <Link to="/productos" className="hover:text-blue-200 transition-colors">Productos</Link>
          <Link to="/clientes" className="hover:text-blue-200 transition-colors">Clientes</Link>
          <Link to="/contacto" className="hover:text-blue-200 transition-colors">Contacto</Link>
        </div>
      
        <div className="flex">
          <Link to="/carrito" className="hover:text-blue-200 transition-colors">Carrito</Link>
        </div>
    </nav>
  )
}

export default Navbar