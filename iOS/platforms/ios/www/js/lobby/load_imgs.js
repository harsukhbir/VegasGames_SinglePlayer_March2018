function lobby_img_load_callback(){
    lobby_images_loaded++;
    if(lobby_images_loaded >= lobby_image_count || true){
        //console.log('img Load complete');
        loading_images = false;
        lobby_can_draw = true;
    }
}
function lobby_load_images(){
    loading_images = true;
    lobby_can_draw = false;
    //console.log("loading Lobby Images");
    lobby_image_count = 42;
    lobby_images_loaded = 0;
    
    login_btn = new Image();
    login_btn.onload = lobby_img_load_callback;
    login_btn.src = img_dir + img_mod + img_path + "login_btn.png";
    
    create_new_btn = new Image();
    create_new_btn.onload = lobby_img_load_callback;
    create_new_btn.src = img_dir + img_mod + img_path + "create_new_account_btn.png";
    
    text_field_back = new Image();
    text_field_back.onload = lobby_img_load_callback;
    text_field_back.src = img_dir + img_mod + img_path + "text_field_back.png";
    
    lobby_background = new Image();
    lobby_background.onload = lobby_img_load_callback;
    lobby_background.src = img_dir + img_mod + img_path + "lobby_background.png";
    
    video_poker_img = new Image();
    video_poker_img.onload = lobby_img_load_callback;
    video_poker_img.src = img_dir + img_path + "video_poker_img.png";
    
    jacks_or_better_img = new Image();
    jacks_or_better_img.onload = lobby_img_load_callback;
    jacks_or_better_img.src = img_dir + img_path + "jacks_or_better_img.png";
    
    jokers_wild_img = new Image();
    jokers_wild_img.onload = lobby_img_load_callback;
    jokers_wild_img.src = img_dir + img_path + "jokers_wild_img.png";
    
    bingo_img = new Image();
    bingo_img.onload = lobby_img_load_callback;
    bingo_img.src = img_dir + img_path + "bingo_img.png";
    
    demo_btn = new Image();
    demo_btn.onload = lobby_img_load_callback;
    demo_btn.src = img_dir + img_mod + img_path + "demo_btn.png";
    
    create_cancel = new Image();
    create_cancel.onload = lobby_img_load_callback;
    create_cancel.src = img_dir + img_mod + img_path + "create_cancel.png";
    
    create_done = new Image();
    create_done.onload = lobby_img_load_callback;
    create_done.src = img_dir + img_mod + img_path + "create_done.png";
    
    null_img = new Image();
    null_img.onload = lobby_img_load_callback;
    null_img.src = img_dir + img_path + "null_img.png";
    
    vg_login_btn = new Image();
    vg_login_btn.onload = lobby_img_load_callback;
    vg_login_btn.src = img_dir + img_path + "vegas_login_btn.png";
    
    fb_login_btn = new Image();
    fb_login_btn.onload = lobby_img_load_callback;
    fb_login_btn.src = img_dir + img_mod + img_path + "facebook_login_btn.png";
    
    guest_login_btn = new Image();
    guest_login_btn.onload = lobby_img_load_callback;
    guest_login_btn.src = img_dir + img_mod + img_path + "guest_btn.png";
    
    user_back_img = new Image();
    user_back_img.onload = lobby_img_load_callback;
    user_back_img.src = img_dir + img_mod + img_path + "user_back_img.png";
    
    user_setting_img = new Image();
    user_setting_img.onload = lobby_img_load_callback;
    user_setting_img.src = img_dir + img_mod + img_path + "user_setting_img.png";
    
    user_achievement_img = new Image();
    user_achievement_img.onload = lobby_img_load_callback;
    user_achievement_img.src = img_dir + img_mod + img_path + "user_achievement_img.png";
    
    user_more_cash_img = new Image();
    user_more_cash_img.onload = lobby_img_load_callback;
    user_more_cash_img.src = img_dir + img_mod + img_path + "user_more_cash_img.png";
    
    user_pic_bg = new Image();
    user_pic_bg.onload = lobby_img_load_callback;
    user_pic_bg.src = img_dir + img_mod + img_path + "user_pic_bg.png";
    
    settings_background = new Image();
    settings_background.onload = lobby_img_load_callback;
    settings_background.src = img_dir + img_mod + img_path + "settings_background.png";
    
    settings_outline = new Image();
    settings_outline.onload = lobby_img_load_callback;
    settings_outline.src = img_dir + img_mod + img_path + "settings_popup.png";
    
    dropdown = new Image();
    dropdown.onload = lobby_img_load_callback;
    dropdown.src = img_dir + img_mod + img_path + "dropdown.png";
    
    logout_back = new Image();
    logout_back.onload = lobby_img_load_callback;
    logout_back.src = img_dir + img_mod + img_path + "logout_back.png";
    
    logo = new Image();
    logo.onload = lobby_img_load_callback;
    logo.src = img_dir + "logo.png";
       
    money_background = new Image();
    money_background.onload = lobby_img_load_callback;
    money_background.src = img_dir + img_mod + img_path + "money_background.png";
    
    user_background = new Image();
    user_background.onload = lobby_img_load_callback;
    user_background.src = img_dir + img_mod + img_path + "user_background.png";
    
    facebook_share_img = new Image();
    facebook_share_img.onload = lobby_img_load_callback;
    facebook_share_img.src = img_dir + img_mod + img_path + "facebook_share.png";
    
    facebook_invite_img = new Image();
    facebook_invite_img.onload = lobby_img_load_callback;
    facebook_invite_img.src = img_dir + img_mod + img_path + "facebook_invite.png";
    
    more_games_img = new Image();
    more_games_img.onload = lobby_img_load_callback;
    more_games_img.src = img_dir + img_mod + img_path + "more_games.png";
    
    store_imgs = [];
    store_imgs.push(new Image());
    store_imgs[0].onload = lobby_img_load_callback;
    store_imgs[0].src = img_dir + img_mod + img_path + "store1.png";
    store_imgs.push(new Image());
    store_imgs[1].onload = lobby_img_load_callback;
    store_imgs[1].src = img_dir + img_mod + img_path + "store2.png";
    store_imgs.push(new Image());
    store_imgs[2].onload = lobby_img_load_callback;
    store_imgs[2].src = img_dir + img_mod + img_path + "store3.png";
    store_imgs.push(new Image());
    store_imgs[3].onload = lobby_img_load_callback;
    store_imgs[3].src = img_dir + img_mod + img_path + "store4.png";

    store_background = new Image();
    store_background.onload = lobby_img_load_callback;
    store_background.src = img_dir + img_mod + img_path + "store_background.png";
    
    exit_btn = new Image();
    exit_btn.onload = lobby_img_load_callback;
    exit_btn.src = img_dir + img_mod + img_path + "exit_btn.png";
    
    
    prompt_left = new Image();
    prompt_left.onload = lobby_img_load_callback;
    prompt_left.src = img_dir + img_mod + img_path + "prompt_left.png";
    
    prompt_right = new Image();
    prompt_right.onload = lobby_img_load_callback;
    prompt_right.src = img_dir + img_mod + img_path + "prompt_right.png";
    
    keno_img = new Image();
    keno_img.onload = lobby_img_load_callback;
    keno_img.src = img_dir  + img_path + "keno_img.png";
    
    moneywheel_lobby_img = new Image();
    moneywheel_lobby_img.onload = lobby_img_load_callback;
    moneywheel_lobby_img.src = img_dir + img_path + "moneywheel_lobby_img.png";
    
    roulette_lobby_img = new Image();
    roulette_lobby_img.onload = lobby_img_load_callback;
    roulette_lobby_img.src = img_dir + img_path + "roulette_lobby_img.png";
    
    white_logo = new Image();
    white_logo.onload = lobby_img_load_callback;
    white_logo.src = img_dir + "whitelogo.png";
    
    
    logo_tilt = new Image();
    logo_tilt.onload = lobby_img_load_callback;
    logo_tilt.src = img_dir + img_path + "logo_tilt.png";
}

