'use client'

import React from 'react'
import { CheckboxField, NumberField, SelectField, useListDrawerContext } from '@payloadcms/ui'

function pickingIntoAForm() {
  const { isInDrawer } = useListDrawerContext()
  return Boolean(isInDrawer)
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
