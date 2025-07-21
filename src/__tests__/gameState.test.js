import GameState from '../src/js/GameState';

test('GameState.from creates valid state', () => {
  const raw = {
    currentLevel: 3,
    scores: 100,
    maxScores: 150,
    positionedCharacters: [],
  };

  const state = GameState.from(raw);

  expect(state.currentLevel).toBe(3);
  expect(state.scores).toBe(100);
  expect(state.maxScores).toBe(150);
});

test('GameState initializes with defaults', () => {
  const state = new GameState();
  expect(state.currentLevel).toBe(1);
  expect(state.scores).toBe(0);
  expect(state.maxScores).toBe(0);
});