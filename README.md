# DOM Store - Lab 5

**Repository:** `dom-store-zhuman`  
**Author:** Zhuman Ayan  

---

## How to Open

Open the `index.html` file directly in any modern browser or run it using Live Server extension in VS Code.

---

## Events Handled

1. **`submit` on the `<form>`:** handles adding an item. I call `event.preventDefault()` to stop the page from reloading, validate the fields, and show errors next to each input instead of using `alert`. Using `submit` instead of a button `click` also makes the Enter key work.
2. **`click` on the `<tbody>` (event delegation):** a single listener handles the Delete, `+` and `-` buttons. It uses `event.target.closest('button[data-action]')` to find the pressed button and reads the item id from the row. This way I don't need to attach listeners to every row, and it keeps working for rows that are added later.
3. **`input` on the form fields:** clears the error message and red border as soon as the user starts correcting the field.

After every change, `render()` redraws the table and recalculates the live total from the `Store` class, so no page reload is needed.

## Screenshots

| 1. Initial State | 2. Form Validation |
| :---: | :---: |
| ![Initial State](./screenshots/screenshot1.png) | ![Form Validation](./screenshots/screenshot2.png) |

| 3. Dynamic Total & Actions |
| :---: |
| ![Dynamic Actions](./screenshots/screenshot3.png) |

## AI Tools Used

- **Gemini AI / ChatGPT:** Used for structuring DOM event delegation logic, clean HTML form validation errors layout, and generating project README.