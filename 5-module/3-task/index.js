function initCarousel() {
  const inner = document.querySelector('.carousel__inner');
  const arrowRight = document.querySelector('.carousel__arrow_right');
  const arrowLeft = document.querySelector('.carousel__arrow_left');
  const slideWidth = document.querySelector('.carousel__slide').offsetWidth;

  arrowLeft.style.display = 'none';

  let position = 0;

  let slideNumber = 1;

  arrowRight.addEventListener('click', () => {
    position += slideWidth;
    inner.style.transform = `translateX(-${position}px)`;
    slideNumber++;

    if (slideNumber === 4) {
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

    if (slideNumber !== 4) {
      arrowRight.style.display = '';
    }
  });
}
