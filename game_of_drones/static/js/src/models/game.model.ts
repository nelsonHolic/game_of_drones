import { IGameResponse, IRoundResponse } from "../interfaces/game.interfaces";

export class GameModel {
    public id;
    public player_one: string;
    public player_two: string;
    public round_number: number = 1;
    public round_logs: IRoundResponse[];

    public get winner(): string {
        const results = {};

        for(const log of this.round_logs) {
            if(!log.winner) {
                continue
            }

            if(results[log.winner]) {
                results[log.winner] += 1
            } else {
                results[log.winner] = 1;
            }
        }

        if (results[this.player_one] > results[this.player_two]) {
            return this.player_one
        } else if (results[this.player_one] < results[this.player_two]) {
            return this.player_two
        } else {
            return null;
        }
    }

    constructor() { }

    public createGame(): Promise<IGameResponse> {
        const data = { player_one: this.player_one, player_two: this.player_two };

        return fetch('/API/version/1/game/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
            .then((dataResponse: IGameResponse) => {
                this.id = dataResponse.id;
                this.player_one = dataResponse.player_one;
                this.player_two = dataResponse.player_two;
                this.round_number = 1;

                return dataResponse;
            })
    }

    public getSessionGame(): Promise<IGameResponse> {
        return fetch('/API/version/1/game/session_game/')
            .then(response => response.json())
            .then((dataResponse: IGameResponse) => {
                if(dataResponse.id) {
                    this.id = dataResponse.id;
                    this.player_one = dataResponse.player_one;
                    this.player_two = dataResponse.player_two;
                    this.round_number = dataResponse.total_rounds + 1;

                    return dataResponse;
                }
            })
    }

    public makeMovements(p1_movement, p2_movement): Promise<IRoundResponse> {
        const data = { p1_movement, p2_movement };

        return fetch(`/API/version/1/game/${this.id}/make_a_movement/`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then(
            response => response.json() as Promise<IRoundResponse>,
        )
    }

    public getGameRoundsLogs(): Promise<IRoundResponse[]> {
        return fetch(`/API/version/1/game/${this.id}/rounds_logs/`)
            .then(response => response.json())
            .then((dataResponse: IRoundResponse[]) => {
                this.round_logs = dataResponse;
                return dataResponse;
            })
    }


}
