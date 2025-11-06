import { Link } from "react-router-dom"

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  stock: number;
}

const ProductCard = ({ id, title, price, image }: ProductCardProps) => {
    return (
        <Link to={`/producto/${id}`}>
            <article className="flex flex-col items-center w-72 max-w-sm mx-auto cursor-pointer gap-6">
                <div 
                    className="relative w-full aspect-square rounded-2xl overflow-hidden"
                    style={{
                        backgroundImage: `url('/patron-fondo-glitch.svg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#6B7280'
                    }}
                >
                    <img 
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-110" 
                        src={image} 
                        alt={title} 
                    />
                </div>

                <div className="w-full text-white">
                    <p className="text-base font-semibold text-left mb-1">{title}</p>
                    <p className="">{price}</p>
                </div>
            </article>
        </Link>
    )
}

export default ProductCard;