from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cms", "0004_set_featured_products"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="featured_sort_order",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
