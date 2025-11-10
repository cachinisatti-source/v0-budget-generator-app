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
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Precio</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Cantidad</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => {
              const quantity = getQuantity(product.id)
              const price = Number(product[priceKey]) || 0
              const subtotal = quantity * price

              return (
                <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{product.desart}</div>
                    <div className="text-xs text-muted-foreground">{product.nsubf}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">${price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => onQuantityChange(product.id, Number(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-border rounded bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                    ${subtotal.toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-border">
        {products.map((product) => {
          const quantity = getQuantity(product.id)
          const price = Number(product[priceKey]) || 0
          const subtotal = quantity * price

          return (
            <div key={product.id} className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{product.desart}</h3>
                <p className="text-xs text-muted-foreground">{product.nsubf}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Precio:</span>
                <span className="font-mono font-semibold text-foreground">${price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">Cantidad:</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => onQuantityChange(product.id, Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-border rounded bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {quantity > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-medium text-foreground">Subtotal:</span>
                  <span className="font-mono font-semibold text-primary">${subtotal.toLocaleString()}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
