const PHRASES = [
  [/Karongi · Lake Kivu/gi, 'Kagugu, Kigali'],
  [/Accommodation by Lake Kivu/gi, 'Accommodation in Kigali'],
  [/on the shores of Lake Kivu/gi, 'in Kagugu, Kigali'],
  [/By Lake Kivu in Karongi, with town and the shoreline close by\.?/gi, 'In Kagugu, Kigali, close to embassies and the city.'],
  [/Quiet nights, thoughtful details, and space to unwind by Lake Kivu\.?/gi, 'Quiet nights, thoughtful details, and space to unwind in Kagugu, Kigali.'],
  [/Wake up to Lake Kivu right outside your window — our most requested room\.?/gi, 'A comfortable room in Kagugu, Kigali — one of our most requested rooms.'],
  [/A quieter kind of comfort on Lake Kivu/gi, 'A quieter kind of comfort in Kagugu'],
  [/Your stay in Karongi starts here/gi, 'Your stay in Kigali starts here'],
  [/Lake Kivu right outside/gi, 'a quiet part of Kigali'],
  [/Grilled Lake Kivu Tilapia/gi, 'Grilled tilapia'],
  [/Lake Kivu Shoreline/gi, 'Hotel grounds'],
  [/Lake Kivu View/gi, 'Kigali'],
  [/Lake-View Terrace/gi, 'Quiet terrace'],
  [/take in Lake Kivu at any time of day/gi, 'enjoy a quiet moment in Kagugu'],
  [/Lake Kivu doing all the work/gi, 'the evening settling in'],
  [/comfortable serviced rooms by Lake Kivu/gi, 'comfortable serviced rooms in Kagugu, Kigali'],
  [/in Karongi — comfortable serviced rooms by Lake Kivu/gi, 'in Kagugu, Kigali'],
  [/getting around Karongi/gi, 'getting around Kigali'],
  [/anyone in Karongi/gi, 'anyone nearby in Kigali'],
  [/stay in Karongi/gi, 'stay in Kigali'],
  [/Karongi's calm/gi, "Kigali's calmer streets"],
  [/Karongi, Western Province, Rwanda/gi, 'Kagugu, Kigali, Rwanda'],
  [/~\s*3h drive from Kigali/gi, 'In Kigali — Kagugu'],
  [/From lake shore/gi, 'Kagugu, Kigali'],
  [/base by the lake/gi, 'base in Kigali'],
  [/Rest after a day by the lake/gi, 'Rest after a day in the city'],
  [/by the lake/gi, 'in Kigali'],
  [/by Lake Kivu/gi, 'in Kagugu, Kigali'],
  [/on Lake Kivu/gi, 'in Kagugu, Kigali'],
  [/Lake Kivu/gi, 'Kigali'],
  [/Karongi/g, 'Kigali'],
]

const SKIP = /\.(jpe?g|png|webp|gif|svg|avif|mp4|webm)$/i

export function rewriteLakeText(value) {
  if (typeof value === 'string') {
    if (value.startsWith('/api/') || value.startsWith('http') || SKIP.test(value)) return value
    return PHRASES.reduce((text, [pattern, next]) => text.replace(pattern, next), value)
  }
  if (Array.isArray(value)) return value.map(rewriteLakeText)
  if (value && typeof value === 'object') {
    const next = {}
    for (const [key, item] of Object.entries(value)) next[key] = rewriteLakeText(item)
    return next
  }
  return value
}

function dataWithoutMeta(doc) {
  const { id, createdAt, updatedAt, globalType, ...data } = doc
  return data
}

async function rewriteGlobal(payload, slug) {
  const current = await payload.findGlobal({ slug, depth: 0, overrideAccess: true })
  const next = rewriteLakeText(current)
  if (JSON.stringify(next) === JSON.stringify(current)) return 0
  await payload.updateGlobal({ slug, data: dataWithoutMeta(next), overrideAccess: true })
  return 1
}

async function rewriteCollection(payload, slug) {
  const result = await payload.find({ collection: slug, limit: 200, depth: 0, overrideAccess: true })
  let changed = 0
  for (const doc of result.docs || []) {
    const next = rewriteLakeText(doc)
    if (JSON.stringify(next) === JSON.stringify(doc)) continue
    await payload.update({
      collection: slug,
      id: doc.id,
      data: dataWithoutMeta(next),
      overrideAccess: true,
    })
    changed += 1
  }
  return changed
}

export async function replaceLakeCopy(payload) {
  const globals = ['pages', 'company']
  const collections = ['rooms', 'experiences', 'amenities', 'menu-items', 'gallery-photos']
  let changed = 0
  for (const slug of globals) changed += await rewriteGlobal(payload, slug)
  for (const slug of collections) changed += await rewriteCollection(payload, slug)
  if (changed) payload.logger?.info?.(`Updated ${changed} records that still mentioned Lake Kivu or Karongi.`)
}
