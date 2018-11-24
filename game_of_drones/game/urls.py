from game_of_drones.game.views import *
from rest_framework.routers import DefaultRouter

app_name = "game"

game_router = DefaultRouter()
game_router.register(r'game', GameViewSet, base_name='game')
urlpatterns = game_router.urls
