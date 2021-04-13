'use strict';
// .header position-fixed
// add spacing to top
// headerFake is fake header with top padding to prevent header overlapping body on top
class StickyEl {
  constructor(el) {
    this.el = document.querySelectorAll(el);
    this.init(this.el);
  }

  isScrolled(el) {
    let elFake = this.getFake(el);
    if (el.offsetTop < window.scrollY) {
      el.classList.add('scrolled');
      elFake ? elFake.style.display = 'block':false;

      el.style.left = el.offsetLeft;
      el.style.top = el.offsetTop;
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
      this.addEvents(el);
    });
  }

};