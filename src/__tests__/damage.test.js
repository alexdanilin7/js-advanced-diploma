import GameController from '../src/js/GameController';
import { Vampire, Bowman } from '../src/js/characters';

test('calculateDamage correctly calculates damage', () => {
  const controller = new GameController();

  const attacker = new Bowman(1); // attack: 25
  const target = new Vampire(1); // defence: 25

  const damage = controller.calculateDamage(attacker, target);
  expect(damage).toBe(Math.max(25 - 25, Math.floor(25 * 0.1))); // max(0, 2) = 2
});

test('minimum damage is 10% of attack', () => {
  const controller = new GameController();

  const attacker = new Magician(1); // attack: 10
  const target = new Daemon(1);     // defence: 40

  const damage = controller.calculateDamage(attacker, target);
  expect(damage).toBe(Math.floor(10 * 0.1)); // 1
});