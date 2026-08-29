'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation.js'
import { useConfig, useDocumentDrawer } from '@payloadcms/ui'

export const DOC_SAVED_EVENT = 'ireme-doc-saved'

const SKIP_IDS = new Set(['trash', 'permissions'])
const SKIP_DRAWERS = '.doc-drawer, .list-drawer, .drawer__content, .relationship-drawer'

export function notifyAdminDocSaved() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DOC_SAVED_EVENT))
  }
}

export function parseAdminDocHref(href, adminRoute = '/admin') {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return null
  let url
  try {
    url = new URL(href, window.location.origin)
  } catch {
    return null
  }

  const prefix = `${String(adminRoute).replace(/\/$/, '')}/collections/`
  const index = url.pathname.indexOf(prefix)
  if (index === -1) return null

  const parts = url.pathname.slice(index + prefix.length).split('/').filter(Boolean)
  if (parts.length !== 2) return null

  const [collectionSlug, doc] = parts
  if (!collectionSlug || SKIP_IDS.has(doc)) return null
  if (doc === 'create') return { collectionSlug }
  return { collectionSlug, id: decodeURIComponent(doc) }
}

function DocDrawerHost({ target, onDone }) {
  const drawerArgs = target.id
    ? { collectionSlug: target.collectionSlug, id: target.id }
    : { collectionSlug: target.collectionSlug }
  const [DocumentDrawer, , { closeDrawer, openDrawer, isDrawerOpen }] = useDocumentDrawer(drawerArgs)
  const opened = useRef(false)
  const sawOpen = useRef(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    closeDrawer()
    onDone()
  }, [closeDrawer, onDone])

  useEffect(() => {
    if (opened.current) return
    opened.current = true
    openDrawer()
  }, [openDrawer])

  useEffect(() => {
    if (isDrawerOpen) {
      sawOpen.current = true
      return
    }
    if (sawOpen.current) finish()
  }, [isDrawerOpen, finish])

  useEffect(() => {
    window.addEventListener(DOC_SAVED_EVENT, finish)
    return () => window.removeEventListener(DOC_SAVED_EVENT, finish)
  }, [finish])

  return (
    <DocumentDrawer
      redirectAfterCreate={false}
      onSave={finish}
      onDelete={finish}
    />
  )
}

export function AdminDocDrawer() {
  const router = useRouter()
  const { config } = useConfig()
  const adminRoute = config.routes.admin || '/admin'
  const [target, setTarget] = useState(null)

  const finish = useCallback(() => {
    setTarget(null)
    router.refresh()
  }, [router])

  useEffect(() => {
    function onClick(event) {
      if (/\/admin\/(login|forgot|reset)/.test(window.location.pathname)) return
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target?.closest?.('a')
      if (!link || link.target === '_blank') return
      if (link.closest(SKIP_DRAWERS)) return
      const next = parseAdminDocHref(link.getAttribute('href'), adminRoute)
      if (!next) return
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
      setTarget(next)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [adminRoute])

  if (!target?.collectionSlug) return null

  return (
    <DocDrawerHost
      key={`${target.collectionSlug}:${target.id || 'create'}`}
      onDone={finish}
      target={target}
    />
  )
}
