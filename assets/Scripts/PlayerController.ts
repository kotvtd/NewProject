import { _decorator, CCInteger, Component, Node, Skeleton } from 'cc';
const { ccclass, property } = _decorator;

import EmitterManager from './EmitterManager';
import { DIRECTION_CONST } from './Constant';

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({
        type: CCInteger,
        visible: true
    }) speed = 300;

    // @property({
    //     type: Skeleton,
    //     visible: true
    // }) animation = null;

    private emitter: any = EmitterManager.getInstance();

    protected onEnable(): void {
        this.emitter.registerEvent("ON_MOVE", this.onMove, this);
    }

    private isMove: boolean = false;
    private dirX: number  = 0;
    private dirY:number = 0;




    protected update(dt: number): void {
        if(!this.isMove){
            return;
        }
        
    }

    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
        console.log("remove");
    }

    private onMove(data): void{
        switch(data.direction) {
            case DIRECTION_CONST.UP:
                this.dirY = data.isMove ? 1 : 0;
                break;
            case DIRECTION_CONST.DOWN:
                this.dirY = data.isMove ? -1 : 0;
                break;
            case DIRECTION_CONST.RIGHT:
                this.dirX = data.isMove ? 1: 0;
                break;
            case DIRECTION_CONST.LEFT:
                this.dirX = data.isMove ? -1: 0;
                break;
        }
    }

    private updateMove() {
        
    }
}

