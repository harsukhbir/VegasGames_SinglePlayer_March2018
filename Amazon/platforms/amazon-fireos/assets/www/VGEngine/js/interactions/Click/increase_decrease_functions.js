function increase_bet(){
    if(current_bet < max_bet){
        current_bet++;
        update_bet_display();
    }
}

function decrease_bet(){
    if(current_bet > min_bet){
        current_bet--;
        update_bet_display();
    }
}


function update_bet_display(){
    for(var i = 0; i < screens[mode].drawables.length; i++){
        if(screens[mode].drawables[i].id == "bet_display"){
            screens[mode].drawables[i].txt = current_bet;
        }
    }
}


function increase_games(){
    if(selected_games < max_games){
        selected_games++;
        update_games_display();
    }
}

function decrease_games(){
    if(selected_games > min_games){
        selected_games--;
        update_games_display();
    }
}

function update_games_display(){
    for(var i = 0; i < screens[mode].drawables.length; i++){
        if(screens[mode].drawables[i].id == "games_display"){
            screens[mode].drawables[i].txt = selected_games;
        }
    }
}
