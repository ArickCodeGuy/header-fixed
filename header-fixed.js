// .header position-fixed
// add spacing to top
// headerFake is fake header with top padding to prevent header overlapping body on top
let headerElem = document.querySelector('header.header');
let headerHeight = 0;
let headerFake = document.createElement('div');
headerFake.classList.add('header-fake');
headerElem.after(headerFake);

headerElem.classList.add('position-fixed');
headerResize = function () {
  if (headerHeight != headerElem.clientHeight) {
    headerHeight = headerElem.clientHeight;
    headerFake.style.paddingTop = `${headerElem.clientHeight}px`;
  };
};
headerResize();

window.addEventListener('resize', headerResize, true);