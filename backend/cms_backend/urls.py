from django.contrib import admin
from django.urls import include, path

from cms import views

urlpatterns = [
    path('', views.root_view, name='root'),
    path('api/', include('cms.urls')),
    path('django-admin/', admin.site.urls),
]
