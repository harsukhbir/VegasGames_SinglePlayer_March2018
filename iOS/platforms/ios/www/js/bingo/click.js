function bingo_check_bingo_btn(x,y){
    if(x >= canvas_width * bingo_btn.transform[0] && x <= canvas_width * (bingo_btn.transform[0] + bingo_btn.transform[2])){
        if(y >= canvas_height * bingo_btn.transform[1] && y <= canvas_height * (bingo_btn.transform[1] + bingo_btn.transform[3])){
            bingo_btn.onClick();
            return true;
        }
    }
    return false;
}

function bingo_check_exit(x,y){
    if(x >= canvas_width * exit_btn.transform[0] && x <= canvas_width * (exit_btn.transform[0] + exit_btn.transform[2])){
        if(y >= canvas_height * exit_btn.transform[1] && y <= canvas_height * (exit_btn.transform[1] + exit_btn.transform[3])){
            exit_btn.onClick();
            return true;
        }
    }
    return false;
}

function bingo_check_bingo_btns(x,y){
    for(var i = 0; i < bingo_btns.length; i++){
        var transform = [canvas_width * bingo_btns[i].transform[0], canvas_height * bingo_btns[i].transform[1], canvas_width * bingo_btns[i].transform[2], canvas_height * bingo_btns[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                for(var k = 0; k < display_index + 1; k++){
                    if(chosen_numbers[k] == cards[card_selected].numbers[i]){
                        cards[card_selected].clicked[i] = true;
                        //console.log("Horray, You Clicked on something!");
                    }
                }
                if(i == 12){
                    cards[card_selected].clicked[i] = true;
                }
                return true;   
            }
        }
    }
    return false;
}

function bingo_check_scroll(x,y){
    if(x >= canvas_width * scroll_bar_transform[0] && x <= canvas_width * (scroll_bar_transform[0] + scroll_bar_transform[2])){
        if(y >= canvas_height * scroll_bar_transform[1] && y <= canvas_height * (scroll_bar_transform[1] + scroll_bar_transform[3])){
            scroll_follow = true;
            //console.log("Scroll Follow!");
        }
    }
}

function bingo_check_cards_small(x,y){
    var left = canvas_width * 0.02;
    var top = canvas_height * 0.2;
    var width = canvas_width * 0.09;
    var height = canvas_height * 0.18;
    var spacing = canvas_height * 0.01;
    var border = canvas_width * 0.01;
    var line_width = width * 0.025;
    
    var index = 0;
    bingo_draw_main_card(cards[card_selected]);    
    for(var i = scroll_index; i < cards.length && i < scroll_index + 5; i++){
        if(index < 4){
            if(x >= left && x <= left + width){
                if(y >= top + (height + spacing) * index && y <= top + (height + spacing) * (index+1)){
                    card_selected = i;
                    //console.log(card_selected);
                }
            }
            index++;
            if(index == 4)
                break;
        }
        
    }
}

function bingo_check_select_buttons(x,y){
    for(var i = 0; i < choose_screen_btns.length; i++){
        if(x >= canvas_width * choose_screen_btns[i].transform[0] && x <= canvas_width * (choose_screen_btns[i].transform[0] + choose_screen_btns[i].transform[2])){
            if(y >= canvas_height * choose_screen_btns[i].transform[1] && y <= canvas_height * (choose_screen_btns[i].transform[1] + choose_screen_btns[i].transform[3])){
                if(money > 2 * (i + 1)){
                    desired_cards = i + 1;
                    desired_cards_last = desired_cards;
                    bingo_get_numbers();
                    display_index = -1;
                    console.log("Timer Loop: " + timer_loop);
                    if(timer_loop == null){
                        timer_loop = setInterval(bingo_tick, 1);
                        //bingo_play_number_sound(chosen_numbers[display_index]);
                    }
                }
                
                return true;
            }
        }
    }
    return false;
}

function bingo_check_money_click(x,y){
    if(x >= canvas_width * 0.64 && x <= canvas_width * 0.94){
        if(y >= canvas_height * 0.06 && y <= canvas_height * 0.18){
            open_store();
            return true;
        }
    }
    return false;
}

/*
function check_money_popup(x,y){
    for(var i = 0; i < money_popup.buttons.length; i++){
        var transform = [canvas_width * money_popup.buttons[i].transform[0], canvas_height * money_popup.buttons[i].transform[1], canvas_width * money_popup.buttons[i].transform[2], canvas_height * money_popup.buttons[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                money_popup.buttons.onclick();
                return true;
            }
        }
    }
    return false;
}
*/

function bingo_click_handler(event){
    console.log("click");
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;

    if(store_open){
        if(store_click(x,y)) return;
        close_store();
    }
    if(isBigSpin){
        wheel_click_manager(x,y);
        return;
    }
    if(mode == 101 && Math.floor(experience / 100) > Math.floor((experience - 25) / 100)){
        console.log("Big Spin Trigger");
        wheel_init(function(){
                isBigSpin = false; 
                init_bingo();
                mode= 0;});
        return;
    }

    
    switch(mode){
        case 0:
            if(bingo_check_select_buttons(x,y)) return;
            else if(bingo_check_exit(x,y)) return;
            else if(bingo_check_money_click(x,y)) return;
            break;
        case 100:
            if(bingo_check_bingo_btns(x,y)) return;
            else if(bingo_check_bingo_btn(x,y)) return;
            else if(bingo_check_cards_small(x,y)) return;
            else if(bingo_check_exit(x,y)) return;
            break;
        case 101:
            if(bingo_check_win_screen(x,y)) return;
            bingo_win_state = 500;
            break;
        default:
            break;
    }
    
}


function bingo_mouse_down_handler(event){
    var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    switch(mode){
        case 0:
            break;
        case 100:
            if(bingo_check_scroll(x,y)) return;
            else if(x <= canvas_width * 0.58 && y >= canvas_height * 0.19){
                swipe_start = [x,y];
            } else swipe_start = [0,0];
            break;
        default:
            break;
    }
}

function bingo_mouse_up_handler(event){
    //console.log("UP");
    var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    
    var min_swipe_dist = canvas_height * 0.2;
    if(mode == 100){
        if(Math.abs(y - swipe_start[1]) >= min_swipe_dist && !scroll_follow && swipe_start != [0,0]){
            if(y < swipe_start[1]){
                if(card_selected < cards.length-1)
                    card_selected++;
            } else {
                if(card_selected > 0)
                    card_selected--;
            }
        }
    }
    scroll_follow = false;
}
function bingo_mouse_handler(e){
    var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    switch(mode){
        case 100:
            if(x < 0 || x > canvas_width || y < 0 || y > canvas_height)
                scroll_follow = false;
            if(scroll_follow && cards.length > 5){
                if(y >= canvas_height * scroll_transform[1] && y <= canvas_height * (scroll_transform[1] + scroll_transform[3] - scroll_bar_transform[3])){
                    scroll_bar_transform[1] = y / canvas_height;
                    //scroll_index = scroll_bar_transform[1] / scroll_transform[3]
                    scroll_index = Math.floor((scroll_bar_transform[1] - scroll_transform[1]) / scroll_transform[3] * (cards.length-4));
                    //scroll_index = Math.floor(scroll_bar_transform[1] / (scroll_transform[1] + scroll_transform[3]) * (cards.length - 4));
                }
            }
            break;
        default:
            break;
    }
}