function mouse_down_handler(event){
    var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
    swipe_begin(x,y);
}

function swipe_begin(x,y){
    swipe_last = [x,y];
    if(!isBigSpin)
        scroll_follow = true;
    swipe_dist = 0;    
    mouse_move_dist = 0;
}

function mouse_up_handler(event){
    scroll_follow = false;
}
function mouse_handler(event){
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    swipe_update(x,y);

}

function simulate_swipe(x){
    var dist = x;
    if(game_buttons[0].transform[0] - dist < -1 * (button_spacing[button_spacing.length - 1] + game_buttons[game_buttons.length - 1].transform[2] - 1) || 
            (game_buttons[0].transform[0] - dist > button_spacing[0])){
                return false;
            }
    for(var i = 0; i < game_buttons.length; i++){
            game_buttons[i].transform[0] -= dist;
    }
    return true;
}

function swipe_update(x,y){
    
    if(x < 0 || x > canvas_width || y < 0 || y > canvas_height || store_open){
        //console.log("Off Screen");
        scroll_follow = false;
    }
    
    if(scroll_follow){

        var dist = (swipe_last[0] - x) / canvas_width;
        if(dist > 0.03){
            lobby_prompt = false;
        }
        
        if(game_buttons[0].transform[0] - dist < -1 * (button_spacing[button_spacing.length - 1] + game_buttons[game_buttons.length - 1].transform[2] - 1) || 
            (game_buttons[0].transform[0] - dist > button_spacing[0])){
                return;
            }
        for(var i = 0; i < game_buttons.length; i++){
            game_buttons[i].transform[0] -= dist;
            /*
            // Handling Left Rollover
            if(canvas_width * (game_buttons[i].transform[0] + game_buttons[i].transform[2]) < canvas.offsetLeft){
                var prev = i - 1;
                var spacing = 0;
                if(i == 0){
                    prev = game_buttons.length - 1;
                    spacing = button_spacing_relative[0] + game_buttons[prev].transform[2];
                } else {
                    spacing = button_spacing_relative[i];
                }
                game_buttons[i].transform[0] = game_buttons[prev].transform[0] + spacing;
            }
            // Handling Right Rollover
            else if(canvas_width * game_buttons[i].transform[0] > canvas.offsetLeft + canvas_width){
                var nxt = i + 1;
                if(i == game_buttons.length - 1){
                    nxt = 0;
                    spacing = button_spacing[nxt] + game_buttons[nxt].transform[0];
                } else {
                    spacing = button_spacing[nxt];
                }
                game_buttons[i].transform[0] = game_buttons[nxt].transform[0] - spacing;
            }
            */
        }
        //check_button_spacing();
        
    } else {
        swipe_dist = 0;
        mouse_move_dist = 0;
    }
    swipe_dist = Math.sqrt((swipe_last[0] - x) * (swipe_last[0] - x) + (swipe_last[1] - y) * (swipe_last[1] - y));
    swipe_last = [x,y];
    mouse_move_dist += swipe_dist;
    

}
var mouse_move_dist = 0;
/*
function check_button_spacing(){
    for(var i = 0; i < game_buttons.length; i++){
        var prev = i-1;
        if(i == 0){
            prev = game_buttons.length - 1;;
        }
        var last = button_spacing[prev];
        if(game_buttons[i].transform > game_buttons[prev].transform[0]){
            if(game_buttons[i].transform[0] - game_buttons[prev].transform[0] != button_spacing[i] - button_spacing[prev]){
                game_buttons[i].transform[0] = game_buttons[prev].transform[0] + (button_spacing[i] - button_spacing[prev]);
                console.log("Fixing");
            }
        }
        
    }
}

*/

function fix_math(value, target, range){
    return (value > target - range && value < target + range);
}

function check_button_spacing(){
    return;
    function in_range(value, upper, lower){
        return (value > lower && value < upper);
    }
    
    var left = 0;
    var smallest = 100000;
    for(var i = 0; i < game_buttons.length; i++){
        if(game_buttons[i].transform[0] < smallest){
            smallest = game_buttons[i].transform[0];
            left = i;
        }
    }
    for(var i = 0; i < game_buttons.length; i++){
        var index = (left + i) % game_buttons.length;
        var prev = index - 1;
        if(prev < 0)
            prev = game_buttons.length-1;
        if(!fix_math(game_buttons[index].transform[0] - game_buttons[prev].transform[0], button_spacing[index] - button_spacing[prev], 0.01)){
            console.log(i, game_buttons[index].transform[0] - game_buttons[prev].transform[0], button_spacing[index] - button_spacing[prev]);
            game_buttons[index].transform[0] = game_buttons[prev].transform[0] + (button_spacing[index] - button_spacing[prev]);
        }
    }
}