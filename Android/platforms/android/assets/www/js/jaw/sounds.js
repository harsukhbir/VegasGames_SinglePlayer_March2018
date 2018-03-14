function jw_sound_init(){
    
    bad_click_sounds = [];
    bad_click_sounds.push(new Audio('sound/Video_Poker/Bad_Click/BADCLICK.WAV'));
    bad_click_sounds.push(new Audio('sound/Video_Poker/Bad_Click/noway.wav'));
    
    deal_sounds = [];
    deal_sounds.push(new Audio('sound/Video_Poker/play.wav'));
    
    shuffle_sounds = [];
    shuffle_sounds.push(new Audio('sound/Video_Poker/Shuffle/SHUFFLE.WAV'));
    shuffle_sounds.push(new Audio('sound/Video_Poker/Shuffle/shuffle01.wav'));
    
    select_sounds = [];
    select_sounds.push(new Audio('sound/Video_Poker/Click_Select/card.wav'));
    select_sounds.push(new Audio('sound/Video_Poker/Click_Select/card01.wav'));
    select_sounds.push(new Audio('sound/Video_Poker/Click_Select/carddealer.wav'));
    select_sounds.push(new Audio('sound/Video_Poker/Click_Select/click2.wav'));
    select_sounds.push(new Audio('sound/Video_Poker/Click_Select/CLICK.WAV'));
    
    unpick_sounds = [];
    unpick_sounds.push(new Audio('sound/Video_Poker/Unpick/press.wav'));
    unpick_sounds.push(new Audio('sound/Video_Poker/Unpick/UNPICK.wav'));
    
    lose_sounds = [];
    lose_sounds.push(new Audio('sound/Video_Poker/Lose/dealerbj.wav'));
    lose_sounds.push(new Audio('sound/Video_Poker/Lose/playerlost_whistle_dado.wav'));
    lose_sounds.push(new Audio('sound/Video_Poker/Lose/Slose.wav'));
    lose_sounds.push(new Audio('sound/Video_Poker/Lose/sorry.wav'));
    
    win_sounds = [];
    win_sounds.push(new Audio('sound/Video_Poker/Win/cash_register1b.wav'));
    win_sounds.push(new Audio('sound/Video_Poker/Win/lucky.wav'));
    win_sounds.push(new Audio('sound/Video_Poker/Win/playerbj_harp.wav'));
    win_sounds.push(new Audio('sound/Video_Poker/Win/thewinner.wav'));
    win_sounds.push(new Audio('sound/Video_Poker/Win/win.wav'));
    win_sounds.push(new Audio('sound/Video_Poker/Win/winner.wav'));
    win_sounds.push(new Audio('sound/Video_Poker/Win/winninghand.wav'));
    
    announcement_sounds = [];
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/royalflush.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/5s.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/royalflush.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/4ofakind.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/straightflush.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/fullhouse.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/flush.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/straight.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/3ofakind.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/2pair.wav'));
    announcement_sounds.push(new Audio('sound/Video_Poker/Voice_Win_Announcment/kings.wav'));
    
    bet_sounds = [];
    bet_sounds.push(new Audio('sound/All_Sounds/Chip/coin01.wav'));
    bet_sounds.push(new Audio('sound/All_Sounds/Chip/coin02.wav'));
    bet_sounds.push(new Audio('sound/All_Sounds/Chip/coinIn01.wav'));
    
    outofcash = new Audio('sound/All_Sounds/Miscellaneous/youroutofcash.wav');
    joker_sound = new Audio('sound/Video_Poker/Lose/JokerLaugh.wav');
}

