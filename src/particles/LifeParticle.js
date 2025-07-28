// src/particles/LifeParticle.js
import { BaseParticle } from './BaseParticle.js';
import { random } from '../utils.js';

const INITIAL_HP = 1000;
const MAX_HP = 1250;
const HP_DECAY_RATE = 2;
const HP_REGEN_RATE = 2;
const OFF_SCREEN_HP_DECAY = 50;
const MIN_RADIUS = 2;
const MAX_RADIUS = 7;


export class LifeParticle extends BaseParticle {
    constructor(x, y, hp = INITIAL_HP) {
        super(x, y, undefined, undefined, '255, 255, 255');
        this.hp = hp;
        this.maxHp = MAX_HP;
        this.isDead = false;
    }

    update(canvasWidth, canvasHeight) {
        // 更新生命值
        if (this.connectionCount === 0 || this.connectionCount >= 3) {
            this.hp -= HP_DECAY_RATE;
        } else {
            this.hp += HP_REGEN_RATE;
        }

        // 检查是否离开屏幕
        if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
            this.hp -= OFF_SCREEN_HP_DECAY;
        }

        this.hp = Math.max(0, Math.min(this.hp, this.maxHp));
        if (this.hp <= 0) {
            this.isDead = true;
            return;
        }

        // 根据生命值更新半径
        const hpRatio = this.hp / INITIAL_HP;
        this.radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.min(1, hpRatio);

        // 应用物理速度
        super.update();
    }
    
    reproduce() {
        if (this.hp >= this.maxHp) {
            const cost = this.maxHp * random(0.33, 0.50);
            this.hp -= cost;
            const newParticle = new LifeParticle(this.x, this.y, cost);
            
            // 给新生粒子一个随机方向的初速度
            const angle = Math.random() * Math.PI * 2;
            newParticle.vx = Math.cos(angle) * 0.05;
            newParticle.vy = Math.sin(angle) * 0.05;
            
            return newParticle;
        }
        return null;
    }

    draw(ctx) {
        const hpRatio = this.hp / INITIAL_HP;
        
        // 绘制光晕
        if (this.hp > INITIAL_HP) {
            const glowStrength = (this.hp - INITIAL_HP) / (this.maxHp - INITIAL_HP);
            const glowRadius = this.radius * (1.5 + glowStrength * 0.5);
            const gradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, glowRadius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * glowStrength})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制本体
        this.color = `rgba(255, 255, 255, ${Math.min(1, hpRatio)})`;
        super.draw(ctx);
    }
}