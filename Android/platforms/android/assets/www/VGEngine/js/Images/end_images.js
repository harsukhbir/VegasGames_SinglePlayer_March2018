function load_end_image(){
    var dir = img_dir + "win_screen/";
    end_balls = new Image();
    end_balls.src = dir + "balls.png";

    end_exit = new Image();
    end_exit.src = dir + "exit_btn.png";

    facebook_share_img = new Image();
    facebook_share_img.src = dir + "facebook.png";

    end_money_bg = new Image();
    end_money_bg.src = dir + "money_background.png";

    more_games_img = new Image();
    // more_games_img.src = dir + "more_games.png";


    new_game_img = new Image();
    new_game_img.src = dir + "new_game.png";

    replay_img = new Image();
    replay_img.src = dir + "replay.png";

    user_background = new Image();
    user_background.src = dir + "user_back.png";

    win_back = new Image();
    win_back.src = dir + "win_background.png";
    
    null_img = new Image();
    null_img.src = dir + "null_img.png";
}

var end_balls, end_exit, facebook_share_img, end_money_bg, more_games_img, new_game_img, replay_img, user_background, win_back, null_img;