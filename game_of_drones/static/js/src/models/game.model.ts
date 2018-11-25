interface IGameResponse {
    id: number;
    player_one: string;
    player_two: string;
}

export class GameModel {
    public id;
    public player_one;
    public player_two;


    constructor() { }

    public createGame(): Promise<IGameResponse> {
        const data = {
            player_one: this.player_one,
            player_two: this.player_two,
        };

        return fetch('/API/version/1/game/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
            .then((dataResponse: IGameResponse) => {
                debugger;
                this.id = dataResponse.id;
                this.player_one = dataResponse.player_one;
                this.player_two = dataResponse.player_two;

                return dataResponse;
            })
    }

    public getSessionGame(): Promise<IGameResponse> {
        return fetch('/API/version/1/game/session_game/')
            .then(response => response.json())
            .then((dataResponse: IGameResponse) => {
                if(dataResponse.id) {
                    this.player_one = dataResponse.player_one;
                    this.player_two = dataResponse.player_two;
                    return dataResponse;
                }
            })
    }


}
