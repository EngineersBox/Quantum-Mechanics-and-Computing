/*
* Author: Jack Kilrain
* Version: 1.3
* Licensing: All Rights Reserved
* Language: JavaScript (jQuery)
*
* Description: Navagation window events, 'down page' arrow events and
*              page initialization events
*/

var is_small_window = false;
var current_pos = 0;
var click_count = 0;
var is_right = false;

$(document).ready(function() {
  if ($(window).width() <= 1000) {
    is_small_window = true;
  }

  $('#super-link').mouseenter(
    function() {
      $('.image-nav').stop().animate({height: "5.5em"}, "fast");
      $('#hover-title').html("Superposition");
  });

  $('#ent-link').mouseenter(
    function() {
      $('.image-nav').stop().animate({height: "5.5em"}, "fast");
      $('#hover-title').html("Entanglement");
  });

  $('#meas-link').mouseenter(
    function() {
      $('.image-nav').stop().animate({height: "5.5em"}, "fast");
      $('#hover-title').html("Measurement");
  });

  $('#wpd-link').mouseenter(
    function() {
      $('.image-nav').stop().animate({height: "5.5em"}, "fast");
      $('#hover-title').html("Wave-Particle Duality");
  });

  $('#super-link, #ent-link, #meas-link, #wpd-link').mouseleave(
    function() {
      $('.image-nav').stop().animate({height: "4em"}, "fast");
      $('#hover-title').html("");
  });

  $('.nav-burger').css("visibility", "hidden");
  $('.nav-burger').stop().click(function() {
    if (click_count == 0) {
      $('.fa-bars').animate({opacity: 0.0}, "fast");
      $('.fa-times').css("visibility", "visible").stop().animate({opacity: 1.0}, "fast");
      $('.side-nav').css("visibility", "visible").stop().animate({right: "0%"}, "fast");
      is_right = true;
      click_count += 1;
    } else {
      $('.fa-times').stop().animate({opacity: 0.0}, "fast", function() {
        $('.fa-times').css("visibility", "hidden");
      });
      $('.fa-bars').css("visibility", "visible").animate({opacity: 1.0}, "fast");
      if (is_small_window == false) {
        $('.side-nav').stop().animate({right: "-41%"}, "fast");
      } else {
        $('.side-nav').stop().animate({right: "-110%"}, "fast");
      }
      is_right = false;
      click_count -= 1;
    }
  });
  $('.side-nav').click(function() {
    if (click_count != 0) {
      $('.fa-times').stop().animate({opacity: 0.0}, "fast", function() {
        $('.fa-times').css("visibility", "hidden");
      });
      $('.fa-bars').css("visibility", "visible").stop().animate({opacity: 1.0}, "fast");
      if (is_small_window == false) {
        $('.side-nav').stop().animate({right: "-41%"}, "fast");
      } else {
        $('.side-nav').stop().animate({right: "-110%"}, "fast");
      }
      is_right = false;
      click_count -= 1;
    }
  });
});

$(window).resize(function() {
  if ($(window).width() <= 1000) {
    is_small_window = true;
    if (current_pos > 0) {
      $('.nav-burger, .fa-bars').css("visibility", "visible");
      $('.side-nav').css("right", "-120%");
    } else {
      $('.nav-burger, .fa-bars').css("visibility", "visible");
      $('.side-nav').css("right", "-120%");
    }
  } else {
    is_small_window = false;
    if (current_pos > 0) {
      $('.nav-burger, .fa-bars').css("visibility", "visible");
      $('.side-nav').css("right", "-120%");
    } else {
      $('.nav-burger, .fa-bars').css("visibility", "hidden");
    }
  }
});

$(document).scroll(function() {
  var top_dist = $(this).scrollTop() > 250;
  current_pos = top_dist;
  $('.scrollFade, .down-button').stop();
  if (top_dist > 0) {
    $('.landing').css("z-index", "-1");
    $('.scrollFade').fadeOut();
    $('.down-button').fadeOut();
    if (is_small_window == false) {
      $('.nav-burger, .fa-bars').css("visibility", "visible");
    } else {
      $('.nav-burger, .fa-bars').css("visibility", "visible");
    }
  } else {
    $('.landing').css("z-index", "0");
    $('.scrollFade').fadeIn();
    $('.down-button').fadeIn();
    if (click_count != 0 && is_right == true) {
      $('.fa-times').stop().animate({opacity: 0.0}, "fast", function() {
        $('.fa-times').css("visibility", "hidden");
      });
      $('.fa-bars').css("visibility", "visible").stop().animate({opacity: 1.0}, "fast");
      $('.side-nav').stop().animate({right: "-41%"}, "fast");
      click_count -=1;
    }
    if (is_small_window == false) {
      $('.nav-burger, .fa-bars').css("visibility", "hidden");
    } else {
      $('.nav-burger, .fa-bars').css("visibility", "visible");
    }
  }
});
