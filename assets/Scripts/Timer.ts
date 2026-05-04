import { _decorator, Component, Label, log, Node, ProgressBar } from 'cc';
import EmitterManager from './EmitterManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer extends Component {
    private enemyTime: number = 5;
    private bossTime: number = 5;
    private time: string ="";

    private isComing: boolean = true;
    private isBossComing = false;
    private isEnemyComing = true;


    private currentTime: number = 0;
    private timeCount: number = 0;



    private emitter: EmitterManager = EmitterManager.getInstance();

    @property({
        type: Label,
        visible: true
    })
    labelTime: Label | null = null;

    @property(ProgressBar)
    comingImage: ProgressBar | null = null;

    start() {
    }
    protected onEnable(): void {
        this.emitter.registerEvent("END_ENEMY_WAY", this.clearEnemy, this);
        this.resetTimer();
        
    }

    protected update(dt: number): void {
        this.loadProgress();
        if(GameManager.instance.isPause) {
            return;
        }
        if(this.timeCount <= 0){
            return;
        }
        this.timeCount -= dt;
        let tempTime = Math.trunc(this.timeCount);
        this.time = tempTime.toString() + "sec";
        this.labelTime.string = this.time;
        if(this.timeCount <= 0){
            if(this.isEnemyComing ) {
                this.emitter.emit("ENEMY_COMING");
                this.isEnemyComing = false;
                this.isBossComing = false;
            } else if(this.isBossComing) {
                this.emitter.emit("BOSS_COMING", this.bossTime);
                this.isBossComing = false;
            }
        }
    }
    
    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
        this.enemyTime = 5;
        this.bossTime = 5;
        this.isEnemyComing = true;
        this.isBossComing = false;
        this.isComing = true;
    }
    
    private clearEnemy(){
        this.isEnemyComing = false;
        this.isBossComing = true;
        this.currentTime = this.bossTime;
        this.timeCount = this.currentTime;
        this.labelTime.node.active = true;
        this.comingImage.progress = 1;
    }

    private loadProgress() {
        if(this.timeCount <= 0){
            this.comingImage.progress = 0;
            this.labelTime.node.active = false;

            return;
        }
        this.comingImage.progress = this.timeCount / this.currentTime;
    }

    resetTimer() {
        this.enemyTime = 5;
        this.bossTime = 5;

        this.isEnemyComing = true;
        this.isBossComing = false;
        this.isComing = true;

        this.currentTime = this.enemyTime;
        this.timeCount = this.currentTime;

        this.labelTime.node.active = true;
    }

}


