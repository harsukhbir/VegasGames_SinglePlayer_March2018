
function draw_lobby_buttons(){
    for(var i = 0; i < lobby_buttons.length; i++){
        if(i > 3 && i != 5){
        var transform = [canvas_width * lobby_buttons[i].transform[0], canvas_height * lobby_buttons[i].transform[1], canvas_width * lobby_buttons[i].transform[2], canvas_height * lobby_buttons[i].transform[3]];
        context.drawImage(lobby_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);
        context.font = lobby_buttons[i].font;
        context.fillStyle = lobby_buttons[i].font_color;
        var w = context.measureText(lobby_buttons[i].text).width / 2;
        context.fillText(lobby_buttons[i].text, transform[0] + transform[2] / 2 - w, transform[1] + transform[3] * 0.6);
        }
    }
    

}

function draw_game_buttons(){
    auto_size_text("jacks or better", canvas_width * 0.165, canvas_height);
    for(var i = 0; i < game_buttons.length; i++){
        var transform = [canvas_width * game_buttons[i].transform[0], canvas_height * game_buttons[i].transform[1], canvas_width * game_buttons[i].transform[2], canvas_height * game_buttons[i].transform[3]];
        context.drawImage(game_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);   
        draw_fancy_text(game_buttons[i].text, transform[0] + transform[2] * 0.5 - context.measureText(game_buttons[i].text).width / 2, transform[1] + transform[3] * 1.2);
    }
/*
    var left = canvas_width * (game_buttons[0].transform[0] + game_buttons[0].transform[2]*0.4) - context.measureText("video poker").width/2;
    var top = canvas_height * 0.7;
    var width = canvas_width * 0.195;
    var spacing = canvas_width * 0.025;
    context.fillStyle = "#ffffff";
    draw_fancy_text("video poker", left + (width - context.measureText("video poker").width)/2, top);
    
    left = canvas_width * (game_buttons[1].transform[0] + lobby_buttons[1].transform[2]/2) - context.measureText("jacks or better").width/2;
    draw_fancy_text("jacks or better", left + (width - context.measureText("jacks or better").width)/2, top);
    
    left = canvas_width * (lobby_buttons[2].transform[0] + lobby_buttons[2].transform[2]/3) - context.measureText("jokers wild").width/2;
    draw_fancy_text("jokers wild", left + (width - context.measureText("jokers wild").width)/2, top);
    
    left = canvas_width * (lobby_buttons[3].transform[0] + lobby_buttons[3].transform[2]*0.25) - context.measureText("bingo").width/2;
    draw_fancy_text("bingo", left + (width - context.measureText("bingo").width)/2, top);
    */
}


function draw_user_stats(){
    var left = canvas_width * 0.051;
    var top = canvas_height * 0.27;
    var spacing = [canvas_width * 0.05, canvas_height * 0.16];
    var titles = [words[10], words[11], words[12]];
    //user_stats = ["99,000,000", "5993", "321"];
    auto_size_text(words[10], canvas_width * 0.06, canvas_height);
    var title_offset = [canvas_width * 0.02, canvas_height * 0.05];

    var w = context.measureText("T").width;
    for(var i = 0; i < user_stats.length; i++){
        context.fillStyle = "#ffffff";
        context.fillText(user_stats[i], left + spacing[0]*i, top + spacing[1]*i);
        
        draw_fancy_text(titles[i], left + spacing[0]*i - title_offset[0], top + spacing[1] * i - title_offset[1]*1.3);
    }

}

