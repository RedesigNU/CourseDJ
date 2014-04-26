$(document).ready(function(){
    scheduler.config.first_hour = 8;
    scheduler.config.last_hour = 26;
    scheduler.config.start_on_monday = false;
    scheduler.config.dblclick_create = false;
    scheduler.init('scheduler_here', new Date(), "week"); //Set for 1st week of qtr here
    
    var sample = [
    {id:1, text:"Meeting",   start_date:"04/20/2014 14:00",end_date:"04/20/2014 17:00", color:"red"},
    {id:2, text:"Conference",start_date:"04/22/2014 12:00",end_date:"04/22/2014 14:00", color:"blue"},
    {id:3, text:"Interview", start_date:"04/24/2014 09:00",end_date:"04/24/2014 10:00", color:"green"}
    ];

    scheduler.attachEvent("onBeforeDrag", function(id, mode, e){
        return false;
    });

    scheduler.attachEvent("onClick", function(id, e){
        console.log(id);
        return false;

    });
    scheduler.config.drag_create = false;
    scheduler.attachEvent("onBeforeEventCreated", function(id, mode, e){
        console.log("hi2");
        return false;
    });

    scheduler.attachEvent("onBeforeEventDisplay", function(id,view){
    console.log("Hi3");
    return false;
});

    scheduler.parse(sample, "json");//takes the name and format of the data source
});