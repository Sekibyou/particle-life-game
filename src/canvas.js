// src/canvas.js
import { LifeParticle } from './particles/LifeParticle.js';
import { MouseParticle } from './particles/MouseParticle.js';
import { random } from './utils.js';

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseParticle;
let mouse = { x: undefined, y: undefined };

// 初始化画布
function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particles = [];
  mouseParticle = new MouseParticle(canvas.width / 2, canvas.height / 2);
  // 不将鼠标粒子放入主数组，单独处理以避免物理计算
  
  // 监听事件
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  
  window.addEventListener('mouseout', () => {
    mouse.x = -200; // 移出屏幕时将鼠标粒子放到看不见的地方
    mouse.y = -200;
  });

  canvas.addEventListener('click', (event) => {
    const count = Math.floor(random(2, 6)); // 随机创建2~5个
    for (let i = 0; i < count; i++) {
        particles.push(new LifeParticle(event.clientX, event.clientY));
    }
  });
}

// 动画循环
function animate() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. 重置所有粒子的连线计数
  particles.forEach(p => p.connectionCount = 0);
  // 鼠标粒子也需要重置，因为它也参与连线
  mouseParticle.connectionCount = 0;
  
  // 将所有需要计算的粒子（生命粒子+鼠标粒子）放在一个临时数组中
  const allParticles = [...particles, mouseParticle];
  
  // 2. 计算相互作用和绘制连线
  for (let i = 0; i < allParticles.length; i++) {
    for (let j = i + 1; j < allParticles.length; j++) {
      const p1 = allParticles[i];
      const p2 = allParticles[j];
      
      // 计算距离用于判断是否连线
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 应用物理作用力 (鼠标粒子不主动受力，但会对其他粒子施力)
      p1.interact(p2);
      p2.interact(p1);

      // 绘制连线并更新连线数
      if (distance < 100) {
          p1.drawLine(ctx, p2);
          // MouseParticle 不会繁殖，但需要连线数来影响其他粒子
          p1.connectionCount++;
          p2.connectionCount++;
      }
    }
  }

  // 3. 更新和绘制鼠标粒子
  mouseParticle.update(mouse.x, mouse.y);
  mouseParticle.draw(ctx);
  
  // 4. 更新和绘制生命粒子
  const newBornParticles = [];
  particles.forEach(p => {
    p.update(canvas.width, canvas.height);
    p.draw(ctx);
    
    // 检查繁殖
    const newParticle = p.reproduce();
    if (newParticle) {
      newBornParticles.push(newParticle);
    }
  });
  
  // 5. 移除死亡粒子，添加新生粒子
  particles = particles.filter(p => !p.isDead);
  particles.push(...newBornParticles);

  requestAnimationFrame(animate);
}

// 导出启动函数
export function start() {
  setupCanvas();
  animate();
}