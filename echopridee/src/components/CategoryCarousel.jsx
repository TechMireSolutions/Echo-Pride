import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { categorySlides, categorySlugs } from '../data/products'
import { useCategories } from '../api'

export default function CategoryCarousel() {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const swiperRef = useRef(null)

  const { categories } = useCategories(categorySlides)

  const slides = categories.map((c) => ({
    image:
      c.image ||
      categorySlides.find((s) => s.sport === (c.name || c.label))?.image ||
      'imgi_5_m3_cat_01.jpg',
    label: c.label || c.name,
    sport: c.sport || c.name,
  }))

  const slugFor = (sport) =>
    categorySlugs[sport] ||
    categories.find((c) => (c.name || c.label) === sport)?.slug ||
    sport.toLowerCase()

  const slidePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev()
  }

  const slideNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext()
  }

  return (
    <div className="relative">
      <button
        ref={prevRef}
        onClick={slidePrev}
        aria-label="Previous categories"
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#baf120] hover:text-black transition duration-700 cursor-pointer"
      >
        <i className="fa-solid fa-arrow-left text-base"></i>
      </button>

      <Swiper
        className="categorySwiper py-4"
        modules={[Navigation]}
        loop
        speed={800}
        grabCursor
        spaceBetween={24}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current
          swiper.params.navigation.nextEl = nextRef.current
        }}
        onInit={(swiper) => {
          if (swiper.navigation) {
            swiper.navigation.init()
            swiper.navigation.update()
          }
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.label}>
            <Link
              to={`/shop/${slugFor(slide.sport)}`}
              className="block h-[340px] md:h-[480px] relative overflow-hidden group/card rounded-md shadow-2xl border border-white/10"
            >
              <img
                src={slide.image ? (slide.image.startsWith('/') ? slide.image : `/${slide.image}`) : ''}
                alt={slide.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start z-10">
                <span className="inline-flex items-center gap-2 bg-[#baf120] text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded shadow transition-all duration-700 group-hover/card:bg-white group-hover/card:scale-105">
                  {slide.label}
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={nextRef}
        onClick={slideNext}
        aria-label="Next categories"
        className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#baf120] hover:text-black transition duration-700 cursor-pointer"
      >
        <i className="fa-solid fa-arrow-right text-base"></i>
      </button>
    </div>
  )
}
