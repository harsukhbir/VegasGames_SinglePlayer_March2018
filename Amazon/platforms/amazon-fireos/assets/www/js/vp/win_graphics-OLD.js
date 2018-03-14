function vp_draw_win_graphics(){
    if(win_fall_rate < win_terminal){
        win_fall_rate += win_accel;
    }
    
    if(!win_bounce){
        win_top += win_fall_rate;
        if(win_top >= win_lowest){
            win_bounce = true;
            win_top = win_lowest;
            win_fall_rate = 1;
        }
    } else{
        win_top -= win_fall_rate;
        if(win_top <= win_stop){
            win_top = win_stop;
        }
    }
    
    
    var win_width = canvas_width * 0.8;
    var win_left = canvas_width * 0.1;
    context.drawImage(win_bar, win_left, win_top, win_width, win_height);
    context.fillStyle = "#ffffff";
    auto_size_text("Royal Flush", canvas_width * 0.2, win_height);
    context.fillText(hand_type + "     " + last_winning, win_left + win_width * 0.2, win_top + win_height * 0.6);
}

function vp_reset_win_graphics(){
    win_height = canvas_height * 0.2;
    win_top = -win_height;
    win_lowest = canvas_height * 0.55;
    win_stop = canvas_height * 0.5;
    win_bounce = false;
    
/*    
    win_fall_rate = 0.5;
    win_accel = 0.25;
    win_terminal = 4.5;
*/

    win_fall_rate = 0.6;
    win_accel = 0.09;
    win_terminal = 5.9;
}
