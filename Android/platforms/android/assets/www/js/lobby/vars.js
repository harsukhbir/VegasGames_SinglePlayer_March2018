/*
    This is obviously an obnoxious design from a development standpoint, however I have changed the format of the code to fit this way to allow a more seemless 
    implementation of other languages. Furthermore made it a lot easier to find conflicting vars when I merged these games into a single page
    
*/

function define_lobby_globals(){

    /*
        # graphics
    */
    flash_text = "";
    flash_timer = 0;
    frame_rate = 60 / 1000;
    last_draw = 0;


    /*
        # main
    */
    lobby_initialized = false;
    font = 'px POETSENONE-REGULAR';

    aspect_ratio = 16/9;
    login_buttons = [];
    login_fields = [];

    init_buttons = [];
    account_create_buttons = [];
    user_button_move = false;

    lobby_buttons = [];
    lobby_fields = [];
    create_fields = [];
    game_buttons = [];


    img_dir = "img/";
    img_path = "lobby/";
    img_mod = "";

    active_timer = 0;




    create_selected = -1;

    password_edit = false;
    username_edit = false;


    /*
        # lobby_swipe
    */
    button_spacing = [0, 0.25, 0.50, 0.75, 1, 1.25, 1.5];
    button_spacing_relative = [0.01, 0.235, 0.245, 0.245, 0.24, 0.24];
    swipe_dist = 0;
    swipe_last = [0,0];
    scroll_follow = false;


    /*
        # lobby_click
    */
    // #NOTE This should be stored and loaded
    prompt_right = true;
    show_settings = false;
    prompt_state = 0;
    lobby_prompt = true;



    /*
        # Keylistener
    */
    shift_down = false;
    caps = false;

    lowercase_letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x','y','z'];
    uppercase_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X','Y','Z'];
    digits = ['1','2','3','4','5','6','7','8','9','0'];
    symbols = ['!','@','#','$','%','^','&','*','(',')','{','}','-','_','|','\"',',','.'];



    /*
        # Backend

    */
    fb_callback = false;
    server_url = server_address + "singleplayer_lobby/";

    
    store_open = false;
    money_popup = false;
    
    sparkle_vid = document.getElementById("sparkle_vid");
    loading_images = false;
    lobby_can_draw = false;
    
}


var lobby_image_count, lobby_images_loaded;
var loading_images, lobby_can_draw;
var lobby_initial_scroll = false;

var aspect_ratio = 16 / 9;
var img_dir = "img/"
var isBigSpin = false;

var sparkle_vid;

/*
    # graphics
*/
var flash_text, flash_timer, frame_rate, last_draw;
var login_shift_enabled = false;

/*
    # main
*/
var Timers;
var login_next, login_prev, login_field_last;
var last_guest, guest_time_min;
var login_form, create_form;
var initialized, lobby_initialized;
var sound_volume, sound_enabled;
var font, font_size, mode;

var experience = 0;

var aspect_ratio;
var login_buttons;
var login_fields;

var lobby_prompt;

var init_buttons;
var account_create_buttons;
var user_button_move;

var lobby_buttons;
var lobby_fields;
var create_fields;
var game_buttons;
var settings_buttons;
var user_buttons, user_stats;
var language_dropdown, sound_dropdown, dd_scroll;

var img_dir, img_path, img_mod;

var active_timer, login_form_dif, login_canvas_shift;



var create_selected;

var password_edit, username_edit;


/*
    # lobby_swipe
*/
var button_spacing, button_spacing_relative, swipe_dist, swipe_last, scroll_follow;


/*
    # lobby_click
*/
// #NOTE This should be stored and loaded
var prompt_right, show_settings, prompt_state;



/*
    # Keylistener
*/
var shift_down, caps;

var lowercase_letters, uppercase_letters, digits, symbols;



/*
    # Backend

*/
var response;
var fb_callback;

var total_winnings, biggest_win, games_played;
var money, user_id;
var server_url;

/*
    # load_imgs

*/
var login_btn, text_field_back, create_new_btn, create_cancel, create_done, null_img;
var video_poker_img, jacks_or_better_img, jokers_wild_img, bingo_img, more_games_img;
var lobby_background, lobby_cash, money_background, user_background, facebook_share_img, facebook_invite_img, impgFreeChip_img;
var vg_login_btn, fb_login_btn, guest_login_btn, logo, logout_back, exit_btn;
var user_back_img, user_setting_img, user_achievement_img, user_more_cash_img, user_pic_bg, settings_background, settings_outline,dropdown;
var demo_btn;
var prompt_left, prompt_right, keno_img, logo_tilt;
