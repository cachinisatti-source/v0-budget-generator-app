"use client"

interface PriceListSelectorProps {
  selectedList: 1 | 2 | 3 | 4
  onListChange: (list: 1 | 2 | 3 | 4) => void
}

export default function PriceListSelector({ selectedList, onListChange }: PriceListSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Lista de precios</label>
      <select
        value={selectedList}
        onChange={(e) => onListChange(Number(e.target.value) as 1 | 2 | 3 | 4)}
        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        style={{
          backgroundColor: "#1e1e1e",
          borderColor: "#3a3a3a",
          color: "#f0f0f0",
        }}
      >
        <option value={1}>Lista 1</option>
        <option value={2}>Lista 2</option>
        <option value={3}>Lista 3</option>
        <option value={4}>Lista 4</option>
      </select>
    </div>
  )
}
