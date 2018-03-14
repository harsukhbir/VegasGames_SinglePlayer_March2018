function bingo_draw_background(){
    if(mode == 0){
        context.drawImage(select_background, 0, 0, canvas_width, canvas_height);
        context.drawImage(card_select_outline, canvas_width * 0.06, canvas_height * 0.31, canvas_width * 0.86, canvas_height * 0.4);
        context.fillStyle = "#ffffff";
        var select_text = words[4];
        auto_size_text(select_text, canvas_width * 0.35, canvas_height);
        draw_fancy_text(select_text, canvas_width * 0.315, canvas_height * 0.76);
    } else if(mode == 100 || mode == 101){
        context.drawImage(background, 0, 0, canvas_width, canvas_height);
    }
}

function bingo_draw_balls(){
    var transform = [canvas_width * 0.61, canvas_height * 0.22, canvas_width * 0.1, canvas_height * 0.12];
    context.drawImage(ball_count_back, transform[0], transform[1], transform[2], transform[3]);
    auto_size_text(words[6], transform[2], canvas_height);
    context.fillStyle = "#ffffff";

    var balls_remaining = chosen_numbers.length - display_index - 1;
    
    if(balls_remaining == 0 && restart_delay == 0){
        context.fillText("TIME!", transform[0], transform[1] + transform[3] * 1.3);
        balls_remaining = restart_time;
    } else {
        context.fillText(words[6], transform[0], transform[1] + transform[3] * 1.3);
    }
    auto_size_text("35", transform[2] * 0.8 , canvas_height);
    context.fillText(balls_remaining, transform[0] + transform[2] * 0.1, transform[1]  + context.measureText("W").width - transform[3] * 0.13);
}

function bingo_draw_chosen_board(){
    var transform = [canvas_width * 0.72, canvas_height * 0.22, canvas_width * 0.24, canvas_height * 0.6];
    context.drawImage(chosen_board_img, transform[0], transform[1], transform[2], transform[3]);
    var outline = canvas_width * 0.01;
    context.fillStyle = "#ffffff";
    var line_width = transform[2] * 0.01;
    for(var i = 0; i < 4; i++){
        context.fillRect(transform[0] + outline + (transform[2] - outline*2) * 0.2 * (i + 1), transform[1] + transform[3] * 0.18, line_width, transform[3] * 0.77);
    }
    auto_size_text("1", canvas_width * 0.01, canvas_height * 0.03);
        
    var top_margin = transform[3] * 0.23;
    var left_margin = transform[2] * 0.13;
    var width = transform[2] * 0.165;
    var height = canvas_height * 0.03;
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 15; j++){
            var num = (i * 15 + (j+1)).toString();
            var l = transform[0] + transform[2] * 0.19 * i - context.measureText(num).width/2 + left_margin;
            var t = transform[1] + transform[3] * 0.05 * (j) + top_margin;
            for(var k = 0; k < display_index + 1; k++){
                if(num == chosen_numbers[k]){
                    context.fillStyle = "rgba(255,0,0,0.8)";
                    //var left = transform[0]  + left_margin + transform[2]  * i * 0.9;
                    var left = transform[0] + outline + line_width + (transform[2] - outline*2 + line_width) * 0.205 * (i);
                    context.fillRect(left, t - transform[3] * 0.045, width*0.9, height);
                    context.fillStyle = "#ffffff";
                    break;                  
                }
            }
            context.fillText(num, l, t);
        }
    }
}

function bingo_draw_main_card(card){
    context.drawImage(board_back, canvas_width * 0.13, canvas_height * 0.01, canvas_width * 0.46, canvas_height * 0.97);
    auto_size_text("75", canvas_width * bingo_btns[0].transform[2] * 0.8, canvas_height * bingo_btns[0].transform[3] * 0.8);
    for(var i = 0; i < bingo_btns.length; i++){
        var transform = bingo_btns[i].transform;
        context.drawImage(bingo_btns[i].image, canvas_width * transform[0], canvas_height * transform[1], canvas_width * transform[2], canvas_height * transform[3]);
        /*
        for(var j = 0; j < display_index; j++){
            if(chosen_numbers[j] == card.numbers[i]){
                context.drawImage(bang, canvas_width * transform[0], canvas_height * transform[1], canvas_width * transform[2], canvas_height * transform[3]);
                break;
            } 
        }
        */
        if(cards[card_selected].clicked[i])
            context.drawImage(bang, canvas_width * transform[0], canvas_height * transform[1], canvas_width * transform[2], canvas_height * transform[3]);

        context.fillStyle = "#ffffff";
        if(i != 12)
            context.fillText(card.numbers[i], canvas_width * (transform[0] + transform[2] * 0.5) - context.measureText(card.numbers[i]).width/2,  canvas_height * (transform[1] + transform[3]*1.45) - context.measureText("W").width );
        else
            context.fillText("", canvas_width * (transform[0] + transform[2] * 0.5) - context.measureText(card.numbers[i]).width/2,  canvas_height * (transform[1] + transform[3]*1.45) - context.measureText("W").width );

    }
}

