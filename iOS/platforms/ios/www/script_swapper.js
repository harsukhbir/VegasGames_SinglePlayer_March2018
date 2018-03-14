var script_count, script_total, script_sum, loaded_sum, money_cur, isKeno;
isKeno = false;
function load_keno(){
    clear_flux();
    isKeno = true;
    money_cur = money;
    script_count = 0;
    script_sum = 0;
    loaded_sum = 0;
    stop_game();

    var source_dirs = get_keno_scripts();

    script_total = source_dirs.length;
    //console.log(script_total);
    for(var i = 0; i < source_dirs.length; i++){
        script_sum += i;
        var o = document.createElement('script');
        o.type = "text/javascript";
        o.onload = function(){
            loaded_sum += script_count;
            script_count++;
            //console.log("Script " + script_count + " loaded");
            if(script_count == script_total && loaded_sum == script_sum){
                //console.log("Beginning!");
                keno_begin();
                money = money_cur;
                update_money_display();
            }
        }
        o.src = source_dirs[i];
        o.id = 'keno_script_' + i;
        document.getElementById('flux').appendChild(o);
    }
}


function clear_flux(){
    if(isKeno){
        clearInterval(game_loop);
        canvas.removeEventListener('click', click_handler);
    }
    var flux = document.getElementById('flux');
    while(flux.hasChildNodes()){
        flux.removeChild(flux.lastChild);
    }
}

function load_main_scripts(){
    clear_flux();
    isKeno = false;
    money_cur = money;
    script_count = 0;
    script_sum = 0;
    loaded_sum = 0;

    var source_dirs = get_main_scripts();

    script_total = source_dirs.length;
    //console.log(script_total);
    for(var i = 0; i < source_dirs.length; i++){
        script_sum += i;
        var o = document.createElement('script');
        o.type = "text/javascript";
        o.onload = function(){
            loaded_sum += script_count;
            script_count++;
            //console.log("Script " + script_count + " loaded");
            if(script_count == script_total && loaded_sum == script_sum){
                //console.log("Beginning!");
                game_begin();
                build_wheel();
                focus_init();
            }
        }
        o.src = source_dirs[i];
        o.id = 'keno_script_' + i;
        document.getElementById('flux').appendChild(o);
    }
}







function get_main_scripts(){
    return source_dirs = [
        "jquery-2.1.4.js",
        "js/game_manager.js",
        "js/global.js",
        "js/bigspin/wheel_graphics.js",
        
        "js/lobby/vars.js",
        "js/lobby/backend.js",
        "js/lobby/lobby_click.js",
        "js/lobby/login_click.js",
        "js/lobby/keylistener.js",
        "js/lobby/click.js",
        "js/lobby/lobby_swipe.js",
        "js/lobby/load_imgs.js",
        "js/lobby/lobby_graphics.js",
        "js/lobby/login_graphics.js",
        "js/lobby/graphics.js",
        "js/lobby/main.js",

        "js/vp/vars.js",
        
        "js/vp/sounds.js",
        "js/vp/click.js",
        "js/vp/win_graphics.js",
        "js/vp/graphics.js",
        "js/vp/rules.js",
        "js/vp/load_imgs.js",
        "js/vp/logic.js",
        "js/vp/server_logic.js",

        "js/job/vars.js",
        "js/job/load_imgs.js",
        "js/job/rules.js",
        "js/job/logic.js",
        "js/job/server_logic.js",

        "js/jaw/vars.js",
        "js/jaw/load_imgs.js",
        "js/jaw/server_logic.js",
        "js/jaw/rules.js",
        "js/jaw/sounds.js",
        "js/jaw/graphics.js",
        "js/jaw/logic.js",

        "js/bingo/vars.js",
        "js/bingo/server.js",
        "js/bingo/buttons.js",
        "js/bingo/text.js",
        "js/bingo/click_functions.js",
        "js/bingo/click.js",
        "js/bingo/load_imgs.js",
        "js/bingo/number_sounds.js",
        "js/bingo/win_graphics.js",
        "js/bingo/graphics.js",
        "js/bingo/main.js",
        
        "js/moneywheel/moneywheel.js",
        "js/roulette/roulette.js"
    ];
}

function get_keno_scripts(){
    return [

        //"VGEngine/js/bingo_keno_music.js",
        "js/global.js",
        "VGEngine/js/engine.js",
        "VGEngine/js/Globals/globals.js",
        "VGEngine/js/Images/load_images.js",
        "VGEngine/js/Images/start_screen_imgs.js",
        "VGEngine/js/Images/splash_screen_imgs.js",
        "VGEngine/js/Images/payout_images.js",

        "VGEngine/js/Images/end_images.js",
        "VGEngine/js/Objects/abstracts.js",
        "VGEngine/js/Objects/square.js",
        "VGEngine/js/Objects/routine.js",
        "VGEngine/js/Objects/increase_decrease.js",
        "VGEngine/js/Objects/money_display.js",

        "VGEngine/js/Interactions/interaction_manager.js",
        "VGEngine/js/Interactions/Click/square_click.js",
        "VGEngine/js/Interactions/Click/increase_decrease_functions.js",
        "VGEngine/js/Interactions/Click/home_screen_clicks/home_screen_click_interactions.js",
        "VGEngine/js/Interactions/Click/click.js",

        "VGEngine/js/Network/network.js",
        "VGEngine/js/Network/keno_server.js",
        "VGEngine/js/Timers/timers.js",
        "VGEngine/js/Utils/utils.js",
        "VGEngine/js/Utils/reset_game.js",
        "VGEngine/js/Utils/payout_functions.js",
        
        "VGEngine/js/Initializers/keno_sounds.js",
        "VGEngine/js/Initializers/select_screen.js",
        "VGEngine/js/Initializers/home_screen.js",
        "VGEngine/js/Initializers/splash_screen.js",
        "VGEngine/js/Initializers/game_screen.js",
        "VGEngine/js/Initializers/end_screen.js",
        "VGEngine/js/Initializers/initializers.js"
    ];
}