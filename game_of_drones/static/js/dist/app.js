System.register("models/game.model", [], function (exports_1, context_1) {
    "use strict";
    var GameModel;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            GameModel = (function () {
                function GameModel() {
                }
                GameModel.prototype.createGame = function () {
                    var _this = this;
                    var data = {
                        player_one: this.player_one,
                        player_two: this.player_two,
                    };
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
                        return dataResponse;
                    });
                };
                GameModel.prototype.getSessionGame = function () {
                    var _this = this;
                    return fetch('/API/version/1/game/session_game/')
                        .then(function (response) { return response.json(); })
                        .then(function (dataResponse) {
                        if (dataResponse.id) {
                            _this.player_one = dataResponse.player_one;
                            _this.player_two = dataResponse.player_two;
                            return dataResponse;
                        }
                    });
                };
                return GameModel;
            }());
            exports_1("GameModel", GameModel);
        }
    };
});
System.register("component/new_game.component", [], function (exports_2, context_2) {
    "use strict";
    var NewGameComponent;
    var __moduleName = context_2 && context_2.id;
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
                        return "\n            <div id=\"newGame\">\n              <h3>\n                Welcome, enter player names          \n              </h3>\n              <div>\n                <label for=\"player_one_name\">player 1:</label>   \n                <input id=\"player_one_name\" class=\"playerOneName\">           \n                <label for=\"player_two_name\">player 2:</label>              \n                <input id=\"player_two_name\" class=\"playerTwoName\">           \n              </div>\n              <button class=\"startButton\">Start</button>      \n            </div>\n        ";
                    },
                    enumerable: true,
                    configurable: true
                });
                return NewGameComponent;
            }());
            exports_2("NewGameComponent", NewGameComponent);
        }
    };
});
System.register("app", ["models/game.model", "component/new_game.component"], function (exports_3, context_3) {
    "use strict";
    var game_model_1, new_game_component_1, game;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (game_model_1_1) {
                game_model_1 = game_model_1_1;
            },
            function (new_game_component_1_1) {
                new_game_component_1 = new_game_component_1_1;
            }
        ],
        execute: function () {
            game = new game_model_1.GameModel();
            game.getSessionGame().then(function (response) {
                if (!response) {
                    var new_game_component = new new_game_component_1.NewGameComponent(document.getElementById('container'), game);
                }
            });
        }
    };
});
//# sourceMappingURL=app.js.map