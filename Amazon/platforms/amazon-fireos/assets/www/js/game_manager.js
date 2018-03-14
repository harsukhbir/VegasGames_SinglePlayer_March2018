var GameManager = {
    frame_counter: 0,
    last_second: 0,
    Current_Game: "",
    Current_Begin: 0,
    isFirstFrame: true,
    target_frame_rate: 60,
    frame_rate: 0,
    buffer_index: 0,
    double_buffer: true,
    Last_Update: 0,
    Can_Save: true,
    Storage_Update: 0, // NOTE: This computed using frames, not millis
    
    Loop: function(){
        var now = new Date().getTime();
        if(now - GameManager.Last_Update < 1000 / GameManager.target_frame_rate){
            //console.log("Too Fast!");
            return;
        }

        GameManager.frame_counter++;
        if(now - GameManager.last_second > 1000){
            GameManager.frame_rate = GameManager.frame_counter;
            //console.log(GameManager.frame_rate);
            GameManager.frame_counter = 0;
            GameManager.last_second = now;
        }
        GameManager.Last_Update = now;

        
        if(loading){
            if(this.isFirstFrame){
                console.log(now - load_start);
                load_begin(load_times.index);
            }
            draw_load();
        } else {
            GameManager.Graphics();
        }
        //console.log(MusicManager);
        MusicManager.music_update();
        GameManager.Storage_Update++;
        if(GameManager.Storage_Update > 60 * 30 && this.Can_Save){
            GameManager.Storage_Update = 0;
            save_storage();
            resize_game_canvas();
        }
    },
    
    Graphics: function(){
        if(GameManager.double_buffer){
            $(canvas).hide();
            canvas = buffers[GameManager.buffer_index % buffers.length];
            $(canvas).show();
            context = canvas.getContext("2d");
        }
        GameManager.GameGraphics();
    },

    // Needs to be set by each game initializer function
    GameGraphics: function(){},
    CleanUp: function(){},
    
    
    load: function(){
        this.CleanUp();
        resize_extra = blank;
        save_storage();
        check_has_been_30_mins();
        this.Storage_Update = 0;
        MusicManager.music_init();
        this.Current_Begin = new Date().getTime();
    },
    
    openLoadScreen: function(){
        this.load();
        this.Current_Game = "Load";
    },
    
    openLobby: function(){
        this.Current_Game = "Lobby";
        this.load();
        load_begin(load_times.index);
        define_lobby_globals();
        init();
        resize_extra = auto_center;
        GameManager.GameGraphics = draw_lobby_main;
        this.CleanUp = function(){
            canvas.removeEventListener('click', click_handler);
            canvas.removeEventListener('mouseup', mouse_up_handler);
            canvas.removeEventListener('mousemove', mouse_handler);
            document.removeEventListener('touchstart', touchStart, false);
            document.removeEventListener('touchmove', touchMove, false);
        }
    },
    
    openVP: function(){
        this.Current_Game = "VP";
        this.load();
        load_begin(load_times.vp);
        init_vp_vars();
        vp_init();
        cash = money;
        GameManager.GameGraphics = vp_draw;
        this.CleanUp = function(){
            canvas.removeEventListener('click', vp_click_handler);
            money = cash;
        }
    },
    
    openJB: function(){
        this.Current_Game = "JB";
        this.load();
        load_begin(load_times.vp);
        init_jb_vars();
        init_jb();
        cash = money;
        GameManager.GameGraphics = vp_draw;
        this.CleanUp = function(){
            canvas.removeEventListener('click', vp_click_handler);
            money = cash;
        }
    },
    
    openJW: function(){
        this.Current_Game = "JW";
        this.load();
        load_begin(load_times.vp);
        jw_init_vars();
        init_jw();
        cash = money;
        GameManager.GameGraphics = jw_draw;
        this.CleanUp = function(){
            canvas.removeEventListener('click', vp_click_handler);
            money = cash;
        }
    },
    
    openBingo: function(){
        this.Current_Game = "Bingo";
        this.load();
        load_begin(load_times.bingo);
        init_bingo_vars();
        init_bingo();
        GameManager.GameGraphics = draw_bingo_graphics;
        this.CleanUp = function(){
            clearInterval(timer_loop);
            canvas.removeEventListener('click', bingo_click_handler);
            canvas.removeEventListener('mousedown', bingo_mouse_down_handler);
            canvas.removeEventListener('mouseup', bingo_mouse_up_handler);
            canvas.removeEventListener('mousemove', bingo_mouse_handler);
        }
    },
    
    openMoneyWheel: function(){
        this.Current_Game = "MoneyWheel";
        this.load();
        load_begin(load_times.bingo);
        bet = 0;
        MoneyWheel.init();
        switch_language(language_selected, 5);
        GameManager.GameGraphics = MoneyWheel.draw;
        this.CleanUp = MoneyWheel.cleanUp;
    },
    
    openRoulette: function(){
        this.Current_Game = "Roulette";
        this.load();
        load_begin(load_times.bingo);
        bet = 0;
        Roulette.init();
        switch_language(language_selected, 6);
        GameManager.GameGraphics = Roulette.draw;
        this.CleanUp = Roulette.cleanUp;
    },
    
    // This currently is not used, in the future I would like to merge keno more thoroughly
    openKeno: function(){
        this.Current_Game = "Keno";
        this.load();
        bingo_load_win_images();
        switch_language(language_selected, 4);
        MusicManager.music_init();
        //MusicManager.pause();
        load_keno();
    },
}

function GGraph(){
    
}
function onRefresh(event){
    save_storage();
    return 'Are you Sure?';
}

var draw_loop;
var canvas, context;
var buffers = [];

// Entry point for entire app
function game_begin(){
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    
    buffers = [canvas, document.getElementById('buffer')];
    
    window.onbeforeunload = onRefresh;
    //$(window).unload(function(){alert("Hello World");});
    //$(window).bind("unload", function(){alert("test");});
    
    load_storage();

    GameManager.Current_Game = "Lobby";
    GameManager.openLobby();
    //console.log("Loading");
    if(load_credentials()){
        //console.log("Submitting");
        submit_login();
    }
    draw_loop = setInterval(GameManager.Loop, 1);

    // alert("0");
    // // var androidKey = "465b1a0d";
    // // var iosKey = "3efd0b09";
    // // alert(androidKey);
    // alert(Date.now());
}



function stop_game(){
    clearInterval(draw_loop);
}

