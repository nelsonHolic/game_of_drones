from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from game_of_drones.game.models import Round, MOVEMENT_WINS, Game
from game_of_drones.game.serializers import GameSerializer, RoundSerializer


class MultiSerializerViewSet(ViewSet):
    serializers = {
        'default': None,
    }

    @property
    def serializer_class(self):
        return self.get_serializer_class()

    def get_serializer_class(self):
        assert self.serializers['default'] is not None, (
            'Expected view %s should contain default serializer to get right serializer class.' %
            (self.__class__.__name__,)
        )
        for actions, serializer_cls in self.serializers.items():
            if self.action in actions:
                return serializer_cls

        if self.serializers['default'] is not None: return self.serializers['default']

        raise MethodNotAllowed(self.action)


class GameViewSet(MultiSerializerViewSet):
    """
    View for making any interaction with a game
    """

    serializers = {
        'default': GameSerializer,
        'make_a_movement': RoundSerializer,
    }

    def create(self, request):
        serializer = GameSerializer(data=request.data)
        serializer.is_valid(True)
        request.session['current_game'] = serializer.save().id

        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def session_game(self, request):
        pk = request.session.get('current_game')

        if pk is not None:
            game = Game.objects.select_related(
                'player_one', 'player_two'
            ).annotate(
                total_rounds=Count('round')
            ).get(pk=pk)

            return Response({})
        else:
            return Response({})

    @action(methods=['POST'], detail=True)
    def make_a_movement(self, request, pk=None):
        game = Game.objects.select_related('player_one', 'player_two').annotate(total_rounds=Count('round')).get(pk=pk)

        p1_movement = request.data['p1_movement']
        p2_movement = request.data['p2_movement']

        p1_wins = p2_movement in MOVEMENT_WINS[p1_movement]

        if p1_movement == p2_movement:
            winner = None
        elif p1_wins:
            winner = game.player_one
            winner.name = 'player_one'  # this is for serialization purposes
        else:
            winner = game.player_two
            winner.name = 'player_two'

        round_instance = Round(
            game=game, number=game.total_rounds + 1, p1_movement=p1_movement, p2_movement=p2_movement, winner=winner,
        )
        round_instance.save()

        serializer = RoundSerializer(round_instance)

        if game.total_rounds + 1 >= 3:
            del request.session['current_game']

        return Response(serializer.data)

