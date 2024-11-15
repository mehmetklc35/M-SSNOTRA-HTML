const btnHamburger = document.querySelector('#btn-hamburger');
const body = document.querySelector('body');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeEls = document.querySelectorAll('.has-fade');

btnHamburger.addEventListener('click', () => {
  if (header.classList.contains('open')) {
    // Close Hamburger
    body.classList.remove('no-scroll');
    header.classList.remove('open');
    fadeEls.forEach(el => {
      el.classList.remove('fade-in');
      el.classList.add('fade-out');
    });
  } else {
    // Open Hamburger
    body.classList.add('no-scroll');
    header.classList.add('open');
    fadeEls.forEach(el => {
      el.classList.add('fade-in');
      el.classList.remove('fade-out');
    });
  }
});

// Image-Slider
var slideshowDuration = 3000;
var slideshow = $('.main-content .slideshow');

function slideshowSwitch(slideshow, index, auto) {
  if (slideshow.data('wait')) return;

  var slides = slideshow.find('.slide');
  var pages = slideshow.find('.pagination');
  var activeSlide = slides.filter('.is-active');
  var activeSlideImage = activeSlide.find('.image-container');
  var newSlide = slides.eq(index);
  var newSlideImage = newSlide.find('.image-container');
  var newSlideContent = newSlide.find('.slide-content');
  var newSlideElements = newSlide.find('.caption > *');
  if (newSlide.is(activeSlide)) return;

  newSlide.addClass('is-new');
  var timeout = slideshow.data('timeout');
  clearTimeout(timeout);
  slideshow.data('wait', true);
  var transition = slideshow.attr('data-transition');
  if (transition == 'fade') {
    newSlide.css({
      display: 'block',
      zIndex: 2,
    });
    newSlideImage.css({
      opacity: 0,
    });

    TweenMax.to(newSlideImage, 1, {
      alpha: 1,
      onComplete: function () {
        newSlide.addClass('is-active').removeClass('is-new');
        activeSlide.removeClass('is-active');
        newSlide.css({ display: '', zIndex: '' });
        newSlideImage.css({ opacity: '' });
        slideshow.find('.pagination').trigger('check');
        slideshow.data('wait', false);
        if (auto) {
          timeout = setTimeout(function () {
            slideshowNext(slideshow, false, true);
          }, slideshowDuration);
          slideshow.data('timeout', timeout);
        }
      },
    });
  } else {
    if (newSlide.index() > activeSlide.index()) {
      var newSlideRight = 0;
      var newSlideLeft = 'auto';
      var newSlideImageRight = -slideshow.width() / 8;
      var newSlideImageLeft = 'auto';
      var newSlideImageToRight = 0;
      var newSlideImageToLeft = 'auto';
      var newSlideContentLeft = 'auto';
      var newSlideContentRight = 0;
      var activeSlideImageLeft = -slideshow.width() / 4;
    } else {
      var newSlideRight = '';
      var newSlideLeft = 0;
      var newSlideImageRight = 'auto';
      var newSlideImageLeft = -slideshow.width() / 8;
      var newSlideImageToRight = '';
      var newSlideImageToLeft = 0;
      var newSlideContentLeft = 0;
      var newSlideContentRight = 'auto';
      var activeSlideImageLeft = slideshow.width() / 4;
    }

    newSlide.css({
      display: 'block',
      width: 0,
      right: newSlideRight,
      left: newSlideLeft,
      zIndex: 2,
    });

    newSlideImage.css({
      width: slideshow.width(),
      right: newSlideImageRight,
      left: newSlideImageLeft,
    });

    newSlideContent.css({
      width: slideshow.width(),
      left: newSlideContentLeft,
      right: newSlideContentRight,
    });

    activeSlideImage.css({
      left: 0,
    });

    TweenMax.set(newSlideElements, { y: 20, force3D: true });
    TweenMax.to(activeSlideImage, 1, {
      left: activeSlideImageLeft,
      ease: Power3.easeInOut,
    });

    TweenMax.to(newSlide, 1, {
      width: slideshow.width(),
      ease: Power3.easeInOut,
    });

    TweenMax.to(newSlideImage, 1, {
      right: newSlideImageToRight,
      left: newSlideImageToLeft,
      ease: Power3.easeInOut,
    });

    TweenMax.staggerFromTo(
      newSlideElements,
      0.8,
      { alpha: 0, y: 60 },
      { alpha: 1, y: 0, ease: Power3.easeOut, force3D: true, delay: 0.6 },
      0.1,
      function () {
        newSlide.addClass('is-active').removeClass('is-new');
        activeSlide.removeClass('is-active');
        newSlide.css({
          display: '',
          width: '',
          left: '',
          zIndex: '',
        });

        newSlideImage.css({
          width: '',
          right: '',
          left: '',
        });

        newSlideContent.css({
          width: '',
          left: '',
        });

        newSlideElements.css({
          opacity: '',
          transform: '',
        });

        activeSlideImage.css({
          left: '',
        });

        slideshow.find('.pagination').trigger('check');
        slideshow.data('wait', false);
        if (auto) {
          timeout = setTimeout(function () {
            slideshowNext(slideshow, false, true);
          }, slideshowDuration);
          slideshow.data('timeout', timeout);
        }
      }
    );
  }
}

