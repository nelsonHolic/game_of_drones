import { IRouteRules } from "./interfaces/router.interfaces";
import { NewGameComponent } from "./components/new_game.component";
import { GameRoundComponent } from "./components/game_round.component";
import { GameResultComponent } from "./components/game_result.component";

export const defaultRouterRules:IRouteRules[] = [
    { path: 'new_game', component: NewGameComponent},
    { path: 'round_game', component: GameRoundComponent},
    { path: 'result_game', component: GameResultComponent},
];
