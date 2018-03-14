
var audio_dir = 'sound/keno/';
function load_keno_sounds(){
    
    keno_number_sounds = [];
    var mod = 'numbers/';
    for(var i = 1; i < 21; i++){
        keno_number_sounds.push(new Audio(audio_dir + mod + i + '.wav'));
    }
    keno_number_sounds.push(new Audio(audio_dir + mod + '30.wav'));
    keno_number_sounds.push(new Audio(audio_dir + mod + '40.wav'));
    keno_number_sounds.push(new Audio(audio_dir + mod + '50.wav'));
    keno_number_sounds.push(new Audio(audio_dir + mod + '60.wav'));
    keno_number_sounds.push(new Audio(audio_dir + mod + '70.wav'));
    keno_number_sounds.push(new Audio(audio_dir + mod + '80.wav'));
}

var KenoAudioManager = {
    click_sounds: [new Audio(audio_dir + 'chip2chip.wav'), new Audio(audio_dir + 'chip2table.wav')],
    
    on_click: function(){
        this.play(this.click_sounds[Math.floor(Math.random() * this.click_sounds.length)]);
    },
    
    play_number: function(number){
        var index = number - 1;
        var extra = undefined;
        var sound = null;
        var val = index;
        if(number < 20){
            sound = keno_number_sounds[index];
            val = 100;
        } else if(number < 30){
            sound = keno_number_sounds[19];
            val = 20;
        } else if(number < 40){
            sound = keno_number_sounds[20];
            val = 30;
        } else if(number < 50){
            sound = keno_number_sounds[21];
            val = 40;
        } else if(number < 60){
            sound = keno_number_sounds[22];
            val = 50;
        } else if(number < 70){
            sound = keno_number_sounds[23];
            val = 60;
        } else if(number < 80){
            sound = keno_number_sounds[24];
            val = 70;
        } else if(number == 80){
            sound = keno_number_sounds[25];
            val = 100;
        }
        
        this.play(sound);
        if(index - val >= 0){
            extra = keno_number_sounds[index - val];
        }
        if(extra != undefined){
            console.log("Adding Timer");
            var tm = new_timer(sound.duration * 100, false);
            tm.audio = extra;
            tm.result = function(){
                console.log("Timer Fired");
                KenoAudioManager.play(this.audio);
            }
            Timers.push(tm);
        } else {
            console.log("no Extra needed");
        }
    },
    
    play: function(sound){
        if(!sound_enabled)
            return;
        sound.play();
    },
    
};



var keno_number_sounds;