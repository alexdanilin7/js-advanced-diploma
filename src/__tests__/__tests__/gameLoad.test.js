// __tests__/gameLoad.test.js

import GameStateService from '../src/js/GameStateService';
import GamePlay from '../src/js/GamePlay';
import GameController from '../src/js/GameController';

jest.mock('../src/js/GamePlay');

describe('GameController - Load State Behavior', () => {
  let mockGamePlay;
  let stateService;
  let controller;

  beforeEach(() => {
    // Мокируем GamePlay
    mockGamePlay = new GamePlay();
    mockGamePlay.showMessage = jest.fn();
    mockGamePlay.drawUi = jest.fn();
    mockGamePlay.redrawPositions = jest.fn();
    mockGamePlay.addCellEnterListener = jest.fn();
    mockGamePlay.addCellLeaveListener = jest.fn();
    mockGamePlay.addCellClickListener = jest.fn();
    mockGamePlay.addNewGameListener = jest.fn();
    mockGamePlay.bindToDOM = jest.fn();

    stateService = new GameStateService({});
  });

  test('должен начать новую игру при неудачной загрузке', () => {
    // Мок хранилища
    const mockStorage = {
      getItem: jest.fn().mockImplementation(() => {
        throw new Error('Simulated read error');
      }),
    };
    stateService.storage = mockStorage;

    controller = new GameController(mockGamePlay, stateService);
    controller.generateNewRound = jest.fn(); // мок генерации

    controller.init();

    expect(mockGamePlay.showMessage).toHaveBeenCalledWith('Не удалось загрузить игру. Запуск новой.');
    expect(controller.generateNewRound).toHaveBeenCalled();
  });

  test('должен загрузить сохранённое состояние', () => {
    const savedState = {
      currentLevel: 2,
      currentPlayerTurn: false,
      positionedCharacters: [
        {
          character: { type: 'bowman', level: 2, attack: 25, defence: 25, health: 90 },
          position: 0,
        },
        {
          character: { type: 'vampire', level: 2, attack: 25, defence: 25, health: 80 },
          position: 63,
        },
      ],
    };

    const mockStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(savedState)),
    };
    stateService.storage = mockStorage;

    controller = new GameController(mockGamePlay, stateService);

    controller.init();

    expect(controller.state.currentLevel).toBe(2);
    expect(controller.state.positionedCharacters.length).toBeGreaterThan(0);
    expect(mockGamePlay.showMessage).not.toHaveBeenCalled();
  });
});