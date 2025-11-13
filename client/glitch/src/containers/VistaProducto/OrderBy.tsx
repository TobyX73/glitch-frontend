import { useState, useRef, useEffect } from "react";

type SortOption = "newest-oldest" | "oldest-newest" | "price-low-high" | "price-high-low";

interface OrderByProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  "newest-oldest": "Más reciente → Último",
  "oldest-newest": "Último → Más reciente",
  "price-low-high": "Más barato → Más caro",
  "price-high-low": "Más caro → Más barato"
};

const OrderBy = ({ sortBy, onSortChange }: OrderByProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-2 border-verde text-white px-4 py-3 flex items-center justify-between hover:bg-opacity-80 transition-all duration-200"
      >
        <div className="flex flex-col items-start">
          <span className="text-verde text-xs font-semibold uppercase tracking-wide">
            Ordenar por
          </span>
          <span className="text-white text-base font-medium mt-1">
            {sortLabels[sortBy]}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-verde transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-azul-oscuro border border-verde rounded-lg shadow-lg overflow-hidden">
          {(Object.entries(sortLabels) as [SortOption, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`w-full px-4 py-3 text-left hover:bg-verde hover:text-gris transition-colors duration-200 ${
                sortBy === value
                  ? "bg-verde text-gris font-semibold"
                  : "text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderBy;
