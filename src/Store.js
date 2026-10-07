export class Store {
  #items = [];

  constructor(initialItems = []) {
    if (Array.isArray(initialItems)) {
      initialItems.forEach(item => this.add(item));
    }
  }

  get items() {
    return this.#items.map(item => ({ ...item }));
  }

  static isValidItem(item) {
    return (
      item &&
      typeof item.name === 'string' &&
      item.name.trim() !== '' &&
      typeof item.price === 'number' &&
      !isNaN(item.price) &&
      item.price > 0 &&
      Number.isInteger(item.qty) &&
      item.qty >= 0
    );
  }

  add(item) {
    if (!Store.isValidItem(item)) return false;
    this.#items.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      name: item.name.trim(),
      price: Number(item.price),
      qty: Number(item.qty)
    });
    return true;
  }

  remove(id) {
    const initialLength = this.#items.length;
    this.#items = this.#items.filter(item => item.id !== id);
    return this.#items.length < initialLength;
  }

  updateQty(id, newQty) {
    const item = this.#items.find(i => i.id === id);
    if (item && Number.isInteger(newQty) && newQty >= 0) {
      item.qty = newQty;
      return true;
    }
    return false;
  }

  get total() {
    return this.#items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}