export function mediaId(value) {
  if (!value) return ''
  if (typeof value === 'object') return String(value.id || value._id || '')
  return String(value)
}

export function countRoomImages(row) {
  const ids = new Set()
  const cover = mediaId(row?.image)
  if (cover) ids.add(cover)
  for (const item of row?.gallery || []) {
    const id = mediaId(item?.photo)
    if (id) ids.add(id)
  }
  return ids.size
}
