// This is an abstract intended to be exteded
function new_routine(){
    var obj = new_GameObject();
    obj.run = null;
    return obj;
}

// Child Objects
function update_keno_home_fields(){
    var obj = new_routine();
    obj.run = new function(){
        for(var i = 0; i < screens[0].drawables.length; i++){
            if(screens[0].drawables[i].id == "bet_display"){
                screens[0].drawables[i].txt = current_bet;
            } else if(screens[0].drawables[i].id == "games_display"){
                screens[0].drawables[i].txt = current_bet;
            }
        }
    }
}


function display_results(){
    var obj = new_routine();
    obj.run = new function(){
        if(mode != 2)
            return;

        /*
        for(var i = 0; i < screens[mode].drawables.length; i++){
            
        }
        */
    }
}