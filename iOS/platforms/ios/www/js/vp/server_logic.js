function init_server_stuff(){
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
    cash = parseInt(money_str);
}

function vp_get_hand(){
    cash -= bet;
    money -= bet;
    if(uname == "Guest" || uname == "guest"){
        create_deck();
        shuffle_deck();
        draw_card(5);
        return;
    }
    var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
            var hand_str = "";
            hand = [];
            for(var i = 0; i < req.responseText.length; i++){
                if(req.responseText[i] == '_'){
                    hand.push(parseFloat(hand_str));
                    hand_str = "";
                } else {
                    hand_str += req.responseText[i];
                }
            }
            hand.push(parseFloat(hand_str));
        }
    }
    console.log(server_url + "get_hand?uid="+uname+"&sid="+sid+"&b="+bet);
    req.open("GET", server_url + "get_hand?uid="+uname+"&sid="+sid+"&b="+bet, true);
    req.send(null);
}

function vp_draw_new(){
    if(uname == "Guest" || uname == "guest"){
        for(var i = 0; i < selected.length; i++){
            if(!selected[i]){
                hand[i] = deck[0];
                deck = remove_at(deck, 0);
            }
        }
        selected = [false, false, false, false, false];

        console.log("Checking Hand?");
        if(GameManager.Current_Game == "VP"){
            console.log("VP");
            vp_check_hand();
        } else if(GameManager.Current_Game == "JB"){
            console.log("JB");
            jb_check_hand();
        } else if(GameManager.Current_Game == "JW"){
            console.log("JW");
            jw_check_hand();
        }
        return;
    }
    var selected_str = "";
    for(var i = 0; i < selected.length; i++){
        selected_str += !selected[i];
        if(i<selected.length-1)
            selected_str += "_";
    }
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            var hand_str = "";
            var iterator = 0;
            for(var i = 0; i < req.responseText.length; i++){
                if(req.responseText[i] == '_'){
                    hand[iterator] = parseFloat(hand_str);
                    iterator++;
                    hand_str = "";
                } else if(req.responseText[i] == '~'){
                    hand[iterator] = parseFloat(hand_str);
                    iterator++;
                    hand_str = "";
                } else {
                    hand_str += req.responseText[i];
                }
            }
            cash = parseInt(hand_str);
            money = cash;
            selected = [false, false, false, false, false];
            vp_check_hand();
           
        }
    }
    req.open("GET", server_url + "draw?uid="+uname+"&sid="+sid + "&rep="+selected_str+"&b="+bet, true);
    req.send(null);

}


