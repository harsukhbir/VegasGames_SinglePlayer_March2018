function reset_game(){
    selected_squares = [];
    chosen_numbers = [];
    var buttons = get_drawable_with_id(screens[0], "game_buttons");
    for(var i = 0; i < buttons.drawables.length; i++){
        buttons.drawables[i].drawables[0].img = square_imgs[0];
    }
}

function clear_chosen_numbers(){
    chosen_numbers = [];
    var buttons = get_drawable_with_id(screens[0], "game_buttons");
    for(var i = 0; i < buttons.drawables.length; i++){
        if(buttons.drawables[i].drawables[0].img == square_imgs[1] ||buttons.drawables[i].drawables[0].img == square_imgs[2]){
            buttons.drawables[i].drawables[0].img = square_imgs[1];
        } else {
            buttons.drawables[i].drawables[0].img = square_imgs[0];
        }
    }
}

function clear_numbers(){
    /*
    chosen_numbers = [];
    var buttons = get_drawable_with_id(screens[0], "game_buttons");
    for(var i = 0; i < buttons.drawables.length; i++){
        buttons.drawables[i].drawables[0].img = square_imgs[0];
    }
    */
}