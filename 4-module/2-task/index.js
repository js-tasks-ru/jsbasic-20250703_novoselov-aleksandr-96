function makeDiagonalRed(table) {
  const rows = table.rows;
      
  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[i].style = "background-color: red;";
  }    
}
