'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation.js'
import {
  Button,
  DefaultEditView,
  Dropzone,
  Gutter,
  SetStepNav,
  useConfig,
  useEditDepth,
} from '@payloadcms/ui'
import { toast } from 'sonner'
import { notifyAdminDocSaved } from '../AdminDocDrawer/index.jsx'
import { formatBytes, prepareUploadFiles, uploadPreparedFile } from '../prepareImage.js'
import './mediaBulkCreate.css'

const ACCEPT = 'image/*,video/mp4,video/webm,video/quicktime'

const CATEGORIES = [
  { label: 'None — do not show on gallery', value: 'none' },
  { label: 'Rooms', value: 'rooms' },
  { label: 'Bar & Restaurant', value: 'bar-restaurant' },
  { label: 'Property & views', value: 'lake-grounds' },
  { label: 'Amenities', value: 'amenities' },
]

function MediaBulkCreate() {
  const router = useRouter()
  const inDrawer = useEditDepth() > 1
  const inputRef = useRef(null)
  const urlInputRef = useRef(null)
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const listUrl = `${adminRoute || '/admin'}/collections/media`

  const [queue, setQueue] = useState([])
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [galleryCategory, setGalleryCategory] = useState('none')
  const [galleryOrder, setGalleryOrder] = useState(0)
  const queueRef = useRef(queue)
  queueRef.current = queue

  useEffect(() => {
    return () => queueRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
  }, [])

  useEffect(() => {
    if (showUrl) urlInputRef.current?.focus()
  }, [showUrl])

  async function addFiles(fileList) {
    const files = Array.from(fileList || [])
    if (!files.length) return
    try {
      const prepared = await prepareUploadFiles(files)
      setQueue((current) => [
        ...current,
        ...prepared.map((item, index) => ({
          ...item,
          id: `${item.file.name}-${item.file.size}-${Date.now()}-${index}`,
          alt: '',
        })),
      ])
      setShowUrl(false)
      setFileUrl('')
    } catch {
      toast.error('Could not prepare these files.')
    }
  }

  function removeAt(id) {
    setQueue((current) => {
      const next = current.filter((item) => item.id !== id)
      current.filter((item) => item.id === id).forEach((item) => URL.revokeObjectURL(item.preview))
      return next
    })
  }

  async function addFromUrl() {
    const src = fileUrl.trim()
    if (!src) return
    setBusy(true)
    try {
      const res = await fetch(src)
      if (!res.ok) throw new Error('fetch failed')
      const blob = await res.blob()
      const name = decodeURIComponent(src.split('/').pop()?.split('?')[0] || 'file')
      const file = new File([blob], name, { type: blob.type || 'application/octet-stream' })
      await addFiles([file])
    } catch {
      toast.error('Could not fetch that URL.')
    } finally {
      setBusy(false)
    }
  }

  async function save() {
    if (!queue.length || busy) return
    setBusy(true)
    setNote('')
    const startOrder = Number(galleryOrder) || 0
    try {
      for (const [index, item] of queue.entries()) {
        setNote(`Uploading ${index + 1} of ${queue.length}…`)
        await uploadPreparedFile(item.file, {
          alt: item.alt,
          galleryCategory,
          galleryOrder: startOrder + index,
        })
      }
      const resized = queue.filter((item) => item.resized).length
      toast.success(
        resized
          ? `${queue.length} file${queue.length === 1 ? '' : 's'} saved (${resized} resized).`
          : `${queue.length} file${queue.length === 1 ? '' : 's'} saved.`,
      )
      queue.forEach((item) => URL.revokeObjectURL(item.preview))
      if (inDrawer) {
        notifyAdminDocSaved()
        return
      }
      router.push(listUrl)
      router.refresh()
    } catch {
      toast.error('Could not upload these files. Try again.')
      setBusy(false)
      setNote('')
    }
  }

  return (
    <div className="media-bulk-create">
      {inDrawer ? null : (
        <SetStepNav
          nav={[
            { label: 'Media Gallery', url: listUrl },
            { label: 'Create New' },
          ]}
        />
      )}
      <Gutter>
        <div className="media-bulk-create__header">
          <h2>Creating new {queue.length === 1 ? 'file' : 'files'}</h2>
          <Button buttonStyle="primary" disabled={busy || !queue.length} onClick={save} size="medium" type="button">
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>

        {showUrl ? (
          <div className="media-bulk-create__url">
            <input
              onChange={(event) => setFileUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void addFromUrl()
                }
              }}
              placeholder="https://"
              ref={urlInputRef}
              type="url"
              value={fileUrl}
            />
            <Button disabled={busy || !fileUrl.trim()} onClick={() => void addFromUrl()} size="small" type="button">
              Add file
            </Button>
            <Button
              buttonStyle="secondary"
              disabled={busy}
              onClick={() => {
                setShowUrl(false)
                setFileUrl('')
              }}
              size="small"
              type="button"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="file-field media-bulk-create__dropzone">
            <div className="file-field__upload">
              <Dropzone disabled={busy} multipleFiles onChange={addFiles}>
                <div className="file-field__dropzoneContent">
                  <div className="file-field__dropzoneButtons">
                    <Button
                      buttonStyle="pill"
                      disabled={busy}
                      onClick={() => inputRef.current?.click()}
                      size="small"
                      type="button"
                    >
                      Select files
                    </Button>
                    <input
                      accept={ACCEPT}
                      aria-hidden="true"
                      hidden
                      multiple
                      onChange={(event) => {
                        void addFiles(event.target.files)
                        event.target.value = ''
                      }}
                      ref={inputRef}
                      type="file"
                    />
                    <span className="file-field__orText">or</span>
                    <Button buttonStyle="pill" disabled={busy} onClick={() => setShowUrl(true)} size="small" type="button">
                      Paste URL
                    </Button>
                  </div>
                  <p className="file-field__dragAndDropText">or drag and drop files</p>
                </div>
              </Dropzone>
            </div>
          </div>
        )}

        {queue.length > 0 && (
          <div className="media-bulk-create__queue">
            {queue.map((item) => {
              const isVideo = String(item.file.type || '').startsWith('video/')
              return (
                <article className="media-bulk-create__item" key={item.id}>
                  {isVideo ? (
                    <video className="media-bulk-create__preview" muted src={item.preview} />
                  ) : item.preview ? (
                    <img alt="" className="media-bulk-create__preview" src={item.preview} />
                  ) : (
                    <span className="media-bulk-create__empty">No preview</span>
                  )}
                  <button
                    aria-label="Remove photo"
                    className="media-bulk-create__remove"
                    disabled={busy}
                    onClick={() => removeAt(item.id)}
                    type="button"
                  >
                    ×
                  </button>
                  <div className="media-bulk-create__meta">
                    <input
                      aria-label="Caption (optional)"
                      disabled={busy}
                      onChange={(event) => {
                        const alt = event.target.value
                        setQueue((current) =>
                          current.map((entry) => (entry.id === item.id ? { ...entry, alt } : entry)),
                        )
                      }}
                      placeholder="Caption (optional)"
                      value={item.alt}
                    />
                    <small>
                      {item.resized
                        ? `${formatBytes(item.originalSize)} → ${formatBytes(item.finalSize)} resized`
                        : formatBytes(item.finalSize)}
                    </small>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <div className="media-bulk-create__fields">
          <label>
            Gallery Category
            <select
              disabled={busy}
              onChange={(event) => setGalleryCategory(event.target.value)}
              value={galleryCategory}
            >
              {CATEGORIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p>Applies to every file in this upload. Choose None to keep them in the library only.</p>
          </label>
          <label>
            Gallery Order
            <input
              disabled={busy}
              onChange={(event) => setGalleryOrder(event.target.value)}
              type="number"
              value={galleryOrder}
            />
            <p>Starting number. Each next file is one higher, so they stay in the order you added them.</p>
          </label>
        </div>
        {note ? <p className="media-bulk-create__status">{note}</p> : null}
      </Gutter>
    </div>
  )
}

export function MediaEditView(props) {
  const pathname = usePathname() || ''
  const inDrawer = useEditDepth() > 1
  const isCreate = !props.id && (/\/collections\/media\/create\/?$/.test(pathname) || inDrawer)

  if (isCreate) return <MediaBulkCreate />
  return <DefaultEditView {...props} />
}
