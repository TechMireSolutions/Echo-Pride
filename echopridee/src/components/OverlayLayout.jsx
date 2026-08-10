import React from 'react'
import SearchOverlay from './SearchOverlay'
import LoginDrawer from './LoginDrawer'
import CartDrawer from './CartDrawer'
import Backdrop from './Backdrop'

export default function OverlayLayout() {
  return (
    <>
      <SearchOverlay />
      <Backdrop />
      <LoginDrawer />
      <CartDrawer />
    </>
  )
}
