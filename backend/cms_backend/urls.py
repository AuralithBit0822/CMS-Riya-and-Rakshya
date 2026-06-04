import os

from django.conf import settings
from django.contrib import admin
from django.http import FileResponse, Http404
from django.urls import include, path, re_path

from cms import views


def serve_spa(request):
    index_path = settings.FRONTEND_BUILD_DIR / 'index.html'
    if index_path.exists():
        return FileResponse(open(index_path, 'rb'), content_type='text/html')
    raise Http404("Frontend build not found. Run npm run build and copy to backend/frontend_build/")


def serve_frontend_file(request, path):
    file_path = settings.FRONTEND_BUILD_DIR / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(open(file_path, 'rb'))
    public_path = settings.BASE_DIR.parent / 'public' / path
    if public_path.exists() and public_path.is_file():
        return FileResponse(open(public_path, 'rb'))
    raise Http404("File not found")


urlpatterns = [
    path('api/', include('cms.urls')),
    path('django-admin/', admin.site.urls),
]

if settings.FRONTEND_BUILD_DIR.exists():
    urlpatterns += [
        re_path(r'^(?P<path>static/.*)$', serve_frontend_file),
        re_path(r'^(?P<path>images/.*)$', serve_frontend_file),
        re_path(r'^(?P<path>videos/.*)$', serve_frontend_file),
        re_path(r'^(?!api/|django-admin/|static/|images/|videos/).*$', serve_spa, name='spa'),
    ]
else:
    urlpatterns.insert(0, path('', views.root_view, name='root'))
