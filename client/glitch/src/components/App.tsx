import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./Footer"
import VistaIndexProducto from "../containers/VistaProducto/VistaIndexProducto"
import { VistaHome } from "../containers/VistaHome/VistaIndexHome"
import { VistaCarrito } from "../containers/VistaCarrito/VistaIndexCarrito"
import VistaIndexClientes from "../containers/VistaClientes/VistaIndexClientes"
import VistaProductoParticular from "../containers/VistaProductoParticular/VistaProductoParticular"
import { CartProvider } from "../context/CartContext"

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<VistaHome />} />
              <Route path="/productos" element={<VistaIndexProducto />} />
              <Route path="/carrito" element={<VistaCarrito />} />
              <Route path="/clientes" element={<VistaIndexClientes />} />
              <Route path="/producto/:id" element={<VistaProductoParticular />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
