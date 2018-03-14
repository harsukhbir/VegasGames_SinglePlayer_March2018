function Loop(){
    if(!Engine.running)
        return;
    
    // Locking frame rate for consistent performance
    var d = new Date();
    var now = d.getTime();
    if(now - last_update > frame_rate / 1000){
        run_routines();
        draw();
        last_update = now;
    }
    // Ticking Timers 100 x per second
    if(now - last_timer_update > 10){
        timer_tick();
        last_timer_update = now;
    }
}

function run_routines(){
    for(var i = 0; i < routines.length; i++){
        routines[i]();
    }
}



function change_mode(new_mode){
    screens[mode].onExit();
    mode_prev = mode;
    mode = new_mode;
    screens[mode].onOpen();
}

var mode_prev = 0;
var graphics_queue = [];