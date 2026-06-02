import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trash2, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Pages.css';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();
  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: `url(/images/${wishlist.length > 0 ? 'wishlistaddhero' : 'wishlistemptyhero'}.png)` }} />
        <div className="page-hero-content">
          <div className="breadcrumb"><Home size={13} /><a href="/">HOME</a><span>›</span><span>Wishlist</span></div>
          <h1>Your Wishlist</h1>
          <div className="hero-underline" />
          <p>Keep track of your favorite snacks and treats, discover new flavors you'll love, and never miss out.</p>
        </div>
      </div>

      <section className="section" style={{ background: '#F4F4F4', minHeight: 380 }}>
        <div className="container">
          {wishlist.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon"><Heart size={36} color="#C8102E" /></div>
              <h2 className="wl-empty-title">Your wishlist is empty</h2>
              <p className="wl-empty-sub">We haven't saved any items yet. Browse our products and click the heart icon to add them here.</p>
              <button className="btn-primary" style={{ borderRadius: 30, padding: '12px 28px' }} onClick={() => navigate('/products')}>Browse Products →</button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>Your Wishlist</h2>
                <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Showing <strong>{wishlist.length}</strong> products</p>
              </div>
              <div className="products-grid">
                {wishlist.map(item => (
                  <div key={item.id} className="product-card" onClick={() => navigate(`/products/${item.id}`)}>
                    <div className="product-card-img">
                      <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                      <span className="product-card-badge">{item.category}</span>
                      <button className="product-card-heart active" title="Remove from wishlist"
                        onClick={e => { e.stopPropagation(); toggleWishlist(item); }}>
                        <Trash2 size={13} color="#C8102E" />
                      </button>
                    </div>
                    <div className="product-card-body">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="pc-price">Rs.{item.price} <span className="pc-unit">/ {item.unit}</span></div>
                      <button className="btn-add-cart" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                        onClick={e => { e.stopPropagation(); addToCart(item); }}>Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
