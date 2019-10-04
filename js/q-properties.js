/*
* Author: Jack Kilrain
* Version: 1.6
* Licensing: All Rights Reserved
* Language: JavaScript (jQuery)
*
* Description: Hover events and functionality for measurement and entanglement.
*/

$(document).ready(function() {

  // Initialize the probability and state value variables
  var p1_weight = 0;
  var randNum = 0;

  $(".measurement").hover(
    function() {
      // Generate new probability and a random value to determine the state
      p1_weight = Math.floor(Math.random() * 101);
      randNum = Math.floor(Math.random() * 101);

      if (p1_weight <= randNum) {
        // If the state is within the first probability, set the colour to red
        $(".m-particle").stop().animate({
          backgroundColor: '#ff0000'
        });
      } else {
        $(".m-particle").stop().animate({
          // If the state is not within the first probability, set the colour to blue
          backgroundColor: '#0000ff'
        });
      }
    },
    function() {
      $(".m-particle").stop().animate({
        // When the particle is not being measured (hovered), set the colour to pink
        backgroundColor: '#990099'
      });
  });

  $('.measurement').mouseenter(
    function() {
      // When the mouse hovers over the particle, display the probabilities of each state
      // Values are displayed in the <span></span>
      $('#prob-content-red').html((p1_weight) + "%");
      $('#prob-content-blue').html((100 - p1_weight) + "%");
  });

  $('.measurement').mouseleave(
    function() {
      // When the mouse is not hovering over the particle, don't display any values
      // Values are displayed in the <span></span>
      $('#prob-content-red').html("? %");
      $('#prob-content-blue').html("? %");
  });

  $(".entanglement").hover(
    function() {
      // Generate new probability and a random value to determine the state
      p1_weight = Math.floor(Math.random() * 101);
      randNum = Math.floor(Math.random() * 101);

      if (p1_weight <= randNum) {
        $(".e-particle-1").stop().animate({
          // If the state is within the first probability, set the first particle to red
          backgroundColor: '#ff0000'
        });
        $(".e-particle-2").stop().animate({
          // If the state is within the first probability, set the second particle to blue
          backgroundColor: '#0000ff'
        });
      } else {
        $(".e-particle-1").stop().animate({
          // If the state is not within the first probability, set the first particle to blue
          backgroundColor: '#0000ff'
        });
        $(".e-particle-2").stop().animate({
          // If the state is not within the first probability, set the second particle to red
          backgroundColor: '#ff0000'
        });
      }
    },
    function() {
      $(".e-particle-1").stop().animate({
        // When the system is not being measured (hovered), set the first particle to pink
        backgroundColor: '#990099'
      });
      $(".e-particle-2").stop().animate({
        // When the system is not being measured (hovered), set the second particle to pink
        backgroundColor: '#990099'
      });
  });

  $('.entanglement').mouseenter(
    function() {
      // When the mouse hovers over the particle, display the probabilities of each state
      // Values are displayed in the <span></span>
      $('#ent-prob-content-red').html((p1_weight) + "%");
      $('#ent-prob-content-blue').html((100 - p1_weight) + "%");
  });

  $('.entanglement').mouseleave(
    function() {
      // When the mouse is not hovering over the particle, don't display any values
      // Values are displayed in the <span></span>
      $('#ent-prob-content-red').html("? %");
      $('#ent-prob-content-blue').html("? %");
  });
});