function draw_user_buttons(){
    for(var i = 0; i < user_buttons.length; i++){

        var transform = [canvas_width * user_buttons[i].transform[0], canvas_height * user_buttons[i].transform[1], canvas_width * user_buttons[i].transform[2], canvas_height * user_buttons[i].transform[3]];
        if(i != 2)
            context.drawImage(user_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);
        context.font = user_buttons[i].font;

        // This needs to be customized to fit with each button on the page
        //var w = context.measureText(user_buttons[i].text).width / 2;
        //context.fillText(user_buttons[i].text, transform[0] + transform[2] / 2 - w, transform[1] + transform[3] * 0.6);
        if(i == 0){
            draw_fancy_text(user_buttons[i].text, transform[0] + transform[2] * 1.3, transform[1] + transform[3] * 0.6);
        } else if(i == 1){
            var w = context.measureText("T").width;
            draw_fancy_text(user_buttons[i].text, transform[0], transform[1]+w);
        } else if(i == 2){
            //draw_fancy_text(user_buttons[i].text, transform[0] - context.measureText(user_buttons[i].text).width, transform[1] + transform[3] * 0.6);
        } else if(i < 5){
            var break_point = false;

            var line1 = "";
            var line2 = "";
            for(var j = 0; j < user_buttons[i].text.length; j++){
                if(user_buttons[i].text[j] == '\n'){
                    break_point = true;
                } else if(break_point){
                    line2 += user_buttons[i].text[j];
                } else{
                    line1 += user_buttons[i].text[j];
                }
            }

            // Setting Up Text Outline
            var w = context.measureText(line1).width;
            draw_fancy_text(line1, transform[0] - w, transform[1] + transform[3] * 0.5);
            draw_fancy_text(line2, transform[0] - context.measureText(line2).width, transform[1] + (transform[3] * 0.6)+w/line1.length);
        }
        
    }
}

function draw_lobby_fields(){
    
}
function calc_settings_transition(){

    var final_positions = [0.84, 0.835, 0.805];
    var start_positions = [0.69, 0.77, 0.81];

    var speed = 0.0016;


    var found = -1;
    for(var i = 0; i < user_buttons.length; i++){
        if(user_buttons[i].text.indexOf("achiev") > -1){
            found = 0;
        }
        
        if(found != -1){
            if(found < final_positions.length){
                if(user_buttons[i].transform[0] < final_positions[found] && user_button_move){
                    user_buttons[i].transform[0] += speed;
                } else if(user_buttons[i].transform[0] > start_positions[found] && !user_button_move){
                    user_buttons[i].transform[0] -= speed;
                }
                if(user_buttons[i].text.indexOf("Facebook") > 0){
                    if(user_buttons[i].transform[0] - start_positions[found] > (final_positions[found] - start_positions[found])* 0.9){
                        show_settings = true;
                    } else {
                        show_settings = false;
                    }
                } 
                found++;
            }else{
                break;
            }
            
        }
        
    }     
}

function draw_language_dropdown(){
    var left = canvas_width * settings_buttons[0].transform[0];
    var top = canvas_height * settings_buttons[0].transform[1];
    var width = canvas_width * settings_buttons[0].transform[2];
    var height = canvas_height * settings_buttons[0].transform[3];
    if(!language_dropdown){
        if(!sound_dropdown){
            context.fillStyle = "#12ff00";
            context.fillText(language_list[language_selected], left + (width - context.measureText(language_list[selected_language]).width)/2, top + height * 0.6);
        }
        return;
    }
    for(var i = 0; i < language_list.length - dd_scroll  && i < 6; i++){
        context.fillStyle = "#ffffff";
        context.fillRect(left, top + height * i, width, height);
        context.fillStyle = "#12ff00";
        context.fillText(language_list[i+dd_scroll], left + (width - context.measureText(language_list[i + dd_scroll]).width)/2, top + height * (i + .6));
    }
}

function draw_sound_dropdown(){
    var left = canvas_width * settings_buttons[1].transform[0];
    var top = canvas_height * settings_buttons[1].transform[1];
    var width = canvas_width * settings_buttons[1].transform[2];
    var height = canvas_height * settings_buttons[1].transform[3];
    var sound_list = ["ON", "OFF"];
    if(!sound_dropdown){
        if(!language_dropdown){
            context.fillStyle = "#12ff00";
            if(sound_enabled)
                context.fillText("ON", left + (width - context.measureText("ON").width)/2, top + height * 0.6);
            else
                context.fillText("OFF", left + (width - context.measureText("OFF").width)/2, top + height * 0.6);
        }
        return;
    }
    for(var i = 0; i < sound_list.length; i++){
        context.fillStyle = "#ffffff";
        context.fillRect(left, top + height * i, width, height);
        context.fillStyle = "#12ff00";
        context.fillText(sound_list[i], left + (width - context.measureText(sound_list[i]).width)/2, top + height * (i + .6));
    }
}

