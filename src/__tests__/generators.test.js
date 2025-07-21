import { characterGenerator, generateTeam } from '../src/js/generators';
import { Bowman, Magician } from '../src/js/characters';

test('characterGenerator yields correct types', () => {
  const gen = characterGenerator([Bowman, Magician], 1);
  const char1 = gen.next().value;
  const char2 = gen.next().value;
  expect([Bowman, Magician]).toContain(char1.constructor);
  expect([Bowman, Magician]).toContain(char2.constructor);
});

test('generateTeam returns correct number of characters', () => {
  const team = generateTeam([Bowman], 1, 3);
  expect(team.length).toBe(3);
});