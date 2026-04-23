import { _decorator, Component, Node, Button, EventHandler, MaskComponent} from 'cc';
const { ccclass, property } = _decorator;
import { BUTTON_CONST } from './Constant';

import EmitterManager from './EmitterManager';

@ccclass('ButtonManager')
export class ButtonManager extends Component {

    @property([Node])
        children: Node[] = [];

    private mapHandler: Map<Button, EventHandler[]> = new Map();
    private buttons: Button[] = [];
    private emitter: any = EmitterManager.getInstance();


    protected onLoad(): void {
        this.init();
    }

    protected start(): void {
    }

    protected onEnable(): void {
        this.buttons.forEach(button => {
            this.createHandler(button, button.node.name);
        })
    }
    
    protected update(dt: number): void {
        
    }
    
    protected onDisable(): void {
        this.buttons.forEach(button => {
            const handler = this.mapHandler.get(button);
            if(!handler) {
                return;
            }
            button.clickEvents = button.clickEvents.filter(event => handler.indexOf(event) === -1);
        })
        this.mapHandler.clear();
    }
    
    private init(): void {
        this.children = this.node.children;
        this.buttons = this.children
            .map(child => child.getComponent(Button))
            .filter(btn => btn !== null);
    }

    public callback( event: Event, customEventData: string): void {
        const node = event.target as unknown as Node;
        switch(customEventData) {
            case BUTTON_CONST.START:
                this.emitter.emit("START");
                break;
        }

    }

    private createHandler(button: Button, customEvent: string) {
        const click = new EventHandler();
        click.target = this.node;
        click.component = "ButtonManager";
        click.handler = "callback"
        click.customEventData = customEvent;
        button.clickEvents.push(click);

        if(!this.mapHandler.has(button)) {
            this.mapHandler.set(button, []);
        }
        this.mapHandler.get(button).push(click);
    }


}

