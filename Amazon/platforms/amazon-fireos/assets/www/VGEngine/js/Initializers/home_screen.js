function draw(){

    if(mode > screens.length || screens[mode] == null)
        return;
    MusicManager.music_update();
    // Drawing Background
    if(screens[mode].background != null){
        context.drawImage(screens[mode].background.img,
        canvas.width * screens[mode].transform[0],
        canvas.height * screens[mode].transform[1],
        canvas.width * screens[mode].transform[2],
        canvas.height * screens[mode].transform[3]);
    }
    
    // Drawing Screen Elements
    
    // This is a total hack and it is terrible
    if(mode != 3){
        for(var i = 0; i < screens[mode].drawables.length; i++){
            if(screens[mode].drawables[i].visible){
                render_drawable(screens[mode].drawables[i]);
            }
        }
    } else {
        for(var i = 0; i < screens[2].drawables.length; i++){
            if(screens[2].drawables[i].visible){
                render_drawable(screens[2].drawables[i]);
            }
        }
        bingo_draw_win_graphics();
    }
    
    if(show_payout){
        draw_payout_table();
    }
    if(store_open){
        store_graphics();
    }
    
    if(isBigSpin){
        wheel_graphics();
        return;
    }

}

function render_drawable(drawable){
    drawable.draw(drawable);
    for(var i = 0; i < drawable.drawables.length; i++){
        if(drawable.drawables[i].visible){
            render_drawable(drawable.drawables[i]);
        }
    }
}

function draw_image(image){
    context.drawImage(image.img, 
        canvas.width * image.transform[0],
        canvas.height * image.transform[1],
        canvas.width * image.transform[2],
        canvas.height * image.transform[3]
    );

}


function draw_drawable(drawable){
    
}


function init_home_screen(){
    
    
    var background = new_static_img(start_screen_bg,[0,0,1,1],0);
    var home_screen = new_screen(background);
    
    
    var transform = [0.825, 0.9, 0.17, 0.09];
    var start_btn = new_button(2, transform, start_game);
    //console.log(start_btn);
    var start_btn_img = new_static_img(confirm_btn_img, transform, 0);
    //console.log(start_btn);
    start_btn = add_drawable(start_btn, start_btn_img);
    home_screen = add_drawable(home_screen, start_btn);
    
    
    
    var game_buttons = new_drawable(0, [0,0,1,1]);
    game_buttons = create_keno_buttons(game_buttons);
    game_buttons.id = "game_buttons";
    home_screen = add_drawable(home_screen, game_buttons);
    
    
    var payout_btn_transform = [0.925, 0.01, 0.065, 0.11];
    var payout_btn = new_button(2, payout_btn_transform, open_home_payout);
    var payout_btn_img = new_static_img(payout_table_img, payout_btn_transform, 0);
    payout_btn = add_drawable(payout_btn, payout_btn_img);
    add_drawable(home_screen, payout_btn);
    
//    home_screen = add_drawable(home_screen, 

/*
    var bet_transform = [
        0.735,
        0.76,
        0.265,
        0.105
    ];
    
    var fnt =  auto_size_text("GAMES", canvas.width * 0.08, canvas.height * bet_transform[3]) + font;
    var inc_dec_bet = new_increase_decrease(bet_transform, "BET", fnt, increase_bet, decrease_bet);
    home_screen = add_drawable(home_screen, inc_dec_bet);
    //console.log(inc_dec_bet);

    
    var games_transform = bet_transform.slice();
    games_transform[1] = bet_transform[1] + 0.12;
    var inc_dec_games = new_increase_decrease(games_transform, "GAMES", fnt, increase_games, decrease_games);
    home_screen = add_drawable(home_screen, inc_dec_games);
    
    
    
    var bet_display_transform = [
        0.89,
        0.75,
        0.05,
        0.105
    ];
    var bet_display = new_text(current_bet, fnt, 2, bet_display_transform, 5, "#ffffff");
    bet_display.id = "bet_display";
    home_screen = add_drawable(home_screen, bet_display);
    
    var games_display_transform = bet_display_transform.slice();
    games_display_transform[1] = bet_transform[1] + 0.12;
    var games_display = new_text(selected_games, fnt, 2, games_display_transform, 5, "#ffffff");
    games_display.id = "games_display";
    home_screen = add_drawable(home_screen, games_display);

    */
    
    
    var exit_button = new_static_img(
        splash_exit_img, [0.01, 0.01, 0.065, 0.11], 5
    );
    exit_button = add_drawable(exit_button, new_button(
        6, [0.01, 0.007, 0.065, aspect_ratio * 0.065], function(){change_mode(4);}
    ));
    add_drawable(home_screen, exit_button);
    
    
    var fnt =  auto_size_text("3/4", canvas.width * 0.09, canvas.height) + font;
    var selected_disp = new_text(selected_squares.length + '/' + max_selectable,
                                    fnt, 1, [0.83, 0.72, 0.1, 0.1], 3, '#ffffff');
    home_screen.selected = selected_disp;
    home_screen = add_drawable(home_screen, selected_disp);    
    
    
    
    fnt =  auto_size_text("3/4", canvas.width * 0.06, canvas.height) + font;
    var game_disp = new_text('0', fnt, 1, [0.83, 0.87, 0.2, 0.2], 3, '#ffffff');
    home_screen.games = game_disp;
    home_screen = add_drawable(home_screen, game_disp);
    
    var bet_disp = new_text('0', fnt, 1, [0.83, 0.79, 0.2, 0.2], 3, '#ffffff');
    home_screen.bet = bet_disp;
    home_screen = add_drawable(home_screen, bet_disp);
    
    
    fnt = auto_size_text(words[9], canvas.width * 0.7, canvas.height) + font;
    var prompt_txt = new_text(words[9], fnt, 3, [0.15, 0.6, 0.7, 1], 3, '#ffffff');
    
    home_screen.prompt = prompt_txt;
    add_drawable(home_screen, prompt_txt);
    
    
    var prompt_cont = new_static_img(prompt_arrow, [0.59,0.65,0.23,0.3], 9);
    home_screen.prompt_continue = prompt_cont;
    add_drawable(home_screen, prompt_cont);
    
    
    
    //routines.push(update_keno_home_fields);
        
    var lines = new_drawable(0, [0,0,1,1]);
    lines.draw = draw_lines;
    home_screen = add_drawable(home_screen, lines);
    
    home_screen.onOpen = function(){
        screens[0].prompt.visible = true;
        screens[0].prompt_continue.visible = false;
        update_bet_display();
        update_games_display();
        this.games.txt = words[5] + ': ' + selected_games;
        console.log(this.bet);
        this.bet.txt = words[10] + ': $' + current_bet;
        this.selected.txt = '0/' + max_selectable;
        var tm = new_timer(200, false);
        tm.target = screens[0].prompt;
        tm.result = function(){
            this.target.visible = false;
        };
        Timers.push(tm);
    };
    
    
    return home_screen;
    //screens.push(home_screen);
}

