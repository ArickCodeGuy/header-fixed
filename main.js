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
    this.$el = [];
    this.options = Object.assign({}, defaultOptions, options);
    this.options.init === true ? this.init(): false;
  }

  // binding eveng listeners
  onScroll = e => this.handleScroll.call(this)
  onResize = e => this.handleResize.call(this)

  handleScroll() {
    this.$el.forEach(el => {
      const fake = this.getFake(el);

      let topOffset;
      typeof this.options.topOffset === 'number' ? topOffset = this.options.topOffset: false;
      // this should be calculated better
      if (HTMLElement.prototype.isPrototypeOf(this.options.topOffset)) {
        let elPos = topOffset.getBoundingClientRect();
        topOffset = this.options.topOffset.clientHeight + elPos.y;
      }

      if (el.dataset.stickyOffsetTop - topOffset  < window.scrollY) {
        el.classList.add('scrolled');
        fake.style.display = 'block';
        Object.assign(el.style, {
          left: `${el.offsetLeft}px`,
          top: `${topOffset}px`,
          position: 'fixed',
        })
      }else {
        el.classList.remove('scrolled');
        fake.style.display = 'none';
        el.style.position = '';
      };
    })
  }

  stopElementFunc(el) {
    // if (!HTMLElement.prototype.isPrototypeOf(this.options.stopElement)) {throw 'stopElement is not an HTMLElement'};
    // let stopElement = this.options.stopElement;
    // const stopState = 
    //   scrollY > stopElement.offsetTop - el.offsetHeight - el.offsetTop;
    // if (stopState) {
    //   const pos = stopElement.offsetTop - el.offsetHeight - scrollY;
    //   Object.assign(el.style, {
    //     top: `${pos}px`
    //   });
    // };
    // return stopState
  }

  createFake(el) {
    const fake = document.createElement('div');
    fake.classList.add('sticky-el-fake');
    this.options.fakeDivClass && typeof this.options.fakeDivClass === 'string' ? fake.classList.add(this.options.fakeDivClass): false;
    Object.assign(fake.style, {
      display: 'none',
      height: `${el.clientHeight}px`,
      // needs to be computed not inline
      // marginTop: elObj.el.style.marginTop,
      // marginBottom: elObj.el.style.marginBottom,
      // marginLeft: elObj.el.style.marginLeft,
      // marginRight: elObj.el.style.marginRight,
    })
    el.after(fake);
  }

  getFake(el) {
    const fake = el.nextElementSibling;
    if (!fake.classList.contains('sticky-el-fake')) {throw 'cant find fake div'};
    return fake
  }

  dataPositionSetter(el) {
    const style = getComputedStyle(el);
    const fake = this.getFake(el);
    // if position of element is set fo 'fixed', then use position of .fake-div
    if (style.position !== 'fixed' || style.position !== 'absolute') {
      el.dataset.stickyOffsetTop = el.offsetTop;
    }else {
      el.dataset.stickyOffsetTop = fake.offsetTop;
    }
  }

  handleResize() {
    this.$el.forEach(el => {
      const fake = this.getFake(el);
      fake ? fake.style.height = `${el.clientHeight}px`: false;
    });
  }

  addEvents() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
  }

  initSingleElement(el) {
    // elObj is var that get's passed through all functions so we don't use querySelector each time we need some element
    this.createFake(el);
    this.dataPositionSetter(el);
  }

  initArray(arr) {
    arr.forEach((el) => this.initSingleElement(el));
  }

  init() {
    // if string is specified
    if (typeof this.el === 'string') {
      const el = document.querySelectorAll(this.el);
      this.$el = [...el];
      el ? this.initArray(el): false;
    };
    this.addEvents();
  };

  destroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    this.$el.forEach(el => {
      const fake = this.getFake(el);
      fake.remove();
      el.style = '';
      el.removeAttribute('data-sticky-offset-top'); 
    })
  }
};