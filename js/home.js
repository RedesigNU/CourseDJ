$(document).ready(function(){
    scheduler.config.first_hour = 8;
    scheduler.config.last_hour = 20;
    scheduler.config.start_on_monday = false;
    scheduler.init('scheduler_here', new Date(), "week");
});