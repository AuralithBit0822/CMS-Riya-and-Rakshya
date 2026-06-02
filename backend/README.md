# R&R Food Products CMS Backend

This Django backend gives the owner a CMS through Django Admin and exposes JSON APIs for the React website.

## Run

```bash
cd backend
python manage.py migrate
python manage.py seed_cms
python manage.py createsuperuser
python manage.py runserver
```

Admin panel:

```text
http://127.0.0.1:8000/admin/
```

API base:

```text
http://127.0.0.1:8000/api/
```

## Owner Can Manage

- Products and categories
- Homepage hero text and stats
- Feedback/testimonials
- Contact details
- Contact form messages
- Orders and order status
