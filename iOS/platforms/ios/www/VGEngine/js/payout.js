function payout(){
	//if(matches < Math.floor(selected.length / 2)) return;
	console.log(max_selectable, matches);
	switch(max_selectable){
		case 1:
			money += current_bet * 0.5;
			break;
		case 2:
			if(matches == 2)
				money += current_bet * 2.5;
			break;
		case 3:
			if(matches == 3)
				money += current_bet * 6.25;
			else if (matches == 2)
				money += current_bet * 0.5;
			break;
		case 4:
			if(matches == 4)
				money += current_bet * 12.5;
			else if(matches == 3)
				money += current_bet * 1.25;
			else if (matches == 2)
				money += current_bet * 0.25;
			break;
		case 5:
			if(matches == 5)
				money += current_bet * 75;
			else if(matches == 4)
				money += current_bet * 3.75;
			else if (matches == 3)
				money += current_bet * 0.5;
			break;
		case 6:
			if(matches == 6)
				money += current_bet * 250;
			else if(matches == 5)
				money += current_bet * 12.5;
			else if(matches == 4)
				money += current_bet * 1.25;
			else if (matches == 3)
				money += current_bet * 0.25;
			break;
		case 7:
			if(matches == 7)
				money += current_bet * 625;
			else if(matches == 6)
				money += current_bet * 25;
			else if(matches == 5)
				money += current_bet * 3.75;
			else if(matches == 4)
				money += current_bet * 0.75;
			else if (matches == 3)
				money += current_bet * 0.25;
			break;
		case 8:
			if(matches == 8)
				money += current_bet * 2500;
			else if(matches == 7)
				money += current_bet * 125;
			else if(matches == 6)
				money += current_bet * 12.5;
			else if(matches == 5)
				money += current_bet * 2.5;
			else if (matches == 4)
				money += current_bet * 0.5;
			break;
		case 9:
			if(matches == 9)
				money += current_bet * 6250;
			else if(matches == 8)
				money += current_bet * 625;
			else if(matches == 7)
				money += current_bet * 25;
			else if(matches == 6)
				money += current_bet * 5;
			else if (matches == 5)
				money += current_bet * 1.25;
			else if (matches == 0)
				money += current_bet * 0.5;
			break;
		case 10:
			if(matches == 10)
				money += current_bet * 25000;
			else if(matches == 9)
				money += current_bet * 1000;
			else if(matches == 8)
				money += current_bet * 100;
			else if(matches == 7)
				money += current_bet * 12.5;
			else if(matches == 6)
				money += current_bet * 2.5;
			else if (matches == 5)
				money += current_bet * 0.5;
			else if (matches == 0)
				money += current_bet * 1;
			break;
		default:
			break;
	}
	money_post_bet = money;
}