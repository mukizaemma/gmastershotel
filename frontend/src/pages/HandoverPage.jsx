import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CMS_URL } from '@lib/apiClient'
import { brandFromCompany } from '@features/hotel/companyBrand'
import { useSiteLayout } from '@lib/queries/useSiteLayout'
import SiteAuditBoard from '@features/handover/SiteAuditBoard'
import { HANDOVER_CREDENTIALS, HANDOVER_SECTIONS, HANDOVER_TABS } from '@features/handover/guide'
import styles from './HandoverPage.module.css'

const SECTIONS = HANDOVER_TABS.map((tab) => tab.id)

const MANAGE_LINKS = [
  'settings',
  'pages',
  'rooms',
  'amenities',
  'activities',
  'menu',
  'gallery',
  'bookings',
  'reviews',
]

function tabFromHash() {
  const id = String(window.location.hash || '').replace('#', '')
  return SECTIONS.includes(id) ? id : 'overview'
}

async function readJson(path) {
  const res = await fetch(`${CMS_URL}${path}`)
  if (!res.ok) throw new Error('request failed')
  return res.json()
}

function copyText(value, ok) {
  navigator.clipboard.writeText(value).then(
    () => toast.success(ok),
    () => toast.error('Could not copy. Select the text instead.'),
  )
}

