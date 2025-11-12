"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/types"

interface DataImportProps {
  onDataImport: (data: Product[]) => void
}

export default function DataImport({ onDataImport }: DataImportProps) {
  const [textData, setTextData] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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

      const parsePrice = (value: string): number => {
        if (!value) return 0

        // Remove currency symbols, spaces, and other non-numeric characters (keep only digits, dots, and commas)
        let cleaned = value.replace(/[^\d.,-]/g, "").trim()

        if (!cleaned) return 0

        if (cleaned.includes(",")) {
          // Format: 5814,4 or 10.856,50
          // Remove dots (thousand separators) and replace comma with dot
          cleaned = cleaned.replace(/\./g, "").replace(",", ".")
        } else if (cleaned.includes(".")) {
          // Could be 10.856 (ten thousand) or 10.5 (ten point five)
          const parts = cleaned.split(".")
          const lastPart = parts[parts.length - 1]

          if (lastPart.length === 3) {
            // It's a thousand separator: 10.856 → 10856
            cleaned = cleaned.replace(/\./g, "")
          } else {
            // It's a decimal: 10.5 → 10.5
            // Remove dots from all but the last one (thousand separators)
            cleaned = parts.slice(0, -1).join("") + (parts.length > 1 ? "." + lastPart : "")
          }
        }

        const num = Number.parseFloat(cleaned)
        return isNaN(num) ? 0 : num
      }

      products.push({
        id: `${i}`,
        desart: columns[headerIndices["desart"]]?.trim() || "",
        familia: columns[headerIndices["familia"]]?.trim() || "",
        nsubf: columns[headerIndices["nsubf"]]?.trim() || "",
        pventa_1: parsePrice(columns[headerIndices["pventa_1"]] || "0"),
        pventa_2: parsePrice(columns[headerIndices["pventa_2"]] || "0"),
        pventa_3: parsePrice(columns[headerIndices["pventa_3"]] || "0"),
        pventa_4: parsePrice(columns[headerIndices["pventa_4"]] || "0"),
      })
    }

    return products
  }

  const handleProcess = async () => {
    try {
      setError("")
      setLoading(true)
      const data = parseTabSeparatedData(textData)
      if (data.length === 0) {
        setError("No se encontraron productos en los datos")
        return
      }

      const supabase = createClient()
      const productsForDB = data.map((p) => ({
        desart: p.desart,
        familia: p.familia,
        nsubf: p.nsubf,
        pventa_1: p.pventa_1,
        pventa_2: p.pventa_2,
        pventa_3: p.pventa_3,
        pventa_4: p.pventa_4,
      }))

     const { error: dbError } = await supabase
  .from("products")
  .upsert(productsForDB, { onConflict: "desart" })


      if (dbError) {
        console.error("Error saving to Supabase:", dbError)
        setError("Error guardando en base de datos: " + dbError.message)
        return
      }

      // Also save to localStorage as backup
      localStorage.setItem("listadoProductos", JSON.stringify(data))
      onDataImport(data)
      setTextData("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar datos")
    } finally {
      setLoading(false)
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
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg font-semibold transition-colors text-white disabled:opacity-50"
        style={{ backgroundColor: "#E47C00" }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#c96500")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#E47C00")}
      >
        {loading ? "Guardando..." : "Procesar datos"}
      </button>
    </div>
  )
}
