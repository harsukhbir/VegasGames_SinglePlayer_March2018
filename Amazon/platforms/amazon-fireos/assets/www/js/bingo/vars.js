function init_bingo_vars(){
    img_dir = "img/";
    img_path = "bingo/";
    img_mod = "";
    bingo_initialized = false;
    server_url = server_address + "bingo/";
    last_win = 0;
    timer_loop = null;
    win_screen_init = false;
}

var bingo_img_load_complete = false;
var bingo_img_count, bingo_img_load_count;


// Needs to be moved to vars.js
var bingo_win_balls;
var win_screen_init = false;
var bingo_win_state;

var store_open;
var desired_cards, desired_cards_last;
var scroll_transform, scroll_bar_transform, scroll_index, scroll_follow;
var canvas, context, draw_loop, timer_loop;
var font, font_size;
var last_tick, tick_speed, restart_time;
var uid, sid, mode, cards, card_selected, display_index;
var chosen_numbers;
var swipe_start;
var bingo_initialized;

var money_popup;

var exit_btn, bingo_btns, bingo_btn, choose_screen_btns;

var b_sounds, i_sounds, n_sounds, g_sounds, o_sounds;

var store_background, store_imgs, logo;
var exit_btn_img, board_imgs, board_back, chosen_board_img, bingo_btn_img, ball_count_back;
var background, ball_queue_img, card_back_small, scroll_bar_back, scroll_bar, bingo_balls;
var card_select_img, back_img, money_background, card_select_outline, select_background;
var win_button_back, win_background, facebook_invite, user_background, more_games, logo_bingo, win_money_background, white_logo;

