import logging #for email error 
import json
import secrets
import threading
from datetime import timedelta
from decimal import Decimal
from functools import wraps

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import EmailMultiAlternatives, send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import AboutPageContent, Category, ContactInfo, Department, DepartmentMember, Feedback, HomePageContent, Order, PasswordResetToken, Product

logger = logging.getLogger(__name__)  #for email error 
User = get_user_model()

ADMIN_TOKENS = {}


def cors_response(data, status=200):
    return JsonResponse(data, status=status, safe=not isinstance(data, list))


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
        category_id = body.get("categoryId")
        if not category_id:
            return cors_response({"error": "Category is required"}, 400)
        if not Category.objects.filter(id=category_id).exists():
            return cors_response({"error": "Category does not exist"}, 400)
        product = Product.objects.create(
            name=body.get("name", ""),
            category_id=category_id,
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
def admin_about_content(request):
    content = AboutPageContent.objects.first()
    if not content:
        content = AboutPageContent.objects.create()

    if request.method == "GET":
        return cors_response({
            "heroImage": content.hero_image,
            "storyTitle": content.story_title,
            "storyParagraphs": content.story_paragraphs,
            "missionTitle": content.mission_title,
            "missionText": content.mission_text,
            "visionTitle": content.vision_title,
            "visionText": content.vision_text,
            "qualityTitle": content.quality_title,
            "qualityText": content.quality_text,
            "stats": content.stats,
            "whyChooseTitle": content.why_choose_title,
            "whyChooseItems": content.why_choose_items,
            "ctaLeftTitle": content.cta_left_title,
            "ctaLeftText": content.cta_left_text,
            "ctaRightTitle": content.cta_right_title,
            "ctaRightText": content.cta_right_text,
        })

    try:
        body = json.loads(request.body or "{}")
        for field, mapping in [
            ("heroImage", "hero_image"),
            ("storyTitle", "story_title"), ("storyParagraphs", "story_paragraphs"),
            ("missionTitle", "mission_title"), ("missionText", "mission_text"),
            ("visionTitle", "vision_title"), ("visionText", "vision_text"),
            ("qualityTitle", "quality_title"), ("qualityText", "quality_text"),
            ("stats", "stats"),
            ("whyChooseTitle", "why_choose_title"), ("whyChooseItems", "why_choose_items"),
            ("ctaLeftTitle", "cta_left_title"), ("ctaLeftText", "cta_left_text"),
            ("ctaRightTitle", "cta_right_title"), ("ctaRightText", "cta_right_text"),
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
def admin_home_content(request):
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


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
@require_admin
def admin_departments(request):
    if request.method == "GET":
        data = [{
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "sortOrder": d.sort_order,
            "isActive": d.is_active,
            "memberCount": d.members.count(),
        } for d in Department.objects.all()]
        return cors_response(data)

    try:
        body = json.loads(request.body or "{}")
        d = Department.objects.create(
            name=body.get("name", ""),
            description=body.get("description", ""),
            sort_order=body.get("sortOrder", 0),
            is_active=body.get("isActive", True),
        )
        return cors_response({"id": d.id, "status": "created"}, 201)
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE", "OPTIONS"])
@require_admin
def admin_department_detail(request, department_id):
    try:
        d = Department.objects.get(id=department_id)
    except Department.DoesNotExist:
        return cors_response({"error": "Department not found"}, 404)

    if request.method == "DELETE":
        d.delete()
        return cors_response({"status": "deleted"})

    try:
        body = json.loads(request.body or "{}")
        for field, mapping in [
            ("name", "name"), ("description", "description"),
            ("sortOrder", "sort_order"), ("isActive", "is_active"),
        ]:
            if field in body:
                setattr(d, mapping, body[field])
        d.save()
        return cors_response({"id": d.id, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
@require_admin
def admin_department_members(request, department_id):
    try:
        department = Department.objects.get(id=department_id)
    except Department.DoesNotExist:
        return cors_response({"error": "Department not found"}, 404)

    if request.method == "GET":
        data = [{
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "phone": m.phone,
            "role": m.role,
            "bio": m.bio,
            "image": m.image,
        } for m in department.members.all()]
        return cors_response(data)

    try:
        body = json.loads(request.body or "{}")
        member = DepartmentMember.objects.create(
            department=department,
            name=body.get("name", ""),
            email=body.get("email", ""),
            phone=body.get("phone", ""),
            role=body.get("role", ""),
            bio=body.get("bio", ""),
            image=body.get("image", ""),
        )
        def send_notification():
            html = f"""\
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;padding:24px;background:#f4f4f4;">
  <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:24px;">
    <h2 style="color:#C8102E;">R&R Food Products</h2>
    <p>Dear <strong>{member.name}</strong>,</p>
    <p>You have been added to the <strong>'{department.name}'</strong> department.</p>
    <p><strong>Role:</strong> {member.role or 'Team Member'}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <p style="color:#666;">We're excited to have you on board!</p>
    <p style="color:#888;font-size:12px;">Riya & Rakshya Food Products</p>
  </div>
</body>
</html>"""
            text = (
                f"Dear {member.name},\n\n"
                f"You have been added to the '{department.name}' department "
                f"at Riya & Rakshya Food Products.\n\n"
                f"Role: {member.role or 'Team Member'}\n\n"
                f"We're excited to have you on board!\n\n"
                f"R&R Food Products Team"
            )
            msg = EmailMultiAlternatives(
                f"You've been added to {department.name} — R&R Food Products",
                text,
                settings.DEFAULT_FROM_EMAIL or "R&R Food Products <tsushmi436@gmail.com>",
                [member.email],
            )
            msg.attach_alternative(html, "text/html")
            try:
                msg.send(fail_silently=True)
            except Exception:
                pass

        threading.Thread(target=send_notification, daemon=True).start()
        return cors_response({"id": member.id, "status": "created"}, 201)
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE", "OPTIONS"])
@require_admin
def admin_department_member_detail(request, department_id, member_id):
    try:
        member = DepartmentMember.objects.get(id=member_id, department_id=department_id)
    except DepartmentMember.DoesNotExist:
        return cors_response({"error": "Member not found"}, 404)

    if request.method == "DELETE":
        member.delete()
        return cors_response({"status": "deleted"})

    try:
        body = json.loads(request.body or "{}")
        for field, mapping in [
            ("name", "name"), ("email", "email"),
            ("phone", "phone"), ("role", "role"),
            ("bio", "bio"), ("image", "image"),
        ]:
            if field in body:
                setattr(member, mapping, body[field])
        member.save()
        return cors_response({"id": member.id, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def setup_status(request):
    if request.method == "OPTIONS":
        return cors_response({})
    needs_setup = not User.objects.filter(is_staff=True).exists()
    return cors_response({"needsSetup": needs_setup})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def admin_setup(request):
    if request.method == "OPTIONS":
        return cors_response({})
    if User.objects.filter(is_staff=True).exists():
        return cors_response({"error": "Admin already exists"}, 400)
    try:
        body = json.loads(request.body or "{}")
        username = body.get("username", "").strip()
        email = body.get("email", "").strip()
        password = body.get("password", "")
        if not username or not password:
            return cors_response({"error": "Username and password are required"}, 400)
        if len(password) < 6:
            return cors_response({"error": "Password must be at least 6 characters"}, 400)
        if User.objects.filter(username=username).exists():
            return cors_response({"error": "Username already taken"}, 400)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True,
        )
        token = secrets.token_hex(32)
        ADMIN_TOKENS[token] = user.username
        return cors_response({"token": token, "username": user.username, "status": "created"}, 201)
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["PUT", "OPTIONS"])
@require_admin
def change_password(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        body = json.loads(request.body or "{}")
        current = body.get("currentPassword", "")
        new = body.get("newPassword", "")
        if not current or not new:
            return cors_response({"error": "Current and new password are required"}, 400)
        if len(new) < 6:
            return cors_response({"error": "New password must be at least 6 characters"}, 400)
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        token = auth_header.replace("Bearer ", "").strip()
        username = ADMIN_TOKENS.get(token)
        if not username:
            return cors_response({"error": "Unauthorized"}, 401)
        user = authenticate(username=username, password=current)
        if user is None:
            return cors_response({"error": "Current password is incorrect"}, 400)
        user.set_password(new)
        user.save()
        new_token = secrets.token_hex(32)
        ADMIN_TOKENS[new_token] = user.username
        return cors_response({"token": new_token, "status": "updated"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["GET", "PUT", "OPTIONS"])
@require_admin
def admin_profile(request):
    if request.method == "OPTIONS":
        return cors_response({})
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    token = auth_header.replace("Bearer ", "").strip()
    username = ADMIN_TOKENS.get(token)
    if not username:
        return cors_response({"error": "Unauthorized"}, 401)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return cors_response({"error": "User not found"}, 404)

    if request.method == "GET":
        return cors_response({"email": user.email or ""})

    try:
        body = json.loads(request.body or "{}")
        email = body.get("email", "").strip()
        if email:
            user.email = email
            user.save()
        return cors_response({"email": user.email or ""})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def forgot_password(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        body = json.loads(request.body or "{}")
        email = body.get("email", "").strip()
        if not email:
            return cors_response({"error": "Email is required"}, 400)

        try:
            user = User.objects.get(email=email, is_staff=True)
        except User.DoesNotExist:
            return cors_response({"error": "No admin account found with that email"}, 404)

        code = f"{secrets.randbelow(1000000):06d}"
        PasswordResetToken.objects.create(email=user.email, code=code)

        try:
            send_mail(
                subject="Your Password Reset Code — R&R Food Products Admin",
                message=f"Your password reset code is:\n\n{code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, please ignore this email.",
                from_email=settings.DEFAULT_FROM_EMAIL or "R&R Food Products <tsushmi436@gmail.com>",
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send reset email to {user.email}: {e}", exc_info=True)
            if settings.DEBUG:
                return cors_response({
                    "error": f"Could not send email: {e}",
                    "code": code,
                }, 500)
            return cors_response({"error": "Could not send email. Contact your administrator."}, 500)

        return cors_response({"status": "sent"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def verify_reset_code(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        body = json.loads(request.body or "{}")
        email = body.get("email", "").strip()
        code = body.get("code", "").strip()
        if not email or not code:
            return cors_response({"error": "Email and code are required"}, 400)

        try:
            reset = PasswordResetToken.objects.filter(
                email=email, code=code, is_used=False
            ).latest("created_at")
        except PasswordResetToken.DoesNotExist:
            return cors_response({"error": "Invalid or expired code"}, 400)

        if reset.is_expired():
            return cors_response({"error": "Code has expired. Request a new one."}, 400)

        token = secrets.token_hex(32)
        reset.token = token
        reset.save()

        return cors_response({"token": token})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def reset_password(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        body = json.loads(request.body or "{}")
        token_str = body.get("token", "").strip()
        new_password = body.get("password", "")
        if not token_str or not new_password:
            return cors_response({"error": "Token and password are required"}, 400)
        if len(new_password) < 6:
            return cors_response({"error": "Password must be at least 6 characters"}, 400)

        try:
            reset = PasswordResetToken.objects.get(token=token_str, is_used=False)
        except PasswordResetToken.DoesNotExist:
            return cors_response({"error": "Invalid or expired token"}, 400)

        if reset.is_expired():
            return cors_response({"error": "Token has expired"}, 400)

        try:
            user = User.objects.get(email=reset.email, is_staff=True)
        except User.DoesNotExist:
            return cors_response({"error": "User not found"}, 404)

        user.set_password(new_password)
        user.save()
        reset.is_used = True
        reset.save()
        return cors_response({"status": "password_reset"})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
@require_admin
def admin_send_message(request):
    if request.method == "OPTIONS":
        return cors_response({})
    try:
        body = json.loads(request.body or "{}")
        member_ids = body.get("member_ids", [])
        subject = body.get("subject", "").strip()
        message_text = body.get("message", "").strip()

        if not member_ids or not subject or not message_text:
            return cors_response({"error": "member_ids, subject, and message are required"}, 400)

        members = DepartmentMember.objects.filter(id__in=member_ids)
        if not members.exists():
            return cors_response({"error": "No valid members found"}, 404)

        def send_bulk():
            for member in members:
                html = f"""\
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;padding:24px;background:#f4f4f4;">
  <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;padding:24px;">
    <h2 style="color:#C8102E;">R&R Food Products</h2>
    <p>Dear <strong>{member.name}</strong>,</p>
    <div style="margin:16px 0;padding:16px;background:#f9f9f9;border-radius:6px;line-height:1.7;">
      {message_text}
    </div>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <p style="color:#888;font-size:12px;">Riya & Rakshya Food Products</p>
  </div>
</body>
</html>"""
                text = (
                    f"Dear {member.name},\n\n"
                    f"{message_text}\n\n"
                    f"R&R Food Products Team"
                )
                msg = EmailMultiAlternatives(
                    subject,
                    text,
                    settings.DEFAULT_FROM_EMAIL or "R&R Food Products <tsushmi436@gmail.com>",
                    [member.email],
                )
                msg.attach_alternative(html, "text/html")
                try:
                    msg.send(fail_silently=True)
                except Exception:
                    pass

        threading.Thread(target=send_bulk, daemon=True).start()
        return cors_response({"status": "sent", "count": len(members)})
    except Exception as e:
        return cors_response({"error": str(e)}, 400)
