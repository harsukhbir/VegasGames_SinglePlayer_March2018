function bingo_get_numbers(){
    console.log("Getting Numbers");
     
    if(uname != "Guest" && money >= desired_cards * 2){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(req.readyState == 4 && req.status == 200){
                console.log(req.responseText);
                if(req.responseText == 'Invalid')
                    return;
                var parse_card = false;
                var numbers = [];
                chosen_numbers = [];
                var num = "";
                for(var i = 0; i < req.responseText.length; i++){
                    if(req.responseText[i] == "~"){
                        parse_card = true;
                    } else if(!parse_card){
                        if(req.responseText[i] == "[" || req.responseText[i] == " "){
                            continue;
                        } else if(req.responseText[i] == "," || req.responseText[i] == "]"){
                            chosen_numbers.push(parseInt(num));
                            num = "";
                        } else{
                            num += req.responseText[i];
                        }
                    } else if(parse_card){
                        if(req.responseText[i] == "[" || req.responseText[i] == " "){
                            continue;
                        } else if(req.responseText[i] == ","){
                            numbers.push(parseInt(num));
                            num = "";
                        } else if(req.responseText[i] == "]"){
                            numbers.push(parseInt(num));
                            cards.push(bingo_new_card(numbers));
                            numbers = [];
                            num = "";
                        } else{
                            num += req.responseText[i];
                        }
                    }
                    
                }
                bingo_play_number_sound(chosen_numbers[0]);
                mode = 100;
                money -= desired_cards * 2;
                tick_speed = 2.5 + desired_cards * 0.75;
                if(tick_speed > 5)
                    tick_speed = 5;
                if(money == 0){
                    money_popup = true;
                    open_store();
                }
            }
        }
        req.open("GET", server_url + "create_card?uid=" + uname +"&sid=" + sid + "&cards=" + desired_cards, true);
        req.send(null);
    } else{
        if(money < desired_cards * 2)
            return;
        chosen_numbers = [];
        for(var i = 0; i < 45; i++){
            var num = Math.floor(Math.random() * 75) + 1;
            var found = true;
            while(found){
                found = false;
                for(var j = 0; j < chosen_numbers.length; j++){
                    if(chosen_numbers[j] == num){
                        num = Math.floor(Math.random() * 75) + 1;
                        found = true;
                    }
                }
            }
            chosen_numbers.push(num);
        }

        for(var w = 0; w < desired_cards; w++){
            var numbers = [];
            for(var i = 0; i < 5; i++){
                for(var j = 0; j < 5; j++){
                    var max = 15 * (i+1);
                    var min = 15 * i + 1;
                    var num = Math.floor(Math.random() * (max-min)+min);
                    var found = true;
                    while(found){
                        found = false;
                        
                        for(var k = 0; k < numbers.length; k++){
                            if(numbers[k] == num){
                                found = true;
                                num = Math.floor(Math.random() * (max-min)+min);
                                break;
                            }
                        }
                    }
                    numbers.push(num);
                }
            }
            cards.push(bingo_new_card(numbers));

        }
        bingo_play_number_sound(chosen_numbers[0]);
        mode = 100;
        money -= desired_cards * 2;
        tick_speed = 2.5 + desired_cards * 0.9;
        if(tick_speed > 6.5)
            tick_speed = 5;
        mode=100;
        money -= desired_cards * 2;
        bingo_play_number_sound(chosen_numbers[0]);
    }
}

function bingo_server_stuff_init(){
    return;
    uname = "";
    sid = "";
    var money_str = "";
    var start_str = "uname=";
    var url = window.location.search;
    var start = url.indexOf(start_str);
    var re = new RegExp("uname=(.*)&sid", "g");
    uname = re.exec(url)[1];
    
    var re = new RegExp("sid=(.*)&money", "g");
    sid = re.exec(url)[1];
    
    var re = new RegExp("money=(.*)", "g");
    money_str = re.exec(url)[1];
    money = parseInt(money_str);
}


