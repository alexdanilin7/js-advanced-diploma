/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target === Character) {
      throw new Error('Character is abstract class');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    
     for (let i = 1; i < level; i++) {
      this.levelUp();
    }
  }
  levelUp() {
    if (this.health === 0) {
      throw new Error('Нельзя повысить уровень мёртвого персонажа');
    }

    this.level += 1;
    const multiplier = (80 + this.health) / 100;

    this.attack = Math.max(this.attack, Math.floor(this.attack * multiplier));
    this.defence = Math.max(this.defence, Math.floor(this.defence * multiplier));

    this.health = Math.min(100, this.level + 80);
  }
}
