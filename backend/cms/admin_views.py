import json
from decimal import Decimal
from functools import wraps

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Category, ContactInfo, Feedback, HomePageContent, Order, Product

ADMIN_TOKENS = {}


def cors_response(data, status=200):
    response = JsonResponse(data, status=status, safe=not isinstance(data, list))
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


def decimal_to_number(value):
    if isinstance(value, Decimal):
        return int(value) if value == value.to_integral_value() else float(value)
    return value


def is_admin(request):
    if request.user.is_authenticated and request.user.is_staff:
        return True
    auth = request.META.get("HTTP_AUTHORIZATION", "")
    token = auth.replace("Bearer ", "").strip()
    return token in ADMIN_TOKENS


def require_admin(view):
    @wraps(view)
    def wrapper(request, *a, **kw):
        if request.method == "OPTIONS":
            return cors_response({})
        if not is_admin(request):
            return cors_response({"error": "Unauthorized"}, 401)
        return view(request, *a, **kw)
    return wrapper


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def admin_login(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        body = json.loads(request.body or "{}")
        user = authenticate(username=body.get("username"), password=body.get("password"))
        if user is None or not user.is_staff:
            return cors_response({"error": "Invalid credentials"}, 401)
        import secrets
        token = secrets.token_hex(32)
        ADMIN_TOKENS[token] = user.username
        return cors_response({"token": token, "username": user.username})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
@require_admin
def admin_products(request):
    if request.method == "GET":
        data = [{
            "id": p.id,
            "name": p.name,
            "categoryId": p.category_id,
            "category": p.category.name if p.category else "",
            "price": decimal_to_number(p.price),
            "unit": p.unit,
            "description": p.description,
            "image": p.image,
            "sizeOptions": p.size_options,
            "reviews": p.reviews,
            "rating": decimal_to_number(p.rating),
            "ingredients": p.ingredients,
            "allergy": p.allergy,
            "badge": p.badge,
            "isFeatured": p.is_featured,
            "featuredSortOrder": p.featured_sort_order,
            "isActive": p.is_active,
            "sortOrder": p.sort_order,
        } for p in Product.objects.all().order_by('id')]
        return cors_response(data)

    try:
        body = json.loads(request.body or "{}")
        product = Product.objects.create(
            name=body.get("name", ""),
            category_id=body.get("categoryId"),
            price=body.get("price", 0),
            unit=body.get("unit", ""),
            description=body.get("description", ""),
            image=body.get("image", ""),
            size_options=body.get("sizeOptions", []),
            reviews=body.get("reviews", 0),
            rating=body.get("rating", 5),
            ingredients=body.get("ingredients", ""),
            allergy=body.get("allergy", ""),
            badge=body.get("badge", ""),
            is_featured=body.get("isFeatured", False),
            featured_sort_order=body.get("featuredSortOrder", 0),
            is_active=body.get("isActive", True),
            sort_order=body.get("sortOrder", 0),
        )
        return cors_response({"id": product.id, "status": "created"}, 201)
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "DELETE", "OPTIONS"])
@require_admin
def admin_media(request):
    import os
    from django.conf import settings
    public = settings.BASE_DIR.parent / "public"

    if request.method == "DELETE":
        try:
            body = json.loads(request.body or "{}")
            filepath = body.get("path", "")
            full = public / filepath.lstrip("/")
            if full.exists() and full.is_file():
                full.unlink()
                return cors_response({"status": "deleted"})
            return cors_response({"error": "File not found"}, 404)
        except Exception as e:
            return cors_response({"error": str(e)}, 400)

    images_dir = public / "images"
    videos_dir = public / "videos"
    files = []
    if images_dir.exists():
        for root, dirs, fnames in os.walk(images_dir):
            for f in sorted(fnames):
                ext = os.path.splitext(f)[1].lower()
                if ext in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"):
                    rel = os.path.relpath(os.path.join(root, f), public).replace("\\", "/")
                    files.append({"name": f, "path": f"/{rel}", "type": "image", "size": os.path.getsize(os.path.join(root, f))})
    if videos_dir.exists():
        for f in sorted(os.listdir(videos_dir)):
            ext = os.path.splitext(f)[1].lower()
            if ext in (".mp4", ".webm", ".ogg", ".mov"):
                files.append({"name": f, "path": f"/videos/{f}", "type": "video", "size": os.path.getsize(os.path.join(videos_dir, f))})
    return cors_response({"files": files})


