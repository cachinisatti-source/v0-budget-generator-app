"use client"

import type { Product, BudgetItem } from "@/types"

interface ProductTableProps {
  products: Product[]
  selectedList: 1 | 2 | 3 | 4
  budgetItems: BudgetItem[]
  onQuantityChange: (productId: string, quantity: number) => void
}

export default function ProductTable({ products, selectedList, budgetItems, onQuantityChange }: ProductTableProps) {
  const priceKey = `pventa_${selectedList}` as keyof Product

  const getQuantity = (productId: string) => {
    return budgetItems.find((item) => item.id === productId)?.quantity || 0
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
        <p className="text-gray-500">No se encontraron productos</p>
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
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Precio</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white">Cantidad</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const quantity = getQuantity(product.id)
              const price = Number(product[priceKey]) || 0
              const subtotal = quantity * price

              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-black">{product.desart}</div>
                    <div className="text-xs text-gray-600">{product.nsubf}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-black">${price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => onQuantityChange(product.id, Number(e.target.value) || 0)}
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
        {products.map((product) => {
          const quantity = getQuantity(product.id)
          const price = Number(product[priceKey]) || 0
          const subtotal = quantity * price

          return (
            <div key={product.id} className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-black">{product.desart}</h3>
                <p className="text-xs text-gray-600">{product.nsubf}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Precio:</span>
                <span className="font-mono font-semibold text-black">${price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-600">Cantidad:</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => onQuantityChange(product.id, Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-black text-center focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
              {quantity > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-black">Subtotal:</span>
                  <span className="font-mono font-semibold text-orange-600">${subtotal.toLocaleString()}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
