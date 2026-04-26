import { _decorator, Component, Label, Node } from 'cc';
import EmitterManager from './EmitterManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer extends Component {
    private enemyTime: number = 10;
    private time: string ="";

    private isComming: boolean = false;

    private emitter: EmitterManager = EmitterManager.getInstance();

    @property({
        type: Label,
        visible: true
    })
    labelTime: Label | null = null;

    start() {

    }
    protected onEnable(): void {
    }

    protected update(dt: number): void {
        if(GameManager.instance.isPause) {
            return;
        }
        if(this.enemyTime <= 0){
            return;
        }
        this.enemyTime -= dt;
        let tempTime = Math.trunc(this.enemyTime);
        this.time = tempTime.toString() + "sec";
        this.labelTime.string = this.time;
        if(tempTime === 0){
            this.emitter.emit("ENEMY_COMMING");
            this.enemyTime -= 10;
        }
    }

    protected onDisable(): void {
        this.enemyTime = 10;
        this.isComming = false;
    }

}


