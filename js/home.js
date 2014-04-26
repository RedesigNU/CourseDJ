$(document).ready(function(){
    scheduler.config.first_hour = 7;
    scheduler.config.last_hour = 24;
    scheduler.config.start_on_monday = false;
    scheduler.config.dblclick_create = false;
    scheduler.config.mark_now = true;
    scheduler.init('scheduler_here', new Date(), "week"); //Set for 1st week of qtr here

    scheduler.attachEvent("onBeforeDrag", function(id, mode, e){
        return false;
    });

    scheduler.attachEvent("onClick", function(id, e){
        console.log(id);
        console.log(scheduler.getEvent(id));
        $('#myModal .modal-body').html(scheduler.getEvent(id).longText);
        $('#myModal').modal();
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
});