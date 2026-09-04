import React from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'

const posts = [
  {
    title: '10 Sportswear Trends to Watch in 2026',
    category: 'Trends',
    date: 'Jan 28, 2026',
    read: '6 min read',
    image: 'imgi_27_m3_banner_022.jpg',
    excerpt:
      'From sustainable sublimation to retro varsity looks — here are the trends defining team sportswear this season.',
  },
  {
    title: '5 Coaching Tips for Building a Winning Sideline Presence',
    category: 'Coaching Tips',
    date: 'Jan 15, 2026',
    read: '4 min read',
    image: 'imgi_132_m3_slide_01.jpg',
    excerpt:
      'Great coaching starts before the first whistle. Learn how top coaches prepare, communicate, and lead their teams.',
  },
  {
    title: 'Inside Our Factory: How a Custom Jersey Is Made',
    category: 'Company News',
    date: 'Dec 30, 2025',
    read: '8 min read',
    image: 'imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp',
    excerpt:
      'A behind-the-scenes look at dye-sublimation printing, precision cutting, and the hands that make it happen.',
  },
  {
    title: 'Why Moisture-Wicking Fabric Changes the Game',
    category: 'Gear Science',
    date: 'Dec 12, 2025',
    read: '5 min read',
    image: 'imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp',
    excerpt:
      'Sweat management is performance. Here is the science behind the fabric tech in every EchoPride jersey.',
  },
  {
    title: 'Basketball Uniform Guide: Fit, Fabric, and Customization',
    category: 'Buying Guide',
    date: 'Nov 20, 2025',
    read: '7 min read',
    image: 'imgi_26_m3_banner_01.jpg',
    excerpt:
      'Not sure where to start with team uniforms? Our complete guide covers sizing, materials, and design options.',
  },
  {
    title: 'EchoPride Hits 500 Teams Outfitted Milestone',
    category: 'Company News',
    date: 'Nov 05, 2025',
    read: '3 min read',
    image: 'imgi_224_m3_deal_bg.jpg',
    excerpt:
      'A huge thank-you to every club and school that trusted us this year. Here is what we learned along the way.',
  },
  {
    title: 'How to Build a Custom Kit on a Small Budget',
    category: 'Buying Guide',
    date: 'Oct 18, 2025',
    read: '5 min read',
    image: 'imgi_20_a-zip-up-hoodie-designed-for-basketball-coaches-w-700x700.webp',
      excerpt:
        "Great team gear doesn't need a massive budget. Practical ways to design a professional-looking kit affordably.",
  },
  {
      title: "Soccer vs. Football Jersey: What's Actually Different?",
    category: 'Gear Science',
    date: 'Oct 02, 2025',
    read: '4 min read',
    image: 'imgi_7_m3_cat_03.jpg',
    excerpt:
      'Different sports, different demands. We break down how jerseys are engineered for the pitch versus the gridiron.',
  },
  {
    title: 'The Rise of Custom Team Apparel in Local Leagues',
    category: 'Trends',
    date: 'Sep 15, 2025',
    read: '6 min read',
    image: 'imgi_28_m3_banner_03.jpg',
    excerpt:
      'Amateur clubs are going pro with their kits. Discover why sublimated custom gear is becoming the new standard.',
  },
]

const categories = ['All', 'Trends', 'Coaching Tips', 'Company News', 'Gear Science', 'Buying Guide']

export default function Blog() {
  const [active, setActive] = React.useState('All')

  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active)

  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-center justify-center bg-[#0f1923] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_133_m3_cat_bg.jpg"
            alt="EchoPride Blog"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/70 to-[#0f1923]/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-5">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] inline-block hero-anim hero-delay-1">
            THE ECHOPRIDE BLOG
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight hero-anim hero-delay-2">
            INSIGHTS FOR ATHLETES &amp; TEAMS
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light hero-anim hero-delay-3">
            Sportswear trends, coaching tips, gear science, and the latest news from the EchoPride factory floor.
          </p>
          <div className="pt-1 text-xs font-semibold text-gray-400 tracking-wider hero-anim hero-delay-3">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Blog</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`text-xs font-extrabold uppercase tracking-widest px-6 py-3 rounded-full border transition-all duration-300 ${
                  active === cat
                    ? 'bg-[#baf120] border-[#baf120] text-black'
                    : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <article
                key={post.title}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 reveal"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image ? (post.image.startsWith('/') ? post.image : `/${post.image}`) : ''}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#baf120] text-black text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-7 space-y-3">
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <span>
                      <i className="fa-regular fa-calendar mr-1.5 text-[#baf120]"></i>
                      {post.date}
                    </span>
                    <span>
                      <i className="fa-regular fa-clock mr-1.5 text-[#baf120]"></i>
                      {post.read}
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:text-black transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed">{post.excerpt}</p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mt-1 group-hover:gap-3 transition-all"
                  >
                    Read More <i className="fa-solid fa-arrow-right text-xs text-[#baf120]"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 md:py-20 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center space-y-6 reveal">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Never Miss a Post</h2>
          <p className="text-sm text-black font-semibold">
            Subscribe to the EchoPride blog for trends, tips, and team gear news straight to your inbox.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              className="flex-1 border border-gray-300 rounded-lg px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#0b1324] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-lg transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
