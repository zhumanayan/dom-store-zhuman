import { Store } from './Store.js';

// ---------- состояние ----------
const store = new Store([
  { name: 'Camera Rent', price: 50, qty: 2 },
  { name: 'Studio Hour', price: 30, qty: 1 },
]);

// ---------- элементы ----------
const form = document.getElementById('add-form');
const list = document.getElementById('list');
const totalEl = document.getElementById('total');
const fields = {
  name: document.getElementById('name'),
  price: document.getElementById('price'),
  qty: document.getElementById('qty'),
};

const money = n => '$' + n.toFixed(2);

// ---------- отрисовка ----------
function render() {
  list.innerHTML = '';
  const items = store.items;

  if (items.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.className = 'empty';
    td.textContent = 'No items yet. Add the first one above.';
    tr.appendChild(td);
    list.appendChild(tr);
  }

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;

    const tdName = document.createElement('td');
    tdName.textContent = item.name;

    const tdPrice = document.createElement('td');
    tdPrice.textContent = money(item.price);

    const tdQty = document.createElement('td');
    tdQty.innerHTML =
      '<button class="btn btn-qty" data-action="dec">-</button> ' +
      '<span class="qty"></span> ' +
      '<button class="btn btn-qty" data-action="inc">+</button>';
    tdQty.querySelector('.qty').textContent = item.qty;

    const tdTotal = document.createElement('td');
    tdTotal.textContent = money(item.price * item.qty);

    const tdActions = document.createElement('td');
    tdActions.innerHTML = '<button class="btn-delete" data-action="remove">Delete</button>';

    tr.append(tdName, tdPrice, tdQty, tdTotal, tdActions);
    list.appendChild(tr);
  });

  // живой total: берём из Store
  totalEl.textContent = 'Total Amount: ' + money(store.total);
}

// ---------- валидация ----------
function showError(field, message) {
  document.getElementById(field + '-error').textContent = message;
  fields[field].classList.toggle('invalid', Boolean(message));
}

function validate() {
  const name = fields.name.value.trim();
  const priceRaw = fields.price.value.trim().replace(',', '.');
  const price = Number(priceRaw);
  const qtyRaw = fields.qty.value.trim();
  const qty = Number(qtyRaw);
  let ok = true;

  if (name === '') {
    showError('name', 'Enter an item name');
    ok = false;
  } else showError('name', '');

  if (priceRaw === '' || Number.isNaN(price) || price <= 0) {
    showError('price', 'Price must be a number greater than 0');
    ok = false;
  } else showError('price', '');

  if (qtyRaw === '' || !Number.isInteger(qty) || qty <= 0) {
    showError('qty', 'Quantity must be a whole number greater than 0');
    ok = false;
  } else showError('qty', '');

  return ok ? { name, price, qty } : null;
}

// ---------- события ----------
// 1) Добавление: submit формы
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = validate();
  if (!data) return;
  store.add(data);
  form.reset();
  fields.name.focus();
  render();
});

// 2) Делегирование: ОДИН слушатель на список для remove / inc / dec
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = button.closest('tr').dataset.id;
  const action = button.dataset.action;
  const item = store.items.find(i => i.id === id);
  if (!item) return;

  if (action === 'remove') {
    store.remove(id);
  } else if (action === 'inc') {
    store.updateQty(id, item.qty + 1);
  } else if (action === 'dec') {
    store.updateQty(id, Math.max(1, item.qty - 1));
  }
  render();
});

// 3) Ошибка исчезает, когда начинаешь исправлять поле
Object.keys(fields).forEach(key => {
  fields[key].addEventListener('input', () => showError(key, ''));
});

render();