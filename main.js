'use strict';

let defaultOptions = {
  init: true, /*init or not init instantly*/
  topOffset: 0, /*value in pixels or height of specified html element*/
  fakeDivClass: '', /*add custom class to fake div (fake-div class still will be added)*/
  stopElement: null /*specify html element on which sticky el should stop having position fixed and assign position absolute*/
}

class StickyEl {
  constructor(el, options) {
    this.el = el;
    this.options = Object.assign({}, defaultOptions, options);
    this.options.init === true ? this.init(): false;
  }

  #scrollEvent(elObj) {
    if (!this.#stopElementFunc(elObj)) {
      let topOffset;
      if (typeof this.options.topOffset === 'number') {
        topOffset = this.options.topOffset;
      }else if (HTMLElement.prototype.isPrototypeOf(this.options.topOffset)) {
        topOffset = this.options.topOffset.clientHeight;
      };
      this.#dataPositionSetter(elObj);
      if (elObj.el.dataset.stickyOffsetTop - topOffset  < window.scrollY) {
        elObj.el.classList.add('scrolled');
        elObj.elFake.style.display = 'block';
        Object.assign(elObj.el.style, {
          left: `${elObj.el.offsetLeft}px`,
          top: `${topOffset}px`,
          position: 'fixed',
        })
      }else {
        elObj.el.classList.remove('scrolled');
        elObj.elFake ? elObj.elFake.style.display = 'none':false;
        elObj.el.style.position = '';
      };
    };
  }

  #stopElementFunc(elObj) {
    let stopElement = this.options.stopElement;
    if (HTMLElement.prototype.isPrototypeOf(stopElement)) {
      const condition = 
        scrollY > stopElement.offsetTop - elObj.el.offsetHeight - elObj.el.offsetTop;
      if (condition) {
        const pos = stopElement.offsetTop - elObj.el.offsetHeight - scrollY;
        Object.assign(elObj.el.style, {
          top: `${pos}px`
        });
      };
      return condition
    };
  }

  #createFake(elObj) {
    elObj.elFake = document.createElement('div');
    elObj.elFake.classList.add('fake-div');
    this.options.fakeDivClass && typeof this.options.fakeDivClass === 'string' ? elObj.elFake.classList.add(this.options.fakeDivClass): false;
    elObj.elFake.style.display = 'none';
    elObj.elFake.style.marginTop = elObj.el.style.marginTop;
    elObj.elFake.style.marginBottom = elObj.el.style.marginBottom;
    elObj.elFake.style.marginLeft = elObj.el.style.marginLeft;
    elObj.elFake.style.marginRight = elObj.el.style.marginRight;
    elObj.elFake.style.height = `${elObj.el.clientHeight}px`;
    elObj.el.after(elObj.elFake);
  }

  #dataPositionSetter(elObj) {
    // if position of element is set fo 'fixed', then use position of .fake-div
    if (elObj.el.style.position != 'fixed') {
      elObj.el.dataset.stickyOffsetTop = elObj.el.offsetTop;
    }else {
      elObj.el.dataset.stickyOffsetTop = elObj.elFake.offsetTop;
    }
  }

  #windowResize(elObj) {
    elObj.elFake ? elObj.elFake.style.height = `${elObj.el.clientHeight}px`: false;
  }

  #addEvents(elObj) {
    window.addEventListener('resize', () => this.#windowResize(elObj));
    window.addEventListener('scroll', () => this.#scrollEvent(elObj));
  }

  #initSingleElement(el) {
    // elObj is var that get's passed through all functions so we don't use querySelector each time we need some element
    const elObj = {
      el: el,
      elFake: null
    };
    this.#createFake(elObj);
    this.#dataPositionSetter(elObj);
    this.#addEvents(elObj);
  }

  #initArray(arr) {
    arr.forEach((el) => this.#initSingleElement(el));
  }

  init() {
    // if string is specified
    if (typeof this.el === 'string') {
      const el = document.querySelectorAll(this.el);
      el ? this.#initArray(el): false;
    };
  }
};