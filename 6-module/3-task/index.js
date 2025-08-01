import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  #slides = []
  elem = null

  constructor(slides) {
    this.#slides = slides ?? this.#slides;

    this.#render();
  }

  #html() {
    return `
      <!--Корневой элемент карусели-->
      <div class="carousel">
        <!--Кнопки переключения-->
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>

        <div class="carousel__inner">
          <!--Верстка слайдов-->
          ${this.#slides.map(slide => `
            <div class="carousel__slide" data-id="${slide.id}">
              <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
              <div class="carousel__caption">
                <span class="carousel__price">€${slide.price.toFixed(2)}</span>
                <div class="carousel__title">Penang shrimp</div>
                <button type="button" class="carousel__button">
                  <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                </button>
              </div>
            </div>
          `).join('\n')}
        </div>
      </div>
    `;
  }

  #initCarousel() {
    const inner = document.querySelector('.carousel__inner');
    const arrowRight = document.querySelector('.carousel__arrow_right');
    const arrowLeft = document.querySelector('.carousel__arrow_left');
    const slideWidth = document.querySelector('.carousel__slide').offsetWidth;
  
    arrowLeft.style.display = 'none';
  
    let position = 0;
    let endPosition = this.#slides.length;
  
    let slideNumber = 1;
  
    arrowRight.addEventListener('click', () => {
      position += slideWidth;
      inner.style.transform = `translateX(-${position}px)`;
      slideNumber++;
  
      if (slideNumber === endPosition) {
        arrowRight.style.display = 'none';
      }
  
      if (slideNumber !== 1) {
        arrowLeft.style.display = '';
      }
    });
    
    arrowLeft.addEventListener('click', () => {
      position -= slideWidth;
      inner.style.transform = `translateX(-${position}px)`;
      slideNumber--;
  
      if (slideNumber === 1) {
        arrowLeft.style.display = 'none';
      }
  
      if (slideNumber !== endPosition) {
        arrowRight.style.display = '';
      }
    });
  }
  
  #render() {
    this.elem = createElement(this.#html());
    this.elem.querySelector('.carousel__arrow_left').style.display = 'none';

    this.elem.addEventListener('click', event => {
      const button = event.target.closest('.carousel__button');
      const slide = event.target.closest('.carousel__slide');

      if (button) {
        const customEvent = new CustomEvent("product-add", { // имя события должно быть именно "product-add"
          detail: slide.dataset.id, // Уникальный идентификатора товара из объекта товара
          bubbles: true // это событие всплывает - это понадобится в дальнейшем
        });

        this.elem.dispatchEvent(customEvent);
      }
    });

    this.elem.addEventListener('click', event => {
      const arrowRight = event.target.closest('.carousel__arrow_right');
      if (arrowRight) {
        this.#initCarousel();
        arrowRight.dispatchEvent(new Event('click'));
      }
    }, { once: true }); 
  }
}