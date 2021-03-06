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
            GameModel = class GameModel {
                constructor() {
                    this.round_number = 1;
                }
                get winner() {
                    return this.get_winner();
                }
                handleHttpCalls(url, init) {
                    return fetch(url, init).then(response => {
                        if (!response.ok) {
                            response.json().then(dataErr => {
                                let message = "";
                                for (const key in dataErr) {
                                    message += `${key} : ${dataErr[key]}\n`;
                                }
                                alert(message);
                            });
                            throw Error(response.statusText);
                        }
                        return response.json();
                    });
                }
                createGame() {
                    const data = { player_one: this.player_one, player_two: this.player_two, mode: this.mode };
                    return this.handleHttpCalls('/API/version/1/game/', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    }).then((dataResponse) => {
                        this.id = dataResponse.id;
                        this.player_one = dataResponse.player_one;
                        this.player_two = dataResponse.player_two;
                        this.mode = dataResponse.mode;
                        this.round_number = 1;
                        return dataResponse;
                    });
                }
                getSessionGame() {
                    return this.handleHttpCalls('/API/version/1/game/session_game/')
                        .then((dataResponse) => {
                        if (dataResponse.id) {
                            this.id = dataResponse.id;
                            this.player_one = dataResponse.player_one;
                            this.player_two = dataResponse.player_two;
                            this.mode = dataResponse.mode;
                            this.round_number = dataResponse.total_rounds + 1;
                            return dataResponse;
                        }
                    });
                }
                makeMovements(p1_movement, p2_movement) {
                    const data = { p1_movement, p2_movement };
                    return this.handleHttpCalls(`/API/version/1/game/${this.id}/make_a_movement/`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                getGameRoundsLogs() {
                    return this.handleHttpCalls(`/API/version/1/game/${this.id}/rounds_logs/`)
                        .then((dataResponse) => {
                        this.round_logs = dataResponse;
                        return dataResponse;
                    });
                }
                get_winner() {
                    const results = {};
                    for (const log of this.round_logs) {
                        if (!log.winner) {
                            continue;
                        }
                        if (results[log.winner]) {
                            results[log.winner] += 1;
                        }
                        else {
                            results[log.winner] = 1;
                        }
                    }
                    if (results[this.player_one] > results[this.player_two]) {
                        return this.player_one;
                    }
                    else if (results[this.player_one] < results[this.player_two]) {
                        return this.player_two;
                    }
                    else {
                        return null;
                    }
                }
            };
            exports_2("GameModel", GameModel);
        }
    };
});
System.register("interfaces/router.interfaces", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("routers/base", [], function (exports_4, context_4) {
    "use strict";
    var BaseRouter;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            BaseRouter = class BaseRouter {
                constructor(routeRules, gameModel, htmlElement) {
                    this.routeRules = routeRules;
                    this.gameModel = gameModel;
                    this.htmlElement = htmlElement;
                    this.goTo = (path) => {
                        const rule = this.routeRules.find(rule => rule.path === path);
                        if (rule) {
                            delete this.currentComponent;
                            this.currentComponent = new rule.component(this.htmlElement, this.gameModel, this);
                        }
                    };
                }
            };
            exports_4("BaseRouter", BaseRouter);
        }
    };
});
System.register("components/new_game.component", [], function (exports_5, context_5) {
    "use strict";
    var NewGameComponent;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            NewGameComponent = class NewGameComponent {
                constructor(htmlElement, gameModel, router) {
                    this.htmlElement = htmlElement;
                    this.gameModel = gameModel;
                    this.router = router;
                    this.submit = () => {
                        this.gameModel.player_one = this.playerOne.value;
                        this.gameModel.player_two = this.playerTwo.value;
                        if (this.normalMode.checked) {
                            this.gameModel.mode = 'normal';
                        }
                        else {
                            this.gameModel.mode = 'advanced';
                        }
                        this.gameModel.createGame().then(() => this.router.goTo('round_game'));
                    };
                    htmlElement.innerHTML = this.htmlContent;
                    this.playerOne = htmlElement.querySelector('#player_one_name');
                    this.playerTwo = htmlElement.querySelector('#player_two_name');
                    this.normalMode = htmlElement.querySelector('#normal_mode');
                    const button = htmlElement.querySelector('.startButton');
                    button.onclick = this.submit;
                }
                get htmlContent() {
                    return `
            <div id="newGame">
              <h3>
                Welcome, enter player names          
              </h3>
              <fieldset>
                <label for="player_one_name">player 1:</label>   
                <input id="player_one_name" class="playerName playerOneName">
                <br>           
                <label for="player_two_name">player 2:</label>              
                <input id="player_two_name" class="playerName playerTwoName">           
              </fieldset>
              <h4>Mode:</h4>
              <fieldset id="mode-group">
                <label for="normal_mode">Normal:</label>              
                <input id="normal_mode" type="radio" name="mode-group"> 
                <label for="advanced_mode">Advanced:</label>   
                <input id="advanced_mode" type="radio" name="mode-group">                     
              </fieldset>
              <button class="startButton">Start</button>      
            </div>
        `;
                }
            };
            exports_5("NewGameComponent", NewGameComponent);
        }
    };
});
System.register("constants/movements", [], function (exports_6, context_6) {
    "use strict";
    var BASIC_MOVEMENTS, ADVANCED_MOVEMENTS;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            exports_6("BASIC_MOVEMENTS", BASIC_MOVEMENTS = [
                'rock',
                'paper',
                'scissors',
            ]);
            exports_6("ADVANCED_MOVEMENTS", ADVANCED_MOVEMENTS = [
                'rock',
                'paper',
                'scissors',
                'lizard',
                'spock',
            ]);
        }
    };
});
System.register("components/game_round.component", ["constants/movements"], function (exports_7, context_7) {
    "use strict";
    var movements_1, GameRoundComponent;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (movements_1_1) {
                movements_1 = movements_1_1;
            }
        ],
        execute: function () {
            GameRoundComponent = class GameRoundComponent {
                constructor(htmlElement, gameModel, router) {
                    this.htmlElement = htmlElement;
                    this.gameModel = gameModel;
                    this.router = router;
                    this.round_number = 1;
                    this.roundsLogs = [];
                    this.MOVEMENTS = [];
                    this.players_movements = {
                        player_one: '',
                        player_two: ''
                    };
                    this.round_number = gameModel.round_number;
                    this.current_player = { name: this.gameModel.player_one, player: "player_one" };
                    if (gameModel.mode === 'normal') {
                        this.MOVEMENTS = movements_1.BASIC_MOVEMENTS;
                    }
                    else {
                        this.MOVEMENTS = movements_1.ADVANCED_MOVEMENTS;
                    }
                    this.updateView();
                    this.gameModel.getGameRoundsLogs().then(roundsLogs => {
                        this.roundsLogs = roundsLogs;
                        this.updateView();
                    });
                }
                get htmlContent() {
                    return `<div id="round">
          <div id="roundTable">
              <h1>Round ${this.round_number}</h1>
              <h2>${this.current_player.name}, make a movement: </h2>
              <div> 
                ${this.MOVEMENTS.map((movement, index) => `<button id="button${index}" class="btn-game btn-${movement}">${movement}</button>`).join('')}
              </div>
          </div>
          <div id="roundLogs">
              <h1>Score</h1>
              <table>
              <tr>
                <th>Round</th> <th>Winner</th>
              </tr>
              ${this.roundsLogs.map((log, index) => `<tr>
                  <td>${log.number}</td>
                  <td>${log.winner ? log.winner : 'tie'}</td>
                 </tr>`).join('')}
              </table>          
          </div>
        </div>`;
                }
                updateView() {
                    this.htmlElement.innerHTML = this.htmlContent;
                    const buttons = Array.prototype.slice.call(this.htmlElement.querySelectorAll('button'));
                    buttons.forEach((button, index) => {
                        button.onclick = (event) => this.makeMovement(this.MOVEMENTS[index]);
                    });
                }
                makeMovement(move) {
                    if (this.current_player.player === 'player_one') {
                        this.players_movements.player_one = move;
                        this.current_player = { name: this.gameModel.player_two, player: "player_two" };
                    }
                    else {
                        this.players_movements.player_two = move;
                        this.current_player = { name: this.gameModel.player_one, player: "player_one" };
                        this.gameModel.makeMovements(this.players_movements.player_one, this.players_movements.player_two).then(roundResponse => {
                            this.roundsLogs.push(roundResponse);
                            if (roundResponse.number >= 3) {
                                this.gameModel.round_logs = this.roundsLogs;
                                this.router.goTo('result_game');
                                return;
                            }
                            this.updateView();
                        });
                    }
                    this.updateView();
                }
            };
            exports_7("GameRoundComponent", GameRoundComponent);
        }
    };
});
System.register("components/game_result.component", [], function (exports_8, context_8) {
    "use strict";
    var GameResultComponent;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            GameResultComponent = class GameResultComponent {
                constructor(htmlElement, gameModel, router) {
                    this.htmlElement = htmlElement;
                    this.gameModel = gameModel;
                    this.router = router;
                    this.playAgain = () => {
                        this.gameModel.createGame().then(response => this.router.goTo('round_game'));
                    };
                    this.newGame = () => {
                        this.router.goTo('new_game');
                    };
                    this.winner = gameModel.winner;
                    this.updateView();
                }
                get htmlContent() {
                    return `<div id="result">
          ${this.gameModel.winner ? `
              <div id="winner">
                <h1>We have a WINNER!!</h1>      
                <p>${this.gameModel.winner} is the new EMPEROR!!!</p> 
              </div>
          ` : `
              <div id="tie">
                <h1>We have a tie!!</h1>      
                <p> There is not a new EMPEROR!!!</p> 
              </div>
          `}
          <div class="buttonContainer">
            <button id="playAgainButton">Play Again</button>          
            <button id="newGameButton">New Game</button>          
          </div>
        </div>`;
                }
                updateView() {
                    this.htmlElement.innerHTML = this.htmlContent;
                    const playAgainButton = this.htmlElement.querySelector('#playAgainButton');
                    const newGameButton = this.htmlElement.querySelector('#newGameButton');
                    playAgainButton.onclick = this.playAgain;
                    newGameButton.onclick = this.newGame;
                }
            };
            exports_8("GameResultComponent", GameResultComponent);
        }
    };
});
System.register("default_router_rules", ["components/new_game.component", "components/game_round.component", "components/game_result.component"], function (exports_9, context_9) {
    "use strict";
    var new_game_component_1, game_round_component_1, game_result_component_1, defaultRouterRules;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (new_game_component_1_1) {
                new_game_component_1 = new_game_component_1_1;
            },
            function (game_round_component_1_1) {
                game_round_component_1 = game_round_component_1_1;
            },
            function (game_result_component_1_1) {
                game_result_component_1 = game_result_component_1_1;
            }
        ],
        execute: function () {
            exports_9("defaultRouterRules", defaultRouterRules = [
                { path: 'new_game', component: new_game_component_1.NewGameComponent },
                { path: 'round_game', component: game_round_component_1.GameRoundComponent },
                { path: 'result_game', component: game_result_component_1.GameResultComponent },
            ]);
        }
    };
});
System.register("app", ["models/game.model", "routers/base", "default_router_rules"], function (exports_10, context_10) {
    "use strict";
    var game_model_1, base_1, default_router_rules_1, GameOfDronesApp, app;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (game_model_1_1) {
                game_model_1 = game_model_1_1;
            },
            function (base_1_1) {
                base_1 = base_1_1;
            },
            function (default_router_rules_1_1) {
                default_router_rules_1 = default_router_rules_1_1;
            }
        ],
        execute: function () {
            GameOfDronesApp = class GameOfDronesApp {
                constructor(game = new game_model_1.GameModel()) {
                    this.game = game;
                    this.htmlElement = document.getElementById('container');
                    this.router = new base_1.BaseRouter(default_router_rules_1.defaultRouterRules, game, this.htmlElement);
                }
                show() {
                    this.game.getSessionGame().then(response => {
                        if (!response) {
                            this.router.goTo('new_game');
                        }
                        else {
                            this.router.goTo('round_game');
                        }
                    });
                }
                ;
            };
            app = new GameOfDronesApp();
            app.show();
        }
    };
});
//# sourceMappingURL=app.js.map