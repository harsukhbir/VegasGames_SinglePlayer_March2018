function vp_initial_handler(x, y){
	var top = canvas_height * 0.25;
	var left = canvas_width * 0.25;
	var width = canvas_width * 0.5;
	var height = canvas_height * 0.2;
	if(x >= left && x <= left + width){
		// Note the added buffer zone for increased clicking potential
		if(y >= top && y <= top + height + screen.height * 0.02){
			increase_bet();
		} else if(y >= top + height + canvas_height * 0.05 && y < top + height * 2 + canvas_height * 0.07){
			decrease_bet();
		}
	}
	left = canvas_width * 0.7;
	top = canvas_height * 0.8;
	width = canvas_width * 0.25;
	height = canvas_height * 0.1;
	if(x >= left && x <= left + width){
		if(y >= top && y <= top + height + screen.height * 0.2){
			mode = 0;
			primary_bet = bet;
		}
	}
}

// The click handler for the secondary betting screen.
function vp_check_increase_decrease(x, y){
	var left = canvas_width * 0.585;
	var top = canvas_height * 0.881;
	var height = canvas_height * 0.055;
	var width = height;
	if(y >= top && y <= top + height){
		if(x >= left && x <= left + width){
			decrease_bet();
			return true;
		}
		left += canvas_width * 0.086;	
		if(x >= left && x <= left + width){
			increase_bet();
			return true;
		}
	}
	top -= canvas_height * 0.01;
	left += canvas_width * 0.065;
	width = canvas_width * 0.058;
	height = width;
	if(x >= left && x <= left + width){
		if(y >= top && y <= top + height){
			var cont = increase_bet();
			while(cont){
				cont = increase_bet();
			}
			return true;
		}
	}
	return false;
}

function vp_check_bottom_btns(x,y){
    var left = canvas_width * 0.075;
    var top = canvas_height * 0.75;
    var width = canvas_width * 0.19;
    var height = canvas_height * 0.25;
    var spacing = canvas_width * 0.03;
    if(y >= top && y <= top + height){
        for(var i = 0; i < 4; i++){
            if(x >= left + (width+spacing)*i && x <= left + (width+spacing)*i + width){
                if(i == 0 && mode == 2){
                    decrease_bet();
                    return true;
                } else if(i == 1 && mode == 2){
                    increase_bet();
                    return true;
                } else if(i == 2 && mode == 2){
                    var cont = increase_bet();
                    while(cont){
                        cont = increase_bet();
                    }
                    return true;
                } else if(i == 3){
                    if(mode == 0){
                        if(GameManager.Current_Game == "VP"){
                            vp_draw_new();
                        } else if(GameManager.Current_Game == "JB"){
                            jb_draw_new();
                        } else if(GameManager.Current_Game == "JW"){
                            jw_draw_new();
                        }
                        if(audio_on && sound_enabled){
                            shuffle_sounds[Math.floor(Math.random() * shuffle_sounds.length)].play();
                        }
                        return true;
                    } else if(mode == 2){
                        if(audio_on && sound_enabled){
                            shuffle_sounds[Math.floor(Math.random() * shuffle_sounds.length)].play();
                        }
                        if(GameManager.Current_Game == "VP"){
                            vp_get_hand();
                        } else if(GameManager.Current_Game == "JB"){
                            jb_get_hand();
                        } else if(GameManager.Current_Game == "JW"){
                            jw_get_hand();
                        }
                        
                        mode = 0;
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function vp_check_exit_payout_btns(x,y){
    var left = canvas_width * 0.01;
    var top = canvas_height * 0.03;
    var width = canvas_width * 0.105;
    var height = width;
    if(y >= top && y <= top + height){
        if(x >= left && x <= left + width){
            console.log("Exit");
            if(mode == 2)
                //cash += bet;
                if(u.toLowerCase() == "guest")
                    window.localStorage.setItem("guest_money", cash);
                return_to_lobby();
            return true;
        } else if(x >= canvas_width-(left+width) && x <= canvas_width-(left)){
            show_payout_table = true;
            return true;
        }
    }
    // Checking Buy Money Btn
    if(y >= canvas_height * 0.04 && y <= canvas_height * 0.21){
        console.log(x/canvas_width);
        if(x >= canvas_width * 0.429 && x <= canvas_width * 0.522){
            //alert("You Clicked Buy Money! Horray for You!");
            open_store();
            return true;
        }
    }
    return false;
}

function vp_check_hand_click(x,y){
    
    var card_width = canvas_width * 0.17;
    var card_height = canvas_height * 0.415;
    var left = canvas_width * 0.03;
    var card_top = canvas_height * 0.27;
    var card_spacing = canvas_width * 0.022;
    
    for(var i = 0; i < hand.length; i++){
        var card_left = left + (card_width + card_spacing) * i;
        if(x >= card_left && x <= card_left + card_width){
            if(y >= card_top  && y <= card_top + card_height){
                selected[i] = !selected[i];
                if(audio_on && sound_enabled){
                    if(selected[i]){
                        sparkle_vid.play();
                        select_sounds[Math.floor(Math.random() * select_sounds.length)].play();
                    } else{
                        unpick_sounds[Math.floor(Math.random() * unpick_sounds.length)].play();
                    }
                }
                return true;
            }
        }
    }
    return false;
}

function vp_check_payout_table(x,y){
    if(y < canvas_height * 0.135 || y > canvas_height * 0.828){
        show_payout_table = false;
    } else if (x >= canvas_width * 0.895 && x <= canvas_width * 0.975){
        if(y >= canvas_height * 0.183 && y <= canvas_height *0.183 + canvas_width * 0.08){
            show_payout_table = false;    
        }
    }
}

function vp_bad_click(){
    if(audio_on && !store_open && !show_payout_table && sound_enabled){
        bad_click_sounds[Math.floor(Math.random() * bad_click_sounds.length)].play();
    }
}


function vp_click_handler(event){
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
    if(mode == 1 && Math.floor(experience / 100) > Math.floor((experience - 10) / 100)){
        if(GameManager.Current_Game == "VP"){
            wheel_init(vp_init);
        } else if(GameManager.Current_Game == "JB"){
            wheel_init(init_jb);
        } else if(GameManager.Current_Game == "JW"){
            wheel_init(init_jw);
        }
        //wheel_init(function(){mode++;});
        return;
    }
	switch(mode){
		case 0:
            vp_reset_win_graphics();
            if(!show_payout_table){
                if(vp_check_hand_click(x,y)) return;
                if(vp_check_bottom_btns(x,y)) return;
                if(vp_check_exit_payout_btns(x,y)) return;
            } else{
                vp_check_payout_table(x,y);
            }
            vp_bad_click();
			break;
		case 1:
			
            if(!show_payout_table){
                if(vp_check_bottom_btns(x,y)) return;
                if(vp_check_exit_payout_btns(x,y)) return;
                if(GameManager.Current_Game == "VP"){
                    vp_init();
                } else if(GameManager.Current_Game == "JB"){
                    init_jb();
                } else if(GameManager.Current_Game == "JW"){
                    init_jw();
                }
            } else {
                vp_check_payout_table(x,y);
            }
			break;
		case 2:
            if(!show_payout_table){
                if(vp_check_hand_click(x,y)) return;
                if(vp_check_bottom_btns(x,y)) return;
                if(vp_check_exit_payout_btns(x,y)) return;
                vp_bad_click();
            } else{
                vp_check_payout_table(x,y);
            }
			break;
		default:
			break;
	}
}