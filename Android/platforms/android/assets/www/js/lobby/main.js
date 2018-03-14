function new_button(text, font, font_color, transform, onClick, background_img){
    var obj = new Object();
    obj.text = text;
    obj.font_color = font_color;
    obj.font = font;
    obj.onClick = onClick;
    obj.background_img = background_img;
    obj.transform = transform;
    return obj;
}

function new_text_field(text, font, font_color, transform, onClick, background_img){
    var obj = new Object();
    obj.text = text;
    obj.font_color = font_color;
    obj.onClick = onClick;
    obj.font = font;
    obj.background_img = background_img;
    obj.transform = transform;
    return obj;
}

// This is essentially the same as the create_buttons function except for html elements
function auto_center(){
    var l = (window.innerWidth - canvas_width) / 2;
    canvas.style.left = (l).toString() + "px";
    var left = canvas_width * 0.335;
    var top = canvas_width * 0.205;
    var width = canvas_width * 0.315;
    var height = canvas_height * 0.07;
    var user_field = login_form[0];
    left += l;
    user_field.style.left = left.toString() + "px";
    user_field.style.top = top.toString() + "px";
    user_field.style.width = width.toString() + "px";
    user_field.style.height = height.toString() + "px";
    
    
    var password_field = login_form[1];
    left = canvas_width * 0.335;
    top = canvas_width * 0.335;
    width = canvas_width * 0.315;
    height = canvas_height * 0.07;
    left += l;
    password_field.style.left = left.toString() + "px";
    password_field.style.top = top.toString() + "px";
    password_field.style.width = width.toString() + "px";
    password_field.style.height = height.toString() + "px";
    
    
    var spacing = canvas_height * 0.07;
    left = canvas_width * 0.36;
    top = canvas_height * 0.19;
    width = canvas_width * 0.27;
    height = canvas_height * 0.07;
    left += l;
    for(var i = 0; i < create_form.length; i++){
        create_form[i].style.left = left.toString() + "px";
        create_form[i].style.top = (top + (height + spacing) * i).toString() + "px";
        create_form[i].style.width = width.toString() + "px";
        create_form[i].style.height = height.toString() + "px";
    }
    
    login_form_dif = login_form[0].style.top;
    login_canvas_shift = -1 * (parseInt(login_form[1].style.top) - parseInt(login_form[0].style.top));
}

function show_create_form(){
    for(var i = 0; i < create_form.length; i++){
        $(create_form[i]).show();
        create_form[i].style.visibility = "visible"
    }
}

function hide_create_form(){
    for(var i = 0; i < create_form.length; i++){
        $(create_form[i]).hide();
    }
}

function show_login_form(){
    for(var i = 0; i < login_form.length; i++){
        $(login_form[i]).show();
        login_form[i].style.visibility = "visible"
    }
}

function hide_login_form(){
    for(var i = 0; i < login_form.length; i++){
        $(login_form[i]).hide();
    }
}

function resize_canvas(){
    canvas_width = window.innerWidth * 0.99;
	canvas_height = canvas_width * 9/16;
    while(canvas_height > window.innerHeight * 0.99 || canvas_width > window.innerWidth * 0.99){
        canvas_width--;
        canvas_height = canvas_width * 9/16;
    }
}


/*
function auto_size_imgs(){
    var size = canvas_width / 1920;
    var does_scale = true;
    if(size < 0.47 && does_scale){
        img_mod = "42/";
        load_images();
        console.log("42%");
    } else if(size < 0.59 && does_scale){
        img_mod = "50/";
        load_images();
        console.log("50%");
    } else if(size < 0.75 && does_scale){
        img_mod = "66/";
        load_images();
        console.log("66%");
    } else{
        img_mod = "";
        load_images();
        console.log("100%");
    }   
}
*/


function new_timer(duration, callback){
    var obj = new Object();
    obj.duration = duration;
    obj.current = duration;
    obj.last = new Date().getTime();
    obj.start = new Date().getTime();
    obj.callback = callback;
    return obj;
}

function timer_update(){
    var now = new Date().getTime();
    for(var i = 0; i < Timers.length; i++){
        if(now - Timers[i].last > 100){
            Timers[i].last = now;
            if(Timers[i].current > 0){
                Timers[i].current--;
                if(Timers[i].current == 0){
                   Timers[i].callback();
                }
            }
        }
    }
}

