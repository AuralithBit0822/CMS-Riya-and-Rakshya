from django.db import migrations


CANONICAL_STATS = [
    {"value": "50+", "label": "Products Manufactured"},
    {"value": "77", "label": "Districts Covered"},
    {"value": "500+", "label": "Retail Partners"},
    {"value": "10K+", "label": "Daily Production (Kg)"},
]

FULL_QUALITY_TEXT = (
    "Our snacks are prepared in a clean, hygienic environment with strict quality checks, "
    "ensuring every bite is safe and tasty. From sourcing to packaging, we never compromise.\n\n"
    "Our manufacturing facility follows strict hygiene protocols \u2014 our team wears gloves, "
    "helmets, and protective gear at all times. We use modern machinery and follow standardized "
    "processes to ensure every pack meets our high standards.\n\n"
    "We believe that great taste starts with great ingredients. That\u2019s why we source our "
    "spices locally and never compromise on the quality of raw materials."
)


def deduplicate_and_fix(apps, schema_editor):
    AboutPageContent = apps.get_model("cms", "AboutPageContent")
    for obj in AboutPageContent.objects.all():
        changed = False

        if isinstance(obj.stats, list) and len(obj.stats) > 4:
            obj.stats = CANONICAL_STATS
            changed = True

        if obj.quality_text and len(obj.quality_text) < 400:
            obj.quality_text = FULL_QUALITY_TEXT
            changed = True

        if changed:
            obj.save()


class Migration(migrations.Migration):

    dependencies = [
        ("cms", "0009_fix_about_content_data"),
    ]

    operations = [
        migrations.RunPython(deduplicate_and_fix, migrations.RunPython.noop),
    ]
