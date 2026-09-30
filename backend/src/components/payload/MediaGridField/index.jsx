'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FieldLabel, useField, useListDrawer } from '@payloadcms/ui'
import { prepareUploadFiles, uploadPreparedFile } from '../prepareImage.js'
import './mediaGridField.css'

function mediaId(value) {
  if (!value) return ''
  if (typeof value === 'object') return String(value.id || value._id || '')
  return String(value)
}

function unwrapDoc(payload) {
  if (!payload) return null
  if (payload.doc && (payload.doc.id || payload.doc.url || payload.doc.filename)) return payload.doc
  if (payload.id || payload.url || payload.filename) return payload
  return payload.docs?.[0] || null
}

function fileUrl(doc) {
  if (!doc || typeof doc !== 'object') return ''
  const raw = doc.url || doc.sizes?.card?.url || doc.thumbnailURL || doc.sizes?.thumbnail?.url || ''
  if (raw) {
    if (/^(https?:|blob:|data:)/i.test(raw)) return raw
    if (raw.startsWith('/')) {
      return typeof window !== 'undefined' ? `${window.location.origin}${raw}` : raw
    }
    return `/api/media/file/${raw}`
  }
  if (doc.filename) {
    return `/api/media/file/${encodeURIComponent(doc.filename)}`
  }
  return ''
}

function imageKey(field, rows) {
  const fields = field?.fields || []
  const upload = fields.find((item) => item.type === 'upload' || item.name === 'photo' || item.name === 'image')
  if (upload?.name) return upload.name
  const sample = (rows || []).find(Boolean)
  if (sample && sample.photo != null) return 'photo'
  return 'image'
}

function asDocs(selected) {
  if (!selected) return []
  if (Array.isArray(selected)) {
    return selected.map((item) => (typeof item === 'object' ? item : { id: mediaId(item) })).filter((doc) => mediaId(doc))
  }
  if (selected.doc || selected.value) {
    const doc = selected.doc || selected.value
    return mediaId(doc) ? [typeof doc === 'object' ? doc : { id: mediaId(doc) }] : []
  }
  const docs = []
  if (typeof selected.forEach === 'function') {
    selected.forEach((isOn, id) => {
      if (typeof isOn === 'object' && mediaId(isOn)) docs.push(isOn)
      else if (isOn === true) docs.push({ id: mediaId(id) })
    })
  }
  return docs.filter((doc) => mediaId(doc))
}

export function MediaGridField({ field, path, readOnly }) {
  const { value, setValue } = useField({ path })
  const rows = Array.isArray(value) ? value : []
  const key = useMemo(() => imageKey(field, rows), [field, rows])
  const max = field?.maxRows || 24
  const [previews, setPreviews] = useState({})
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const fileRef = useRef(null)
  const [ListDrawer, , { openDrawer, closeDrawer }] = useListDrawer({
    collectionSlugs: ['media'],
    uploads: true,
  })

  const rowIds = rows.map((row) => mediaId(row?.[key])).join('|')

  useEffect(() => {
    const missing = rows
      .map((row) => {
        const photo = row?.[key]
        const id = mediaId(photo)
        if (!id) return ''
        if (fileUrl(photo) || fileUrl(previews[id])) return ''
        return id
      })
      .filter(Boolean)
    if (!missing.length) return undefined

    let cancelled = false
    Promise.all(
      missing.map((id) =>
        fetch(`/api/media/${id}?depth=1`, { credentials: 'include' }).then((res) => (res.ok ? res.json() : null)),
      ),
    )
      .then((docs) => {
        if (cancelled) return
        setPreviews((current) => {
          const next = { ...current }
          for (const doc of docs) {
            const item = unwrapDoc(doc)
            const id = mediaId(item)
            const src = fileUrl(item)
            if (id && src) next[id] = src
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
        const src = doc.preview || fileUrl(doc)
        if (id && src) next[id] = src
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
        const doc = unwrapDoc(await uploadPreparedFile(item.file)) || {}
        uploaded.push({ ...doc, preview: item.preview })
      }
      addDocs(uploaded)
      setNote(`${uploaded.length} photo${uploaded.length === 1 ? '' : 's'} added.`)
    } catch {
      window.alert('Could not upload these images. Try again, or pick them from the library.')
    } finally {
      setBusy(false)
    }
  }

  function removeAt(index) {
    setValue(rows.filter((_, i) => i !== index))
  }

  function move(index, dir) {
    const to = index + dir
    if (to < 0 || to >= rows.length) return
    const next = [...rows]
    const [item] = next.splice(index, 1)
    next.splice(to, 0, item)
    setValue(next)
  }

  function tileSrc(row) {
    const photo = row?.[key]
    const id = mediaId(photo)
    return previews[id] || fileUrl(photo) || (id ? `/api/media/file/${id}` : '')
  }

  return (
    <div className="media-grid-field">
      <FieldLabel label={field?.label || field?.labels?.plural || 'Photos'} path={path} />
      <p className="media-grid-field__hint">
        Choose several photos at once — they upload together. Use Remove to drop a photo. Files over 700KB are resized first.
      </p>

      {rows.length > 0 && (
        <div className="media-grid-field__grid">
          {rows.map((row, index) => {
            const src = tileSrc(row)
            return (
              <article key={mediaId(row?.[key]) || row?.id || index}>
                {src ? (
                  <img
                    src={src}
                    alt=""
                    onError={(event) => {
                      const photo = row?.[key]
                      const fallback = fileUrl(photo)
                      if (fallback && event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback
                      }
                    }}
                  />
                ) : (
                  <div className="media-grid-field__empty">{busy ? 'Uploading…' : 'No preview'}</div>
                )}
                {!readOnly && (
                  <div className="media-grid-field__row-actions">
                    <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move earlier">
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={index === rows.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label="Move later"
                    >
                      →
                    </button>
                    <button type="button" className="media-grid-field__remove" onClick={() => removeAt(index)}>
                      Remove
                    </button>
                  </div>
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
          addDocs(asDocs(args))
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
