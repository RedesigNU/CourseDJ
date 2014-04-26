(function(window, document, $, undefined){
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0;
      };
    }
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

}).call(this, window, window.document, window.jQuery);

