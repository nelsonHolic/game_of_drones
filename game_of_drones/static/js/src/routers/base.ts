
import {GameModel} from "../models/game.model";

export interface IRouteRoules {
    path: string,
    component: any,
}


export class BaseRouter {
    public currentComponent;

    constructor(private routeRules: IRouteRoules[], public gameModel: GameModel, public htmlElement) { }

    public goTo = (path) => {
        const rule = this.routeRules.find(rule=> rule.path === path);
        if (rule) {
            delete this.currentComponent;
            this.currentComponent = new rule.component(this.htmlElement, this.gameModel, this);
        }
    }
}
