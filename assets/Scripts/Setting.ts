import { _decorator, Component, Node, Toggle } from 'cc';
import EmitterManager from './EmitterManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;


@ccclass('Setting')
export class Setting extends Component {
    private emitter = EmitterManager.getInstance();
    private sound: SoundManager | null = null;

    @property(Toggle)
    bgm: Toggle = null;

    @property(Toggle)
    sfx: Toggle = null;
    
    protected start(): void {
        this.sound = SoundManager.inst;
    }
    onQuit() {
        this.sound.playClick();
        this.emitter.emit("ON_QUIT_ROOM");
    }

    onResume() {
        this.sound.playClick();
        this.emitter.emit("ON_RESUME_ROOM");
    }

    onSettingRoom() {
        this.sound.playClick();
        this.emitter.emit("ON_SETTING_ROOM", true)
    }

    onBGM(event: Toggle) {
        this.sound.playClick();
        this.emitter.emit("TOGGLE_BGM", event.isChecked);
    }

    onSFX(event: Toggle) {
        this.sound.playClick();
        this.emitter.emit("TOGGLE_SFX", event.isChecked);
    }

    onSettingLooby() {
        this.sound.playClick();
        this.emitter.emit("ON_SETTING_LOBBY", true);
    }

    onQuitLobby() {
        this.sound.playClick();
        this.emitter.emit("ON_QUIT_LOBBY");
    }

    onQuitGame() {
        this.sound.playClick();
        this.emitter.emit("ON_QUIT_GAME");
    }

    onReplay() {
        this.sound.playClick();
        console.log("Replay"); 
        this.emitter.emit("RESET_ROOM");
    }

}


