function highlight(table) {
  const rows = table.tBodies[0].children;
  
  for (let row of rows) {   
    rowHandler(row);
  }
}

function rowHandler(row) {
  const cells = row.cells;

  for (let i = 0; i <= cells.length; i++) {
    const cell = cells[i];

    //status handler
    if (i === 3) {
      if (cell.hasAttribute('data-available')) {
        const availableClass = cell.dataset.available === 'true' ? 'available' : 'unavailable';
        row.classList.add(availableClass);
      } else {
        row.hidden = true;
      }
    } else if (i === 2) { // gender handler
      const genderClass = cell.innerHTML === 'm' ? 'male' : 'female';
      row.classList.add(genderClass);
    } else if (i === 1) { // age handler
      const under18 = cell.innerHTML < 18;
      if (under18) {
        row.style = "text-decoration: line-through";
      }
    }
  }
}
