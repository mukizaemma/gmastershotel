export function mediaId(value) {
  if (!value) return ''
  if (typeof value === 'object') return String(value.id || value._id || '')
  return String(value)
}

export function galleryPhotoIds(row) {
  return (row?.gallery || []).map((item) => mediaId(item?.photo)).filter(Boolean)
}

export function coverMedia(row) {
  return row?.image || row?.gallery?.[0]?.photo || row?.gallery?.[0]?.image || ''
}

export function mediaUrlFrom(value) {
  if (!value || typeof value !== 'object') return ''
  return value.thumbnailURL || value.sizes?.thumbnail?.url || value.url || ''
}

export async function populateRoomCover(doc, req, cache) {
  if (!doc) return doc
  const store = cache || new Map()
  doc.imageCount = countRoomImages(doc)
  if (mediaUrlFrom(doc.image) || mediaUrlFrom(doc.gallery?.[0]?.photo)) {
    if (!mediaUrlFrom(doc.image) && mediaUrlFrom(doc.gallery?.[0]?.photo)) {
      doc.image = doc.gallery[0].photo
    }
    return doc
  }

  const id = mediaId(coverMedia(doc))
  if (!id || !req?.payload) return doc

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
  if (media && mediaUrlFrom(media)) doc.image = media
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

export function syncRoomCover(data, originalDoc) {
  if (!data) return data

  const galleryProvided = Object.prototype.hasOwnProperty.call(data, 'gallery')
  const gallery = galleryProvided ? data.gallery : originalDoc?.gallery
  const image = Object.prototype.hasOwnProperty.call(data, 'image') ? data.image : originalDoc?.image
  const photos = galleryPhotoIds({ gallery })
  const cover = mediaId(image)
  const previous = mediaId(originalDoc?.image)

  if (galleryProvided && photos.length === 0) {
    data.image = null
    data.gallery = []
  } else if (cover && cover !== previous) {
    data.image = cover
    data.gallery = [cover, ...photos.filter((id) => id !== cover)].map((photo) => ({ photo }))
  } else if (photos.length) {
    data.image = photos[0]
    data.gallery = photos.map((photo) => ({ photo }))
  } else if (cover) {
    data.image = cover
    data.gallery = [{ photo: cover }]
  } else {
    data.image = null
  }

  data.imageCount = countRoomImages(data)
  return data
}
