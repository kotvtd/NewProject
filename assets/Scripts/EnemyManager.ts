import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property([Node])
    spawnPoints: Node[] = [];

     @property([Prefab])
    prefabs: Prefab[] = [];

    @property({
        type: Node
    })
    enemyLayer: Node = null;

    private listEnemy: Node[] = [];
    
    @property({
        type: Node
    })
    boss: Node = null;  

    protected onLoad(): void {
        this.spawnPoints = this.node.children;
    }
    
    protected start(): void {
        
        
    }
    
    protected onEnable(): void {
        this.spawnEnemy();
    }

    private spawnEnemy(): void{
        let indexPrefab: number = this.randomRange(this.prefabs.length);
        let indexSpawn: number = this.randomRange(this.spawnPoints.length);
        let spawnPoint: Node = this.spawnPoints[indexSpawn];
        let enemy = instantiate(this.prefabs[indexPrefab]);
        this.listEnemy.push(enemy);
        enemy.setParent(this.enemyLayer);
        enemy.setWorldPosition(spawnPoint.worldPosition);

    }


    protected onDisable(): void {
        for(let enemy of this.listEnemy){
            if(enemy){
                enemy.destroy();
            }
        }
        this.listEnemy.length = 0;
    }

    private randomRange(max): number{
        return Math.floor(Math.random() * max);
    }
}


