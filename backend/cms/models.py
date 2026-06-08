from django.db import models


def _default_story_paragraphs():
    return [
        "We started with one goal: make snacks that are fast, tasty, and satisfying. From our kitchen to your table, every bite is crafted with care, using quality ingredients and traditional recipes. We believe that great taste comes from consistency and passion in every step of the process.",
        "Our manufacturing journey began in a small kitchen in Bhairahwa, Nepal. We started as a family project, carefully crafting everything by hand. We used traditional recipes, blending age-old flavors with modern convenience. Word started spreading about the snacks, local shops started asking for more, and before we knew it, Riya & Rakshya Food Products was born.",
        "Today, Riya and Rakshya Food Products manufactures over 50 varieties of instant noodles, namkeen, dalmot, chips and bhujiya \u2014 loved by thousands across Nepal. We are committed to maintaining consistency, hygiene, and authentic flavours in every product we deliver.",
    ]


def _default_stats():
    return [
        {"value": "50+", "label": "Products Manufactured"},
        {"value": "77", "label": "Districts Covered"},
        {"value": "500+", "label": "Retail Partners"},
        {"value": "10K+", "label": "Daily Production (Kg)"},
    ]


def _default_why_choose_items():
    return [
        {"title": "Delicious Taste", "description": "Authentic Nepal flavours loved by people from all ages."},
        {"title": "Multiple Size", "description": "From 50g to 1 kg \u2014 a size for every need."},
        {"title": "Affordable Pricing", "description": "Premium quality snacks at prices everyone can afford."},
        {"title": "Trusted Quality", "description": "Stringent quality checks ensure every pack is perfect."},
        {"title": "Consistent Experience", "description": "Same great taste in every single pack."},
    ]


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


class AboutPageContent(TimeStampedModel):
    hero_image = models.CharField(max_length=255, blank=True, default="/images/abouthero.png")
    story_title = models.CharField(max_length=255, blank=True, default="The R&R Story")
    story_paragraphs = models.JSONField(default=_default_story_paragraphs, blank=True)
    mission_title = models.CharField(max_length=255, blank=True, default="Our Mission")
    mission_text = models.TextField(blank=True, default="To become Nepal's most trusted and widely traded snack brand, bringing happiness in every bite.")
    vision_title = models.CharField(max_length=255, blank=True, default="Our Vision")
    vision_text = models.TextField(blank=True, default="To become Nepal's most loved and widely loved snack brand, spreading love and happiness we bring to our customers.")
    quality_title = models.CharField(max_length=255, blank=True, default="Our Commitment To Quality & Safety")
    quality_text = models.TextField(blank=True, default="Our snacks are prepared in a clean, hygienic environment with strict quality checks, ensuring every bite is safe and tasty. From sourcing to packaging, we never compromise.\n\nOur manufacturing facility follows strict hygiene protocols \u2014 our team wears gloves, helmets, and protective gear at all times. We use modern machinery and follow standardized processes to ensure every pack meets our high standards.\n\nWe believe that great taste starts with great ingredients. That's why we source our spices locally and never compromise on the quality of raw materials.")
    stats = models.JSONField(default=_default_stats, blank=True, help_text='Example: [{"value":"50+","label":"Products Manufactured"}]')
    why_choose_title = models.CharField(max_length=255, blank=True, default="Why Choose Riya & Rakshya?")
    why_choose_items = models.JSONField(default=_default_why_choose_items, blank=True, help_text='Example: [{"title":"Delicious Taste","description":"Authentic Nepal flavours..."}]')
    cta_left_title = models.CharField(max_length=255, blank=True, default="Ready to explore our snacks?")
    cta_left_text = models.TextField(blank=True, default="Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes. From crispy bites to rich, flavorful treats, find the perfect treat for every moment.")
    cta_right_title = models.CharField(max_length=255, blank=True, default="Interested in Bulk Orders or Distribution?")
    cta_right_text = models.TextField(blank=True, default="We're always looking for retail partners and distributors across Nepal. Get factory-direct pricing and dedicated support.")

    class Meta:
        verbose_name = "about page content"
        verbose_name_plural = "about page content"

    def __str__(self):
        return "About Page Content"


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
