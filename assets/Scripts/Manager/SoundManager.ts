import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import EmitterManager from './EmitterManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    private static instance: SoundManager;
    private isBGMOn: boolean = true;
    private isSFXOn: boolean = true;

    private emitter = EmitterManager.getInstance();

    public static get inst(): SoundManager {
        return this.instance;
    }
    @property(AudioSource)
    bgm: AudioSource = null;
    
    @property(AudioSource)
    sfx: AudioSource = null;

    @property(AudioClip)
    public click: AudioClip = null;
    
    
    protected onLoad(): void {
        SoundManager.instance = this;
        if (SoundManager.instance) {
            this.node.destroy(); 
            return;
        }
        director.addPersistRootNode(this.node);
    }
    
    protected onEnable(): void {
        this.emitter.registerEvent("TOGGLE_BGM", this.toggleBGM, this);
        this.emitter.registerEvent("TOGGLE_SFX", this.toggleSFX, this);
    }
    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }

    playBGM(clip: AudioClip) {
        this.bgm.clip = clip;
        this.bgm.loop = true;
        this.bgm.play();
    }

    playSFX(clip: AudioClip) {
        if (!this.isSFXOn || !clip) return;
        if (!this.sfx) {
            console.error("SFX AudioSource is null!");
            return;
        }
        this.sfx.playOneShot(clip);
    }

    toggleBGM(isOn: boolean) {
        this.isBGMOn = isOn;
        if (isOn) {
            this.bgm.volume = 1;
        } else {
            this.bgm.volume = 0;
        }
    }

    toggleSFX(isOn: boolean) {
        this.isSFXOn = isOn;
        if (isOn) {
            this.sfx.volume = 1;
        } else {
            this.sfx.volume = 0;
        }
    }

    playClick(){
        this.playSFX(this.click);
    }
}


