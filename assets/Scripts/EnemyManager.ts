import { _decorator, Component, instantiate, Node, Prefab, ProgressBar, pseudoRandom } from 'cc';
import EmitterManager from './EmitterManager';
import { LANES } from './Constant';
import { EnemyController } from './EnemyController';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;



@ccclass('EnemyManager')
export class EnemyManager extends Component {
    private emitter: EmitterManager = EmitterManager.getInstance();
    private enemyTime: number = 5;
    private timer: number = this.enemyTime;
    private enemyCount = 0;
    private arrEnemyLane: number[] = [0,0,0,0];

    @property([Node])
    spawnPoints: Node[] = [];

    @property([Prefab])
    prefabs: Prefab[] = [];

    @property({
        type: Node
    })
    enemyLayer: Node = null;

    
    @property({
        type: Prefab
    })
    boss: Prefab = null; 
    
    private listEnemy: Node[] = [];
    private isComming: boolean = false;

    protected onLoad(): void {
        this.spawnPoints = this.node.children;
    }

    reset() {
        this.arrEnemyLane = [0,0,0,0];
        this.enemyCount = 0;
        this.isComming = false;

    }
    
    protected onEnable(): void {
        this.emitter.registerEvent("ENEMY_COMMING", this.onEnemyComing, this);
        this.emitter.registerEvent("ON_COLLISION_ENEMY_BULLET", this.enemyTackDame, this);
        this.emitter.registerEvent("ENEMY_DIE", this.onEnemyDie, this);
    }

    protected update(dt: number): void {
        if(GameManager.instance.isPause) {
            return;
        }
        if(!this.isComming) {
            return;
        }
        this.timer -= dt;
        if(this.timer <= 0){
            this.timer = this.enemyTime;
            if(this.enemyCount >= 5) {
                this.spawnEnemy(this.boss);
                this.isComming = false;
            }
            else {
                this.spawnEnemy(null);
            }
        }

    }

    private spawnEnemy(prefab: Prefab): void{
        console.log(prefab);
        let enemyTemp: Prefab | null = null;
        if(prefab){
            enemyTemp = prefab;
        } else {
            let indexPrefab: number = this.randomRange(this.prefabs.length);
            enemyTemp = this.prefabs[indexPrefab];
        }
        let indexSpawn: number = this.randomRange(this.spawnPoints.length);
        let spawnPoint: Node = this.spawnPoints[indexSpawn];
        let enemy = instantiate(enemyTemp);
        let laneE = this.getLane(spawnPoint.position.y);
        this.arrEnemyLane[laneE] += 1;
        const dataE = {
            lane: laneE
        }
        enemy.getComponent(EnemyController).init(dataE);
        this.listEnemy.push(enemy);
        enemy.setParent(this.enemyLayer);
        enemy.setWorldPosition(spawnPoint.worldPosition);
        this.emitter.emit("ENEMY_SPAWN", spawnPoint);
        this.enemyCount +=1;
    }


    protected onDisable(): void {
        for(let enemy of this.listEnemy){
            if(enemy){
                enemy.destroy();
            }
        }
        this.listEnemy.length = 0;
        this.emitter.removeAllEvents(this);
        this.reset();
    }

    private randomRange(max): number{
        return Math.floor(Math.random() * max);
    }

    private onEnemyComing(){
        this.isComming = true;
        this.spawnEnemy(null);
    }


    private enemyTackDame(data){
        console.log(data);
    }

    onEnemyDie(data: any) {
        this.arrEnemyLane[data] -= 1;
        if(this.arrEnemyLane[data] <= 0)
        {
            this.emitter.emit("CLEAR_ENEMY", data);
        }
    }

    getLane(posY: number): number{
        if(posY > 0){
            return LANES.LANE_1;
        } else if(posY > -100) {
            return LANES.LANE_2;
        } else if(posY > -200) {
            return LANES.LANE_3
        }
        return LANES.LAND_4;
    }

}


