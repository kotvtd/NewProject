import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
    @property({
        type: Node,
        visible: true,
    }) playerPos: Node = null;

    @property({
        type: Prefab,
        visible: true
    }) prefab: Prefab = null;

    private player: Node = null;
    
    protected onLoad(): void {
        
    }

    protected onEnable(): void {
        this.player = instantiate(this.prefab);
        console.log(this.player);
        console.log(this.playerPos);
        console.log(this.prefab);
        this.player.setParent(this.node);
        this.player.setPosition(this.playerPos.position);
    }

    protected onDisable(): void {
        this.player.destroy();
    }
}

