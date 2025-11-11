"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import DataImport from "@/components/data-import"
import PriceListSelector from "@/components/price-list-selector"
import SearchProducts from "@/components/search-products"
import ProductTable from "@/components/product-table"
import BudgetSummary from "@/components/budget-summary"
import SettingsModal from "@/components/settings-modal"
import Link from "next/link"
import type { Product, BudgetItem } from "@/types"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedList, setSelectedList] = useState<1 | 2 | 3 | 4>(1)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Try to load from Supabase first
      const { data, error } = await supabase.from("products").select("*").limit(1000)

      if (!error && data && data.length > 0) {
        // Convert Supabase data to Product format
        const convertedProducts: Product[] = data.map((p: any, idx: number) => ({
          id: p.id || `${idx}`,
          desart: p.desart,
          familia: p.familia,
          nsubf: p.nsubf,
          pventa_1: Number(p.pventa_1),
          pventa_2: Number(p.pventa_2),
          pventa_3: Number(p.pventa_3),
          pventa_4: Number(p.pventa_4),
        }))
        setProducts(convertedProducts)
        setFilteredProducts(convertedProducts)
        localStorage.setItem("listadoProductos", JSON.stringify(convertedProducts))
      } else {
        // Fallback to localStorage if Supabase fails
        const savedProducts = localStorage.getItem("listadoProductos")
        if (savedProducts) {
          const data = JSON.parse(savedProducts)
          setProducts(data)
          setFilteredProducts(data)
        }
      }
    } catch (err) {
      console.error("Error loading products:", err)
      // Fallback to localStorage
      const savedProducts = localStorage.getItem("listadoProductos")
      if (savedProducts) {
        const data = JSON.parse(savedProducts)
        setProducts(data)
        setFilteredProducts(data)
      }
    } finally {
      setLoading(false)
    }
  }

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
      const priceKey = `pventa_${selectedList}` as keyof Product
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

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground">Cargando productos...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Generador de Presupuestos</h1>
            <p className="text-muted-foreground">
              Alfonsa Distribuidora - Importa datos, selecciona cantidades y genera presupuestos
            </p>
          </div>
          {products.length > 0 && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-lg transition-colors"
              style={{
                backgroundColor: "#E47C00",
                color: "#ffffff",
                fontSize: "18px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
              title="Ajustes"
            >
              ⚙️
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <DataImport onDataImport={handleDataImport} />
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-card rounded-lg border border-border p-4 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
              <div className="flex-1 min-w-0">
                <SearchProducts searchTerm={searchTerm} onSearch={handleSearch} />
              </div>
              <PriceListSelector selectedList={selectedList} onListChange={handleListChange} />
            </div>

            {/* Products Table */}
            <ProductTable
              products={filteredProducts}
              selectedList={selectedList}
              budgetItems={budgetItems}
              onQuantityChange={handleQuantityChange}
            />

            {/* Budget Summary */}
            {budgetItems.length > 0 && (
              <BudgetSummary
                items={budgetItems}
                mode="normal"
                onReset={() => {
                  setBudgetItems([])
                  setSearchTerm("")
                  setFilteredProducts(products)
                }}
              />
            )}

            {/* New Import Button */}
            <div className="flex gap-3 flex-col md:flex-row">
              <button
                onClick={() => {
                  setProducts([])
                  setFilteredProducts([])
                  setBudgetItems([])
                  setSearchTerm("")
                }}
                className="px-4 py-3 rounded-lg font-medium transition-colors text-white"
                style={{ backgroundColor: "#E47C00" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
              >
                Importar nuevos datos
              </button>
              <Link
                href="/chinos"
                className="px-4 py-3 rounded-lg font-medium transition-colors text-white text-center"
                style={{ backgroundColor: "#E47C00" }}
              >
                Acceder a Clientes Chinos
              </Link>
            </div>
          </div>
        )}

        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onSave={handleDataImport} />}
      </div>
    </main>
  )
}
