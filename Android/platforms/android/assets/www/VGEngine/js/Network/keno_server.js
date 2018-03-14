function keno_submit(){
    if(current_bet == 0 || selected_games == 0)
        return;
    if(uname.toLowerCase() != "guest"){
        load_async(server_address + "keno/keno_submit?uid=" + uname + "&sid=" + sid + "&p=" + selected_squares.length + "&bet=" + current_bet, parse_numbers);
    }else{
        var numbers_str = ''
        var numbers = [];
        for(var i = 0; i < 20; i++){
            var rand = Math.floor(Math.random()* 80);
            found = true;
            while(found){
                found = false;
                for(var i = 0; i < numbers.length; i++){
                    if(numbers[i] == rand){
                        found = true;
                        rand = Math.floor(Math.random() * 80);
                    }
                }
            }

             if (rand == 0){
                rand = Math.floor(Math.random() * 80);
            }
            
            numbers.push(rand);
            numbers_str += rand;
            if(i < 19){
                numbers_str += '_';
            }
        }
        parse_numbers(numbers_str);
    }
    //if request.vars.uid == None or request.vars.sid == None or request.vars.p == None or request.vars.bet == None:
    
}

function parse_numbers(response){
    console.log(response);
    chosen_numbers = [];
    var num = "";
    for(var i = 0; i < response.length; i++){
        if(response[i] == "_"){
            chosen_numbers.push(parseInt(num));
            num = "";
        } else {
            num += response[i];
        }
    }
    chosen_numbers.push(parseInt(num));
    console.log(chosen_numbers);
    change_mode(2);
    //log(chosen_numbers, 0);
}



function keno_payout(){
    
}