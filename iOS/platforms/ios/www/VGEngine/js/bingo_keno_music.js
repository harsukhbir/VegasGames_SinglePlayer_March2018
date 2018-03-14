function play_music(){
    if(!sound_enabled)
        return;
    var date = new Date();
    music_start_time = date.getTime();
    music_current = Math.floor(Math.random() * (music.length - 1));
    music[music_current].play();

}

function music_init(){
    var s = window.localStorage.getItem("sound_enabled");
    if(s != null){
        if(s == '0'){
            sound_enabled = false;
        }
    } else {
        window.localStorage.setItem("sound_enabled", 1);
    }
    music = [];
    music_current = 0;
    music_playing = true;
    music.push(new Audio('../sound/music/PlayfulMarimbaTheme.mp3'));
    play_music();
}

function music_update(){
    if(!sound_enabled){
        if(!music_paused){
            music[music_current].pause();
            music_paused = true;
        }
        return;
    } else {
        music_paused = false;
    }
    
    var date = new Date();
    if(date.getTime() - music_start_time > 1000 * music[music_current].duration){
        play_music();
    }
}

var sound_enabled = false;
var music_paused = false;
var music_current;
var music_playing, music_start_time;
var music = [];