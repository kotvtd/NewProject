import { _decorator, Component, Node } from 'cc';
import EmitterManager from './EmitterManager';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {

    private enmitter: EmitterManager = EmitterManager.getInstance();
    
    protected onEnable(): void {
        this.enmitter.registerEvent("RESET_ROOM", this.reset, this);
    }




    protected onDisable(): void {
        this.enmitter.removeAllEvents(this);
        this.reset();
    }


    reset() {
        console.log("Reset Bullet");
        this.node.destroyAllChildren();
    }
}

