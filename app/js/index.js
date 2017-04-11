import '../style/app.scss';
import $ from 'jquery';
// Import each of the images in the images folder.
const requireAll = (r) => {
  r.keys().forEach(r);
};
requireAll(
  require.context(
    '../assets/images',
    true,
    /.(jpg|JPG|png)/
  )
);

if (process.env.NODE_ENV !== 'production') {
  require('../index.html');
}

/**
 * Your javascript code here.
 */
const disableList = ['six'];

$(document).ready(function () {
  let screenWidth = $('.content-container').width();

  $('a.introducing').click(function () {
    if (screenWidth < 1450) {
      $('.introduction-video').toggle();
      $('.textContent').toggle();
    } else {
      $('.introduction-video').toggle();
    }
  });

  $('.js-block-navItem').each(function () {
    const id = $(this).attr('id');
    if (disableList.indexOf(id) >= 0) {
      $(this).addClass('navItem--disable');
      $(this).on('click', function (e) {
        e.preventDefault();
      });
      const markup = '<span class="navItem__lockOverlay"><img src="https://bblearn.griffith.edu.au/bbcswebdav/xid-11624263_1" alt=""></span>';
      $(this).append(markup);
    }
  });


  $(window).on('resize', function () {
    screenWidth = $('.content-container').width();
    $('.introduction-video').hide();
    $('.textContent').show();
  });
});


// $('a.learn').click(function(){
//   console.log("test");
//   $('.visualize-video').toggle();
//   $('.introduction-video').hide();
// });
