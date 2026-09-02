import React, { useEffect, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminGate } from './components/ProtectedRoute'
import OverlayLayout from './components/OverlayLayout'
import GlobalHeader from './components/GlobalHeader'

// Core critical route loaded eagerly for LCP
import Home from './pages/Home'

// Route-based Code Splitting using React.lazy()
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Careers = lazy(() => import('./pages/Careers'))
const Blog = lazy(() => import('./pages/Blog'))
const InvestorRelations = lazy(() => import('./pages/InvestorRelations'))
const Devices = lazy(() => import('./pages/Devices'))
const Science = lazy(() => import('./pages/Science'))
const SelfPublish = lazy(() => import('./pages/SelfPublish'))
const HostHub = lazy(() => import('./pages/HostHub'))
const SellProducts = lazy(() => import('./pages/SellProducts'))
const BusinessSell = lazy(() => import('./pages/BusinessSell'))
const SellApps = lazy(() => import('./pages/SellApps'))
const Affiliate = lazy(() => import('./pages/Affiliate'))
const Advertise = lazy(() => import('./pages/Advertise'))
const BusinessCard = lazy(() => import('./pages/BusinessCard'))
const ShopWithPoints = lazy(() => import('./pages/ShopWithPoints'))
const ReloadBalance = lazy(() => import('./pages/ReloadBalance'))
const CurrencyConverter = lazy(() => import('./pages/CurrencyConverter'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Account = lazy(() => import('./pages/Account'))
const Orders = lazy(() => import('./pages/Orders'))
const ShippingPolicies = lazy(() => import('./pages/ShippingPolicies'))
const Returns = lazy(() => import('./pages/Returns'))
const ManageDevices = lazy(() => import('./pages/ManageDevices'))
const Help = lazy(() => import('./pages/Help'))
const Admin = lazy(() => import('./pages/Admin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const StoreLocations = lazy(() => import('./pages/StoreLocations'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RevealObserver() {
  const { pathname } = useLocation()

  useEffect(() => {
    let observer

    const scan = () => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      if (!els.length) return
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15 }
      )
      els.forEach((el) => observer.observe(el))
    }

    const raf = requestAnimationFrame(scan)
    const mutation = new MutationObserver(scan)
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      mutation.disconnect()
    }
  }, [pathname])

  return null
}

function HashRedirect() {
  useEffect(() => {
    const { pathname, search, hash } = window.location
    if (pathname !== '/' && !hash) {
      window.location.replace('#' + pathname + search)
    }
  }, [])
  return null
}

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-[#0f1923]">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <CurrencyProvider>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <HashRedirect />
          <ScrollToTop />
          <RevealObserver />
          <GlobalHeader />
          <main id="main-content" tabIndex="-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/investor-relations" element={<InvestorRelations />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/science" element={<Science />} />
                <Route path="/sell-products" element={<SellProducts />} />
                <Route path="/business-sell" element={<BusinessSell />} />
                <Route path="/sell-apps" element={<SellApps />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/advertise" element={<Advertise />} />
                <Route path="/self-publish" element={<SellProducts />} />
                <Route path="/self-publishing" element={<SelfPublish />} />
                <Route path="/host-hub" element={<HostHub />} />
                <Route path="/business-card" element={<BusinessCard />} />
                <Route path="/shop-with-points" element={<ShopWithPoints />} />
                <Route path="/reload-balance" element={<ReloadBalance />} />
                <Route path="/currency-converter" element={<CurrencyConverter />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/account" element={<Account />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/shipping-policies" element={<ShippingPolicies />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/manage-devices" element={<ManageDevices />} />
                <Route path="/help" element={<Help />} />
                <Route path="/store-locations" element={<StoreLocations />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/admin" element={<AdminGate />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
          <OverlayLayout />
        </HashRouter>
        </CurrencyProvider>
      </AuthProvider>
    </StoreProvider>
  )
}
