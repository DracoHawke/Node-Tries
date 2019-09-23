
$('document').ready(function(){
  $('#my-carousel').owlCarousel({
      loop:true,
      margin: 10,
      nav: true,
      slideBy:4,
      addClassActive : true,
      //navContainer: "#owlcarousel1",
      autoplay: true,
      transitionStyle : 'fade',
      responsiveRefreshRate : 25,
      responsive:{
          0:{
              items:1
          },
          500:{
              items:2
          },
          1000:{
              items:4
          }
      }
  });
  
  var owl = $('#my-carousel');
  
  $('#owlnext').click(function(){
    owl.trigger('prev.owl.carousel');
  })
  
  $('#owlprev').click(function(){
    owl.trigger('next.owl.carousel');
  })
  
  $('#transitionType').change(function(){
    var newValue = $(this).val();

    //TransitionTypes is owlCarousel inner method.
    owl.data('owlCarousel').transitionTypes(newValue);

    //After change type go to next slide
    owl.trigger('next.owl.carousel');
  });
  
  $('#testimonials1').owlCarousel({
      loop:true,
      margin: 10,
      nav: true,
      slideBy:3,
      addClassActive : true,
      navContainer: "#testimonials1nav",
      autoplay: true,
      transitionStyle : 'fade',
      responsiveRefreshRate : 25,
      responsive:{
          0:{
              items:1
          },
          500:{
              items:2
          },
          1000:{
              items:3
          }
      }
  });
})