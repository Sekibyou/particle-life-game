// src/particles/MouseParticle.js
import { BaseParticle } from './BaseParticle.js';

export class MouseParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y, 0, 'rgba(100, 180, 255, 1)', '100, 180, 255');
        this.vx = 0;
        this.vy = 0;
        this.mass = 5;
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