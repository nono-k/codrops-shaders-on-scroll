class Slider {
  constructor() {
    this.init();
  }
  init() {
    const swiper = document.querySelector('.swiper');
    new Swiper(swiper, {
      slidesPerView: 3,
    })
  }
}