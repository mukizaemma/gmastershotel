'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import {
  ROOM_AMENITY_GROUPS,
  amenityKeyFromLabel,
  collectExtraAmenities,
  featureLabel,
} from '../../../modules/hotel/rooms/roomAmenities.js'
import './roomAmenitiesField.css'

function toggleValue(selected, key, checked) {
  if (checked) return selected.includes(key) ? selected : [...selected, key]
  return selected.filter((item) => item !== key)
}

export function RoomAmenitiesField({ field, path, readOnly }) {
  const { value, setValue } = useField({ path })
  const selected = Array.isArray(value) ? value.filter(Boolean) : []
  const [draft, setDraft] = useState('')
  const [fromOtherRooms, setFromOtherRooms] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/rooms?limit=200&depth=0')
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => {
        if (cancelled) return
        setFromOtherRooms((data.docs || []).flatMap((doc) => doc.features || []))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const extras = useMemo(
    () => collectExtraAmenities(fromOtherRooms, selected),
    [fromOtherRooms, selected],
  )

  function addCustom() {
    const key = amenityKeyFromLabel(draft)
    if (!key) return
    setValue(toggleValue(selected, key, true))
    setDraft('')
  }

  return (
    <div className="room-amenities-field">
      <FieldLabel label={field?.label || 'Amenities'} path={path} />
      <p className="room-amenities-field__hint">
        Typical 3-star room amenities. Tick what this room type offers, or add one if it is missing.
        A custom amenity stays on the list for other rooms once you save.
      </p>

      <div className="room-amenities-field__grid">
        {ROOM_AMENITY_GROUPS.map((group) => (
          <section key={group.id} className="room-amenities-field__group">
            <h3>{group.label}</h3>
            {group.items.map((item) => (
              <label key={item.value} className="room-amenities-field__item">
                <input
                  type="checkbox"
                  checked={selected.includes(item.value)}
                  disabled={readOnly}
                  onChange={(event) => setValue(toggleValue(selected, item.value, event.target.checked))}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </section>
        ))}

        {extras.length > 0 && (
          <section className="room-amenities-field__group">
            <h3>Added amenities</h3>
            {extras.map((key) => (
              <label key={key} className="room-amenities-field__item">
                <input
                  type="checkbox"
                  checked={selected.includes(key)}
                  disabled={readOnly}
                  onChange={(event) => setValue(toggleValue(selected, key, event.target.checked))}
                />
                <span>{featureLabel(key)}</span>
              </label>
            ))}
          </section>
        )}
      </div>

      {!readOnly && (
        <div className="room-amenities-field__add">
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
          <button type="button" disabled={!draft.trim()} onClick={addCustom}>
            Add
          </button>
        </div>
      )}
    </div>
  )
}
