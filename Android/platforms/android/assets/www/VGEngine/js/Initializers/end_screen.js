var Keno_New_Games = "Keno - New Game";
  var Keno_New_Games_No = {
    "Keno - New Games_No": "1"
  };

  var Keno_Replay_Game = "Keno - Replay Game";
  var Keno_Replay_Game_No = {
    "Keno - Replay Game_No": "1"
  };
  

function init_end_screen(){
    var background = new_static_img(null_img, [0,0,1,1], 1);
    var end_screen = new_screen(background);
        
    /*
    var end_back = new_static_img(win_back,[0.05, 0.13, 0.843, 0.735], 0);
    end_screen = add_drawable(end_screen, end_back);
    
    var balls_img = new_static_img(end_balls, [0,0,1,1], 3);
    end_screen = add_drawable(end_screen, balls_img);
    
    
    // Creating New Game and Replay Buttons
    var new_game_transform = [
        0.295,
        0.58,
        0.17,
        0.06
    ];
    var new_game_image = new_static_img(new_game_img, new_game_transform, 2);
    var new_game_btn = new_button(2, new_game_transform, new_game_btn_click);
    new_game_btn = add_drawable(new_game_btn, new_game_image);
    end_screen = add_drawable(end_screen, new_game_btn);
    
    var replay_transform = new_game_transform.slice();
    replay_transform[0] = 0.52;
    var replay_image = new_static_img(replay_img, replay_transform, 2);
    var replay_btn = new_button(2, replay_transform, replay_btn_click);
    replay_btn = add_drawable(replay_btn, replay_image);
    end_screen = add_drawable(end_screen, replay_btn);
    
    
    // Creating Exit Btn
    var exit_transform = [
        0.065,
        0.135,
        0.075,
        0.125
    ];
    var end_exit_btn_image = new_static_img(end_exit, exit_transform, 2);
    var exit_btn = new_button(2, exit_transform, splash_screen_exit);
    exit_btn = add_drawable(exit_btn, end_exit_btn_image);
    end_screen = add_drawable(end_screen, exit_btn);
    
    // Creating facebook button
    var facebook_transform = [
        0.615,
        0.715,
        0.095,
        0.1
    ];
    var facebook_button = new_button(2, facebook_transform, facebook_share);
    var facebook_button_img = new_static_img(facebook_share_img, facebook_transform, 2);
    facebook_button = add_drawable(facebook_button, facebook_button_img);
    end_screen = add_drawable(end_screen, facebook_button);
    
    // Creating More Games button
    
    var more_games_transform = facebook_transform.slice();
    more_games_transform[0] = 0.745;

    // Creating User Display
    var user_transform = more_games_transform.slice();
    user_transform[0] = 0.11;
    user_transform[2] = 0.18;
    var user_disp = new_static_img(user_background, user_transform, 2);
    user_disp.id = "user_disp";

    var user_text_transform = [
        user_transform[0] + user_transform[2] * 0.39,
        user_transform[1] + user_transform[3] * 0.6,
        user_transform[2] * 0.65,
        user_transform[3]
    ];
    var user_fnt = auto_size_text("mark w.", canvas.width * user_text_transform[0] * 0.6, canvas.height * user_text_transform[3]) + font;
    var user_text = new_text("", user_fnt, 3, user_text_transform, 3, "#ffffff");
    user_text.id = "user_text";
    user_disp = add_drawable(user_disp, user_text);
    end_screen = add_drawable(end_screen, user_disp);
    
    // Creating Money Display
    var money_transform = facebook_transform.slice();
    money_transform[0] = 0.335;
    money_transform[2] = 0.245;
    var money_disp = create_money_display(money_transform);
    console.log(money_disp);
    var money_disp_img = get_drawable_with_id(money_disp, "money_image_back");
    money_disp_img.img = end_money_bg;
    end_screen = add_drawable(end_screen, money_disp);
    
    
    // Creating Win Display
    var fnt = auto_size_text("$182", canvas.width * 0.145, canvas.height * 0.1) + font;
    var win_display = new_text("", fnt, 4, [0.5, 0.5, 0.145, 0.1], 3, "#ffffff");
    win_display.id = "win_display";
    end_screen = add_drawable(end_screen, win_display);

    */
    
    // End Screen Loading Behaviour
    end_screen.onOpen = function(){
        last_win = 0;
        
        img_dir = "img/";
        bingo_win_init();
        
        experience += 15;
        show_payout = false;
        update_money_display();
        var user_text = get_drawable_with_id(get_drawable_with_id(screens[3], "user_disp"), "user_text");
        user_text.txt = "";
        if(isFacebook){
            for(var i = 0; i < 7 && i < facebook_info.name.length; i++){
                user_text.txt += facebook_info.name[i];
            }
        } else {
            for(var i = 0; i < 7 && i < u.length; i++){
                user_text.txt += u[i];
            }
        }
        console.log("Setting!");
        var payout_txt = get_drawable_with_id(screens[3], "win_display");
        payout_txt.txt = "$" + calc_win();
        console.log("Done");
        
    }
    
    
    return end_screen;
    
}



function new_game_btn_click(){
   console.log("new_game_btn_click");
    selected_games = 1;
    update_games_display();
    screens[0].games.txt = 'Games: ' + selected_games;
    console.log(selected_games);

    reset_game();
    change_mode(4);
    create_timers();
    // alert("new keno");
    window.plugins.appsFlyer.trackEvent(Keno_New_Games, Keno_New_Games_No);
}

function replay_btn_click(){
    selected_games = 1;
    update_games_display();
    screens[0].games.txt = 'Games: ' + selected_games;
    console.log(selected_games);

    console.log("replay_btn_click");
    clear_chosen_numbers();
    start_game();
    create_timers();
    // alert("replay keno");

    window.plugins.appsFlyer.trackEvent(Keno_Replay_Game, Keno_Replay_Game_No);
}

function facebook_share(){
    
}