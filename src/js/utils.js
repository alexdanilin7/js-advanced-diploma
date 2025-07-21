/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */

import  themes from './themes';

export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;

  // Top row
  if (row === 0) {
    if (col === 0) return 'top-left';
    if (col === boardSize - 1) return 'top-right';
    return 'top';
  }

  // Bottom row
  if (row === boardSize - 1) {
    if (col === 0) return 'bottom-left';
    if (col === boardSize - 1) return 'bottom-right';
    return 'bottom';
  }

  // Middle rows
  if (col === 0) return 'left';
  if (col === boardSize - 1) return 'right';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function characterInfo(strings, ...values) {
  const data = {
    level: values[0],
    attack: values[1],
    defence: values[2],
    health: values[3],
  };

  return `🎖${data.level} ⚔${data.attack} 🛡${data.defence} ❤${data.health}`;
}

export function getAttackRange(character) {
  const { type } = character;

  switch (type) {
    case 'swordsman':
      return 1;
    case 'undead':
      return 1;
    case 'bowman':
      return 2;
    case 'vampire':
      return 2;
    case 'magician':
      return 4;
    case 'daemon':
      return 4;
    default:
      return 0;
  }
}

export function getMoveRange(character) {
  const { type } = character;
  console.log("type", type);
  switch (type) {
    case 'swordsman':
      return 4;
    case 'undead':
      return 4;
    case 'bowman':
      return 2;
    case 'vampire':
      return 2;
    case 'magician':
      return 1;
    case 'daemon':
      return 1;
    default:
      return 0;
  }
}

export function getDistance(from, to, boardSize) {
  const x1 = from % boardSize;
  const y1 = Math.floor(from / boardSize);
  const x2 = to % boardSize;
  const y2 = Math.floor(to / boardSize);

  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export function isPathClear(from, to, boardSize, positionedCharacters) {
  const x1 = from % boardSize;
  const y1 = Math.floor(from / boardSize);
  const x2 = to % boardSize;
  const y2 = Math.floor(to / boardSize);

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) {
    return false;
  }

  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const stepX = dx === 0 ? 0 : dx / steps;
  const stepY = dy === 0 ? 0 : dy / steps;

  for (let i = 1; i < steps; i++) {
    const x = x1 + stepX * i;
    const y = y1 + stepY * i;
    const index = y * boardSize + x;

    if (positionedCharacters.some(p => p.position === index)) {
      return false;
    }
  }

  return true;
}

export function getNextTheme(currentTheme) {
  const themeOrder = [themes.prairie, themes.desert, themes.arctic, themes.mountain];
  const currentIndex = themeOrder.indexOf(currentTheme);
  return currentIndex < themeOrder.length - 1 ? themeOrder[currentIndex + 1] : null;
}

export function isEnemy(character) {
  return ['vampire', 'undead', 'daemon'].includes(character.type);
}

export function isPlayerCharacter(character) {
  return ['bowman', 'swordsman', 'magician'].includes(character.type);
}