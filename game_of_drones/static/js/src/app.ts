import { GameModel } from './models/game.model'
import { NewGameComponent } from "./component/new_game.component";
import { GameRoundComponent } from "./component/game_round.component";

class GameOfDronesApp {

    public htmlElement = document.getElementById('container');

    constructor(public game = new GameModel()) { }


    public show() {
        this.game.getSessionGame().then( response => {
            if(!response) {
                const newGameComponent = new NewGameComponent(document.getElementById('container'), this.game);
            } else {
                const gameRoundComponent = new GameRoundComponent(document.getElementById('container'), this.game);
            }
        });
    }
}

const app = new GameOfDronesApp();

app.show();
