(function(window, document, $, undefined){
    var Caesar;
    Caesar = (function(){
      var base = 'http://vazzak2.ci.northwestern.edu/';

      var loadedTerms = {};

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
        if(term in loadedTerms && subject in loadedTerms[term]) {
          return cb(undefined, loadedTerms[term][subject]);
        }
        $.get(base + 'courses/?term=' + term + '&subject=' + subject).done(function(data, textStatus, jqXHR){
          loadedTerms[term] = loadedTerms[term] || {};
          loadedTerms[term][subject] = data;
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

    Caesar.getCourses('4530', 'MATH', function(err, courses) {
      var filteredCourses = courses;
/*      filteredCourses = $.grep(courses, function(course) {
        return course.seats > 50;
      });*/
      console.log("filtered courses:");
      console.log(filteredCourses);
    });

/*    Caesar.getTermCourses('4530', function(err, termCourses) {
      console.log("term courses:");
      console.log(termCourses);
    });*/
}).call(this, window, window.document, window.jQuery);