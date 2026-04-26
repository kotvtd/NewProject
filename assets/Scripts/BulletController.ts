import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import EmitterManager from './EmitterManager';
import { EnemyController } from './EnemyController';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    private dame: number = 0;
    private speed: number = 0;
    private collider: Collider2D | null =null;
    private timeActive = 5;
    private emitter: EmitterManager = EmitterManager.getInstance();
    protected onLoad(): void {
        this.collider = this.node.getComponent(Collider2D);
    }

    protected onEnable(): void {
        if(this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    start() {

    }

    protected update(dt: number): void {
        if(GameManager.instance.isPause) {
            return;
        }
        if(this.timeActive <= 0){
            this.node.destroy();
            return;
        }
        this.timeActive -= dt;
        let pos = this.node.position.clone();
        pos.x += this.speed * dt;
        this.node.setPosition(pos);
    }


    init(dame: number, speed: number){
        this.dame = dame;
        this.speed = speed;
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact |null ){
        const enemyNode = other.node;

        if(other.group === 2 && enemyNode.isValid){
            const enemyControll = enemyNode.getComponent(EnemyController);
            if(enemyControll){
                enemyControll.tackDame(this.dame);
            }
        }
        this.scheduleOnce(() =>{
            if(this.node.isValid){
                this.node.destroy();
            }
        })
    }
}


