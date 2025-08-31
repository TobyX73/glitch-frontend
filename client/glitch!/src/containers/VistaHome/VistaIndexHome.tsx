import ProductList from "../../components/ProductList"
import VerMasButton from "../../components/VerMasButton"

function VistaHome() {

  return (
    <main className="flex items-center flex-col p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Glitch!</h1>
      <ProductList/>
      <VerMasButton/>
    </main>
  )
}

export { VistaHome }