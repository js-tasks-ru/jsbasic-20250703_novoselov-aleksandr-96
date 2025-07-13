function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// c помощью цикла for in

// function isEmpty(obj) {
//   let result = true;

//   for (let key in obj) {
//     result = false;
//     break;
//   }

//   return result;
// }
