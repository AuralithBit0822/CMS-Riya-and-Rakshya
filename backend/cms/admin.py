from django.contrib import admin

from .models import (
    AboutPageContent,
    Category,
    ContactInfo,
    Feedback,
    HomePageContent,
    Order,
    Product,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "sort_order", "is_active", "updated_at")
    list_editable = ("sort_order", "is_active")
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "unit", "is_featured", "is_active", "sort_order")
    list_editable = ("is_featured", "is_active", "sort_order")
    list_filter = ("category", "is_active", "is_featured")
    search_fields = ("name", "description", "badge")


@admin.register(AboutPageContent)
class AboutPageContentAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Hero", {
            "fields": ("hero_image",)
        }),
        ("Story", {
            "fields": ("story_title", "story_paragraphs")
        }),
        ("Mission & Vision", {
            "fields": ("mission_title", "mission_text", "vision_title", "vision_text")
        }),
        ("Quality & Safety", {
            "fields": ("quality_title", "quality_text")
        }),
        ("Stats", {
            "fields": ("stats",)
        }),
        ("Why Choose", {
            "fields": ("why_choose_title", "why_choose_items")
        }),
        ("Bottom CTAs", {
            "fields": ("cta_left_title", "cta_left_text", "cta_right_title", "cta_right_text")
        }),
    )


@admin.register(HomePageContent)
class HomePageContentAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Hero Text", {
            "fields": ("badge_text", "hero_title", "hero_highlight", "hero_subtitle")
        }),
        ("Buttons", {
            "fields": ("primary_button_text", "secondary_button_text")
        }),
        ("Stats", {
            "fields": ("happy_retailers", "product_lines", "districts")
        }),
    )


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "location", "rating", "is_visible", "sort_order")
    list_editable = ("rating", "is_visible", "sort_order")
    search_fields = ("customer_name", "location", "text")


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Phone and Email", {
            "fields": ("customer_support_phone", "business_phone", "whatsapp_number", "support_email", "sales_email")
        }),
        ("Location", {
            "fields": ("address", "business_hours")
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "status", "total", "payment_method", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("full_name", "phone", "address")
    readonly_fields = ("created_at", "updated_at")

# Register your models here.
