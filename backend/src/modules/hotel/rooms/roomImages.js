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

export function countRoomImages(row) {
  const ids = new Set()
  const cover = mediaId(row?.image)
  if (cover) ids.add(cover)
  for (const id of galleryPhotoIds(row)) ids.add(id)
  return ids.size
}

export function syncRoomCover(data, originalDoc) {
  if (!data) return data

  const gallery = Object.prototype.hasOwnProperty.call(data, 'gallery') ? data.gallery : originalDoc?.gallery
  const image = Object.prototype.hasOwnProperty.call(data, 'image') ? data.image : originalDoc?.image
  const photos = galleryPhotoIds({ gallery })
  const cover = mediaId(image)
  const previous = mediaId(originalDoc?.image)

  if (cover && cover !== previous) {
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
    if (Object.prototype.hasOwnProperty.call(data, 'gallery')) data.gallery = []
  }

  data.imageCount = countRoomImages(data)
  return data
}
