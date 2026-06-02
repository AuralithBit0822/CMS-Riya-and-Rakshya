import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((product, size = null) => {
    setCart(prev => {
      const key = `${product.id}-${size || product.sizes?.[0] || 'default'}`;
      const existing = prev.find(i => i.cartKey === key);
      if (existing) {
        return prev.map(i => i.cartKey === key ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, cartKey: key, qty: 1, selectedSize: size || product.sizes?.[0] || '50g' }];
    });
    showToast('Added to cart!');
  }, [showToast]);

  const removeFromCart = useCallback((cartKey) => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey));
  }, []);

  const updateQty = useCallback((cartKey, delta) => {
    setCart(prev => prev.map(i => {
      if (i.cartKey !== cartKey) return i;
      const newQty = i.qty + delta;
      return newQty < 1 ? null : { ...i, qty: newQty };
    }).filter(Boolean));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(i => i.id !== product.id);
      }
      showToast('Added to wishlist!');
      return [...prev, product];
    });
  }, [showToast]);

  const isWishlisted = useCallback((id) => wishlist.some(i => i.id === id), [wishlist]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <AppContext.Provider value={{
      cart, wishlist, toast, searchQuery,
      setSearchQuery, addToCart, removeFromCart,
      updateQty, clearCart, toggleWishlist,
      isWishlisted, cartTotal, cartCount
    }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
