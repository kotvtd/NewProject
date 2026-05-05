import { _decorator, Component, director, Label, Node, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;
import { SCENE } from './Constant';

@ccclass('Loadding')
export class Loadding extends Component {

    @property(Label)
    label: Label | null = null;

    @property(Node)
    rotate: Node | null =null;

    start() {
        tween(this.rotate).repeatForever(
            tween().by(0.5, { angle: -180})
        ).start();
        this.loadiing();

    }


    private loadiing(){
        this.scheduleOnce(() => {
            director.preloadScene(SCENE.GAMESCENE,
                (completedCount, totalCount) => {
                    const progress = completedCount / totalCount;
                    this.updateProgress(progress);
                }, () => {
                    this.scheduleOnce(() => {
                        director.loadScene(SCENE.GAMESCENE);
                    }, 1.5);
                })
        }, 0.5);
    }

    protected onDisable(): void {
        Tween.stopAllByTarget(this.rotate);
    }

    private updateProgress(progress: number){
        if(this.label) {
            this.label.string = Math.floor(progress * 100) + "%"
        }
    }
}

