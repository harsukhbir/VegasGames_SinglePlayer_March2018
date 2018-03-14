function init_select_screen(){
    var background = new_static_img(start_screen_bg,[0,0,1,1],0);
    var select_screen = new_screen(background);
    select_screen.id = "select_screen";
    
    var menu_trans = [0.335, 0.49, 0.33, 0.1];
    var num_bg = new_static_img(num_select_bg, menu_trans.slice(), 1);
    var game_bg = new_static_img(game_select_bg, menu_trans.slice(), 1);
    var bet_bg = new_static_img(bet_select_bg, menu_trans.slice(), 1);
    var fnt = auto_size_text(words[4], menu_trans[2] * 0.2 * canvas.width, canvas.height) + font;
    
    var num_inc_dec = new_increase_decrease(menu_trans.slice(), words[4], fnt, function(arg){
                var new_val = parseInt(arg.txt)+ 1;
                if(new_val < 11){
                    arg.txt = new_val;
                    max_selectable = new_val;
                }
                }, function(arg){
                    var new_val = parseInt(arg.txt)- 1;
                    if(new_val > 0){
                        arg.txt = new_val;
                        max_selectable = new_val;
                    }
                });
    var num_txt = new_text(1, fnt, 1, [menu_trans[0] + menu_trans[2] * 0.65, menu_trans[1] + menu_trans[3] * 0.7, menu_trans[2], menu_trans[3]], 5, "#ffffff");
    get_drawable_with_id(num_inc_dec, "increase").arg = num_txt;
    get_drawable_with_id(num_inc_dec, "decrease").arg = num_txt;
    num_inc_dec = add_drawable(num_inc_dec, num_txt);
    
    
    
    
    menu_trans[1] += menu_trans[3] * 1.1;
    var game_inc_dec = new_increase_decrease(menu_trans.slice(), words[5], fnt, function(arg){
                increase_games();
                arg.txt = selected_games;
                }, function(arg){
                    decrease_games();
                    arg.txt = selected_games;
                });
    var game_txt = new_text(1, fnt, 1, [menu_trans[0] + menu_trans[2] * 0.65, menu_trans[1] + menu_trans[3] * 0.7, menu_trans[2], menu_trans[3]], 5, "#ffffff");
    get_drawable_with_id(game_inc_dec, "increase").arg = game_txt;
    get_drawable_with_id(game_inc_dec, "decrease").arg = game_txt;
    game_inc_dec = add_drawable(game_inc_dec, game_txt);
    
    
    menu_trans[1] += menu_trans[3] * 1.1;
    var bet_inc_dec = new_increase_decrease(menu_trans.slice(), words[6], fnt, function(arg){
                increase_bet();
                arg.txt = current_bet;
                }, function(arg){
                    decrease_bet();
                    arg.txt = selected_games;
                });
    var bet_txt = new_text(1, fnt, 1, [menu_trans[0] + menu_trans[2] * 0.65, menu_trans[1] + menu_trans[3] * 0.7, menu_trans[2], menu_trans[3]], 5, "#ffffff");
    get_drawable_with_id(bet_inc_dec, "increase").arg = bet_txt;
    get_drawable_with_id(bet_inc_dec, "decrease").arg = bet_txt;
    bet_inc_dec = add_drawable(bet_inc_dec, bet_txt);
    
    
    select_screen = add_drawable(select_screen, num_inc_dec);
    select_screen = add_drawable(select_screen, game_inc_dec);
    select_screen = add_drawable(select_screen, bet_inc_dec);
    
    
    var confirm_btn = new_static_img(
        confirm_btn_img,
        [0.415, 0.88, 0.18, 0.09],
        5
    );
    
    confirm_btn = add_drawable(confirm_btn, new_button(6, [0.415, 0.88, 0.18, 0.09], function(){
        change_mode(0);
        selected_squares = [];
    }));
    
    
    select_screen = add_drawable(select_screen, confirm_btn);
    
    select_screen = add_drawable(select_screen, new_static_img(
        keno_balls,[0.17,0.215,0.6,0.56],3
    ));
    
    select_screen = add_drawable(select_screen, new_static_img(
        keno_txt_img,[0.35,0.08,0.3,0.22],4
    ));
    select_screen = add_drawable(select_screen, new_static_img(
        logo,[0.01,0.85,0.19,0.12],4
    ));
    
    select_screen = add_drawable(select_screen, new_static_img(
        keno_dark,[0,0,1,1],1
    ));

    select_screen = add_drawable(select_screen, create_money_display([0.335, 0.35, 0.335, 0.12]));
    
    var lines = new_drawable(0, [0,0,1,1]);
    lines.draw = draw_lines;
    select_screen = add_drawable(select_screen, lines);
    
    
    select_screen = create_keno_buttons(select_screen);
    
    
        
    var exit_button = new_static_img(
        splash_exit_img, [0.01, 0.01, 0.065, 0.11], 5
    );
    exit_button = add_drawable(exit_button, new_button(
        6, [0.01, 0.007, 0.065, aspect_ratio * 0.065], splash_screen_exit
    ));
    
    var payout_btn_transform = [0.925, 0.01, 0.065, 0.11];
    var payout_btn = new_button(2, payout_btn_transform, open_home_payout);
    var payout_btn_img = new_static_img(payout_table_img, payout_btn_transform, 0);
    payout_btn = add_drawable(payout_btn, payout_btn_img);
    select_screen = add_drawable(select_screen, payout_btn);
    
    select_screen = add_drawable(select_screen, exit_button);
    
    select_screen.onOpen = function(){
        current_bet = 1;
        max_selectable = 1;
    };
    select_screen.onExit = function(){
        
    };
    
    
    return select_screen;
}