function init(){
    //alert(window.location.href);
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    login_form = [];
    login_form.push(document.getElementById("login_username"));
    login_form.push(document.getElementById("login_password"));
    hide_login_form();
    create_form = [];
    create_form.push(document.getElementById("create_username"));
    create_form.push(document.getElementById("create_email"));
    create_form.push(document.getElementById("create_password"));
    create_form.push(document.getElementById("create_password_again"));
    create_form.push(document.getElementById("create_fullname"));
    hide_create_form();
    mode = 2;

    resize_canvas();
    auto_center();
    switch_language(language_selected,0);
    create_buttons();
    language_dropdown = false;
    sound_dropdown = false;
    dd_scroll = 0;
    sound_volume = 100;
    sound_enabled = false;
    load_storage();
    if(!lobby_initialized)
        begin();
    init_tapjoy();
}

function begin(){
    //user_stats = [];
    //FB.init();
    Timers = [];

    min_guest_time =  0;
    switch_language(language_selected, 0);
    guest_time_min = 1000*60*60*24;

    canvas.addEventListener('click', click_handler, false);
    /*
    canvas.addEventListener('click', function(event){
    click_handler(event);
    }, false);
    */
    canvas.addEventListener('mousedown', mouse_down_handler, false);
    canvas.addEventListener('mouseup', mouse_up_handler, false);
    canvas.addEventListener('mousemove', mouse_handler, false);
    
    document.addEventListener('touchstart', touchStart, false);
    document.addEventListener('touchmove', touchMove, false);
       
    
    //window.addEventListener("keyup", key_handler, false);
    //window.addEventListener("keydown", key_down_handler, false);
    document.addEventListener("mousewheel", mousewheelhandler, false);
    //music_init();
    
    if(window.location.pathname.indexOf("back_to_lobby") != -1){
        var url = window.location.search;
        var re = new RegExp("uname=(.*)&sid", "g");
        var nam = re.exec(url)[1].toLowerCase();
        if(nam == "guest" && !isFacebook){
            login_guest();
        } else if(isFacebook){
            //login_with_facebook();
        }
    }
    //setInterval(draw, 1);
    
    lobby_initialized = true;
}

function touchStart(e){
    swipe_begin(e.changedTouches[0].pageX - canvas.offsetLeft, e.changedTouches[0].pageY - canvas.offsetTop);
}

function touchMove(e){
    swipe_follow = true;
    swipe_update(e.changedTouches[0].pageX - canvas.offsetLeft, e.changedTouches[0].pageY - canvas.offsetTop);
}

function resize_buttons(){
    var t_font = auto_size_text("Hello World", canvas_width * 0.4 * 0.315,canvas_height) + font;
    login_buttons[2].font = auto_size_text(forgot_login_str, canvas_width * 0.19, canvas_height) + font;
    login_fields[0].font = t_font;
    login_fields[1].font = t_font;
    t_font = auto_size_text("Done", canvas_width * 0.6 * 0.11,canvas_height) + "px Comic Sans MS";
    account_create_buttons[0].font = t_font;
    account_create_buttons[1].font = t_font;
    t_font = auto_size_text(words[3], canvas_width * 0.15, canvas_width * 0.05) + font;
    init_buttons[3].font = t_font;
    create_settings_buttons();
}

