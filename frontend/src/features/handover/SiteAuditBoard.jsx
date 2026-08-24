import { useMemo, useState } from 'react'
import styles from './SiteAuditBoard.module.css'

export default function SiteAuditBoard({ report, fixKey = 'staff' }) {
  const [openGroup, setOpenGroup] = useState('all')
  const [showReady, setShowReady] = useState(false)

  const groups = useMemo(() => {
    if (!report) return []
    if (openGroup === 'all') return report.groups
    return report.groups.filter((group) => group.id === openGroup)
  }, [openGroup, report])

  if (!report) return <p>Checking website content…</p>

  const missing = report.missing?.length ?? report.total - report.passed
  const nextItems = (report.next || []).map((item) => ({
    ...item,
    href: item.href || item.fix?.[fixKey],
  }))

  return (
    <div className={styles.board}>
      <p className={styles.scoreline}>
        <strong>{report.score}%</strong> of the checked items are in place.
        {missing === 0
          ? ' Everything on this list is ready.'
          : ` ${missing} still need attention.`}
      </p>
      <p className={styles.hint}>{report.grade.hint}</p>

      {nextItems.length > 0 && (
        <div className={styles.next}>
          <p>Start here</p>
          <ol>
            {nextItems.map((item) => (
              <li key={item.id}>
                <span>
                  {item.label}
                  {item.detail ? <small>{item.detail}</small> : null}
                </span>
                {item.href || item.fix?.[fixKey] ? (
                  <a href={item.href || item.fix[fixKey]}>{item.cta || item.fix?.cta || 'Fix this'}</a>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      )}

      <ul className={styles.areas}>
        <li>
          <button
            type="button"
            className={openGroup === 'all' ? styles.on : undefined}
            onClick={() => setOpenGroup('all')}
          >
            All areas
          </button>
        </li>
        {report.groups.map((group) => (
          <li key={group.id}>
            <button
              type="button"
              className={openGroup === group.id ? styles.on : undefined}
              onClick={() => setOpenGroup(group.id === openGroup ? 'all' : group.id)}
            >
              {group.label} ({group.passed}/{group.total})
            </button>
          </li>
        ))}
      </ul>

      {groups.map((group) => {
        const gaps = group.items.filter((item) => !item.pass)
        const ready = group.items.filter((item) => item.pass)
        return (
          <section key={group.id} className={styles.section}>
            <h3>
              {group.label}
              <span>
                {gaps.length ? `${gaps.length} to finish` : 'Complete'}
              </span>
            </h3>

            {gaps.length > 0 && (
              <ol className={styles.gaps}>
                {gaps.map((item) => (
                  <li key={item.id}>
                    <p>{item.label}</p>
                    {item.detail && <small>{item.detail}</small>}
                    {item.fix?.[fixKey] && (
                      <a href={item.fix[fixKey]}>{item.fix.cta || 'Fix this'}</a>
                    )}
                  </li>
                ))}
              </ol>
            )}

            {ready.length > 0 && (
              <details className={styles.ready} {...(showReady ? { open: true } : {})}>
                <summary>
                  {ready.length} ready item{ready.length === 1 ? '' : 's'}
                </summary>
                <ul>
                  {ready.map((item) => (
                    <li key={item.id}>
                      <p>{item.label}</p>
                      {item.detail && <small>{item.detail}</small>}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )
      })}

      {missing > 0 && (
        <button type="button" className={styles.toggle} onClick={() => setShowReady((value) => !value)}>
          {showReady ? 'Hide completed items' : 'Show completed items'}
        </button>
      )}
    </div>
  )
}
