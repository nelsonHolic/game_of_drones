import { GameModel } from "../models/game.model";
import { BASIC_MOVEMENTS } from "../constants/movements";
import {IPlayerRound, IRoundResponse} from "../interfaces/game.interfaces";
import {BaseRouter} from "../routers/base";

export class GameRoundComponent {

    private round_number: number = 1;
    private current_player: IPlayerRound;
    private roundsLogs: IRoundResponse[] = [];


    private players_movements = {
        player_one: '',
        player_two: ''
    };

    public get htmlContent() {
        return `<div id="round">
          <div id="roundTable">
              <h1>Round ${this.round_number}</h1>
              <h2>${this.current_player.name}, make a movement: </h2>
              <div> 
                ${BASIC_MOVEMENTS.map((movement, index) =>`<button id="button${index}">${movement}</button>`).join('')}
              </div>
          </div>
          <div id="roundLogs">
              <h1>Score</h1>
              <table>
              <tr>
                <th>Round</th> <th>Winner</th>
              </tr>
              ${this.roundsLogs.map((log, index) =>`<tr><td>${log.number}</td><td>${log.winner}</td></tr>`).join('')}
              </table>          
          </div>
        </div>`;
    }

    constructor(public htmlElement: HTMLElement, public gameModel: GameModel, public router: BaseRouter){
        this.round_number = gameModel.round_number;
        this.current_player = { name: this.gameModel.player_one, player: "player_one" };
        this.updateView();
        this.gameModel.getGameRoundsLogs().then(roundsLogs => {
            this.roundsLogs = roundsLogs;
            this.updateView();
        })
    }

    public updateView() {
        this.htmlElement.innerHTML = this.htmlContent;
        const buttons = Array.prototype.slice.call(this.htmlElement.querySelectorAll('button'));
        buttons.forEach((button:HTMLButtonElement, index) => {
            button.onclick = (event) => this.makeMovement(BASIC_MOVEMENTS[index]);
        })
    }

    public makeMovement(move: string) {
        if(this.current_player.player === 'player_one') {
            this.players_movements.player_one = move;
            this.current_player = {  name: this.gameModel.player_two, player: "player_two" }
        } else {
            this.players_movements.player_two = move;
            this.current_player = { name: this.gameModel.player_one, player: "player_one" };

            this.gameModel.makeMovements(this.players_movements.player_one, this.players_movements.player_two).then(
                roundResponse => {
                    this.roundsLogs.push(roundResponse);

                    if(roundResponse.number >= 3) {
                        this.gameModel.round_logs = this.roundsLogs;
                        this.router.goTo('result_game');
                        return;
                    }
                    this.updateView();
                }
            );
        }
        this.updateView();
    }

}
