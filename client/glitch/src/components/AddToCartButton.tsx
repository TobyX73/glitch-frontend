interface AddToCartButtonProps {
  isValid: boolean;
  isSubmitting: boolean;
  stock: number;
}

export function AddToCartButton({ isValid, isSubmitting, stock }: AddToCartButtonProps) {
  const getButtonText = () => {
    if (isSubmitting) return 'AGREGANDO...';
    if (stock === 0) return 'SIN STOCK';
    if (!isValid) return 'AGREGAR AL CARRITO';
    return 'AGREGAR AL CARRITO';
  };

  const getButtonStyles = () => {
     if (stock === 0) 
        return 'bg-red-500 text-white cursor-not-allowed';
     if (!isValid || isSubmitting) 
        return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    return 'bg-blue-500 text-white hover:bg-blue-600';
  };

  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting || stock === 0}
      className={`w-full py-4 px-6 rounded-lg font-bold text-sm transition-colors ${getButtonStyles()}`}
    >
      {getButtonText()}
    </button>
  );
}

export default AddToCartButton;
