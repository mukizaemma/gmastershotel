function text(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  if (value.root) return lexicalText(value.root)
  return ''
}

function lexicalText(node) {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (!Array.isArray(node.children)) return ''
  return node.children.map(lexicalText).join(' ').trim()
}

function filled(value) {
  return text(value).length > 0
}

function hasMedia(value) {
  if (!value) return false
  if (typeof value === 'object') return Boolean(value.id || value.url || value.filename)
  return String(value).length > 0
}

function check(id, label, pass, fix, detail = '') {
  return { id, label, pass: Boolean(pass), fix, detail }
}

function companyFix(hash = '') {
  return {
    staff: `/staff/settings${hash}`,
    admin: '/admin/globals/company',
    cta: 'Edit site settings',
  }
}

function roomFix(room) {
  return {
    staff: `/staff/accommodation?edit=${room.id}`,
    admin: `/admin/collections/rooms/${room.id}`,
    cta: `Edit ${room.name || 'room'}`,
  }
}

function scoreOf(items) {
  if (!items.length) return 0
  return Math.round((items.filter((item) => item.pass).length / items.length) * 100)
}

function grade(score) {
  if (score >= 90) return { label: 'Ready', hint: 'Content looks complete. Review photos and wording when you like.' }
  if (score >= 70) return { label: 'Almost there', hint: 'A few gaps remain. Focus on the failed checks below.' }
  if (score >= 45) return { label: 'Needs work', hint: 'Guests will notice missing rooms, photos, or contact details.' }
  return { label: 'Incomplete', hint: 'Fill the failed items first so the public site has the basics.' }
}

function pageHeadline(doc) {
  return filled(doc?.hero?.headline) || filled(doc?.headline)
}

function pageImage(doc, fallback) {
  return (
    hasMedia(doc?.hero?.backgroundImage) ||
    hasMedia(doc?.backgroundImage) ||
    hasMedia(doc?.hero?.image) ||
    hasMedia(fallback)
  )
}

const PAGE_FIX = { staff: '/staff/pages', admin: '/admin/globals/pages', cta: 'Edit pages' }

const PAGES = [
  { key: 'home', slug: 'home-page', label: 'Home', staff: '/staff/pages?open=home-page', admin: '/admin/globals/pages', cta: 'Edit home' },
  { key: 'about', slug: 'about-page', label: 'About', staff: '/staff/pages?open=about-page', admin: '/admin/globals/pages', cta: 'Edit about' },
  { key: 'rooms', slug: 'rooms-page', label: 'Accommodation', staff: '/staff/pages?open=rooms-page', admin: '/admin/globals/pages', cta: 'Edit accommodation page' },
  { key: 'barRestaurant', slug: 'bar-restaurant-page', label: 'Bar & Restaurant', staff: '/staff/pages?open=bar-restaurant-page', admin: '/admin/globals/pages', cta: 'Edit bar & restaurant' },
  { key: 'thingsToDo', slug: 'things-to-do-page', label: 'Things to do', staff: '/staff/pages?open=things-to-do-page', admin: '/admin/globals/pages', cta: 'Edit things to do' },
  { key: 'gallery', slug: 'gallery-page', label: 'Gallery page', staff: '/staff/pages?open=gallery-page', admin: '/admin/globals/pages', cta: 'Edit gallery page' },
  { key: 'contact', slug: 'contact-page', label: 'Contact', staff: '/staff/pages?open=contact-page', admin: '/admin/globals/pages', cta: 'Edit contact' },
  { key: 'booking', slug: 'booking-page', label: 'Booking', staff: '/staff/pages?open=booking-page', admin: '/admin/globals/pages', cta: 'Edit booking page' },
  { key: 'policy', slug: 'policy-page', label: 'Booking policy', staff: '/staff/pages?open=policy-page', admin: '/admin/globals/pages', cta: 'Edit booking policy' },
]

