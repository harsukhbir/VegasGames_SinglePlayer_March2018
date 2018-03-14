function focus_init(){

    window.onblur = onblur;
    window.onfocus = onfocus;
    window.visibilitychange = change_visible;
    document.addEventListener("visibilitychange", function(){
        if(document.visibilityState == "visible"){
            onfocus()
        } else if(document.visibilityState == "hidden"){
            onblur();
        }
    });
}

function load_images(){
    if(loading_images)
        return;
    if(GameManager.Current_Game == "Lobby"){
        lobby_load_images();
    } else if(GameManager.Current_Game == "VP"){
        vp_load_images();
    } else if(GameManager.Current_Game == "JB"){
        jb_load_images();
    } else if(GameManager.Current_Game == "JW"){
        jw_load_images();
    } else if(GameManager.Current_Game == "Bingo"){
        bingo_load_images();
    } else if(GameManager.Current_Game == "Keno"){
        //keno_load_images();
    }
}

function auto_size_imgs(){
    var size = canvas_width / 1920;
    var does_scale = true;
    if(size < 0.47 && does_scale){
        img_mod = "42/";
        load_images();
        //console.log("42%");
    } else if(size < 0.59 && does_scale){
        img_mod = "50/";
        load_images();
        //console.log("50%");
    } else if(size < 0.75 && does_scale){
        img_mod = "66/";
        load_images();
        //console.log("66%");
    } else{
        img_mod = "";
        load_images();
        //console.log("100%");
    }   
}




function onblur(){
    //console.log("Bluring");
    sound_enabled = false;
    GameManager.Can_Save = false;
}
function onfocus(){
    //console.log("Focusing");
    GameManager.Can_Save = true;
    var se = window.localStorage.getItem("sound_enabled");
    if(se != null){
        if(se == '0'){
            sound_enabled = false;
        } else {
            sound_enabled = true;
        }
    } else {
        sound_enabled = true;
    }
    
    if(sound_enabled){
        MusicManager.play_music();
    }
}

function blank(){

    

}

var resize_extra = blank;

function resize_game_canvas(){

    var max_width = window.innerWidth * 0.98;
    var max_height = window.innerHeight * 0.98;
   // alert("0");
    canvas.width = max_width;

	canvas.height = canvas.width * 9/16;
   // alert("1-canvas");
    // while(canvas_height > max_height || canvas.width > max_width){
    //     canvas.width--;
    //     canvas.height = canvas_width * 9/16;
    // }

     while(canvas_height >= window.innerHeight * 0.98 || canvas_width >= window.innerWidth * 0.98){
        canvas_width--;
        canvas_height = canvas_width * 9/16;
    }

    
   // alert("2");
	font_size = Math.floor(canvas.width / 40);
   // alert("3");
	context.font = font_size + font;
   // alert("4");
    auto_size_imgs();	
   // alert("5");
    canvas_width = canvas.width;
    canvas_height = canvas.height;
    for(var i = 0; i < buffers.length; i++){
        buffers[i].width = canvas_width;
        buffers[i].height = canvas_height;
    }
   // alert("6");
    resize_extra();
   // alert("7");
}

function auto_size_text(text, width, height){
	font_size = 1;
	context.font = font_size + font;
	while(context.measureText("W").width <= height && context.measureText(text).width < width){
		font_size++;
		context.font = font_size + font;
	}
    return font_size;
}
// var lobby_prompt;
function return_to_lobby(){
    // alert("Back");
    console.log("Returning to lobby");
    GameManager.openLobby();  //  leo working on this function
    // alert(lobby_prompt);

    
    
    load_begin(load_times.lobby_return);

    get_stats();
    
    lobby_prompt = false;
    lobby_initial_scroll = false;
    mode = 100;
    if(!load_credentials()){
        login_fields[0].text ="Guest";
    }
}

function check_has_been_30_mins(){
    var lst = window.localStorage.getItem("last_login" + uname);
    if(lst == null)
        return;
    lst = JSON.parse(lst);
    if(new Date().getTime() - lst.time > 30 * 60 * 1000){
        wheel_init(function(){});
    }
}

function check_daily_login(){
    var valid = true;
    var lst = window.localStorage.getItem("last_login" + uname);
    var d = new Date();
    if(lst != null){
        var dt = JSON.parse(lst);
        console.log(dt);
        if(d.getFullYear() == dt.year && d.getMonth() == dt.month && d.getDate() == dt.day && dt.name == uname){
            valid = false;
        }
        
    }
    var dt = {
        name: uname,
        time: d.getTime(),
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear()
    };
    

    window.localStorage.setItem("last_login" + uname, JSON.stringify(dt));
    if(valid){
        wheel_init(function(){});
    }
    return valid;
    
}

var canvas_width, canvas_height;