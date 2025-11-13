"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/types"

interface DataImportProps {
  onDataImport: (data: Product[]) => void
}

// ⬇️ FUNCIÓN PARA SUBIR EN LOTES (EVITA EL LÍMITE DE SUPABASE)
const batchUpsertProducts = async (products: any[], batchSize = 500) => {
  const supabase = createClient()

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)

    const { error } = await supabase
      .from("products")
      .upsert(batch, { onConflict: "desart" })

    if (error) {
      console.error("Error en batch:", i, error)
      throw new Error("Error al guardar lote de productos: " + error.message)
    }
  }
}

export default function DataImport({ onDataImport }: DataImportProps) {
  const [textData, setTextData] = useState("")
  const [stockData, setStockData] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stockTextareaRef = useRef<HTMLTextAreaElement>(null)

  const parseTabSeparatedData = (text: string): Product[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) throw new Error("Se requieren al menos 2 líneas (encabezado + datos)")

    const headers = lines[0].split("\t")
    const requiredHeaders = ["desart", "familia", "nsubf", "pventa_1", "pventa_2", "pventa_3", "pventa_4"]

    const headerIndices: { [key: string]: number } = {}
    for (const header of requiredHeaders) {
      const index = headers.indexOf(header)
      if (index === -1) throw new Error(`Columna requerida no encontrada: ${header}`)
      headerIndices[header] = index
    }

    const products: Product[] = []
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      const columns = lines[i].split("\t")

      const parsePrice = (value: string): number => {
        if (!value) return 0
        let cleaned = value.replace(/[^\d.,-]/g, "").trim()

        if (!cleaned) return 0

        if (cleaned.includes(",")) {
          cleaned = cleaned.replace(/\./g, "").replace(",", ".")
        } else if (cleaned.includes(".")) {
          const parts = cleaned.split(".")
          const lastPart = parts[parts.length - 1]
          if (lastPart.length === 3) cleaned = cleaned.replace(/\./g, "")
          else cleaned = parts.slice(0, -1).join("") + "." + lastPart
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

  const parseStockData = (text: string): Record<string, number> => {
    const stockMap: Record<string, number> = {}
    const lines = text.trim().split("\n")

    for (const line of lines) {
      if (!line.trim()) continue

      const parts = line.split(/\s+/)
      const lastPart = parts[parts.length - 1]
      const stockValue = Number.parseInt(lastPart)

      if (isNaN(stockValue)) {
        stockMap[line.trim()] = 0
      } else {
        const productName = line.substring(0, line.lastIndexOf(lastPart)).trim()
        stockMap[productName] = stockValue
      }
    }

    return stockMap
  }

  const handleProcess = async () => {
    try {
      setError("")
      setLoading(true)

      let data = parseTabSeparatedData(textData)

      if (stockData.trim()) {
        const stockMap = parseStockData(stockData)
        data = data.map((product) => ({
          ...product,
          stock: stockMap[product.desart] || 0,
        }))
      } else {
        data = data.map((product) => ({ ...product, stock: 0 }))
      }

      if (!data.length) {
        setError("No se encontraron productos en los datos")
        return
      }

      const productsForDB = data.map((p) => ({
        desart: p.desart,
        familia: p.familia,
        nsubf: p.nsubf,
        pventa_1: p.pventa_1,
        pventa_2: p.pventa_2,
        pventa_3: p.pventa_3,
        pventa_4: p.pventa_4,
        stock: p.stock,
      }))

      // ⬇️ UPLOAD SEGURO EN LOTES
      await batchUpsertProducts(productsForDB, 500)

      // Backup local
      localStorage.setItem("listadoProductos", JSON.stringify(data))
      onDataImport(data)
      setTextData("")
      setStockData("")
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

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Pega el stock (LLERENA) - Opcional</label>
        <p className="text-sm text-muted-foreground mb-3">
          Pega el listado de stock con el nombre del producto y cantidad. Cada línea: NOMBRE_PRODUCTO CANTIDAD
        </p>
      </div>

      <textarea
        ref={stockTextareaRef}
        value={stockData}
        onChange={(e) => setStockData(e.target.value)}
        placeholder="Pega aquí el stock (opcional)..."
        className="w-full h-32 p-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
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
