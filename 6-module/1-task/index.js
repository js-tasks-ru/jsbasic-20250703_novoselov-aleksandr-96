/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */

function createElement(html) {
  const tmp = document.createElement('div');
    
  tmp.innerHTML = html;
    
  return tmp.firstElementChild;
}

export default class UserTable {

  elem = null;
  #rows = []

  constructor(rows) {
    this.#rows = rows ?? this.#rows;

    this.#render();
  }

  #html() {
    return `
    <table>
      <thead>
        <tr>
            <th>Имя</th>
            <th>Возраст</th>
            <th>Зарплата</th>
            <th>Город</th>
            <th></th>
        </tr>
      </thead>
      <tbody>
        ${this.#rows
          .map(row => `<tr>
                          <td>${row.name}</td>
                          <td>${row.age}</td>
                          <td>${row.salary}</td>
                          <td>${row.city}</td>
                          <td><button class="delete-btn">X</button></td>
                        </tr>
          `)
          .join('\n')}
      </tbody>
    </table>
    `;
  }

  #render() {
    this.elem = createElement(this.#html());

    this.elem.addEventListener('click', event => {
      if (event.target.classList.contains('delete-btn')) {
        const row = event.target.closest('tr');

        if (row) {
          row.remove();
        }
      }
    });
  }
}
