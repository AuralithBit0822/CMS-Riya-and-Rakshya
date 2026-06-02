from django.core.management.base import BaseCommand

from cms.models import Category, ContactInfo, Feedback, HomePageContent


class Command(BaseCommand):
    help = "Create starter CMS records for R&R Food Products."

    def handle(self, *args, **options):
        categories = [
            "Spicy Namkeen",
            "Bhujha & Chatpate Bhujha",
            "Fryums",
            "Chips/Kurkure/Cheese Balls",
            "Puffs",
            "Diet & Health",
        ]
        for index, name in enumerate(categories, start=1):
            Category.objects.get_or_create(
                name=name,
                defaults={
                    "description": "Crunchy, flavourful, and irresistible.",
                    "sort_order": index,
                    "is_active": True,
                },
            )

        HomePageContent.objects.get_or_create(
            id=1,
            defaults={
                "badge_text": "Nepal ko Swad",
                "hero_title": "One Bite & You Won't Stop Craving",
                "hero_highlight": "Craving",
                "hero_subtitle": (
                    "Instant noodles, crunchy snacks, and bulk packs delivered straight to your door. "
                    "Freshness guaranteed in every bite."
                ),
            },
        )

        ContactInfo.objects.get_or_create(
            id=1,
            defaults={
                "customer_support_phone": "+977 982-0299711",
                "business_phone": "+977 985-7021032",
                "whatsapp_number": "9779857021032",
                "support_email": "Support@riyarakshya.com.np",
                "sales_email": "Sales@riyarakshya.com.np",
                "address": "S.No.-4, SugarMill, Bhairahwa, Rupandehi, Nepal",
                "business_hours": "Sun-Fri: 9:00 AM - 6:00 PM",
            },
        )

        Feedback.objects.get_or_create(
            customer_name="Prakash Bhatta",
            defaults={
                "location": "Pokhara, Kaski",
                "text": "Fresh, crunchy, and perfect for tea time. The snacks arrived in great condition.",
                "rating": 5,
                "is_visible": True,
                "sort_order": 1,
            },
        )
        Feedback.objects.get_or_create(
            customer_name="Sita Devi Chaudhary",
            defaults={
                "location": "Janakpur, Dhanusha",
                "text": "The masala taste is very good and customers ask for these packets again.",
                "rating": 5,
                "is_visible": True,
                "sort_order": 2,
            },
        )

        self.stdout.write(self.style.SUCCESS("Starter CMS data is ready."))
