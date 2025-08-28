import ProductCard from "../../components/ProductCard"

function VistaHome() {
  return (
    <main className="flex items-center flex-col p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Glitch!</h1>
      <ProductCard
        title="Remera Roja"
        price="$20.000,00"
        image="https://picsum.photos/id/237/200/200"
        stock={10}
      />
    </main>
  )
}

export { VistaHome }