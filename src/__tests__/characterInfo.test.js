import {characterInfo} from './utils';

test('formats character info correctly', () => {
  const result = characterInfo`
    level: ${2},
    attack: ${25},
    defence: ${30},
    health: ${70}
  `;
  expect(result).toBe('🎖2 ⚔25 🛡30 ❤70');
});