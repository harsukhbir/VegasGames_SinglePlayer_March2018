function bingo_exit_game(){
    return_to_lobby();
}

function click_board(index){
    
}

function bingo(){
    submit_bingo();
}


function bingo_start_game(num){
    desired_cards = num;
    bingo_get_numbers();
    display_index = 0;
    console.log("Timer Loop: " + timer_loop);
    if(timer_loop == null){
        timer_loop = setInterval(bingo_tick, 1);
        //bingo_play_number_sound(chosen_numbers[display_index]);
    }
}
