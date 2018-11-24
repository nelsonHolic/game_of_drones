from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from game_of_drones.game.serializers import GameSerializer


class GameViewSet(ViewSet):
    '''
    View for making any interaction with a game
    '''

    serializer_class = GameSerializer

    def retrieve(self, request, pk=None):
        return Response({})

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(True)
        serializer.save()
        return Response(serializer.data)

    @action(methods=['POST'], detail=True)
    def make_a_movement(self, request):
        return Response({})

