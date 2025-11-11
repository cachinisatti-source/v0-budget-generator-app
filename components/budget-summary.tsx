"use client"

import type { BudgetItem } from "@/types"
import { generatePDF, generateExcel, shareViaWhatsApp } from "@/lib/export"

interface BudgetSummaryProps {
  items: BudgetItem[]
  mode: "normal" | "chinos"
  onReset: () => void
}

export default function BudgetSummary({ items, mode, onReset }: BudgetSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const handleExportPDF = () => {
    generatePDF(items, total, mode)
  }

  const handleExportExcel = () => {
    generateExcel(items, total, mode)
  }

  const handleShareWhatsApp = () => {
    shareViaWhatsApp(items, total, mode)
  }

  return (
    <div
      className="bg-card rounded-lg border border-border p-6 space-y-6"
      style={{ backgroundColor: "#2a2a2a", borderColor: "#3a3a3a" }}
    >
      <h2 className="text-xl font-bold" style={{ color: "#E47C00" }}>
        Resumen de Presupuesto
      </h2>

      {/* Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead
            className="bg-muted border-b border-border"
            style={{ backgroundColor: "#3a3a3a", borderColor: "#4a4a4a" }}
          >
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Producto</th>
              <th className="px-4 py-2 text-center font-semibold text-foreground">Cantidad</th>
              <th className="px-4 py-2 text-right font-semibold text-foreground">Precio Unit.</th>
              <th className="px-4 py-2 text-right font-semibold text-foreground">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border" style={{ borderColor: "#3a3a3a" }}>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50" style={{ borderColor: "#3a3a3a" }}>
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

      {/* Total */}
      <div
        className="border-l-4 p-4 flex justify-between items-center"
        style={{ borderColor: "#E47C00", backgroundColor: "rgba(228, 124, 0, 0.1)" }}
      >
        <span className="font-semibold text-foreground">Total General:</span>
        <span className="text-2xl font-bold font-mono" style={{ color: "#E47C00" }}>
          ${total.toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={handleExportPDF}
          className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "#E47C00",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
        >
          Exportar PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "#E47C00",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
        >
          Exportar Excel
        </button>
        <button
          onClick={handleShareWhatsApp}
          className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "#E47C00",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
        >
          {mode === "chinos" ? "Enviar a cliente chino" : "Enviar por WhatsApp"}
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        style={{ backgroundColor: "#3a3a3a", color: "#f0f0f0" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a4a4a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3a3a3a")}
      >
        Limpiar presupuesto
      </button>
    </div>
  )
}
