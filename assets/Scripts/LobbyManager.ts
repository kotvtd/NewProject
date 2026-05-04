import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LobbyManager')
export class LobbyManager extends Component {

    @property({type:Prefab})
    private player: Prefab = null;

    @property({type:Node})
    private playerPos: Node = null;   
    
    private playerNode: Node = null;

    start() {
    }
    protected onEnable(): void {
    }
    
    update(deltaTime: number) {
        
    }
    
    protected onDisable(): void {
    }
}

