function init_game_screen(){
    
    var background = new_static_img(start_screen_bg,[0,0,1,1],0);
    var game_screen = new_screen(background);
    
    var payout_btn_transform = [0.925, 0.01, 0.065, 0.11];
    var payout_btn = new_button(2, payout_btn_transform, open_home_payout);
    var payout_btn_img = new_static_img(payout_table_img, payout_btn_transform, 0);
    payout_btn = add_drawable(payout_btn, payout_btn_img);
    game_screen = add_drawable(game_screen, payout_btn);
    
    var exit_btn_transform = [0.01, 0.007, 0.065, aspect_ratio * 0.065];
    //exit_btn_transform[1] = 0.125;
    var exit_btn = new_button(2, exit_btn_transform, function(){change_mode(4);});
    var exit_btn_img = new_static_img(payout_exit_img, exit_btn_transform, 0);
    exit_btn = add_drawable(exit_btn, exit_btn_img);
    game_screen = add_drawable(game_screen, exit_btn);
    //console.log(payout_btn, exit_btn);
    
    //splash_exit_img
    

    
    //game_screen = create_keno_buttons(game_screen);
    /*
    var game_buttons = new_drawable(0, [0,0,1,1]);
    game_buttons = create_keno_buttons(game_buttons);
    game_buttons.id = "game_buttons";
    */
    
    var keno_txt_transform = [
        0.74,
        0.76,
        0.25,
        0.22
    ];

    //game_screen = add_drawable(game_screen, new_static_img(keno_txt_img, keno_txt_transform, 1));
        
    var lines = new_drawable(0, [0,0,1,1]);
    lines.draw = draw_lines;
    game_screen = add_drawable(game_screen, lines);
    
    
    routines.push(display_results);
    
    game_screen.onOpen = game_screen_open;
    game_screen.onExit = function(){
        
    }
    
    add_drawable(game_screen, screens[0].selected);
    add_drawable(game_screen, screens[0].games);
    add_drawable(game_screen, screens[0].bet);
    
    return game_screen;
}

function game_screen_open(){
    //console.log("Open");
    display_index = 0;
    screens[2] = init_game_screen();
    //console.log(screens[2]);
    var buttons = get_drawable_with_id(screens[0], "game_buttons");
    screens[2] = add_drawable(screens[2], buttons);
    screens[2].attributes = [];
    screens[2].attributes.push(new Date().getTime() + 2000);
    //console.log(screens[2]);
    // 
}

function increase_display_index(){
    if(display_index < chosen_numbers.length && mode == 2){
        
        // Go through all buttons on the screen
        var buttons = get_drawable_with_id(screens[2], "game_buttons");
        //console.log(buttons);
        for(var i = 0; i < buttons.drawables.length; i++){
            
            //console.log(buttons.drawables[i].arg);
            // If the button corresponds to the latest chosen number
            if(buttons.drawables[i].arg == chosen_numbers[display_index]){
                //console.log("Updating Image");
                // AND the button WAS NOT selected
                if(buttons.drawables[i].drawables[0].img == square_imgs[0]){
                    buttons.drawables[i].drawables[0].img = square_imgs[3];
                    // OR the button WAS selected
                } else if(buttons.drawables[i].drawables[0].img == square_imgs[1]){
                    buttons.drawables[i].drawables[0].img = square_imgs[2];
                }
                break;
            }
        }
        
        KenoAudioManager.play_number(chosen_numbers[display_index]);
        
        //console.log("Updating Buttons");
        display_index++;
        screens[2] = init_game_screen();
        screens[2] = add_drawable(screens[2], buttons);
    } else if(display_index == chosen_numbers.length && mode == 2){
        selected_games--;
        update_games_display();
        screens[0].games.txt = 'Games: ' + selected_games;
        console.log(selected_games);
        if(selected_games <= 0){
            change_mode(3);
        } else {
            clear_chosen_numbers();
            start_game();
        }
    }
}