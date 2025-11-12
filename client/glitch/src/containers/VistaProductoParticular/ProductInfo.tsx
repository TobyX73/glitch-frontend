interface ProductInfoProps {
  title: string;
  price: string;
  description: string;
}

const ProductInfo = ({ title, price, description }: ProductInfoProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-white mb-4">
        {title}
      </h1>
      
      <div className="text-3xl font-bold text-verde mb-6">
        {price}
      </div>
      
      <div className="text-gray-400 leading-relaxed">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