@csrf_exempt
@require_http_methods(["PUT", "DELETE", "OPTIONS"])
@require_admin
def admin_product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return cors_response({"error": "Product not found"}, 404)

    if request.method == "DELETE":
        product.delete()
        return cors_response({"status": "deleted"})

    try:
        body = json.loads(request.body or "{}")
        for field, mapping in [
            ("name", "name"), ("categoryId", "category_id"), ("price", "price"),
            ("unit", "unit"), ("description", "description"), ("image", "image"),
            ("sizeOptions", "size_options"), ("reviews", "reviews"), ("rating", "rating"),
            ("ingredients", "ingredients"), ("allergy", "allergy"), ("badge", "badge"),
            ("isFeatured", "is_featured"), ("featuredSortOrder", "featured_sort_order"), ("isActive", "is_active"), ("sortOrder", "sort_order"),
        ]:
            if field in body:
                setattr(product, mapping, body[field])
        product.save()
        return cors_response({"id": product.id, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
@require_admin
def admin_categories(request):
    if request.method == "GET":
        data = [{
            "id": cat.id,
            "name": cat.name,
            "description": cat.description,
            "image": cat.image,
            "isActive": cat.is_active,
            "sortOrder": cat.sort_order,
        } for cat in Category.objects.all()]
        return cors_response(data)

    try:
        body = json.loads(request.body or "{}")
        cat = Category.objects.create(
            name=body.get("name", ""),
            description=body.get("description", ""),
            image=body.get("image", ""),
            is_active=body.get("isActive", True),
            sort_order=body.get("sortOrder", 0),
        )
        return cors_response({"id": cat.id, "status": "created"}, 201)
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE", "OPTIONS"])
@require_admin
def admin_category_detail(request, category_id):
    try:
        cat = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return cors_response({"error": "Category not found"}, 404)

    if request.method == "DELETE":
        cat.delete()
        return cors_response({"status": "deleted"})

    try:
        body = json.loads(request.body or "{}")
        if "name" in body:
            cat.name = body["name"]
        if "description" in body:
            cat.description = body["description"]
        if "image" in body:
            cat.image = body["image"]
        if "isActive" in body:
            cat.is_active = body["isActive"]
        if "sortOrder" in body:
            cat.sort_order = body["sortOrder"]
        cat.save()
        return cors_response({"id": cat.id, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
@require_admin
def admin_orders(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body or "{}")
            order = Order.objects.create(
                full_name=body.get("fullName", ""),
                phone=body.get("phone", ""),
                address=body.get("address", ""),
                notes=body.get("notes", ""),
                payment_method=body.get("paymentMethod", "whatsapp"),
                status=body.get("status", "pending"),
                total=body.get("total", 0),
                items=body.get("items", []),
            )
            return cors_response({"id": order.id, "status": "created"}, 201)
        except Exception as e:
            return cors_response({"error": str(e)}, 400)

    data = [{
        "id": o.id,
        "fullName": o.full_name,
        "phone": o.phone,
        "address": o.address,
        "notes": o.notes,
        "paymentMethod": o.payment_method,
        "status": o.status,
        "total": decimal_to_number(o.total),
        "items": o.items,
        "createdAt": o.created_at.isoformat(),
        "deliveredAt": o.delivered_at.isoformat() if o.delivered_at else None,
    } for o in Order.objects.all().order_by('id')]
    return cors_response(data)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
@require_admin
def admin_upload(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        file = request.FILES.get("file")
        if not file:
            return cors_response({"error": "No file provided"}, 400)
        folder = request.POST.get("folder", "uploads")
        import os
        from django.conf import settings
        upload_dir = settings.BASE_DIR.parent / "public" / "images" / folder
        upload_dir.mkdir(parents=True, exist_ok=True)
        ext = os.path.splitext(file.name)[1]
        import uuid
        filename = f"{uuid.uuid4().hex}{ext}"
        path = upload_dir / filename
        with open(path, "wb") as f:
            for chunk in file.chunks():
                f.write(chunk)
        url = f"/images/{folder}/{filename}"
        return cors_response({"url": url, "filename": filename})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE", "OPTIONS"])
@require_admin
def admin_order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return cors_response({"error": "Order not found"}, 404)

    if request.method == "DELETE":
        order.delete()
        return cors_response({"status": "deleted"})

    try:
        body = json.loads(request.body or "{}")
        if "status" in body:
            order.status = body["status"]
        if "deliveredAt" in body and body["deliveredAt"]:
            from datetime import datetime
            order.delivered_at = datetime.fromisoformat(body["deliveredAt"].replace('Z', '+00:00'))
        order.save()
        return cors_response({"id": order.id, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
@require_admin
def admin_feedback(request):
    if request.method == "GET":
        data = [{
            "id": f.id,
            "customerName": f.customer_name,
            "location": f.location,
            "text": f.text,
            "rating": f.rating,
            "isVisible": f.is_visible,
            "sortOrder": f.sort_order,
        } for f in Feedback.objects.all()]
        return cors_response(data)

    try:
        body = json.loads(request.body or "{}")
        fb = Feedback.objects.create(
            customer_name=body.get("customerName", ""),
            location=body.get("location", ""),
            text=body.get("text", ""),
            rating=body.get("rating", 5),
            is_visible=body.get("isVisible", True),
            sort_order=body.get("sortOrder", 0),
        )
        return cors_response({"id": fb.id, "status": "created"}, 201)
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE", "OPTIONS"])
@require_admin
def admin_feedback_detail(request, feedback_id):
    try:
        fb = Feedback.objects.get(id=feedback_id)
    except Feedback.DoesNotExist:
        return cors_response({"error": "Feedback not found"}, 404)

    if request.method == "DELETE":
        fb.delete()
        return cors_response({"status": "deleted"})

    try:
        body = json.loads(request.body or "{}")
        if "customerName" in body:
            fb.customer_name = body["customerName"]
        if "location" in body:
            fb.location = body["location"]
        if "text" in body:
            fb.text = body["text"]
        if "rating" in body:
            fb.rating = body["rating"]
        if "isVisible" in body:
            fb.is_visible = body["isVisible"]
        if "sortOrder" in body:
            fb.sort_order = body["sortOrder"]
        fb.save()
        return cors_response({"id": fb.id, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "PUT", "OPTIONS"])
@require_admin
def admin_site_content(request):
    content = HomePageContent.objects.first()
    if not content:
        content = HomePageContent.objects.create()

    if request.method == "GET":
        return cors_response({
            "badgeText": content.badge_text,
            "heroTitle": content.hero_title,
            "heroHighlight": content.hero_highlight,
            "heroSubtitle": content.hero_subtitle,
            "primaryButtonText": content.primary_button_text,
            "secondaryButtonText": content.secondary_button_text,
            "happyRetailers": content.happy_retailers,
            "productLines": content.product_lines,
            "districts": content.districts,
            "videoUrl": content.video_url,
            "heroImages": content.hero_images,
        })

    try:
        body = json.loads(request.body or "{}")
        for field, mapping in [
            ("badgeText", "badge_text"), ("heroTitle", "hero_title"),
            ("heroHighlight", "hero_highlight"), ("heroSubtitle", "hero_subtitle"),
            ("primaryButtonText", "primary_button_text"),
            ("secondaryButtonText", "secondary_button_text"),
            ("happyRetailers", "happy_retailers"),
            ("productLines", "product_lines"),
            ("districts", "districts"),
            ("videoUrl", "video_url"),
            ("heroImages", "hero_images"),
        ]:
            if field in body:
                setattr(content, mapping, body[field])
        content.save()
        return cors_response({"status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "PUT", "OPTIONS"])
@require_admin
def admin_contact_info(request):
    info = ContactInfo.objects.first()
    if not info:
        info = ContactInfo.objects.create()

    if request.method == "GET":
        return cors_response({
            "customerSupportPhone": info.customer_support_phone,
            "businessPhone": info.business_phone,
            "whatsappNumber": info.whatsapp_number,
            "supportEmail": info.support_email,
            "salesEmail": info.sales_email,
            "address": info.address,
            "businessHours": info.business_hours,
        })

    try:
        body = json.loads(request.body or "{}")
        for field, mapping in [
            ("customerSupportPhone", "customer_support_phone"),
            ("businessPhone", "business_phone"),
            ("whatsappNumber", "whatsapp_number"),
            ("supportEmail", "support_email"),
            ("salesEmail", "sales_email"),
            ("address", "address"),
            ("businessHours", "business_hours"),
        ]:
            if field in body:
                setattr(info, mapping, body[field])
        info.save()
        return cors_response({"status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)
