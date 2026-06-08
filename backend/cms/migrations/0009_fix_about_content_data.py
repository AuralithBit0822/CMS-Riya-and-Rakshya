from django.db import migrations


ALL_WHY_CHOOSE_ITEMS = [
    {"title": "Delicious Taste", "description": "Authentic Nepal flavours loved by people from all ages."},
    {"title": "Multiple Size", "description": "From 50g to 1 kg \u2014 a size for every need."},
    {"title": "Affordable Pricing", "description": "Premium quality snacks at prices everyone can afford."},
    {"title": "Trusted Quality", "description": "Stringent quality checks ensure every pack is perfect."},
    {"title": "Consistent Experience", "description": "Same great taste in every single pack."},
]

ALL_STATS = [
    {"value": "50+", "label": "Products Manufactured"},
    {"value": "77", "label": "Districts Covered"},
    {"value": "500+", "label": "Retail Partners"},
    {"value": "10K+", "label": "Daily Production (Kg)"},
]


def fix_existing_content(apps, schema_editor):
    AboutPageContent = apps.get_model("cms", "AboutPageContent")
    for obj in AboutPageContent.objects.all():
        changed = False

        # Fix story_paragraphs: if it's a single string with \n\n\n, split it
        if obj.story_paragraphs and len(obj.story_paragraphs) == 1 and isinstance(obj.story_paragraphs[0], str):
            text = obj.story_paragraphs[0]
            parts = [p.strip() for p in text.replace("\r\n", "\n").split("\n\n\n") if p.strip()]
            parts2 = [p.strip() for p in text.replace("\r\n", "\n").split("\n\n") if p.strip()]
            if len(parts) > 1:
                obj.story_paragraphs = parts
                changed = True
            elif len(parts2) > 1:
                obj.story_paragraphs = parts2
                changed = True

        # Fix why_choose_items: combine existing items with missing defaults
        existing_titles = {item.get("title", "").strip().lower() for item in (obj.why_choose_items or [])}
        needed = [item for item in ALL_WHY_CHOOSE_ITEMS if item["title"].lower() not in existing_titles]
        if needed:
            obj.why_choose_items = (obj.why_choose_items or []) + needed
            changed = True

        # Fix stats: combine existing stats with missing defaults
        existing_labels = {item.get("label", "").strip().lower() for item in (obj.stats or [])}
        needed_stats = [item for item in ALL_STATS if item["label"].lower() not in existing_labels]
        if needed_stats:
            obj.stats = (obj.stats or []) + needed_stats
            changed = True

        if changed:
            obj.save()


class Migration(migrations.Migration):

    dependencies = [
        ("cms", "0008_alter_aboutpagecontent_cta_left_text_and_more"),
    ]

    operations = [
        migrations.RunPython(fix_existing_content, migrations.RunPython.noop),
    ]
