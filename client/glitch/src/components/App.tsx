import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./Footer"
import VistaIndexProducto from "../containers/VistaProducto/VistaIndexProducto"
import { VistaHome } from "../containers/VistaHome/VistaIndexHome"
import VistaIndexClientes from "../containers/VistaClientes/VistaIndexClientes"
import VistaProductoParticular from "../containers/VistaProductoParticular/VistaProductoParticular"
import VistaIndexCheckout from "../containers/VistaCheckout/VistaIndexCheckout"
import VistaIndexContacto from "../containers/VistaContacto/VistaIndexContacto"
import VistaIndexNosotros from "../containers/VistaNosotros/VistaIndexNosotros"
import VistaIndexRegister from "../containers/VistaRegister/VistaIndexRegister"
import VistaIndexLogin from "../containers/VistaLogin/VistaIndexLogin"
import VistaIndexAdmin from "../containers/VistaAdmin/VistaIndexAdmin"
import AdminDashboard from "../containers/VistaAdmin/AdminDashboard"
import VistaProductosAdmin from "../containers/VistaAdmin/ProductosAdmin/VistaProductosAdmin"
import CrearProducto from "../containers/VistaAdmin/ProductosAdmin/CrearProducto"
import EditarProducto from "../containers/VistaAdmin/ProductosAdmin/EditarProducto"
import VerProducto from "../containers/VistaAdmin/ProductosAdmin/VerProducto"
import VistaUsuariosAdmin from "../containers/VistaAdmin/UsuariosAdmin/VistaUsuariosAdmin"
import VerUsuario from "../containers/VistaAdmin/UsuariosAdmin/VerUsuario"
import VistaOrdenesAdmin from "../containers/VistaAdmin/OrdenesAdmin/VistaOrdenesAdmin"
import VerOrden from "../containers/VistaAdmin/OrdenesAdmin/VerOrden"
import { CartProvider } from "../context/CartContext"

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Rutas públicas con Navbar y Footer */}
          <Route path="/" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaHome />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/productos" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaIndexProducto />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/clientes" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaIndexClientes />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/producto/:id" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaProductoParticular />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/checkout" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaIndexCheckout />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/contacto" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaIndexContacto />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/nosotros" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <VistaIndexNosotros />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/register" element={<VistaIndexRegister />} />
          <Route path="/login" element={<VistaIndexLogin />} />

          {/* Rutas de Admin sin Navbar ni Footer */}
          <Route path="/admin" element={<VistaIndexAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<VistaProductosAdmin />} />
            <Route path="productos/nuevo" element={<CrearProducto />} />
            <Route path="productos/:id" element={<VerProducto />} />
            <Route path="productos/editar/:id" element={<EditarProducto />} />
            <Route path="usuarios" element={<VistaUsuariosAdmin />} />
            <Route path="usuarios/:id" element={<VerUsuario />} />
            <Route path="ordenes" element={<VistaOrdenesAdmin />} />
            <Route path="ordenes/:id" element={<VerOrden />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
