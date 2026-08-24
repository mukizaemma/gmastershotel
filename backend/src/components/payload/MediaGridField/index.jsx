'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FieldLabel, useField, useListDrawer } from '@payloadcms/ui'
import { prepareUploadFiles, uploadPreparedFile } from '../prepareImage.js'
import './mediaGridField.css'

function mediaId(value) {
  if (!value) return ''
  if (typeof value === 'object') return value.id || value._id || ''
  return String(value)
}

function mediaSrc(doc) {
  if (!doc || typeof doc !== 'object') return ''
  return doc.thumbnailURL || doc.sizes?.thumbnail?.url || doc.url || ''
}

function imageKey(field) {
  const upload = (field?.fields || []).find((item) => item.type === 'upload' || item.name === 'photo' || item.name === 'image')
  return upload?.name || 'photo'
}

function asDocs(selected) {
  if (!selected) return []
  if (Array.isArray(selected)) {
    return selected.map((item) => (typeof item === 'object' ? item : { id: mediaId(item) })).filter((doc) => mediaId(doc))
  }
  const docs = []
  if (typeof selected.forEach === 'function') {
    selected.forEach((isOn, id) => {
      if (isOn) docs.push({ id: mediaId(id) })
    })
  }
  return docs.filter((doc) => mediaId(doc))
}

export function MediaGridField({ field, path, readOnly }) {
  const { value, setValue } = useField({ path })
  const key = useMemo(() => imageKey(field), [field])
  const rows = (Array.isArray(value) ? value : []).filter((row) => mediaId(row?.[key]))
  const rowIds = rows.map((row) => mediaId(row?.[key])).join('|')
  const max = field?.maxRows || 24
  const [previews, setPreviews] = useState({})
  const previewsRef = useRef(previews)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const fileRef = useRef(null)
  const [ListDrawer, , { openDrawer, closeDrawer }] = useListDrawer({
    collectionSlugs: ['media'],
    uploads: true,
  })

  previewsRef.current = previews

  useEffect(() => {
    const missing = []
    const fromValue = {}
    for (const row of rows) {
      const photo = row?.[key]
      const id = mediaId(photo)
      if (!id) continue
      if (typeof photo === 'object' && mediaSrc(photo) && !previewsRef.current[id]) {
        fromValue[id] = photo
      } else if (!previewsRef.current[id] && !fromValue[id]) {
        missing.push(id)
      }
    }
    if (Object.keys(fromValue).length) {
      setPreviews((current) => ({ ...current, ...fromValue }))
    }
    if (!missing.length) return undefined

    let cancelled = false
    Promise.all(
      missing.map((id) =>
        fetch(`/api/media/${id}?depth=0`, { credentials: 'include' }).then((res) => (res.ok ? res.json() : null)),
      ),
    )
      .then((docs) => {
        if (cancelled) return
        setPreviews((current) => {
          const next = { ...current }
          for (const doc of docs) {
            if (doc?.id) next[doc.id] = doc
          }
          return next
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [key, rowIds])

  function remember(docs) {
    setPreviews((current) => {
      const next = { ...current }
      for (const doc of docs) {
        const id = mediaId(doc)
        if (id && typeof doc === 'object' && mediaSrc(doc)) next[id] = doc
      }
      return next
    })
  }

  function addDocs(docs) {
    const incoming = (Array.isArray(docs) ? docs : [docs]).filter((doc) => mediaId(doc))
    if (!incoming.length) return
    remember(incoming)
    const next = [...rows]
    for (const doc of incoming) {
      const id = mediaId(doc)
      if (!id || next.length >= max) continue
      if (next.some((row) => mediaId(row?.[key]) === id)) continue
      next.push({ [key]: id })
    }
    setValue(next)
  }

  async function pickFiles(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    const room = Math.max(0, max - rows.length)
    if (!room) return
    setBusy(true)
    setNote('')
    try {
      const prepared = await prepareUploadFiles(files.slice(0, room))
      const uploaded = []
      for (const [index, item] of prepared.entries()) {
        setNote(`Uploading ${index + 1} of ${prepared.length}…`)
        uploaded.push(await uploadPreparedFile(item.file))
        URL.revokeObjectURL(item.preview)
      }
      addDocs(uploaded)
      const resized = prepared.filter((item) => item.resized).length
      setNote(
        resized
          ? `${uploaded.length} photo${uploaded.length === 1 ? '' : 's'} added (${resized} resized).`
          : `${uploaded.length} photo${uploaded.length === 1 ? '' : 's'} added.`,
      )
    } catch {
      window.alert('Could not upload these images. Try again, or pick them from the library.')
    } finally {
      setBusy(false)
    }
  }

  function removeAt(index) {
    setValue(rows.filter((_, i) => i !== index))
  }

  return (
    <div className="media-grid-field">
      <FieldLabel label={field?.label || field?.labels?.plural || 'Photos'} path={path} />
      <p className="media-grid-field__hint">
        Choose several photos at once — they upload together. Files over 700KB are resized first.
      </p>

      {rows.length > 0 && (
        <div className="media-grid-field__grid">
          {rows.map((row, index) => {
            const id = mediaId(row?.[key])
            const src = mediaSrc(previews[id]) || mediaSrc(row?.[key])
            return (
              <article key={id || index}>
                {src ? <img src={src} alt="" /> : <div className="media-grid-field__empty">{busy ? '…' : 'Loading'}</div>}
                {!readOnly && (
                  <button type="button" onClick={() => removeAt(index)}>
                    Remove
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}

      {!readOnly && rows.length < max && (
        <div className="media-grid-field__actions">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={pickFiles}
          />
          <button type="button" disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? 'Uploading…' : 'Add images'}
          </button>
          <button type="button" onClick={openDrawer} disabled={busy}>
            From library
          </button>
          {note ? <small>{note}</small> : null}
        </div>
      )}

      <ListDrawer
        allowCreate={false}
        enableRowSelections
        onSelect={(args) => {
          addDocs([args?.doc || args?.value || args])
          closeDrawer()
        }}
        onBulkSelect={(selected) => {
          addDocs(asDocs(selected))
          closeDrawer()
        }}
      />
    </div>
  )
}
