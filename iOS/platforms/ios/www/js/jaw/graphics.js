/*
function draw_fancy_text(text, left, top){
    var w = context.measureText("T").width;
    context.strokeStyle ="#5b0262";
    context.miterLimit=2;
    context.lineWidth = 7;
    context.strokeText(text, left, top);
    context.lineWidth = 1;
    
    //var text_gradient = context.createLinearGradient(0, top-w/login_fields[0].text.length, 0,  top + w/login_fields[0].text.length);
    var text_gradient = context.createLinearGradient(0, top - w, 0,  top - w * 0.2);
    text_gradient.addColorStop("0", "#fcd538");
    text_gradient.addColorStop("0.5", "#f4ac2c");
    text_gradient.addColorStop("1.0", "#e85a07");
    context.fillStyle = text_gradient;
    
    context.fillText(text, left, top);
}
*/

// Draws hand to screen on relevant screens
function jw_draw_hand(){

	context.fillStyle = "white";
    auto_size_text("7", canvas_width * 0.015, canvas_height);
    var card_width = canvas_width * 0.17;
    var card_height = canvas_height * 0.415;
    var left = canvas_width * 0.03;
    var card_top = canvas_height * 0.27;
    var card_spacing = canvas_width * 0.022;
	for(var i = 0; i < hand.length; i++){
        var card_left = left + (card_width + card_spacing) * i;
        
        if(selected[i] && mode == 1){
            context.fillStyle = "#EDED0C";
            context.fillRect(card_left-card_spacing/3, card_top-card_spacing/3, card_width+card_spacing*2/3, card_height+card_spacing*2/3);
        }
        var card_value = 0
		context.drawImage(card_back, card_left, card_top, card_width, card_height);
		context.fillStyle = "black";
        if(hand[i] < 13){
            context.drawImage(card_suit[check_suit(hand[i])], card_left + card_width * 0.265, card_top + card_height * 0.33 , card_width * 0.47, card_height * 0.33);
        } else if(hand[i] == 13){
            context.drawImage(joker_img[0], card_left + card_width * 0.265, card_top + card_height * 0.33 , card_width * 0.47, card_height * 0.33);
        } else if(hand[i] == 13.1){
            context.drawImage(joker_img[1], card_left + card_width * 0.265, card_top + card_height * 0.33 , card_width * 0.47, card_height * 0.33);
        }
        
        var card_num_left = card_width * 0.08;
        var card_num_top = card_height * 0.16;
		if(hand[i] < 9) {
			card_value = (Math.floor(hand[i]) + 2).toString();
		} else if(hand[i] < 10){
			card_value = "J";
		}else if(hand[i] < 11){
			card_value = "Q";
		}else if(hand[i] < 12){
			card_value = "K";
		}else if(hand[i] < 13){
			card_value = "A";
		} else if(hand[i] < 14){
            card_value = words[6];
            card_num_left += context.measureText("Jo").width;
        }
        context.fillText(card_value, card_left + card_num_left - context.measureText(card_value).width/2, card_top + card_num_top);
        
        context.fillStyle = "rgba(0,1,0,1)";
        context.save(); 
        context.translate(card_left+card_width-card_num_left, card_top+card_height-card_num_top);
        context.rotate(Math.PI);
        context.fillText(card_value, -context.measureText(card_value).width/2, 0);
        context.restore(); 
        
		if(selected[i] && mode == 0){
            var lock_size = canvas_width * 0.08;
			context.drawImage(lock_img, card_left + card_width * 0.5-lock_size/2, card_top + card_height * 0.7, lock_size, lock_size);
		}
	}
}

/*
function draw_initial(){
    var card_width = canvas_width * 0.17;
    var card_height = canvas_height * 0.415;
    var left = canvas_width * 0.03;
    var card_top = canvas_height * 0.27;
    var card_spacing = canvas_width * 0.022;
	for(var i = 0; i < 5; i++){
        var card_left = left + (card_width + card_spacing) * i;
		context.drawImage(card_back, card_left, card_top, card_width, card_height);
		context.drawImage(card_back_img, card_left + card_width * 0.1, card_top + card_height * 0.07 , card_width * 0.8, card_height * 0.86);
	}
}


function draw_exit_payout_btns(){
    var left = canvas_width * 0.01;
    var top = canvas_height * 0.03;
    var width = canvas_width * 0.105;
    var height = width;
    context.drawImage(exit_btn, left, top, width, height);
    context.drawImage(payout_table_img, canvas_width-(left+width), top, width, height);
}
*/

