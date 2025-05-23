class SmoothScroll {
  constructor({ element, viewport, scroll }) {
    this.element = element;
    this.viewport = viewport;
    this.scroll = scroll;

    this.elements = {
      scrollContnet: this.element.querySelector('.scroll__content'),
    }
  }
  setSizes() {
    this.scroll.height = this.elements.scrollContnet.getBoundingClientRect().height;
    this.scroll.limit = this.elements.scrollContnet.clientHeight - this.viewport.height;

    document.body.style.height = `${this.scroll.height}px`;
  }
  update() {
    this.scroll.hard = window.scrollY;
    this.scroll.hard = gsap.utils.clamp(0, this.scroll.limit, this.scroll.hard);
    this.scroll.soft = gsap.utils.interpolate(this.scroll.soft, this.scroll.hard, this.scroll.ease);

    if (this.scroll.soft < 0.01) {
      this.scroll.soft = 0;
    }

    this.elements.scrollContnet.style.transform = `translateY(${-this.scroll.soft}px)`;
  }
  onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.setSizes();
  }
}