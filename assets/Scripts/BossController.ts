import { _decorator, Component, Node } from 'cc';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;

@ccclass('BossController')
export class BossController extends EnemyController {

    protected die() {
        console.log("Boss die")
        this.emitter.emit("BOSS_DIE", this.lane);
        this.node.destroy();
    }
}

