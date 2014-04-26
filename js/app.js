(function(window, document, $, undefined){
  var timeslots;

  var Timeslot;
  Timeslot = (function() {
    Timeslot.fromClass = function(p_class) {
      var timeslots = [];
      var numTimeslots = p_class.meeting_days.length/2;
      for (ii = 0; ii < numTimeslots; ii++) {
        var currentDay = p_class.meeting_days.substr(ii*2, 2);
        switch (currentDay) {
          case 'Su': 
            currentDay = '04/20/2014';
            break;
          case 'Mo': 
            currentDay = '04/21/2014';
            break;
          case 'Tu': 
            currentDay = '04/22/2014';
            break;
          case 'We': 
            currentDay = '04/23/2014';
            break;
          case 'Th': 
            currentDay = '04/24/2014';
            break;
          case 'Fr': 
            currentDay = '04/25/2014';
            break;
          case 'Sa': 
            currentDay = '04/26/2014';
            break;
        }
        var params = {
          startTime: currentDay + ' ' + p_class.start_time.substr(0, 5),
          endTime: currentDay + ' ' + p_class.end_time.substr(0, 5),
          shortText: p_class.subject + ': ' + p_class.catalog_num,
          longText: 'hello'
        }
        var aTimeslot = new Timeslot(params);
        timeslots.push(aTimeslot);
      }
      return timeslots;
    }

    function Timeslot(params) {
      if (!(this instanceof Timeslot))
        return new Timeslot(params);

      this.startTime = params["startTime"];
      this.endTime = params["endTime"];
      this.shortText = params["shortText"];
      this.longText = params["shortText"];
    }
    return Timeslot;
  })();

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
    //console.log("filtered courses:");
    //console.log(filteredCourses);
      console.log("filtered courses length:");
      console.log(filteredCourses.length);
    console.log(filteredCourses[20]);
    console.log(Timeslot.fromClass(filteredCourses[20]));
    timeslots = Timeslot.fromClass(filteredCourses[20]);
      displayCalendar();
  });

/*    Caesar.getTermCourses('4530', function(err, termCourses) {
    console.log("term courses:");
    console.log(termCourses);
  });*/
  
  function displayCalendar() {
    var scheduleData = [];
    $.each(timeslots, function(index, timeslot) {
      var newData = {};
      newData.id = index + 1;
      newData.text = timeslot.shortText;
      newData.start_date = timeslot.startTime;
      newData.end_date = timeslot.endTime;
      scheduleData.push(newData);
    })
    scheduler.parse(scheduleData, "json");
  }

}).call(this, window, window.document, window.jQuery);