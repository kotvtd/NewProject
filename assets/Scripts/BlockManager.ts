import { _decorator, Component, EventTouch, Node } from 'cc';
const { ccclass, property } = _decorator;
import EmitterManager from './EmitterManager';

@ccclass('BlockManager')
export class BlockManager extends Component {

    @property([Node])
    public listBlock: Node[] = [];
    private emitter = EmitterManager.getInstance();

    private mapHero_Frame: Map<Node, Node> = new Map();

    protected onEnable(): void {
        this.emitter.registerEvent("ON_PUT_HERO", this.onPutHero, this);
    }

    protected onLoad(): void {
        this.listBlock = this.node.children;
        this.listBlock.forEach(block => {
            block.on(Node.EventType.TOUCH_END, this.onClickBlock, this);
        })
    }


    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
    }


    onClickBlock(event: EventTouch): void {
        const frame = event.currentTarget as Node;
        this.emitter.emit("CLICK", frame);
    }


    onPutHero(data):void {
        const frame: Node = data.frame as Node;
        const hero: Node = data.hero as Node;
        this.mapHero_Frame.set(hero, frame);
        frame.off(Node.EventType.TOUCH_END, this.onClickBlock, this);

    }
}

