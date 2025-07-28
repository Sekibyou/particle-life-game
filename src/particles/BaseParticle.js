// src/particles/BaseParticle.js

import * as worldConfig from '../world.js';
import { random } from '../utils.js';

export class BaseParticle {
    constructor(x, y, radius = 5, color = 'rgba(255, 255, 255, 1)', lineColor = '255, 255, 255') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lineColor = lineColor;
        this.connectionCount = 0;
        
        this.vx = random(-0.15, 0.15);
        this.vy = random(-0.15, 0.15);
        
        this.mass = random(6, 8); 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    interact(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distanceSq = dx * dx + dy * dy; 

        // 避免距离为0或超出连接范围时进行计算
        if (distanceSq === 0 || distanceSq > worldConfig.CONNECT_DISTANCE * worldConfig.CONNECT_DISTANCE) {
            return;
        }
        
        const distance = Math.sqrt(distanceSq);

        // 当距离小于排斥距离时，计算斥力
        if (distance < worldConfig.REPULSION_DISTANCE) {
            // 斥力大小与距离成反比
            const force = worldConfig.REPULSION_STRENGTH / distance;
            // 根据 F=ma, 加速度 a = F/m。质量越大，加速度越小。
            const acceleration = force / this.mass;
            
            this.vx -= acceleration * (dx / distance);
            this.vy -= acceleration * (dy / distance);
        } 
        // 否则，在连接范围内计算引力
        else {
            // 模拟万有引力 F = G * (m1 * m2) / r^2
            const force = (worldConfig.GRAVITATIONAL_CONSTANT * this.mass * other.mass) / distanceSq;
            // 根据 F=ma, 加速度 a = F/m
            const acceleration = force / this.mass;

            this.vx += acceleration * (dx / distance);
            this.vy += acceleration * (dy / distance);
        }
    }

    drawLine(ctx, other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > worldConfig.CONNECT_DISTANCE) return;

        let alpha = 0;
        if (distance < worldConfig.FULL_OPACITY_DISTANCE) {
            alpha = 1;
        } else {
            alpha = 1 - (distance - worldConfig.FULL_OPACITY_DISTANCE) / (worldConfig.CONNECT_DISTANCE - worldConfig.FULL_OPACITY_DISTANCE);
        }

        const MOUSE_LINE_COLOR_RGB = '100, 180, 255';
        const finalLineColor = (this.lineColor === MOUSE_LINE_COLOR_RGB || other.lineColor === MOUSE_LINE_COLOR_RGB)
            ? MOUSE_LINE_COLOR_RGB
            : this.lineColor;
            
        ctx.strokeStyle = `rgba(${finalLineColor}, ${Math.max(0, Math.min(1, alpha))})`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}