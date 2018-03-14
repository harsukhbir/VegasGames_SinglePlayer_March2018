function keno_begin(){
    //canvas = document.getElementById("game");
    //context = canvas.getContext("2d");
    
    font = 'px POETSENONE-REGULAR';
    font_size = 12;
    
    frame_rate = 60;
    screens = [];
    routines = [];
    resize_screen();
    
    
    log_level = 10;
    current_bet = 0;
    selected_games = 1;
    mode = 1;
    set_game_variables();
    load_start_screen_imgs();
    load_splash_screen_imgs();
    load_end_image();
    load_payout_images();
    load_store_imgs();
    //music_init();
    
    load_keno_sounds();
    

    interaction_init();
    network_init();
    create_timers();
    timers_init();
    
    //canvas.addEventListener('click', keno_big_spin_listener, false);
    create_game_screens();

    Engine = new Object();
    Engine.running = true;
    
    game_loop = setInterval(Loop, 1);
    Engine.initialized = true;

}

function session_load(){
    update_money_display();
}

function create_game_screens(){
    screens.push(init_home_screen());
    screens.push(init_splash_screen());
    screens.push(init_game_screen());
    screens.push(init_end_screen());
    screens.push(init_select_screen());
    

}

function create_timers(){
    var display_timer = new_timer(200, true);
    display_timer.result = increase_display_index;
    Timers.push(display_timer);
    
    /*
    var music_timer = new_timer(10, true);
    music_timer.result = music_update;
    Timers.push(music_timer);
    */
    
    var fb_login = new_timer(100, false);
    fb_login.result = load_fb;
    Timers.push(fb_login);
}

function set_game_variables(){
    max_games = 10;
    min_games = 1;
    
    max_bet = 5;
    min_bet = 1;
    
    show_payout = false;
}

var Engine, canvas, context;
var game_loop, frame_rate;
var font, font_size;
var routines;

//keno_begin();