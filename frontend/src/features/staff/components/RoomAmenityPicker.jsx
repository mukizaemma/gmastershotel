import { useState } from 'react'
import {
  ROOM_AMENITY_GROUPS,
  amenityKeyFromLabel,
  collectExtraAmenities,
  featureLabel,
} from '@features/hotel/rooms/featureLibrary'

export default function RoomAmenityPicker({ value = [], extraValues = [], onChange }) {
  const [draft, setDraft] = useState('')
  const extras = collectExtraAmenities(extraValues, value)

  function toggle(key, checked) {
    onChange(
      checked
        ? value.includes(key) ? value : [...value, key]
        : value.filter((item) => item !== key),
    )
  }

  function addCustom() {
    const key = amenityKeyFromLabel(draft)
    if (!key) return
    if (!value.includes(key)) onChange([...value, key])
    setDraft('')
  }

  return (
    <div className="staffField full amenityPicker">
      <span>Amenities</span>
      <p className="amenityPickerHint">
        Typical 3-star room amenities. Tick what this room offers, or add one if it is missing.
      </p>
      {ROOM_AMENITY_GROUPS.map((group) => (
        <section key={group.id} className="amenityGroup">
          <h3 className="amenityGroupTitle">{group.label}</h3>
          <div className="featureGrid">
            {group.items.map((item) => (
              <label key={item.value}>
                <input
                  type="checkbox"
                  checked={value.includes(item.value)}
                  onChange={(event) => toggle(item.value, event.target.checked)}
                />{' '}
                {item.label}
              </label>
            ))}
          </div>
        </section>
      ))}
      {extras.length > 0 && (
        <section className="amenityGroup">
          <h3 className="amenityGroupTitle">Added amenities</h3>
          <div className="featureGrid">
            {extras.map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={value.includes(key)}
                  onChange={(event) => toggle(key, event.target.checked)}
                />{' '}
                {featureLabel(key)}
              </label>
            ))}
          </div>
        </section>
      )}
      <div className="amenityAdd">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addCustom()
            }
          }}
          placeholder="Add an amenity not listed above"
        />
        <button type="button" className="staffBtn" onClick={addCustom} disabled={!draft.trim()}>
          Add
        </button>
      </div>
    </div>
  )
}
