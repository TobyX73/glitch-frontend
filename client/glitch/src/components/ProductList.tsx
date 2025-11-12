import { motion } from "framer-motion";
import ProductCard from "./ProductCard"
import RemerasPruebas from '../../public/Remeras/RemerasPrueba.json'

const ProductList = () => {
const displayedCount = 4
//Con esta linea declaro que solo va a mostrar hasta 12 objetos.
const visibleProducts = RemerasPruebas.slice(0, displayedCount);

    return (
        <section className="p-6 flex justify-center">
            <div className="w-full">
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                 {visibleProducts.map((item) => (  
                    <motion.div
                        key={item.id}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { 
                                opacity: 1, 
                                y: 0,
                                transition: { duration: 0.5 }
                            }
                        }}
                    >
                        <ProductCard 
                            id={item.id}
                            title={item.title}
                            price={item.price}
                            image={item.image}
                            stock={item.stock}
                        />
                    </motion.div>
                 ))}  
                </motion.div>
            </div>
        </section>
    )
}

export default ProductList;