function draw_settings_popup(){
    context.drawImage(settings_outline, canvas_width*0.3, canvas_height*0.3, canvas_width*0.32, canvas_height*0.585);
    auto_size_text(words[9], canvas_width * 0.17, canvas_height);
    draw_fancy_text(words[9], canvas_width * 0.4, canvas_height*0.325);
    for(var i = 0; i < settings_buttons.length; i++){
        context.font = settings_buttons[i].font;
        var transform = [canvas_width * settings_buttons[i].transform[0], canvas_height * settings_buttons[i].transform[1], canvas_width * settings_buttons[i].transform[2], canvas_height * settings_buttons[i].transform[3]];
        context.drawImage(settings_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);
        if(i < 2){
            draw_fancy_text(settings_buttons[i].text, transform[0] + transform[2] /2 - context.measureText(settings_buttons[i].text).width/2, transform[1] - transform[3] * 0.3);
        } else if(i == 2){
            draw_fancy_text(settings_buttons[i].text, transform[0] + transform[2] /2 - context.measureText(settings_buttons[i].text).width/2, transform[1] + transform[3] * 0.6);
        }
    }
    
    draw_language_dropdown();
    draw_sound_dropdown();
}

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

function draw_settings_user_pic(){
    if(isFacebook){
        var user_x = Math.floor(canvas_width*0.06);
        var user_y = Math.floor(canvas_width*0.06);
        if(fb_profile_pic == "Undefined"){
            get_fb_pic_src(user_x, user_y);
        } else {
            context.drawImage(fb_profile_pic, canvas_width * 0.68, canvas_height * 0.05, user_x, user_y);
        }
    } else {
        context.drawImage(user_pic_bg, canvas_width * 0.68, canvas_height * 0.05, canvas_width * 0.14, canvas_width * 0.14);
    }
    
    
    auto_size_text("Money: ", canvas_width * 0.1, canvas_height);
    draw_fancy_text("Money:   " + money, canvas_width * 0.031, canvas_height * 0.1);
    
    
    var left = canvas_width * 0.55;
    var top = canvas_height * 0.13;
    var width = canvas_width * 0.1;
    auto_size_text("JOHN. F", width, canvas_height);
    var w = context.measureText("T").width;
    left += context.measureText("JOHN. F").width - context.measureText(login_fields[0].text).width;
    

    
    
    var uname_disp = login_fields[0].text;
    if(isFacebook)
        uname_disp = facebook_info.name;
    /*
    for(var i = 0; i < login_fields[0].text.length && i < 7; i++){
        uname_disp += login_fields[0].text[i];
    }
    */
    draw_fancy_text(uname_disp, left, top);
}

function draw_settings_background(){
    context.drawImage(settings_background, 0, 0, canvas_width, canvas_height);
}

function draw_lobby_text(){
    auto_size_text("mark w.", canvas_width * 0.12, canvas_height);
    var uname_disp = "";
    if(!isFacebook){
        for(var i = 0; i < login_fields[0].text.length && i < 6; i++){
            uname_disp += login_fields[0].text[i];
        }
    } else {
        for(var i = 0; i < facebook_info.name.length && i < 6; i++){
            uname_disp += facebook_info.name[i];
        }
    }
    draw_fancy_text(uname_disp, canvas_width * 0.132, canvas_height * 0.92);
    var money_str = "$" + money.toString();
    draw_fancy_text(money_str, canvas_width * 0.53 - context.measureText(money_str).width, canvas_height * 0.92);
    //auto_size_text(words[9], canvas_width * 0.11, canvas_height * 0.06);
    //draw_fancy_text(words[9], canvas_width * 0.78, canvas_height * 0.1);
    /*
    auto_size_text("MORE", canvas_width * 0.035,canvas_height);
    if(language_selected == 0){
        draw_fancy_text("MORE", canvas_width * 0.865, canvas_height * 0.895);
        draw_fancy_text("GAMES", canvas_width * 0.865, canvas_height * 0.895 + context.measureText("W").width);
    } else{
        draw_fancy_text(words[8], canvas_width * 0.865, canvas_height * 0.895);
    }
    */
}

