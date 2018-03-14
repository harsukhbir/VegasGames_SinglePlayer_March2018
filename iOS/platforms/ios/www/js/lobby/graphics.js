function draw_flash(){
    auto_size_text(flash_text, canvas_width * 0.7, canvas_height);
    context.fillStyle = "rgba(1,0,0,0.7)";
    context.fillText(flash_text, canvas_width * 0.15, canvas_height * 0.6);
}

function flash(text){
    return;
    flash_text = text;
    flash_timer = 200;
}

function draw_lobby_main(){
    //music_update();
    timer_update();
    

    var should_draw = true;
    var now = new Date().getTime();
    if(now - last_draw < frame_rate){
        should_draw = false;
        last_draw = now;
    }
    
    if(loading && should_draw){
        draw_load();
        return;
    }

    if(!lobby_can_draw)
        return;    
    if(mode >= 0 && mode < 100 && should_draw){
        draw_login();
    } else if(mode >= 100 && mode <= 200 && should_draw){
        draw_lobby();
    }
    if(flash_timer > 0){
        draw_flash();
        flash_timer--;
    }
    
    
    if(isBigSpin && should_draw){
        wheel_graphics();
    }
    load_complete();
}


