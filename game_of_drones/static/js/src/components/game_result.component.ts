import { GameModel } from "../models/game.model";
import { BaseRouter } from "../routers/base";

export class GameResultComponent {

    private winner: string;

    public get htmlContent() {
        return `<div id="result">
          ${this.gameModel.winner? `
              <div id="winner">
                <h1>We have a WINNER!!</h1>      
                <p>${this.gameModel.winner} is the new EMPEROR!!!</p> 
              </div>
          `:`
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

    constructor(public htmlElement: HTMLElement, public gameModel: GameModel, public router: BaseRouter){
        this.winner = gameModel.winner;
        this.updateView();
    }

    public updateView() {
        this.htmlElement.innerHTML = this.htmlContent;
        const playAgainButton = <HTMLButtonElement>this.htmlElement.querySelector('#playAgainButton');
        const newGameButton = <HTMLButtonElement>this.htmlElement.querySelector('#newGameButton');
        playAgainButton.onclick = this.playAgain;
        newGameButton.onclick = this.newGame;
    }

    public playAgain = () => {
        this.gameModel.createGame().then(
            response => this.router.goTo('round_game'),
        );
    };

    public newGame = () => {
        this.router.goTo('new_game');
    }


}
