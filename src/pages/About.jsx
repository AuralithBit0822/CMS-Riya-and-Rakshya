import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageCircle, ShieldCheck, Award, Leaf } from 'lucide-react';
import { TEAM } from '../data/products';
import { useCmsResource } from '../api/cms';
import './Pages.css';

const MANUFACTURE_PRODUCTS = [
  {
    img: '/images/products/kushal_all_in_opne_namkeen.png',
    label: 'Spicy Namkeen',
    category: 'Spicy Namkeen',
    sub: 'Crunchy, flavourful, and irresistible.'
  },
  {
    img: '/images/products/kushal_chatapate.png',
    label: 'Bhujha & Chatpate Bhujha',
    category: 'Bhujha & Chatpate Bhujha',
    sub: 'Crunchy, flavourful, and irresistible.'
  },
  {
    img: '/images/products/Korean_Hot_Spicy.png',
    label: 'Fryums',
    category: 'Fryums',
    sub: 'Crunchy, flavourful, and irresistible.'
  },
  {
    img: '/images/products/Potato.jpg',
    label: 'Chips/Kurkure/Cheese Balls',
    category: 'Chips/Kurkure/Cheese Balls',
    sub: 'Crunchy, flavourful, and irresistible.'
  },
  {
    img: '/images/products/Gudiya_Rani.png',
    label: 'Puffs',
    category: 'Puffs',
    sub: 'Crunchy, flavourful, and irresistible.'
  },
  {
    img: '/images/products/die_mixture.jpg',
    label: 'Diet & Health',
    category: 'Diet & Health',
    sub: 'Crunchy, flavourful, and irresistible.'
  }
];

const ABOUT_FALLBACK = {
  heroImage: '/images/abouthero.png',
  storyTitle: "The R&R Story",
  storyParagraphs: [
    "We started with one goal: make snacks that are fast, tasty, and satisfying. From our kitchen to your table, every bite is crafted with care, using quality ingredients and traditional recipes. We believe that great taste comes from consistency and passion in every step of the process.",
    "Our manufacturing journey began in a small kitchen in Bhairahwa, Nepal. We started as a family project, carefully crafting everything by hand. We used traditional recipes, blending age-old flavors with modern convenience. Word started spreading about the snacks, local shops started asking for more, and before we knew it, Riya & Rakshya Food Products was born.",
    "Today, Riya and Rakshya Food Products manufactures over 50 varieties of instant noodles, namkeen, dalmot, chips and bhujiya — loved by thousands across Nepal. We are committed to maintaining consistency, hygiene, and authentic flavours in every product we deliver."
  ],
  missionTitle: "Our Mission",
  missionText: "To become Nepal's most trusted and widely traded snack brand, bringing happiness in every bite.",
  visionTitle: "Our Vision",
  visionText: "To become Nepal's most loved and widely loved snack brand, spreading love and happiness we bring to our customers.",
  qualityTitle: "Our Commitment To Quality & Safety",
  qualityText: "Our snacks are prepared in a clean, hygienic environment with strict quality checks, ensuring every bite is safe and tasty. From sourcing to packaging, we never compromise.\n\nOur manufacturing facility follows strict hygiene protocols — our team wears gloves, helmets, and protective gear at all times. We use modern machinery and follow standardized processes to ensure every pack meets our high standards.\n\nWe believe that great taste starts with great ingredients. That's why we source our spices locally and never compromise on the quality of raw materials.",
  stats: [
    { value: '50+', label: 'Products Manufactured' },
    { value: '77', label: 'Districts Covered' },
    { value: '500+', label: 'Retail Partners' },
    { value: '10K+', label: 'Daily Production (Kg)' },
  ],
  whyChooseTitle: "Why Choose Riya & Rakshya?",
  whyChooseItems: [
    { title: 'Delicious Taste', description: 'Authentic Nepal flavours loved by people from all ages.' },
    { title: 'Multiple Size', description: 'From 50g to 1 kg — a size for every need.' },
    { title: 'Affordable Pricing', description: 'Premium quality snacks at prices everyone can afford.' },
    { title: 'Trusted Quality', description: 'Stringent quality checks ensure every pack is perfect.' },
    { title: 'Consistent Experience', description: 'Same great taste in every single pack.' },
  ],
  ctaLeftTitle: "Ready to explore our snacks?",
  ctaLeftText: "Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes. From crispy bites to rich, flavorful treats, find the perfect treat for every moment.",
  ctaRightTitle: "Interested in Bulk Orders or Distribution?",
  ctaRightText: "We're always looking for retail partners and distributors across Nepal. Get factory-direct pricing and dedicated support.",
};

