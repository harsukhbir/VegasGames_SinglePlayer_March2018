function initialize_click(){
    canvas.addEventListener('click', click_handler, false);
}

function check_click(obj, x, y){
    KenoAudioManager.on_click();
    var transform = [canvas.width * obj.transform[0],
                    canvas.height * obj.transform[1],
                    canvas.width * obj.transform[2],
                    canvas.height * obj.transform[3]];

    if(x >= transform[0] && x <= transform[0] + transform[2]){
        if(y >= transform[1] && y <= transform[1] + transform[3]){
            if(obj.interactable && obj.visible){
                if(obj.arg == null)
                    obj.onClick();
                else
                    obj.onClick(obj.arg);
                return true;
            }
        }
    }
    return false;
}

function keno_big_spin_listener(event){
    var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    if(isBigSpin){
        wheel_click_manager(x,y);
        return;
    }
}

function click_handler(event){
    var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    if(show_payout){
        payout_click(x,y);
        return;
    }
    
    if(isBigSpin){
        wheel_click_manager(x,y);
        return;
    }

    if(mode == 3 && Math.floor(experience / 100) > Math.floor((experience - 15) / 100)){
        console.log("Big Spin Trigger");
        wheel_init(function(){isBigSpin = false; update_money_display();new_game_btn_click();});
        return;
    }
    
    
    if(store_open){
        store_click(x,y);
    }
    
    for(var i = 0; i < screens[mode].drawables.length; i++){
        if(click_check(screens[mode].drawables[i], x,y)) return;
    }
    
    if(mode == 3){
        bingo_check_win_screen(x,y);
    }
}

function payout_click(x,y){
    if(x >= canvas.width * payout_transform[0] && x <= canvas.width * (payout_transform[0] + payout_transform[2])){
        if(y >= canvas.height * payout_transform[1] && y <= canvas.height * (payout_transform[1] + payout_transform[3])){
            
            return true;
        }
    }
    close_payout_table();
    return false;
}

function click_check(drawable,x,y){
    if(drawable.check(drawable,x,y)) return;
    for(var i = 0; i < drawable.drawables.length; i++){
        if(click_check(drawable.drawables[i],x,y)) return;
    }
    
    return false;
}