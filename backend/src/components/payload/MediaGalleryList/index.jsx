'use client'

import React from 'react'
import { formatAdminURL } from 'payload/shared'
import {
  DefaultListView,
  Link,
  SelectAll,
  SelectRow,
  Thumbnail,
  useConfig,
  useListDrawerContext,
  useListQuery,
  useSelection,
} from '@payloadcms/ui'
import './mediaGalleryList.css'

function fileSrc(doc) {
  if (!doc || typeof doc !== 'object') return ''
  return doc.thumbnailURL || doc.sizes?.thumbnail?.url || doc.url || ''
}

function MediaGalleryGrid() {
  const { data } = useListQuery()
  const { count, getSelectedIds, selected, setSelection } = useSelection()
  const { isInDrawer, onBulkSelect, onSelect } = useListDrawerContext()
  const {
    config: {
      routes: { admin: adminRoute },
      serverURL,
    },
  } = useConfig()

  const docs = data?.docs || []

  function selectedDocs() {
    const ids = typeof getSelectedIds === 'function' ? getSelectedIds() : []
    const wanted = new Set(ids.map(String))
    return docs.filter((doc) => wanted.has(String(doc.id)))
  }

  function insertSelected() {
    const chosen = selectedDocs()
    if (!chosen.length) return
    if (chosen.length > 1 && typeof onBulkSelect === 'function') {
      onBulkSelect(chosen)
      return
    }
    if (typeof onSelect === 'function') {
      onSelect({ collectionSlug: 'media', doc: chosen[0], docID: chosen[0].id })
    }
  }

  return (
    <div className="media-gallery-grid">
      <div className="media-gallery-grid__toolbar">
        {isInDrawer ? (
          <>
            <SelectAll />
            <p className="media-gallery-grid__hint">
              Click one image to add it, or tick several and insert them together.
            </p>
          </>
        ) : (
          <>
            <SelectAll />
            <span>Select files</span>
          </>
        )}
        {isInDrawer && count > 0 ? (
          <button type="button" className="media-gallery-grid__insert" onClick={insertSelected}>
            {count > 1 ? `Insert ${count} selected` : 'Insert selected'}
          </button>
        ) : null}
      </div>
      <div className="media-gallery-grid__items">
        {docs.map((doc) => {
          const src = fileSrc(doc)
          const href = formatAdminURL({
            adminRoute,
            path: `/collections/media/${doc.id}`,
            serverURL,
          })
          const isSelected = Boolean(selected?.get?.(doc.id))
          const isVideo = String(doc.mimeType || '').startsWith('video/')

          function insertThis() {
            if (typeof onSelect === 'function') {
              onSelect({ collectionSlug: 'media', doc, docID: doc.id })
              return
            }
            setSelection(doc.id)
          }

          const preview = src ? (
            <Thumbnail collectionSlug="media" doc={doc} fileSrc={src} size="expand" />
          ) : (
            <span className="media-gallery-grid__empty">{isVideo ? 'Video' : 'No preview'}</span>
          )

          return (
            <article key={doc.id} className={isSelected ? 'is-selected' : undefined}>
              <div className="media-gallery-grid__check">
                <SelectRow rowData={doc} />
              </div>
              {isInDrawer ? (
                <button type="button" className="media-gallery-grid__thumb" onClick={insertThis}>
                  {preview}
                  {isVideo ? <span className="media-gallery-grid__badge">Video</span> : null}
                </button>
              ) : (
                <Link className="media-gallery-grid__thumb" href={href}>
                  {preview}
                  {isVideo ? <span className="media-gallery-grid__badge">Video</span> : null}
                </Link>
              )}
              <p className="media-gallery-grid__name" title={doc.alt || doc.filename || ''}>
                {doc.alt || doc.filename || 'Untitled'}
              </p>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function MediaGalleryList(props) {
  return (
    <div className="media-gallery-list">
      <DefaultListView {...props} Table={<MediaGalleryGrid />} />
    </div>
  )
}
