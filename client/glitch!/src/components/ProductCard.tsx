interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  stock: number;
}

const ProductCard = ({ title, price, image, stock }: ProductCardProps) => {
    return (
        <article className="bg-blue-300 rounded-3xl flex flex-col items-center p-4 w-full max-w-sm mx-auto">
            <img 
                src={image} 
                alt={title} 
                className="w-48 h-48 object-cover mb-4 rounded-lg" 
            />
            <h3 className="text-lg font-bold text-center">{title}</h3>
            <p className="text-xl font-semibold">{price}</p>
            <p className="text-sm">Stock: {stock}</p>
        </article>
    )
}

export default ProductCard;