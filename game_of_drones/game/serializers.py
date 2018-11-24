from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from game_of_drones.game.models import Player, Game


def different_names(data):
    if data['player_one'] == data['player_two']:
        raise serializers.ValidationError(_('players cannot be the same'))


class GameSerializer(serializers.Serializer):
    player_one = serializers.CharField(max_length=45, required=True)
    player_two = serializers.CharField(max_length=45, required=True)

    def create(self, validated_data):
        player_one, created = Player.objects.get_or_create(name=validated_data['player_one'])
        player_two, created = Player.objects.get_or_create(name=validated_data['player_two'])
        game = Game(player_one=player_one, player_two=player_two)
        game.save()
        return game

    class Meta:
        validators = [different_names]
