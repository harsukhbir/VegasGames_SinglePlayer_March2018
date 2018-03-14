/*
function init_server_stuff(){
    uname = "";
    sid = "";
    var money_str = "";
    var start_str = "uname=";
    var url = window.location.search;
    var start = url.indexOf(start_str);
    var re = new RegExp("uname=(.*)&sid", "g");
    uname = re.exec(url)[1];
    
    re = new RegExp("sid=(.*)&money", "g");
    sid = re.exec(url)[1];
    
    re = new RegExp("money=(.*)", "g");
    money_str = re.exec(url)[1];
    cash = parseInt(money_str);
}
*/

function jw_get_hand(){
    cash -= bet;
    money -= bet;
    if(uname == "Guest" || uname == "guest"){
        jw_create_deck();
        shuffle_deck();
        draw_card(5);
        if(contains(hand, 13) || contains(hand, 13.1)){
            if(sound_enabled)
                joker_sound.play();
        }
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
    req.open("GET", server_url + "get_hand?uid="+uname+"&sid="+sid+"&b="+bet, true);
    req.send(null);
}

function jw_draw_new(){
    if(uname == "Guest" || uname == "guest"){
        for(var i = 0; i < selected.length; i++){
            if(!selected[i]){
                hand[i] = deck[0];
                deck = remove_at(deck, 0);
            }
        }
        selected = [false, false, false, false, false];
        if(contains(hand, 13) || contains(hand, 13.1))
            joker_sound.play();
        jw_check_hand();
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
            jw_check_hand();
           
        }
    }
    console.log(server_url + "draw?uid="+uname+"&sid="+sid + "&rep="+selected_str+"&b="+bet);
    req.open("GET", server_url + "draw?uid="+uname+"&sid="+sid + "&rep="+selected_str+"&b="+bet, true);
    req.send(null);

}
