import React from 'react'
import { useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'

export default function GlobalHeader() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/admin')) return null

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <Navbar />
    </header>
  )
}
