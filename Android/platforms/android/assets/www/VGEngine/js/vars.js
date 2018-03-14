var mode_prev = 0;
var graphics_queue = [];

// Engine Vars
//var server_address = "127.0.0.1";
var img_dir = "../img/keno/img/";
var screens, mode;
var aspect_ratio = 16 / 9;
var log_level;

// Game Vars
var max_bet, min_bet;
var max_games, min_games;
var selected_squares = [];
var chosen_numbers = [];
var display_index = 0;
var square_spacing = 0.001;
var square_dimens = [0.09, 1/8 - square_spacing];
var current_bet, selected_games;
var money = 999999;
var max_selectable = 10;

var end_balls, end_exit, facebook_share_img, end_money_bg, more_games_img, new_game_img, replay_img, user_background, win_back, null_img;
var payout_top, payout_left, payout_row, payout_text, payout_exit_img, payout_table_img;
var splash_bg,start_game_splash_image, splash_exit_img, keno_txt_img, money_display_bg, logo, white_logo;
var start_btn_image, start_screen_bg, square_imgs, inc_dec_field;