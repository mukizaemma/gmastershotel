/**
 * In-room amenities for a typical 3-star hotel.
 * Shown as checkboxes on the room form; selected keys are stored on the room.
 */
export const ROOM_AMENITY_GROUPS = [
  {
    id: 'comfort',
    label: 'Comfort',
    items: [
      { value: 'wifi', label: 'Free Wi-Fi' },
      { value: 'ac', label: 'Air conditioning' },
      { value: 'fan', label: 'Ceiling fan' },
      { value: 'heating', label: 'Heating' },
      { value: 'tv', label: 'Flat-screen TV' },
      { value: 'satellite', label: 'Satellite channels' },
      { value: 'blackout', label: 'Blackout curtains' },
      { value: 'extra-bedding', label: 'Extra pillows and blankets' },
      { value: 'mosquito', label: 'Mosquito net' },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    items: [
      { value: 'bath', label: 'Private bathroom' },
      { value: 'shower', label: 'Shower' },
      { value: 'hot-water', label: 'Hot water' },
      { value: 'hairdryer', label: 'Hairdryer' },
      { value: 'toiletries', label: 'Free toiletries' },
      { value: 'towels', label: 'Towels' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace and storage',
    items: [
      { value: 'desk', label: 'Work desk' },
      { value: 'wardrobe', label: 'Wardrobe' },
      { value: 'luggage', label: 'Luggage rack' },
      { value: 'safe', label: 'In-room safe' },
      { value: 'sofa', label: 'Sitting area' },
    ],
  },
  {
    id: 'inroom',
    label: 'In-room extras',
    items: [
      { value: 'fridge', label: 'Mini fridge' },
      { value: 'kettle', label: 'Electric kettle' },
      { value: 'tea-coffee', label: 'Tea and coffee' },
      { value: 'water', label: 'Bottled water' },
      { value: 'iron', label: 'Iron and ironing board' },
      { value: 'phone', label: 'Telephone' },
      { value: 'alarm', label: 'Wake-up service' },
      { value: 'socket', label: 'Socket near the bed' },
    ],
  },
  {
    id: 'spaces',
    label: 'Spaces and views',
    items: [
      { value: 'balcony', label: 'Balcony' },
      { value: 'terrace', label: 'Private terrace' },
      { value: 'garden-view', label: 'Garden view' },
      { value: 'city-view', label: 'City view' },
    ],
  },
  {
    id: 'services',
    label: 'Stay services',
    items: [
      { value: 'housekeeping', label: 'Daily housekeeping' },
      { value: 'room-service', label: 'Room service' },
      { value: 'laundry', label: 'Laundry service' },
      { value: 'parking', label: 'Free parking' },
    ],
  },
]

export const FEATURE_LIBRARY = Object.fromEntries(
  ROOM_AMENITY_GROUPS.flatMap((group) => group.items.map((item) => [item.value, item.label])),
)

export function featureLabel(id) {
  if (FEATURE_LIBRARY[id]) return FEATURE_LIBRARY[id]
  return String(id || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function amenityKeyFromLabel(input) {
  const text = String(input || '').trim()
  if (!text) return ''
  const slug = slugifyAmenity(text)
  const lower = text.toLowerCase()
  const known = Object.entries(FEATURE_LIBRARY).find(
    ([key, label]) => key === slug || label.toLowerCase() === lower,
  )
  return known ? known[0] : slug
}

export function collectExtraAmenities(...lists) {
  const known = new Set(Object.keys(FEATURE_LIBRARY))
  const extras = []
  const seen = new Set()
  for (const list of lists) {
    for (const value of list || []) {
      if (!value || known.has(value) || seen.has(value)) continue
      seen.add(value)
      extras.push(value)
    }
  }
  return extras
}

function slugifyAmenity(value) {
  return (
    String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
  )
}