function draw_payout_table(){
    var value = get_payout_value();;
    context.fillStyle = "#000000";
    context.globalAlpha = 0.5;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.globalAlpha = 1;
    
    
    var left_col = (payout_transform[0] + payout_transform[2] * 0.09);
    var right_col = (payout_transform[0] + payout_transform[2] * 0.555);
    var table_width = (payout_transform[2] * 0.445);
    var  table_spacing = [
        payout_transform[2] * 0.02,
        payout_transform[3] * 0.02
    ];
    var row_dimens = [
        payout_transform[2] * 0.31,
        payout_transform[3] * 0.05
    ];
    
    // Draw Right Column
    var top = payout_transform[1] + payout_transform[3] * 0.09;
    var fnt = auto_size_text(10, canvas.width * table_width * 0.2, canvas.height * row_dimens[1] * payout_vals[0].length) + font;
    for(var i = 0; i < 4; i++){
        var val = value + 3 - i;
        draw_table(val, right_col, top, table_width, row_dimens[1]);
        top += row_dimens[1] * (payout_vals[val].length + 1) + table_spacing[1];
        context.font = fnt;
    }
    
    var top_indent = (top - (payout_transform[1] + payout_transform[3] * 0.09) - (row_dimens[1] * (payout_vals[value + 4].length + payout_vals[value + 5].length + 2) + table_spacing[1]))/2;
        
    
    // Draw Left Column
    top = payout_transform[1] + payout_transform[3] * 0.09;
    top += top_indent;
    //top += (row_dimens[1] * (payout_vals[value + 4].length + payout_vals[value + 5].length + 2) + table_spacing[1]) / 2;
    for(var i = 0; i < 2; i++){
        var val = value + 5 - i;
        draw_table(val, left_col, top, table_width, row_dimens[1]);
        top += row_dimens[1] * (payout_vals[val].length + 1) + table_spacing[1];
        context.font = fnt;
    }
    
    
    context.drawImage(payout_text, canvas.width * payout_transform[0], canvas.height * payout_transform[1], canvas.width * payout_transform[2] * 0.285, canvas.height * payout_transform[3] * 0.185);
    //context.drawImage(payout_exit_img, canvas.width * (payout_transform[0] + payout_transform[2] * 0.75), canvas.height * payout_transform[1], canvas.width * payout_transform[2] * 0.25, canvas.width * payout_transform[2] * 0.25);
}

