import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Send } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useCmsResource } from '../api/cms';
import './Footer.css';

const DEFAULT_CONTACT = {
  customerSupportPhone: '+977 982-0299711',
  businessPhone: '+977 985-7021032',
  supportEmail: 'Support@riyarakshya.com.np',
  salesEmail: 'Sales@riyarakshya.com.np',
  address: 'S.No.-4, SugarMill, Bhairahwa, Rupandehi, Nepal',
  businessHours: 'Sun-Fri: 9:00 AM - 6:00 PM',
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const cmsCategories = useCmsResource('/categories/', CATEGORIES);
  const contact = useCmsResource('/contact-info/', DEFAULT_CONTACT);
  const categories = (cmsCategories.length <= 1 ? CATEGORIES : cmsCategories)
    .map((cat) => (typeof cat === 'string' ? cat : cat.name));

  const submit = (e) => {
    e.preventDefault();
    if (email) {
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__top footer-top-grid container">
        <div className="footer-brand-col">
          <div className="footer__brand-row">
            <img
              src="/images/Logo.png"
              alt="R&R"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div className="footer__brand-name">Riya &amp; Rakshya</div>
              <div className="footer__brand-sub">Food products</div>
            </div>
          </div>
          <p className="footer__brand-desc">
            Bringing the authentic taste of Nepal to your home with our premium quality snacks,
            tasty noodles and namkeen.
          </p>
          <div className="footer__socials">
            {[
              [Facebook, 'Facebook'],
              [Instagram, 'Instagram'],
              [Twitter, 'Twitter'],
            ].map(([Icon, t]) => (
              <a key={t} href="#!" className="footer__social" title={t} aria-label={t}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          {[
            ['/', 'Home'],
            ['/products', 'Products'],
            ['/varieties', 'Varieties'],
            ['/about', 'About Us'],
            ['/contact', 'Contact Us'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="footer__link">
              {label}
            </Link>
          ))}
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Product Categories</h4>
          {categories.map((cat) => (
            <Link key={cat} to={`/products?cat=${encodeURIComponent(cat)}`} className="footer__link">
              {cat}
            </Link>
          ))}
        </div>

        <div className="footer__col footer__contact-col">
          <h4 className="footer__col-title">Contact Us</h4>
          <div className="footer__contact-row">
            <MapPin size={14} />
            <span className="footer__contact-txt">
              {contact.address}
            </span>
          </div>
          <div className="footer__contact-row">
            <Phone size={14} />
            <div className="footer__contact-txt">
              {contact.customerSupportPhone}
              <br />
              <span>Customer Support</span>
              <br />
              {contact.businessPhone}
              <br />
              <span>Business / Wholesale</span>
            </div>
          </div>
          <div className="footer__contact-row">
            <Mail size={14} />
            <span className="footer__contact-txt">
              {contact.supportEmail}
              <br />
              {contact.salesEmail}
            </span>
          </div>
          <div className="footer__contact-row">
            <Clock size={14} />
            <span className="footer__contact-txt">{contact.businessHours}</span>
          </div>
        </div>

        <div className="footer-subscribe-col">
          <h4 className="footer__col-title">Subscribe</h4>
          <form onSubmit={submit} className="footer__sub-form">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="footer__sub-input"
            />
            <button type="submit" className="footer__sub-btn" aria-label="Subscribe">
              <Send size={14} />
            </button>
          </form>
          {done && <div className="footer__sub-success">Subscribed!</div>}
          <p className="footer__sub-text">
            Get fresh product updates, wholesale information, and seasonal offers from Riya &amp;
            Rakshya Food Products.
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>&copy; 2026 Riya &amp; Rakshya Food Products. All rights reserved.</span>
        <br />
        <small>Designed, Developed and Delivered by Auralith Bit</small>
      </div>
    </footer>
  );
}
