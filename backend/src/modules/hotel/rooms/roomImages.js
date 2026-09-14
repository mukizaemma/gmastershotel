export function mediaId(value) {
  if (!value) return ''
  if (typeof value === 'object') return String(value.id || value._id || '')
  return String(value)
}

export function galleryPhotoIds(row) {
  return (row?.gallery || []).map((item) => mediaId(item?.photo)).filter(Boolean)
}

export function coverMedia(row) {
  return row?.image || ''
}

export function mediaUrlFrom(value) {
  if (!value || typeof value !== 'object') return ''
  return value.thumbnailURL || value.sizes?.thumbnail?.url || value.url || ''
}

export async function populateRoomCover(doc, req, cache) {
  if (!doc) return doc
  const store = cache || new Map()
  doc.imageCount = countRoomImages(doc)

  const id = mediaId(doc.image)
  if (!id) {
    doc.coverUrl = ''
    return doc
  }
  if (mediaUrlFrom(doc.image)) {
    doc.coverUrl = mediaUrlFrom(doc.image)
    return doc
  }
  if (!req?.payload) return doc

  if (!store.has(id)) {
    store.set(
      id,
      req.payload
        .findByID({
          collection: 'media',
          id,
          depth: 0,
          disableErrors: true,
          overrideAccess: true,
        })
        .catch(() => null),
    )
  }

  const media = await store.get(id)
  if (media && mediaUrlFrom(media)) {
    doc.image = media
    doc.coverUrl = mediaUrlFrom(media)
  }
  return doc
}

export function absMediaUrl(src, origin = '') {
  if (!src) return ''
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src
  const base = String(origin || '').replace(/\/$/, '')
  return `${base}${src.startsWith('/') ? src : `/${src}`}`
}

export function countRoomImages(row) {
  const ids = new Set()
  const cover = mediaId(row?.image)
  if (cover) ids.add(cover)
  for (const id of galleryPhotoIds(row)) ids.add(id)
  return ids.size
}

export function syncRoomCover(data) {
  if (!data) return data
  if (Object.prototype.hasOwnProperty.call(data, 'gallery') && !Array.isArray(data.gallery)) {
    data.gallery = []
  }
  data.imageCount = countRoomImages(data)
  return data
}
