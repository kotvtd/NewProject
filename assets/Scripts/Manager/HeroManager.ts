import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import EmitterManager from '../Manager/EmitterManager';
import { LANES } from '../Constant';
import { HeroController } from '../Controller/HeroController';

@ccclass('HeroManager')
export class HeroManager extends Component {

    @property({
        type: Prefab
    })
    public heroPrefab: Prefab = null;

    private mapHero_Lane: Map< number, Node[]> = new Map();

    private isLaneDetect: boolean[] = [false, false, false, false];
    private enemyPerLane: number[] = [0,0,0,0];
    private emitter = EmitterManager.getInstance();

    protected onEnable(): void {
        this.emitter.registerEvent("CLICK", this.spawnHero, this);
        this.emitter.registerEvent("ON_CHOOSE_HERO", this.onChooseHero, this);
        this.emitter.registerEvent("ENEMY_SPAWN", this.onEnemySpawn, this);
        this.emitter.registerEvent("CLEAR_ENEMY", this.onClearEnemy, this);
        this.emitter.registerEvent("HERO_DIE", this.onHeroDie, this);
    }

    start() {
    }

    reset() {
        this.isLaneDetect = [false, false, false, false];
        this.enemyPerLane = [0,0,0,0];
        this.mapHero_Lane.forEach((heroes) => {
        heroes.forEach(hero => {
            if (hero && hero.isValid) {
                hero.destroy();
            }
            });
        });
        this.mapHero_Lane.clear();
    }
    protected onDisable(): void {
        this.emitter.removeAllEvents(this);
        this.reset();
    }
    spawnHero(data){
        let heroSpawn = instantiate(this.heroPrefab);
        heroSpawn.setParent(this.node);
        data as Node;
        heroSpawn.setWorldPosition(data.worldPosition);
        const lane = this.getLane(data.position.y);
        this.emitter.emit("ON_PUT_HERO", {
            frame: data,
            hero: heroSpawn
        });
        if (!this.mapHero_Lane.has(lane)) {
            this.mapHero_Lane.set(lane, []);
        }
        this.mapHero_Lane.get(lane).push(heroSpawn);
        if(this.isLaneDetect[lane]){
            heroSpawn.getComponent(HeroController).detectEnemy(true);
        }
    }

    onChooseHero(data) {
        this.heroPrefab = data;
    }

    onEnemySpawn(data: any) {
        const laneCheck = this.getLane(data.position.y);
        this.enemyPerLane[laneCheck]++;
        if (this.enemyPerLane[laneCheck] === 1) {
            this.isLaneDetect[laneCheck] = true;
        }
        if(this.enemyPerLane[laneCheck] > 0) {
            const heroes = this.mapHero_Lane.get(laneCheck);
            if(heroes) {
                heroes.forEach(hero => {
                    hero.getComponent(HeroController)?.detectEnemy(true);  
                })
            }
        }
    }

    onClearEnemy(data) {
        const lane = data as number;
        this.enemyPerLane[lane] = 0;
        this.isLaneDetect[data] = false;
        const heroes = this. mapHero_Lane.get(lane);
        if(heroes) {
            heroes.forEach(hero => {
                hero.getComponent(HeroController)?.detectEnemy(false);
            })
        }
    }


    getLane(posY: number): number{
        if(posY > 0){
            return LANES.LANE_1;
        } else if(posY > -100) {
            return LANES.LANE_2;
        } else if(posY > -200) {
            return LANES.LANE_3
        }
        return LANES.LANE_4;
    }

    onHeroDie(data) {
        let hero: Node = data as Node;
        this.mapHero_Lane.forEach((heroes, lane) => {
            const index = heroes.indexOf(hero);
            if(index !== -1) {
                heroes.splice(index, 1);  
            }
            if (heroes.length === 0) {
                this.mapHero_Lane.delete(lane);
            }
        })
    }
}

