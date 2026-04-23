import { _decorator, Component, Node } from 'cc';
const { ccclass, property, type } = _decorator;
import { NODE_CONST } from './Constant';
import EmitterManager from './EmitterManager';

@ccclass('GameManager')
export class GameManager extends Component {

    @property([Node])
        children: Node[] = [];

    public lobby: Node = null;
    public room: Node = null;
    private emitter: any = EmitterManager.getInstance();


    protected onLoad(): void {
    }

    protected onEnable(): void {
        this.emitter.registerEvent("START", this.onStart, this);
    }
    
    protected start(): void {
        this.init();
        this.lobby = this.children.find(child => child.name == NODE_CONST.LOOBY);
        this.room = this.children.find(child => child.name == NODE_CONST.ROOM);
        this.room.active = false;
    }

    protected update(dt: number): void {
        
    }

    private init(): void{
        this.children = this.node.children;
    }

    public setMode(mode: string): void{
        if(mode ===  NODE_CONST.ROOM) {
            console.log("room");
            this.room.active = true;
            this.lobby.active = false;
        } else if(mode === NODE_CONST.LOOBY) {
            console.log("Lobby");
            this.room.active = false;
            this.lobby.active = true;
        }
    }

    private onStart(){
        this.setMode(NODE_CONST.ROOM);
    }

}

