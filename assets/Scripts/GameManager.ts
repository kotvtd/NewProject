import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({
        type: Node,
        visible : true,
    })
    lobby = null;
    @property({
        type: Node,
        visible : true,
    })
    room = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

