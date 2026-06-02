import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Home, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { useCmsResource } from '../api/cms';
import './Pages.css';

const REVIEWERS = [
  { name: 'Prakash Bhatta', location: 'Pokhara, Kaski' },
  { name: 'Sita Devi Chaudhary', location: 'Janakpur, Dhanusha' },
  { name: 'Ramesh Kumar Yadav', location: 'Butwal, Rupandehi' },
  { name: 'Anita Gurung', location: 'Dharan, Sunsari' },
  { name: 'Dipesh Mahato', location: 'Biratnagar, Morang' },
  { name: 'Niraj Shrestha', location: 'Kathmandu' },
  { name: 'Sabina Thapa', location: 'Hetauda, Makwanpur' },
  { name: 'Bikash Adhikari', location: 'Chitwan' },
  { name: 'Mina Karki', location: 'Nepalgunj, Banke' },
  { name: 'Kiran Rai', location: 'Ilam' },
  { name: 'Puja Lamichhane', location: 'Tansen, Palpa' },
  { name: 'Amit Sah', location: 'Birgunj, Parsa' },
];

const REVIEW_TEMPLATES = {
  'Instant Noodles': [
    'The masala has a nice kick and the noodles are quick for evening snacks. {product} has become a regular pack at our home.',
    'I bought {product} for the shop and customers ask for it again. The taste feels fresh and the price is easy to sell.',
  ],
  'Chips & Crisps': [
    '{product} is crispy and the flavour is strong without feeling too oily. The packet stayed fresh during delivery.',
    'My kids finished {product} the same day. Good crunch, good masala, and perfect for tiffin snacks.',
  ],
  'Kids Snacks': [
    '{product} is fun for children and still tasty for adults. The pack size is convenient for school breaks.',
    'We tried {product} for a family gathering and the kids loved it. Fresh, crunchy, and easy to share.',
  ],
  'Diet & Health': [
    '{product} feels lighter than regular fried snacks but still has good flavour. I like keeping it for tea time.',
    'Good balance of crunch and spice in {product}. It arrived fresh and the quality felt consistent.',
  ],
  'Spicy Namkeen': [
    '{product} has that proper Nepali chatpate taste. Crunchy, spicy, and perfect with chiya.',
    'The spice mix in {product} is very satisfying. I ordered it for home and everyone liked the freshness.',
  ],
};

function getProductReviews(product) {
  const templates = REVIEW_TEMPLATES[product.category] || REVIEW_TEMPLATES['Spicy Namkeen'];
  const firstIndex = product.id % REVIEWERS.length;
  const secondIndex = (product.id * 3 + 5) % REVIEWERS.length;
  const reviewers = [
    REVIEWERS[firstIndex],
    REVIEWERS[secondIndex === firstIndex ? (secondIndex + 1) % REVIEWERS.length : secondIndex],
  ];

  return reviewers.map((reviewer, index) => ({
    ...reviewer,
    rating: index === 0 ? product.rating : Math.max(4, product.rating - 1),
    text: templates[index % templates.length].replace('{product}', product.name),
  }));
}

