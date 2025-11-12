interface AddToCartButtonProps {
  isValid: boolean;
  isSubmitting: boolean;
  stock: number;
}

export function AddToCartButton({ isValid, isSubmitting, stock }: AddToCartButtonProps) {
  const getButtonText = () => {
    if (isSubmitting) return 'AGREGANDO...';
    if (stock === 0) return 'SIN STOCK';
    return 'Agregar al carrito';
  };

  const getButtonStyles = () => {
     if (stock === 0) 
        return 'bg-red-500 text-white cursor-not-allowed';
     if (!isValid || isSubmitting) 
        return 'bg-gray-600 text-gray-400 cursor-not-allowed';
    return 'bg-gris text-verde border-2 border-verde hover:bg-verde hover:text-gris cursor-pointer';
  };

  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting || stock === 0}
      className={`w-80 h-12 px-6 mt-5 font-bold text-lg transition-all duration-300 italic ${getButtonStyles()}`}
    >
      <h1>{getButtonText()}</h1>
    </button>
  );
}

export default AddToCartButton;
