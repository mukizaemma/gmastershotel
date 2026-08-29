'use client'

import React, { useRef } from 'react'
import { useRouter } from 'next/navigation.js'
import {
  FormSubmit,
  useConfig,
  useDocumentInfo,
  useEditDepth,
  useForm,
  useFormModified,
  useHotkey,
  useOperation,
} from '@payloadcms/ui'
import { notifyAdminDocSaved } from '../AdminDocDrawer/index.jsx'

export function SaveAndReturnButton({ label: labelProp }) {
  const { collectionSlug, globalSlug, id, uploadStatus } = useDocumentInfo()
  const { config } = useConfig()
  const { submit } = useForm()
  const modified = useFormModified()
  const operation = useOperation()
  const editDepth = useEditDepth()
  const router = useRouter()
  const ref = useRef(null)

  const isUpdate = operation === 'update' || Boolean(id)
  const label = labelProp || (isUpdate || globalSlug ? 'Save changes' : 'Save')
  const disabled = (isUpdate && !modified) || uploadStatus === 'uploading'
  const inDrawer = editDepth > 1
  const adminRoute = config.routes.admin || '/admin'
  const listHref = collectionSlug ? `${adminRoute}/collections/${collectionSlug}` : ''

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!disabled) ref.current?.click()
  })

  async function handleSubmit() {
    if (uploadStatus === 'uploading') return
    const result = await submit()
    if (!result?.res?.ok) return
    if (inDrawer) {
      notifyAdminDocSaved()
      return
    }
    if (globalSlug || !listHref) return
    router.push(listHref)
  }

  return (
    <FormSubmit
      buttonId="action-save"
      disabled={disabled}
      onClick={handleSubmit}
      ref={ref}
      size="medium"
      type="button"
    >
      {label}
    </FormSubmit>
  )
}