function TeamMemberCard({ member }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(member.image) && !imageFailed;
  const initials = member.initials || member.name.split(' ').map((part) => part[0]).join('').slice(0, 2);

  return (
    <div className="about-team-card">
      <div className="about-team-photo">
        {hasImage ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="about-team-placeholder" aria-label={`${member.name} profile placeholder`}>
            <img src="/images/Logo.png" alt="" />
            <span>{initials}</span>
          </div>
        )}
      </div>
      <div className="about-team-body">
        <div className="about-team-name">{member.name}</div>
        <div className="about-team-role">{member.role}</div>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const content = useCmsResource('/about-content/', ABOUT_FALLBACK);

  const qualityParagraphs = content.qualityText ? content.qualityText.split('\n').filter(Boolean) : [];

  return (
    <div>
      {/* HERO */}
      <div className="page-hero" style={{ background: '#222' }}>
        <div className="page-hero-bg" style={{ backgroundImage: `url(${content.heroImage})` }} />
        <div className="page-hero-content">
          <div className="breadcrumb">
            <Home size={13} /><a href="/">HOME</a><span>›</span><span>ABOUT</span>
          </div>
          <h1>About Riya &amp; Rakshya Food Products</h1>
          <p>From a small kitchen dream to Nepal's beloved snack brand — here's our story.</p>
        </div>
      </div>

      <div style={{ background: '#fff' }}>

        {/* THE R&R STORY */}
        <section className="section">
          <div className="container">
            <div className="about-story-grid">
              <div>
                <div className="label-tag">ABOUT US</div>
                <h2 style={s.h2}>{content.storyTitle}</h2>
                {content.storyParagraphs.map((p, i) => (
                  <p key={i} style={s.p}>{p}</p>
                ))}
              </div>
              <div className="about-story-img">
                <img
                  src="/images/rnr-about.jpg"
                  alt="R&R Products"
                  loading="lazy"
                  decoding="async"
                />
                <div className="about-story-badge">
                  <div className="about-story-badge__num">{content.stats[0]?.value || '50+'}</div>
                  <div className="about-story-badge__txt">{content.stats[0]?.label || 'Products Manufactured'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section style={{ background: '#FFFDE7', padding: '50px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="label-tag">WHAT DRIVES US</div>
              <h2 style={s.h2}>The Core Purpose And Future Aspirations Of Our Company</h2>
            </div>
            <div className="about-mv-grid">
              <div style={s.missionCard}>
                <div style={s.mvIcon}>🎯</div>
                <div style={s.mvLabel}>{content.missionTitle}</div>
                <h3 style={s.mvTitle}>{content.missionText}</h3>
                <div style={s.mvTags}>
                  {['Tasty', 'Convenient', 'Affordable'].map(t => <span key={t} style={s.mvTag}>{t}</span>)}
                </div>
              </div>
              <div style={s.visionCard}>
                <div style={s.mvIcon}>🔭</div>
                <div style={s.mvLabel}>{content.visionTitle}</div>
                <h3 style={s.mvTitle}>{content.visionText}</h3>
                <div style={s.mvTags}>
                  {['Innovative', 'Loved', 'Trusted'].map(t => (
                    <span key={t} style={{ ...s.mvTag, background: 'rgba(255,255,255,0.25)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE MANUFACTURE */}
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div className="label-tag">OUR PRODUCTS</div>
              <h2 style={s.h2}>What We Manufacture</h2>
            </div>
            <div className="about-products-grid">
              {MANUFACTURE_PRODUCTS.map((p, i) => (
                <div
                  key={i}
                  style={s.productThumb}
                  onClick={() => navigate(`/products?cat=${encodeURIComponent(p.category)}`)}
                >
                  <img src={p.img} alt={p.label} style={s.thumbImg} />
                  <div style={s.thumbOverlay} />
                  <div style={s.thumbContent}>
                    <div style={s.thumbLabel}>{p.label}</div>
                    <div style={s.thumbSub}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              {['⭐ Great Taste', '🌿 Quality Ingredients', '🏆 Ultimate Convenience'].map(b => (
                <span key={b} style={s.featureBadge}>{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* QUALITY & SAFETY */}
        <section style={{ background: '#F4F4F4', padding: '50px 0' }}>
          <div className="container">
            <div className="about-qual-grid">
              <div style={s.qualImgWrap}>
                <img src="/images/products/bnOONDI_MIXTURE_STAND.png" alt="Quality" style={s.qualImgMain} />
                <img src="/images/products/sadhabahar.png" alt="Premium" style={s.qualImgOverlay} />
              </div>
              <div>
                <div className="label-tag">QUALITY FIRST</div>
                <h2 style={s.h2}>{content.qualityTitle}</h2>
                {qualityParagraphs.length > 0 ? qualityParagraphs.map((p, i) => (
                  <p key={i} style={s.p}>{p}</p>
                )) : (
                  <p style={s.p}>{content.qualityText}</p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                  {[
                    { icon: <ShieldCheck size={13} color="#28A745" />, text: 'FSSAI Compliant' },
                    { icon: <Award size={13} color="#1565C0" />,       text: 'ISO Standards' },
                    { icon: '🔬',                                       text: 'Quality Tested' },
                    { icon: <Leaf size={13} color="#2E7D32" />,        text: 'No Preservatives' },
                  ].map(b => (
                    <span key={b.text} style={s.qualBadge}>{b.icon} {b.text}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={{ background: '#2a2a2a', padding: '48px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="label-tag" style={{ color: '#FFC107' }}>OUR SCALE</div>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>Manufacturing At Scale</h2>
              <p style={{ color: '#aaa', fontSize: 13, marginTop: 6 }}>Delivering quality snacks across the nation every single day.</p>
            </div>
            <div className="about-stats-row">
              {content.stats.map((stat, i) => (
                <div key={i} style={s.statItem}>
                  <div style={s.statNum}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="label-tag">OUR ADVANTAGES</div>
              <h2 style={s.h2}>{content.whyChooseTitle}</h2>
            </div>
            <div className="about-why-grid">
              {content.whyChooseItems.map((w, i) => (
                <div key={i} style={s.whyItem}>
                  <div style={s.whyIcon}>{w.icon || ['❤️', '📦', '💰', '🛡️', '🔄'][i] || '✨'}</div>
                  <div style={s.whyTitle}>{w.title}</div>
                  <div style={s.whySub}>{w.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section style={{ background: '#F9F6F0', padding: '50px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="label-tag">OUR TEAM</div>
              <h2 style={s.h2}>The People Behind the Brand</h2>
              <p style={{ color: '#777', fontSize: 14 }}>Meet the passionate team that brings your favorite snacks to life.</p>
            </div>
            <div className="about-team-grid">
              {TEAM.map(m => (
                <TeamMemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTAs */}
        <section style={{ background: '#fff', padding: '40px 24px' }}>
          <div className="container">
            <div className="about-cta-row">
              <div style={s.ctaLeft}>
                <h3 style={s.ctaTitle}>{content.ctaLeftTitle}</h3>
                <p style={s.ctaDesc}>{content.ctaLeftText}</p>
                <button className="btn-primary" onClick={() => navigate('/products')}>Explore Menu</button>
              </div>
              <div style={s.ctaRight}>
                <h3 style={{ ...s.ctaTitle, color: '#C8102E' }}>{content.ctaRightTitle}</h3>
                <p style={s.ctaDesc}>{content.ctaRightText}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn-outline" onClick={() => navigate('/varieties')}>Explore Varities →</button>
                  <button className="btn-green" onClick={() => navigate('/contact')}><MessageCircle size={14} /> Contact Sales team</button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

const s = {
  h2:  { fontSize: 24, fontWeight: 800, margin: '10px 0 16px' },
  p:   { color: '#666', fontSize: 14, lineHeight: 1.8, marginBottom: 12 },
  storyGrid:     { display: 'grid', gridTemplateColumns: '1fr 420px', gap: 50, alignItems: 'center' },
  mvGrid:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  missionCard:   { background: '#C8102E', borderRadius: 12, padding: 30, color: '#fff' },
  visionCard:    { background: '#1a1a1a', borderRadius: 12, padding: 30, color: '#fff' },
  mvIcon:        { fontSize: 32, marginBottom: 10 },
  mvLabel:       { fontSize: 12, fontWeight: 700, letterSpacing: 1, opacity: 0.7, marginBottom: 8, textTransform: 'uppercase' },
  mvTitle:       { fontSize: 16, fontWeight: 700, lineHeight: 1.6, marginBottom: 16 },
  mvTags:        { display: 'flex', gap: 8, flexWrap: 'wrap' },
  mvTag:         { background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  productsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  productThumb:  { position: 'relative', borderRadius: 10, overflow: 'hidden', height: 130, cursor: 'pointer' },
  thumbImg:      { width: '100%', height: '100%', objectFit: 'cover' },
  thumbOverlay:  { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' },
  thumbContent:  { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, zIndex: 2 },
  thumbLabel:    { color: '#fff', fontWeight: 700, fontSize: 13 },
  thumbSub:      { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
  featureBadge:  { background: '#F4F4F4', border: '1px solid #e0e0e0', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#555' },
  qualGrid:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' },
  qualImgWrap:   { position: 'relative', height: 360 },
  qualImgMain:   { width: '85%', height: '100%', objectFit: 'contain', borderRadius: 12 },
  qualImgOverlay:{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '55%', objectFit: 'contain', borderRadius: 10, border: '4px solid #fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
  qualBadge:     { background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: '7px 13px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 },
  statsRow:      { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' },
  statItem:      {},
  statNum:       { fontSize: 40, fontWeight: 900, color: '#FFC107', marginBottom: 6 },
  statLabel:     { color: '#aaa', fontSize: 13 },
  whyGrid:       { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 },
  whyItem:       { textAlign: 'center', padding: '24px 16px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  whyIcon:       { fontSize: 32, marginBottom: 12 },
  whyTitle:      { fontWeight: 700, fontSize: 14, marginBottom: 8 },
  whySub:        { color: '#888', fontSize: 12, lineHeight: 1.6 },
  teamGrid:      { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 },
  teamCard:      { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', paddingBottom: 16 },
  teamImg:       { height: 200, overflow: 'hidden' },
  teamName:      { fontWeight: 700, fontSize: 15, marginTop: 14 },
  teamRole:      { color: '#888', fontSize: 12, marginTop: 4 },
  ctaRow:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 },
  ctaLeft:       { background: '#F9F6F0', borderRadius: 12, padding: 28 },
  ctaRight:      { background: '#FFF5F5', borderRadius: 12, padding: 28, border: '1px solid #ffd6d6' },
  ctaTitle:      { fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#1a1a1a' },
  ctaDesc:       { color: '#666', fontSize: 13, lineHeight: 1.7, marginBottom: 18 },
};
