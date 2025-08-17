import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  #steps = 0
  #value = 0
  elem = null
  #oldActiveIndex = 0
  #allSliderSpan = null
  #thumb = null
  #progress = null

  constructor({ steps, value = 0 }) {
    this.#steps = steps;
    this.#value = value;
    this.#oldActiveIndex = value;

    this.#render();
  }

  #html() {
    return `
      <div class="slider">
        <!--Ползунок слайдера с активным значением-->
        <div class="slider__thumb">
          <span class="slider__value">0</span>
        </div>

        <!--Полоска слайдера-->
        <div class="slider__progress"></div>

        <!-- Шаги слайдера (вертикальные чёрточки) -->
        <div class="slider__steps">
          ${Array(this.#steps)
          .fill('<span></span>')
          .join('\n')}
        </div>
      </div>
    `;
  }

  #render() {
    this.elem = createElement(this.#html());

    this.allSliderSpan = Array.from(this.elem.querySelectorAll('span')).filter(elem => !elem.classList.contains('slider__value'));
    this.allSliderSpan[this.#value].classList.toggle('slider__step-active');

    this.#thumb = this.elem.querySelector('.slider__thumb');
    this.#progress = this.elem.querySelector('.slider__progress');

    this.#thumb.ondragstart = () => false;

    this.#thumb.addEventListener('pointerdown', event => {
      event.preventDefault(); // предотвратить запуск выделения (действие браузера)
      this.elem.classList.add('slider_dragging');

      document.addEventListener('pointermove', this.#onPointerMove);
      document.addEventListener('pointerup', this.#onPointerUp);

    });
    
    this.elem.addEventListener('click', event => {
      let left = Math.abs(event.clientX - this.elem.getBoundingClientRect().left);
      let leftRelative = left / this.elem.offsetWidth;
      let segments = this.#steps - 1;
      let approximateValue = leftRelative * segments;
      let value = Math.round(approximateValue);
      let thumb = this.elem.querySelector('.slider__thumb');
      let progress = this.elem.querySelector('.slider__progress');

      this.#value = value;
      
      this.elem.querySelector('.slider__value').innerHTML = this.#value;
      
      this.allSliderSpan[this.#oldActiveIndex].classList.toggle('slider__step-active');
      this.allSliderSpan[this.#value].classList.toggle('slider__step-active');
      this.#oldActiveIndex = this.#value;
  
      let valuePercents = this.#value / segments * 100;

      thumb.style.left = `${valuePercents}%`;
      progress.style.width = `${valuePercents}%`;

      this.#dispatchSliderChangeEvent();
    });
  }

  #dispatchSliderChangeEvent = () => {
    const sliderChangeEvent = new CustomEvent('slider-change', { // имя события должно быть именно 'slider-change'
      detail: this.#value, // значение 0, 1, 2, 3, 4
      bubbles: true // событие всплывает - это понадобится в дальнейшем
    });

    this.elem.dispatchEvent(sliderChangeEvent);
  }

  #onPointerMove = event => {
    event.preventDefault();
    const newLeft = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = newLeft / this.elem.offsetWidth;

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (leftRelative < 0) {
      leftRelative = 0;
    }

    if (leftRelative > 1) {
      leftRelative = 1;
    }

    let leftPercents = leftRelative * 100;
  
    this.#thumb.style.left = `${leftPercents}%`;
    this.#progress.style.width = `${leftPercents}%`;

    let segments = this.#steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);

    this.#value = value;
    this.elem.querySelector('.slider__value').innerHTML = this.#value;
  }

  #onPointerUp = () => {
    document.removeEventListener('pointermove', this.#onPointerMove);
    document.removeEventListener('pointerup', this.#onPointerUp);

    this.elem.classList.remove('slider_dragging');
    this.#dispatchSliderChangeEvent();
  }
}