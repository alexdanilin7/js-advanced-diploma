import Character from '../src/js/Character';
import { Bowman } from '../src/js/characters';

test('Character is abstract', () => {
  expect(() => new Character(1)).toThrow();
});

test('Character subclass works', () => {
  const bowman = new Bowman(1);
  expect(bowman instanceof Character).toBe(true);
});