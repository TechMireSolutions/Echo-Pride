import React from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from './Footers'

function Breadcrumb({ title, light }) {
  return (
    <div className={`pt-4 text-xs font-semibold tracking-wider ${light ? 'text-gray-400' : 'text-gray-500'}`}>
      <Link to="/" className="text-[#baf120] hover:underline">
        Home
      </Link>
      <span className="mx-2 text-gray-500">/</span>
      <span className={light ? 'text-gray-200' : 'text-gray-700'}>{title}</span>
    </div>
  )
}

function Hero({ heroTag, title, intro, image, variant, heroAside, heroBottom }) {
  const center = variant === 'center' || variant === 'stats' || variant === 'tool'
  const split = variant === 'split'
  const left = variant === 'left'

  return (
    <section
      className={`relative bg-black overflow-hidden ${
        split ? 'min-h-[420px] md:min-h-[480px]' : left ? 'min-h-[300px] md:min-h-[340px]' : 'min-h-[360px] md:min-h-[420px]'
      } flex items-center py-16`}
    >
      <div className="absolute inset-0 z-0">
        <img src={image} alt={`${title} Background`} className="w-full h-full object-cover opacity-35 object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/75"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#baf120] via-black to-[#baf120]"></div>

      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 ${
          center ? 'text-center' : left ? 'text-left' : 'text-left'
        }`}
      >
        {split ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-4">
              <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] inline-block animate-fade-in-up delay-1">
                {heroTag}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white animate-fade-in-up delay-2">
                {title}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-light animate-fade-in-up delay-3">
                {intro}
              </p>
              <div className="animate-fade-in-up delay-3">
                <Breadcrumb title={title} light />
              </div>
            </div>
            <div className="animate-fade-in-up delay-2">{heroAside}</div>
          </div>
        ) : center ? (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] inline-block animate-fade-in-up delay-1">
                {heroTag}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white animate-fade-in-up delay-2">
                {title}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up delay-3">
                {intro}
              </p>
              <div className="animate-fade-in-up delay-3">
                <Breadcrumb title={title} light />
              </div>
            </div>
            {heroBottom && <div className="mt-10 animate-fade-in-up delay-3">{heroBottom}</div>}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto lg:mx-0 space-y-4">
            <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] inline-block animate-fade-in-up delay-1">
              {heroTag}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white animate-fade-in-up delay-2">
              {title}
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-light animate-fade-in-up delay-3">
              {intro}
            </p>
            <div className="animate-fade-in-up delay-3">
              <Breadcrumb title={title} light />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function InfoPageShell({
  heroTag,
  title,
  intro,
  image = '/imgi_132_m3_slide_01.jpg',
  variant = 'center',
  heroAside,
  heroBottom,
  children,
}) {
  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <Hero heroTag={heroTag} title={title} intro={intro} image={image} variant={variant} heroAside={heroAside} heroBottom={heroBottom} />
      {children}
      <FooterAmazon />
    </div>
  )
}
