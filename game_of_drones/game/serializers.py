from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from game_of_drones.game.models import Player, Game, Round


def different_names(data):
    if data['player_one'] == data['player_two']:
        raise serializers.ValidationError(_('players cannot be the same'))


class GameModelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    player_one = serializers.StringRelatedField()
    player_two = serializers.StringRelatedField()
    total_rounds = serializers.IntegerField()

    class Meta:
        model = Game
        fields = ('id', 'player_one', 'player_two', 'total_rounds')


class GameSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    player_one = serializers.CharField(max_length=45, required=True)
    player_two = serializers.CharField(max_length=45, required=True)

    def create(self, validated_data):
        player_one, created = Player.objects.get_or_create(name=validated_data['player_one'])
        player_two, created = Player.objects.get_or_create(name=validated_data['player_two'])
        game = Game(player_one=player_one, player_two=player_two)
        game.save()
        validated_data['id'] = game.id
        return game

    class Meta:
        validators = [different_names]


class RoundSerializer(serializers.ModelSerializer):
    number = serializers.IntegerField(read_only=True)
    game = serializers.PrimaryKeyRelatedField(read_only=True)
    p1_movement = serializers.CharField()
    p2_movement = serializers.CharField()
    winner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Round
        fields = ('id', 'number', 'game', 'p1_movement', 'p2_movement', 'winner',)

