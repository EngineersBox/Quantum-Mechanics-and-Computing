/*
* Author: Jack Kilrain
* Version: 1.4
* Licensing: All Rights Reserved
* Language: JavaScript + jQuery
*
* Description: In-Line code editor and interpreter
*/
(function (global, $) {
  // Initialise the editor with some default values
  var editor = CodeMirror(document.getElementById("codeeditor"), {
    value: "//DO NOT REMOVE:\n/*jshint esversion: 6*/\n",
    mode: "javascript",
    theme: "monokai",
    lineNumbers: true,
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
  });

  // Check for errors and display them if found
  function checkFormat(editor) {
    var val = editor.getValue()
    var success = JSHINT(val);
    var output = "";
    if (!success) {
      // If the code contains errors iterate through them and create a stack trace (if required) or error listing
      output = "Check format error:\n\n";
      for (var i in JSHINT.errors) {
        var err = JSHINT.errors[i];
        if (null != err) {
          // If the error is not null (undefined) then append it to the return string
          output += err.line + '[' + err.character + ']: ' + err.reason + '\n';
        } else {
          output += "Check format unknown error:\n null";
        }
      }
      return output;
    } else {
      // Return the evalutated string of the editor contents
      return eval(val);
    }
  }
  function clearConsole() {
    $(".result").html("");
  }

  // Create a function to display the passed value inside the console
  global.log = function (str) {
    jQuery(".result").append(jQuery("<div id=\"result-content\">").text(str));
  }

  $(".exec-code").click(function() {
    // Clear the console to prevent content overlap from previous result
    clearConsole();
    var result;
    try {
      // Evaluate the editor with error checking
      result = checkFormat(editor);
      if ((typeof result === 'object') && result.toString) {
        // Convert the result to a string if it is an object
        result = result.toString();
      } else if (typeof result === 'number') {
        // Convert the result to a string if it is an number
        result = "" + result;
      }
    } catch (e) {
      // Display any errors in the code
      result = e.message ? e.message : e;
    }
    if (result) {
      // Append the result to the console
      $(".result").html("<div id=\"result-content\">" + result + "</div>");
    }
  });

  // Clear the console if the 'CLEAR' button is clicked
  $(".clear-console").click(function() {
    clearConsole();
  })

  // Create a refernce for the theme selector element
  var input = document.getElementById("select");

  $('#select').change(function() {
    // Get the selected theme name and change the editor reference to match
    var theme = input.options[input.selectedIndex].textContent;
    editor.setOption("theme", theme);
    location.hash = "#" + theme;
  });

  // Check if the theme exists locally and apply it, otherwise no change propogates
  var selection = (location.hash && location.hash.slice(1)) || (document.location.search && decodeURIComponent(document.location.search.slice(1)));
  if (selection) {
    input.value = selection;
    editor.setOption("theme", selection);
  }

  // Propagate the changes to the editor onto the window
  CodeMirror.on(window, "hashchange", function() {
    if (location.hash.slice(1)) {
      input.value = theme; selectTheme();
    }
  });

  var isSmall = $(window).width() <= 1000;
  $(window).resize(function() {
    if ($(window).width() <= 1000) {
      isSmall = true;
    } else {
      isSmall = false;
    }
  });

  // Check if the options box is not open, if so remove the background
  if (!$(".options-show").prop("checked")) {
    $(".options").css("background", "none");
  }
  if (isSmall) {
    // If it is a small window use alternate background settings, to avoid colour overlap
    $(".options-show").click(function() {
      if ($(".options-show").prop("checked")) {
        // If the options box is not open, open it and apply visibility changes
        $(".theme-selector").css("visibility", "visible").stop().animate({opacity: 1.0}, "fast");
        $(".options").stop().animate({"background-color": "#8395a7"}, "fast");
      } else {
        // Otherwise hide it
        $(".theme-selector").stop().animate({opacity: 0.0}, "fast", function() {
          $(".theme-selector").css("visibility", "hidden");
          $(".options").stop().animate({"background-color": "#272822"}, "fast", function() {
            $(".options").css("background", "none");
          });
          $(".theme-selector").css("background", "none");
        });
      }
    });
  } else {
    // Otherwise use default settings
    $(".options-show").click(function() {
      // If the options box is not open, open it and apply visibility changes
      if ($(".options-show").prop("checked")) {
        $(".theme-selector").css("visibility", "visible").stop().animate({opacity: 1.0}, "fast");
        $(".options").stop().animate({"background-color": "#8395a7"}, "fast");
      } else {
        // Otherwise hide it
        $(".theme-selector").stop().animate({opacity: 0.0}, "fast", function() {
          $(".theme-selector").css("visibility", "hidden");
          $(".options").stop().animate({"background-color": "#222f3e"}, "fast");
          $(".theme-selector").css("background", "none");
        });
      }
    });
  }

})(this, jQuery);
