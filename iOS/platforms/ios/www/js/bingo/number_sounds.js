function bingo_load_number_sounds(){
    b_sounds = [];
    i_sounds = [];
    n_sounds = [];
    g_sounds = [];
    o_sounds = [];
    
    
    b_sounds.push(new Audio('sound/Bingo/numbers/B-01.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-02.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-03.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-04.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-05.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-06.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-07.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-08.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-09.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-10.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-11.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-12.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-13.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-14.wav'));
    b_sounds.push(new Audio('sound/Bingo/numbers/B-15.wav'));
    
    i_sounds.push(new Audio('sound/Bingo/numbers/I-16.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-17.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-18.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-19.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-20.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-21.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-22.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-23.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-24.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-25.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-26.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-27.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-28.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-29.wav'));
    i_sounds.push(new Audio('sound/Bingo/numbers/I-30.wav'));
    
    n_sounds.push(new Audio('sound/Bingo/numbers/N-31.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-32.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-33.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-34.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-35.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-36.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-37.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-38.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-39.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-40.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-41.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-42.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-43.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-44.wav'));
    n_sounds.push(new Audio('sound/Bingo/numbers/N-45.wav'));
    
    g_sounds.push(new Audio('sound/Bingo/numbers/G-46.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-47.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-48.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-49.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-50.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-51.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-52.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-53.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-54.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-55.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-56.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-57.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-58.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-59.wav'));
    g_sounds.push(new Audio('sound/Bingo/numbers/G-60.wav'));
    
    o_sounds.push(new Audio('sound/Bingo/numbers/O-61.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-62.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-63.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-64.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-65.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-66.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-67.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-68.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-69.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-70.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-71.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-72.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-73.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-74.wav'));
    o_sounds.push(new Audio('sound/Bingo/numbers/O-75.wav'));
}

function bingo_play_number_sound(number){
    if(!sound_enabled || display_index < 0)
        return;
    number -= 1;
    if(number < 15){
        b_sounds[number].play();
    } else if(number < 30){
        i_sounds[number-15].play();
    } else if(number < 45){
        n_sounds[number-30].play();
    } else if(number < 60){
        g_sounds[number-45].play();
    } else if(number < 75){
        o_sounds[number-60].play();
    }
}
