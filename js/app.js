(function(window, document, $, undefined){
    var Caesar;
    Caesar = (function(){
      var base = 'http://vazzak2.ci.northwestern.edu/';
      Caesar.getSubjects = function(cb){
        return $.get(base + 'subjects').done(function(data, textStatus, jqXHR){
          return cb(undefined, JSON.parse(data));
        }).fail(function(jqXHR, textStatus, err){
          return cb(err, undefined);
        });
      };
      function Caesar(){}
      return Caesar;
    }());
    Caesar.getSubjects(function(subjects) {
      console.log(subjects);
    });
}).call(this, window, window.document, window.jQuery);