import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  #categories = []
  elem = null
  value = ''

  constructor(categories) {
    this.#categories = categories ?? this.#categories;

    this.#render();
  }

  #html() {
    return `
      <!--Корневой элемент RibbonMenu-->
        <div class="ribbon">
          <!--Кнопка прокрутки влево-->
          <button class="ribbon__arrow ribbon__arrow_left">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </button>

          <!--Ссылки на категории-->
          <nav class="ribbon__inner">
            ${this.#categories
            .map((category, index) => `<a href="#" class="ribbon__item ${index === 0 ? 'ribbon__item_active' : ''}" data-id="${category.id}">${category.name}</a>`)
            .join(`\n`)}
          </nav>

          <!--Кнопка прокрутки вправо-->
          <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </button>
        </div>
    `;
  }

  #initSlider() {
    const ribbonInner = document.querySelector('.ribbon__inner');
    const arrowLeft = document.querySelector('.ribbon__arrow_left');
    const arrowRight = document.querySelector('.ribbon__arrow_right');

    arrowLeft.addEventListener('click', () => {
      ribbonInner.scrollBy(-350, 0);
    });

    arrowRight.addEventListener('click', () => {
      ribbonInner.scrollBy(350, 0);
    });
    
    ribbonInner.addEventListener('click', event => {
      const item = event.target;
      event.preventDefault();
      document.querySelector('.ribbon__item_active').classList.remove('ribbon__item_active');
      item.classList.add('ribbon__item_active');
      const id = item.dataset.id;
      this.value = id;

      const customEvent = new CustomEvent('ribbon-select', {
        detail: id,
        bubbles: true,
      });

      this.elem.dispatchEvent(customEvent);
    });

    ribbonInner.addEventListener('scroll', () => {
      let scrollLeft = ribbonInner.scrollLeft;
      let scrollWidth = ribbonInner.scrollWidth;
      let clientWidth = ribbonInner.clientWidth;

      let scrollRight = scrollWidth - scrollLeft - clientWidth; // число пикселей, например, 100 или 0.
      if (scrollLeft === 0) {
        arrowLeft.classList.remove('ribbon__arrow_visible');
      } else {
        arrowLeft.classList.add('ribbon__arrow_visible');
      }

      if (scrollRight < 1) {
        arrowRight.classList.remove('ribbon__arrow_visible');
      } else {
        arrowRight.classList.add('ribbon__arrow_visible');
      }
    });
  }

  #render() {
    this.elem = createElement(this.#html());

    this.elem.addEventListener('click', event => {
      const arrowRight = event.target.closest('.ribbon__arrow_right');

      if (arrowRight) {
        this.#initSlider();
        arrowRight.dispatchEvent(new Event('click'));
      }

      const ribbonItem = event.target.closest('.ribbon__item');

      if (ribbonItem) {
        this.#initSlider();
        ribbonItem.dispatchEvent(new Event('click', {bubbles: true}));
      }

    }, {once: true});
  }
}
