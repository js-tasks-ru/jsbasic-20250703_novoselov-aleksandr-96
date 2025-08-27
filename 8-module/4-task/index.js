import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]
  modal = []

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
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

    this.onProductUpdate(product);
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
      item.count = 0;
    } else {
      item.count += amount;
    }

    this.onProductUpdate(item);
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

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
  product.id
}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
    2
  )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');
    this.modal.setBody(this.renderModalBody());
    this.modal.open();
  }

  renderModalBody = () => {
    const div = createElement('<div></div>');

    this.cartItems.map(item => div.append(this.renderProduct(item.product, item.count)));
    div.append(this.renderOrderForm());

    div.querySelector('.cart-form').addEventListener('submit', event => {
      this.onSubmit(event);
    });

    div.addEventListener('click', event => {
      const minus = event.target.closest('.cart-counter__button_minus');
      const cardProduct = event.target.closest('.cart-product');
      if (!cardProduct) {return;}

      const productId = cardProduct.dataset.productId;

      if (!productId) {return;}

      if (minus) {
        this.updateProductCount(productId, -1);
        return;
      }

      const plus = event.target.closest('.cart-counter__button_plus');

      if (plus) {
        this.updateProductCount(productId, 1);
        return;
      }
    });
    return div;

  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
    const isOpen = document.body.classList.contains('is-modal-open');
    if (!isOpen) {return;}

    let productId = cartItem.product.id;
    let modalBody = document.querySelector('.modal__body');

    // Элемент, который хранит количество товаров с таким productId в корзине
    let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);

    // Элемент с общей стоимостью всех единиц этого товара
    let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);

    // Элемент с суммарной стоимостью всех товаров
    let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

    productCount.innerHTML = cartItem.count;

    productPrice.innerHTML = `€${(cartItem.count * cartItem.product.price).toFixed(2)}`;

    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

    if (cartItem.count === 0) {
      modalBody.querySelector(`[data-product-id="${productId}"]`).remove();
    }

    if (this.cartItems.length === 0) {
      this.modal.close();
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    document.querySelector('.cart-buttons__button').classList.add('is-loading');

    let form = document.querySelector('.cart-form');

    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(form)
    });

    if (response.ok) {
      this.modal.setTitle('Success!');
      this.cartItems = [];
      this.modal.setBody(
        createElement(
          `
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
        `
        )
      );
      this.cartIcon.update(this);
    }
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

