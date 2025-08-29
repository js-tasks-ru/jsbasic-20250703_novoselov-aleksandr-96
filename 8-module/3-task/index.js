export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    const cartIncludesProduct = this.cartItems.some(item => item.product.id === product.id);

    if (cartIncludesProduct) {
      this.cartItems.find(item => item.product.id === product.id).count++;
    } else {
      this.cartItems.push({
        product,
        count: 1
      });
    }

    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let index;

    const item = this.cartItems.find((item, idx) => {
      if (item.product.id === productId) {
        index = idx;
      }
      return item.product.id === productId;});

    if (item.count === 1 && amount === -1) {
      this.cartItems.splice(index, 1);
    } else {
      item.count += amount;
    }

    this.onProductUpdate(this.cartItems);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((totalCount, item) => totalCount += item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((totalPrice, item) => totalPrice += item.product.price * item.count, 0);
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}