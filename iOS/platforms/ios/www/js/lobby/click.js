function click_handler(event){
    //console.log(swipe_dist);
    if(loading || mouse_move_dist > canvas_width * 0.03){
        return;
    }
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    
    if(isBigSpin){
        wheel_click_manager(x,y);
        return;
    }
    if(mode >= 0 && mode < 100){
        login_click_handler(x,y);
    } else if(mode >= 100 && mode < 200){
        lobby_click_handler(x,y);   
    }
}

function mousewheelhandler(e){
    //console.log(e.wheelDelta);
    var value = e.wheelDelta / 120;
    if(mode == 101){
        if(language_dropdown){
            if(value < 0){
                //console.log("Scrolling Down");
                if(dd_scroll < language_list.length - 6){
                    dd_scroll++;
                } else{
                    dd_scroll = language_list.length - 6;
                }
            } else {
                //console.log("Scrolling Up");
                if(dd_scroll > 0){
                    dd_scroll--;
                } else{
                    dd_scroll = 0;
                }
            }
        }
    }
}