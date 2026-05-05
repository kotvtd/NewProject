import { _decorator, Component, instantiate, Node, Prefab, ProgressBar, tween, Tween } from 'cc';
import { BulletController } from './BulletController';
import EmitterManager from './EmitterManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;


@ccclass('HeroController')
export class HeroController extends Component {
    private emitter = EmitterManager.getInstance();

    private bulletLayer: Node | null = null;

    @property({
        type: Prefab,
        visible: true
    })
    bullet: Prefab | null = null;

    @property({
        type: Node,
        visible: true
    })
    bulletPoint: Node | null = null

    private isShoot: boolean = false;
    @property
    private dame: number = 0;
    @property
    private countDown: number = 0;
    @property
    private timer: number = 0;
    @property
    private speed: number = 0;

    @property
    hp: number = 100;

    private currentHp: number = 0;

    @property({
        type: ProgressBar,
        visible: true
        })
    hpBar: ProgressBar | null = null;

    private hpTween: Tween<any> | null = null;

    protected onLoad(): void {
        this.currentHp = this.hp;
        this.hpBar.progress = this. currentHp / this.hp;
    }

    protected update(dt: number): void {
        if(GameManager.instance.isPause) {
            return;
        }
        if(!this.isShoot) {
            return;
        }
        this.timer -= dt;
        if(this.timer <= 0){
            this.shoot();
            this.timer = this.countDown;
        }
    }
    
    protected onDestroy(): void {
        this.emitter.emit("HERO_DIE", this.node);
    }

    shoot(){
        if(!this.bullet){
            return;
        }
        const bullet = instantiate(this.bullet);
        const bulletControl = bullet.getComponent(BulletController);
        bulletControl.init(this.dame, this.speed);
        bullet.setParent(this.bulletLayer);
        bullet.setWorldPosition(this.bulletPoint.worldPosition);
    }

    public detectEnemy(check) {
        this.isShoot = check;
    }

    public tackDame(dame: number){
        this.currentHp -= dame;
        this.updateHPBar();
        if(this.currentHp <= 0){
            this.die();
        }
    }

    updateHPBar(){
        let value = this.currentHp/this.hp;
        this.hpTween?.stop();
        this.hpTween = tween(this.hpBar).to(0.3, { progress: value }).start();
    }

    private die(){
        this.hpTween?.stop();
        this.node.destroy();
    }


    public setBulletLayer(node: Node) {
        this.bulletLayer = node;
    }

}


