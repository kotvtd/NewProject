import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import EmitterManager from './EmitterManager';

@ccclass('HeroManager')
export class HeroManager extends Component {

    @property({
        type: Prefab
    })
    public heroPrefab: Prefab = null;

    private emitter = EmitterManager.getInstance();

    protected onEnable(): void {
        this.emitter.registerEvent("CLICK", this.spawnHero, this);
        this.emitter.registerEvent("ON_CHOOSE_HERO", this.onChooseHero, this);
    }

    start() {

    }

    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }
    spawnHero(data){
        console.log(this.heroPrefab);
        let heroSpawn = instantiate(this.heroPrefab);
        heroSpawn.setParent(this.node);
        data as Node;
        heroSpawn.setWorldPosition(data.worldPosition);


        this.emitter.emit("ON_PUT_HERO", {
            frame: data,
            hero: heroSpawn
        });

    }

    onChooseHero(data) {
        this.heroPrefab = data;
    }

}

