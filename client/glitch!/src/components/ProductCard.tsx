'use client'

type ProductCardProps = {
    title: string;
    price: string;
    image?: string;
    stock: number;
}

const ProductCard = ({ title, price, image, stock }: ProductCardProps) => {
    return (
        <div className="bg-blue-300 rounded-3xl flex flex-col items-center p-4 m-4 w-64">
            <div className="rounded-2xl">
                {image && <img src={image} alt={title} />}
            </div>
            <div className="flex p-4 flex-col items-center">
                <h1 className="text-xl font-bold">{title}</h1>
                <p>{price}</p>
                <p>Stock: {stock}</p>
            </div>
        </div>
    )
}

export default ProductCard;