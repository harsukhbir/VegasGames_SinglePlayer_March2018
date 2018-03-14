function jw_init_vars(){
    last_winning = 0;
    msg_timer = 0;
    server_url = server_address + "jokers_are_wild/";
    font = 'px POETSENONE-REGULAR';
    
    
    audio_on = true;
    deck = [];
    hand = [];
    selected = [];


    initialzed = false;

    // These variables need to go to the back end
    cash = 0;
    bet = 0;
    bet_amount = 1;
    primary_bet = 0;
    max_bet = bet_amount * 5;
    min_bet = bet_amount;
    
    
    joker_img = [];
    joker_img.push(new Image());
    joker_img.push(new Image());
    
    mode = 0;
    
    hand_values = [800,200,100,50,18,7,5,3,2,1,1];
    
    switch_language(language_selected,2);
    
    
    hand_types = [words[7], words[8], words[9], words[10], "Straight Flush", words[11], words[12], words[13], words[14], words[15], words[16]];
    
    img_dir = "img/";
    img_path = "jaw/";
    img_mod = "";
    
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
    
    card_suit = [];
    card_suit.push(new Image());
    card_suit.push(new Image());
    card_suit.push(new Image());
    card_suit.push(new Image());
}

// #SOUND
var win_sounds, shuffle_sounds, select_sounds, unpick_sounds, lose_sounds, announcement_sounds, deal_sounds, bad_click_sounds, bet_sounds, outofcash, joker_sound;


// #RULES
var last_winning;

// #IMAGES
var store_background, store_imgs, logo;



// #LOGIC
var joker_img;


