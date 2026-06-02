from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cms", "0002_order_delivered_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="homepagecontent",
            name="video_url",
            field=models.CharField(blank=True, default="/videos/RnR video.mp4", max_length=255),
        ),
        migrations.AddField(
            model_name="homepagecontent",
            name="hero_images",
            field=models.JSONField(blank=True, default=list, help_text='Example: [{"img": "/images/products/cheese_balls.jpeg", "bg": "#fff8f0", "label": "Cheese Balls"}]'),
        ),
    ]
