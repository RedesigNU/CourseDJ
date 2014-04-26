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
    console.log(filteredCourses[20]);
    console.log(Timeslot.fromClass(filteredCourses[20]));
    timeslots = Timeslot.fromClass(filteredCourses[20]);
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
  }

  displayCalendar();
  
  /*
   * SEARCH FUNCTION
   */
  $(document).ready(function() {

    // When the timer counts down to 0 from 100ms, start the search
    var timer;
    var stoppedTypingInterval = 100;

    // On key UP, clear the timer and restart the count down
    $('#classSearchBar').keyup(function(e) {
      clearTimeout(timer);
      if (e.keyCode != 32) {          // Ignore the space bar
        timer = setTimeout(search, stoppedTypingInterval);
      }
    });

    // On key down, clear the timer but do not restart the count down
    $('#classSearchBar').keydown(function() {
      clearTimeout(timer);
    });

    // The search function itself
    function search() {

      // Split the forum input into left (subject) and right (catalog #) parts
      // i.e. "EECS 211" is split to "EECS" and "211", respectively
      var inputArr = $('#classSearchBar').val().split(" ");
      var subject = inputArr[0];      // LEFT
      var catalogNum = inputArr[1];   // RIGHT
      
      // Search depending on the inputs given by the user
      // If the search form is not undefined/empty, then SEARCH
      if ($('#classSearchBar').val() != undefined &&
          $('#classSearchBar').val() !== "") {

        // Hold search results in a temporary array of the top 'resultLimit' # of JSON objects
        var searchResults = [];
        var resultLimit = 7;

        // CASE 1: Search form contains 'subject' but no 'catalogNum' - search by subject ONLY
        if (catalogNum == undefined || catalogNum === "") {
          Caesar.getCourses(4540, subject, function(err, courses) {

            // Iterate through the search results and store the top 7 values
            $.each(courses, function(index, element) {
              if (searchResults.length < resultLimit) {
                searchResults.push(element);
              }
            });

            // Add it to the website!
            $('#results').empty();
            $.each(searchResults, function(index, element) {
              $('#results').append("<div>[" + element.subject + " " + element.catalog_num + "] " + element.title + "</div>");
            });
          });

        // CASE 2: Search form contains 'subject' and 'catalogNum' - search by BOTH
        } else {
          Caesar.getCourses(4540, subject, function(err, courses) {

            // Iterate through the search results and store the top 7 values that match catalogNum
            $.each(courses, function(index, element) {
              if (searchResults.length < resultLimit && 
                  element.catalog_num.startsWith(catalogNum)) {
                searchResults.push(element);
              }
            });

            // Add it to the website!
            $('#results').empty();
            $.each(searchResults, function(index, element) {
              $('#results').append("<div>[" + element.subject + " " + element.catalog_num + "] " + element.title + "</div>");
            });
          });
        }
      }
    }
  });
  
}).call(this, window, window.document, window.jQuery);