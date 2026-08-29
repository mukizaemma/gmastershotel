'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import { toast } from 'sonner'
import { formatAdminURL } from 'payload/shared'
import { countRoomImages } from '../../../modules/hotel/rooms/roomImages.js'
import './listCells.css'

function thumbSrc(value) {
  if (!value || typeof value !== 'object') return ''
  return value.thumbnailURL || value.sizes?.thumbnail?.url || value.url || ''
}

function docHref(collectionSlug, id, config) {
  if (!collectionSlug || !id) return ''
  return formatAdminURL({
    adminRoute: config.routes.admin,
    path: `/collections/${collectionSlug}/${id}`,
    serverURL: config.serverURL,
  })
}

export function ThumbnailCell({ cellData, rowData, collectionSlug }) {
  const { config } = useConfig()
  const src = thumbSrc(cellData)
  const href = docHref(collectionSlug, rowData?.id, config)

  const preview = src ? (
    <img src={src} alt="" className="list-thumb-cell__img" />
  ) : (
    <span className="list-thumb-cell__empty">No photo</span>
  )

  if (!href) return <span className="list-thumb-cell">{preview}</span>

  return (
    <Link className="list-thumb-cell" href={href} title="Edit">
      {preview}
    </Link>
  )
}

export function RoomTitleCell({ cellData, rowData, collectionSlug }) {
  const { config } = useConfig()
  const href = docHref(collectionSlug, rowData?.id, config)
  const label = cellData || 'Untitled'

  if (!href) return <span>{label}</span>

  return (
    <Link className="room-title-cell" href={href}>
      <span className="room-title-cell__name">{label}</span>
    </Link>
  )
}

export function HiddenField() {
  return null
}

export function ImageCountCell({ cellData, rowData }) {
  const stored = Number(cellData)
  const count =
    Number.isFinite(stored) && stored >= 0 && cellData !== '' && cellData != null
      ? stored
      : countRoomImages(rowData)
  return (
    <span className="image-count-cell">
      {count === 1 ? '1 photo' : `${count} photos`}
    </span>
  )
}

function frontendOrigin() {
  const fromEnv = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FRONTEND_URL) || ''
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

function publicHref(collectionSlug, row) {
  const origin = frontendOrigin()
  if (collectionSlug === 'rooms' && row?.slug) return `${origin}/accommodation/${row.slug}`
  if (collectionSlug === 'experiences') return `${origin}/things-to-do`
  if (collectionSlug === 'menu-items') return `${origin}/bar-restaurant`
  if (collectionSlug === 'amenities') return `${origin}/`
  if (collectionSlug === 'gallery-photos' || collectionSlug === 'media') return `${origin}/gallery`
  return ''
}

function rowLabel(row) {
  return row?.name || row?.guestName || row?.email || row?.caption || row?.label || 'this item'
}

function IconEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconPencil() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  )
}

export function RowActionsCell({ rowData, collectionSlug }) {
  const { config } = useConfig()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const id = rowData?.id
  const editHref = docHref(collectionSlug, id, config)
  const viewHref = publicHref(collectionSlug, rowData) || editHref
  const label = rowLabel(rowData)

  async function confirmDelete() {
    if (!id || !collectionSlug || busy) return
    setBusy(true)
    try {
      const res = await fetch(`/api/${collectionSlug}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('delete failed')
      toast.success('Deleted.')
      setStep(0)
      router.refresh()
    } catch {
      toast.error('Could not delete this item.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="row-actions-cell" onClick={(event) => event.stopPropagation()}>
      {viewHref ? (
        <a className="row-actions-cell__btn row-actions-cell__btn--view" href={viewHref} target="_blank" rel="noreferrer" title="View" aria-label="View">
          <IconEye />
        </a>
      ) : null}
      {editHref ? (
        <Link className="row-actions-cell__btn row-actions-cell__btn--edit" href={editHref} title="Edit" aria-label="Edit">
          <IconPencil />
        </Link>
      ) : null}
      <button
        type="button"
        className="row-actions-cell__btn row-actions-cell__btn--delete"
        onClick={() => setStep(1)}
        title="Delete"
        aria-label="Delete"
      >
        <IconTrash />
      </button>
      {step > 0 && typeof document !== 'undefined'
        ? createPortal(
            <div className="row-actions-confirm" role="dialog" aria-modal="true">
              <div className="row-actions-confirm__card">
                <p>
                  {step === 1
                    ? `Delete ${label}?`
                    : `Permanently delete ${label}? This cannot be undone.`}
                </p>
                <div className="row-actions-confirm__actions">
                  <button type="button" className="row-actions-confirm__ghost" disabled={busy} onClick={() => setStep(0)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="row-actions-confirm__danger"
                    disabled={busy}
                    onClick={() => (step === 1 ? setStep(2) : confirmDelete())}
                  >
                    {busy ? 'Deleting…' : step === 1 ? 'Continue' : 'Delete permanently'}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
