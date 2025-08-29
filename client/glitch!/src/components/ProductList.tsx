import ProductCard from "./ProductCard"
import RemerasPruebas from '../../public/Remeras/RemerasPrueba.json'

const ProductList = () => {
    return (
        <section className="min-hv-screen bg-gray-100 p-6 flex justify-center">
            <div className="max-w-6xl w-full">
                <h2 className="text-3xl text-center mb-8">Catálogo de facha 🤠</h2>
                <div className="grid grid-cols-4 gap-8">
                 {RemerasPruebas.map((item) => (  
                    <ProductCard 
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