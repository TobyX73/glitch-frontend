import ProductList from "../../components/ProductList"

function VistaHome() {
  return (
    <main className="flex items-center flex-col p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Glitch!</h1>
      <ProductList/>
    </main>
  )
}

export { VistaHome }