function draw_lobby_user_info(){
    context.drawImage(money_background, canvas_width * 0.325, canvas_height * 0.84, canvas_width * 0.3, canvas_height * 0.11);
    context.drawImage(user_background, canvas_width * 0.048, canvas_height * 0.84, canvas_width * 0.212, canvas_height * 0.11);
}

function draw_lobby_background(){
    context.drawImage(lobby_background, 0, 0, canvas_width, canvas_height);
    var width = canvas_width * 0.25;
    context.drawImage(logo, canvas_width * 0.04, canvas_height * 0.03, width, width / 3);
}

function draw_scroll_prompt(){
    if(!lobby_prompt)
        return;
    if(lobby_initial_scroll){
        if(!simulate_swipe(-0.0012))
            lobby_initial_scroll = false;
    }
    var transform = [
        canvas_width * 0.105,
        canvas_height * 0.21,
        canvas_width * 0.06,
        canvas_height * 0.06
    ];
    
    var draw = true;
    var right = canvas_width * 0.79;
    if(game_buttons[0].transform[0] != button_spacing[0]){
        //draw = false;
        //lobby_prompt = false;
    }
    if(prompt_state < 30){
        transform[0] -= canvas_width * 0.05 / 30 * prompt_state;
        right += canvas_width * 0.05 / 30 * prompt_state;
    } else if(prompt_state < 60){
        transform[0] -= canvas_width * 0.05;
        right += canvas_width * 0.05;
        transform[0] += canvas_width * 0.05 / 30 * (prompt_state - 30);
        right -= canvas_width * 0.05 / 30 * (prompt_state - 30);
        
    } else if(prompt_state < 90){
        transform[0] -= canvas_width * 0.05 / 30 * (prompt_state - 60);
        right += canvas_width * 0.05 / 30 * (prompt_state - 60);    
    } else if(prompt_state > 150){
        prompt_state = 0;
    } else {
        draw = false;
    }
    
    prompt_state += 0.15;
    
    
    
    if(draw && lobby_prompt){
        //console.log("Drawing Prompt");
        context.fillStyle = "#ffffff";
        if(!prompt_right){
            context.drawImage(prompt_left, transform[0], transform[1], transform[2], transform[3]);
            context.fillText("slide left for more games", transform[0] + transform[2] * 1.3, transform[1] + transform[3] * 0.7);
        } else {        
            transform[0] = right;
            context.fillText("slide right for more games", transform[0] - context.measureText("slide right for more games").width * 1.2 , transform[1] + transform[3] * 0.7);
            context.drawImage(prompt_right, transform[0], transform[1], transform[2], transform[3]);
        }
    } 
}
function draw_lobby(){
    //check_button_spacing();
    if(mode == 100){
        draw_lobby_background();
        draw_lobby_user_info();
        draw_lobby_buttons();
        draw_game_buttons();
        draw_lobby_text();
        draw_lobby_fields();
        draw_scroll_prompt();
    } else if(mode == 101){
        draw_settings_background();
        calc_settings_transition();
        draw_user_stats();
        draw_user_buttons();
        draw_settings_user_pic();
        if(show_settings){
            draw_settings_popup();
        }
    }
    if(store_open){
        store_graphics();
    }
    
    /*
    auto_size_text("VEGAS GAMES!", canvas_width, canvas_height);
    context.fillStyle = "#000000";
    context.fillText("VEGAS GAMES", 0, canvas_height * 0.6);
    */
}


