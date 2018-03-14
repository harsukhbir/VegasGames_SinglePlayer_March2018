/*
SHARED WITH VP
function resize_canvas(){
    resize_game_canvas();
    auto_size_imgs();
}




function auto_size_imgs(){
    var size = canvas_width / 1920;
    var does_scale = true;
    if(size < 0.47 && does_scale){
        img_mod = "42/";
        load_images();
        console.log("42%");
    } else if(size < 0.59 && does_scale){
        img_mod = "50/";
        load_images();
        console.log("50%");
    } else if(size < 0.75 && does_scale){
        img_mod = "66/";
        load_images();
        console.log("66%");
    } else{
        img_mod = "";
        load_images();
        console.log("100%");
    }   
}


// Finds the suit of a card given its floating point value
function check_suit(value){
	var val = (value - Math.floor(value)) / 0.1;
	if(val - Math.floor(val) > 0.5)
		return Math.floor(val) + 1;
	else 
		return Math.floor((value - Math.floor(value)) / 0.1);
}

// This needs to go the back end
function increase_bet(){
	if(cash >= bet_amount && bet < max_bet){
        if(audio_on){
            bet_sounds[Math.floor(Math.random() * 2) + 1].play();
        }
		bet += bet_amount;
        cash -= bet_amount;
        
        if(cash == 0){
            money_popup = true;
            open_store();
        }
		return true;
	}
	return false;
}

// This needs to go the back end
function decrease_bet(){
	if(bet >= bet_amount + min_bet && bet - bet_amount >= primary_bet){
        if(audio_on){
            bet_sounds[0].play();
        }
		bet -= bet_amount;
		cash += bet_amount;
		return true;
	}
	return false;
}



function auto_size_text(text, width, height){
	font_size = 1;
	context.font = font_size + font;
	while(context.measureText("W").width <= height && context.measureText(text).width < width){
		font_size++;
		context.font = font_size + font;
	}
}

function create_deck(){
	for(var i = 0; i < 13; i++){
		for(var j = 0; j < 4; j++){
			var card = i + (j * 0.1);
			deck.push(card);
		}
	}
}
function remove_at(array, index){
	var new_array = [];
	for(var i = 0; i < array.length; i++){
		if(i != index){
			new_array.push(array[i]);
		}
	}
	return new_array;
}

function shuffle_deck(){
	var new_deck = [];
	while(deck.length > 0){
		var rand = Math.floor(Math.random() * deck.length);
		new_deck.push(deck[rand]);
		deck = remove_at(deck, rand);
	}
	deck = new_deck;
}
function draw_card(number){
	for(var i = 0; i < number; i++){
		hand.push(deck[0]);
		deck = remove_at(deck, 0);
	}
}
*/
function init_jb(){
    if(cash >= min_bet){
        //cash -= min_bet;
        bet = min_bet;
    } else {
        if(audio_on && initialzed && sound_enabled)
            outofcash.play();
        bet = 0;
    } 
    if(cash == 0 && initialzed){
        money_popup = true;
        open_store();
    }
    if(!initialzed){
        load_images();
        switch_language(language_selected,1);
        canvas.addEventListener('click', vp_click_handler, false);
        init_server_stuff();
        //vp_music_init();
        initialzed = true;
    }
    money_popup = false;
    store_open = false;
	hand_type = "";
    primary_bet = 0;
	deck = [];
	hand = [];
	selected = [];
    show_payout_table = false;
	//draw_card(5);
    //get_hand();
	mode = 2;

	selected = [false, false, false, false, false]
    vp_sound_init();
	vp_reset_win_graphics();
    if(audio_on && sound_enabled){
        shuffle_sounds[Math.floor(Math.random() * shuffle_sounds.length)].play();
    }
    
    //check_session(null, null);
}