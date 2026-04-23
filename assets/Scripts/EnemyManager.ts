import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property([Node])
    spawnPoint: Node[] = [];

     @property([Node])
    prefabs: Node[] = [];
    
    @property({
        type: Node
    })
    boss: Node = null;  

    protected onLoad(): void {
        this.spawnPoint = this.node.children;
    }

    protected start(): void {
        
    }

}


