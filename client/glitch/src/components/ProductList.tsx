import ProductCard from "./ProductCard"
import RemerasPruebas from '../../public/Remeras/RemerasPrueba.json'

const ProductList = () => {
const displayedCount = 12
//Con esta linea declaro que solo va a mostrar hasta 12 objetos.
const visibleProducts = RemerasPruebas.slice(0, displayedCount);

    return (
        <section className="min-hv-screen p-6 flex justify-center">
            <div className="max-w-6xl w-full">
                <div className="grid grid-cols-4 gap-8 mb-8">
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