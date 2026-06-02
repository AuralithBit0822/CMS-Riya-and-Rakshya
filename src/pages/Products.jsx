import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { useCmsResource } from '../api/cms';
import './Pages.css';

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const navigate  = useNavigate();
  const wishlisted = isWishlisted(product.id);
  const isNew     = product.price === 0;
  const hasSizes  = product.sizeOptions && product.sizeOptions.length > 0;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" decoding="async"
          onError={e => { e.target.style.opacity = '0.3'; }} />
        <span className="product-card-badge">{product.category}</span>
        {product.badge && (
          <span className="product-card-badge product-card-badge--right">{product.badge}</span>
        )}
        <button
          className={`product-card-heart${wishlisted ? ' active' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? '#C8102E' : 'none'}
            stroke={wishlisted ? '#C8102E' : '#999'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        {/* Listing cards show sizes only. Prices are shown on the product detail page. */}
        {isNew ? (
          <div className="pc-coming-soon">New - Price TBD</div>
        ) : hasSizes ? (
          <div className="pc-size-price-list">
            {product.sizeOptions.map(s => (
              <span key={s.size} className="pc-size-pill">
                {s.size}
              </span>
            ))}
          </div>
        ) : (
          <div className="pc-size-price-list">
            <span className="pc-size-pill">
              {product.unit}
            </span>
          </div>
        )}

        <div className="product-card-actions">
          {!isNew ? (
            <>
              <button className="btn-add-cart"
                onClick={e => { e.stopPropagation(); addToCart(product); }}>
                <ShoppingCart size={13} /> Add to Cart
              </button>
              <a href="https://wa.me/9779857021032" target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()} className="btn-whatsapp-sm">
                <MessageCircle size={16} />
              </a>
            </>
          ) : (
            <a href="https://wa.me/9779857021032" target="_blank" rel="noreferrer"
              className="btn-add-cart"
              style={{ background: '#28A745', textDecoration: 'none', justifyContent: 'center' }}
              onClick={e => e.stopPropagation()}>
              <MessageCircle size={13} /> Enquire
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams]  = useSearchParams();
  const initCat    = searchParams.get('cat')    || 'All Products';
  const initSearch = searchParams.get('search') || '';
  const [activeCat, setActiveCat] = useState(initCat);
  const { searchQuery } = useApp();
  const productsSectionRef = useRef(null);
  const products = useCmsResource('/products/', PRODUCTS);
  const cmsCategories = useCmsResource('/categories/', CATEGORIES);
  const categories = useMemo(
    () => (cmsCategories.length <= 1 ? CATEGORIES : cmsCategories)
      .map((cat) => (typeof cat === 'string' ? cat : cat.name)),
    [cmsCategories]
  );

  useEffect(() => {
    setActiveCat(initCat);
  }, [initCat]);

  const handleCategoryClick = (cat) => {
    setActiveCat(cat);
    requestAnimationFrame(() => {
      productsSectionRef.current?.scrollIntoView({ block: 'start' });
    });
  };

  const filtered = useMemo(() => {
    let list = products;
    const q = (initSearch || searchQuery || '').toLowerCase();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    if (activeCat !== 'All Products') list = list.filter(p => p.category === activeCat);
    return list;
  }, [activeCat, searchQuery, initSearch, products]);

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg"
          style={{ backgroundImage: 'url(/images/productshero.png)' }} />
        <div className="page-hero-content">
          <div className="breadcrumb">
            <Home size={13} /><a href="/">HOME</a><span>›</span><span>PRODUCTS</span>
          </div>
          <h1>Our Product Collection</h1>
          <div className="hero-underline" />
          <p>Discover our complete range of authentic, premium snacks crafted for the perfect crunch.</p>
        </div>
      </div>

      <nav className="product-subnav" aria-label="Product categories">
        <div className="product-subnav__inner">
          <span className="product-subnav__label">Shop by category</span>
          <div className="product-subnav__links">
            {categories.map(cat => (
              <button key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`product-subnav__link${activeCat === cat ? ' product-subnav__link--active' : ''}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section ref={productsSectionRef} className="section products-section" style={{ background: '#F4F4F4', minHeight: 400 }}>
        <div className="container">
          <p className="results-count">
            Showing <strong>{filtered.length}</strong> products
            {activeCat !== 'All Products' && ` in ${activeCat}`}
          </p>

          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
