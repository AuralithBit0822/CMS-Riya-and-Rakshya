from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Product(TimeStampedModel):
    name = models.CharField(max_length=180)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    description = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True, help_text="Use /images/... or a full image URL.")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=40, blank=True)
    size_options = models.JSONField(default=list, blank=True, help_text='Example: [{"size": "20g", "price": 10}]')
    reviews = models.PositiveIntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=5)
    ingredients = models.TextField(blank=True)
    allergy = models.TextField(blank=True)
    badge = models.CharField(max_length=80, blank=True)
    is_featured = models.BooleanField(default=False)
    featured_sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class HomePageContent(TimeStampedModel):
    badge_text = models.CharField(max_length=120, default="Nepal ko Swad")
    hero_title = models.CharField(max_length=160, default="One Bite & You Won't Stop Craving")
    hero_highlight = models.CharField(max_length=80, default="Craving")
    hero_subtitle = models.TextField(default="Instant noodles, crunchy snacks, and bulk packs delivered straight to your door. Freshness guaranteed in every bite.")
    primary_button_text = models.CharField(max_length=80, default="Shop Now")
    secondary_button_text = models.CharField(max_length=80, default="Become a Distributor")
    happy_retailers = models.CharField(max_length=40, default="500+")
    product_lines = models.CharField(max_length=40, default="10+")
    districts = models.CharField(max_length=40, default="77")
    video_url = models.CharField(max_length=255, blank=True, default="/videos/RnR video.mp4")
    hero_images = models.JSONField(default=list, blank=True, help_text='Example: [{"img": "/images/products/cheese_balls.jpeg", "bg": "#fff8f0", "label": "Cheese Balls"}]')

    class Meta:
        verbose_name = "homepage content"
        verbose_name_plural = "homepage content"

    def __str__(self):
        return "Homepage Content"


class Feedback(TimeStampedModel):
    customer_name = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=True)
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_visible = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return f"{self.customer_name} ({self.rating}/5)"


class ContactInfo(TimeStampedModel):
    customer_support_phone = models.CharField(max_length=40, blank=True)
    business_phone = models.CharField(max_length=40, blank=True)
    whatsapp_number = models.CharField(max_length=40, blank=True)
    support_email = models.EmailField(blank=True)
    sales_email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    business_hours = models.CharField(max_length=120, blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "contact information"
        verbose_name_plural = "contact information"

    def __str__(self):
        return "Contact Information"


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40)
    inquiry = models.CharField(max_length=80, blank=True)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.inquiry or 'General'}"


class Order(TimeStampedModel):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("packed", "Packed"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    address = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    payment_method = models.CharField(max_length=40, default="whatsapp")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    items = models.JSONField(default=list)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.pk} - {self.full_name}"


class PasswordResetToken(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    token = models.CharField(max_length=64, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        from datetime import timedelta
        from django.utils import timezone
        return timezone.now() - self.created_at > timedelta(minutes=15)

    def __str__(self):
        return f"Reset code for {self.email}"
