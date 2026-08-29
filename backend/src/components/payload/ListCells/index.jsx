'use client'

import React from 'react'
import { Link, useConfig } from '@payloadcms/ui'
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
      <span className="room-title-cell__edit">Edit</span>
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
