import { calcTileType } from './utils';

describe('calcTileType function', () => {
  const boardSize = 8;

  test('should return "top-left" for index 0', () => {
    expect(calcTileType(0, boardSize)).toBe('top-left');
  });

  test('should return "top-right" for last index in first row', () => {
    expect(calcTileType(boardSize - 1, boardSize)).toBe('top-right');
  });

  test('should return "top" for top middle tiles', () => {
    expect(calcTileType(3, boardSize)).toBe('top');
  });

  test('should return "bottom-left" for first index in last row', () => {
    expect(calcTileType(boardSize * (boardSize - 1), boardSize)).toBe('bottom-left');
  });

  test('should return "bottom-right" for last index in last row', () => {
    expect(calcTileType(boardSize * boardSize - 1, boardSize)).toBe('bottom-right');
  });

  test('should return "bottom" for bottom middle tiles', () => {
    expect(calcTileType(boardSize * (boardSize - 1) + 3, boardSize)).toBe('bottom');
  });

  test('should return "left" for left middle tiles', () => {
    expect(calcTileType(boardSize * 2, boardSize)).toBe('left');
  });

  test('should return "right" for right middle tiles', () => {
    expect(calcTileType(boardSize * 2 + boardSize - 1, boardSize)).toBe('right');
  });

  test('should return "center" for center tiles', () => {
    expect(calcTileType(boardSize * 3 + 3, boardSize)).toBe('center');
  });
});