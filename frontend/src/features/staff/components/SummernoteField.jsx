import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import 'summernote/dist/summernote-lite.css'
import 'summernote/dist/summernote-lite.js'
import styles from './SummernoteField.module.css'

window.jQuery = window.$ = $

export default function SummernoteField({ label, value, onChange, height = 180, className = 'full' }) {
  const holder = useRef(null)
  const onChangeRef = useRef(onChange)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  onChangeRef.current = onChange

  useEffect(() => {
    const el = holder.current
    if (!el || typeof $.fn.summernote !== 'function') {
      setFailed(true)
      return undefined
    }

    const $el = $(el)
    try {
      $el.summernote({
        height,
        disableDragAndDrop: true,
        dialogsInBody: true,
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['link']],
        ],
        callbacks: {
          onChange(contents) {
            onChangeRef.current(contents)
          },
        },
      })
      $el.summernote('code', value || '')
      setReady(true)
    } catch {
      setFailed(true)
    }

    return () => {
      try {
        $el.summernote('destroy')
      } catch {
        // modal already unmounted
      }
    }
    // Mount once per modal/panel open; parent remounts with a new key when content changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) {
    return (
      <label className={`staffField ${className} ${styles.wrap}`}>
        {label}
        <textarea
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          rows={8}
          aria-label={typeof label === 'string' ? label : 'Rich text'}
        />
        <span className={styles.fallbackNote}>Editor toolbar unavailable — you can still edit HTML here.</span>
      </label>
    )
  }

  return (
    <div className={`staffField ${className} ${styles.wrap}`}>
      <span className={styles.label}>{label}</span>
      {!ready ? <div className={styles.loading} aria-hidden="true" /> : null}
      <div ref={holder} className={ready ? undefined : styles.pending} />
    </div>
  )
}
