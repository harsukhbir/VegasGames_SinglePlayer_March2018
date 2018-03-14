var MusicManager = {
    loaded: false,
    music_paused: false,
    sound_enabled: true,
    music_current: -1,
    music_playing: true,
    music_start_time: 0,
    music: [],
    normal_volume: 1,
    bingo_volume: 0.2,
    volume: 1,


    play_music: function(){
        if(!MusicManager.loaded){
            
            return;
        }
        if(!sound_enabled || MusicManager.music_current == -1)
            return;
        var date = new Date();
        MusicManager.music_start_time = date.getTime();
        MusicManager.music_current = Math.floor(Math.random() * (MusicManager.music.length - 1));
        MusicManager.music[MusicManager.music_current].currentTime = 0;
        MusicManager.music[MusicManager.music_current].play();

    },
    
    pause: function(){
        if(!MusicManager.loaded || !sound_enabled || MusicManager.music_current == -1){
            return;
        }
        MusicManager.music[MusicManager.music_current].pause();
        MusicManager.music_paused = true;
    },
    
    unpause: function(){
        MusicManager.music_paused = false;
        MusicManager.music[MusicManager.music_current].play();
    },

    music_init: function(){
        if(this.music.length > 0 && this.music_current != -1){
            this.music[this.music_current].pause();
        }
        this.music = [];
        this.music_playing = true;
        this.loaded = false;
        this.music_current = 0;
        this.music_paused = false;
        this.volume = this.normal_volume;
        this.music_start_time = 0;
        if(GameManager.Current_Game == "Lobby"){
            this.music.push(new Audio('sound/music/Fun.mp3'));
            this.music[0].onloadeddata = function(){MusicManager.loaded = true;};
            this.music[0].addEventListener("load", function(){console.log("Loaded?");});
        } else if(GameManager.Current_Game == "VP" || GameManager.Current_Game == "JB" || GameManager.Current_Game == "JW"){    
            this.music.push(new Audio('sound/music/OrangeWorld(loop).mp3'));
            this.music[0].onloadeddata = function(){MusicManager.loaded = true;};
        } else if(GameManager.Current_Game == "Bingo"){
            this.music.push(new Audio('sound/music/PlayfulMarimbaTheme.mp3'));
            this.music[0].onloadeddata = function(){MusicManager.loaded = true;};
            this.normal_volume = this.volume;
            if(this.volume != 0)
                this.volume = this.bingo_volume;
        } else if(GameManager.Current_Game == "Keno"){
            this.music.push(new Audio('sound/music/PlayfulMarimbaTheme.mp3'));
            this.music[0].onloadeddata = function(){MusicManager.loaded = true;};
        } else if(GameManager.Current_Game == "MoneyWheel" || GameManager.Current_Game.toLowerCase() == "roulette"){
            this.music.push(new Audio('sound/music/PlayfulMarimbaTheme.mp3'));
            this.music[0].onloadeddata = function(){MusicManager.loaded = true;};
        } else {
            console.log("No Music Loaded");
        }
        
        
        this.play_music();
    },

    setVolume: function(new_volume){
        this.volume = new_volume;
    },
    
    music_update: function(){
        if(!MusicManager.loaded)
            return;
        if(this.music.length <= this.music_current){
            if(this.music.length == 0){
                this.music_paused = true;
                return;
            } else {
                this.music_current = 0;
            }
        } else if(!sound_enabled){
            if(!this.music_paused){
                this.music[this.music_current].pause();
                this.music_paused = true;
            }
            return;
        } else {
            this.music_paused = false;
        }
        this.music[this.music_current].volume = this.volume;
        
        var date = new Date();
        if(date.getTime() - this.music_start_time > 1000 * this.music[this.music_current].duration || this.music_start_time == 0){
            this.volume = 1;
            this.play_music();
        }
    }
}