function slideshowNext(slideshow, previous, auto) {
  var slides = slideshow.find('.slide');
  var activeSlide = slides.filter('.is-active');
  var newSlide = null;
  if (previous) {
    newSlide = activeSlide.prev('.slide');
    if (newSlide.length === 0) {
      newSlide = slides.last();
    }
  } else {
    newSlide = activeSlide.next('.slide');
    if (newSlide.length == 0) newSlide = slides.filter('.slide').first();
  }

  slideshowSwitch(slideshow, newSlide.index(), auto);
}

function homeSlideshowParallax() {
  var scrollTop = $(window).scrollTop();
  if (scrollTop > windowHeight) return;
  var inner = slideshow.find('.slideshow-inner');
  var newHeight = windowHeight - scrollTop / 2;
  var newTop = scrollTop * 0.8;

  inner.css({
    transform: 'translateY(' + newTop + 'px)',
    height: newHeight,
  });
}

$(document).ready(function () {
  $('.slide').addClass('is-loaded');

  $('.slideshow .arrows .arrow').on('click', function () {
    slideshowNext($(this).closest('.slideshow'), $(this).hasClass('prev'));
  });

  $('.slideshow .pagination .item').on('click', function () {
    slideshowSwitch($(this).closest('.slideshow'), $(this).index());
  });

  $('.slideshow .pagination').on('check', function () {
    var slideshow = $(this).closest('.slideshow');
    var pages = $(this).find('.item');
    var index = slideshow.find('.slides .is-active').index();
    pages.removeClass('is-active');
    pages.eq(index).addClass('is-active');
  });

  /* Lazyloading
$('.slideshow').each(function(){
  var slideshow=$(this);
  var images=slideshow.find('.image').not('.is-loaded');
  images.on('loaded',function(){
    var image=$(this);
    var slide=image.closest('.slide');
    slide.addClass('is-loaded');
  });
*/

  var timeout = setTimeout(function () {
    slideshowNext(slideshow, false, true);
  }, slideshowDuration);

  slideshow.data('timeout', timeout);
});

if ($('.main-content .slideshow').length > 1) {
  $(window).on('scroll', homeSlideshowParallax);
}

// Gallery
// Gallery image hover
$('.img-wrapper').hover(
  function () {
    $(this).find('.img-overlay').animate({ opacity: 1 }, 600);
  },
  function () {
    $(this).find('.img-overlay').animate({ opacity: 0 }, 600);
  }
);

// Lightbox
var $overlay = $('<div id="overlay"></div>');
var $image = $('<img>');
var $prevButton = $(
  '<div id="prevButton"><i class="fa fa-chevron-left"></i></div>'
);
var $nextButton = $(
  '<div id="nextButton"><i class="fa fa-chevron-right"></i></div>'
);
var $exitButton = $('<div id="exitButton"><i class="fa fa-times"></i></div>');

