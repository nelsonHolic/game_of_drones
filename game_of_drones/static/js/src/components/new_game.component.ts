import { GameModel } from "../models/game.model";
import { BaseRouter } from "../routers/base";

export class NewGameComponent {
    public playerOne:HTMLInputElement;
    public playerTwo:HTMLInputElement;
    public normalMode:HTMLInputElement;

    public get htmlContent() {
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

    constructor(public htmlElement: HTMLElement, public gameModel: GameModel, public router: BaseRouter){
        htmlElement.innerHTML = this.htmlContent;

        this.playerOne = <HTMLInputElement>htmlElement.querySelector('#player_one_name');
        this.playerTwo = <HTMLInputElement>htmlElement.querySelector('#player_two_name');
        this.normalMode = <HTMLInputElement>htmlElement.querySelector('#normal_mode');

        const button = <HTMLButtonElement>htmlElement.querySelector('.startButton');
        button.onclick = this.submit;

    }

    private submit = ()=> {
        this.gameModel.player_one = this.playerOne.value;
        this.gameModel.player_two = this.playerTwo.value;

        if(this.normalMode.checked) {
            this.gameModel.mode = 'normal';
        } else {
            this.gameModel.mode = 'advanced';
        }

        this.gameModel.createGame().then(() => this.router.goTo('round_game'));
    }

}