/** Turn **important terms** into highlighted marks. */
function Rich({ text }) {
  if (!text) return null
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <mark key={index} className={styles.term}>
          {part.slice(2, -2)}
        </mark>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export default function HandoverPage() {
  const [tab, setTab] = useState(() => (typeof window === 'undefined' ? 'overview' : tabFromHash()))
  const [report, setReport] = useState(null)
  const [origin, setOrigin] = useState('')
  const [form, setForm] = useState({ name: '', email: '', section: 'overview', message: '' })
  const [busy, setBusy] = useState(false)
  const { data: layout } = useSiteLayout()
  const brand = brandFromCompany(layout?.company)

  const section = HANDOVER_SECTIONS[tab] || HANDOVER_SECTIONS.overview
  const chapter = HANDOVER_TABS.findIndex((item) => item.id === tab) + 1
  const demoUrl = origin || 'https://demov2.iremetech.com'
  const loginUrl = origin ? `${origin}/staff` : '/staff'
  const shareUrl = origin ? `${origin}/handover${tab === 'overview' ? '' : `#${tab}`}` : '/handover'

  useEffect(() => {
    setOrigin(window.location.origin)
    setTab(tabFromHash())
    readJson('/api/site-audit/report').then(setReport).catch(() => {})
    const onHash = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.title = `Client guide — ${brand.name}`
  }, [brand.name])

  function openTab(id) {
    setTab(id)
    setForm((current) => ({ ...current, section: id }))
    window.history.replaceState(null, '', id === 'overview' ? '/handover' : `/handover#${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const credentials = useMemo(
    () => [
      { label: 'Demo website', value: demoUrl, href: '/', copy: demoUrl, accent: true },
      { label: 'Login URL (Staff desk)', value: loginUrl, href: '/staff', copy: loginUrl, accent: true },
      { label: 'Login email', value: HANDOVER_CREDENTIALS.email, copy: HANDOVER_CREDENTIALS.email },
      { label: 'Password', value: HANDOVER_CREDENTIALS.password, copy: HANDOVER_CREDENTIALS.password },
      { label: 'This guide', value: shareUrl, href: shareUrl, copy: shareUrl },
    ],
    [demoUrl, loginUrl, shareUrl],
  )

  async function sendFeedback(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const res = await fetch(`${CMS_URL}/api/handover-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      toast.success('Thank you — your note was sent.')
      setForm({ name: '', email: '', section: tab, message: '' })
    } catch {
      toast.error('Could not send that note. Try again in a few minutes.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link to="/" className={styles.brand}>
          {brand.logo ? <img src={brand.logo} alt="" /> : null}
          <div>
            <strong>{brand.name}</strong>
            <small>Client handover guide</small>
          </div>
        </Link>
        <div className={styles.topLinks}>
          <button type="button" onClick={() => copyText(shareUrl, 'Guide link copied.')}>
            Copy guide link
          </button>
          <a href="/">View demo</a>
          <a href="/staff">Staff login</a>
        </div>
      </header>

      <div className={styles.heroStrip}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Development demo</p>
            <h2 className={styles.heroTitle}>Review the site, then manage content in Staff desk</h2>
            <p className={styles.heroLead}>
              This <mark className={styles.term}>demo URL</mark> is for development and approval only.
              Data added while testing will be <mark className={styles.term}>migrated to the real domain</mark> once
              the demo is approved.
            </p>
          </div>
          <div className={styles.heroLinks}>
            <a className={styles.heroPrimary} href="/">
              Open demo website
            </a>
            <a className={styles.heroSecondary} href="/staff">
              Open Staff desk login
            </a>
            {report ? (
              <button type="button" className={styles.heroAudit} onClick={() => openTab('audit')}>
                Site audit · <strong>{report.score}%</strong>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.contents} aria-label="Guide contents">
          <p>Contents</p>
          <ol>
            {HANDOVER_TABS.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={tab === item.id ? styles.active : undefined}
                  onClick={() => openTab(item.id)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className={styles.chapter}>
          <p className={styles.kicker}>Section {String(chapter).padStart(2, '0')}</p>
          <h1>{section.title}</h1>
          <p className={styles.lead}>
            <Rich text={section.lead} />
          </p>

          {(tab === 'access' || tab === 'overview') && (
            <div className={styles.creds}>
              <p className={styles.credsTitle}>Quick links</p>
              {credentials.map((row) => (
                <div key={row.label} className={row.accent ? styles.credAccent : undefined}>
                  <span>{row.label}</span>
                  <div className={styles.credRow}>
                    {row.href ? (
                      <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                        {row.value}
                      </a>
                    ) : (
                      <strong>{row.value}</strong>
                    )}
                    {row.copy ? (
                      <button type="button" onClick={() => copyText(row.copy, 'Copied.')}>
                        Copy
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {tab === 'access' ? (
                <p className={styles.warn}>
                  Share this guide only with your team. Change the password in <mark className={styles.term}>My account</mark>{' '}
                  after go-live if you want it private.
                </p>
              ) : (
                <p className={styles.warn}>
                  Sign in only at the <mark className={styles.term}>Staff desk</mark>. Use it to manage all website content.
                </p>
              )}
            </div>
          )}

          {section.blocks.map((block) => (
            <section key={block.heading} className={styles.block}>
              <h2>
                <span className={styles.h2Mark} aria-hidden="true" />
                {block.heading}
              </h2>
              {block.body ? (
                <p>
                  <Rich text={block.body} />
                </p>
              ) : null}

              {block.callout === 'demo' ? (
                <aside className={styles.callout}>
                  <strong>Remember</strong>
                  <p>
                    Demo = review &amp; testing. Approved content moves to your <mark className={styles.term}>real domain</mark>{' '}
                    at launch.
                  </p>
                </aside>
              ) : null}

              {block.features?.length ? (
                <ul className={styles.featureGrid}>
                  {block.features.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </li>
                  ))}
                </ul>
              ) : null}

              {tab === 'manage' ? (
                <div className={styles.topicLinks}>
                  {MANAGE_LINKS.map((id) => {
                    const item = HANDOVER_TABS.find((t) => t.id === id)
                    if (!item) return null
                    return (
                      <button key={id} type="button" onClick={() => openTab(id)}>
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}

              {block.steps?.length ? (
                <ol className={styles.steps}>
                  {block.steps.map((step) => (
                    <li key={step}>
                      <Rich text={step} />
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          ))}

          {tab === 'overview' && report ? (
            <section className={styles.block}>
              <h2>
                <span className={styles.h2Mark} aria-hidden="true" />
                Site audit snapshot
              </h2>
              <p>
                Live readiness from the demo content:{' '}
                <mark className={styles.term}>{report.score}% ready</mark>.
              </p>
              <button type="button" className={styles.auditJump} onClick={() => openTab('audit')}>
                Open full site audit
              </button>
            </section>
          ) : null}

          {tab === 'audit' && <SiteAuditBoard report={report} />}

          {tab === 'feedback' && (
            <form className={styles.form} onSubmit={sendFeedback}>
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label>
                About
                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                  {SECTIONS.map((id) => (
                    <option key={id} value={id}>
                      {HANDOVER_TABS.find((item) => item.id === id)?.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.full}>
                What should we change or improve?
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </label>
              <button type="submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send a note'}
              </button>
            </form>
          )}

          <footer className={styles.foot}>
            <p>
              Prepared by{' '}
              <a href="https://iremetech.com" target="_blank" rel="noopener noreferrer">
                Ireme Tech
              </a>{' '}
              for {brand.name}.
            </p>
          </footer>
        </article>
      </div>
    </div>
  )
}
