function start_game(){
    console.log("Game Starting");
    if(selected_squares.length == max_selectable)
        keno_submit();
}

function start_game_splash_screen(){
    console.log("Start!");
    change_mode(0);
}

function open_home_payout(){
    if(mode == 2){
        if(new Date().getTime() - screens[2].attributes[0] < 200){
            return;
        }
    }
    open_payout_table([0.345, 0.025, 0.595, 0.795]);
}

function splash_screen_exit(){
    if(uname.toLowerCase() == "guest")
        window.localStorage.setItem("guest_money", money);
    //window.location = "../back_to_lobby.html?uname="+uname+"&sid="+sid+"&gid=keno"+"&money="+money;
    load_main_scripts();
}

function game_exit(){
    if(mode == 2){
        if(new Date().getTime() - screens[2].attributes[0] < 200){
            return;
        }
    }    
    console.log("Game Exit");
    reset_game();
    change_mode(1);
}

function home_screen_open_store(){
    console.log("Store!");
    open_store();
}