// Add overlay
$overlay
  .append($image)
  .prepend($prevButton)
  .append($nextButton)
  .append($exitButton);
$('#gallery').append($overlay);

// Hide overlay on default
$overlay.hide();

// When an image is clicked
$('.img-overlay').click(function (event) {
  // Prevents default behavior
  event.preventDefault();
  // Adds href attribute to variable
  var imageLocation = $(this).prev().attr('href');
  // Add the image src to $image
  $image.attr('src', imageLocation);
  // Fade in the overlay
  $overlay.fadeIn('slow');
});

// When the overlay is clicked
$overlay.click(function () {
  // Fade out the overlay
  $(this).fadeOut('slow');
});

// When next button is clicked
$nextButton.click(function (event) {
  // Hide the current image
  $('#overlay img').hide();
  // Overlay image location
  var $currentImgSrc = $('#overlay img').attr('src');
  // Image with matching location of the overlay image
  var $currentImg = $('#image-gallery img[src="' + $currentImgSrc + '"]');
  // Finds the next image
  var $nextImg = $($currentImg.closest('.image').next().find('img'));
  // All of the images in the gallery
  var $images = $('#image-gallery img');
  // If there is a next image
  if ($nextImg.length > 0) {
    // Fade in the next image
    $('#overlay img').attr('src', $nextImg.attr('src')).fadeIn(800);
  } else {
    // Otherwise fade in the first image
    $('#overlay img').attr('src', $($images[0]).attr('src')).fadeIn(800);
  }
  // Prevents overlay from being hidden
  event.stopPropagation();
});

// When previous button is clicked
$prevButton.click(function (event) {
  // Hide the current image
  $('#overlay img').hide();
  // Overlay image location
  var $currentImgSrc = $('#overlay img').attr('src');
  // Image with matching location of the overlay image
  var $currentImg = $('#image-gallery img[src="' + $currentImgSrc + '"]');
  // Finds the next image
  var $nextImg = $($currentImg.closest('.image').prev().find('img'));
  // Fade in the next image
  $('#overlay img').attr('src', $nextImg.attr('src')).fadeIn(800);
  // Prevents overlay from being hidden
  event.stopPropagation();
});

// When the exit button is clicked
$exitButton.click(function () {
  // Fade out the overlay
  $('#overlay').fadeOut('slow');
});

// Back-To-Top
var btn = $('#button-top');

$(window).scroll(function () {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, '300');
});

// Accordion Action
const accordionItem = document.querySelectorAll('.accordion-item');
const filterItems = document.querySelector('.filters-items');

accordionItem.forEach(el =>
  el.addEventListener('click', () => {
    // if (el.classList.contains('active')) {
    //   el.classList.remove('active');
    // } else {
    accordionItem.forEach(el2 => el2.classList.remove('active'));
    el.classList.add('active');
  })
);

$('a.like-button').on('click', function (e) {
  $(this).toggleClass('liked');

  setTimeout(() => {
    $(e.target).removeClass('liked');
  }, 1000);
});

// Get the modal
const modal = document.querySelector('#myModal');

// Get the button that opens the modal
const btn12 = document.querySelectorAll('.filter-mobile-menu');

// Get the <span> element that closes the modal
const closeModal = document.getElementsByClassName('close')[0];
const body1 = document.querySelector('body');

for (let i = 0; i < btn12.length; i++) {
  btn12[i].addEventListener('click', function () {
    modal.style.display = 'block';
    body1.style.overflowY = 'hidden';
  });
}

// When the user clicks the button, open the modal
btn12.onclick = function () {
  modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function () {
  modal.style.display = 'none';
  body1.style.overflowY = 'auto';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// const thumbs = document.querySelector('.thumb-img').children;

function changeImage(event) {
  document.querySelector('.pro-img').src = event.children[0].src;

  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.remove('active');
  }
  event.classList.add('active');
}
