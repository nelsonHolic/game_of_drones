import { GameModel } from './models/game.model'
import { NewGameComponent } from "./component/new_game.component";


const game = new GameModel();

game.getSessionGame().then( response => {
    if(!response) {
        const new_game_component = new NewGameComponent(document.getElementById('container'), game);
    }
});

