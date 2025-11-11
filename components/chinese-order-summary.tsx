"use client"

import type { BudgetItem } from "@/types"
import { shareViaWhatsAppChinese } from "@/lib/export"

interface ChineseOrderSummaryProps {
  items: BudgetItem[]
  onReset: () => void
}

export default function ChineseOrderSummary({ items, onReset }: ChineseOrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const handleShareWhatsApp = () => {
    shareViaWhatsAppChinese(items, total)
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <h2 className="text-xl font-bold" style={{ color: "#E47C00" }}>
        Resumen de Pedido
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Producto</th>
              <th className="px-4 py-2 text-center font-semibold text-foreground">Cantidad</th>
              <th className="px-4 py-2 text-right font-semibold text-foreground">Precio Unit.</th>
              <th className="px-4 py-2 text-right font-semibold text-foreground">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50">
                <td className="px-4 py-2 font-medium text-foreground">{item.name}</td>
                <td className="px-4 py-2 text-center text-foreground">{item.quantity}</td>
                <td className="px-4 py-2 text-right font-mono text-foreground">${item.unitPrice.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold text-foreground">
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="border-l-4 p-4 flex justify-between items-center"
        style={{ borderColor: "#E47C00", backgroundColor: "rgba(228, 124, 0, 0.1)" }}
      >
        <span className="font-semibold text-foreground">Total:</span>
        <span className="text-2xl font-bold font-mono" style={{ color: "#E47C00" }}>
          ${total.toLocaleString()}
        </span>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleShareWhatsApp}
          className="w-full px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "#E47C00",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
        >
          📱 Enviar pedido por WhatsApp
        </button>

        <button
          onClick={onReset}
          className="w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          style={{ backgroundColor: "#3a3a3a", color: "#f0f0f0" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a4a4a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3a3a3a")}
        >
          Limpiar pedido
        </button>
      </div>
    </div>
  )
}