function bingo_draw_other_cards(card, index){
    var left = canvas_width * 0.02;
    var top = canvas_height * 0.2;
    var width = canvas_width * 0.09;
    var height = canvas_height * 0.18;
    var spacing = canvas_height * 0.01;
    var border = canvas_width * 0.01;
    var line_width = width * 0.025;
    top += (height + spacing) * index;
    context.drawImage(card_back_small, left, top, width, height);
    context.fillStyle = "#ffffff";
    // Drawing Outline
    // Top
    context.fillRect(left + border, top + border, width - border * 2, line_width);
    // Bottom
    context.fillRect(left + border, top + height - border -line_width, width - border * 2, line_width);
    // Left
    context.fillRect(left + border, top + border + line_width/2, line_width, height - border * 2 - line_width/2);
    // Right
    context.fillRect(left + width - border - line_width, top + border + line_width/2, line_width, height - border * 2 - line_width/2);
    
    // Drawing Interior Lines
    // Bingo Text
    auto_size_text("BINGO", width * 0.4, height);
    top += height * 0.25;
    context.fillText("BINGO", left + width/2 - context.measureText("BING0").width/2, top - height * 0.025)
    
    // Moving the orientation down to interior of card
    left += border + line_width;
    width -= (border + line_width) * 2;
    height -= height * 0.25 + border + line_width;
    // Drawing the top line
    context.fillRect(left, top, width, line_width);
    for(var i = 0; i < 4; i++){
        // Horizontal Lines
        context.fillRect(left, top + (height / 5) * (i+1), width, line_width);
        // Vertical Lines
        context.fillRect(left + width / 5 * (i+1), top + line_width/2, line_width, height - line_width/2);
    }
    top += height * 0.2;
    left += line_width*0.3;
    // Drawing Numbers
    auto_size_text("75", width/5 * 0.7, height/5 * 0.7);
    for(var i = 0; i < card.numbers.length; i++){
        var l = left + (width/5) * (Math.floor(i/5)+1) - width*0.1 - context.measureText(card.numbers[i]).width/2;
        var t = top + (height/5) * (i % 5) - height*0.025;   
        if(i == 12)
            context.fillText("", l, t);
        else
            context.fillText(card.numbers[i], l, t);
    }
    
}

function bingo_draw_cards(){
    var index = 0;
    bingo_draw_main_card(cards[card_selected]);    
    for(var i = scroll_index; i < cards.length && i < scroll_index + 5; i++){
        if(index < 4){
            bingo_draw_other_cards(cards[i], index);
            index++;
            if(index == 4)
                break;
        }
        
    }
}

function bingo_draw_queue(){
    context.drawImage(ball_queue_img, canvas_width * 0.61, canvas_height * 0.01, canvas_width * 0.385, canvas_height * 0.22);
    var left = canvas_width * 0.71;
    var top = canvas_height * 0.075;
    var width = canvas_height * 0.09;
    var height = width;
    var spacing = canvas_width * 0.01;
    auto_size_text("75", width * 0.35, height);
    for(var i = display_index - 1; i >= 0 && i > display_index - 5; i--){
        context.fillStyle = "#ffffff";
        //console.log(Math.floor(chosen_numbers[i] - 1 / 15));
        var image = bingo_balls[Math.floor((chosen_numbers[i] - 1) / 15)];
        context.drawImage(image, left + (width + spacing) * (display_index - i - 1), top, width, height)
        context.fillStyle = "#000000"
        context.fillText(chosen_numbers[i], left + (width + spacing) * (display_index - i - 1) + width / 2 - context.measureText(chosen_numbers[i]).width / 2, top + height * 0.6);
        
    }
    if(display_index < 0)
        return;
    context.fillStyle = "#ffffff";
    width *= 1.3;
    top -= height * 0.2;
    height *= 1.3;
    left -= width + spacing;
    auto_size_text("75", width * 0.35, height);
    var ball_img_index = Math.floor(chosen_numbers[display_index] / 15);
    if(ball_img_index >= bingo_balls.length){
        ball_img_index = bingo_balls.length-1;
    }
    var img = bingo_balls[Math.floor((chosen_numbers[display_index] - 1) / 15)];
    //context.drawImage(bingo_balls[ball_img_index], left, top, width, height);
    context.drawImage(img, left, top, width, height);
    context.fillStyle = "#000000";
    context.fillText(chosen_numbers[display_index], left + width/2 - context.measureText(chosen_numbers[display_index]).width/2, top + height * 0.6);
}

