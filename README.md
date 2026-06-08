# R&R Food Products - React Website + Django CMS

A complete modern e-commerce website for **Riya & Rakshya Food Products**, built using **React.js** with responsive UI, product showcase, cart system, wishlist, WhatsApp ordering, and a **Django CMS backend** with an admin dashboard.

---

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn
- Python 3.10+

---

## Installation

```bash
# 1 Clone the Repository
git clone https://github.com/AuralithBit0822/Riya-and-Rakshya-Food-Products.git

# 2 Navigate to Project Folder
cd Riya-and-Rakshya-Food-Products

# 3 Install Frontend Dependencies
npm install

# 4 Set Up Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products   # optional: seed sample data
python manage.py seed_cms        # optional: seed homepage content
cd ..

# 5 Build the Frontend
npm run build
```

---

## Run Production Build Locally

Install serve package globally:

```bash
npm install -g serve
```

Run the build folder:

```bash
serve -s build
```

Open in browser:

```
http://localhost:3000
```

To run the backend locally:

```bash
cd backend
python manage.py runserver
# API runs at http://localhost:8000/api/
```

---

## Project Structure

```
Riya-and-Rakshya-Food-Products/
│
├── .gitattributes
├── .gitignore
├── .npmrc
├── package.json
├── package-lock.json
├── vercel.json
├── render.yaml
├── renumber_products.py
│
├──═ PUBLIC WEBSITE ═══════════════════════════════════════════════
│   ├── public/
│   │   ├── _headers
│   │   ├── index.html
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── images/
│   │   └── videos/
│   │
│   ├── src/
│   │   ├── index.jsx
│   │   ├── App.jsx
│   │   ├── api/cms.js
│   │   ├── context/AppContext.jsx
│   │   ├── data/products.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Varieties.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   └── Pages.css
│   │   └── styles/
│   │       ├── global.css
│   │       └── Admin.css
│   │
│   └── build/
│
├──═ CMS DASHBOARD ═══════════════════════════════════════════════
│   └── src/pages/admin/
│       ├── AdminLogin.jsx
│       ├── Dashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminCategories.jsx
│       ├── AdminOrders.jsx
│       ├── AdminFeedback.jsx
│       ├── AdminContent.jsx
│       ├── AdminContact.jsx
│       ├── AdminMedia.jsx
│       ├── ChangePassword.jsx
│       └── ResetPassword.jsx
│
├──═ BACKEND (Django API) ════════════════════════════════════════
│   └── backend/
│       ├── manage.py
│       ├── requirements.txt
│       ├── runtime.txt
│       ├── Procfile
│       ├── db.sqlite3
│       ├── .env
│       ├── .env.example
│       ├── check_users.py
│       ├── frontend_build/
│       │
│       ├── cms_backend/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── wsgi.py
│       │   └── asgi.py
│       │
│       └── cms/
│           ├── admin.py
│           ├── admin_views.py
│           ├── models.py
│           ├── views.py
│           ├── urls.py
│           ├── apps.py
│           ├── tests.py
│           ├── management/commands/
│           └── migrations/
│
└── README.md
```

---

## Pages & Features

### Public Website

| Page | Route | Features |
|------|-------|---------|
| Home | `/` | Hero section, featured products, testimonials, CTA |
| Products | `/products` | Product listing, filters, search, add to cart |
| Product Detail | `/products/:id` | Product details, reviews, related products |
| Varieties | `/varieties` | Food varieties/categories showcase |
| About | `/about` | Company details, mission, vision |
| Contact | `/contact` | Contact form, FAQ, WhatsApp support |
| Cart | `/cart` | Cart management, checkout, WhatsApp ordering |
| Wishlist | `/wishlist` | Wishlist management system |

### CMS Dashboard

| Page | Route | Features |
|------|-------|---------|
| Login | `/admin/login` | Token-based authentication, forgot password, first-run setup |
| Dashboard | `/admin` | Summary counts (products, categories, orders, feedback) |
| Products | `/admin/products` | Product CRUD with image upload |
| Categories | `/admin/categories` | Category CRUD |
| Orders | `/admin/orders` | Order management with status updates |
| Feedback | `/admin/feedback` | Testimonial CRUD |
| Home Content | `/admin/homecontent` | Homepage hero, stats, video, images editor |
| Contact Info | `/admin/contact` | Phone, email, address, hours, social links editor |
| Media | `/admin/media` | Upload, browse, delete images & videos |
| Change Password | `/admin/change-password` | Update password from within dashboard |
| Reset Password | `/admin/reset-password` | Set new password via email reset link |

