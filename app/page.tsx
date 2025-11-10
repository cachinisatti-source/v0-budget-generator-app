"use client"

import { useState } from "react"
import DataImport from "@/components/data-import"
import PriceListSelector from "@/components/price-list-selector"
import SearchProducts from "@/components/search-products"
import ProductTable from "@/components/product-table"
import BudgetSummary from "@/components/budget-summary"
import type { Product, BudgetItem } from "@/types"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedList, setSelectedList] = useState<1 | 2 | 3 | 4>(1)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [mode, setMode] = useState<"normal" | "chinos">("normal")

  const handleDataImport = (data: Product[]) => {
    setProducts(data)
    setFilteredProducts(data)
    setBudgetItems([])
    setSearchTerm("")
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = products.filter((p) => p.desart.toLowerCase().includes(term.toLowerCase()))
    setFilteredProducts(filtered)
  }

  const handleListChange = (list: 1 | 2 | 3 | 4) => {
    setSelectedList(list)
    setBudgetItems((prevItems) =>
      prevItems.map((item) => {
        const product = products.find((p) => p.id === item.id)
        if (!product) return item
        const priceKey = `pventa_${list}` as keyof Product
        const unitPrice = Number(product[priceKey]) || 0
        return { ...item, unitPrice }
      }),
    )
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (quantity === 0) {
      setBudgetItems(budgetItems.filter((item) => item.id !== productId))
    } else {
      const existingItem = budgetItems.find((item) => item.id === productId)
      const activeList = mode === "chinos" ? 4 : selectedList
      const priceKey = `pventa_${activeList}` as keyof Product
      const unitPrice = Number(product[priceKey]) || 0

      if (existingItem) {
        setBudgetItems(budgetItems.map((item) => (item.id === productId ? { ...item, quantity, unitPrice } : item)))
      } else {
        setBudgetItems([
          ...budgetItems,
          {
            id: productId,
            name: product.desart,
            quantity,
            unitPrice,
          },
        ])
      }
    }
  }

  const handleModeChange = (newMode: "normal" | "chinos") => {
    setMode(newMode)
    if (newMode === "chinos") {
      setSelectedList(4)
      setBudgetItems((prevItems) =>
        prevItems.map((item) => {
          const product = products.find((p) => p.id === item.id)
          if (!product) return item
          const unitPrice = Number(product.pventa_4) || 0
          return { ...item, unitPrice }
        }),
      )
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#fff" }}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(228, 124, 0)" }}>
            Generador de Presupuestos
          </h1>
          <p className="text-gray-600">
            Alfonsa Distribuidora - Importa datos, selecciona cantidades y genera presupuestos
          </p>
        </div>

        {products.length > 0 && (
          <div className="mb-8 flex gap-3">
            <button
              onClick={() => handleModeChange("normal")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "normal" ? "text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              style={mode === "normal" ? { backgroundColor: "rgb(228, 124, 0)" } : {}}
            >
              🧾 Presupuestos normales
            </button>
            <button
              onClick={() => handleModeChange("chinos")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === "chinos" ? "text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              style={mode === "chinos" ? { backgroundColor: "rgb(228, 124, 0)" } : {}}
            >
              🛒 Clientes chinos
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <DataImport onDataImport={handleDataImport} />
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-card rounded-lg border border-border p-4 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
              <div className="flex-1 min-w-0">
                <SearchProducts searchTerm={searchTerm} onSearch={handleSearch} />
              </div>
              {mode !== "chinos" && <PriceListSelector selectedList={selectedList} onListChange={handleListChange} />}
            </div>

            {/* Products Table */}
            <ProductTable
              products={filteredProducts}
              selectedList={mode === "chinos" ? 4 : selectedList}
              budgetItems={budgetItems}
              onQuantityChange={handleQuantityChange}
            />

            {/* Budget Summary */}
            {budgetItems.length > 0 && (
              <BudgetSummary
                items={budgetItems}
                mode={mode}
                onReset={() => {
                  setBudgetItems([])
                  setSearchTerm("")
                  setFilteredProducts(products)
                }}
              />
            )}

            {/* New Import Button */}
            <button
              onClick={() => {
                setProducts([])
                setFilteredProducts([])
                setBudgetItems([])
                setSearchTerm("")
                setMode("normal")
              }}
              className="w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors md:w-auto"
            >
              Importar nuevos datos
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
