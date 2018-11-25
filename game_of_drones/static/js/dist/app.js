System.register("interfaces/game.interfaces", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("models/game.model", [], function (exports_2, context_2) {
    "use strict";
    var GameModel;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            GameModel = (function () {
                function GameModel() {
                    this.round_number = 1;
                }
                GameModel.prototype.createGame = function () {
                    var _this = this;
                    var data = { player_one: this.player_one, player_two: this.player_two };
                    return fetch('/API/version/1/game/', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    }).then(function (response) { return response.json(); })
                        .then(function (dataResponse) {
                        debugger;
                        _this.id = dataResponse.id;
                        _this.player_one = dataResponse.player_one;
                        _this.player_two = dataResponse.player_two;
                        _this.round_number = 1;
                        return dataResponse;
                    });
                };
                GameModel.prototype.getSessionGame = function () {
                    var _this = this;
                    return fetch('/API/version/1/game/session_game/')
                        .then(function (response) { return response.json(); })
                        .then(function (dataResponse) {
                        if (dataResponse.id) {
                            _this.id = dataResponse.id;
                            _this.player_one = dataResponse.player_one;
                            _this.player_two = dataResponse.player_two;
                            _this.round_number = dataResponse.total_rounds + 1;
                            return dataResponse;
                        }
                    });
                };
                GameModel.prototype.makeMovements = function (p1_movement, p2_movement) {
                    var data = { p1_movement: p1_movement, p2_movement: p2_movement };
                    return fetch("/API/version/1/game/" + this.id + "/make_a_movement/", {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    }).then(function (response) { return response.json(); });
                };
                GameModel.prototype.getGameRoundsLogs = function () {
                    return fetch("/API/version/1/game/" + this.id + "/rounds_logs/")
                        .then(function (response) { return response.json(); })
                        .then(function (dataResponse) {
                        return dataResponse;
                    });
                };
                return GameModel;
            }());
            exports_2("GameModel", GameModel);
        }
    };
});
System.register("component/new_game.component", [], function (exports_3, context_3) {
    "use strict";
    var NewGameComponent;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            NewGameComponent = (function () {
                function NewGameComponent(htmlElement, gameModel) {
                    var _this = this;
                    this.htmlElement = htmlElement;
                    this.gameModel = gameModel;
                    this.submit = function () {
                        _this.gameModel.player_one = _this.playerOne.value;
                        _this.gameModel.player_two = _this.playerTwo.value;
                        _this.gameModel.createGame().then(function (response) {
                            debugger;
                        });
                    };
                    htmlElement.innerHTML = this.htmlContent;
                    this.playerOne = htmlElement.querySelector('#player_one_name');
                    this.playerTwo = htmlElement.querySelector('#player_two_name');
                    var button = htmlElement.querySelector('.startButton');
                    button.onclick = this.submit;
                }
                Object.defineProperty(NewGameComponent.prototype, "htmlContent", {
                    get: function () {
                        return "\n            <div id=\"newGame\">\n              <h3>\n                Welcome, enter player names          \n              </h3>\n              <div>\n                <label for=\"player_one_name\">player 1:</label>   \n                <input id=\"player_one_name\" class=\"playerOneName\">\n                <br>           \n                <label for=\"player_two_name\">player 2:</label>              \n                <input id=\"player_two_name\" class=\"playerTwoName\">           \n              </div>\n              <button class=\"startButton\">Start</button>      \n            </div>\n        ";
                    },
                    enumerable: true,
                    configurable: true
                });
                return NewGameComponent;
            }());
            exports_3("NewGameComponent", NewGameComponent);
        }
    };
});
System.register("constants/movements", [], function (exports_4, context_4) {
    "use strict";
    var BASIC_MOVEMENTS, ADVANCED_MOVEMENTS;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            exports_4("BASIC_MOVEMENTS", BASIC_MOVEMENTS = [
                'rock',
                'paper',
                'scissors',
            ]);
            exports_4("ADVANCED_MOVEMENTS", ADVANCED_MOVEMENTS = [
                'rock',
                'paper',
                'scissors',
                'lizard',
                'spock',
            ]);
        }
    };
});
System.register("component/game_round.component", ["constants/movements"], function (exports_5, context_5) {
    "use strict";
    var movements_1, GameRoundComponent;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (movements_1_1) {
                movements_1 = movements_1_1;
            }
        ],
        execute: function () {
            GameRoundComponent = (function () {
                function GameRoundComponent(htmlElement, gameModel) {
                    var _this = this;
                    this.htmlElement = htmlElement;
                    this.gameModel = gameModel;
                    this.round_number = 1;
                    this.roundsLogs = [];
                    this.players_movements = {
                        player_one: '',
                        player_two: ''
                    };
                    this.round_number = gameModel.round_number;
                    this.current_player = { name: this.gameModel.player_one, player: "player_one" };
                    this.updateView();
                    this.gameModel.getGameRoundsLogs().then(function (roundsLogs) {
                        _this.roundsLogs = roundsLogs;
                        _this.updateView();
                    });
                }
                Object.defineProperty(GameRoundComponent.prototype, "htmlContent", {
                    get: function () {
                        return "\n            <div id=\"round\">\n              <div id=\"roundTable\">\n                  <h1>Round " + this.round_number + "</h1>\n                  <h2>" + this.current_player.name + ", make a movement: </h2>\n                  <div> \n                    " + movements_1.BASIC_MOVEMENTS.map(function (movement, index) {
                            return "<button id=\"button" + index + "\">" + movement + "</button>";
                        }).join('') + "\n                  </div>\n              </div>\n              <div id=\"roundLogs\">\n                  <h1>Score</h1>\n                  <table>\n                  <tr>\n                    <th>Round</th> <th>Winner</th>\n                  </tr>\n                  " + this.roundsLogs.map(function (log, index) {
                            return "<tr><td>" + log.number + "</td><td>" + log.winner + "</td></tr>";
                        }).join('') + "\n                  </table>\n              \n              </div>\n            </div>\n        ";
                    },
                    enumerable: true,
                    configurable: true
                });
                GameRoundComponent.prototype.updateView = function () {
                    var _this = this;
                    this.htmlElement.innerHTML = this.htmlContent;
                    var buttons = Array.prototype.slice.call(this.htmlElement.querySelectorAll('button'));
                    buttons.forEach(function (button, index) {
                        button.onclick = function (event) { return _this.makeMovement(movements_1.BASIC_MOVEMENTS[index]); };
                    });
                };
                GameRoundComponent.prototype.makeMovement = function (move) {
                    var _this = this;
                    if (this.current_player.player === 'player_one') {
                        this.players_movements.player_one = move;
                        this.current_player = { name: this.gameModel.player_two, player: "player_two" };
                    }
                    else {
                        this.players_movements.player_two = move;
                        this.current_player = { name: this.gameModel.player_one, player: "player_one" };
                        debugger;
                        this.gameModel.makeMovements(this.players_movements.player_one, this.players_movements.player_two).then(function (roundResponse) {
                            _this.roundsLogs.push(roundResponse);
                            _this.updateView();
                        });
                    }
                    this.updateView();
                };
                return GameRoundComponent;
            }());
            exports_5("GameRoundComponent", GameRoundComponent);
        }
    };
});
System.register("app", ["models/game.model", "component/new_game.component", "component/game_round.component"], function (exports_6, context_6) {
    "use strict";
    var game_model_1, new_game_component_1, game_round_component_1, GameOfDronesApp, app;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (game_model_1_1) {
                game_model_1 = game_model_1_1;
            },
            function (new_game_component_1_1) {
                new_game_component_1 = new_game_component_1_1;
            },
            function (game_round_component_1_1) {
                game_round_component_1 = game_round_component_1_1;
            }
        ],
        execute: function () {
            GameOfDronesApp = (function () {
                function GameOfDronesApp(game) {
                    if (game === void 0) { game = new game_model_1.GameModel(); }
                    this.game = game;
                    this.htmlElement = document.getElementById('container');
                }
                GameOfDronesApp.prototype.show = function () {
                    var _this = this;
                    this.game.getSessionGame().then(function (response) {
                        if (!response) {
                            var newGameComponent = new new_game_component_1.NewGameComponent(document.getElementById('container'), _this.game);
                        }
                        else {
                            var gameRoundComponent = new game_round_component_1.GameRoundComponent(document.getElementById('container'), _this.game);
                        }
                    });
                };
                return GameOfDronesApp;
            }());
            app = new GameOfDronesApp();
            app.show();
        }
    };
});
//# sourceMappingURL=app.js.map