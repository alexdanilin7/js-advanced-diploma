import Team from '../src/js/Team';
import { Magician } from '../src/js/characters';

test('Team stores characters', () => {
  const team = new Team([new Magician(1)]);
  expect(team.characters.length).toBe(1);
});

test('Team can be iterated', () => {
  const team = new Team([new Magician(1), new Magician(1)]);
  const chars = [...team];
  expect(chars.length).toBe(2);
});