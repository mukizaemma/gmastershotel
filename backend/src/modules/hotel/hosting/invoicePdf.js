import { ISSUER, HOSTING_NOTE } from './logic.js'

function escapePdf(value) {
  return ascii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function ascii(value) {
  return String(value ?? '')
    .replace(/[–—]/g, '-')
    .replace(/[’]/g, "'")
    .replace(/[^\x20-\x7E]/g, '')
}

function wrap(value, width) {
  const words = ascii(value).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > width && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

export function buildInvoicePdf(invoice) {
  const ops = []
  let y = 800
  const left = 48

  function text(value, x, size = 11, font = 'F1') {
    ops.push(`BT /${font} ${size} Tf ${x} ${y.toFixed(2)} Td (${escapePdf(value)}) Tj ET`)
  }

  function gap(n) {
    y -= n
  }

  function rule() {
    ops.push(`0.35 w 0.2 G ${left} ${y.toFixed(2)} m 547 ${y.toFixed(2)} l S 0 G`)
  }

  ops.push('0 g')
  text(ISSUER.name, left, 16, 'F2')
  gap(18)
  for (const line of ISSUER.lines) {
    text(line, left, 11)
    gap(14)
  }
  text(`Tel: ${ISSUER.tel}`, left, 11)
  gap(14)
  text(`Email: ${ISSUER.email}`, left, 11)
  gap(28)
  text('Website hosting renewal Invoice', left, 14, 'F2')
  gap(22)
  text(`Invoice No.: ${invoice.invoiceNumber}`, left, 11)
  gap(16)
  text(`Billing To: ${invoice.billingTo}`, left, 11)
  gap(16)
  text('Note:', left, 11, 'F2')
  gap(14)
  for (const line of wrap(HOSTING_NOTE, 88)) {
    text(line, left, 11)
    gap(14)
  }

  gap(10)
  text('Service details', left, 12, 'F2')
  gap(8)
  rule()
  gap(16)
  text('#', left, 10, 'F2')
  text('Service Description', 72, 10, 'F2')
  text('Hosting Period', 300, 10, 'F2')
  text('Amount/Rwf', 470, 10, 'F2')
  gap(6)
  rule()

  for (const row of invoice.rows || []) {
    const description = wrap(row.description, 36)
    const period = wrap(row.period, 22)
    const height = Math.max(description.length, period.length, 1)
    gap(16)
    const rowTop = y
    text(row.index, left, 11)
    description.forEach((line, index) => {
      y = rowTop - index * 13
      text(line, 72, 11)
    })
    period.forEach((line, index) => {
      y = rowTop - index * 13
      text(line, 300, 11)
    })
    y = rowTop
    text(row.amount, 470, 11)
    y = rowTop - (height - 1) * 13
    gap(8)
    rule()
  }

  gap(18)
  text('Amount to Pay', 300, 12, 'F2')
  text(invoice.totalLabel, 470, 12, 'F2')
  gap(28)
  text('2. Payment Methods:', left, 12, 'F2')
  gap(18)
  text('Bank Transfer', left, 11, 'F2')
  text('MoMo Pay', 320, 11, 'F2')
  gap(16)
  text(`Account No: ${ISSUER.bankAccount}, ${ISSUER.bankName}`, left, 11)
  text(ISSUER.momoCode, 320, 11)
  gap(14)
  text(`Names: ${ISSUER.bankNames}`, left, 11)
  text(ISSUER.momoNames, 320, 11)
  gap(36)
  text('Prepared by,', left, 11)
  gap(16)
  text(ISSUER.preparedBy, left, 12, 'F2')
  gap(16)
  text(`Date: ${invoice.issuedOnLabel}`, left, 11)

  const stream = ops.join('\n')
  return packPdf(stream)
}

function packPdf(stream) {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Count 1 /Kids [3 0 R] >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ]

  let body = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body))
    body += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefAt = Buffer.byteLength(body)
  body += `xref\n0 ${objects.length + 1}\n`
  body += '0000000000 65535 f \n'
  for (const offset of offsets.slice(1)) {
    body += `${String(offset).padStart(10, '0')} 00000 n \n`
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`
  return Buffer.from(body)
}
