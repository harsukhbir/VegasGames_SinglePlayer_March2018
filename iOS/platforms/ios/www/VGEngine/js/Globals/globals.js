// Engine Vars
//var server_address = "127.0.0.1";
var img_dir = "img/keno/img/";
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