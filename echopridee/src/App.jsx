import React, { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminGate } from './components/ProtectedRoute'
import OverlayLayout from './components/OverlayLayout'
import GlobalHeader from './components/GlobalHeader'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import Blog from './pages/Blog'
import InvestorRelations from './pages/InvestorRelations'
import Devices from './pages/Devices'
import Science from './pages/Science'
import SelfPublish from './pages/SelfPublish'
import HostHub from './pages/HostHub'
import SellProducts from './pages/SellProducts'
import BusinessSell from './pages/BusinessSell'
import SellApps from './pages/SellApps'
import Affiliate from './pages/Affiliate'
import Advertise from './pages/Advertise'
import BusinessCard from './pages/BusinessCard'
import ShopWithPoints from './pages/ShopWithPoints'
import ReloadBalance from './pages/ReloadBalance'
import CurrencyConverter from './pages/CurrencyConverter'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmation from './pages/OrderConfirmation'
import Account from './pages/Account'
import Orders from './pages/Orders'
import ShippingPolicies from './pages/ShippingPolicies'
import Returns from './pages/Returns'
import ManageDevices from './pages/ManageDevices'
import Help from './pages/Help'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import StoreLocations from './pages/StoreLocations'

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
          <OverlayLayout />
        </HashRouter>
        </CurrencyProvider>
      </AuthProvider>
    </StoreProvider>
  )
}
