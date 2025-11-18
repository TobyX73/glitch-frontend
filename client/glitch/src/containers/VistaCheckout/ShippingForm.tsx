import { useState } from 'react';
import { deliveryAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

interface ShippingFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  zipCode: string;
  shippingType: 'home' | 'branch';
  branch?: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
}

const ShippingForm = ({ onSubmit }: ShippingFormProps) => {
  const { items, state, setShipping } = useCart();
  const [formData, setFormData] = useState<ShippingFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    zipCode: state.shippingInfo?.postalCode || '',
    shippingType: 'home'
  });

  const [shippingOptions, setShippingOptions] = useState<{
    domicilio?: { price: number; days: number };
    sucursal?: { price: number; days: number };
  } | null>(null);
  const [selectedShippingType, setSelectedShippingType] = useState<'domicilio' | 'sucursal'>(
    state.shippingInfo?.type || 'domicilio'
  );
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCalculateShipping = async () => {
    if (!formData.zipCode || formData.zipCode.length !== 4 || !/^\d{4}$/.test(formData.zipCode)) {
      setShippingError('Ingresá un código postal válido (4 dígitos)');
      return;
    }

    if (items.length === 0) {
      setShippingError('El carrito está vacío');
      return;
    }

    try {
      setCalculatingShipping(true);
      setShippingError(null);
      
      const cartItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const result = await deliveryAPI.calculateShippingWithOptions({
        postalCode: formData.zipCode,
        items: cartItems
      });

      setShippingOptions(result);
      
      // Si ya hay una opción guardada, mantenerla, sino usar domicilio por defecto
      if (!state.shippingInfo && result.domicilio) {
        handleSelectShipping('domicilio', result.domicilio);
      }
    } catch (err: any) {
      console.error('Error al calcular envío:', err);
      setShippingError(err.response?.data?.message || 'No se pudo calcular el envío. Intentá de nuevo.');
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleSelectShipping = (type: 'domicilio' | 'sucursal', option: { price: number; days: number }) => {
    setSelectedShippingType(type);
    setShipping({
      type,
      cost: option.price,
      estimatedDays: option.days,
      postalCode: formData.zipCode
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Envio</h2>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
        />
      </div>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
          />
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            required
            className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
          />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección"
          required
          className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
        />
      </div>

      {/* Apartamento/Suite (opcional) */}
      <div>
        <input
          type="text"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          placeholder="Apartamento, suite, etc (opcional)"
          className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
        />
      </div>

      {/* Ciudad y Código Postal */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad"
            required
            className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
          />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Código Postal"
              required
              className="flex-1 px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500"
            />
            <button
              type="button"
              onClick={handleCalculateShipping}
              disabled={calculatingShipping}
              className="px-4 py-3 bg-verde text-gris font-semibold rounded hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {calculatingShipping ? 'Calculando...' : 'Calcular'}
            </button>
          </div>
          
          {/* Resultados de opciones de envío */}
          {shippingOptions && (
            <div className="space-y-2">
              {/* Opción Domicilio */}
              {shippingOptions.domicilio && (
                <div 
                  className={`p-3 border cursor-pointer transition-all ${ 
                    selectedShippingType === 'domicilio'
                      ? 'bg-azul-oscuro border-verde' 
                      : 'bg-gris border-gray-600 hover:border-verde'
                  }`}
                  onClick={() => handleSelectShipping('domicilio', shippingOptions.domicilio!)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Envío a domicilio</p>
                      <p className="text-gray-400 text-xs">{shippingOptions.domicilio.days} días hábiles</p>
                    </div>
                    <p className="text-verde font-bold">${shippingOptions.domicilio.price.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              )}

              {/* Opción Sucursal */}
              {shippingOptions.sucursal && (
                <div 
                  className={`p-3 border cursor-pointer transition-all ${
                    selectedShippingType === 'sucursal'
                      ? 'bg-azul-oscuro border-verde' 
                      : 'bg-gris border-gray-600 hover:border-verde'
                  }`}
                  onClick={() => handleSelectShipping('sucursal', shippingOptions.sucursal!)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Retiro en sucursal</p>
                      <p className="text-gray-400 text-xs">{shippingOptions.sucursal.days} días hábiles</p>
                    </div>
                    <p className="text-verde font-bold">${shippingOptions.sucursal.price.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Error */}
          {shippingError && (
            <p className="text-red-500 text-sm">{shippingError}</p>
          )}
        </div>
      </div>

      {/* Tipo de Envío */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Tipo de envío</h3>
        
        <div className="space-y-3">
          {/* A Domicilio */}
          <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-600 rounded hover:border-verde transition-colors">
            <input
              type="radio"
              name="shippingType"
              value="home"
              checked={formData.shippingType === 'home'}
              onChange={handleChange}
              className="w-5 h-5 accent-verde cursor-pointer"
            />
            <span className="text-white font-medium">Envío a domicilio</span>
          </label>

          {/* A Sucursal */}
          <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-600 rounded hover:border-verde transition-colors">
            <input
              type="radio"
              name="shippingType"
              value="branch"
              checked={formData.shippingType === 'branch'}
              onChange={handleChange}
              className="w-5 h-5 accent-verde cursor-pointer"
            />
            <span className="text-white font-medium">Retiro en sucursal</span>
          </label>
        </div>

        {/* Selector de Sucursal (si aplica) */}
        {formData.shippingType === 'branch' && (
          <div className="mt-4">
            <select
              name="branch"
              value={formData.branch || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde cursor-pointer"
            >
              <option value="">Selecciona una sucursal</option>
              <option value="sucursal-1">Sucursal Centro - Av. Corrientes 1234</option>
              <option value="sucursal-2">Sucursal Norte - Av. Cabildo 5678</option>
              <option value="sucursal-3">Sucursal Sur - Av. Rivadavia 9012</option>
            </select>
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center gap-4">
        <a
          href="/productos"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a la tienda
        </a>

        <button
          type="submit"
          className="flex-1 w-10 h-16 py-3 bg-gris border-2 border-verde text-verde font-semibold hover:bg-verde hover:text-gris transition-all cursor-pointer"
        >
          <h1> Continuar al pago </h1> 
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;
