function bingo_new_button(transform, img, onclick, text_object){
    var obj = new Object();
    obj.transform = transform;
    obj.text = text_object;
    obj.onClick = onclick;
    obj.image = img;
    return obj;
}

/*
function create_money_popup(){
    var transform = [0.15, 0.2, 0.7, 0.6];
    money_popup = new Object();
    money_popup.buttons = [];
    money_popup.background = new Image();
    money_popup.background.src = "img/store/store_background.png";
    money_popup.transform = transform;
    
    //money_popup.buttons.push(new_button(transform, null, null, ""));
    
}
*/


function bingo_create_buttons(){
    bingo_create_choose_screen_buttons();
    bingo_create_game_buttons();

    //create_money_popup();
}

function bingo_create_board_buttons(){
    bingo_btns = [];
    var transform = [0,0,0.08, aspect_ratio * 0.08];
    var spacing = 0.003;
    var top = 0.205;
    var left = 0.1485;
    for(var i = 0; i < 25; i++){
        var current_img = null;
        transform[0] = left + (transform[2] + spacing) * Math.floor(i / 5);
        transform[1] = top + (transform[3] + spacing) * (i % 5);
        bingo_btns.push(bingo_new_button([transform[0], transform[1], transform[2], transform[3]], board_imgs[Math.floor(i/5)], click_board, null));
    }
}

function bingo_create_choose_screen_buttons(){
    choose_screen_btns = [];
    var transform = [0.08, 0.33, 0.12, 0.36];
    var spacing = 0.015;
    //var f = auto_size_text("6", canvas_width , canvas_height) + font;
    auto_size_text("6", transform[2] *0.4 , canvas_height);
    for(var i = 0; i < 6; i++){
        var value = (i+1).toString();
        var left = transform[0] + (transform[2] + spacing) * i;
        var text = bingo_new_text(value, [left + transform[2]/2, transform[1] + transform[3]*0.45], "#ffffff", "40" + font);
        choose_screen_btns.push(bingo_new_button([left, transform[1], transform[2], transform[3]], card_select_img, bingo_start_game, text));
    }
}

function bingo_create_game_buttons(){
    var transform = [
        0.025,
        0.04,
        0.075,
        aspect_ratio * 0.075
    ];
    exit_btn = bingo_new_button([transform[0], transform[1], transform[2], transform[3]], exit_btn_img, bingo_exit_game, null);
    transform[0] = 0.61;
    transform[1] = 0.84;
    transform[2] = 0.38;
    transform[3] = 0.16;
    bingo_btn = bingo_new_button([transform[0], transform[1], transform[2], transform[3]], bingo_btn_img, bingo, null);
    
    bingo_create_board_buttons();
}
