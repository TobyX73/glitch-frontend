import CheckboxCyberpunk from "./CheckboxCyberpunk";

interface FiltersProps {
  selectedColors: string[];
  selectedCortes: string[];
  selectedCategorias: string[];
  onToggleFilter: (filterType: "color" | "corte" | "categoria", value: string) => void;
}

const Filters = ({
  selectedColors,
  selectedCortes,
  selectedCategorias,
  onToggleFilter,
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
          {["Remera", "Pantalón"].map((categoria) => (
            <CheckboxCyberpunk
              key={categoria}
              label={categoria}
              checked={selectedCategorias.includes(categoria)}
              onChange={() => onToggleFilter("categoria", categoria)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Filters;
