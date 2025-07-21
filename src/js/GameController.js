import themes from './themes';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions([]); 
    
    // Генерация команд
    const playerTeam = generateTeam([Bowman, Swordsman, Magician], 1, 2);
    const enemyTeam = generateTeam([Vampire, Undead, Daemon], 1, 2);

    // Расстановка
    const playerPositions = [0, 1, 8, 9];
    const enemyPositions = [54, 55, 62, 63];

    this.positionedCharacters = [];

    let index = 0;
    for (const char of playerTeam) {
      this.positionedCharacters.push(new PositionedCharacter(char, playerPositions[index]));
      index += 1;
    }

    index = 0;
    for (const char of enemyTeam) {
      this.positionedCharacters.push(new PositionedCharacter(char, enemyPositions[index]));
      index += 1;
    }

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