function jw_draw_payout_table(){
	// Drawing Background
	
    context.fillStyle = "rgba(0,0,0,0.655)";
    context.fillRect(0,0,canvas_width,canvas_height);
	context.drawImage(payout_back, 0, canvas_height * 0.135, canvas_width, canvas_height * 0.693);
	context.fillStyle = "#ffffff";
    
	var width = canvas_width * 0.002;
	var left = canvas_width * 0.305;
	var top = canvas_height * 0.31;
	var height = canvas_height * 0.46;
	var spacing = canvas_width * 0.12;

	for(var i = 0; i < 5; i++){
		context.fillRect(left + spacing * i, top, width, height);
	}
	auto_size_text(words[7], canvas_width * 0.18, canvas_height * 0.04);
	
    context.drawImage(logo, canvas_width * 0.115, canvas_height * 0.175, canvas_width * 0.2, canvas_height * 0.12);
    auto_size_text("JACKS OR BETTER", canvas_width * 0.35, canvas_height * 0.06);
    draw_fancy_text("JOKERS WILD", canvas_width * 0.44, canvas_height * 0.25);
	// Drawing Text
    var l = left + canvas_width * 0.04;
	left = canvas_width * 0.11;
	top = canvas_height * 0.35;
	var s = canvas_width * 0.12;
	var spacing = canvas_height * 0.005 + context.measureText("W").width * 0.6;
    auto_size_text(words[7], canvas_width * 0.18, canvas_height * 0.04);
	for(var i = 0; i < hand_types.length; i++){
        context.fillStyle = "#ffffff";
		context.fillText(hand_types[i], left, top + spacing*i);
		for(var j = 0; j < 5; j++){
            if(j == bet-1){
                context.fillStyle = "#FF0000";
            } else {
                context.fillStyle = "#ffffff";
            }
			var value = hand_values[i] * (j+1);
			context.fillText(value, l + s * j, top + spacing*i);
		}
	}
	
	context.drawImage(payout_exit, canvas_width * 0.895, canvas_height * 0.175, canvas_width * 0.08, canvas_width * 0.08);

}

/*
function draw_money_bet(){
    // Drawing Current Bet
    var top = canvas_height*0.04;
    var left = canvas_width*0.135;
    var width = canvas_width*0.31;
    var height = canvas_height*0.17;
    
    auto_size_text("$99,000,000", canvas_width * 0.39, canvas_height * 0.095);
    context.fillStyle = "#ffffff";
    
    var l = canvas_width * 0.13;
    var w = canvas_width * 0.397;
    context.drawImage(score_back, l, top, w, height);
    if(mode != 1){
        draw_fancy_text("$" + cash, left + canvas_width * 0.012, canvas_height * 0.16);
    } else if(win_bounce){
        draw_fancy_text("+ $" + last_winning, left + canvas_width * 0.01, canvas_height*0.17);
    } else {
        draw_fancy_text("$" + cash, left + canvas_width * 0.012, canvas_height * 0.16);
    }
    //context.drawImage(buy_btn_img, l + w*0.76, top, w*0.235, height);
    
    
    
    left += canvas_width * 0.395;
    context.drawImage(bet_base, left, top, width, height);
    context.fillStyle = "#0b4467";
    context.fillRect(left + width * 0.58, top + width * 0.016, width * 0.404, height - width * 0.032);
    left += width * 0.065;
    top += height * 0.176;
    context.drawImage(bet_img, left, top, canvas_width * 0.135, canvas_height * 0.11);
    context.fillStyle = "#ffffff";
    //auto_size_text("999999", canvas_width*0.04, canvas_height*0.1);
    context.fillText(bet, left + width * 0.677, canvas_height*0.17);

    
}

function draw_bottom_btns(){
    var left = canvas_width * 0.075;
    var top = canvas_height * 0.75;
    var width = canvas_width * 0.19;
    var height = canvas_height * 0.25;
    var spacing = canvas_width * 0.03;
    for(var i = 0; i < 4; i++){
        context.drawImage(bottom_btn, left + (width+spacing)*i, top, width, height);
        var txt = "";
        if(i == 0){
            context.drawImage(minus, left+width*0.1+(width+spacing)*i, top+height*0.4, width*0.8, height*0.6);
        } else if(i == 1){
            context.drawImage(plus, left+width*0.1+(width+spacing)*i, top+height*0.4, width*0.8, height*0.6);
        } else if(i == 2){
            context.drawImage(max_bet_img, left+width*0.1+(width+spacing)*i, top+height*0.4, width*0.8, height*0.6);
        } else if(i == 3){
            context.drawImage(deal_img, left+width*0.1+(width+spacing)*i, top+height*0.4, width*0.8, height*0.6);
        }
    }
    
}


function draw_background(){
	context.drawImage(background_image,0,0,canvas_width, canvas_height);
    context.drawImage(bottom_bar, 0, canvas_height * 0.89,canvas_width, canvas_height * 0.11);
}
*/


function jw_draw(){
    //music_update();
    vp_draw_background();
    switch(mode){
        case 0:
            jw_draw_hand();
            vp_draw_bottom_btns();
            vp_draw_exit_payout_btns();
            vp_draw_money_bet();
            if(show_payout_table)
                jw_draw_payout_table();
            break;
        case 1:
            jw_draw_hand();
            vp_draw_bottom_btns();
            vp_draw_exit_payout_btns();
            vp_draw_money_bet();
            vp_draw_win_graphics();
            if(show_payout_table)
                jw_draw_payout_table();
            break;
        case 2:
            vp_draw_initial();
            vp_draw_bottom_btns();
            vp_draw_exit_payout_btns();
            vp_draw_money_bet();
            if(show_payout_table)
                jw_draw_payout_table();
            break;
        default:
            break;
    }
    
    if(store_open){
        store_graphics();
    }

    if(isBigSpin){
        wheel_graphics();
    }
}