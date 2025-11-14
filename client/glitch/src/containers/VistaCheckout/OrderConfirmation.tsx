interface OrderConfirmationProps {
  orderNumber?: string;
}

const OrderConfirmation = ({ orderNumber = '12345' }: OrderConfirmationProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center py-12 max-w-2xl mx-auto">
        {/* Ícono de éxito */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-verde rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gris"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Mensaje principal */}
        <h2 className="text-3xl font-bold text-white mb-4">
          ¡Tu pedido está en etapa de confirmación!
        </h2>
        
        <p className="text-gray-400 text-lg mb-6">
          Orden #{orderNumber}
        </p>

        {/* Información adicional */}
        <div className="max-w-md mx-auto space-y-4">

          <div className="p-6 bg-azul-oscuro rounded border border-gray-700">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-verde"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Próximos pasos
            </h3>
            <p className="text-gray-400 text-sm">
              En breve nos contactaremos contigo para coordinar los detalles del envío y confirmar tu pedido.
            </p>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="mt-8 space-y-3">
          <a
            href="/productos"
            className="inline-block w-full max-w-sm px-6 py-3 bg-gris border-2 border-verde text-verde font-semibold rounded hover:bg-verde hover:text-gris transition-all cursor-pointer"
          >
            Seguir comprando
          </a>
          <a
            href="/"
            className="inline-block w-full max-w-sm px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
