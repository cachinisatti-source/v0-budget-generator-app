import type { BudgetItem } from "@/types"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

export const generateExcel = (items: BudgetItem[], total: number, mode: "normal" | "chinos" = "normal") => {
  const data = items.map((item) => ({
    Producto: item.name,
    Cantidad: item.quantity,
    "Precio Unit.": item.unitPrice,
    Subtotal: item.quantity * item.unitPrice,
  }))

  // Add total row
  const totalRow = {
    Producto: "TOTAL",
    Cantidad: "",
    "Precio Unit.": "",
    Subtotal: total,
  }

  const ws = XLSX.utils.json_to_sheet([...data, totalRow])

  // Format header row with orange background and white text
  const headerRange = XLSX.utils.decode_range(ws["!ref"] || "A1")
  for (let i = headerRange.s.c; i <= headerRange.e.c; i++) {
    const cellAddress = XLSX.utils.encode_col(i) + "1"
    if (ws[cellAddress]) {
      ws[cellAddress].fill = { patternType: "solid", fgColor: { rgb: "FFE47C00" } }
      ws[cellAddress].font = { color: { rgb: "FFFFFFFF" }, bold: true }
    }
  }

  // Set column widths
  ws["!cols"] = [{ wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Presupuesto")
  const filename = mode === "chinos" ? "pedido_cliente_chino.xlsx" : "presupuesto_alfonsa.xlsx"
  XLSX.writeFile(wb, filename)
}

export const generatePDF = (items: BudgetItem[], total: number, mode: "normal" | "chinos" = "normal") => {
  const doc = new jsPDF() as any

  const alfonsaColor = [228, 124, 0] // #E47C00

  // Header with Alfonsa branding
  doc.setFillColor(...alfonsaColor)
  doc.rect(0, 0, 210, 30, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont(undefined, "bold")
  const headerText =
    mode === "chinos" ? "Pedido Alfonsa Distribuidora (Cliente Chino)" : "Presupuesto Alfonsa Distribuidora"
  doc.text(headerText, 14, 12)

  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 22)

  // Table
  const tableData = items.map((item) => [
    item.name,
    item.quantity.toString(),
    `$${item.unitPrice.toLocaleString()}`,
    `$${(item.quantity * item.unitPrice).toLocaleString()}`,
  ])

  if (typeof doc.autoTable === "function") {
    doc.autoTable({
      head: [["Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
      body: tableData,
      startY: 35,
      margin: 14,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: [51, 51, 51],
      },
      headStyles: {
        fillColor: [...alfonsaColor],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })
  }

  const finalY = (doc.lastAutoTable?.finalY as number) || 50

  // Total section
  doc.setDrawColor(...alfonsaColor)
  doc.setLineWidth(1)
  doc.rect(14, finalY + 5, 182, 12)

  doc.setFillColor(...alfonsaColor)
  doc.rect(14, finalY + 5, 182, 12, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("TOTAL: " + `$${total.toLocaleString()}`, 196, finalY + 11, { align: "right" })

  const filename = mode === "chinos" ? "pedido_cliente_chino.pdf" : "presupuesto_alfonsa.pdf"
  doc.save(filename)
}

export const shareViaWhatsApp = (items: BudgetItem[], total: number, mode: "normal" | "chinos" = "normal") => {
  const titulo =
    mode === "chinos" ? "🛒 Pedido Alfonsa Distribuidora (Cliente Chino)" : "🧾 *Presupuesto Alfonsa Distribuidora*"
  const texto = [
    titulo,
    "",
    ...items.map((item) => `${item.name} x${item.quantity} - $${(item.quantity * item.unitPrice).toLocaleString()}`),
    "",
    `*TOTAL: $${total.toLocaleString()}*`,
  ].join("\n")

  let url: string
  if (mode === "chinos") {
    url = "https://wa.me/5492657334100?text=" + encodeURIComponent(texto)
  } else {
    url = "https://wa.me/?text=" + encodeURIComponent(texto)
  }
  window.open(url, "_blank")
}

export const shareViaWhatsAppChinese = (items: BudgetItem[], total: number) => {
  const texto = [
    "🛒 *Pedido Alfonsa Distribuidora*",
    "",
    ...items.map((item) => `${item.name} x${item.quantity} - $${(item.quantity * item.unitPrice).toLocaleString()}`),
    "",
    `*TOTAL: $${total.toLocaleString()}*`,
  ].join("\n")

  const url = "https://wa.me/5492657334100?text=" + encodeURIComponent(texto)
  window.open(url, "_blank")
}
