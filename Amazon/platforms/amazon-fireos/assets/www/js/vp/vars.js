function init_vp_vars(){
    last_winning = 0;
    
    font_size = 10;
    
    font = 'px POETSENONE-REGULAR';
    
    server_url = server_address + "video_poker/";
    audio_on = true;
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
    
    
    img_dir = "img/";
    img_path = "vp/";
    img_mod = "";
    
    mode = 0;
    msg_timer = 0;
    
    card_suit = [];

    hand_types = [words[6], words[7], "4 Of A Kind", words[9], words[10], words[11], "3 Of A Kind", words[12], words[13]];
    hand_values = [250,50,25,9,6,4,3,2];
}



//# Win Graphics
var win_top, win_height, win_lowest, win_bounce;
var win_fall_rate, win_accel, win_terminal;
var exp_bar, vp_win_state;
var msg_timer, vp_lose_phrase;
var vp_exp_bar_back, vp_exp_bar_front, vp_exp_bar_wheel, vp_win_star, vp_win_star_back, vp_win_black, vp_lose_star;
// #Sounds
var win_sounds, shuffle_sounds, select_sounds, unpick_sounds, lose_sounds, announcement_sounds, deal_sounds, bad_click_sounds, bet_sounds, outofcash;


// #Server Login
var server_url;
var sid;


// # Rules
var last_winning;


// # Logic

var audio_on, deck, hand, selected, font, font_size, initialzed;

// These variables need to go to the back end
var cash, bet, bet_amount, primary_bet, max_bet, min_bet;
var hand_type;
var show_payout_table;
var uname, sid;
var background_image;
var bottom_btn;
var bottom_bar;
var bet_img;
var bet_base;
var plus;
var minus;
var star_img;
var max_bet_img;
var deal_img;
var lock_img;
var exit_btn;
var payout_table_img;
var payout_back;
var play_img;
var card_back;
var score_back;
var payout_exit;
var card_back_img;
var win_bar;
var buy_btn_img;


var img_dir, img_path, img_mod;



var mode;

var card_suit;


var hand_types;
var hand_values;



