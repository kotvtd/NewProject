import { _decorator, Component, game, Node, sys } from 'cc';
import EmitterManager from './EmitterManager';
const { ccclass, property } = _decorator;

@ccclass('PopUpManager')
export class PopUpManager extends Component {

    @property({
        type: Node,
        visible: true
    })
    settingRoom: Node | null = null;

    @property({
        type: Node,
        visible: true
    })
    settingLobby: Node | null = null;

    @property({
        type: Node,
        visible: true
    })
    win: Node | null = null;

    @property({
        type: Node,
        visible: true
    })
    lost: Node | null = null;

    @property({
        type: Node,
        visible: true
    })
    panel: Node | null = null;
    private emitter = EmitterManager.getInstance();
    private timeOut = 3;
    private isEndGame: boolean = false;

    private isWin: boolean = false;
    private isSetting: boolean = false;

    protected onEnable(): void {
        this.emitter.registerEvent("ON_QUIT_ROOM", this.onQuitRoom, this);
        this.emitter.registerEvent("ON_RESUME_ROOM", this.onResume, this);
        this.emitter.registerEvent("ON_SETTING_ROOM", this.onSettingRoom, this);
        this.emitter.registerEvent("ON_SETTING_LOBBY", this.onSettingLobby, this);
        this.emitter.registerEvent("ON_QUIT_LOBBY", this.onQuitLobby, this);
        this.emitter.registerEvent("ON_QUIT_GAME", this.onQuitGame, this);
        this.emitter.registerEvent("LOST", this.onLost, this);
        this.emitter.registerEvent("WIN", this.onWin, this);
        this.emitter.registerEvent("RESET_ROOM", this.resetRoom, this);
    }

    start() {
        
    }

    protected update(dt: number): void {
        if(!this.isEndGame) {
            return;
        }
        this.timeOut -= dt;
        if(this.timeOut <= 0) {
            this.showWin();
            this.isEndGame = false;
        }

    }

    onSettingRoom(data) {
        this.onPauseGame();
        this.panel.active = data;
        this.settingRoom.active = data;
    }

    onSettingLobby(data) {
        this.panel.active = data;
        this.settingLobby.active = data;
    }

    onWin(isSetting: boolean) {
        this.onPauseGame();
        this.isWin = true;
        this.isEndGame = true;
        this.isSetting = isSetting;
    }

    showWin() {
        this.panel.active = this.isSetting;
        this.win.active = this.isSetting;
    }

    onLost(data) {
        this.onPauseGame();
        this.isWin = false;
        this.panel.active = data;
        this.lost.active = data;
    }
    
    onQuitRoom() {
        this.emitter.emit("QUIT_ROOM");
        this.lost.active = false;
        this.win.active = false;
        this.onResume();
    }

    onQuitLobby() {
        this.panel.active = false;
        this.settingLobby.active = false;
    }

    onQuitGame() {
        if (sys.isBrowser) {
            location.reload();
        } else {
            game.end();
        }
    }
    
    onResume() {
        this.onSettingRoom(false);
        this.onResumeGame();
    }


    onPauseGame() {
        this.emitter.emit("PAUSE");
    }

    onResumeGame() {
        this.emitter.emit("RESUME");
    }

    resetRoom() {
        this.lost.active = false;
        this.win.active = false;
        this.onResume();
    }

}


