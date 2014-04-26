(function(window, document, $, undefined){
    var Caesar;
    Caesar = (function(){
      var base = 'http://vazzak2.ci.northwestern.edu/';
      Caesar.getSubjects = function(cb){
        $.get(base + 'subjects').done(function(data, textStatus, jqXHR){
          cb(undefined, data);
        }).fail(function(jqXHR, textStatus, err){
          cb(err, undefined);
        });
      };
      Caesar.getTerms = function(cb){
        $.get(base + 'terms').done(function(data, textStatus, jqXHR){
          cb(undefined, data);
        }).fail(function(jqXHR, textStatus, err){
          cb(err, undefined);
        });
      };
      Caesar.getCourses = function(term, subject, cb){
        $.get(base + 'courses/?term=' + term + '&subject=' + subject).done(function(data, textStatus, jqXHR){
          cb(undefined, data);
        }).fail(function(jqXHR, textStatus, err){
          cb(err, undefined);
        });
      };
      Caesar.getTermCourses = function(term, cb){
        var termCourses = [];
        var counter = 0;
        Caesar.getSubjects(function(err, subjects) {
          if (err)
            return cb(err, undefined);
          $.each(subjects, function(indexInArray, valueOfElement) {
            Caesar.getCourses(term, valueOfElement.symbol, function(err, courses) {
              if (err)
                return cb(err, undefined);
              termCourses = termCourses.concat(courses);
              counter += 1;
              if (counter == subjects.length - 1)
                cb(undefined, termCourses);
            });
          });
        });
      }
      function Caesar(){}
      return Caesar;
    }());

    /*
     * SEARCH FUNCTION
     */
    $(document).ready(function() {

      // Create a set of functions
      var timer;
      var stopTypeInterval = 100;

      // On key up, start counting down
      $('#classSearchBar').keyup(function(e) {
        clearTimeout(timer);

        if (e.keyCode != 32) {
          timer = setTimeout(stopType, stopTypeInterval);
        }
      });

      // On key down, clear the countdown
      $('#classSearchBar').keydown(function() {
        clearTimeout(timer);
      });

      function stopType() {
        var subject = $('#classSearchBar').val().split(" ")[0];
        var classCode = $('#classSearchBar').val().split(" ")[1];

        console.log(subject);
        console.log(classCode);
        
        // If the search form is not undefined/empty - commence searching
        if (!($('#classSearchBar').val() == undefined || $('#classSearchBar').val() === "")) {
          // Create an empty array to add stuff to
          var searchResults = [];

          // Limit the number of elements to return
          var resultLimit = 7;

          // If the search form contains a subject but no catalog_num - search by subject
          if (classCode == undefined || classCode === "") {
            Caesar.getCourses(4540, subject, function(err, courses) {
              $.grep(courses, function(element, index) {
                
                if (searchResults.length < resultLimit) {
                  searchResults.push(element);
                }
              });

              // Add it to the website!
              $('#results').empty();
              $.grep(searchResults, function(element, index) {
                $('#results').append("<div>" + element.title + " " + "(" + element.catalog_num + ") </div>");
              });
            });

          // If the search form contains a subject and a catalog_num - search by both
          } else {
            Caesar.getCourses(4540, subject, function(err, courses) {
              $.grep(courses, function(element, index) {

                // Grep through courses of a subject and search for number given - if it matches, add it
                if (element.catalog_num.startsWith(classCode) && searchResults.length < resultLimit) {
                  searchResults = searchResults.concat(element);
                }
              });

              // Add it to the website!
              $('#results').empty();
              $.grep(searchResults, function(element, index) {
                $('#results').append("<div>" + element.title + " " + element.catalog_num + "</div>");
              });
            });
          }
        }
      }
    });
}).call(this, window, window.document, window.jQuery);

