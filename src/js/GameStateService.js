export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    try {
      this.storage.setItem('state', JSON.stringify(state));
    } catch (e) {
      throw new Error(`Failed to save game: ${e.message}`);
    }
  }

  load() {
    try {
      const data = this.storage.getItem('state');
      if (!data) {
        throw new Error('No saved game found');
      }
      return JSON.parse(data);
    } catch (e) {
      throw new Error(`Failed to load game: ${e.message}`);
    }
  }
}