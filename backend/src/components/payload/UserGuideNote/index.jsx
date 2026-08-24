'use client'

import React from 'react'

const HOME = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5174'

export function UserGuideNote() {
  return (
    <div
      style={{
        background: '#faf7f0',
        border: '1px solid #e8dfd0',
        borderRadius: 12,
        padding: '1.1rem 1.2rem',
        color: '#1a2b4b',
      }}
    >
      <p style={{ margin: '0 0 0.65rem' }}>
        The hotel handbook is a public guide the team can open without logging in. It reads like a
        short book: what was delivered, how to sign in, and how to manage each part of the site.
      </p>
      <p style={{ margin: 0 }}>
        <a href={`${HOME}/handover`} target="_blank" rel="noreferrer" style={{ color: '#1a2b4b', fontWeight: 700 }}>
          Open /handover
        </a>
        {' · '}
        <a href="/admin/collections/handover-feedback" style={{ color: '#c4a574', fontWeight: 700 }}>
          Read feedback
        </a>
      </p>
    </div>
  )
}
