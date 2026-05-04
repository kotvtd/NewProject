import { _decorator, Component, EventTouch, Node } from 'cc';
const { ccclass, property } = _decorator;
import EmitterManager from '../Manager/EmitterManager';
import { PlayState } from '../State';

@ccclass('BlockManager')
export class BlockManager extends Component {

    @property([Node])
    public listBlock: Node[] = [];
    private emitter = EmitterManager.getInstance();

    private mapHero_Frame: Map<Node, Node> = new Map();
    private state: PlayState = PlayState.JOIN;

    protected onEnable(): void {
        this.emitter.registerEvent("ON_PUT_HERO", this.onPutHero, this);
        this.emitter.registerEvent("ON_CHOOSE_HERO", this.onChooseHero, this);
        this.emitter.registerEvent("HERO_DIE", this.onHeroDie, this);
        this.listBlock.forEach(block => {
            block.on(Node.EventType.TOUCH_END, this.onClickBlock, this);
        });
        this.emitter.registerEvent("RESET_GAME", this.reset, this);

    }

    protected onLoad(): void {
        this.listBlock = this.node.children;
    }

    protected start(): void {
        this.listBlock.forEach(block => {
            block.active = false;
        })
    }


    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
        this.listBlock.forEach(block => {
            block.off(Node.EventType.TOUCH_END, this.onClickBlock, this);
        });
        this.reset();
    }


    onClickBlock(event: EventTouch): void {
        const frame = event.currentTarget as Node;
        this.emitter.emit("CLICK", frame);
    }


    onPutHero(data):void {
        const frame: Node = data.frame as Node;
        const hero: Node = data.hero as Node;
        this.mapHero_Frame.set(hero, frame);

        this.listBlock.forEach(block => {
            block.active = false;
        })
        this.emitter.emit("END_PUT_HERO");

    }

    onChooseHero(){
        const blockMap = new Set(this.mapHero_Frame.values());
        this.listBlock.forEach(frame => {
            frame.active = !blockMap.has(frame);
        });
    }

    onHeroDie(data) {
        const hero: Node = data as Node;
        if(!this.mapHero_Frame.has(hero)) {
            return;
        }
        this.mapHero_Frame.delete(hero);
    }

    reset() {
        this.mapHero_Frame.forEach((frame, hero) => {
            if(hero && hero.isValid){
                hero.destroy();
            }
            if(frame && frame.isValid){
                frame.active = false;
            }
        });
        this.mapHero_Frame.clear();
    }


}


