# from django.urls import path
# from . import views
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     path('', views.home, name="home"),  # Home page with ASL guide/search
#     path('detection/', views.feature, name='detection'),  # Camera detection page
#     path('video_feed/', views.video_feed, name='video_feed'),
#     path('get_text/', views.get_text, name='get_text'),
#     path('api/get-signs/', views.get_signs, name='get_signs'),
# ]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name="home"),  # Home page with ASL guide/search
    path('detection/', views.feature, name='detection'),  # Camera detection page
    path('video_feed/', views.video_feed, name='video_feed'),
    path('get_text/', views.get_text, name='get_text'),
    path('clear_text/', views.clear_text, name='clear_text'),  # New endpoint for clearing text
    path('api/get-signs/', views.get_signs, name='get_signs'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)