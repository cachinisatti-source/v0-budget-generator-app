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
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <h2 className="text-xl font-bold text-orange-600">Resumen de Presupuesto</h2>

      {/* Summary Table */}
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

      {/* Total */}
      <div
        className="border-l-4 p-4 flex justify-between items-center"
        style={{ borderColor: "rgb(228, 124, 0)", backgroundColor: "rgba(228, 124, 0, 0.05)" }}
      >
        <span className="font-semibold text-foreground">Total General:</span>
        <span className="text-2xl font-bold font-mono" style={{ color: "rgb(228, 124, 0)" }}>
          ${total.toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={handleExportPDF}
          className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "rgb(228, 124, 0)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(201, 101, 0)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(228, 124, 0)")}
        >
          Exportar PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "rgb(228, 124, 0)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(201, 101, 0)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(228, 124, 0)")}
        >
          Exportar Excel
        </button>
        <button
          onClick={handleShareWhatsApp}
          className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
          style={{
            backgroundColor: "rgb(228, 124, 0)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(201, 101, 0)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(228, 124, 0)")}
        >
          {mode === "chinos" ? "Enviar a cliente chino" : "Enviar por WhatsApp"}
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors text-sm"
      >
        Limpiar presupuesto
      </button>
    </div>
  )
}