function submit_bingo(){
    // alert("start");
    if(uname != "Guest"){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(req.readyState == 4 && req.status == 200){
                console.log(req.responseText);
                var value = parseInt(req.responseText);
                if(value != NaN){
                    //console.log("U R W1nn3R");
                    last_win = value;
                    money += value;
                    bingo_win_init();
                    mode = 101;
                    experience += 25;
                    clearInterval(timer_loop);
                    timer_loop = null;
                } else{
                    //console.log("L14R");
                    if(display_index < chosen_numbers.length-1){
                        last_win = 0;
                        mode = 101;
                        experience += 25;
                        clearInterval(timer_loop);
                        timer_loop = null;
                    } else{
                        last_win = 0;
                        mode = 101;
                        experience += 25;
                        clearInterval(timer_loop);
                        timer_loop = null;
                    }
                }
            }
        }
        var click_str = "";
        for(var i = 0; i < cards.length; i++){
            click_str += cards[i].clicked + ',';
        }
        console.log(server_url + "bingo_submit?uid=" + uname +"&sid=" + sid + "&click=" + click_str);
        req.open("GET", server_url + "bingo_submit?uid=" + uname +"&sid=" + sid + "&click=" + click_str + "&t=" + display_index, true);
        req.send(null);
    } else{
        var card_index = 0;
        var bingo = false;
        var bingo_count = 0;
        for(var c = 0; c < cards.length; c++){
            var card = [];
            var clicks = [];
            for(var i = 0; i < 5; i++){
                var col = [];
                var ccol= [];
                for(var j = 0; j < 5; j++){
                    col.push(cards[c].numbers[i*5 + j]);
                    ccol.push(cards[c].clicked[i*5 + j]);
                }
                card.push(col);
                clicks.push(ccol);
            }
            console.log(card);
            var up = true;
            var down = true;
            for(var i = 0; i < 5; i++){
                // Checking rows and columns
                var col = true;
                var row = true;
                for(var j = 0; j < 5; j++){
                    // Checking row
                    var index = search_list(chosen_numbers, card[i][j]);
                    if((index == -1 || !clicks[i][j]) && (i + j * 5 != 12)){
                        row = false;
                    }
                    // Checking column
                    index = search_list(chosen_numbers, card[j][i]);
                    if ((index == -1 || !clicks[j][i]) && (i * 5 + j != 12)){
                        col = false;
                    }
                }
                console.log(row, col);
                if(row){
                    bingo_count++;
                }
                if(col){
                    bingo_count++;
                }
                if((search_list(chosen_numbers,  parseInt(cards[c].numbers[i * 6]) == -1 || !cards[c].clicked[c][i * 6]) && i * 6 != 12)){
                    down = false;
                }
                if((search_list(chosen_numbers,  parseInt(cards[c].numbers[(i + 1) * 4]) == -1 || !cards[c].clicked[c][(i + 1) * 4]) && (i + 1) * 4 != 12)){
                    up = false;
                }
            }
            if(up || down){
                bingo = true;
                break;
            }
            if(bingo){
                bingo_count++;
                bingo = false;
            }
        }
        console.log(bingo_count);
        var value = 0;
        if(bingo_count > 0){
            time = display_index;
            if(time < 5){
                value += 200 * bingo_count;
            } else if(time < 15){
                value += 100 * bingo_count;
            } else if(time < 25){
                value += 18 * bingo_count;
            } else if(time < 32){
                value += 8 * bingo_count;
            } else if(time > 32){
                value += 3 * bingo_count;
            }
        }
        
        last_win = value;
        money += value;
        bingo_win_init();
        experience += 25;
        mode = 101;

        clearInterval(timer_loop);
    }
}

function search_list(arry, val){
    for(var i = 0; i < arry.length; i++){
        if(arry[i] == val)
            return i;
    }
    return -1;
}

/*
function return_to_lobby(){
    if(uname.toLowerCase() == "guest")
        window.localStorage.setItem("guest_money", money);
    window.location = "back_to_lobby.html?uname="+uname+"&sid="+sid+"&gid=bingo&money="+money;
}
*/

