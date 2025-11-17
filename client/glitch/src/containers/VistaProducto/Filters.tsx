import CheckboxCyberpunk from "./CheckboxCyberpunk";
import type { Category } from "../../types/product.types";

interface FiltersProps {
  selectedColors: string[];
  selectedCortes: string[];
  selectedCategorias: string[];
  onToggleFilter: (filterType: "color" | "corte" | "categoria", value: string) => void;
  categories: Category[];
}

const Filters = ({
  selectedColors,
  selectedCortes,
  selectedCategorias,
  onToggleFilter,
  categories,
}: FiltersProps) => {
  return (
    <aside className="space-y-6">
      {/* Filtro: Colores */}
      <div className="p-4 border-2 border-verde">
        <h3 className="text-verde font-semibold mb-3 text-lg">Colores</h3>
        <div className="space-y-3">
          {["Negra", "Blanca"].map((color) => (
            <CheckboxCyberpunk
              key={color}
              label={color}
              checked={selectedColors.includes(color)}
              onChange={() => onToggleFilter("color", color)}
            />
          ))}
        </div>
      </div>

      {/* Filtro: Corte de remera */}
      <div className="p-4 border-2 border-verde">
        <h3 className="text-verde font-semibold mb-3 text-lg">Corte de remera</h3>
        <div className="space-y-3">
          {["Clásica", "Oversize"].map((corte) => (
            <CheckboxCyberpunk
              key={corte}
              label={corte}
              checked={selectedCortes.includes(corte)}
              onChange={() => onToggleFilter("corte", corte)}
            />
          ))}
        </div>
      </div>

      {/* Filtro: Categorías */}
      <div className="p-4 border-2 border-verde">
        <h3 className="text-verde font-semibold mb-3 text-lg">Categorías</h3>
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((categoria) => (
              <CheckboxCyberpunk
                key={categoria.id}
                label={categoria.name}
                checked={selectedCategorias.includes(categoria.name)}
                onChange={() => onToggleFilter("categoria", categoria.name)}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm">No hay categorías disponibles</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Filters;
