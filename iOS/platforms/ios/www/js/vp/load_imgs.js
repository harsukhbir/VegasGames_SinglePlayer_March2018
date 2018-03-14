function vp_load_images(){
    background_image = new Image();
    bottom_btn = new Image();
    bottom_bar = new Image();
    bet_img = new Image();
    bet_base = new Image();
    plus = new Image();
    minus = new Image();
    star_img = new Image();
    max_bet_img = new Image();
    deal_img = new Image();
    lock_img = new Image();
    exit_btn = new Image();
    payout_table_img = new Image();
    payout_back = new Image();
    play_img = new Image();
    card_back = new Image();
    score_back = new Image();
    payout_exit = new Image();
    card_back_img = new Image();
    win_bar = new Image();
    buy_btn_img = new Image();
    
    
    
    background_image.src = img_dir + img_path + "back_texture.png";
    bottom_bar.src = img_dir + img_mod + img_path + "bottom_bar.png";
    bottom_btn.src = img_dir + img_mod + img_path + "bottom_btn.png";
    deal_img.src= img_dir + img_mod + img_path + "deal_img.png";
    bet_img.src = img_dir + img_mod + img_path + "bet_img.png";
    bet_base.src = img_dir + img_mod + img_path + "bet_base.png";
    plus.src = img_dir + img_mod + img_path + "bet_more_img.png";
    lock_img.src = img_dir + img_mod + img_path + "lock_img.png";
    minus.src = img_dir + img_mod + img_path + "bet_less_img.png";
    max_bet_img.src = img_dir + img_mod + img_path + "bet_max_img.png";
    card_back.src = img_dir + img_mod + img_path + "card_back.png";
    score_back.src = img_dir + img_mod + img_path + "score_bg.png";
    payout_table_img.src = img_dir + img_mod + img_path + "pay_table_img.png";
    payout_back.src = img_dir + img_mod + img_path + "payout_back.png";
    payout_exit.src = img_dir + img_mod + img_path + "payout_exit.png";
    exit_btn.src = img_dir + img_mod + img_path + "exit_btn.png";
    card_back_img.src = img_dir + img_mod + img_path + "card_back_img.png";
    win_bar.src = img_dir + img_mod + img_path + "win_bar.png";
    buy_btn_img.src = img_dir + img_mod + img_path + "buy_btn_img.png";
    
    logo = new Image();
    logo.src = img_dir + "logo.png";
    
    /*
    store_imgs = [];
    store_imgs.push(new Image());
    store_imgs[0].src = "img/store/store1.png";
    store_imgs.push(new Image());
    store_imgs[1].src = "img/store/store2.png";
    store_imgs.push(new Image());
    store_imgs[2].src = "img/store/store3.png";
    store_imgs.push(new Image());
    store_imgs[3].src = "img/store/store4.png";

    store_background = new Image();
    store_background.src = "img/store/store_background.png";
    */
    
    card_suit.push(new Image());
    card_suit[0].src = img_dir + img_mod + img_path + "diamond.png";
    card_suit.push(new Image());
    card_suit[1].src = img_dir + img_mod + img_path + "club.png";
    card_suit.push(new Image());
    card_suit[2].src = img_dir + img_mod + img_path + "heart.png";
    card_suit.push(new Image());
    card_suit[3].src = img_dir + img_mod + img_path + "spade.png";
    
    
    vp_load_win_screen_images();
}
var store_background, store_imgs, logo;
var logo;