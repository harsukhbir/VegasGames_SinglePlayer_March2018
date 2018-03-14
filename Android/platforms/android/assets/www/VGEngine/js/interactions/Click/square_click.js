/*
function square_click(arg){
    if(mode == 0){
        for(var i = 0; i < screens[0].drawables.length; i++){
            if(screens[0].drawables[i].arg == arg){
                if(screens[0].drawables[i].drawables[0].img == square_imgs[0]){
                    screens[0].drawables[i].drawables[0].img = square_imgs[1];
                    selected_squares.push(arg);
                    return;
                } else if(screens[0].drawables[i].drawables[0].img == square_imgs[1]){
                    screens[0].drawables[i].drawables[0].img = square_imgs[0];
                    var selected_squares1 = [];
                    for(var j = 0; j < selected_squares.length; j++){
                        if(selected_squares[j] != arg){
                            selected_squares1.push(selected_squares[j]);
                        }
                    }
                    selected_squares = selected_squares1;
                    
                    return;
                }
            }
        }
    }
}
*/

function square_click(arg){
    if(mode == 0){
        for(var i = 0; i < screens[0].drawables.length; i++){
            if(screens[0].drawables[i].id == "game_buttons"){
                for(var j = 0; j < screens[0].drawables[i].drawables.length; j++){
                    if(screens[0].drawables[i].drawables[j].arg == arg){
                        // Select
                        if(screens[0].drawables[i].drawables[j].drawables[0].img == square_imgs[0]){
                            if(selected_squares.length < max_selectable){
                                screens[0].drawables[i].drawables[j].drawables[0].img = square_imgs[1];
                                selected_squares.push(arg);
                            }
                            
                            screens[0].selected.txt = selected_squares.length + '/' + max_selectable;
                            if(selected_squares.length == max_selectable){
                                screens[0].prompt_continue.visible = true;
                            }
                            return;
                        // Deselect
                        } else if(screens[0].drawables[i].drawables[j].drawables[0].img == square_imgs[1]){
                            screens[0].drawables[i].drawables[j].drawables[0].img = square_imgs[0];
                            var selected_squares1 = [];
                            for(var j = 0; j < selected_squares.length; j++){
                                if(selected_squares[j] != arg){
                                    selected_squares1.push(selected_squares[j]);
                                }
                            }
                            selected_squares = selected_squares1;
                            screens[0].selected.txt = selected_squares.length + '/' + max_selectable;
                            if(selected_squares.length != max_selectable){
                                screens[0].prompt_continue.visible = false;
                            }
                            return;
                        }
                    }
                }
            }
        }
    }
}