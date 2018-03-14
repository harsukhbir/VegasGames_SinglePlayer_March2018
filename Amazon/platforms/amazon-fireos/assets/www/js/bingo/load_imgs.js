function bingo_load_images(){
    function bingo_img_load_callback(){
        bingo_img_load_count++;
        if(bingo_img_load_count >= bingo_img_count){
            bingo_img_load_complete = true;
        }
    }
    
    bingo_img_count = 41;
    bingo_img_load_count = 0;
    
    board_imgs = [];
    board_imgs.push(new Image());
    board_imgs[0].onload = bingo_img_load_callback;
    board_imgs[0].src = img_dir + img_mod + img_path + "b_col_img.png";
    board_imgs.push(new Image());
    board_imgs[1].onload = bingo_img_load_callback;
    board_imgs[1].src = img_dir + img_mod + img_path + "i_col_img.png";
    board_imgs.push(new Image());
    board_imgs[2].onload = bingo_img_load_callback;
    board_imgs[2].src = img_dir + img_mod + img_path + "n_col_img.png";
    board_imgs.push(new Image());
    board_imgs[3].onload = bingo_img_load_callback;
    board_imgs[3].src = img_dir + img_mod + img_path + "g_col_img.png";
    board_imgs.push(new Image());
    board_imgs[4].onload = bingo_img_load_callback;
    board_imgs[4].src = img_dir + img_mod + img_path + "o_col_img.png";
    
    exit_btn_img = new Image();
    exit_btn_img.onload = bingo_img_load_callback;
    exit_btn_img.src = img_dir + img_mod + img_path + "exit_btn_img.png";
    //exit_btn = exit_btn_img;
    
    board_back = new Image();
    board_back.onload = bingo_img_load_callback;
    board_back.src = img_dir + img_mod + img_path + "board_back.png";
    
    chosen_board_img = new Image();
    chosen_board_img.onload = bingo_img_load_callback;
    chosen_board_img.src = img_dir + img_mod + img_path + "chosen_board_img.png";
    
    bingo_btn_img = new Image();
    bingo_btn_img.onload = bingo_img_load_callback;
    bingo_btn_img.src = img_dir + img_mod + img_path + "bingo_btn.png";
    
    ball_count_back = new Image();
    ball_count_back.onload = bingo_img_load_callback;
    ball_count_back.src = img_dir + img_mod + img_path + "ball_count_back.png";
    
    background = new Image();
    background.onload = bingo_img_load_callback;
    background.src = img_dir + img_mod + img_path + "background.png";
    
    ball_queue_img = new Image();
    ball_queue_img.onload = bingo_img_load_callback;
    ball_queue_img.src = img_dir + img_mod + img_path + "ball_queue_img.png";
    
    ball_count_back = new Image();
    ball_count_back.onload = bingo_img_load_callback;
    ball_count_back.src = img_dir + img_mod + img_path + "ball_count_back.png";
    
    scroll_bar_back = new Image();
    scroll_bar_back.onload = bingo_img_load_callback;
    scroll_bar_back.src = img_dir + img_mod + img_path + "scroll_bar_back.png";
    
    scroll_bar = new Image();
    scroll_bar.onload = bingo_img_load_callback;
    scroll_bar.src = img_dir + img_mod + img_path + "scroll_bar.png";
    
    card_back_small = new Image();
    card_back_small.onload = bingo_img_load_callback;
    card_back_small.src = img_dir + img_mod + img_path + "card_back_small.png";
    
    bang = new Image();
    bang.onload = bingo_img_load_callback;
    bang.src = img_dir + img_mod + img_path + "bang.png";
    
    bingo_balls = [];
    bingo_balls.push(new Image());
    bingo_balls[0].onload = bingo_img_load_callback;
    bingo_balls[0].src = img_dir + img_mod + img_path + "b_ball.png";
    bingo_balls.push(new Image());
    bingo_balls[1].onload = bingo_img_load_callback;
    bingo_balls[1].src = img_dir + img_mod + img_path + "i_ball.png";
    bingo_balls.push(new Image());
    bingo_balls[2].onload = bingo_img_load_callback;
    bingo_balls[2].src = img_dir + img_mod + img_path + "n_ball.png";
    bingo_balls.push(new Image());
    bingo_balls[3].onload = bingo_img_load_callback;
    bingo_balls[3].src = img_dir + img_mod + img_path + "g_ball.png";
    bingo_balls.push(new Image());
    bingo_balls[4].onload = bingo_img_load_callback;
    bingo_balls[4].src = img_dir + img_mod + img_path + "o_ball.png";
    
    card_select_img = new Image();
    card_select_img.onload = bingo_img_load_callback;
    card_select_img.src = img_dir + img_mod + img_path + "bingo_card_select.png";
    
    select_background = new Image();
    select_background.onload = bingo_img_load_callback;
    select_background.src = img_dir + img_path + "select_background.png";
    
    back_img = new Image();
    back_img.onload = bingo_img_load_callback;
    back_img.src = img_dir + img_mod + img_path + "back_btn.png";
    
    money_background = new Image();
    money_background.onload = bingo_img_load_callback;
    money_background.src = img_dir + img_mod + img_path + "money_background.png";
    
    card_select_outline = new Image();
    card_select_outline.onload = bingo_img_load_callback;
    card_select_outline.src = img_dir + img_mod + img_path + "card_select_outline.png";
    
    

    user_background = new Image();
    user_background.onload = bingo_img_load_callback;
    user_background.src = img_dir + img_mod + img_path + "user_background.png";
    
    facebook_invite = new Image();
    facebook_invite.onload = bingo_img_load_callback;
    facebook_invite.src = img_dir + img_mod + img_path + "facebook_invite.png";
    
    win_background = new Image();
    win_background.onload = bingo_img_load_callback;
    win_background.src = img_dir + img_mod + img_path + "win_background.png";
    
    win_button_back = new Image();
    win_button_back.onload = bingo_img_load_callback;
    win_button_back.src = img_dir + img_mod + img_path + "win_button_back.png";
    
    more_games = new Image();
    more_games.onload = bingo_img_load_callback;
    // more_games.src = img_dir + img_mod + img_path + "more_games.png";
    
    logo_bingo = new Image();
    logo_bingo.onload = bingo_img_load_callback;
    logo_bingo.src = img_dir + img_mod + img_path + "logo_bingo.png";
    
    win_money_background = new Image();
    win_money_background.onload = bingo_img_load_callback;
    win_money_background.src = img_dir + img_mod + img_path + "win_money_background.png";
    
    store_imgs = [];
    store_imgs.push(new Image());
    store_imgs[0].onload = bingo_img_load_callback;
    store_imgs[0].src = img_dir + img_mod + img_path + "store1.png";
    store_imgs.push(new Image());
    store_imgs[1].onload = bingo_img_load_callback;
    store_imgs[1].src = img_dir + img_mod + img_path + "store2.png";
    store_imgs.push(new Image());
    store_imgs[2].onload = bingo_img_load_callback;
    store_imgs[2].src = img_dir + img_mod + img_path + "store3.png";
    store_imgs.push(new Image());
    store_imgs[3].onload = bingo_img_load_callback;
    store_imgs[3].src = img_dir + img_mod + img_path + "store4.png";

    
    store_background = new Image();
    store_background.onload = bingo_img_load_callback;
    store_background.src = img_dir + img_mod + img_path + "store_background.png";
    
    logo = new Image();
    logo.onload = bingo_img_load_callback;
    logo.src = img_dir + "logo.png";
    
    
    
    if(!win_screen_init){
        bingo_load_win_images();
        win_screen_init = true;
    }
}