const UPLOADED_EXT = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v)$/i

export function isUploadedFilename(text, filename) {
  const value = String(text || '').trim()
  if (!value) return false
  const file = String(filename || '').trim()
  if (file && (value === file || value === file.replace(/\.[^.]+$/, ''))) return true
  return UPLOADED_EXT.test(value)
}

export function displayCaption(alt, filename) {
  if (isUploadedFilename(alt, filename)) return ''
  return String(alt || '').trim()
}
