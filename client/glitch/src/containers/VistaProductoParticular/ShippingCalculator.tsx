import { useState } from 'react';
import { deliveryAPI } from '../../services/api';

interface ShippingCalculatorProps {
  productId: number;
}

interface ShippingOption {
  type: 'domicilio' | 'sucursal';
  price: number;
  days: number;
}

interface Branch {
  nombre: string;
  direccion: string;
  localidad: string;
}

const ShippingCalculator = ({ productId }: ShippingCalculatorProps) => {
  const [postalCode, setPostalCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<{
    domicilio?: ShippingOption;
    sucursal?: ShippingOption;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<'domicilio' | 'sucursal' | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!postalCode || postalCode.length !== 4 || !/^\d{4}$/.test(postalCode)) {
      setError('Ingresá un código postal válido (4 dígitos)');
      return;
    }

    try {
      setCalculating(true);
      setError(null);
      setShippingOptions(null);
      setSelectedOption(null);
      setBranches([]);
      
      const payload = {
        postalCode: postalCode,
        items: [{ productId, quantity: 1 }]
      };
      
      console.log('🔥 COMPONENTE - Enviando:', payload);
      
      const result = await deliveryAPI.calculateShippingWithOptions(payload);

      setShippingOptions(result);
    } catch (err: any) {
      console.error('Error al calcular envío:', err);
      setError(err.response?.data?.message || 'No se pudo calcular el envío');
    } finally {
      setCalculating(false);
    }
  };

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      
      // Mapear código postal a provincia
      const provincia = mapPostalCodeToProvince(postalCode);
      
      const result = await deliveryAPI.getBranches(provincia);
      // Mapear respuesta del API al tipo local `Branch` (nombre, direccion, localidad)
      const mapped = result.map((b: any) => ({
        nombre: b.nombre || b.name || '',
        direccion: b.direccion || b.address || '',
        localidad: b.localidad || b.provincia || ''
      }));
      setBranches(mapped);
    } catch (err) {
      console.error('Error cargando sucursales:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  // Mapeo simple de códigos postales a provincias argentinas
  const mapPostalCodeToProvince = (cp: string): string => {
    const code = parseInt(cp);
    
    // Mapeo de rangos de CP a provincias
    if (code >= 1000 && code <= 1999) return 'Buenos Aires';
    if (code >= 2000 && code <= 2999) return 'Buenos Aires';
    if (code >= 3000 && code <= 3999) return 'Entre Ríos';
    if (code >= 4000 && code <= 4999) return 'Jujuy';
    if (code >= 5000 && code <= 5999) return 'Córdoba';
    if (code >= 6000 && code <= 6999) return 'Buenos Aires';
    if (code >= 7000 && code <= 7999) return 'Buenos Aires';
    if (code >= 8000 && code <= 8999) return 'Buenos Aires';
    
    return 'Buenos Aires'; // Default
  };

  return (
    <div className="mt-6">
      <label className="block text-white font-semibold mb-3">
        Calcular costo de envío
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Código postal"
          className="flex-1 px-4 py-3  border border-gray-600 text-white placeholder-gray-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCalculate}
          disabled={calculating}
          className="px-6 py-3 bg-gris text-white border-gray-600 border-2 font-semibold mr- hover:bg-verde hover:text-gris transition-all duration-300 italic cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <h1>{calculating ? 'Calculando...' : 'Calcular'}</h1>
        </button>
      </div>
      
      {/* Resultados */}
      {shippingOptions && (
        <div className="mt-3 space-y-2">
          {/* Opción Domicilio */}
          {shippingOptions.domicilio && (
            <div 
              className={`p-4 border cursor-pointer transition-all ${
                selectedOption === 'domicilio' 
                  ? 'bg-azul-oscuro border-verde' 
                  : 'bg-gris border-gray-600 hover:border-verde'
              }`}
              onClick={() => setSelectedOption('domicilio')}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">Envío a domicilio</p>
                  <p className="text-gray-400 text-xs">{shippingOptions.domicilio.days} días hábiles</p>
                </div>
                <p className="text-verde font-bold text-lg">${shippingOptions.domicilio.price.toLocaleString('es-AR')}</p>
              </div>
            </div>
          )}

          {/* Opción Sucursal */}
          {shippingOptions.sucursal && (
            <div>
              <div 
                className={`p-4 border cursor-pointer transition-all ${
                  selectedOption === 'sucursal' 
                    ? 'bg-azul-oscuro border-verde' 
                    : 'bg-gris border-gray-600 hover:border-verde'
                }`}
                onClick={() => {
                  setSelectedOption('sucursal');
                  if (!branches.length) loadBranches();
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">Retiro en sucursal</p>
                    <p className="text-gray-400 text-xs">{shippingOptions.sucursal.days} días hábiles</p>
                  </div>
                  <p className="text-verde font-bold text-lg">${shippingOptions.sucursal.price.toLocaleString('es-AR')}</p>
                </div>
              </div>

              {/* Lista de sucursales */}
              {selectedOption === 'sucursal' && (
                <div className="mt-2 p-3 bg-gris border border-gray-600">
                  {loadingBranches ? (
                    <p className="text-gray-400 text-sm">Buscando sucursales cercanas...</p>
                  ) : branches.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-white text-sm font-semibold mb-2">Sucursales cercanas:</p>
                      {branches.slice(0, 3).map((branch, idx) => (
                        <div key={idx} className="text-xs text-gray-300 border-l-2 border-verde pl-2">
                          <p className="font-semibold">{branch.nombre}</p>
                          <p>{branch.direccion}</p>
                          <p className="text-gray-500">{branch.localidad}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No se encontraron sucursales cercanas</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Error */}
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default ShippingCalculator;
