import json
from decimal import Decimal

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Category, ContactInfo, ContactMessage, Feedback, HomePageContent, Order, Product


def cors_response(data, status=200):
    response = JsonResponse(data, status=status, safe=not isinstance(data, list))
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def decimal_to_number(value):
    if isinstance(value, Decimal):
        return int(value) if value == value.to_integral_value() else float(value)
    return value


def category_to_dict(category):
    return {
        "id": category.id,
        "name": category.name,
        "description": category.description,
        "image": category.image,
    }


def product_to_dict(product):
    size_options = product.size_options or []
    sizes = [item.get("size") for item in size_options if item.get("size")]
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category.name,
        "price": decimal_to_number(product.price),
        "unit": product.unit,
        "description": product.description,
        "image": product.image,
        "sizeOptions": size_options,
        "sizes": sizes or ([product.unit] if product.unit else []),
        "reviews": product.reviews,
        "rating": product.rating,
        "ingredients": product.ingredients,
        "allergy": product.allergy,
        "badge": product.badge,
        "isFeatured": product.is_featured,
        "featuredSortOrder": product.featured_sort_order,
    }


def site_content(request):
    content = HomePageContent.objects.first() or HomePageContent()
    return cors_response({
        "badgeText": content.badge_text,
        "heroTitle": content.hero_title,
        "heroHighlight": content.hero_highlight,
        "heroSubtitle": content.hero_subtitle,
        "primaryButtonText": content.primary_button_text,
        "secondaryButtonText": content.secondary_button_text,
        "stats": [
            {"value": content.happy_retailers, "label": "Happy Retailers"},
            {"value": content.product_lines, "label": "Product Lines"},
            {"value": content.districts, "label": "Districts"},
        ],
        "videoUrl": content.video_url,
        "heroImages": content.hero_images,
    })


def categories(request):
    data = [{"id": "all", "name": "All Products"}]
    data.extend(category_to_dict(category) for category in Category.objects.filter(is_active=True))
    return cors_response(data)


def products(request):
    qs = Product.objects.select_related("category").filter(is_active=True, category__is_active=True)
    return cors_response([product_to_dict(product) for product in qs])


def feedback(request):
    data = [
        {
            "id": item.id,
            "name": item.customer_name,
            "location": item.location,
            "text": item.text,
            "rating": item.rating,
        }
        for item in Feedback.objects.filter(is_visible=True)
    ]
    return cors_response(data)


def contact_info(request):
    info = ContactInfo.objects.first() or ContactInfo()
    return cors_response({
        "customerSupportPhone": info.customer_support_phone,
        "businessPhone": info.business_phone,
        "whatsappNumber": info.whatsapp_number,
        "supportEmail": info.support_email,
        "salesEmail": info.sales_email,
        "address": info.address,
        "businessHours": info.business_hours,
        "facebookUrl": info.facebook_url,
        "instagramUrl": info.instagram_url,
        "twitterUrl": info.twitter_url,
    })


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def contact_messages(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        data = json.loads(request.body or "{}")
        message = ContactMessage.objects.create(
            name=data.get("name", "").strip(),
            email=data.get("email", "").strip(),
            phone=data.get("phone", "").strip(),
            inquiry=data.get("inquiry", "").strip(),
            message=data.get("message", "").strip(),
        )
    except Exception as exc:
        return cors_response({"error": str(exc)}, status=400)
    return cors_response({"id": message.id, "status": "received"}, status=201)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def orders(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        data = json.loads(request.body or "{}")
        order = Order.objects.create(
            full_name=data.get("fullName", "").strip(),
            phone=data.get("phone", "").strip(),
            address=data.get("address", "").strip(),
            notes=data.get("notes", "").strip(),
            payment_method=data.get("payment", "whatsapp"),
            total=data.get("total") or 0,
            items=data.get("items") or [],
        )
    except Exception as exc:
        return cors_response({"error": str(exc)}, status=400)
    return cors_response({"id": order.id, "status": order.status}, status=201)


def api_root(request):
    return cors_response({
        "message": "R&R Food Products API",
        "endpoints": {
            "site-content": "/api/site-content/",
            "categories": "/api/categories/",
            "products": "/api/products/",
            "feedback": "/api/feedback/",
            "contact-info": "/api/contact-info/",
            "contact-messages": "/api/contact-messages/",
            "orders": "/api/orders/",
            "admin": {
                "login": "/api/admin/login/",
                "products": "/api/admin/products/",
                "product-detail": "/api/admin/products/<id>/",
                "categories": "/api/admin/categories/",
                "category-detail": "/api/admin/categories/<id>/",
                "orders": "/api/admin/orders/",
                "order-detail": "/api/admin/orders/<id>/",
                "feedback": "/api/admin/feedback/",
                "feedback-detail": "/api/admin/feedback/<id>/",
                "site-content": "/api/admin/site-content/",
                "contact-info": "/api/admin/contact-info/",
                "upload": "/api/admin/upload/",
                "media": "/api/admin/media/",
            },
        },
    })


def root_view(request):
    return HttpResponse("""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>R&R Food Products — API</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f6fa; color: #2c2c2c; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 16px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    h1 { font-size: 24px; font-weight: 800; color: #C8102E; margin: 0 0 6px; }
    p { color: #666; font-size: 14px; margin: 0 0 24px; }
    .links { display: flex; flex-direction: column; gap: 10px; }
    .links a { display: block; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; transition: all .2s; }
    .links a:hover { transform: translateY(-1px); }
    .btn-primary { background: #C8102E; color: #fff; }
    .btn-primary:hover { background: #a00e25; }
    .btn-outline { border: 1.5px solid #ddd; color: #555; }
    .btn-outline:hover { border-color: #C8102E; color: #C8102E; }
    small { color: #999; font-size: 12px; margin-top: 24px; display: block; }
  </style>
</head>
<body>
  <div class="card">
    <h1>R&R Food Products</h1>
    <p>Backend API server is running.</p>
    <div class="links">
      <a href="/api/" class="btn-primary">API Root</a>
      <a href="/django-admin/" class="btn-outline">Django Admin</a>
    </div>
    <small>Admin SPA runs at <code>http://localhost:3000/admin</code></small>
  </div>
</body>
</html>
""")

