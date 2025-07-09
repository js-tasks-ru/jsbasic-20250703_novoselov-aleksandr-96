function truncate(str, maxlength) {
  const length = str.length;
  return length <= maxlength ? str : str.slice(0, maxlength - 1) + '…';
}
