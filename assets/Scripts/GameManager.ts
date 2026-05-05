import { _decorator, Component, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property, type } = _decorator;
import { NODE_CONST } from './Constant';
import EmitterManager from './EmitterManager';

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager;
    public isPause: boolean = false;
    public isEndGame: boolean = false;

    static get instance() {
        return this._instance;
    }

    @property([Node])
        children: Node[] = [];

    public lobby: Node = null;
    public room: Node = null;
    private emitter: any = EmitterManager.getInstance();


    // xử lí timeEnemy
    private isJoinRoom: boolean = false;
    private enemyTime: number = 5;
    private bossTime: number = 5;

    private isBossComing = false;
    private isEnemyComing = true;


    private currentTime: number = 0;
    private timeCount: number = 0;


    protected onLoad(): void {
        GameManager._instance = this;
        PhysicsSystem2D.instance.enable = true;
    }

    protected onEnable(): void {
        this.emitter.registerEvent("START", this.onStart, this);
        this.emitter.registerEvent("QUIT_ROOM", this.onQuitRoom, this);
        this.emitter.registerEvent("RESET_ROOM", this.resetRoom, this)
        this.emitter.registerEvent("PAUSE", this.pause, this);
        this.emitter.registerEvent("RESUME", this.resume, this);
        this.emitter.registerEvent("JOIN_ROOM", this.joinRoom, this);
        this.emitter.registerEvent("END_ENEMY_WAY", this.onBossPhase, this);
    }
    
    protected start(): void {
        this.init();
        this.lobby = this.children.find(child => child.name == NODE_CONST.LOBBY);
        this.room = this.children.find(child => child.name == NODE_CONST.ROOM);
        this.room.active = false;
    }

    protected update(dt: number): void {
        if(this.isPause) {
            return;
        }
        if(!this.isJoinRoom) {
            return;
        }
        this.timeCount -= dt;
        if(this.timeCount <= 0){
            if(this.isEnemyComing ) {
                this.emitter.emit("ENEMY_COMING");
                this.isEnemyComing = false;
                this.isBossComing = false;
            } else if(this.isBossComing) {
                this.emitter.emit("BOSS_COMING", this.bossTime);
                this.isBossComing = false;
            }
        }

        
    }

    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }

    
    private enemyPhase() {
        this.isEnemyComing = true;
        this.isBossComing = false;
        this.currentTime = this.enemyTime;
        this.timeCount = this.currentTime;
        console.log("EnemyPhase");
        
        this.emitter.emit("START_ENEMY_WAY", this.enemyTime);
    }
    
    private onBossPhase() {
        this.isEnemyComing = false;
        this.isBossComing = true;
        this.currentTime = this.bossTime;
        this.timeCount = this.currentTime;
        console.log("BossPhase");

        this.emitter.emit("START_BOSS_WAY", this.bossTime);
    }
    
    private joinRoom() {
        this.isJoinRoom = true;
    }
    
    private resetRoom() {
        this.isEndGame = false;
        this.enemyTime = 5;
        this.bossTime = 5;
        this.enemyPhase();
    }
    
    private init(): void{
        this.children = this.node.children;
    }

    public setMode(mode: string): void{
        if(mode ===  NODE_CONST.ROOM) {
            this.lobby.active = false;
            this.isJoinRoom = true;
            this.room.active = true;
            this.resetRoom();
        } else if(mode === NODE_CONST.LOBBY) {
            this.room.active = false;
            this.lobby.active = true;
            this.isJoinRoom = false;
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

    endGame(){
        this.isEndGame = true;
    }

    resume() {
        this.isPause = false;
    }
}

