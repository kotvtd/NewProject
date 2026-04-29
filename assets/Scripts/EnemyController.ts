import { _decorator, CCInteger, Component, Node, Tween, tween, Collider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D,EPhysics2DDrawFlags, ProgressBar, Vec2, Vec3 } from 'cc';
import EmitterManager from './EmitterManager';
import { EnemyState } from './State';
import { HeroController } from './HeroController';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    private collider: Collider2D | null = null;
    protected emitter: EmitterManager = EmitterManager.getInstance();
    lane: number = 0;

    private attackTime: number = 0.8;
    private timer: number = this.attackTime;

    private heroTarget: Node | null = null;

    private state: EnemyState = EnemyState.IDLE;

    private attackTween: Tween<any> = null;
    private isAttack: boolean = false;


    @property({
        type: CCInteger
    })
    public speed: number = 100;

    @property({
        type: CCInteger
    })
    public dame: number = 100;

    private hpTween: Tween<any> | null = null;

    @property
    hp: number = 100;

    @property({
        type: ProgressBar,
        visible: true
    })
    hpBar: ProgressBar | null = null;

    private currentHp = 0;

    private isDetectHero: boolean = false;


    protected onLoad(): void {
        this.currentHp = this.hp;
        this.collider = this.node.getComponent(Collider2D);
        this.hpBar.progress = this.currentHp / this.hp;
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
    }

    protected onEnable(): void {
        if(this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this.state = EnemyState.WALK;
        this.setupTween();
    }
    

    protected update(dt: number): void {
        if(GameManager.instance.isPause) {
            return;
        }
        this.timer -= dt;
        switch(this.state) {
            case EnemyState.IDLE:
                break;
            case EnemyState.WALK:
                this.handleWalk(dt);
                break;
            case EnemyState.ATTACK:
                this.handleAttack();
                break;
        }
    }



    private handleWalk(dt: number): void {
        if(this.isDetectHero && this.heroTarget) {
            this.state = EnemyState.ATTACK;
        }
        let pos = this.node.position.clone();
        pos.x -= this.speed * dt;
        this.node.position = pos;
    }

    private handleAttack() {
        if(this.timer > 0 || this.isAttack) {
            return;
        }
        this.isAttack = true;
        this.attackTween.start();
    }

    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }

    protected onDestroy(): void {
        this.hpTween?.stop();
    }

    private onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null ) {
        if(other.group === 8) {
            this.isDetectHero = true;
            this.heroTarget = other.node;
            this.state = EnemyState.ATTACK;
        }
        if(other.group === 16) {
            this.emitter.emit("LOST",true);
        }
        
    }

    private onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null ) {
        if(other.group === 8) {
            this.isDetectHero = false;
            this.heroTarget = null;
            if(!this.isAttack) {
                this.state = EnemyState.WALK;
            }
        }
        
    }

    public tackDame(dame: number){
        this.currentHp -= dame;
        if(this.currentHp <= 0){
            this.die();
        }
        this.updateProgressBar();
    }

    private updateProgressBar() {
        let value = this.currentHp/this.hp;
        this.hpTween?.stop();
        this.hpTween = tween(this.hpBar).to(0.3, { progress: value }).start();
    }


    protected die(){
        this.attackTween?.stop();
        this.emitter.emit("ENEMY_DIE", this.lane);
        this.node.destroy();
    }
    
    init(data: any) {
        this.lane = data.lane;
    }
    
    attackHero(hero: Node) {
        let heroControl = hero.getComponent(HeroController);
        if(heroControl) {
            heroControl.tackDame(this.dame);
        }
    }

    private setupTween() {
        this.attackTween = tween(this.node)
            .by(0.2, { position : new Vec3(10, 0, 0)})
            .by(0.2, { position : new Vec3(-20, 0, 0)})
            .by(0.2, { position : new Vec3(10, 0, 0)})
            .call(() => {
                this.timer = this.attackTime;
                this.isAttack = false;
                if(this.heroTarget) {
                    this.attackHero(this.heroTarget)
                }
                this.state = this.isDetectHero ? EnemyState.ATTACK : EnemyState.WALK;
        });
    }


}

