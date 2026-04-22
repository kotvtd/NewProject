import { _decorator, Component, Node } from 'cc';
const { ccclass, property, type } = _decorator;
import { NODE_CONST } from './Constant';

@ccclass('GameManager')
export class GameManager extends Component {

    @property([Node])
        children: Node[] = [];

    public lobby: Node = null;
    public room: Node = null;


    protected onLoad(): void {
        this.init();
    }

    protected start(): void {
        this.lobby = this.children.find(child => child.name == NODE_CONST.LOOBY);
        this.room = this.children.find(child => child.name == NODE_CONST.ROOM);
        console.log(this.lobby);
        console.log(this.room);
    }

    protected update(dt: number): void {
        
    }

    private init(): void{
        this.children = this.node.children;
    }

    public setMode(event: any, mode: string): void{
        if(mode ===  "room") {
            this.room.active = true;
            this.lobby.active = false;
        } else if(mode === "lobby") {
            this.room.active = false;
            this.lobby.active = true;
        }
    }

}

