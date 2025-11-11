import ProductList from "../../components/ProductList"
import VerMasButton from "../../components/VerMasButton"
import Carousel from "./Carousel"
import CarouselOutstanding from "./CarouselOutstanding"
import UserReview from "./UserReview"

function VistaHome() {

  return (
    <div className="w-full min-h-screen bg-gris">
      <Carousel />
      <main id="productos" className="flex items-center flex-col p-8 ">
        <h1 className="text-3xl font-bold mb-4 text-white">Stock</h1>
        <ProductList/>
        <VerMasButton/>
      </main>
      <CarouselOutstanding />
      <UserReview />
    </div>
  )
}

export { VistaHome }