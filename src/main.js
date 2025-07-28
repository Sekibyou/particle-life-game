// src/main.js
import { LifeParticle } from './particles/LifeParticle.js';
import { MouseParticle } from './particles/MouseParticle.js';
import { random } from './utils.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouseParticle = new MouseParticle(-200, -200);
const mouse = { x: undefined, y: undefined };

// 初始化粒子
function init() {
    for (let i = 0; i < 50; i++) {
        const x = random(0, canvas.width);
        const y = random(0, canvas.height);
        particles.push(new LifeParticle(x, y));
    }
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allParticles = [...particles, mouseParticle];

    // 1. 重置连接数
    allParticles.forEach(p => p.connectionCount = 0);

    // 2. 计算交互和绘制连线
    for (let i = 0; i < allParticles.length; i++) {
        for (let j = i + 1; j < allParticles.length; j++) {
            const p1 = allParticles[i];
            const p2 = allParticles[j];
            
            // 应用物理作用力
            p1.interact(p2);
            p2.interact(p1);

            // 检查距离并绘制连线
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                 p1.drawLine(ctx, p2);
                 p1.connectionCount++;
                 p2.connectionCount++;
            }
        }
    }
    
    // 3. 更新和绘制粒子
    const newBornParticles = [];
    
    // 更新生命粒子
    particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
        const newParticle = p.reproduce();
        if (newParticle) {
            newBornParticles.push(newParticle);
        }
    });
    
    // 更新鼠标粒子
    mouseParticle.update(mouse.x, mouse.y);
    mouseParticle.draw(ctx);

    // 4. 清理死亡粒子并添加新生粒子
    particles = particles.filter(p => !p.isDead);
    particles.push(...newBornParticles);
    
    requestAnimationFrame(animate);
}


// --- 事件监听 ---
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

canvas.addEventListener('click', (event) => {
    const count = Math.floor(random(2, 6)); // 随机创建2~5个
    for (let i = 0; i < count; i++) {
        particles.push(new LifeParticle(event.clientX + random(-10, 10), event.clientY + random(-10, 10)));
    }
});

// --- 启动 ---
init();
animate();