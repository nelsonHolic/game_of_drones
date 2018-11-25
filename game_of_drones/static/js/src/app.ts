import { GameModel } from './models/game.model'
import { NewGameComponent } from "./component/new_game.component";
import { GameRoundComponent } from "./component/game_round.component";
import { GameResultComponent } from "./component/game_result.component";
import {BaseRouter} from "./routers/base";
import {defaultRouterRules} from "./default_router_rules";

class GameOfDronesApp {

    public router: BaseRouter;
    public htmlElement = document.getElementById('container');
    public newGameComponent: NewGameComponent;
    public gameRoundComponent: GameRoundComponent;
    public gameResultComponent: GameResultComponent;

    constructor(public game = new GameModel()) {
        this.router = new BaseRouter(defaultRouterRules, game, this.htmlElement);
    }


    public show() {
        this.game.getSessionGame().then( response => {
            if(!response) {
                this.router.goTo('new_game');
            } else {
                this.router.goTo('round_game');
            }
        });
    };
}

const app = new GameOfDronesApp();

app.show();
