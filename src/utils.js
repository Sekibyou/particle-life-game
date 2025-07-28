// src/utils.js

/**
 * 生成一个在 [min, max] 范围内的随机数
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function random(min, max) {
  return Math.random() * (max - min) + min;
}