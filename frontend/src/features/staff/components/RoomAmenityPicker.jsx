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
      <div className="featureGrid">
        {ROOM_AMENITY_GROUPS.map((group) => (
          <section key={group.id} className="amenityGroup">
            <h3 className="amenityGroupTitle">{group.label}</h3>
            {group.items.map((item) => (
              <label key={item.value} className="amenityItem">
                <input
                  type="checkbox"
                  checked={value.includes(item.value)}
                  onChange={(event) => toggle(item.value, event.target.checked)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </section>
        ))}
        {extras.length > 0 && (
          <section className="amenityGroup">
            <h3 className="amenityGroupTitle">Added amenities</h3>
            {extras.map((key) => (
              <label key={key} className="amenityItem">
                <input
                  type="checkbox"
                  checked={value.includes(key)}
                  onChange={(event) => toggle(key, event.target.checked)}
                />
                <span>{featureLabel(key)}</span>
              </label>
            ))}
          </section>
        )}
      </div>
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
