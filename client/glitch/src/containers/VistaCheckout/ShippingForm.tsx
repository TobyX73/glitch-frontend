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
  const { items } = useCart();
  const [formData, setFormData] = useState<ShippingFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    zipCode: '',
    shippingType: 'home'
  });

  const [shippingCost, setShippingCost] = useState<{
    cost: number;
    estimatedDays: string;
    carrier: string;
  } | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCalculateShipping = async () => {
    if (!formData.zipCode || formData.zipCode.length < 4) {
      setShippingError('Ingresá un código postal válido');
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

      const result = await deliveryAPI.calculateShipping({
        zipCode: formData.zipCode,
        items: cartItems
      });

      setShippingCost(result);
    } catch (err: any) {
      console.error('Error al calcular envío:', err);
      setShippingError(err.response?.data?.message || 'No se pudo calcular el envío. Intentá de nuevo.');
    } finally {
      setCalculatingShipping(false);
    }
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
          
          {/* Resultado del cálculo */}
          {shippingCost && (
            <div className="p-3 bg-azul-oscuro border border-verde rounded">
              <p className="text-verde font-semibold">${shippingCost.cost.toLocaleString('es-AR')}</p>
              <p className="text-gray-300 text-sm">{shippingCost.carrier}</p>
              <p className="text-gray-400 text-xs">{shippingCost.estimatedDays}</p>
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
