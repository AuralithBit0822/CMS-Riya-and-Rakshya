from django.db import migrations

FEATURED_IDS = [37, 39, 13, 38]


def set_featured(apps, schema_editor):
    Product = apps.get_model("cms", "Product")
    Product.objects.filter(id__in=FEATURED_IDS).update(is_featured=True)


def unset_featured(apps, schema_editor):
    Product = apps.get_model("cms", "Product")
    Product.objects.filter(id__in=FEATURED_IDS).update(is_featured=False)


class Migration(migrations.Migration):

    dependencies = [
        ("cms", "0003_homepagecontent_video_hero"),
    ]

    operations = [
        migrations.RunPython(set_featured, unset_featured),
    ]
