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
├──═ PUBLIC WEBSITE ═══════════════════════════════════════════════
│   ├── public/
│   │   ├── index.html
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
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Varieties.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Wishlist.jsx
│   │   └── styles/global.css
│   │
│   └── package.json
│
├──═ CMS DASHBOARD ═══════════════════════════════════════════════
│   └── src/pages/admin/
│       ├── AdminLogin.jsx
│       ├── AdminLayout.jsx
│       ├── Dashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminCategories.jsx
│       ├── AdminOrders.jsx
│       ├── AdminFeedback.jsx
│       ├── AdminContent.jsx
│       ├── AdminContact.jsx
│       └── AdminMedia.jsx
│
├──═ BACKEND (Django API) ════════════════════════════════════════
│   ├── backend/
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   ├── db.sqlite3
│   │   │
│   │   ├── cms_backend/
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── wsgi.py
│   │   │   └── asgi.py
│   │   │
│   │   └── cms/
│   │       ├── admin.py
│   │       ├── admin_views.py
│   │       ├── models.py
│   │       ├── views.py
│   │       ├── urls.py
│   │       ├── management/commands/
│   │       └── migrations/
│   │
│   ├── vercel.json
│   └── render.yaml
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
| Login | `/admin/login` | Token-based authentication |
| Dashboard | `/admin` | Summary counts (products, categories, orders, feedback) |
| Products | `/admin/products` | Product CRUD with image upload |
| Categories | `/admin/categories` | Category CRUD |
| Orders | `/admin/orders` | Order management with status updates |
| Feedback | `/admin/feedback` | Testimonial CRUD |
| Site Content | `/admin/content` | Homepage hero, stats, video, images editor |
| Contact Info | `/admin/contact` | Phone, email, address, hours editor |
| Media | `/admin/media` | Upload, browse, delete images & videos |

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
| `POST /api/admin/login/` | Authenticate (get token) |
| `GET/POST /api/admin/products/` | List / create products |
| `PUT/DELETE /api/admin/products/:id/` | Update / delete product |
| `GET/POST /api/admin/categories/` | List / create categories |
| `PUT/DELETE /api/admin/categories/:id/` | Update / delete category |
| `GET/POST /api/admin/orders/` | List / create orders |
| `PUT/DELETE /api/admin/orders/:id/` | Update / delete order |
| `GET/POST /api/admin/feedback/` | List / create feedback |
| `PUT/DELETE /api/admin/feedback/:id/` | Update / delete feedback |
| `GET/PUT /api/admin/site-content/` | Read / update homepage content |
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
- Product, category, order, feedback CRUD
- Homepage content editor (hero, stats, video, hero images)
- Contact information editor
- Media manager (upload, browse, delete images/videos)
- Dashboard with real-time summary counts

### Backend
- Django REST API with JSON responses
- Django Admin interface for database management
- SQLite database (portable, zero-config)
- CORS enabled for cross-origin requests

---

## Customization

### Update WhatsApp Number

Update in:

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
