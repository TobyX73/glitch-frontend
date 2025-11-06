import ProductCard from "./ProductCard"
import RemerasPruebas from '../../public/Remeras/RemerasPrueba.json'

const ProductList = () => {
const displayedCount = 4
//Con esta linea declaro que solo va a mostrar hasta 12 objetos.
const visibleProducts = RemerasPruebas.slice(0, displayedCount);

    return (
        <section className="}p-6 flex justify-center">
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                 {visibleProducts.map((item) => (  
                    <ProductCard 
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        image={item.image}
                        stock={item.stock}
                    />
                 ))}  
                </div>
            </div>
        </section>
    )
}

export default ProductList;