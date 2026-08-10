import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { carouselProducts } from '../data/products'
import { parseUsdPrice } from '../data/currencies'
import { useCurrency } from '../context/CurrencyContext'
import { useProducts } from '../api'

export default function ProductCarousel({ category }) {
  const trackRef = useRef(null)

  const { formatPrice } = useCurrency()

  const params = category ? { limit: 10, category } : { limit: 10, featured: 'true' }
  const { items } = useProducts(params, carouselProducts)

  const list = items.map((p) => ({
    slug: p.slug,
    image: p.image,
    title: p.title,
    price: parseUsdPrice(p.price),
  }))
  const listKey = list.map((p) => p.slug).join('|')

  const scrollByCards = (direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.carousel-card')
    const step = card ? card.offsetWidth + 20 : 300
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className="carousel-container mt-12" key={listKey}>
      <button
        className="nav-btn prev-btn"
        onClick={() => scrollByCards(-1)}
        aria-label="Previous products"
      >
        &larr;
      </button>
      <button
        className="nav-btn next-btn"
        onClick={() => scrollByCards(1)}
        aria-label="Next products"
      >
        &rarr;
      </button>

      <div className="carousel-track flex overflow-x-auto scroll-smooth no-scrollbar" ref={trackRef}>
        {list.map((product) => (
          <Link
            key={product.slug}
            to={`/product/${product.slug}`}
            className="card carousel-card"
            draggable="false"
          >
            <img src={`/${product.image}`} alt={product.title} draggable="false" />
            <h3>{product.title}</h3>
            <p className="price">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
