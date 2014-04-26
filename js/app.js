/*var test1 = {
  start_time: '11:00',
  end_time: '11:50'
};

var test2 = {
  start_time: '11:30',
  end_time: '12:00'
};

var test3 = {
  start_time: '11:00',
  end_time: '11:30'
};

var test4 = {
  start_time: '11:40',
  end_time: '12:00'
};*/

(function(window, document, $, undefined){
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0;
      };
    }

    var groupingIndex = 0;

  var allTimeslots;
  var timeslots;

  var Timeslot;
  Timeslot = (function() {
    Timeslot.fromClass = function(p_class) {
      var timeslots = [];
      var numTimeslots = p_class.meeting_days.length/2;
      for (var ii = 0; ii < numTimeslots; ii++) {
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
          longText: 'hello',
          priority: 1.0,
          grouping: groupingIndex
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
      this.longText = params["longText"];
      this.priority = params["priority"];
      this.grouping = params["grouping"];
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
    timeslots = Timeslot.fromClass(filteredCourses[20]);
    displayCalendar();
  });
  

  function algorithm() {
    //give an array of timeslots
/*    var TimeslotGroup = (function() {
      function TimeslotGroup('group') {
        this.group = group;
      }
      return TimeslotGroup
    })();

    var timeslotGroups = [];
    var currTimeslotGroup = new TimeslotGroup;
    for(var ii = 0; ii < allTimeslots.length; ii++) {
      if (currTimeslotGroup.group.length == 0 || currTimeslotGroup.group[0].grouping == allTimeslots[ii].grouping) {
        currTimeslotGroup.push
      }
    }*/

    function conflict(ts1, ts2) {
      return (ts1.startTime <= ts2.endTime && ts1.startTime >= ts2.startTime ||
          ts2.startTime <= ts1.endTime && ts2.startTime >= ts1.startTime ||
          ts1.startTime <= ts2.startTime && ts1.endTime >= ts2.endTime ||
          ts2.startTime <= ts1.startTime && ts2.endTime >= ts1.endTime);
    }


    //helper function
    function tsgConflict(tsg1, tsg2) {
      for (var ii = 0; ii < tsg1.length; ii++) {
        for (var jj = 0; jj < tsg2.length; jj++) {
          if (conflict(tsg1[ii], tsg2[jj])) {
            return true;
          }
        }
      }
      return false;
    }

    // console.log(allTimeslots);

    //create timeslot groups
    var timeslotGroups = [];
    var currTimeslotGroup = [];
    for (var ii = 0; ii < allTimeslots.length; ii++) {
      var currTimeslot = allTimeslots[ii];
      if (currTimeslotGroup.length == 0 || currTimeslotGroup[0].grouping == currTimeslot.grouping) {
        currTimeslotGroup.push(currTimeslot);
      }
      else {
        timeslotGroups.push(currTimeslotGroup);
        currTimeslotGroup = [];
        currTimeslotGroup.push(currTimeslot);
      }
    }
    timeslotGroups.push(currTimeslotGroup);
    // console.log(timeslotGroups);



    //add all mandatory groups
    var mandatory = [];

    for(var ii = 0; ii < timeslotGroups.length; ii++) {
      if (timeslotGroups[ii][0].priority == 1.0) {
        mandatory.push(timeslotGroups[ii]);
      }
    }

    var mandatoryConflict = false;
    for (var ii = 0; ii < timeslotGroups.length - 1; ii++) {
      for (var jj = 1; jj < timeslotGroups.length; jj++) {
        if (tsgConflict(mandatory[ii], mandatory[jj])) {
          alert(ii + ' ' + jj);
          mandatoryConflict = true;
        }
      }
    }

    if (mandatoryConflict) {
      console.log("mandatory conflict!");
      timeslots = [];
    }
  }
  
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


/*      this.startTime = params["startTime"];
      this.endTime = params["endTime"];
      this.shortText = params["shortText"];
      this.longText = params["longText"];
      this.priority = params["priority"];
      this.grouping = params["grouping"];*/


 /* allTimeslots = 
  [new Timeslot({
    startTime: '11:00',
    endTime: '11:50',
    shortText: 'abc',
    longText: '',
    priority: 1.0,
    grouping: 1
  }),
  new Timeslot({
    startTime: '11:55',
    endTime: '12:00',
    shortText: 'def',
    longText: '',
    priority: 1.0,
    grouping: 2
  }),
  new Timeslot({
    startTime: '11:30',
    endTime: '12:00',
    shortText: 'def',
    longText: '',
    priority: 1.0,
    grouping: 2
  })];


  algorithm();*/

  
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
          subject = subject.toUpperCase();
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
              generateList(index, element);
            });
          });

        // CASE 2: Search form contains 'subject' and 'catalogNum' - search by BOTH
        } else {
          subject = subject.toUpperCase();
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
              generateList(index, element);
            });
          });
        }
      }
    }

    // Populate drop down menu w/ search results
    function generateList(idIn, elementIn) {
      jQuery('<li/>', {
        id: idIn,
        class: "listButton",
        text: "[" + elementIn.subject + " " + elementIn.catalog_num + "-" + elementIn.section + "] " + elementIn.title
      }).click(addCourse).data("courseData", elementIn).appendTo('#results');
    }

    function removeCourse(e) {
      $(this).parent().remove();
    }

    // Add course dropdown list on the left sidebar
    function addCourse(e) {
      $('#added-classes').append(
        $('<div/>', { 'class':"added-class row" }).append(
          $('<div/>', { 'class':"col-lg-1 col-md-1 col-sm-1 col-xs-1" }).append(
            $('<span/>', { 'class':"glyphicon glyphicon-remove" })).click(removeCourse),
          $('<div/>', { 'class':"col-lg-8 col-md-8 col-sm-8 col-xs-8",
                        'text' :$(this).data("courseData").subject + " " +  $(this).data("courseData").catalog_num + "-" + $(this).data("courseData").section }),
          $('<div/>', { 'class':"col-lg-12 col-md-12 col-sm-12 col-xs-12" }).append(
            $('<div/>', { 'class':"btn-group prefs", 'data-toggle':"buttons" }).append(
              $('<label/>', { 'class':"btn btn-default pref", 'text':"Mandatory" }).append(
                $('<input/>', { 'type':"radio", 'name':"options", 'id':"option1" })),
              $('<label/>', { 'class':"btn btn-default pref", 'text':"Preferred" }).append(
                $('<input/>', { 'type':"radio", 'name':"options", 'id':"option2" })),
              $('<label/>', { 'class':"btn btn-default pref", 'text':"Optional" }).append(
                $('<input/>', { 'type':"radio", 'name':"options", 'id':"option3" })))))
        .data('courseData', $(this).data('courseData')));

      /*jQuery('<div/>', {
        class:".added-class.row",
        text: 
      }).append()
      console.log($(this).data("courseData"));*/
    }

    function refreshCalendar() {
      timeslots = [];
      $('.added-class').each(function(index) {
        var courseData = $(this).data('courseData');
        var labels = $(this).find('label');
        var isMandatory = labels.slice(0,1).hasClass('active');
        var isPreferred = labels.slice(1,2).hasClass('active');
        var isOptional  = labels.slice(2,3).hasClass('active');
        console.log(courseData);
        console.log(isMandatory);
        //console.log($(this).children('input')[1].val());
        //console.log($(this).children('input')[2].val());
        timeslots = timeslots.concat(Timeslot.fromClass(courseData));
      });
      // console.log("submit!");
      // console.log(timeslots);
      // console.log("alltimeslots");
      // console.log(allTimeSlots);
      //algorithm();
      displayCalendar();
    }

    $('#submit').click(refreshCalendar);

  });
}).call(this, window, window.document, window.jQuery);