function getMinMax(str) {
  let sortedArr = str
    .split(' ')
    .filter(item => isFinite(item))
    .sort((a, b) => a - b);
  
  return { 
    min: Number(sortedArr[0]), 
    max: Number(sortedArr.at(-1))
  };
}
