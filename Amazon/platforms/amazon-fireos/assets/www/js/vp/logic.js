function resize_canvas(){

	// alert("hi");
 //    alert("1");
 //    alert("2");
    // alert("date "+Date.now());
    // var ssAds = new SupersonicAds("465b1a0d", 'demo_' + Date.now());
    // alert("hello");

    // // show a rewarded ad
    // ssAds.showRewardedAd();

    // // show a rewarded ad for placement RightHere
    // ssAds.showRewardedAd("RightHere");

    // // show an offerwall
    // ssAds.showOfferWall();

    // // show an interstitial
    // ssAds.showInterstitial();

    // // give em some credit
    // window.addEventListener("offerwallCreditReceived", function(e) {

    //     var credit = e.credit;

    //     // The number of credits the user has earned.
    //     console.log(credit.amount);

    //     // The total number of credits ever earned by the user.
    //     console.log(credit.total):

    //     // estimated flag is the same as totalCreditsFlag 
    //     // In some cases, we won’t be able to provide the exact
    //     // amount of credits since the last event (specifically if the user clears
    //     // the app’s data). In this case the ‘credits’ will be equal to the ‘totalCredits’,
    //     // and this flag will be ‘true’.
    //     console.log(credit.estimated);

    // }, false);

    // // reward your users
    // window.addEventListener("rewardedVideoRewardReceived", function(e) {

    //     var placement = e.placement;
    //     console.log(placement.id); // only available on android
    //     console.log(placement.name);
    //     console.log(placement.reward);
    //     console.log(placement.amount);
    // }, false);


    
    resize_game_canvas();
    auto_size_imgs();
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