// Not used + not finished (design change)
function create_dropdown_menu(background, transform, text, values){
    var menu = new_drawable(5, transform);
    
    menu = add_drawable(menu, background);
    
    menu.values = values;
    
    menu.selected = 0;
    
    menu.open = false;
    menu.id = "dd_menu_" + Math.random() * 100;
    menu.type = 'drop_down_menu';
    
    
    menu = add_drawable(menu, new_text(text, 
                    auto_size_text("Number", canvas.width * transform[2] * 0.4, canvas.height, 6) + font, 1, [transform[0] + transform[2] * 0.1,
                        transform[1] + transform[3] * 0.7,
                        transform[2] * 0.4,
                        transform[3]]
                        , 6, '#ffffff'));
   
    var btn = new_button(6, transform, function(){
        var m = this.parent;
        m.open = false;
        m.drop_down.visible = !m.drop_down.visible;
        m.drop_down.interactable = !m.drop_down.interactable;
    });
    btn.parent = menu;
    console.log(menu);
    btn.target = menu.id;
    
    menu = add_drawable(menu, btn);
    
    var menu_fnt = auto_size_text("10", canvas.width * transform[2] * 0.1, canvas.height) + font;
    var disp = new_text(values[0], 
                menu_fnt, 1,
                [transform[0] + transform[2] * 0.78,
                transform[1] + transform[3] * 0.55,
                transform[2],
                transform[3]],
                8, "#000000");
    disp.id = menu.id + "current_display";
    menu = add_drawable(menu, disp);
    menu.current_display = disp;
    menu.update = function(){
        var d = this.current_display;
        d.txt = this.values[this.selected];
    };
    
    var drop_down = new_drawable(7,[transform[0] + transform[2] * 0.78,
                transform[1] + transform[3] * 0.55,
                transform[2],
                transform[3]]);
    drop_down.id = "dropdown";
    drop_down.visible = false;
    drop_down.interactable = false;
    drop_down.onClick = function(){};


    var menu_trans = [transform[0] + transform[2] * 0.6,
                transform[1],
                transform[2] * 0.4,
                transform[3]];

    for(var i = 0; i < values.length; i++){
        var item = new_drawable(9, menu_trans.slice());

        //item = add_drawable(item, new_text(values[i], menu_fnt, 1, [menu_trans[0], menu_trans[1] + menu_trans[3] * 0.7, menu_trans[2], menu_trans[3]], 9, "#000000"));
        item = add_drawable(item, new_text(values[i], menu_fnt, 1, [menu_trans[0], menu_trans[1], menu_trans[2], menu_trans[3]], 9, "#000000"));
        item = add_drawable(item, new_static_img(keno_menu_item, menu_trans.slice()));
        item.type = 'menu_item';
        var menu_btn = new_button(10, menu_trans.slice(), function(){
            console.log("Clicked");
            
            this.target.selected = this.val;
            this.target.update();
            this.target.drop_down.visible = false;
            this.target.drop_down.interactable = false;
            this.target.open = false;
        });
        menu_btn.target = menu;
        menu_btn.val = i;
        
        
        
        item = add_drawable(item, menu_btn);
        
        drop_down = add_drawable(drop_down, item);
        menu_trans[1] += menu_trans[3];
    }
    menu.drop_down = drop_down;
    
    menu = add_drawable(menu, drop_down);
    
    
    return menu;
}