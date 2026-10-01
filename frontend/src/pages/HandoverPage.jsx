import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CMS_URL } from '@lib/apiClient'
import { brandFromCompany } from '@features/hotel/companyBrand'
import { useSiteLayout } from '@lib/queries/useSiteLayout'
import { HANDOVER_SECTIONS, HANDOVER_TABS } from '@features/handover/guide'
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
  'availability',
  'reviews',
  'hosting',
]

function tabFromHash() {
  const id = String(window.location.hash || '').replace('#', '')
  return SECTIONS.includes(id) ? id : 'overview'
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
  const [origin, setOrigin] = useState('')
  const [form, setForm] = useState({ name: '', email: '', section: 'overview', message: '' })
  const [account, setAccount] = useState({ name: '', email: '', password: '', confirm: '' })
  const [registered, setRegistered] = useState(false)
  const [busy, setBusy] = useState(false)
  const [registerBusy, setRegisterBusy] = useState(false)
  const { data: layout } = useSiteLayout()
  const brand = brandFromCompany(layout?.company)

  const section = HANDOVER_SECTIONS[tab] || HANDOVER_SECTIONS.overview
  const chapter = HANDOVER_TABS.findIndex((item) => item.id === tab) + 1
  const siteUrl = origin || 'https://gmastershotel.com'
  const loginUrl = origin ? `${origin}/staff` : '/staff'
  const shareUrl = origin ? `${origin}/handover${tab === 'overview' ? '' : `#${tab}`}` : '/handover'

  useEffect(() => {
    setOrigin(window.location.origin)
    setTab(tabFromHash())
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

  function openRegister() {
    openTab('access')
    window.setTimeout(() => {
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const credentials = useMemo(
    () => [
      { label: 'Website', value: siteUrl, href: '/', copy: siteUrl, accent: true },
      { label: 'Staff desk', value: loginUrl, href: '/staff', copy: loginUrl, accent: true },
      { label: 'This guide', value: shareUrl, href: shareUrl, copy: shareUrl },
    ],
    [siteUrl, loginUrl, shareUrl],
  )

  async function registerAccount(event) {
    event.preventDefault()
    if (account.password !== account.confirm) {
      toast.error('The two passwords do not match.')
      return
    }
    setRegisterBusy(true)
    try {
      const res = await fetch(`${CMS_URL}/api/staff-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          password: account.password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not register.')
      setRegistered(true)
      setAccount({ name: '', email: '', password: '', confirm: '' })
      toast.success('Account created. Contact Ireme Tech for admin access.')
    } catch (err) {
      toast.error(err.message || 'Could not register.')
    } finally {
      setRegisterBusy(false)
    }
  }

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

  const quickLinks = (
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
      <p className={styles.warn}>
        This page does not show a login email or password. Register, then contact{' '}
        <mark className={styles.term}>Ireme Tech</mark> to assign admin access before you sign in at the Staff desk.
      </p>
    </div>
  )

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
          <a href="/">View website</a>
          <button type="button" className={styles.register} onClick={openRegister}>
            Register
          </button>
        </div>
      </header>

      <div className={styles.heroStrip}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Live website</p>
            <h2 className={styles.heroTitle}>The site is live. Here is what is done, and what is next.</h2>
            <p className={styles.heroLead}>
              Hosting is <mark className={styles.term}>paid and active until 1 August 2027</mark>. Still open: cover
              the <mark className={styles.term}>remaining balance</mark>, then set up social media when you are
              available.
            </p>
          </div>
          <div className={styles.heroLinks}>
            <a className={styles.heroPrimary} href="/">
              Open website
            </a>
            <button type="button" className={styles.heroSecondary} onClick={() => openTab('overview')}>
              What is done and next
            </button>
            <button type="button" className={styles.heroSecondary} onClick={openRegister}>
              Register for admin access
            </button>
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

          {tab === 'access' ? quickLinks : null}

          {tab === 'access' && (
            <section id="register" className={styles.block}>
              <h2>
                <span className={styles.h2Mark} aria-hidden="true" />
                Register
              </h2>
              <p>
                <Rich text="Create your account here. **Ireme Tech** must assign that user to admin access before the Staff desk will let you in. Write to info@iremetech.com after you register." />
              </p>
              {registered ? (
                <aside className={styles.callout}>
                  <strong>Contact Ireme Tech</strong>
                  <p>
                    Your account is saved and waiting. Email{' '}
                    <a href="mailto:info@iremetech.com">info@iremetech.com</a> and ask them to assign admin access to
                    the address you used. You cannot sign in until they do.
                  </p>
                </aside>
              ) : (
                <form className={styles.form} onSubmit={registerAccount}>
                  <label>
                    Name
                    <input
                      value={account.name}
                      onChange={(e) => setAccount({ ...account, name: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={account.email}
                      onChange={(e) => setAccount({ ...account, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      value={account.password}
                      onChange={(e) => setAccount({ ...account, password: e.target.value })}
                      minLength={8}
                      required
                      autoComplete="new-password"
                    />
                  </label>
                  <label>
                    Confirm password
                    <input
                      type="password"
                      value={account.confirm}
                      onChange={(e) => setAccount({ ...account, confirm: e.target.value })}
                      minLength={8}
                      required
                      autoComplete="new-password"
                    />
                  </label>
                  <button type="submit" disabled={registerBusy}>
                    {registerBusy ? 'Creating account…' : 'Register'}
                  </button>
                </form>
              )}
            </section>
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

              {block.note ? (
                <aside className={styles.callout}>
                  <strong>{block.note.title}</strong>
                  <p>
                    <Rich text={block.note.text} />
                  </p>
                </aside>
              ) : null}

              {block.done?.length ? (
                <ul className={styles.statusList}>
                  {block.done.map((item) => (
                    <li key={item.title}>
                      <span className={styles.statusMark} aria-hidden="true">
                        ✓
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>
                          <Rich text={item.text} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {block.next?.length ? (
                <ol className={`${styles.statusList} ${styles.statusNext}`}>
                  {block.next.map((item, index) => (
                    <li key={item.title}>
                      <span className={`${styles.statusMark} ${styles.statusMarkNext}`} aria-hidden="true">
                        {index + 1}
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>
                          <Rich text={item.text} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
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

              {block.crud?.length ? (
                <dl className={styles.crud}>
                  {block.crud.map((row) => (
                    <div key={row.action}>
                      <dt>{row.action}</dt>
                      <dd>
                        <Rich text={row.text} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          ))}

          {tab === 'overview' ? quickLinks : null}

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
