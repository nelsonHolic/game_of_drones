import { GameModel } from "../models/game.model";
import { IRouteRules } from "../interfaces/router.interfaces";


export class BaseRouter {
    public currentComponent;

    constructor(private routeRules: IRouteRules[], public gameModel: GameModel, public htmlElement) { }

    public goTo = (path) => {
        const rule = this.routeRules.find(rule=> rule.path === path);
        if (rule) {
            delete this.currentComponent;
            this.currentComponent = new rule.component(this.htmlElement, this.gameModel, this);
        }
    }
}