function create_buttons(){
    
    login_buttons = [];
    init_buttons = [];
    account_create_buttons = [];
    lobby_buttons = [];
    lobby_fields = [];
    create_fields = [];

    
    // Creating Buttons and Fields for Login Page
    var transform = [0.522, 0.873, 0.13, 0.074];
    login_buttons.push(new_button("", 0 + font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], login_btn_click, login_btn));
    transform[0] = 0.335;
    login_buttons.push(new_button("", 0 + font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], vg_login_back, create_cancel));
    

    // Forgot PWord
    login_buttons.push(new_button("", auto_size_text("", canvas_width * 0.19, canvas_height) + font, "#ffffff", [0.41, 0.705, 0.19, 0.1], forgot_account, null_img));
    transform[0] = 0.335;
    transform[1] = 0.37;
    transform[2] = 0.315;
    transform[3] = 0.07;
    var t_font = auto_size_text("Hello World", canvas_width*0.4*transform[2],canvas_height) + font;
    if(!lobby_initialized){
        login_fields = [];
        //login_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1], transform[2], transform[3]], username_field_edit, text_field_back));
        login_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1], transform[2], transform[3]], username_field_edit, null_img));

        transform[1] = 0.6;
        //login_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1], transform[2], transform[3]], password_field_edit, text_field_back));
        login_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1], transform[2], transform[3]], password_field_edit, null_img));
    }
    
    transform[0] = 0.72;
    transform[1] = 0.37;
    transform[2] = 0.1;
    transform[3] = 0.07;
    t_font = auto_size_text("Next", canvas_width * 0.09, canvas_height) + font;
    login_next = new_button("Next", t_font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]],  new function(){document.activeElement = login_form[0]}, null_img);
    transform[0] += transform[2];
    login_prev = new_button("Prev", t_font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], new function(){document.activeElement = login_form[1]}, null_img);
    
    
    
    
    // Creating Buttons and Fields for Account Creation Page
    transform[0] = 0.522;
    transform[1] = 0.873;
    transform[2] = 0.11;
    transform[3] = 0.074;
    t_font = auto_size_text("Done", canvas_width*0.6*transform[2],canvas_height) + "px Comic Sans MS";
    account_create_buttons.push(new_button("", t_font, "#ff91d2", [transform[0], transform[1], transform[2], transform[3]], create_done_btn, create_done));
    //account_create_buttons.push(new_button("Done", t_font, "#ff91d2", [transform[0], transform[1], transform[2], transform[3]], create_done_btn, demo_btn));
    transform[0] = 0.37;
    account_create_buttons.push(new_button("", t_font, "#ff91d2", [transform[0], transform[1], transform[2], transform[3]], cancel_account_create, create_cancel));
    //account_create_buttons.push(new_button("Back", t_font, "#ff91d2", [transform[0], transform[1], transform[2], transform[3]], cancel_account_create, demo_btn));
    
    var spacing = 0.07;
    transform[0] = 0.36;
    transform[1] = 0.19;
    transform[2] = 0.27;
    transform[3] = 0.07;
    /*
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1], transform[2], transform[3]], create_username_edit, text_field_back));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing), transform[2], transform[3]], create_email_edit, text_field_back));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing)*2, transform[2], transform[3]], create_password_edit, text_field_back));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing)*3, transform[2], transform[3]], create_password_conf_edit, text_field_back));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing)*4, transform[2], transform[3]], create_fullname_edit, text_field_back));
    */
    
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1], transform[2], transform[3]], create_username_edit, null_img));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing), transform[2], transform[3]], create_email_edit, null_img));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing)*2, transform[2], transform[3]], create_password_edit, null_img));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing)*3, transform[2], transform[3]], create_password_conf_edit, null_img));
    create_fields.push(new_text_field("", t_font, "rgba(1,0,0,1)", [transform[0], transform[1]+(transform[3]+spacing)*4, transform[2], transform[3]], create_fullname_edit, null_img));
    
    // Creating Buttons and Fields* for Lobby Page
    game_buttons = [];
    game_transform = [0.01,
            0.265,
            0.2,
            0.2 * aspect_ratio * (525/600)];

    lobby_buttons.push(new_button("video poker", 0+font, "#ffffff", [button_spacing[0], game_transform[1], game_transform[2], game_transform[3]], video_poker_click, video_poker_img));
    game_buttons.push(new_button("video poker", 0+font, "#ffffff", [button_spacing[0], game_transform[1], game_transform[2], game_transform[3]], video_poker_click, video_poker_img));
    
    //game_transform[0] = 0.245;
    lobby_buttons.push(new_button("jacks or better", 0+font, "#ffffff", [button_spacing[1], game_transform[1], game_transform[2], game_transform[3]], jacks_or_better_click, jacks_or_better_img));
    game_buttons.push(new_button("jacks or better", 0+font, "#ffffff", [button_spacing[1], game_transform[1], game_transform[2], game_transform[3]], jacks_or_better_click, jacks_or_better_img));
    
    //game_transform[0] = 0.49;
    lobby_buttons.push(new_button("jokers wild", 0+font, "#ffffff", [button_spacing[2], game_transform[1], game_transform[2], game_transform[3]], jokers_wild_click, jokers_wild_img));
    game_buttons.push(new_button("jokers wild", 0+font, "#ffffff", [button_spacing[2], game_transform[1], game_transform[2], game_transform[3]], jokers_wild_click, jokers_wild_img));
    
    //game_transform[0] = 0.735;
    lobby_buttons.push(new_button("bingo", 0+font, "#ffffff", [button_spacing[3], game_transform[1], game_transform[2], game_transform[3]], bingo_click, bingo_img));
    game_buttons.push(new_button("bingo", 0+font, "#ffffff", [button_spacing[3], game_transform[1], game_transform[2], game_transform[3]], bingo_click, bingo_img));


    
    //game_transform[0] += game_transform[2];
    game_buttons.push(new_button("keno", 0+font, "#ffffff", [button_spacing[4], game_transform[1], game_transform[2], game_transform[3]], keno_click, keno_img));
    
    //game_transform[0] += game_transform[2];
    game_buttons.push(new_button("Money Wheel", 0+font, "#ffffff", [button_spacing[5], game_transform[1], game_transform[2], game_transform[3]], moneywheel_click, moneywheel_lobby_img));
    
    game_buttons.push(new_button("Roulette", 0+font, "#ffffff", [button_spacing[6], game_transform[1], game_transform[2], game_transform[3]], roulette_click, roulette_lobby_img));
    
    
   
    
    
    transform[0] = 0.67;
    transform[1] = 0.84;
    transform[2] = 0.115;
    transform[3] = 0.11;
    lobby_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], facebook_invite, facebook_invite_img));


     // impg free chip
    transform[0] = 0.840;
    transform[1] = 0.80;     // less bottom to top move
    transform[2] = 0.100;    // if less number less width 
    transform[3] = 0.17;     // if incress height incress
    lobby_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], impgFreeChip, impgFreeChip_img));

   


    // transform[0] = 0.823;
    // transform[1] = 0.84;
    // transform[2] = 0.115;
    // transform[3] = 0.11;
    lobby_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], more_games, more_games_img));

     // end impg free chip


    transform[0] = 0.905;
    transform[1] = 0.03;
    transform[2] = 0.05;
    transform[3] = 0.08;
    lobby_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], open_settings, user_setting_img));
    
    

    // Creating Initial Login Buttons
    transform[0] = 0.265;
    transform[1] = 0.38;
    transform[2] = 0.125;
    transform[3] = 0.23;
    init_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], fb_login, fb_login_btn));
    transform[0] = 0.401;
    transform[1] = 0.38;
    transform[2] = 0.198;
    transform[3] = 0.23;
    init_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], vg_login, vg_login_btn));
    transform[0] = 0.61;
    transform[1] = 0.32;
    transform[2] = 0.18;
    transform[3] = 0.29;
    init_buttons.push(new_button("", 0+font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], guest_login, guest_login_btn));
    transform[0] = 0.5;
    transform[1] = 0.86;
    transform[2] = 0.45;
    transform[3] = 0.05;    
    t_font = auto_size_text(words[3], canvas_width*transform[2], canvas_width*transform[3] / 3) + font;
    //transform[0] -= context.measureText(words[4] + "  " + words[3]).width / 5 / canvas_width;
    transform[0] -= transform[2] / 2;
    init_buttons.push(new_button(words[4] + "  " + words[3], t_font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], create_new_account, null_img));
    
    // Creating User Account Page Buttons
    create_settings_buttons();
    
}

