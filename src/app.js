import { Store } from './Store.js';

const store = new Store([
  { name: 'Camera Rent', price: 50, qty: 2 },
  { name: 'Studio Hour', price: 30, qty: 1 }
]);

const form = document.getElementById('add-item-form');
const itemsList = document.getElementById('items-list');
const totalAmount = document.getElementById('total-amount');

// 1. Рендеринг списка товаров
function render() {
  itemsList.innerHTML = '';
  const items = store.items;

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <button class="action-btn btn-dec" data-action="dec">-</button>
        <span>${item.qty}</span>
        <button class="action-btn btn-inc" data-action="inc">+</button>
      </td>
      <td>$${(item.price * item.qty).toFixed(2)}</td>
      <td>
        <button class="action-btn btn-delete" data-action="delete">Delete</button>
      </td>
    `;
    itemsList.appendChild(tr);
  });

  // 4. Живой total
  totalAmount.textContent = store.total.toFixed(2);
}

// 2. Валидация формы в DOM (без alert)
function validateForm(name, price, qty) {
  let isValid = true;

  document.getElementById('name-error').textContent = '';
  document.getElementById('price-error').textContent = '';
  document.getElementById('qty-error').textContent = '';

  if (!name || name.trim() === '') {
    document.getElementById('name-error').textContent = 'Item name cannot be empty.';
    isValid = false;
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    document.getElementById('price-error').textContent = 'Price must be a number greater than 0.';
    isValid = false;
  }

  const parsedQty = parseInt(qty, 10);
  if (isNaN(parsedQty) || parsedQty < 0 || parsedQty !== Number(qty)) {
    document.getElementById('qty-error').textContent = 'Quantity must be a valid non-negative integer.';
    isValid = false;
  }

  return isValid;
}

// Обработка формы
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameVal = document.getElementById('name').value;
  const priceVal = document.getElementById('price').value;
  const qtyVal = document.getElementById('qty').value;

  if (validateForm(nameVal, priceVal, qtyVal)) {
    store.add({
      name: nameVal,
      price: parseFloat(priceVal),
      qty: parseInt(qtyVal, 10)
    });
    form.reset();
    render();
  }
});

// 5. Делегирование событий (один слушатель на список)
itemsList.addEventListener('click', (e) => {
  const target = e.target;
  const action = target.dataset.action;
  if (!action) return;

  const tr = target.closest('tr');
  const id = tr.dataset.id;
  const item = store.items.find(i => i.id === id);

  if (action === 'delete') {
    store.remove(id);
  } else if (action === 'inc' && item) {
    store.updateQty(id, item.qty + 1);
  } else if (action === 'dec' && item) {
    if (item.qty > 0) {
      store.updateQty(id, item.qty - 1);
    }
  }

  render();
});

// Инициализация
render();