"use client"

import type { BudgetItem } from "@/types"

interface StickyBudgetFooterProps {
  items: BudgetItem[]
  onViewSummary: () => void
}

export default function StickyBudgetFooter({ items, onViewSummary }: StickyBudgetFooterProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  if (items.length === 0) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-600 shadow-lg z-50">
      <div className="flex justify-between items-center p-3 gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-600">Total:</p>
          <p className="text-base font-bold text-orange-600 break-words">${total.toLocaleString()}</p>
        </div>
        <button
          onClick={onViewSummary}
          className="px-3 py-2 rounded-lg font-medium transition-colors text-white text-sm whitespace-nowrap flex-shrink-0"
          style={{ backgroundColor: "#E47C00" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
        >
          Ver Resumen
        </button>
      </div>
    </div>
  )
}
