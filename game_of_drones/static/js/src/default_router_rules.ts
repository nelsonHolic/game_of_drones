
import {IRouteRoules} from "./routers/base";
import { NewGameComponent } from "./component/new_game.component";
import { GameRoundComponent } from "./component/game_round.component";
import { GameResultComponent } from "./component/game_result.component";

export const defaultRouterRules:IRouteRoules[] = [
    { path: 'new_game', component: NewGameComponent},
    { path: 'round_game', component: GameRoundComponent},
    { path: 'result_game', component: GameResultComponent},
];