function draw_table(value, left, top, width, height){

    context.drawImage(payout_left, canvas.width * left, canvas.height * (top + height), canvas.width * width * 0.303, canvas.height * (height * payout_vals[value].length));
    context.drawImage(payout_top, canvas.width * left, canvas.height * top, canvas.width * width, canvas.height * height);
    
    var w = context.measureText(value).width;
    context.fillText(value + 1, canvas.width * (left + width * 0.15) - w / 2, (canvas.height * (top + height)) + (canvas.height * height * payout_vals[value].length * 0.7));
    
    auto_size_text(1, canvas.width, canvas.height * height * 0.8);
    
    var row_transform = [
        left + width * 0.3,
        top + height,
        width * 0.7,
        height
    ];
    
    for(var i = 0; i < payout_vals[value].length; i++){
        context.drawImage(payout_row,
                canvas.width * row_transform[0],
                canvas.height * row_transform[1],
                canvas.width * row_transform[2],
                canvas.height * row_transform[3]
            );
            
        var text_height = canvas.height * (row_transform[1] + row_transform[3] * 0.72);
        context.fillText((value - i) + 1, canvas.width * (row_transform[0] + row_transform[2] * 0.08), text_height);
        w = context.measureText(payout_vals[value][i]).width;
        context.fillText(payout_vals[value][i], canvas.width * (row_transform[0] + row_transform[2] * 0.6) - w / 2, text_height);
        
        row_transform[1] += height;
    }
}

function draw_square(square){
    context.globalAlpha = 0.55;
    context.drawImage(square.img, 
        canvas.width * square.transform[0],
        canvas.height * square.transform[1],
        canvas.width * square.transform[2],
        canvas.height * square.transform[3]
    );
    context.globalAlpha = 1;
}

function draw_lines(arg1){
    context.fillStyle = "#ffffff";
    
    
    // Vertical Lines
    var transform = [
        0,
        0,
        canvas.width * square_spacing,
        canvas.height
    ];
    for(var i = 0; i < 12; i++){
        transform[0] = canvas.width * i * (square_dimens[0] + square_spacing);
        if(i == 10){
            transform[3] = canvas.height * (square_dimens[1] + square_spacing) * 5;
        }
        context.fillRect(transform[0], transform[1], transform[2], transform[3]);
    }
    
    
    // Horizontal Lines
    transform = [
        0,
        0,
        canvas.width,
        canvas.height * square_spacing
    ];
    for(var i = 0; i < 10; i++){
        transform[1] = canvas.height * i * (square_dimens[1] + square_spacing);
        if(i == 6){
            transform[2] = canvas.width * 9 * (square_dimens[0] + square_spacing);
        }
        context.fillRect(transform[0], transform[1], transform[2], transform[3]);
    }
    
}

function draw_standard_text_scale(text){
    //console.log(text);
    context.fillText(text.txt, canvas.width * text.transform[0], canvas.height * text.transform[1], canvas.width * text.transform[2], canvas.height * text.transform[3]);
}

function draw_standard_text_center(text){
    var trans = [
                canvas.width * (text.transform[0] + text.transform[2] * 0.5) - context.measureText(text.txt).width/2,
                canvas.height * (text.transform[1] + (text.transform[3] * 0.7)),
                canvas.width * text.transform[2],
                canvas.height * text.transform[3]
    ];
    //console.log(text, trans);
    //stop_engine();
    //context.font = 20 + font;
    context.fillText(text.txt, trans[0], trans[1], trans[2], trans[3]);
}


function draw_standard_text(text){
    //console.log(text);
    context.fillText(text.txt, text.transform[0], text.transform[1], text.transform[2], text.transform[3]);
}

function draw_fancy_text(text, left, top){


    var w = context.measureText("T").width;
    context.strokeStyle ="#5b0262";
    context.miterLimit = 2;
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

function text_graphics(text){
    if(text.font != null){
        context.font = text.font;
    }
    if(text.color != null){
        context.fillStyle = text.color;
    }

    switch(text.style){
        case 0:
            draw_standard_text(text);
            break;
        case 1:
            draw_standard_text_scale(text);
            break;
        case 2:
            draw_standard_text_center(text);
            break;
        case 3:
            draw_fancy_text(text.txt, canvas.width * text.transform[0], canvas.height * text.transform[1]);
            break;
        case 4:
            draw_fancy_text(text.txt, canvas.width * text.transform[0] - context.measureText(text.txt).width/2, canvas.height * text.transform[1]);
            break;
        default:
            draw_standard_text(text);
            break;
    }
}



function create_keno_buttons(home_screen){
    //console.log("Creating Keno Buttons");
    // Creating Keno Background
    var value = 1;
    var fnt;
    for(var i = 0; i < 8; i++){
        var length = 9;
        if(i > 0 && i < 5){
            length = 11;
        } else if(i >= 5){
            length = 9;
        }
        
        for(var j = 0; j < length; j++){
            var transform = [(square_spacing + square_dimens[0]) * j, (square_spacing + square_dimens[1]) * i, square_dimens[0], square_dimens[1]];
            if(i == 0){
                transform[0] += transform[2];
            }
            var square = new_square(transform, value);
            if(value == 1){
                fnt = square.drawables[1].font;
            } else {
                square.drawables[1].font = fnt;
            }
            square.arg = value;
            home_screen = add_drawable(home_screen, square);
            value++;
        }
    }
    return home_screen;
}