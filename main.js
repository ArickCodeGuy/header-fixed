'use strict';

let defaultOptions = {
  init: true, /*init or not init instantly*/
  topOffset: 0, /*value in pixels or height of specified html element*/
  fakeDivClass: '', /*add custom class to fake div (fake-div class still will be added)*/
}

class StickyEl {
  constructor(el, options) {
    this.el = el;
    this.options = Object.assign({}, defaultOptions, options);
    this.options.init === true ? this.init(): false;
  }

  isScrolled(elObj) {
    let topOffset;
    if (typeof this.options.topOffset === 'number') {
      topOffset = this.options.topOffset;
    }else if (HTMLElement.prototype.isPrototypeOf(this.options.topOffset)) {
      topOffset = this.options.topOffset.clientHeight;
    };
    this.dataPositionSetter(elObj);
    if (elObj.el.dataset.stickyOffsetTop - topOffset  < window.scrollY) {
      elObj.el.classList.add('scrolled');
      elObj.elFake.style.display = 'block';
      elObj.el.style.left = `${elObj.el.offsetLeft}px`;
      elObj.el.style.top = `${topOffset}px`;
      elObj.el.style.position = 'fixed';
    }else {
      elObj.el.classList.remove('scrolled');
      elObj.elFake ? elObj.elFake.style.display = 'none':false;
      elObj.el.style.position = '';
    };
  }

  createFake(elObj) {
    elObj.elFake = document.createElement('div');
    elObj.elFake.classList.add('fake-div');
    this.options.fakeDivClass && typeof this.options.fakeDivClass === 'string' ? elObj.elFake.classList.add(this.options.fakeDivClass): false;
    elObj.elFake.style.display = 'none';
    elObj.elFake.style.height = `${elObj.el.clientHeight}px`;
    elObj.el.after(elObj.elFake);
  }

  dataPositionSetter(elObj) {
    // if position of element is set fo 'fixed', then use position of .fake-div
    if (elObj.el.style.position != 'fixed') {
      elObj.el.dataset.stickyOffsetTop = elObj.el.offsetTop;
    }else {
      elObj.el.dataset.stickyOffsetTop = elObj.elFake.offsetTop;
    }
  }

  windowResize(elObj) {
    elObj.elFake ? elObj.elFake.style.height = `${elObj.el.clientHeight}px`: false;
  }

  addEvents(elObj) {
    window.addEventListener('resize', () => this.windowResize(elObj));
    window.addEventListener('scroll', () => this.isScrolled(elObj));
  }

  initSingleElement(el) {
    // elObj is var that get's passed through all functions so we don't use querySelector each time we need some element
    const elObj = {
      el: el,
      elFake: null
    };
    this.createFake(elObj);
    this.dataPositionSetter(elObj);
    this.addEvents(elObj);
  }

  initArray(arr) {
    arr.forEach((el) => this.initSingleElement(el));
  }

  init() {
    // if string is specified
    if (typeof this.el === 'string') {
      const el = document.querySelectorAll(this.el);
      el ? this.initArray(el): false;
    };
  }
};