export default function ProductDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { addToCart, toggleWishlist } = useApp();
  const products   = useCmsResource('/products/', PRODUCTS);
  const product    = products.find(p => p.id === parseInt(id));
  const hasSizes   = product?.sizeOptions && product.sizeOptions.length > 0;
  const [selected, setSelected] = useState(product?.sizeOptions?.[0] || null);

  useEffect(() => {
    setSelected(product?.sizeOptions?.[0] || null);
  }, [product]);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2>Product not found</h2>
      <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/products')}>
        Back to Products
      </button>
    </div>
  );

  const isNew    = product.price === 0;
  const related  = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const reviews  = getProductReviews(product);

  return (
    <div style={{ background: '#F4F4F4', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="breadwrap">
        <div className="container">
          <div className="pd-breadcrumb">
            <Home size={13} /><Link to="/" className="pd-bc-link">HOME</Link>
            <ChevronRight size={12} /><Link to="/products" className="pd-bc-link">PRODUCTS</Link>
            <ChevronRight size={12} /><span>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container pd-wrap">
        {/* Main card */}
        <div className="pd-card">
          <div className="pd-img-wrap">
            <img src={product.image} alt={product.name} className="pd-img" loading="eager" decoding="async"
              onError={e => { e.target.style.opacity = '0.3'; }} />
            {isNew && <div className="pd-new-overlay">🔥 New Launch</div>}
          </div>

          <div className="pd-info">
            <div className="pd-top-row">
              <span className="pd-cat-badge">{product.category}</span>
              {product.badge && <span className="pd-product-badge">{product.badge}</span>}
            </div>

            <h1 className="pd-title">{product.name}</h1>

            {product.reviews > 0 && (
              <div className="pd-rating">
                <span style={{ color: '#FFC107', fontSize: 16 }}>
                  {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                </span>
                <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>
                  ({product.reviews} Customer Reviews)
                </span>
              </div>
            )}

            <p className="pd-desc">{product.description}</p>

            {/* Price / Size selector */}
            {isNew ? (
              <div className="pd-coming-soon">
                🔥 New product — Price to be announced. Enquire via WhatsApp for bulk orders.
              </div>
            ) : hasSizes ? (
              <div className="pd-sizes-wrap">
                <div className="pd-size-label">Select Size &amp; Price</div>
                <div className="pd-sizes">
                  {product.sizeOptions.map(s => (
                    <button key={s.size}
                      className={`pd-size-btn${selected?.size === s.size ? ' pd-size-btn--active' : ''}`}
                      onClick={() => setSelected(s)}>
                      <span className="pd-size-size">{s.size}</span>
                      <span className="pd-size-price">Rs.{s.price}</span>
                    </button>
                  ))}
                </div>
                {selected && (
                  <div className="pd-price">
                    Rs. <span className="pd-price-num">{selected.price}</span>
                    <span className="pd-price-unit"> / {selected.size}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="pd-price">
                Rs. <span className="pd-price-num">{product.price}</span>
                <span className="pd-price-unit"> / {product.unit}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pd-actions">
              {!isNew ? (
                <>
                  <button className="btn-primary"
                    onClick={() => addToCart(product, selected?.size || product.unit)}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <a href="https://wa.me/9779820299711" target="_blank" rel="noreferrer"
                    className="btn-green" style={{ textDecoration: 'none' }}>
                    <MessageCircle size={16} /> Chat via WhatsApp
                  </a>
                </>
              ) : (
                <a href="https://wa.me/9779820299711" target="_blank" rel="noreferrer"
                  className="btn-green" style={{ textDecoration: 'none', padding: '12px 28px', fontSize: 15 }}>
                  <MessageCircle size={16} /> Enquire on WhatsApp
                </a>
              )}
            </div>

            <div className="pd-trust">
              <span><ShieldCheck size={13} color="#28A745" /> Secure Checkout</span>
              <span>⚡ Fast Delivery</span>
              <span>🌿 100% Vegetarian</span>
            </div>
          </div>
        </div>

        {/* Reviews + Ingredients */}
        <div className="pd-reviews-grid">
          <div className="pd-white-card">
            <h3 className="pd-sec-title">Customer Reviews</h3>
            {reviews.map((r, i) => (
              <div key={i} className="pd-review">
                <div className="pd-review-name">
                  {'★'.repeat(r.rating)}
                  <span style={{ color: '#333', marginLeft: 8 }}>{r.name}</span>
                  <span style={{ color: '#888', marginLeft: 6, fontWeight: 400 }}>({r.location})</span>
                </div>
                <p className="pd-review-text">{r.text}</p>
              </div>
            ))}
          </div>
          <div className="pd-white-card">
            <h3 className="pd-sec-title">Ingredients</h3>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>{product.ingredients}</p>
            <h3 className="pd-sec-title" style={{ marginTop: 20 }}>Allergy Information</h3>
            <div className="pd-allergy">{product.allergy}</div>
          </div>
        </div>

        {/* Why You'll Love It */}
        <div className="pd-why-grid">
          <div className="pd-quality-card">
            <div className="pd-quality-icon"><ShieldCheck size={28} color="#fff" /></div>
            <h4 className="pd-quality-title">Quality Assured</h4>
            <p className="pd-quality-text">Manufactured in our ISO certified facility with the highest standards of food safety and hygiene.</p>
          </div>
          <div className="pd-white-card">
            <h3 className="pd-sec-title">Why You'll Love It</h3>
            <div className="pd-why-items">
              {[
                { icon: '⭐', t: 'Authentic Flavor',   d: 'Crafted with care using time-tested flavor profiles.' },
                { icon: '🕐', t: 'Handmade Touch',     d: 'Each item is carefully handcrafted for unique character.' },
                { icon: '🌿', t: 'Fresh Ingredients',  d: 'Sourced locally to ensure peak freshness and quality.' },
                { icon: '🛡', t: 'Sustainable',        d: 'Committed to eco-friendly methods throughout production.' },
              ].map(w => (
                <div key={w.t} className="pd-why-item">
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{w.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{w.t}</div>
                    <div style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{w.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pd-related">
            <div className="label-tag">EXPLORE MORE</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 20px' }}>You Might Also Like</h2>
            <div className="pd-related-grid">
              {related.map(p => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/products/${p.id}`)}>
                  <div className="product-card-img">
                    <img src={p.image} alt={p.name} loading="lazy" decoding="async"
                      onError={e => { e.target.style.opacity = '0.3'; }} />
                    <span className="product-card-badge">{p.category}</span>
                    <button className="product-card-heart"
                      onClick={e => { e.stopPropagation(); toggleWishlist(p); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <div className="product-card-body">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    {p.price === 0 ? (
                      <div className="pc-coming-soon">Coming Soon</div>
                    ) : p.sizeOptions?.length > 0 ? (
                      <div className="pc-size-price-list">
                        {p.sizeOptions.map((s) => (
                          <span key={s.size} className="pc-size-pill">{s.size}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="pc-size-price-list">
                        <span className="pc-size-pill">{p.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