export async function buildSiteAuditReport(payload) {
  const [company, rooms, amenities, media, experiences, menuItems, pagesDoc] = await Promise.all([
    payload.findGlobal({ slug: 'company', depth: 0, overrideAccess: true }),
    payload.find({ collection: 'rooms', limit: 100, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'amenities', limit: 100, depth: 0, overrideAccess: true }),
    payload.find({
      collection: 'media',
      limit: 300,
      depth: 0,
      overrideAccess: true,
      where: { showOnGallery: { equals: true } },
    }),
    payload.find({ collection: 'experiences', limit: 100, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'menu-items', limit: 200, depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'pages', depth: 0, overrideAccess: true }),
  ])
  const defaultHeader = pagesDoc?.defaultHeaderImage

  const companyItems = [
    check('company-name', 'Property name', filled(company?.name), companyFix(), 'Shown in the header and emails'),
    check('company-logo', 'Logo', hasMedia(company?.logo), companyFix(), 'Used in the header and admin'),
    check('company-phone', 'Phone', filled(company?.phone), companyFix(), 'Contact page and footer'),
    check('company-email', 'Email', filled(company?.email), companyFix(), 'Contact page and footer'),
    check('company-whatsapp', 'WhatsApp number', filled(company?.whatsapp), companyFix(), 'Click-to-chat on Contact'),
    check('company-address', 'Address', filled(company?.address), companyFix(), 'Contact page and footer'),
    check(
      'company-map',
      'Map link or embed',
      filled(company?.mapUrl) || filled(company?.mapEmbed),
      companyFix(),
      'Paste a Google Maps share link or iframe embed',
    ),
    check(
      'company-seo-title',
      'SEO title',
      filled(company?.seoTitle),
      companyFix('#seo'),
      'Browser tab title on the homepage — Site settings → SEO title',
    ),
    check(
      'company-seo-desc',
      'SEO description',
      filled(company?.seoDescription),
      companyFix('#seo'),
      'Search snippet under the title — Site settings → SEO description',
    ),
  ]

  const roomDocs = rooms?.docs || []
  const roomItems = [
    check(
      'rooms-count',
      'At least one room is published',
      roomDocs.length > 0,
      { staff: '/staff/accommodation', admin: '/admin/collections/rooms', cta: 'Add a room' },
      roomDocs.length ? `${roomDocs.length} room${roomDocs.length === 1 ? '' : 's'}` : 'Add a room type so guests can book',
    ),
  ]

  roomDocs.forEach((room) => {
    const name = room.name || 'Untitled room'
    const fix = roomFix(room)
    const galleryCount = (room.gallery || []).filter((row) => hasMedia(row.photo)).length
    const featureCount = (room.features || []).length
    const bed = filled(room.specs?.bed)
    const occupancy = filled(room.specs?.occupancy)
    roomItems.push(
      check(`room-${room.id}-photo`, `${name} — main photo`, hasMedia(room.image), fix, 'First photo guests see on the room card'),
      check(
        `room-${room.id}-gallery`,
        `${name} — extra photos`,
        galleryCount >= 2 || (galleryCount >= 1 && hasMedia(room.image)),
        fix,
        galleryCount ? `${galleryCount} gallery photo${galleryCount === 1 ? '' : 's'}` : 'Add at least two photos on the room form',
      ),
      check(`room-${room.id}-copy`, `${name} — description`, filled(room.description), fix, 'Short overview on the room page'),
      check(`room-${room.id}-price`, `${name} — nightly rate`, Number(room.pricePerNight) > 0, fix, 'Required before guests can book'),
      check(
        `room-${room.id}-specs`,
        `${name} — bed and occupancy`,
        bed && occupancy,
        fix,
        !bed && !occupancy
          ? 'Fill Bed and Guests on the room form'
          : !bed
            ? 'Fill Bed (e.g. King / Twin)'
            : 'Fill Guests (e.g. 2 adults)',
      ),
      check(
        `room-${room.id}-amenities`,
        `${name} — room amenities`,
        featureCount >= 3,
        fix,
        featureCount ? `${featureCount} selected` : 'Tick at least three in-room amenities',
      ),
    )
  })

  const amenityDocs = amenities?.docs || []
  const amenityItems = [
    check(
      'amenities-count',
      'Hotel facilities list (at least 3)',
      amenityDocs.length >= 3,
      { staff: '/staff/amenities', admin: '/admin/collections/amenities', cta: 'Add facilities' },
      amenityDocs.length
        ? `${amenityDocs.length} facilit${amenityDocs.length === 1 ? 'y' : 'ies'} — add ${Math.max(0, 3 - amenityDocs.length)} more`
        : 'Add pool, parking, restaurant, or similar shared facilities',
    ),
    ...amenityDocs.map((row) =>
      check(
        `amenity-${row.id}-image`,
        `${row.name || 'Facility'} — photo`,
        hasMedia(row.image),
        { staff: '/staff/amenities', admin: `/admin/collections/amenities/${row.id}`, cta: 'Add a photo' },
      ),
    ),
  ]

  const galleryCount = media?.totalDocs || media?.docs?.length || 0
  const galleryItems = [
    check(
      'gallery-count',
      'Gallery has at least 8 published photos',
      galleryCount >= 8,
      { staff: '/staff/gallery', admin: '/admin/collections/media', cta: 'Open gallery' },
      galleryCount >= 8
        ? `${galleryCount} on the public gallery`
        : `${galleryCount} published — pick a gallery category on at least 8 photos`,
    ),
  ]

  const activityDocs = experiences?.docs || []
  const activityItems = [
    check(
      'activities-count',
      'At least two things to do',
      activityDocs.length >= 2,
      { staff: '/staff/things-to-do', admin: '/admin/collections/experiences', cta: 'Add activities' },
      activityDocs.length >= 2
        ? `${activityDocs.length} activit${activityDocs.length === 1 ? 'y' : 'ies'}`
        : 'Add at least two experiences with a photo and short copy',
    ),
    ...activityDocs.map((row) =>
      check(
        `activity-${row.id}`,
        `${row.name || 'Activity'} — photo and copy`,
        hasMedia(row.image) && filled(row.description),
        { staff: '/staff/things-to-do', admin: `/admin/collections/experiences/${row.id}`, cta: 'Complete this activity' },
      ),
    ),
  ]

  const hasDefaultHeader = hasMedia(defaultHeader)
  const pageItems = [
    check(
      'pages-default-header',
      'Default header image',
      hasDefaultHeader,
      PAGE_FIX,
      'One fallback photo for every page that does not have its own header',
    ),
    ...PAGES.map((page) => {
      const doc = pagesDoc?.[page.key]
      const fix = { staff: page.staff, admin: page.admin, cta: page.cta }
      if (page.slug === 'home-page') {
        const slides = doc?.hero?.slides || []
        const ready = slides.filter(
          (slide) => filled(slide.headline) && (hasMedia(slide.image) || hasDefaultHeader),
        ).length
        return check(
          'page-home',
          'Home hero slides (headline + photo)',
          ready >= 1,
          fix,
          ready ? `${ready} complete slide${ready === 1 ? '' : 's'}` : 'Add at least one slide with a headline',
        )
      }
      if (page.slug === 'policy-page') {
        return check(
          'page-policy',
          'Booking policy copy',
          pageHeadline(doc) && filled(doc?.body),
          fix,
          'Headline plus the cancellation / house-rules body',
        )
      }
      return check(
        `page-${page.slug}`,
        `${page.label} — headline`,
        pageHeadline(doc),
        fix,
        pageImage(doc, defaultHeader)
          ? 'Headline is on the public page'
          : 'Add a headline. A default header image covers the photo.',
      )
    }),
  ]

  const menuDocs = menuItems?.docs || []
  const publishedMenu = menuDocs.filter((row) => row.available !== false)
  const menuAuditItems = [
    check(
      'menu-count',
      'At least four published dishes or drinks',
      publishedMenu.length >= 4,
      { staff: '/staff/menu', admin: '/admin/collections/menu-items', cta: 'Add menu items' },
      publishedMenu.length >= 4
        ? `${publishedMenu.length} on the restaurant page`
        : `${publishedMenu.length} published — add dishes with photo, price, and ingredients`,
    ),
    ...publishedMenu.map((row) =>
      check(
        `menu-${row.id}`,
        `${row.name || 'Menu item'} — photo, price, and ingredients`,
        hasMedia(row.image) && Number(row.price) > 0 && filled(row.ingredients),
        { staff: '/staff/menu', admin: `/admin/collections/menu-items/${row.id}`, cta: 'Complete this item' },
      ),
    ),
  ]

  const groups = [
    { id: 'company', label: 'Company details', items: companyItems },
    { id: 'rooms', label: 'Rooms', items: roomItems },
    { id: 'amenities', label: 'Facilities', items: amenityItems },
    { id: 'menu', label: 'Menu items', items: menuAuditItems },
    { id: 'gallery', label: 'Gallery', items: galleryItems },
    { id: 'activities', label: 'Things to do', items: activityItems },
    { id: 'pages', label: 'Website pages', items: pageItems },
  ].map((group) => ({
    ...group,
    score: scoreOf(group.items),
    passed: group.items.filter((item) => item.pass).length,
    total: group.items.length,
  }))

  const allItems = groups.flatMap((group) => group.items)
  const score = scoreOf(allItems)
  const missing = allItems.filter((item) => !item.pass)
  const next = missing.slice(0, 3).map((item) => ({
    id: item.id,
    label: item.label,
    detail: item.detail,
    href: item.fix?.staff,
    admin: item.fix?.admin,
    cta: item.fix?.cta || 'Fix this',
  }))

  return {
    generatedAt: new Date().toISOString(),
    score,
    grade: grade(score),
    passed: allItems.filter((item) => item.pass).length,
    total: allItems.length,
    groups,
    missing,
    next,
  }
}
