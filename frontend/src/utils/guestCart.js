export function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem('kiki_guest_cart') || '[]')
  } catch {
    return []
  }
}

export function saveGuestCart(cart) {
  localStorage.setItem('kiki_guest_cart', JSON.stringify(cart))
}

export function getGuestCartCount() {
  return getGuestCart().reduce((s, i) => s + i.quantity, 0)
}