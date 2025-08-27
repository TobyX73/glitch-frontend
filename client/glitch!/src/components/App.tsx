import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./navbar"
import { VistaIndexProducto } from "../containers/VistaProducto/VistaIndexProducto"
import { VistaHome } from "../containers/VistaHome/VistaHome"
import { VistaCarrito } from "../containers/VistaCarrito/VistaIndex"
import { VistaClientesIndex } from "../containers/VistaClientes/VistaClientesIndex"

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<VistaHome />} />
          <Route path="/productos" element={<VistaIndexProducto />} />
          <Route path="/carrito" element={<VistaCarrito />} />
          <Route path="/clientes" element={<VistaClientesIndex />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
