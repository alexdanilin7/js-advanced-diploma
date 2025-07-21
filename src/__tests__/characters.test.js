import { Bowman, Swordsman, Magician, Vampire, Undead, Daemon } from '../src/js/characters';

const testCharacter = (Class, expected) => {
  const char = new Class(1);
  expect(char.attack).toBe(expected.attack);
  expect(char.defence).toBe(expected.defence);
  expect(char.level).toBe(1);
};

test('Bowman has correct stats', () => {
  testCharacter(Bowman, { attack: 25, defence: 25 });
});

test('Swordsman has correct stats', () => {
  testCharacter(Swordsman, { attack: 40, defence: 10 });
});

test('Magician has correct stats', () => {
  testCharacter(Magician, { attack: 10, defence: 40 });
});

test('Vampire has correct stats', () => {
  testCharacter(Vampire, { attack: 25, defence: 25 });
});

test('Undead has correct stats', () => {
  testCharacter(Undead, { attack: 40, defence: 10 });
});

test('Daemon has correct stats', () => {
  testCharacter(Daemon, { attack: 10, defence: 40 });
});