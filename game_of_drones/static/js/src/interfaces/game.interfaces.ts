export interface IGameResponse {
    id: number;
    player_one: string;
    player_two: string;
    mode: string;
    total_rounds?: number;
}

export interface IRoundResponse {
    id: number;
    game: number;
    number: number;
    p1_movement: string;
    p2_movement: string;
    winner: string;
}

export interface IPlayerRound {
    name: string;
    player: string;
}

