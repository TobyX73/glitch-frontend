import ProductList from "../../components/ProductList"
import VerMasButton from "../../components/VerMasButton"
import Carousel from "../../components/Carousel"

function VistaHome() {

  return (
    <div className="w-full">
      {/* Carousel que ocupa casi toda la pantalla */}
      <Carousel />
      
      {/* Contenido principal después del carousel */}
      <main className="flex items-center flex-col p-8">
        <h1 className="text-3xl font-bold mb-4">Productos Destacados</h1>
        <ProductList/>
        <VerMasButton/>
      </main>
    </div>
  )
}

export { VistaHome }