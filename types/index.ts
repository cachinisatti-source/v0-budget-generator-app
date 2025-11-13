export interface Product {
  id: string
  desart: string
  familia: string
  nsubf: string
  pventa_1: number
  pventa_2: number
  pventa_3: number
  pventa_4: number
  stock: number
}

export interface BudgetItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  familia?: string
  nsubf?: string
}
