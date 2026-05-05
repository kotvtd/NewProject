import { _decorator, Color, Component, Label, log, Node, ProgressBar, Sprite, tween, UIOpacity } from 'cc';
import EmitterManager from './EmitterManager';
import { GameManager } from './GameManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer extends Component {
    private isUpdateUI: boolean = false;


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


    @property(Node)
    bossWarning: Node | null = null;

    protected onEnable(): void {
        this.emitter.registerEvent("START_ENEMY_WAY", this.enemyPhase, this);
        this.emitter.registerEvent("START_BOSS_WAY", this.bossPhase, this);
    }

    protected start(): void {
        // this.emitter.registerEvent("START_ENEMY_WAY", this.enemyPhase, this);
        // this.emitter.registerEvent("START_BOSS_WAY", this.bossPhase, this);
        this.bossWarning.active = false; 
    }

    protected update(dt: number): void {
        if(GameManager.instance.isPause || !this.isUpdateUI) {
            return;
        }

        this.timeCount -= dt;
                if(this.timeCount <= 0){
            this.comingImage.progress = 0;
            this.labelTime.node.active = false;

            return;
        }
        this.labelTime.string = Math.ceil(this.timeCount).toString();
        this.comingImage.progress = this.timeCount / this.currentTime;

    }
    
    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
        this.isUpdateUI = false;
    }
    

    private enemyPhase(data) {
        console.log("EnemyPhase: ", data);
        this.isUpdateUI = true;
        this.currentTime = data;
        this.timeCount = this.currentTime;
        this.labelTime.node.active = true;
        this.comingImage.progress = 1;
    }

    private bossPhase(data) {
        this.bossWarning.active = true;
        let opacity = this.bossWarning.getComponent(UIOpacity);
        if(opacity) {
            opacity.opacity =225;
        }
        tween(opacity).repeat(
            3,
            tween().call(() => {
                SoundManager.inst.playWarning();
            })
            .to(0.65, { opacity: 0 })
            .to(0.65, { opacity: 225 })
        ).call(() => {
            this.bossWarning.active =false;
        })
        .start();
        this.isUpdateUI = true;
        this.currentTime = data;
        this.timeCount = this.currentTime;
        this.labelTime.node.active = true;
        this.comingImage.progress = 1;
    }


}


