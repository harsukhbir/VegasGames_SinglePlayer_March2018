/*
 To whomever has time to read this,
    This file is extremely messy and sloppy because it has been written during the hour before the release meeting.
    This is beacuse I only received the final assets at this time and was therefore unable to implement this prior to now.
 
 P.S. This SHOULD be implemented in an O.O. fashion but time......
*/

function bingo_draw_win_graphics(){
    context.globalAlpha = 0.8;
    context.drawImage(win_background, 0, 0, canvas_width, canvas_height);
    //context.drawImage(exit_btn_img, canvas_width * 0.105, canvas_height * 0.17, canvas_width * 0.075, canvas_height * 0.13);
    context.globalAlpha = 1;
    var top = canvas_height * 0.745;
    var height = canvas_height * 0.1;
    context.drawImage(user_background, canvas_width * 0.138, top, canvas_width * 0.19, height);
    context.drawImage(money_background, canvas_width * 0.361, top, canvas_width * 0.247, height);
    context.drawImage(facebook_invite, canvas_width * 0.645, top, canvas_width * 0.095, height);
    //context.drawImage(more_games, canvas_width * 0.77, top, canvas_width * 0.095, height);
    auto_size_text("mark w.", canvas_width * 0.1, canvas_height);
    var uname_disp = uname;
    if(isFacebook){
        uname_disp = facebook_info.name;
    }
    var swp = "";
    for(var i = 0; i < 7 && i < uname_disp.length; i++){
        swp += uname_disp[i];
    }
    uname_disp = swp;
   
    draw_fancy_text(uname_disp, canvas_width * 0.21, canvas_height * 0.81);
    draw_fancy_text("$" + money, canvas_width * 0.38, canvas_height * 0.81);

    /*
    draw_fancy_text("$" + money, canvas_width * 0.535 - context.measureText("$" + money).width, canvas_height * 0.81);
            auto_size_text("MORE", canvas_width * 0.045, canvas_height);
    if(language_selected == 0){
        draw_fancy_text("MORE", canvas_width * 0.805, canvas_height * 0.79);
        draw_fancy_text("GAMES", canvas_width * 0.805, canvas_height * 0.79 + context.measureText("W").width);
    } else{
        draw_fancy_text(words[4], canvas_width * 0.805, canvas_height * 0.79);
    }
    */



    context.drawImage(logo_bingo, canvas_width * 0.415, canvas_height * 0.165, canvas_width * 0.2, canvas_height * 0.23);
    context.drawImage(win_money_background, canvas_width * 0.325, canvas_height * 0.41, canvas_width * 0.39, canvas_height * 0.15);
    auto_size_text("$182", canvas_width * 0.14, canvas_height * 0.13);
    draw_fancy_text("$" + last_win, canvas_width * 0.5 - context.measureText("$" + last_win).width/2, canvas_height * 0.53);
    
    top = canvas_height * 0.61;
    height = canvas_height * 0.06;
    var width = canvas_width * 0.165;
    //
    context.drawImage(win_button_back, canvas_width * 0.325, top, width, height);
    context.drawImage(win_button_back, canvas_width * 0.55, top, width, height);
    auto_size_text(words[3], canvas_width * 0.15, height);
    draw_fancy_text(words[3], canvas_width * 0.33, canvas_height * 0.66);
    draw_fancy_text("replay", canvas_width * 0.585, canvas_height * 0.66);


}


function bingo_check_win_screen(x,y){
    if(x >= canvas_width * 0.105 && x <= canvas_width * 0.18){
        if(y >= canvas_height * 0.17 && y <= canvas_height * 0.3){
            // Exit Button
            //return_to_lobby();
            //return true;
        }
    }
    var top = canvas_height * 0.745;
    var height = canvas_height * 0.1;
    if(y >= top && y <= top + height){
        if(x >= canvas_width * 0.361 && x <= canvas_width * 0.608){
            // Money
            open_store();
            return true;
        } else if(x >= canvas_width * 0.645 && x <= canvas_width * (0.645 + 0.095)){
            // Facebook Invite
            flash("Nope");
            return true;
        } else if(x >= canvas_width * 0.77 && x <= canvas_width * (0.77 + 0.095)){
            // More Games
            // Probably not correct... but oh well
            //window.location = "http://vegasgames.com/";
            return true;
        }
    }

    top = canvas_height * 0.61;
    height = canvas_height * 0.06;
    var width = canvas_width * 0.165;
    // Yes ...  these both do the same thing, no idea why
    if(y >= top && y <= top + height){
        if(x >= canvas_width * 0.325 && x <= canvas_width * 0.325 + width){
            // select cards
            init_bingo();
            return true;
        } else if( x >= canvas_width * 0.55 && x <= canvas_width * 0.55 + width){
            // replay
            var tmp = desired_cards;
            init_bingo();
            desired_cards = tmp;
            bingo_get_numbers();
            return true;
        }
    }
    
    return false;
}