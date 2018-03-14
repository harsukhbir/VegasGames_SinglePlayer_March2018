function open_payout_table(transform){
    payout_transform = transform;
    show_payout = true;
}

function close_payout_table(){
    show_payout = false;
}

function payout_force_aspect(){
    payout_transform[3] = payout_transform[2] * (payout_aspect[1] / payout_aspect[0]);
}

function get_payout_value(){
    var value = max_selectable;
    if(max_selectable > 4){
        value = 4;
    } /*else if(max_selectable == 0){
        value = 1;
    }
    */
    return value;
}


function calc_win(){
    var overlap = 0;

    for(var i = 0; i < selected_squares.length; i++){
        for(var j = 0; j < chosen_numbers.length; j++){
            if(chosen_numbers[j] == selected_squares[i]){
                overlap++;
                break;
            }
        }
    }
    var selected = selected_squares.length - 1;
    if(selected < 0 || selected > payout_vals.length)
        return 0;
    
    var winnings = 0;
    if(payout_vals[selected].length > selected - overlap){
        winnings = payout_vals[selected][selected - overlap];
    }
    return winnings;
}

var payout_transform, show_payout;
var payout_aspect = [0.595, 0.795];

var payout_vals = [
    [2],
    [10],
    [25, 2],
    [50, 5, 1],
    [500, 15, 2],
    [1500, 50, 5, 1],
    [5000, 150, 15, 2, 1],
    [15000, 400, 50, 10, 2],
    [25000, 2500, 200, 25, 4, 1],
    [200000, 10000, 500, 50, 10, 3, 3]
];