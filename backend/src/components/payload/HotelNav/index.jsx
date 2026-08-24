'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin/globals/company', label: 'Site setting' },
  { href: '/admin/globals/pages', label: 'Pages' },
  { href: '/admin/collections/rooms', label: 'Rooms' },
  { href: '/admin/collections/bookings', label: 'Bookings' },
  { href: '/admin/collections/availability-blocks', label: 'Availability' },
  { href: '/admin/collections/experiences', label: 'Activities' },
  { href: '/admin/collections/menu-items', label: 'Menu items' },
  { href: '/admin/collections/amenities', label: 'Amenities' },
  { href: '/admin/collections/gallery-photos', label: 'Site Gallery' },
  { href: '/admin/collections/media', label: 'Media Gallery' },
  { href: '/admin/globals/site-audit', label: 'Site audit' },
  { href: '/admin/globals/user-guide', label: 'User Guide' },
  { href: '/admin/collections/handover-feedback', label: 'Handover notes' },
  { href: '/admin/account', label: 'My account' },
]

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function HotelNav() {
  const pathname = usePathname() || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '0.25rem 0 0.75rem' }}>
      {LINKS.map((item) => (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          style={{
            ...styles.link,
            ...(isActive(pathname, item.href) ? styles.active : null),
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

const styles = {
  link: {
    display: 'block',
    padding: '0.5rem 0.7rem',
    borderRadius: 6,
    color: 'var(--theme-elevation-800, #f5efe6)',
    textDecoration: 'none',
    fontSize: 14,
  },
  active: {
    color: '#c4a574',
    background: 'rgba(196, 165, 116, 0.16)',
  },
}
