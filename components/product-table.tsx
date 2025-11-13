"use client"

import type { Product, BudgetItem } from "@/types"
import { useState, useMemo, memo } from "react"

interface ProductTableProps {
  products: Product[]
  selectedList: 1 | 2 | 3 | 4
  budgetItems: BudgetItem[]
  onQuantityChange: (productId: string, quantity: number) => void
  searchTerm: string
}

// Memoized product row to prevent re-renders
const ProductRow = memo(function ProductRow({
  product,
  quantity,
  price,
  priceKey,
  onQuantityChange,
  showFamilyTag,
}: {
  product: Product
  quantity: number
  price: number
  priceKey: string
  onQuantityChange: (id: string, qty: number) => void
  showFamilyTag?: boolean
}) {
  const subtotal = quantity * price

  return (
    <div className="p-3 space-y-2">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-black text-sm">{product.desart}</h4>
          {showFamilyTag && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
              {product.familia}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">{product.nsubf}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Precio:</span>
        <span className="font-mono font-semibold text-black">${price.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">Cantidad:</span>
        <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
          <button
            onClick={() => onQuantityChange(product.id, Math.max(0, quantity - 1))}
            className="w-6 h-6 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-100 rounded transition-colors active:scale-95"
          >
            −
          </button>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => onQuantityChange(product.id, Number(e.target.value) || 0)}
            className="w-12 px-1 py-1 bg-transparent text-black text-center focus:outline-none font-semibold"
          />
          <button
            onClick={() => onQuantityChange(product.id, quantity + 1)}
            className="w-6 h-6 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-100 rounded transition-colors active:scale-95"
          >
            +
          </button>
        </div>
      </div>
      {quantity > 0 && (
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-xs font-medium text-black">Subtotal:</span>
          <span className="font-mono font-semibold text-orange-600">${subtotal.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
})

export default function ProductTable({
  products,
  selectedList,
  budgetItems,
  onQuantityChange,
  searchTerm,
}: ProductTableProps) {
  const priceKey = `pventa_${selectedList}` as keyof Product

  const isSearchMode = (searchTerm || "").trim().length > 0

  const getQuantity = useMemo(() => {
    const map = new Map(budgetItems.map((item) => [item.id, item.quantity]))
    return (productId: string) => map.get(productId) || 0
  }, [budgetItems])

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedSubfamily, setSelectedSubfamily] = useState<{ [familia: string]: string }>({})

  const toggleCategory = (familia: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(familia)) {
      newExpanded.delete(familia)
    } else {
      newExpanded.add(familia)
    }
    setExpandedCategories(newExpanded)
  }

  const productsWithStock = useMemo(() => {
    return products.filter((p) => p.stock > 0)
  }, [products])

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Record<string, Product[]>> = {}
    productsWithStock.forEach((product) => {
      if (!groups[product.familia]) {
        groups[product.familia] = {}
      }
      if (!groups[product.familia][product.nsubf]) {
        groups[product.familia][product.nsubf] = []
      }
      groups[product.familia][product.nsubf].push(product)
    })
    return groups
  }, [productsWithStock])

  const sortedFamilias = useMemo(() => Object.keys(groupedProducts).sort(), [groupedProducts])

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <p className="text-gray-500">No se encontraron productos</p>
      </div>
    )
  }

  if (productsWithStock.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <p className="text-gray-500">No hay productos con stock disponible</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-600 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Producto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Subfamilia</th>
              {isSearchMode && <th className="px-4 py-3 text-left text-sm font-semibold text-white">Familia</th>}
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Precio</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white">Stock</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white">Cantidad</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productsWithStock.map((product) => {
              const quantity = getQuantity(product.id)
              const price = Number(product[priceKey]) || 0
              const subtotal = quantity * price

              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-black">{product.desart}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.nsubf}</td>
                  {isSearchMode && <td className="px-4 py-3 text-sm text-orange-600 font-medium">{product.familia}</td>}
                  <td className="px-4 py-3 text-right font-mono text-black">${price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">{product.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        onQuantityChange(product.id, Math.min(Number(e.target.value) || 0, product.stock))
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded bg-white text-black text-center focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-black">
                    ${subtotal.toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-gray-200">
        {isSearchMode ? (
          // Modo búsqueda: lista global con etiquetas de familia
          <div className="divide-y divide-gray-200">
            {productsWithStock.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No se encontraron productos con stock</div>
            ) : (
              productsWithStock.map((product) => {
                const quantity = getQuantity(product.id)
                const price = Number(product[priceKey]) || 0

                return (
                  <ProductRow
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    price={price}
                    priceKey={priceKey}
                    onQuantityChange={onQuantityChange}
                    showFamilyTag={true}
                  />
                )
              })
            )}
          </div>
        ) : (
          // Modo categorías: acordeones colapsables
          sortedFamilias.map((familia) => {
            const subfamiliesData = groupedProducts[familia]
            const sortedSubfamilies = Object.keys(subfamiliesData).sort()
            const activeSubfamily = selectedSubfamily[familia] || sortedSubfamilies[0]

            return (
              <div key={familia} className="border-b border-gray-300">
                {/* Family header */}
                <button
                  onClick={() => toggleCategory(familia)}
                  className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 transition-colors flex justify-between items-center"
                >
                  <div className="text-left">
                    <span className="font-semibold text-white">{familia}</span>
                    <span className="text-xs text-orange-100 ml-2">
                      ({Object.values(subfamiliesData).flat().length})
                    </span>
                  </div>
                  <span className="text-white text-lg">{expandedCategories.has(familia) ? "−" : "+"}</span>
                </button>

                {expandedCategories.has(familia) && (
                  <div className="bg-gray-50">
                    <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap gap-2">
                      {sortedSubfamilies.map((subfamilia) => (
                        <button
                          key={subfamilia}
                          onClick={() => setSelectedSubfamily({ ...selectedSubfamily, [familia]: subfamilia })}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            activeSubfamily === subfamilia
                              ? "bg-orange-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:border-orange-600"
                          }`}
                        >
                          {subfamilia}
                        </button>
                      ))}
                    </div>

                    <div className="divide-y divide-gray-200">
                      {(subfamiliesData[activeSubfamily] || []).map((product) => {
                        const quantity = getQuantity(product.id)
                        const price = Number(product[priceKey]) || 0

                        return (
                          <ProductRow
                            key={product.id}
                            product={product}
                            quantity={quantity}
                            price={price}
                            priceKey={priceKey}
                            onQuantityChange={onQuantityChange}
                            showFamilyTag={false}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