### Backend API

| Endpoint | Description |
|---------|-------------|
| `GET /api/site-content/` | Homepage content |
| `GET /api/categories/` | All categories |
| `GET /api/products/` | All products |
| `GET /api/feedback/` | Public testimonials |
| `GET /api/contact-info/` | Contact information |
| `POST /api/contact-messages/` | Submit contact form |
| `POST /api/orders/` | Place an order |
| `GET /api/admin/setup-status/` | Check if admin account needs initial setup |
| `POST /api/admin/setup/` | Create first admin account (no auth required) |
| `POST /api/admin/login/` | Authenticate (get token) |
| `PUT /api/admin/change-password/` | Change password (authenticated) |
| `POST /api/admin/forgot-password/` | Send 6-digit reset code to admin email |
| `POST /api/admin/verify-reset-code/` | Verify reset code and get reset token |
| `POST /api/admin/reset-password/` | Reset password using token |
| `GET/POST /api/admin/products/` | List / create products |
| `PUT/DELETE /api/admin/products/:id/` | Update / delete product |
| `GET/POST /api/admin/categories/` | List / create categories |
| `PUT/DELETE /api/admin/categories/:id/` | Update / delete category |
| `GET/POST /api/admin/orders/` | List / create orders |
| `PUT/DELETE /api/admin/orders/:id/` | Update / delete order |
| `GET/POST /api/admin/feedback/` | List / create feedback |
| `PUT/DELETE /api/admin/feedback/:id/` | Update / delete feedback |
| `GET/PUT /api/admin/home-content/` | Read / update homepage content |
| `GET/PUT /api/admin/contact-info/` | Read / update contact info |
| `POST /api/admin/upload/` | Upload a file |
| `GET/DELETE /api/admin/media/` | Browse / delete media files |

Django Admin is also available at `/django-admin/` (requires staff login).

---

## Functionality

### Website
- Add to Cart System
- Wishlist Functionality
- Product Search & Filters
- Fully Responsive Design
- Form Validation
- WhatsApp Order Integration
- Toast Notifications
- Category Filtering
- Graceful fallback to static data when backend is offline

### CMS Dashboard
- Token-based authentication
- Initial admin account setup wizard (first-run auto-detection)
- Forgot / reset password with email code verification
- Change password from within dashboard
- Product, category, order, feedback CRUD
- Homepage content editor (hero, stats, video, hero images)
- Contact information editor (phone, email, address, hours, social links)
- Media manager (upload, browse, delete images/videos)
- Dashboard with real-time summary counts

### Backend
- Django REST API with JSON responses
- Django Admin interface for database management
- SQLite database (portable, zero-config)
- CORS enabled for cross-origin requests
- Email sending for password reset flows
- Social media links (Facebook, Instagram, Twitter) exposed via ContactInfo API

---

## Customization

### Update WhatsApp Number

The WhatsApp number can be updated via the CMS Dashboard (Contact Info editor), or directly in:

```bash
src/components/Navbar.jsx
src/pages/Cart.jsx
src/pages/Contact.jsx
```

Replace:

```js
href="https://wa.me/YOUR_NUMBER_HERE"
```

### Change Theme Colors

In:

```bash
src/styles/global.css
```

Edit:

```css
:root {
  --primary: #C8102E;
  --green: #28A745;
  --accent: #FFC107;
}
```

---

## Dependencies

- React.js 18
- React DOM
- React Router DOM 6
- Lucide React
- react-scripts 5
- Django 6.0.5

---

## Build for Production

```bash
npm run build
```

Production-ready files will be generated inside:

```bash
build/
```

---

## Deployment

The frontend is deployed on **Vercel** and the backend on **Render**.

**Dual-mode deployment:** The app auto-detects the hostname to serve as a public website (`rnrfood.com`), an admin SPA (`admin.rnrfood.com`), or both modes on localhost.

### Live Website

https://riya-and-rakshya-food-products.vercel.app/

### Vercel Config

See `vercel.json` for static deployment settings.

### Render Config

See `render.yaml` for Django backend deployment settings.

---


### GitHub

https://github.com/AuralithBit0822

---

## License

This project is developed for educational and business purposes.

2026 Riya and Rakshya Food Products. All rights reserved.
