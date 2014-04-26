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

    $(document).ready(function() {

      // Conditions that will trigger a search
      var timer;
      var stopTypeInterval = 500;

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
        
        // If the input box is not empty
        if (!($('#classSearchBar').val() == undefined || $('#classSearchBar').val() === "")) {
          
          // User has input a subject but no classCode
          if (classCode == undefined || classCode === "") {
            Caesar.getCourses(4530, subject, function(err, courses) {
              console.log(courses);
            });
          // User has input both a subject and a classCode
          } else {
            Caesar.getCourses(4530, subject, function(err, courses) {
              console.log(courses);
            });
          }
        }

        // User has input both a subject and a classCode


      }
    });

}).call(this, window, window.document, window.jQuery);

