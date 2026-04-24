import { _decorator, CCInteger, Component, Node, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    @property({
        type: CCInteger
    })
    public speed: number = 100;

    @property({
        type: CCInteger
    })
    public dame: number = 100;
    

    start() {

    }


    protected update(dt: number): void {
        let pos = this.node.position.clone();
        pos.x -= this.speed * dt;
        this.node.position = pos;
    }

}

