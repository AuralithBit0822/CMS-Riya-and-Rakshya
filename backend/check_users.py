import django, os
os.environ['DJANGO_SETTINGS_MODULE'] = 'cms_backend.settings'
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()
from django.contrib.auth.models import User
users = User.objects.filter(is_staff=True).values_list('username', flat=True)
print('Staff users:', list(users))
