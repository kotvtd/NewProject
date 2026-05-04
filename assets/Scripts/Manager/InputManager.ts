import { _decorator, Component, Node, EventKeyboard, KeyCode, input, Input } from 'cc';
import EmitterManager from './EmitterManager';
const { ccclass, property } = _decorator;
import { DIRECTION_CONST } from './Constant';

@ccclass('InputManager')
export class InputManager extends Component {

    protected onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private emitter: any = EmitterManager.getInstance();

    private moveMap = {
        [KeyCode.ARROW_UP]: DIRECTION_CONST.UP,
        [KeyCode.ARROW_DOWN]: DIRECTION_CONST.DOWN,
        [KeyCode.ARROW_LEFT]: DIRECTION_CONST.LEFT,
        [KeyCode.ARROW_RIGHT]: DIRECTION_CONST.RIGHT,
    }

    private onKeyUp(event: EventKeyboard): void{
        const direct = this.moveMap[event.keyCode];
        if(direct) {
            this.onMove({
                direction: direct,
                isMove: false,
            })
        }
    }

    private onMove(data: any): void {
        this.emitter.emit("ON_MOVE", data);
    }

    private onKeyDown(event: EventKeyboard): void{
        const direct = this.moveMap[event.keyCode];
        if(direct) {
            this.onMove({
                direction: direct,
                isMove: true,
            })
        }
    }
}

