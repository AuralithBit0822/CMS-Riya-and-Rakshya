from django.urls import path

from . import admin_views, views

urlpatterns = [
    path("", views.api_root, name="api-root"),
    path("site-content/", views.site_content, name="site-content"),
    path("categories/", views.categories, name="categories"),
    path("products/", views.products, name="products"),
    path("feedback/", views.feedback, name="feedback"),
    path("contact-info/", views.contact_info, name="contact-info"),
    path("contact-messages/", views.contact_messages, name="contact-messages"),
    path("orders/", views.orders, name="orders"),
    # Admin endpoints
    path("admin/login/", admin_views.admin_login, name="admin-login"),
    path("admin/products/", admin_views.admin_products, name="admin-products"),
    path("admin/products/<int:product_id>/", admin_views.admin_product_detail, name="admin-product-detail"),
    path("admin/categories/", admin_views.admin_categories, name="admin-categories"),
    path("admin/categories/<int:category_id>/", admin_views.admin_category_detail, name="admin-category-detail"),
    path("admin/orders/", admin_views.admin_orders, name="admin-orders"),
    path("admin/orders/<int:order_id>/", admin_views.admin_order_detail, name="admin-order-detail"),
    path("admin/feedback/", admin_views.admin_feedback, name="admin-feedback"),
    path("admin/feedback/<int:feedback_id>/", admin_views.admin_feedback_detail, name="admin-feedback-detail"),
    path("admin/site-content/", admin_views.admin_site_content, name="admin-site-content"),
    path("admin/contact-info/", admin_views.admin_contact_info, name="admin-contact-info"),
    path("admin/upload/", admin_views.admin_upload, name="admin-upload"),
    path("admin/media/", admin_views.admin_media, name="admin-media"),
]
