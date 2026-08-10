import React from 'react'
import { Card, EmptyState } from './ui'

export default function PlaceholderView({ title, hint, icon }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        <p className="text-xs text-gray-500">{hint || 'This module is coming soon.'}</p>
      </div>
      <Card className="p-6">
        <EmptyState icon={icon || 'fa-solid fa-hammer'} title={`${title} is under construction`} hint="We're wiring this section to the backend — check back soon." />
      </Card>
    </div>
  )
}
