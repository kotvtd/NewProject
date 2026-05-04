import { _decorator, Component, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property, type } = _decorator;
import { NODE_CONST } from './Constant';
import EmitterManager from './EmitterManager';

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager;
    public isPause: boolean = false;

    static get instance() {
        return this._instance;
    }

    @property([Node])
        children: Node[] = [];

    public lobby: Node = null;
    public room: Node = null;
    private emitter: any = EmitterManager.getInstance();


    protected onLoad(): void {
        GameManager._instance = this;
        PhysicsSystem2D.instance.enable = true;
    }

    protected onEnable(): void {
        this.emitter.registerEvent("START", this.onStart, this);
        this.emitter.registerEvent("QUIT_ROOM", this.onQuitRoom, this);
        this.emitter.registerEvent("PAUSE", this.pause, this);
        this.emitter.registerEvent("RESUME", this.resume, this);

    }
    
    protected start(): void {
        this.init();
        this.lobby = this.children.find(child => child.name == NODE_CONST.LOBBY);
        this.room = this.children.find(child => child.name == NODE_CONST.ROOM);
        this.room.active = false;
    }

    protected update(dt: number): void {
        
    }

    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }

    private init(): void{
        this.children = this.node.children;
    }

    public setMode(mode: string): void{
        if(mode ===  NODE_CONST.ROOM) {
            console.log("room");
            this.room.active = true;
            this.lobby.active = false;
        } else if(mode === NODE_CONST.LOBBY) {
            console.log("Lobby");
            this.room.active = false;
            this.lobby.active = true;
        }
    }

    private onStart(){
        this.setMode(NODE_CONST.ROOM);
    }

    private onQuitRoom() {
        this.setMode(NODE_CONST.LOBBY)
    }

    pause() {
        this.isPause = true;
    }

    resume() {
        this.isPause = false;
    }
}

