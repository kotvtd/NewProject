import { _decorator, Component, Enum, instantiate, log, Node, Prefab, ProgressBar, pseudoRandom } from 'cc';
import EmitterManager from './EmitterManager';
import { LANES } from './Constant';
import { EnemyController } from './EnemyController';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;
import { EnemySpawnState } from './State';



@ccclass('EnemyManager')
export class EnemyManager extends Component {
    private emitter: EmitterManager = EmitterManager.getInstance();
    private enemyTime: number = 2;
    private bossTimeInit = 3;
    private timer: number = this.enemyTime;
    private enemyQuantity: number = 15;
    private enemyCount = 0;
    private bossCount = 0;
    private aLiveEnemy: number = 0;
    private bossMax: number = 2;
    private bossKilled: number = 0;
    private arrEnemyLane: number[] = [0,0,0,0];

    private state: EnemySpawnState = EnemySpawnState.IDLE;

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

    protected onLoad(): void {
        this.spawnPoints = this.node.children;
    }

    reset() {
        this.arrEnemyLane = [0,0,0,0];

        this.enemyCount = 0;
        this.bossCount = 0;
        this.aLiveEnemy = 0;
        this.enemyQuantity = 30;

        this.bossMax = 3;
        this.bossKilled = 0;

        this.timer = this.enemyTime;

        this.state = EnemySpawnState.IDLE;

        this.listEnemy.forEach(enemy => {
            if(enemy && enemy.isValid){
                enemy.destroy();
            }
        });
        this.listEnemy.length = 0;
    }
    
    protected onEnable(): void {
        this.emitter.registerEvent("ENEMY_COMING", this.onEnemyComing, this);
        this.emitter.registerEvent("BOSS_COMING", this.onBossComing, this);
        this.emitter.registerEvent("ENEMY_DIE", this.onEnemyDie, this);
        this.emitter.registerEvent("BOSS_DIE", this.onBossDie, this);
        this.emitter.registerEvent("RESET_ROOM", this.reset, this);
        this.state = EnemySpawnState.IDLE;
    }

    protected update(dt: number): void {
        if(GameManager.instance.isPause) {
            return;
        }
        this.timer -= dt;
        switch(this.state) {
            case EnemySpawnState.IDLE:
                break;
            case EnemySpawnState.SPAWNING:
                this.handleSpawning();
                break;
            case EnemySpawnState.WAIT_CLEAR:
                break;
            case EnemySpawnState.BOSS:
                this.handleBoss();
                break;
            case EnemySpawnState.END:
                break;
        }
    }

    private clearEnemy() {
        this.emitter.emit("END_ENEMY_WAY");
    }

    private handleSpawning() {
        if(this.enemyCount < this.enemyQuantity && this.timer <= 0) {
            this.spawnEnemy(null);
            this.aLiveEnemy += 1;
            this.enemyCount += 1;
            this.timer = this.enemyTime;
        }
        if( this.enemyCount >= this.enemyQuantity) {
            this.state = EnemySpawnState.WAIT_CLEAR;
        }
    }

    private handleBoss() {
        if(this.timer <= 0) {
            if(this.bossCount >= this.bossMax) {
                this.state = EnemySpawnState.END;
                return;
            }
            this.spawnEnemy(this.boss);
            this.bossCount ++;
            this.timer = this.bossTimeInit;
        }
    }


    
    private spawnEnemy(prefab: Prefab): void{
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
        this.state = EnemySpawnState.SPAWNING;
        this.timer = 0;
    }
    
    private onBossComing(data){
        this.bossTimeInit = data;
        this.spawnEnemy(this.boss);
        this.bossCount ++;
        this.state = EnemySpawnState.BOSS;
        this.timer = this.bossTimeInit;
    }
    
    
    onEnemyDie(data: any) {
        this.arrEnemyLane[data] -= 1;
        this.aLiveEnemy -= 1;
        this.listEnemy = this.listEnemy.filter(e => e && e.isValid);
        if(this.arrEnemyLane[data] <= 0)
        {
            this.emitter.emit("CLEAR_ENEMY", data);
        }
        if(this.aLiveEnemy <= 0 && this.enemyCount >= this.enemyQuantity) {
            this.clearEnemy();
        }
    }

    onBossDie(data: any) {
        this.arrEnemyLane[data] -= 1;
        this.bossKilled +=1;
        if(this.arrEnemyLane[data] <= 0)
        {
            this.emitter.emit("CLEAR_ENEMY", data);
        }
        if(this.bossKilled >= this.bossMax) {
            console.log("Win")
            this.emitter.emit("WIN", true);
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
        return LANES.LANE_4;
    }

}


