from django.db import models


class Player(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45, unique=True)

    def __repr__(self):
        return self.name

    def __str__(self):
        return self.name

    class Meta:
        indexes = [models.Index(fields=['name'])]


class Game(models.Model):
    MODE = (
        ('advanced', 'advanced',),
        ('normal', 'normal',)
    )

    id = models.AutoField(primary_key=True)
    player_one = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='player_one')
    player_two = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='player_two')
    mode = models.CharField(max_length=10, choices=MODE)
    creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['player_one', 'player_two'])]


class Round(models.Model):

    id = models.AutoField(primary_key=True)
    number = models.IntegerField(default=1)
    game = models.ForeignKey('Game', on_delete=models.CASCADE, related_name='rounds')
    p1_movement = models.CharField(max_length=10)
    p2_movement = models.CharField(max_length=10)
    winner = models.ForeignKey('Player', on_delete=models.CASCADE, null=True)

    class Meta:
        indexes = [models.Index(fields=['game'])]


BASIC_MOVEMENTS = [
    'rock',
    'paper',
    'scissors',
]

ADVANCED_MOVEMENTS = [
    'rock',
    'paper',
    'scissors',
    'lizard',
    'spock',
]

MOVEMENT_WINS = {
    'rock': [
        'lizard',
        'scissors',
    ],
    'paper': [
        'rock',
        'spock',
    ],
    'scissors': [
        'paper',
        'lizard',
    ],
    'lizard': [
        'spock',
        'paper'
    ],
    'spock': [
        'scissors',
        'rock',
    ],
}
