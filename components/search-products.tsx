"use client"

interface SearchProductsProps {
  searchTerm: string
  onSearch: (term: string) => void
}

export default function SearchProducts({ searchTerm, onSearch }: SearchProductsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Buscar producto</label>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 border border-border rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
      />
    </div>
  )
}
