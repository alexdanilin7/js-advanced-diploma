
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

const characterClasses = {
  bowman: Bowman,
  swordsman: Swordsman,
  magician: Magician,
  vampire: Vampire,
  undead: Undead,
  daemon: Daemon,
};

export default class GameState {
  constructor() {
    this.currentPlayerTurn = true;
    this.selectedCharacter = null;
    this.positionedCharacters = [];
    this.currentLevel = 1;
    this.scores = 0;
    this.maxScores = 0;
  }

  static from(object) {
    if (!object) {
      return new GameState(); 
    }

    const state = new GameState();
    state.currentPlayerTurn = object.currentPlayerTurn ?? true;
    state.selectedCharacter = object.selectedCharacter ?? null;
    state.currentLevel = object.currentLevel || 1;
    state.scores = object.scores || 0;
    state.maxScores = object.maxScores || 0;

    if (Array.isArray(object.positionedCharacters)) {
      state.positionedCharacters = object.positionedCharacters.map(pc => {
        const CharClass = characterClasses[pc.character.type];
        if (!CharClass) {
          console.warn(`Неизвестный тип персонажа: ${pc.character.type}`);
          return null;
        }
        const restoredChar = new CharClass(pc.character.level);
        restoredChar.health = pc.character.health;
        restoredChar.attack = pc.character.attack;
        restoredChar.defence = pc.character.defence;
        return new PositionedCharacter(restoredChar, pc.position);
      }).filter(Boolean); // убираем null
    } else {
      state.positionedCharacters = []; 
    }

    return state;
  }
}