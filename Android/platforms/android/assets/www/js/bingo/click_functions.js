function bingo_exit_game(){
    return_to_lobby();
}

function click_board(index){
    
}

function bingo(){
    // alert("1");
    submit_bingo();
}


function bingo_start_game(num){
    var Replay_Game = "Replay Game";
      var Replay_Game_No = {
        "Replay Game_No": "1"
      };
    window.plugins.appsFlyer.trackEvent(Replay_Game, Replay_Game_No);
     
    desired_cards = num;
    bingo_get_numbers();
    display_index = 0;
    console.log("Timer Loop: " + timer_loop);
    if(timer_loop == null){
        timer_loop = setInterval(bingo_tick, 1);
        //bingo_play_number_sound(chosen_numbers[display_index]);
    }
}
