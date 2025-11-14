interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  const steps = [
    { number: 1, label: 'Envio' },
    { number: 2, label: 'Pago' },
    { number: 3, label: 'Revision' }
  ];

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Paso */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 border-2 transition-colors ${
                currentStep >= step.number
                  ? 'border-verde bg-verde text-gris'
                  : 'border-gray-600 bg-gris text-gray-400'
              }`}
            >
              <span className="font-semibold">{step.number}</span>
            </div>
            <span
              className={`ml-3 font-medium ${
                currentStep >= step.number ? 'text-verde' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Línea conectora */}
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-verde' : 'bg-gray-600'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
