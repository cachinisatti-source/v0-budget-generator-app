"use client"

import { useState } from "react"
import type { Product } from "@/types"

interface SettingsModalProps {
  onClose: () => void
  onSave: (data: Product[]) => void
}

export default function SettingsModal({ onClose, onSave }: SettingsModalProps) {
  const [textData, setTextData] = useState("")
  const [error, setError] = useState("")

  const parseTabSeparatedData = (text: string): Product[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) {
      throw new Error("Se requieren al menos 2 líneas (encabezado + datos)")
    }

    const headers = lines[0].split("\t")
    const requiredHeaders = ["desart", "familia", "nsubf", "pventa_1", "pventa_2", "pventa_3", "pventa_4"]

    const headerIndices: { [key: string]: number } = {}
    for (const header of requiredHeaders) {
      const index = headers.indexOf(header)
      if (index === -1) {
        throw new Error(`Columna requerida no encontrada: ${header}`)
      }
      headerIndices[header] = index
    }

    const products: Product[] = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue

      const columns = lines[i].split("\t")
      products.push({
        id: `${i}`,
        desart: columns[headerIndices["desart"]]?.trim() || "",
        familia: columns[headerIndices["familia"]]?.trim() || "",
        nsubf: columns[headerIndices["nsubf"]]?.trim() || "",
        pventa_1: Number(columns[headerIndices["pventa_1"]]?.trim() || 0),
        pventa_2: Number(columns[headerIndices["pventa_2"]]?.trim() || 0),
        pventa_3: Number(columns[headerIndices["pventa_3"]]?.trim() || 0),
        pventa_4: Number(columns[headerIndices["pventa_4"]]?.trim() || 0),
      })
    }

    return products
  }

  const handleSave = () => {
    try {
      setError("")
      const data = parseTabSeparatedData(textData)
      if (data.length === 0) {
        setError("No se encontraron productos en los datos")
        return
      }
      localStorage.setItem("listadoProductos", JSON.stringify(data))
      onSave(data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar datos")
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "#E47C00" }}>
              ⚙️ Ajustes
            </h2>
            <button onClick={onClose} className="text-2xl leading-none" style={{ color: "#b0b0b0" }}>
              ✕
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Actualizar listado de productos</label>
            <p className="text-sm mb-3" style={{ color: "#b0b0b0" }}>
              Pega el contenido de tu Excel o Google Sheets. Debe incluir: desart, familia, nsubf, pventa_1, pventa_2,
              pventa_3, pventa_4
            </p>
          </div>

          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            placeholder="Pega aquí los datos tabulados..."
            className="w-full h-48 p-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            style={{
              backgroundColor: "#1e1e1e",
              borderColor: "#3a3a3a",
              color: "#f0f0f0",
            }}
          />

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: "#E47C00" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
            >
              Guardar listado
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: "#3a3a3a", color: "#f0f0f0" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a4a4a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3a3a3a")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
