import { _decorator, Component, EventTouch, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import EmitterManager from './Manager/EmitterManager';

@ccclass('ChooseHero')
export class ChooseHero extends Component {
    @property([Node])
    chooseHero: Node[] = [];

    @property([Prefab])
    heroPrefabs: Prefab[] = [];

    @property({
        type: Node,
        visible: true
    })
    frameFocus: Node = null;

    private emitter = EmitterManager.getInstance(); 


    protected onLoad(): void {
        this.chooseHero = this.node.children;
    }

    protected onEnable(): void {
        this.chooseHero.forEach(choose=> {
            choose.on(Node.EventType.TOUCH_END, this.onChooseHero, this);
        });
        this.emitter.registerEvent("END_PUT_HERO", this.onEndPutHero, this);
        this.emitter.registerEvent("RESET_GAME", this.reset, this);
    }

    protected start(): void {

    }

    reset() {
        this.frameFocus.active = false;
    }

    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }

    onChooseHero(event: EventTouch): void {
        let hero = event.currentTarget as Node;
        const prefab = this.heroPrefabs.find(prefab => {
            return prefab.name == hero.name;
        });
        this.frameFocus.active = true;
        this.frameFocus.setWorldPosition(hero.worldPosition);
        this.emitter.emit("ON_CHOOSE_HERO", prefab);
    }

    onEndPutHero(){
        this.frameFocus.active = false;
    }
    
}

