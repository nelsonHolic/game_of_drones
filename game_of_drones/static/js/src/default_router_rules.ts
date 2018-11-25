
import {IRouteRoules} from "./routers/base";
import { NewGameComponent } from "./components/new_game.component";
import { GameRoundComponent } from "./components/game_round.component";
import { GameResultComponent } from "./components/game_result.component";

export const defaultRouterRules:IRouteRoules[] = [
    { path: 'new_game', component: NewGameComponent},
    { path: 'round_game', component: GameRoundComponent},
    { path: 'result_game', component: GameResultComponent},
];
