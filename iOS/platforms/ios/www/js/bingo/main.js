function bingo_new_card(numbers){
    var obj = new Object();
    obj.numbers = numbers;
    var clicked = [];
    for(var i = 0; i < numbers.length; i++){
        clicked.push(false);
    }
    obj.clicked = clicked;
    return obj;
}

/*
function auto_size_text(text, width, height){
	font_size = 1;
	context.font = font_size + font;
	while(context.measureText("W").width <= height && context.measureText(text).width < width){
		font_size++;
		context.font = font_size + font;
	}
    return font_size;
}
*/

function resize_other(){
 
}

function bingo_tick(){
    if(mode >= 100){
        var d = new Date();
        if(d.getTime() - last_tick < tick_speed * 1000){
            return;
        }
        last_tick = d.getTime();
        if(display_index < chosen_numbers.length - 1){
            //console.log("Playng!");
            display_index++;
            bingo_play_number_sound(chosen_numbers[display_index]);
        } else{
            if(restart_delay > 0){
                restart_delay--;
            } else if(restart_time > 0){
                restart_time--;
            } else{
                init_bingo();
            }
        }
    }
}


function resize(){
    resize_game_canvas();
    resize_other();
    auto_size_imgs();
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

function init_bingo(){
    if(timer_loop != null){
        clearInterval(timer_loop);
        timer_loop = null;
    }
    tick_speed = 2.5;
    store_open = false;
    money_popup = false;
    chosen_numbers = [];
    scroll_follow = false;
    swipe_start = [0,0];
    resize();
    mode = 0;
    restart_delay = 5;
    restart_time = 60;
    cards = [];
    card_selected = 0;
    display_index = 0;
    scroll_transform = [0.12, 0.19, 0.005, 0.75];
    scroll_bar_transform = [0.111, scroll_transform[1], 0.025, 0.135];
    scroll_index = 0;
    if(!bingo_initialized){
        begin_bingo();
    }
    bingo_create_buttons();
}

function begin_bingo(){
    timer_loop = null;
    font_size = 19;
    font = 'px POETSENONE-REGULAR';
    switch_language(language_selected, 3);
    //money = 0;
    bingo_server_stuff_init();
    var d = new Date();
    last_tick = d.getTime();
    tick_speed = 2.5;
    bingo_create_buttons();
    //bingo_music_init();
    initialized = true;
    bingo_load_number_sounds();
    canvas.addEventListener('click', bingo_click_handler, false);
    canvas.addEventListener('mousedown', bingo_mouse_down_handler, false);
    canvas.addEventListener('mouseup', bingo_mouse_up_handler, false);
    canvas.addEventListener('mousemove', bingo_mouse_handler, false);
    //draw_loop = setInterval(bing_draw, 1);
    if(isFacebook){
        load_fb();
    }
}

/*
function stop(){
    clearInterval(draw_loop);
    clearInterval(timer_loop);
}
(*/
