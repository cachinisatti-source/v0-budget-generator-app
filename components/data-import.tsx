"use client"

import { useState, useRef } from "react"
import type { Product } from "@/types"

interface DataImportProps {
  onDataImport: (data: Product[]) => void
}

export default function DataImport({ onDataImport }: DataImportProps) {
  const [textData, setTextData] = useState("")
  const [error, setError] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleProcess = () => {
    try {
      setError("")
      const data = parseTabSeparatedData(textData)
      if (data.length === 0) {
        setError("No se encontraron productos en los datos")
        return
      }
      onDataImport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar datos")
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Pega el contenido de tu Excel o Google Sheets
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Copia la tabla (con encabezados) y pégala aquí. Debe incluir: desart, familia, nsubf, pventa_1, pventa_2,
          pventa_3, pventa_4
        </p>
      </div>

      <textarea
        ref={textareaRef}
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
        placeholder="Pega aquí los datos tabulados..."
        className="w-full h-40 p-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
      />

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleProcess}
        className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
      >
        Procesar datos
      </button>
    </div>
  )
}
