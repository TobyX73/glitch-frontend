import { Link } from "react-router-dom"

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  stock: number;
}

const ProductCard = ({ id, title, price, image, stock }: ProductCardProps) => {
    return (
        <Link to={`/producto/${id}`} className="hover:scale-105 transition-transform duration-200">
            <article className="bg-blue-300 rounded-3xl flex flex-col items-center p-4 w-64 max-w-sm mx-auto cursor-pointer">
                <img 
                    className="w-48 h-48 object-cover mb-4 rounded-lg" 
                    src={image} 
                    alt={title} 
                />
                <h3 className="text-lg font-bold text-center">{title}</h3>
                <p className="text-xl font-semibold">{price}</p>
                <p className="text-sm">Stock: {stock}</p>
            </article>
        </Link>
    )
}

export default ProductCard;