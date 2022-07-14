'use strict';
/* 
  COMMENT: Selection 
*/
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const allSections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

/* 
  COMMENT: Modal window 
*/
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  //=== getBoundingClientRect() used masseurs according to visible viewport  ===//
  const s1cords = section1.getBoundingClientRect();

  //=== modern way for modern browsers  ===//
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  //=== matching strategy  ===//
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/* 
  COMMENT: Tab component
*/
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  //=== activate tab button  ===//
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //=== activate tab content  ===//
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/* 
  COMMENT: Menu fade animation
*/
const handleNavHover = function (event, opacity, scale) {
  if (event.target.classList.contains('nav__link')) {
    const target = event.target;
    const siblings = target.closest('.nav').querySelectorAll('.nav__link');
    const logo = target.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== target) {
        el.style.opacity = opacity;
        el.style.transform = scale;
      }
    });
    logo.style.opacity = opacity;
    // logo.style.transform = scale;
  }
};

nav.addEventListener('mouseover', function (e) {
  handleNavHover(e, 0.5, 'scale(.9)');
});
nav.addEventListener('mouseout', function (e) {
  handleNavHover(e, 1, 'scale(1)');
});

/* 
  COMMENT: Sticky Navigation with intersection observer API
*/
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/* 
  COMMENT: Reveal Section Animation
*/
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/* 
  COMMENT: Lazy loading images
*/
const loadImages = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //=== replace src with data-src  ===//
  entry.target.setAttribute('src', entry.target.dataset.src);

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  //=== stop observing  ===//
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImages.forEach(img => {
  imageObserver.observe(img);
});

/* 
  COMMENT: Slider
*/
// slider.style.overflow = 'visible';
const carouselSlider = function () {
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //=== slider dots  ===//
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //=== activate dots  ===//
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //=== initialization  ===//
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  let currentSlide = 0;
  let maxSlide = slides.length - 1;

  //=== next slide  ===//
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  sliderBtnRight.addEventListener('click', nextSlide);

  //=== previous slide  ===//
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  sliderBtnLeft.addEventListener('click', prevSlide);

  //=== next and prev using arrow key  ===//
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    const { slide } = e.target.dataset;

    goToSlide(slide);

    activateDot(slide);
  });
};

carouselSlider();
