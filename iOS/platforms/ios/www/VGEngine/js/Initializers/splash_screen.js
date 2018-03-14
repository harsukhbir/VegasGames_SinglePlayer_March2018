function init_splash_screen(){
    
    var background = new_static_img(splash_bg,[0,0,1,1],0);
    var splash_screen = new_screen(background);
    
    var transform = [0.39, 0.365, 0.17, 0.3];
    var start_btn = new_button(2, transform, function(){change_mode(4);});
    var start_btn_img = new_static_img(start_game_splash_image, transform, 0);

    //start_btn = add_drawable(start_btn, start_btn_img);
    
    splash_screen = add_drawable(splash_screen, start_btn);
    
    var exit_transform = [
        0.01,
        0.035,
        0.09,
        aspect_ratio * 0.09
    ];
    var exit_btn = new_button(2, exit_transform, splash_screen_exit);
    var exit_img = new_static_img(splash_exit_img, exit_transform, 0);
    exit_btn = add_drawable(exit_btn, exit_img);
    splash_screen.onOpen = splash_screen_open;
    splash_screen = add_drawable(splash_screen, exit_btn);
    
    var splash_logo = new_static_img(logo_tilt, [0.36, 0.09, 0.08, 0.06], 1);
    splash_screen = add_drawable(splash_screen, splash_logo);
    
    
    var money_display_transform = [
        0.725,
        0.88,
        0.265,
        0.11
    ];
    splash_screen = add_drawable(splash_screen, create_money_display(money_display_transform));
    splash_screen.id = "splash_screen";
/*
    var bet_transform = [
        0.36,
        0.88,
        0.265,
        0.105
    ];
    var fnt =  auto_size_text("GAMES", canvas.width * 0.1, canvas.height * bet_transform[3]) + font;
    var inc_dec_bet = new_increase_decrease(bet_transform, "BET", fnt, increase_bet, decrease_bet);
    splash_screen = add_drawable(splash_screen, inc_dec_bet);
    //console.log(inc_dec_bet);

    var games_transform = bet_transform.slice();
    games_transform[0] = 0.63;
    var inc_dec_games = new_increase_decrease(games_transform, "GAMES", fnt, increase_games, decrease_games);
    splash_screen = add_drawable(splash_screen, inc_dec_games);
    
    var bet_display_transform = [
        0.515,
        0.88,
        0.05,
        0.105
    ];
    var bet_display = new_text(current_bet, fnt, 2, bet_display_transform, 5, "#ffffff");
    bet_display.id = "bet_display";
    splash_screen = add_drawable(splash_screen, bet_display);
    
    var games_display_transform = bet_display_transform.slice();
    games_display_transform[0] = games_transform[0] + 0.155;
    var games_display = new_text(selected_games, fnt, 2, games_display_transform, 5, "#ffffff");
    games_display.id = "games_display";
    splash_screen = add_drawable(splash_screen, games_display);
*/    

    //screens.push(splash_screen);
    return splash_screen;
}


function splash_screen_open(){
    
}