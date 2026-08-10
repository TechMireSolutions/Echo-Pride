import React, { useRef } from 'react'
import { useStore } from '../context/StoreContext'

const messages = [
  'Free Shipping on Orders Over $375!',
  'New Year Sale: Flat 10% OFF on All Sports Wear!',
  'Dye Sublimation Printing: Vibrant & Durable Design',
  'Quick 21-Days Turnaround: Gear Up Faster with Total Sports Wear!',
]

const messageClasses = ['animate-msg-1', 'animate-msg-2', 'animate-msg-3', 'animate-msg-4']

export default function AnnouncementBar() {
  const { activeOverlay } = useStore()
  const wrapperRef = useRef(null)

  const overlayOpen = activeOverlay !== null

  if (overlayOpen) return null

  return (
    <div
      id="announcement-bar"
      className="w-full bg-[#baf120] text-black h-6 flex items-center justify-center overflow-hidden font-medium text-sm md:text-[15px] tracking-normal"
    >
      <div
        ref={wrapperRef}
        className="cursor-grab active:cursor-grabbing snap-back touch-none w-full h-full flex items-center justify-center"
        onPointerDown={(e) => {
          const wrapper = wrapperRef.current
          wrapper.classList.remove('snap-back')
          wrapper.setPointerCapture(e.pointerId)
          wrapper.dataset.dragging = 'true'
          wrapper.dataset.startX = String(e.clientX)
          wrapper.querySelectorAll('.announcement-item').forEach((item) => item.classList.add('paused-animation'))
        }}
        onPointerMove={(e) => {
          const wrapper = wrapperRef.current
          if (wrapper.dataset.dragging !== 'true') return
          const deltaX = e.clientX - Number(wrapper.dataset.startX)
          wrapper.style.transform = `translateX(${deltaX}px)`
        }}
        onPointerUp={resetDrag}
        onPointerCancel={resetDrag}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {messages.map((msg, i) => (
            <span
              key={msg}
              className={`announcement-item ${messageClasses[i]} absolute whitespace-nowrap px-4 opacity-0`}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  function resetDrag(e) {
    const wrapper = wrapperRef.current
    if (wrapper.dataset.dragging !== 'true') return
    wrapper.dataset.dragging = 'false'
    wrapper.classList.add('snap-back')
    wrapper.style.transform = 'translateX(0px)'
    wrapper.querySelectorAll('.announcement-item').forEach((item) => item.classList.remove('paused-animation'))
  }
}