function bingo_draw_choose_screen_btns(){
    for(var i = 0; i < choose_screen_btns.length; i++){
        var transform = [canvas_width * choose_screen_btns[i].transform[0], canvas_height * choose_screen_btns[i].transform[1], canvas_width * choose_screen_btns[i].transform[2], canvas_height * choose_screen_btns[i].transform[3]];
        context.drawImage(choose_screen_btns[i].image, transform[0], transform[1], transform[2], transform[3]);

        
        var value = "$"+((i+1) * 2).toString();
        auto_size_text(value, transform[2] * 0.25, canvas_height);
        draw_fancy_text(value, transform[0] + transform[2] * 0.3 - context.measureText(value).width * 0.6, transform[1] + transform[3] * 33/36);
        
        transform = [canvas_width * choose_screen_btns[i].text.transform[0],
            canvas_height * choose_screen_btns[i].text.transform[1],
        ];
        context.font = choose_screen_btns[i].text.font;
        draw_fancy_text(choose_screen_btns[i].text.text, transform[0]-context.measureText(choose_screen_btns[i].text.text).width/2, transform[1]);

    }
}

function bingo_draw_fancy_text(text, left, top){
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


function bingo_draw_scrollbar(){
    context.drawImage(scroll_bar_back, canvas_width * scroll_transform[0], canvas_height * scroll_transform[1], canvas_width * scroll_transform[2], canvas_height * scroll_transform[3]);
    context.drawImage(scroll_bar, canvas_width * scroll_bar_transform[0], canvas_height * scroll_bar_transform[1], canvas_width * scroll_bar_transform[2], canvas_height * scroll_bar_transform[3]);
}

function bingo_draw_exit(){
    var transform = exit_btn.transform;
    context.drawImage(exit_btn.image, canvas_width * transform[0], canvas_height * transform[1], canvas_width * transform[2], canvas_height * transform[3]);
}

function bingo_draw_extra(){
    var transform = bingo_btn.transform;
    context.drawImage(bingo_btn.image,
    canvas_width * transform[0], canvas_height * transform[1], canvas_width * transform[2], canvas_height * transform[3]);
}

function bingo_draw_money_display(){
    context.drawImage(money_background, canvas_width * 0.64, canvas_height * 0.06, canvas_width * 0.3, canvas_height * 0.12);
    var money_str = "$" + money.toString();
    auto_size_text("$99,000,000", canvas_width * 0.2, canvas_height);
    draw_fancy_text(money_str, canvas_width * 0.85 - context.measureText(money_str).width, canvas_height * 0.14);
}



function draw_bingo_graphics(){
    if(!bingo_img_load_complete)
        return;
    //bingo_music_update();
    bingo_draw_background();
    switch(mode){
        case 0:
            bingo_draw_exit();
            bingo_draw_choose_screen_btns();
            bingo_draw_money_display();
            break;
        case 100:
            bingo_draw_exit();
            bingo_draw_cards();
            bingo_draw_queue();
            bingo_draw_chosen_board();
            bingo_draw_balls();
            bingo_draw_extra();
            if(cards.length > 5){
                bingo_draw_scrollbar();
            }
            break;
        case 101:
            bingo_draw_exit();
            bingo_draw_cards();
            bingo_draw_queue();
            bingo_draw_chosen_board();
            bingo_draw_balls();
            bingo_draw_extra();
            if(cards.length > 5){
                bingo_draw_scrollbar();
            }
            bingo_draw_win_graphics();
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
    
    //load_complete();
}