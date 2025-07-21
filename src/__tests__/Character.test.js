import Character from '../src/js/Character';
import { Bowman } from '../src/js/characters';

test('Character is abstract', () => {
  expect(() => new Character(1)).toThrow();
});

test('Character subclass works', () => {
  const bowman = new Bowman(1);
  expect(bowman instanceof Character).toBe(true);
});
test('Character нельзя создать напрямую', () => {
  expect(() => new Character(1)).toThrow();
});

test('Персонаж уровня 3 должен быть прокачан дважды', () => {
  const bowman = new Bowman(3);
  expect(bowman.level).toBe(3);
  expect(bowman.health).toBe(83); // 1+80=81 → 2+80=82 → 3+80=83
});