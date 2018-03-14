function timer_tick(){
    for(var i = 0; i < Timers.length; i++){
        Timers[i].tick(Timers[i]);
    }
}

function timers_init(){
    var d = new Date();
    start_time = d.getTime();
    last_update = start_time;
    last_timer_update = start_time;
}



var Timers = [];
var start_time, last_update, last_timer_update;