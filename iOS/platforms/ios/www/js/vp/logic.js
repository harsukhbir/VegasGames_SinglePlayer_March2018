function resize_canvas(){
    resize_game_canvas();
    auto_size_imgs();
}

function vp_resize_canvas() {
	// alert("00");
	// resize_game_canvas();  // leo comment this function and function data past in ti

	var max_width = window.innerWidth * 0.98;
    var max_height = window.innerHeight * 0.98;
    // alert("0");
    canvas.width = max_width;

	canvas.height = canvas.width * 9/16;
    // alert("1-canvas");

    // while(canvas_height > max_height || canvas.width > max_width){
    //     canvas.width--;
    //     canvas.height = canvas_width * 9/16;
    // }

    //alert("canvas_height"+canvas_height + " > " +window.innerHeight * 0.98 +" || "+ "canvas_width" +canvas_width+ " > "+window.innerWidth * 0.98+);
    // alert(canvas_height);

    // ===  my extra

    // ===  my extra

    while(canvas_height >= window.innerHeight * 0.98 || canvas_width >= window.innerWidth * 0.98){
        canvas_width--;
        canvas_height = canvas_width * 9/16;
    }

    // while(canvas_height >= max_height || canvas.width >= max_width){
    //     canvas.width--;
    //     canvas.height = canvas_width * 9/16;
    // }

    //alert("2");
	font_size = Math.floor(canvas.width / 40);
    //alert("3");
	context.font = font_size + font;
   // alert("4");
    auto_size_imgs();	
   // alert("5");
    canvas_width = canvas.width;
    canvas_height = canvas.height;
    for(var i = 0; i < buffers.length; i++){
        buffers[i].width = canvas_width;
        buffers[i].height = canvas_height;
    }
   // alert("6");
    resize_extra();
   // alert("7");
	//

	//alert("11");
	auto_size_imgs();
	//alert("22");
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
	if(cash >= bet_amount + bet && bet < max_bet){
        if(audio_on && sound_enabled){
            bet_sounds[Math.floor(Math.random() * 2) + 1].play();
        }
		bet += bet_amount;
        //cash -= bet_amount;
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
        if(audio_on && sound_enabled){
            bet_sounds[0].play();
        }
		bet -= bet_amount;
		//cash += bet_amount;
		return true;
	}
	return false;
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
function vp_init(){
    if(cash >= min_bet){
        console.log("Setting bet!");
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
        initialzed = true;
        //vp_music_init();
    }
    money_popup = false;
    store_open = false;
    
	hand_type = "";
	primary_bet = 0;
	deck = [];
	hand = [];
	selected = [];
    show_payout_table = false;
	mode = 2;

	selected = [false, false, false, false, false]
    vp_sound_init();
	vp_reset_win_graphics();
    if(audio_on && sound_enabled){
        shuffle_sounds[Math.floor(Math.random() * shuffle_sounds.length)].play();
    }
    
    hand_types = [words[6], words[7], "4 Of A Kind", words[9], words[10], words[11], "3 Of A Kind", "Two Pair"];

    //check_session(null, null);
}

var canvas_width, canvas_height;