import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

function Navbar(){
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="flex bg-blue-800 p-4 text-white justify-between items-center">
  
        <div className="flex gap-4">
          <div>
            <Link to="/registro" className="hover:text-blue-200 transition-colors">
      
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-plus-icon lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </Link>
          </div>
          <div>
            <Link to="/login" className="hover:text-blue-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
    
        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-200 transition-colors">Glitch</Link>
          <Link to="/productos" className="hover:text-blue-200 transition-colors">Productos</Link>
          <Link to="/clientes" className="hover:text-blue-200 transition-colors">Clientes</Link>
          <Link to="/contacto" className="hover:text-blue-200 transition-colors">Contacto</Link>
        </div>
      
        <div className="flex">
          <Link to="/carrito" className="hover:text-blue-200 transition-colors flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {totalItems > 0 && <span>({totalItems})</span>}
          </Link>
        </div>
    </nav>
  )
}

export default Navbar