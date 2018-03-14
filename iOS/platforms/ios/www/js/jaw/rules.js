// This needs to be pushed to the back end
function jw_check_hand(){
    //console.log(hand_types);
    //hand = [10, 13,13.1, 8, 2.1];
    var csh = 0;
	var flush = true;
    var flush_type = -1;
	var multiples = [];
    var num_jokers = 0;
    hand_type = "";

    // Checking for a Straight
    var straight_check = hand.slice();
	var straight = [100];
    var index = -1;
    for(var i = 0; i < straight_check.length; i++){
        if(straight_check[i] < 13 && flush_type == -1)
            flush_type = check_suit(straight_check[i]);
        if(straight_check[i] < straight[0]){
            straight[0] = straight_check[i];
            index = i;
        }
    }
    straight_check = remove_at(straight_check, index);
    index = 0;
	while(straight_check.length > 0){
        if(index >= straight_check.length){
            for(var i = 0; i < straight_check.length; i++){
                if(straight_check[i] >= 13){
                    straight.push(straight_check[i]);
                    straight_check = remove_at(straight_check, i);
                    index = -1;
                    break;
                }
            }
            if(index != -1){
                break;
            }
        }
        else if(Math.floor(straight_check[index]) == Math.floor(straight[straight.length-1]) + 1){
            straight.push(straight_check[index]);
            straight_check = remove_at(straight_check, index);
            index = -1;
        } else if(Math.floor(straight[straight.length-1]) == 13){
            if(Math.floor(straight_check[index]) == Math.floor(straight[straight.length-2]) + 2){
                straight.push(straight_check[index]);
                straight_check = remove_at(straight_check, index);
                index = -1;
        	}
        }
		index++;
	}

	
	for(var i = 0; i < hand.length; i++){
        if(hand[i] >= 13)
            num_jokers++;
		// Checking Flush
        if(check_suit(hand[i]) != flush_type && hand[i] < 13)
            flush = false;
        
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
    var best_set = [0, 0];
	for(var i = 0; i < sets.length; i++){
		if(sets[i][1] > best_set[1] || (sets[i][1] == best_set[1] && sets[i][0] < best_set[0])){
            best_set = sets[i];
        }
	}
    
    var joker_used = false;
    // Ensuring the Jokers form sets correctly
    if(sets.length == 0 && num_jokers > 0){
        var best_card = -1;
        for(var i = 0; i < hand.length; i++){
            if(hand[i] > best_card && hand[i] < 13){
                best_card = hand[i];
            }
        }
        if(num_jokers > 0)
            joker_used = true;
        var new_set = [best_card, num_jokers + 1];
        best_set = new_set;
        sets.push(new_set);
    }
    console.log(sets);
    if(best_set[0] < 13 && !joker_used){
        best_set[1] += num_jokers;
    } else if(!joker_used) {
        var best_card = -1;
        var best_count = 1;
        for(var i = 0; i < hand.length; i++){
            if(Math.floor(hand[i]) > Math.floor(best_card) && hand[i] < 13){
                best_card = hand[i];
                best_count = 1;
            } else if(Math.floor(hand[i]) == Math.floor(best_card))
                best_count++;
            
        }
        best_set = [best_card, best_count + num_jokers];
        //console.log(best_set);
    }

    var largest_set = best_set[1];

    

	if(straight.length == hand.length && flush){
        var o = 0;
        var royal_flush = [8,9,10,11,12];
        for(var i = 0; i < straight.length; i++){
            if(royal_flush.indexOf(Math.floor(straight[i])) != -1){
                o++;
            }
        }
        if(o == royal_flush.length){
            hand_type = hand_types[0];
			csh += bet * 800;
        } else if(o + num_jokers == royal_flush.length){
            hand_type = hand_types[2];
            csh += bet * 100;
        } else {
            hand_type = hand_types[4];
			csh += bet * 50;
        }
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
    } else if(largest_set == 5){
        hand_type = hand_types[1];
        csh += bet * 200;
        for(var i = 0; i < selected.length; i++)
            selected[i] = true;
	} else if(largest_set == 4){
		hand_type = hand_types[3];
		csh += bet * 18;
		for(var i = 0; i < hand.length; i++)
			if(Math.floor(hand[i]) == best_set[0] || hand[i] >= 13)
				selected[i] = true;
	} else if(largest_set == 3 && sets.length > 1) {
		hand_type = hand_types[5];
		csh += bet * 7;
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(flush) {
		hand_type = hand_types[6];
		csh += bet * 5;
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(straight.length == hand.length){
		hand_type = hand_types[7];
		csh += bet * 3;
		for(var i = 0; i < selected.length; i++)
			selected[i] = true;
	} else if(largest_set == 3){
		hand_type = hand_types[8];
		csh += bet * 2;
		for(var i = 0; i < hand.length; i++){
			if(Math.floor(hand[i]) == best_set[0] || hand[i] >= 13)
				selected[i] = true;
		}
	} else if(sets.length == 2){
		hand_type = hand_types[9];
		csh += bet * 1;
		for(var i = 0; i < sets.length; i++){
			for(var j = 0; j < hand.length; j++){
				if(Math.floor(hand[j]) == sets[i][0] || hand[j] >= 13)
					selected[j] = true;
			}
		}
    } else if(largest_set == 2){
        if(best_set[0] >= 11){
            hand_type = hand_types[10];
            csh += bet *  1;
            for(var i = 0; i < hand.length; i++){
                if(Math.floor(hand[i]) == Math.floor(best_set[0]) || hand[i] >= 13)
                    selected[i] = true;
            }
        }
	}
    if(audio_on && sound_enabled){
        var found = false;
        for(var i = 0; i < hand_types.length; i++){
            if(hand_type == hand_types[i]){
                if(i == hand_types.length -1){
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
    //console.log(hand_types);
	last_winning = csh;
	mode++;
    experience += 10;
    if(uname.toLowerCase() == 'guest'){
        cash += csh;
        money = cash;
    }
}

