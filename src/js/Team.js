/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor(characters = []) {
    this.characters = [...characters];
  }

  toArray() {
    return this.characters;
  }

  *[Symbol.iterator]() {
    for (const char of this.characters) {
      yield char;
    }
  }
}
