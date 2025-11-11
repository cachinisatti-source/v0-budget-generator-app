"use client"

import { useState, useEffect } from "react"
import SearchProducts from "@/components/search-products"
import ProductTable from "@/components/product-table"
import ChineseOrderSummary from "@/components/chinese-order-summary"
import Link from "next/link"
import type { Product, BudgetItem } from "@/types"

export default function ChinosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const savedProducts = localStorage.getItem("listadoProductos")
    if (savedProducts) {
      try {
        const data = JSON.parse(savedProducts)
        setProducts(data)
        setFilteredProducts(data)
      } catch {
        console.error("Error loading saved products")
      }
    }
  }, [])

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href="/"
            className="inline-block mb-6 px-4 py-2 rounded-lg font-medium transition-colors text-white"
            style={{ backgroundColor: "#E47C00" }}
          >
            ← Volver
          </Link>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">🛒 Pedidos Alfonsa</h1>
            <p className="text-muted-foreground">
              Por favor, contacte al administrador para activar el listado de productos.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = products.filter((p) => p.desart.toLowerCase().includes(term.toLowerCase()))
    setFilteredProducts(filtered)
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (quantity === 0) {
      setBudgetItems(budgetItems.filter((item) => item.id !== productId))
    } else {
      const existingItem = budgetItems.find((item) => item.id === productId)
      const unitPrice = Number(product.pventa_4) || 0

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

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block mb-4 px-4 py-2 rounded-lg font-medium transition-colors text-white"
            style={{ backgroundColor: "#E47C00" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c96500")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E47C00")}
          >
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-foreground">🛒 Pedidos Alfonsa</h1>
          <p className="text-muted-foreground">Busca productos, ingresa cantidades y envía tu pedido por WhatsApp</p>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <SearchProducts searchTerm={searchTerm} onSearch={handleSearch} />
          </div>

          <ProductTable
            products={filteredProducts}
            selectedList={4}
            budgetItems={budgetItems}
            onQuantityChange={handleQuantityChange}
          />

          {budgetItems.length > 0 && (
            <ChineseOrderSummary
              items={budgetItems}
              onReset={() => {
                setBudgetItems([])
                setSearchTerm("")
                setFilteredProducts(products)
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}
