import { GameModel } from './models/game.model'
import { BaseRouter } from "./routers/base";
import { defaultRouterRules } from "./default_router_rules";

class GameOfDronesApp {

    public router: BaseRouter;
    public htmlElement = document.getElementById('container');

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
