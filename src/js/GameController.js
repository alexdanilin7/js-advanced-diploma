import themes from './themes';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import {characterInfo} from './utils';
import GameState from './GameState';
import Character from './Character';

import {
  getAttackRange,
  getMoveRange,
  getDistance,
  isPathClear,
  isEnemy,
  isPlayerCharacter
} from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState();
    this.boardSize = 8;       
  }

  init() {
   this.gamePlay.bindToDOM(document.querySelector('#game-container'));

  let savedState;
  try {
    savedState = this.stateService.load();
    console.log('Состояние загружено:', savedState);
  } catch (e) {
    console.error('Ошибка загрузки:', e.message);
    this.gamePlay.showMessage('Не удалось загрузить игру. Запуск новой.');
  }

  this.state = GameState.from(savedState);
  this.generateNewRoundIfNeeded(); // если нет персонажей — создать команды

  this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
  this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));

  const theme = this.getThemeByLevel(this.state.currentLevel);
  this.gamePlay.drawUi(theme);
  this.gamePlay.redrawPositions(this.state.positionedCharacters);
  }

  generateNewRoundIfNeeded() {
  if (!this.state.positionedCharacters || this.state.positionedCharacters.length === 0) {
    this.generateNewRound();
  }
}
  getThemeByLevel(level) {
    const themes = {
      1: 'prairie',
      2: 'desert',
      3: 'arctic',
      4: 'mountain',
    };
    return themes[level] || 'prairie';
  }
  onCellClick(index) {
  const { currentPlayerTurn, selectedCharacter } = this.state;

  if (!currentPlayerTurn) {
    this.gamePlay.showError('Сейчас ход компьютера!');
    return;
  }

  // Если выбран персонаж
  if (selectedCharacter !== null) {
    const selectedChar = this.state.positionedCharacters.find(c => c.position === selectedCharacter);
    const targetChar = this.state.positionedCharacters.find(c => c.position === index);

    // Проверка: атака по врагу
    if (targetChar && !isPlayerCharacter(targetChar.character)) {
      const distance = getDistance(selectedCharacter, index, this.boardSize);
      const attackRange = getAttackRange(selectedChar.character);

      if (distance <= attackRange && isPathClear(selectedCharacter, index, this.boardSize, this.state.positionedCharacters)) {
        const damage = this.calculateDamage(selectedChar.character, targetChar.character);
         this.gamePlay.showDamage(index, damage);

        targetChar.character.health -= damage;

        if (targetChar.character.health <= 0) {
          // Удалить мёртвого персонажа
          this.state.positionedCharacters = this.state.positionedCharacters.filter(c => c.position !== index);
          this.stateService.save(this.state);
        }

        // Перерисовать поле (обновление health bar)
        this.gamePlay.redrawPositions(this.state.positionedCharacters);

        // Снять выделение и передать ход
        this.gamePlay.deselectCell(selectedCharacter);
        this.state.selectedCharacter = null;
        //this.state.currentPlayerTurn = false;
        this.aiTurn();
        this.checkGameOverAndNextLevel();
        return;
      }
    }

    // Попытка переместиться
    if (!targetChar && this.canMoveTo(selectedCharacter, index)) {
      const positionedChar = this.state.positionedCharacters.find(c => c.position === selectedCharacter);
      positionedChar.position = index;

      this.gamePlay.deselectCell(selectedCharacter);
      this.state.selectedCharacter = null;
      this.gamePlay.redrawPositions(this.state.positionedCharacters);
      //this.state.currentPlayerTurn = false;
      this.aiTurn();
      this.checkGameOverAndNextLevel();
      return;
    }

    // Выбор другого персонажа
    if (targetChar && isPlayerCharacter(targetChar.character)) {
      this.gamePlay.deselectCell(selectedCharacter);
      this.state.selectedCharacter = index;
      this.gamePlay.selectCell(index, 'yellow');
      return;
    }
    this.stateService.save(this.state);
    this.gamePlay.showError('Невозможно выполнить действие');
    return;
  }

  // Ничего не выбрано — попытка выбрать персонажа
  const charAtCell = this.state.positionedCharacters.find(c => c.position === index);
  if (charAtCell && isPlayerCharacter(charAtCell.character)) {
    this.state.selectedCharacter = index;
    this.gamePlay.selectCell(index, 'yellow');
    return;
  }

  this.gamePlay.showError('Здесь нет вашего персонажа'); 
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const character = this.state.positionedCharacters.find(c => c.position === index)?.character;
    if (character) {
      const tooltip = characterInfo`
        level: ${character.level},
        attack: ${character.attack},
        defence: ${character.defence},
        health: ${character.health}
      `;
      this.gamePlay.showCellTooltip(tooltip, index);
    }

    if (!this.state.currentPlayerTurn) {
      this.gamePlay.setCursor('notallowed');
      return;
    }

    if (this.state.selectedCharacter === null) {
      const char = this.state.positionedCharacters.find(c => c.position === index);

      if (char && char.character instanceof Character) {
        this.gamePlay.setCursor('pointer');
        return;
      }

      this.gamePlay.setCursor('notallowed');
      return;
    }

    const selectedChar = this.state.positionedCharacters.find(c => c.position === this.state.selectedCharacter);
    const charAtCell = this.state.positionedCharacters.find(c => c.position === index);

    if (charAtCell && charAtCell.character instanceof Character) {
      try{
        if (charAtCell.character instanceof Character && charAtCell.character.type !== selectedChar.character.type) {
        const distance = getDistance(selectedChar.position, index, this.boardSize);
        const attackRange = getAttackRange(selectedChar.character);

        if (distance <= attackRange && isPathClear(selectedChar.position, index, this.boardSize, this.state.positionedCharacters)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor('crosshair');
        } else {
          this.gamePlay.setCursor('notallowed');
        }
      } else {
        this.gamePlay.setCursor('pointer');
      }
      }catch(e){
        console.log(e);
      }
      
      return;
    }
    console.log("character", selectedChar.character);
    const moveRange = getMoveRange(selectedChar.character);
    const distance = getDistance(selectedChar.position, index, this.boardSize);

    if (distance <= moveRange && isPathClear(selectedChar.position, index, this.boardSize, this.state.positionedCharacters)) {
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor('pointer');
    } else {
      this.gamePlay.setCursor('notallowed');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.state.selectedCharacter === null || this.state.selectedCharacter !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor('auto');
  }

  canMoveTo(position, targetIndex) {
    const { character } = this.state.positionedCharacters.find(c => c.position === position);
    const range = getMoveRange(character);
    const distance = getDistance(position, targetIndex, this.boardSize);
  return distance <= range && !this.state.positionedCharacters.some(c => c.position === targetIndex);
}
calculateDamage(attacker, target) {
  const baseDamage = Math.max(attacker.attack - target.defence, Math.floor(attacker.attack * 0.1));
  return Math.floor(baseDamage);
}

async aiTurn() {
  // Ждём немного, чтобы не было "мгновенного" ответа
  await new Promise(resolve => setTimeout(resolve, 500));

  const enemyCharacters = this.state.positionedCharacters.filter(pc => isEnemy(pc.character));
  const playerCharacters = this.state.positionedCharacters.filter(pc => isPlayerCharacter(pc.character));

  for (const enemy of enemyCharacters) {
    for (const target of playerCharacters) {
      const distance = getDistance(enemy.position, target.position, this.boardSize);
      const attackRange = getAttackRange(enemy.character);

      if (distance <= attackRange && isPathClear(enemy.position, target.position, this.boardSize, this.state.positionedCharacters)) {
        const damage = this.calculateDamage(enemy.character, target.character);
        await this.gamePlay.showDamage(target.position, damage);

        target.character.health -= damage;

        if (target.character.health <= 0) {
          this.state.positionedCharacters = this.state.positionedCharacters.filter(c => c.position !== target.position);
        }

        this.gamePlay.redrawPositions(this.state.positionedCharacters);
        this.state.currentPlayerTurn = true; // передача хода игроку
        return;
      }
    }
  }

  // Если никто не может атаковать — просто передаём ход
  this.state.currentPlayerTurn = true;
  this.stateService.save(this.state);
}
checkGameOverAndNextLevel() {
   const enemiesAlive = this.state.positionedCharacters.some(pc =>
    isEnemy(pc.character)
  );
  const playersAlive = this.state.positionedCharacters.some(pc =>
    isPlayerCharacter(pc.character)
  );

  if (!playersAlive) {
    this.lockBoard();
    this.gamePlay.showMessage('Вы проиграли!');
    this.updateMaxScores();
    return;
  }

  if (!enemiesAlive) {
    if (this.state.currentLevel >= 4) {
      this.lockBoard();
      this.gamePlay.showMessage('Поздравляем! Вы прошли игру!');
      this.updateMaxScores();
      return;
    }

    this.state.currentLevel += 1;
    this.state.scores += 50;

    for (const pc of this.state.positionedCharacters) {
      if (isPlayerCharacter(pc.character)) {
        pc.character.levelUp();
      }
    }

    this.generateNewRound(); // ← обновляет state.positionedCharacters

    const newTheme = this.getThemeByLevel(this.state.currentLevel);
    this.gamePlay.drawUi(newTheme);
    this.gamePlay.redrawPositions(this.state.positionedCharacters);
  }
}

lockBoard() {
  this.gamePlay.boardEl.style.pointerEvents = 'none';
  this.gamePlay.setCursor('not-allowed');
}

unlockBoard() {
  this.gamePlay.boardEl.style.pointerEvents = 'auto';
}
onNewGameClick() {
  // Обновляем рекорд
  this.updateMaxScores();

  // Сбрасываем игру
  this.state = new GameState();
  this.state.maxScores = this.state.scores; // будет перезаписано ниже
  this.unlockBoard();

  // Пересоздаём команды
  this.generateNewRound();

  // Сохраняем начальное состояние
  this.stateService.save(this.state);

  // Обновляем UI
  this.gamePlay.drawUi(this.getThemeByLevel(this.state.currentLevel));
  this.gamePlay.redrawPositions(this.state.positionedCharacters);
  this.stateService.save(this.state);
}

updateMaxScores() {
  if (this.state.scores > this.state.maxScores) {
    this.state.maxScores = this.state.scores;
  }
  this.stateService.save(this.state); // сохраняем maxScores
}
generateNewRound() {
  const { currentLevel } = this.state;
  const playerTeam = generateTeam([Bowman, Swordsman, Magician], currentLevel, 4);
  const enemyTeam = generateTeam([Vampire, Undead, Daemon], currentLevel, 4);

  const players = Array.isArray(playerTeam) ? playerTeam : playerTeam.toArray();
  const enemies = Array.isArray(enemyTeam) ? enemyTeam : enemyTeam.toArray();

  // Очищаем и заполняем state
  this.state.positionedCharacters = [];

  for (let i = 0; i < players.length; i++) {
    this.state.positionedCharacters.push(new PositionedCharacter(players[i], [0, 1, 8, 9][i]));
  }

  for (let i = 0; i < enemies.length; i++) {
    this.state.positionedCharacters.push(new PositionedCharacter(enemies[i], [54, 55, 62, 63][i]));
  }
}

}
