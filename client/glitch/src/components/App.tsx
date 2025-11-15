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
            {/* TODO: Agregar rutas para productos, usuarios, órdenes */}
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
