
/*
SHARED WITH VP
*/
var win_top, win_height, win_lowest, win_bounce;
var win_fall_rate, win_accel, win_terminal;

var win_sounds, shuffle_sounds, select_sounds, unpick_sounds, lose_sounds, announcement_sounds, deal_sounds, bad_click_sounds, bet_sounds, outofcash;


/*
    UNIQUE
*/
function init_jb_vars(){
    server_url = server_address + "job/";
    last_winning = 0;
    img_dir = "img/";
    img_path = "job/";
    img_mod = "";
    font = 'px POETSENONE-REGULAR';



    deck = [];
    hand = [];
    selected = [];
    font, font_size;

    initialzed = false;
    cash = 0;
    bet = 0;
    bet_amount = 1;
    primary_bet = 0;
    max_bet = bet_amount * 5;
    min_bet = bet_amount;


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
    score_outline = new Image();
    buy_btn_img = new Image();
    //load_imgs();

    canvas.addEventListener('click', vp_click_handler, false);

    mode = 0;



    audio_on = true;
    hand_types = ["Royal Flush", "Straight Flush", "4 of a Kind", "Full House", "Flush", "Straight", "3 of a Kind", "Two Pair", "Jacks or Better"];
    hand_values = [250,50,25,9,6,4,3,2,1];

    switch_language(language_selected, 1);
    hand_types = [words[6], words[7], "4 Of A Kind", words[9], words[10], words[11], "3 Of A Kind", "Two Pair", words[13]];


}
var store_background, store_imgs, logo;
var logo;
