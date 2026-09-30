import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { staffClient } from '../api/staffClient'
import { useStaffAuth } from '../auth/StaffAuthContext'
import styles from './Hosting.module.css'
import '../staff.css'

function money(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return `${Math.round(n).toLocaleString('en-US')} RWF`
}

function quoteFor(rate, hostingUsd, supportRwf) {
  const n = Number(rate)
  if (!Number.isFinite(n) || n <= 0) return null
  const hosting = Math.round(hostingUsd * n)
  return { hosting, support: supportRwf, total: hosting + supportRwf }
}

function badgeClass(status) {
  if (status === 'paid' || status === 'active') return 'badge badgeConfirmed'
  if (status === 'pending') return 'badge badgePending'
  return 'badge badgeCancelled'
}

export default function StaffHosting() {
  const { user } = useStaffAuth()
  const [hosting, setHosting] = useState(null)
  const [rate, setRate] = useState('')
  const [selectedNumber, setSelectedNumber] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const canMarkPaid = user?.role === 'super-admin'

  useEffect(() => {
    staffClient
      .get('/api/hosting')
      .then((res) => {
        setHosting(res.data)
        setRate(res.data.usdRate ? String(res.data.usdRate) : '')
      })
      .catch(() => toast.error('Could not load hosting.'))
  }, [])

  useEffect(() => {
    if (!hosting || selectedNumber) return
    setSelectedNumber(hosting.nextInvoiceNumber || hosting.invoices?.[0]?.invoiceNumber || '')
  }, [hosting, selectedNumber])

  function printInvoice() {
    document.body.classList.add('printing-invoice')
    const cleanup = () => document.body.classList.remove('printing-invoice')
    window.addEventListener('afterprint', cleanup, { once: true })
    window.print()
  }

  const selected = hosting?.invoices?.find((inv) => inv.invoiceNumber === selectedNumber) || null
  const quote = hosting ? quoteFor(rate, hosting.annualHostingUsd, hosting.annualSupportRwf) : null

  async function saveRate(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const { data } = await staffClient.post('/api/hosting', { action: 'rate', usdRate: Number(rate) })
      setHosting(data)
      setRate(data.usdRate ? String(data.usdRate) : '')
      toast.success(data.amountToPay ? `Rate saved. Amount to pay is ${money(data.amountToPay)}.` : 'Rate saved.')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not save the dollar rate.')
    } finally {
      setBusy(false)
    }
  }

  async function download(number) {
    try {
      const res = await staffClient.get('/api/hosting/invoice', {
        params: { number },
        responseType: 'blob',
      })
      const type = res.data?.type || ''
      if (type.includes('json') || type.includes('text')) {
        toast.error('Could not download the invoice.')
        return
      }
      const url = URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `${number.replace(/[^\w.-]+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Could not download the invoice.')
    }
  }

  async function confirmPaid() {
    if (!selected) return
    setBusy(true)
    try {
      const { data } = await staffClient.post('/api/hosting', {
        action: 'mark-paid',
        invoiceNumber: selected.invoiceNumber,
      })
      setHosting(data)
      setConfirming(false)
      toast.success('Invoice marked as paid. Hosting is active.')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not confirm payment.')
    } finally {
      setBusy(false)
    }
  }

  if (!hosting) return <p>Loading…</p>

  return (
    <div className="staffPage">
      <div className="hostingChrome">
        <h1>Hosting</h1>
        <p className="staffLead">
          Domain registration, the hosting server, and each annual invoice. Hosting renews on 1 August. It stays
          active while the current invoice is paid, and shows expired after that date until a super admin confirms
          the renewal. Annual support is {money(hosting.annualSupportRwf)}. {hosting.supportIncludes}
        </p>

        <div className="staffStats">
          <div className={`staffStat ${hosting.serviceStatus === 'active' ? 'staffStat--accent' : ''}`}>
            <span>Status</span>
            <strong>{hosting.serviceStatusLabel}</strong>
            <small>{hosting.expiryHint}</small>
          </div>
          <div className="staffStat">
            <span>Expiration</span>
            <strong>{hosting.expiresOnLabel}</strong>
            <small>{hosting.renewalLabel}</small>
          </div>
          <div className="staffStat">
            <span>Dollar rate</span>
            <strong>{hosting.usdRate ? hosting.usdRate.toLocaleString('en-US') : '—'}</strong>
            <small>RWF for $1</small>
          </div>
          <div className="staffStat">
            <span>Next amount</span>
            <strong>{hosting.amountToPayLabel === '—' ? '—' : money(hosting.amountToPay)}</strong>
            <small>Hosting plus support</small>
          </div>
        </div>

        <div className={styles.facts}>
          <div className={styles.fact}>
            <span>Domain registration</span>
            <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer">
              {hosting.domainRegistrar}
            </a>
          </div>
          <div className={styles.fact}>
            <span>Hosting server</span>
            <a href="https://www.digitalocean.com" target="_blank" rel="noopener noreferrer">
              {hosting.hostingServer}
            </a>
          </div>
          <div className={styles.fact}>
            <span>Annual hosting</span>
            <strong>${hosting.annualHostingUsd}</strong>
          </div>
          <div className={styles.fact}>
            <span>Annual support</span>
            <strong>{money(hosting.annualSupportRwf)}</strong>
          </div>
        </div>

        <form onSubmit={saveRate} className={`staffCard ${styles.rateCard}`}>
          <label className="staffField">
            Current dollar rate
            <input
              type="number"
              min="1"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="RWF for 1 USD"
              disabled={busy}
              required
            />
          </label>
          <div className={styles.quote}>
            <div>
              <span>Hosting</span>
              <strong>{quote ? money(quote.hosting) : '—'}</strong>
              <small>${hosting.annualHostingUsd} × rate</small>
            </div>
            <div>
              <span>Support</span>
              <strong>{money(hosting.annualSupportRwf)}</strong>
            </div>
            <div>
              <span>Amount to pay</span>
              <strong>{quote ? money(quote.total) : 'Enter the rate'}</strong>
            </div>
          </div>
          <button type="submit" className="staffBtn" disabled={busy} style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>
            Save rate
          </button>
        </form>

        <div className="staffCard">
          <table className="staffTable">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Period</th>
                <th>Hosting</th>
                <th>Support</th>
                <th>Total</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {hosting.invoices.map((inv) => (
                <tr key={inv.invoiceNumber}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.periodLabel}</td>
                  <td>{inv.hostingAmountLabel}</td>
                  <td>{inv.supportAmountLabel}</td>
                  <td>{inv.totalLabel}</td>
                  <td>
                    <span className={badgeClass(inv.status)}>{inv.statusLabel}</span>
                  </td>
                  <td>
                    <div className="rowActions">
                      <button type="button" className="staffBtn staffBtnGhost" onClick={() => setSelectedNumber(inv.invoiceNumber)}>
                        View
                      </button>
                      <button type="button" className="staffBtn staffBtnGhost" onClick={() => download(inv.invoiceNumber)}>
                        Download
                      </button>
                      <button
                        type="button"
                        className="staffBtn staffBtnGhost"
                        onClick={() => {
                          setSelectedNumber(inv.invoiceNumber)
                          window.setTimeout(() => printInvoice(), 60)
                        }}
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <article className={`${styles.sheet} invoiceSheet`}>
          <h2 className={styles.issuer}>{hosting.issuer.name}</h2>
          <p className={styles.issuerLines}>
            {hosting.issuer.lines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            Tel: {hosting.issuer.tel}
            <br />
            Email: {hosting.issuer.email}
          </p>
          <h3 className={styles.title}>Website hosting renewal Invoice</h3>
          <p className={styles.meta}>
            Invoice No.: {selected.invoiceNumber}
            <br />
            Billing To: {selected.billingTo}
          </p>
          <p className={styles.note}>
            <strong>Note: </strong>
            {hosting.note}
          </p>
          <h3 className={styles.serviceTitle}>Service details</h3>
          <table className={styles.lines}>
            <thead>
              <tr>
                <th>#</th>
                <th>Service Description</th>
                <th>Hosting Period</th>
                <th className={styles.amount}>Amount/Rwf</th>
              </tr>
            </thead>
            <tbody>
              {selected.rows.map((row) => (
                <tr key={row.index}>
                  <td>{row.index}</td>
                  <td>{row.description}</td>
                  <td>{row.period}</td>
                  <td className={styles.amount}>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.total}>
            <span>Amount to Pay</span>
            <span>{selected.totalLabel}</span>
          </div>
          <h3 className={styles.serviceTitle}>2. Payment Methods:</h3>
          <div className={styles.pay}>
            <div>
              <p>
                <strong>Bank Transfer</strong>
              </p>
              <p>
                Account No: {hosting.issuer.bankAccount}, {hosting.issuer.bankName}
              </p>
              <p>Names: {hosting.issuer.bankNames}</p>
            </div>
            <div>
              <p>
                <strong>MoMo Pay</strong>
              </p>
              <p>{hosting.issuer.momoCode}</p>
              <p>{hosting.issuer.momoNames}</p>
            </div>
          </div>
          <p className={styles.sign}>
            Prepared by,
            <br />
            <strong>{hosting.issuer.preparedBy}</strong>
            <br />
            Date: {selected.issuedOnLabel}
          </p>
          <div className={`${styles.actions} noPrint`}>
            <button type="button" className="staffBtn" onClick={printInvoice}>
              Print
            </button>
            <button type="button" className="staffBtn staffBtnGhost" onClick={() => download(selected.invoiceNumber)}>
              Download PDF
            </button>
            {canMarkPaid && selected.status !== 'paid' && !confirming && (
              <button type="button" className="staffBtn" onClick={() => setConfirming(true)} disabled={busy}>
                Mark as paid
              </button>
            )}
          </div>
          {canMarkPaid && confirming && (
            <div className={`${styles.confirm} noPrint`}>
              <p>Confirm {selected.invoiceNumber} as paid? Hosting stays active until the next 1 August.</p>
              <div className={styles.actions}>
                <button type="button" className="staffBtn" onClick={confirmPaid} disabled={busy}>
                  Confirm paid
                </button>
                <button type="button" className="staffBtn staffBtnGhost" onClick={() => setConfirming(false)} disabled={busy}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {!canMarkPaid && selected.status !== 'paid' && (
            <p className="staffLead noPrint">A super admin confirms this invoice once it is paid.</p>
          )}
        </article>
      )}
    </div>
  )
}
