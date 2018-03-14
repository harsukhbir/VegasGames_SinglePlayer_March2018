// This needs to be pushed to the back end
function jb_check_hand(){
    var csh = 0;
	var flush = true;
	var multiples = [];
    hand_type = "";
	// Checking for a Straight
	var straight = [];	
	var straight_check = hand;
	while(straight_check.length > 0){
		smallest = 100;
		smallest_index = -1;
		for(var i = 0; i < straight_check.length; i++){
			if(straight_check[i] < smallest){
				smallest = straight_check[i];
				smallest_index = i;
			}
		}
		straight.push(straight_check[smallest_index]);
		straight_check = remove_at(straight_check, smallest_index);
	}
	for(var i = 1; i < straight.length; i++){
		if(Math.floor(straight[i]) - Math.floor(straight[i-1]) != 1){
			straight = remove_at(straight, 0);
			break;
		}
	}

	
	
	for(var i = 0; i < hand.length; i++){
		// Checking Flush
		if(i > 0){
			if(check_suit(hand[i]) != check_suit(hand[i-1]))
				flush = false;
		}
	
		// Checking Multiples
		for(var j = 0; j < hand.length; j++){
			if(Math.floor(hand[i]) == Math.floor(hand[j]) && i != j){
				var found = false;
				for(var k = 0; k < multiples.length; k++){
					if(multiples[k] == hand[i])
						found = true;
				}
				if(!found)
					multiples.push(hand[i]);
			}
		}
	}
	
	// Determining Information about any multiples in hand
	var sets = []
	for(var i = 0; i < multiples.length; i++){
		var found = false;
		for(var j = 0; j < sets.length; j++){
			if(sets[j][0] == Math.floor(multiples[i])){
				sets[j][1]++;
				found = true;
			}
		}
		if(!found){
			sets.push([Math.floor(multiples[i]), 1]);
		}
	}
	//console.log(sets);
	var largest_set = 0;
	for(var i = 0; i < sets.length; i++){
		if(sets[i][1] > largest_set)
			largest_set = sets[i][1];
	}
	
	//console.log(largest_set);

	if(straight.length == hand.length && flush){
		var royal = true;
		var royal_flush = [8,9,10,11,12];
		var valid = [false, false, false, false, false]
		for(var i = 0; i < royal_flush.length; i++){
			for(var j = 0; j < hand.length; j++){
				if(Math.floor(hand[j]) == royal_flush[i]){
					valid[i] == true;
					break;
				}
			}
		}
		for(var i = 0; i < valid.length; i++)
			if(!valid[i])
				royal = false;
		if(royal){
			hand_type = hand_types[0];
			csh += bet * 250;
		} else{
			hand_type = hand_types[1];
			csh += bet * 50;
		}
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(largest_set == 4){
		hand_type = hand_types[2];
		csh += bet * 25;
		for(var i = 0; i < hand.length; i++)
			if(Math.floor(hand[i]) == sets[0][0])
				selected[i] = true;
	} else if(largest_set == 3 && sets.length > 1) {
		hand_type = hand_types[3];
		csh += bet * 9;
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(flush) {
		hand_type = hand_types[4];
		csh += bet * 6;
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(straight.length == hand.length){
		hand_type = hand_types[5];
		csh += bet * 4;
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(largest_set == 3){
		hand_type = hand_types[6];
		csh += bet * 3;
		for(var i = 0; i < hand.length; i++){
			if(Math.floor(hand[i]) == sets[0][0])
				selected[i] = true;
		}
	} else if(sets.length == 2){
		hand_type = hand_types[7];
		csh += bet * 2;
		for(var i = 0; i < sets.length; i++){
			for(var j = 0; j < hand.length; j++){
				if(Math.floor(hand[j]) == sets[i][0])
					selected[j] = true;
			}
		}
	} else if(sets.length == 1){
		//console.log(sets[0][0]);
		if(sets[0][0] >= 9){
			hand_type = hand_types[8];
			csh += bet;
			for(var i = 0; i < hand.length; i++){
				if(Math.floor(hand[i]) == sets[0][0])
					selected[i] = true;
			}
		} else {
			//hand_type = "10s or Inferior";
		}

	}
    if(audio_on && sound_enabled){
        var found = false;
        for(var i = 0; i < hand_types.length; i++){
            if(hand_type == hand_types[i]){
                if(i == hand_types.length -1){
                    //announcement_sounds[i].play();
                    announcement_sounds[i].play();
                } else{
                    announcement_sounds[i].play();
                }
                found = true;
                
            }
        }
        if(!found){
            lose_sounds[Math.floor(Math.random() * lose_sounds.length)].play();
        }
    }
	
	last_winning = csh;
	mode++;
    experience += 10;
    if(uname.toLowerCase() == 'guest'){
        cash += csh;
        money = cash;
    }
}

