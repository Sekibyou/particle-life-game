// src/particles/MouseParticle.js
import { BaseParticle } from './BaseParticle.js';

export class MouseParticle extends BaseParticle {
    constructor(x, y) {
        // **已修改**: 向父类传递蓝色本体颜色和蓝色连线颜色 '100, 180, 255'
        super(x, y, 0, 'rgba(100, 180, 255, 1)', '100, 180, 255');
        this.vx = 0;
        this.vy = 0;
    }

    update(mouseX, mouseY) {
      if (mouseX !== undefined && mouseY !== undefined) {
        this.x = mouseX;
        this.y = mouseY;
      }
    }
    
    interact(other) {
        super.interact(other);
    }
    
    draw(ctx) {
        super.draw(ctx);
    }
}