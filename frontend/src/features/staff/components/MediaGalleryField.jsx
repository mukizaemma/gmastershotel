import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { mediaUrl } from '@features/hotel/adapters'
import { mediaId, staffClient } from '../api/staffClient'
import { formatBytes, prepareUploadFiles, uploadMediaFile } from '../lib/prepareImage'
import MediaLibraryPicker from './MediaLibraryPicker'
import styles from './MediaField.module.css'

function unwrapDoc(payload) {
  if (!payload) return null
  if (payload.doc && (payload.doc.id || payload.doc.url)) return payload.doc
  if (payload.id || payload.url || payload.filename) return payload
  return payload.docs?.[0] || null
}

function previewSrc(item) {
  return mediaUrl(item)
}

async function loadMedia(value) {
  if (!value) return null
  if (typeof value === 'object' && previewSrc(value)) return value
  const id = mediaId(value)
  if (!id) return null
  try {
    const { data } = await staffClient.get(`/api/media/${id}?depth=0`)
    return unwrapDoc(data) || value
  } catch {
    return typeof value === 'object' ? value : { id }
  }
}

export default function MediaGalleryField({
  label = 'Photos',
  values = [],
  onChange,
  max = 12,
}) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [queue, setQueue] = useState([])
  const [busy, setBusy] = useState(false)
  const [docs, setDocs] = useState([])
  const items = (values || []).filter(Boolean)
  const ids = items.map((item) => mediaId(item)).join('|')

  useEffect(() => {
    return () => queue.forEach((item) => URL.revokeObjectURL(item.preview))
  }, [queue])

  useEffect(() => {
    let cancelled = false
    Promise.all(items.map(loadMedia)).then((next) => {
      if (!cancelled) setDocs(next.filter(Boolean))
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids])

  async function pickFiles(event) {
    const files = event.target.files
    event.target.value = ''
    if (!files?.length) return
    const room = Math.max(0, max - items.length)
    if (!room) {
      toast.error(`This set already has ${max} photos.`)
      return
    }
    try {
      const prepared = await prepareUploadFiles(Array.from(files).slice(0, room))
      setQueue((current) => {
        current.forEach((item) => URL.revokeObjectURL(item.preview))
        return prepared
      })
    } catch {
      toast.error('Could not prepare these images.')
    }
  }

  async function uploadQueue() {
    if (!queue.length) return
    setBusy(true)
    try {
      const uploaded = []
      for (const item of queue) {
        uploaded.push(await uploadMediaFile(staffClient, item.file))
      }
      onChange([...items, ...uploaded].slice(0, max))
      queue.forEach((item) => URL.revokeObjectURL(item.preview))
      setQueue([])
      toast.success(
        `${uploaded.length} image${uploaded.length === 1 ? '' : 's'} added.`,
      )
    } catch {
      toast.error('Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  function removeAt(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  function move(index, dir) {
    const to = index + dir
    if (to < 0 || to >= items.length) return
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  function addFromLibrary(files) {
    const incoming = (Array.isArray(files) ? files : [files]).filter(Boolean)
    const known = new Set(items.map((item) => mediaId(item)))
    const next = incoming.filter((file) => !known.has(mediaId(file)))
    onChange([...items, ...next].slice(0, max))
  }

  const shown = docs.length ? docs : items

  return (
    <div className={`${styles.field} ${styles.galleryField}`}>
      {label && <span className={styles.label}>{label}</span>}
      <p className={styles.hint}>
        Choose several photos at once — they upload together. Remove any you do not want. Files over 700KB are resized first.
      </p>

      {shown.length > 0 && (
        <div className={styles.grid}>
          {shown.map((item, index) => {
            const src = previewSrc(item)
            return (
              <article key={mediaId(item) || index} className={styles.queueItem}>
                {src ? <img src={src} alt="" /> : <div className={styles.emptyTile}>Loading photo…</div>}
                <div>
                  <small>{index === 0 ? 'First photo' : `Photo ${index + 1}`}</small>
                  <div className={styles.tileActions}>
                    <button type="button" className={styles.btn} disabled={index === 0} onClick={() => move(index, -1)}>
                      ←
                    </button>
                    <button
                      type="button"
                      className={styles.btn}
                      disabled={index === shown.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      →
                    </button>
                    <button type="button" className={styles.link} onClick={() => removeAt(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {queue.length > 0 && (
        <div className={styles.pendingBlock}>
          <strong>Ready to upload ({queue.length})</strong>
          <div className={styles.grid}>
            {queue.map((item, index) => (
              <article key={index} className={styles.queueItem}>
                <img src={item.preview} alt="" />
                <div>
                  <p>Photo {index + 1}</p>
                  <small>
                    {item.resized
                      ? `${formatBytes(item.originalSize)} → ${formatBytes(item.finalSize)} resized`
                      : `${formatBytes(item.finalSize)} — kept as-is`}
                  </small>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={uploadQueue} disabled={busy}>
              {busy ? 'Uploading…' : `Upload ${queue.length} image${queue.length === 1 ? '' : 's'}`}
            </button>
            <button
              type="button"
              className={styles.link}
              disabled={busy}
              onClick={() => {
                queue.forEach((item) => URL.revokeObjectURL(item.preview))
                setQueue([])
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length < max && queue.length === 0 && (
        <div className={styles.galleryActions}>
          <label className={styles.btn}>
            Add images
            <input type="file" accept="image/*" multiple hidden onChange={pickFiles} />
          </label>
          <button type="button" className={styles.library} onClick={() => setLibraryOpen(true)}>
            From library
          </button>
        </div>
      )}

      <MediaLibraryPicker
        open={libraryOpen}
        multiple
        title="Add existing images"
        onClose={() => setLibraryOpen(false)}
        onSelectMany={addFromLibrary}
      />
    </div>
  )
}
