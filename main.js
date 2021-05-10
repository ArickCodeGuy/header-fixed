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

  isScrolled(el) {
    const elFake = this.getFake(el);
    let topOffset;
    if (typeof this.options.topOffset === 'number') {
      topOffset = this.options.topOffset;
    }else if (HTMLElement.prototype.isPrototypeOf(this.options.topOffset)) {
      topOffset = this.options.topOffset.clientHeight;
    };
    this.iDontKnowHowToNameThisFunction(el);
    const fixedPos = el.dataset.stickyOffsetTop - topOffset;
    if (fixedPos  < window.scrollY) {
      el.classList.add('scrolled');
      elFake.style.display = 'block';
      el.style.left = `${el.offsetLeft}px`;
      el.style.top = `${topOffset}px`;
      el.style.position = 'fixed';
    }else {
      el.classList.remove('scrolled');
      elFake ? elFake.style.display = 'none':false;
      el.style.position = '';
    };
  }

  createFake(el) {
    const elFake = document.createElement('div');
    elFake.classList.add('fake-div');
    this.options.fakeDivClass && typeof this.options.fakeDivClass === 'string' ? elFake.classList.add(this.options.fakeDivClass): false;
    elFake.style.display = 'none';
    elFake.style.height = `${el.clientHeight}px`;
    el.after(elFake);
  }

  iDontKnowHowToNameThisFunction(el) {
    if (el.style.position != 'fixed') {
      el.dataset.stickyOffsetTop = el.offsetTop;
    }else {
      const fakeDiv = el.nextElementSibling;
      el.dataset.stickyOffsetTop = fakeDiv.offsetTop;
    }
  }

  getFake(el) {
    const elFake = el.nextElementSibling;
    if (elFake.classList.contains('fake-div')) {
      return elFake
    }else {
      return null
    };
  }

  windowResize(el) {
    const elFake = this.getFake(el);
    elFake ? elFake.style.height = `${el.clientHeight}px`: false;
  }

  addEvents(el) {
    window.addEventListener('resize', () => this.windowResize(el));
    window.addEventListener('scroll', () => this.isScrolled(el));
  }

  initSingleElement(el) {
    this.createFake(el);
    this.iDontKnowHowToNameThisFunction(el);
    this.addEvents(el);
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