function create_settings_buttons(){
    var transform = [0.025, 0.89, 0.065, 0.05];
    settings_buttons = [];
    user_buttons = [];
    
    var t_font = auto_size_text(words[7],canvas_width * 0.09, canvas_height) + font;

    user_buttons.push(new_button(words[7], t_font, "#fcd538", [transform[0], transform[1], transform[2], transform[3]], user_back, user_back_img));


    transform[0] = 0.18;
    transform[1] = 0.66;
    transform[2] = 0.12;
    transform[3] = 0.065;
    user_buttons.push(new_button(words[9], t_font, "#fcd538", [transform[0], transform[1], transform[2], transform[3]], user_settings, null_img));

    t_font = auto_size_text("achievements", canvas_width * 0.15, canvas_height) + font;
    transform[0] = 0.69;
    transform[1] = 0.85;
    transform[2] = 0.098;
    transform[3] = 0.13;
    user_buttons.push(new_button("achievements", t_font, "#fcd538", [transform[0], transform[1], transform[2], transform[3]], user_view_achievements, user_achievement_img));

    transform[0] = 0.77;
    transform[1] = 0.63;
    transform[2] = 0.11;
    transform[3] = 0.20;
    user_buttons.push(new_button(words[14] + "\nFacebook", t_font, "#fcd538", [transform[0], transform[1], transform[2], transform[3]], facebook_share, fb_login_btn));
    transform[0] = 0.81;
    transform[1] = 0.3;
    transform[2] = 0.168;
    transform[3] = 0.29;
    if(language_selected == 0)
        user_buttons.push(new_button("get some\nMore Cash", t_font, "#fcd538", [transform[0], transform[1], transform[2], transform[3]], open_store, user_more_cash_img));
    else
        user_buttons.push(new_button(words[13], t_font, "#fcd538", [transform[0], transform[1], transform[2], transform[3]], open_store, user_more_cash_img));
    
    
    // Settings Buttons
    t_font = auto_size_text("Language", canvas_width * 0.1, canvas_height) + font;
    transform[0] = 0.376;
    transform[1] = 0.48;
    transform[2] = 0.22;
    transform[3] = 0.08;
    settings_buttons.push(new_button("Language", t_font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], open_language_select, dropdown));
    transform[1] = 0.66;
    settings_buttons.push(new_button("Sound", t_font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], open_sound_select, dropdown));
    transform[1] = 0.775;
    settings_buttons.push(new_button("Log Out", t_font, "#ffffff", [transform[0], transform[1], transform[2], transform[3]], logout, logout_back));
}

/*
// CONSOLE HACK!
var console = {};
console.log = function(arg){
    alert(JSON.stringify(arg));};

*/


