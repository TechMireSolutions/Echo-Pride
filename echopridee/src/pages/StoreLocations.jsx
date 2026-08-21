import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const STORES = [
  {
    id: 1,
    city: 'Houston, TX',
    name: 'Echo Pride Flagship Store',
    address: '1200 Westheimer Rd, Suite 400',
    zip: 'TX 77006',
    phone: '+1 (713) 997-5586',
    hours: 'Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM',
    status: 'Open Today',
    services: ['Custom Jersey Fitting', 'Instant Sublimation Demo', 'Bulk Ordering'],
    image: '/imgi_26_m3_banner_01.jpg',
  },
  {
    id: 2,
    city: 'Dallas, TX',
    name: 'Echo Pride Sports Hub & Showroom',
    address: '2400 N Stemmons Fwy',
    zip: 'TX 75207',
    phone: '+1 (214) 555-0192',
    hours: 'Mon–Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM',
    status: 'Open Today',
    services: ['Team Uniform Fitting', 'Embroidery & Print Lab'],
    image: '/imgi_27_m3_banner_02.jpg',
  },
  {
    id: 3,
    city: 'Los Angeles, CA',
    name: 'Echo Pride Experience Center',
    address: '880 S Figueroa St',
    zip: 'CA 90017',
    phone: '+1 (213) 555-0144',
    hours: 'Mon–Sat: 10:00 AM – 9:00 PM | Sun: 11:00 AM – 7:00 PM',
    status: 'Open Today',
    services: ['Athlete Lounge', 'Custom Gear Fitting'],
    image: '/imgi_28_m3_banner_03.jpg',
  },
  {
    id: 4,
    city: 'Chicago, IL',
    name: 'Echo Pride Midwest Hub',
    address: '500 N Michigan Ave',
    zip: 'IL 60611',
    phone: '+1 (312) 555-0188',
    hours: 'Mon–Sat: 9:30 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM',
    status: 'Open Today',
    services: ['Custom Jersey Fitting', 'Team Sales Center'],
    image: '/imgi_26_m3_banner_01.jpg',
  },
]

export default function StoreLocations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStore, setSelectedStore] = useState(STORES[0])

  const filteredStores = STORES.filter(
    (store) =>
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <InfoPageShell
      heroTag="STORE LOCATOR"
      title="Store Locations"
      intro="Visit an Echo Pride Flagship Store or Experience Center near you to try on custom gear and consult with team apparel specialists."
      image="/imgi_26_m3_banner_01.jpg"
      variant="tool"
      heroBottom={
        <div className="max-w-xl mx-auto w-full">
          <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3.5 shadow-xl">
            <i className="fa-solid fa-location-dot text-blue-600"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, state, or address..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Store List */}
            <div className="lg:col-span-5 space-y-4 max-h-[700px] overflow-y-auto pr-2">
              <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight mb-4">
                Our Locations ({filteredStores.length})
              </h2>

              {filteredStores.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No store found matching "{searchTerm}". Contact support to inquire about pop-up events in your city!
                </div>
              ) : (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`cursor-pointer border rounded-2xl p-6 transition-all duration-300 ${
                      selectedStore.id === store.id
                        ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{store.city}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        {store.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{store.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{store.address}, {store.zip}</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-phone text-blue-600 text-xs"></i>
                        {store.phone}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Store Detail View */}
            <div className="lg:col-span-7">
              <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl overflow-hidden p-8 shadow-sm">
                <div className="h-56 rounded-2xl overflow-hidden mb-6 relative">
                  <img
                    src={selectedStore.image}
                    alt={selectedStore.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#baf120]">{selectedStore.city}</span>
                    <h3 className="text-2xl font-extrabold">{selectedStore.name}</h3>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Address</h4>
                    <p className="text-sm font-bold text-gray-900">{selectedStore.address}, {selectedStore.zip}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Hours of Operation</h4>
                    <p className="text-sm text-gray-700 font-medium">{selectedStore.hours}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Phone & Contact</h4>
                    <a
                      href={`tel:${selectedStore.phone}`}
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      {selectedStore.phone}
                    </a>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Available In-Store Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStore.services.map((service) => (
                        <span
                          key={service}
                          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 shadow-2xs"
                        >
                          <i className="fa-solid fa-check text-green-500 mr-1.5"></i>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4 border-t border-gray-200">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(selectedStore.address + ' ' + selectedStore.zip)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <i className="fa-solid fa-directions"></i> Get Directions
                    </a>
                    <Link
                      to="/contact"
                      className="bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <i className="fa-solid fa-calendar-check"></i> Book Jersey Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-2">
              Can't visit in person?
            </h2>
            <p className="text-gray-400 text-sm">Our virtual fit specialists are available 7 days a week via live video chat.</p>
          </div>
          <Link to="/help" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Schedule Virtual Fitting
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
