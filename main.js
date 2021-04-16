'use strict';

let defaults = {
  topOffset: 0
}

class StickyEl {
  constructor(el, options) {
    this.el = document.querySelectorAll(el);
    this.options = JSON.parse(JSON.stringify(defaults));
    this.setOptions(options);
    this.init(this.el);
  }

  setOptions(options) {
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      };
      return 'options set to your options obj'
    }else {
      return 'options set to default options'
    }
  }

  isScrolled(el) {
    let elFake = this.getFake(el);
    if (el.dataset.stickyOffsetTop < window.scrollY) {
      el.classList.add('scrolled');
      elFake.style.display = 'block';
      el.style.left = `${el.offsetLeft}px`;
      el.style.top = `${this.options.topOffset}px`;
      el.style.position = 'fixed';
    }else {
      el.classList.remove('scrolled');
      elFake ? elFake.style.display = 'none':false;

      el.style.position = '';
    };
  }

  createFake(el) {
    let elFake = document.createElement('div');
    elFake.classList.add('fake-div');
    elFake.style.display = 'none';
    elFake.style.height = `${el.clientHeight}px`;
    el.after(elFake);
  }

  addAttrs(el) {
    let elOffset = el.offsetTop - this.options.topOffset
    el.dataset.stickyOffsetTop = elOffset;
    console.log(elOffset);
  }

  getFake(el) {
    let elFake = el.nextElementSibling;
    if (elFake.classList.contains('fake-div')) {
      return elFake
    }else {
      return null
    };
  }

  windowResize(el) {
    let elFake = this.getFake(el);
    elFake ? elFake.style.height = `${el.clientHeight}px`: false;
  }

  addEvents(el) {
    window.addEventListener('resize', () => this.windowResize(el));
    window.addEventListener('scroll', () => this.isScrolled(el));
  }

  init(elArr) {
    elArr.forEach((el) => {
      this.createFake(el);
      this.addAttrs(el);
      this.addEvents(el);
    });
  }

};