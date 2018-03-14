function load_credentials(){
    var g = window.localStorage.getItem("guest_time");
    if(g == null){
        last_guest = 0;
    } else{
        last_guest = parseInt(g);
    }
    
    
    var name = window.localStorage.getItem("user_name");
    var p = window.localStorage.getItem("password");
    
    var f = window.localStorage.getItem("isFacebook");
    if(f != null){
        if(f == "true"){
            isFacebook = true;
            var inf = window.localStorage.getItem("fb_info");
            if(inf != null){
                facebook_info = JSON.parse(inf);
                p = fb_pwd();
            }
        }
    }
    //console.log(name, p);
    if(name != null && p != null && name != "" && p != ""){
        lobby_prompt = false;
        if(isFacebook){
            Timers.push(new_timer(10, fb_initialize));
            //fb_initialize();
        } else{
            login_fields[0].text = name;
            uname = name;
            u = uname;
            login_fields[1].text = p;
            active_timer = 11;
        }
        return true;
    } else {
        lobby_prompt = true;
        lobby_initial_scroll = true;
        while(simulate_swipe(0.005)){
            
        }
    }
    return false;
}

function save_credentials(arg1, arg2){
    window.localStorage.setItem("user_name", arg1);
    window.localStorage.setItem("password", arg2);
    window.localStorage.setItem("isFacebook", isFacebook);
}

function save_storage(){
    localStorage.setItem("mny", money);
    if(sound_enabled){
        localStorage.setItem("sound_enabled", 1);
    } else{
        localStorage.setItem("sound_enabled", 0);
    }
    
    if(GameManager.Current_Game != "Bingo"){
        localStorage.setItem("volume", MusicManager.volume);
    }
    localStorage.setItem("language", language_selected);
}

function load_storage(){
    // Sound
    var s = window.localStorage.getItem("sound_enabled");
    //console.log(s);
    if(s != null){
        if(s == '0'){
            sound_enabled = false;
        } else {
            sound_enabled = true;
        }
    } else {
        sound_enabled = true;
    }
    
    var v = localStorage.getItem("volume");
    if(v != null){
        MusicManager.volume = parseInt(v);
        MusicManager.normal_volume = MusicManager.volume;
    }
    
    
    var p = localStorage.getItem("FirstLogin");
    if(p != null){
        if(p == "1"){
            lobby_prompt = true;
        } else {
            lobby_prompt = false;
        }
    }
    
    // Languages
    var l = window.localStorage.getItem("language");
    if(l != null){
        language_selected = parseInt(l);
        if(GameManager.Current_Game == "Lobby"){
            switch_language(language_selected, 0);
        } else if(GameManager.Current_Game == "VP" || GameManager.Current_Game == "JB"){
            switch_language(language_selected, 1);
        } else if(GameManager.Current_Game == "JW"){
            switch_language(language_selected, 2);
        } else if(GameManager.Current_Game == "Bingo"){
            switch_language(language_selected, 3);
        } else if(GameManager.Current_Game == "Keno"){
            switch_language(language_selected, 4);
        } else if(GameManager.Current_Game == "MoneyWheel"){
            switch_language(language_selected, 5);
        } else if(GameManager.Current_Game == "Roulette"){
            switch_language(language_selected, 6);
        }
    }
}