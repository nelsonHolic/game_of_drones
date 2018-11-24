from django.apps import AppConfig


class GameAppConfig(AppConfig):

    name = "game_of_drones.game"
    verbose_name = "Game"

    def ready(self):
        pass
