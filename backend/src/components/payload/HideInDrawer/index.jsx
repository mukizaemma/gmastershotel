'use client'

import React from 'react'
import { CheckboxField, NumberField, SelectField, useEditDepth } from '@payloadcms/ui'

function pickingIntoAForm() {
  return useEditDepth() > 1
}

export function GalleryCategoryField(props) {
  if (pickingIntoAForm()) return null
  return <SelectField {...props} />
}

export function GalleryOrderField(props) {
  if (pickingIntoAForm()) return null
  return <NumberField {...props} />
}

export function ShowOnGalleryField(props) {
  if (pickingIntoAForm()) return null
  return <CheckboxField {...props} />
}
