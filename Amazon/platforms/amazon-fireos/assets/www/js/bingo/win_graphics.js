/*
 To whomever has time to read this,
    This file is extremely messy and sloppy because it has been written during the hour before the release meeting.
    This is beacuse I only received the final assets at this time and was therefore unable to implement this prior to now.
 
 P.S. This SHOULD be implemented in an O.O. fashion but time......
*/

function bingo_load_win_images(){
    console.log("Loading Win Images");
    
    // window.plugins.appsFlyer.trackEvent(Bingo_Complete_Level, Bingo_Complete_Level_No);

    var dir = "vp_win/";
    vp_exp_bar_back = new Image();
    vp_exp_bar_back.src = img_dir + dir + "exp_bar_back.png";
    
    vp_exp_bar_front = new Image();
    vp_exp_bar_front.src = img_dir + dir + "exp_bar_front.png";
    
    vp_exp_bar_wheel = new Image();
    vp_exp_bar_wheel.src = img_dir + dir + "exp_bar_wheel.png";
    
    vp_win_star = new Image();
    vp_win_star.src = img_dir + dir + "vp_win_star.png";
    
    vp_win_star_back = new Image();
    vp_win_star_back.src = img_dir + dir + "vp_win_star_back.png";
    
    vp_lose_star = new Image();
    vp_lose_star.src = img_dir + dir + "vp_lose_star.png";
    vp_win_black = new Image();
    vp_win_black.src = img_dir + dir + "vp_win_black.png";
    
    bingo_win_balls = new Image();
    bingo_win_balls.src = img_dir + dir + "bingo_win_balls.png";
    
    win_screen_bingo = new Image();
    win_screen_bingo.src = img_dir + dir + "win_screen_bingo.png";
    
    if(GameManager.Current_Game != "Bingo"){
        win_button_back = new Image();
        win_button_back.src = img_dir + img_mod + "bingo/" + "win_button_back.png";
    }
}



function bingo_win_init(){
    var Bingo_Not_Complete_Level = "Bingo & Keno - Level Not Complete";
      var Bingo_Not_Complete_Level_No = {
        "Bingo & Keno Level Not Complete_No": "1"
      };
    window.plugins.appsFlyer.trackEvent(Bingo_Not_Complete_Level, Bingo_Not_Complete_Level_No);

    console.log("Win Init!");
    if(!win_screen_init){
        bingo_load_win_images();
        win_screen_init = true;
    }

    bingo_win_state = 0;
    last_winning = last_win;
    hand_type = "";
    vp_reset_win_graphics();
    
    exp_bar = {
        accel: 0.0001,
        velocity: 0,
        max_velocity: 0.01,
        start: 1.3,
        heighest: 0.57,
        stop_point: 0.65,
        state: 0,
        angle: 0,
        angular: 0.01 * Math.PI,
        bounce: false,
        transform: [0.24, 1.3, 0.52, 0.09],
        move: function(){
            // Handling Acceleration
            if(this.velocity < this.max_velocity){
                this.velocity += this.accel;
                if(this.velocity > this.max_velocity){
                    this.velocity = this.max_velocity;
                }
            }
            // Transforming
            if(!this.bounce){
                this.transform[1] -= this.velocity;
                if(this.transform[1] < this.heighest){
                    this.transform[1] = this.heighest;
                    this.bounce = true;
                    this.velocity = 0;
                }
            } else {
                this.transform[1] += this.velocity;
                if(this.transform[1] > this.stop_point){
                    this.transform[1] = this.stop_point;
                    //console.log("JS Can Math", this.stop_point, this.transform[1]);
                }
            }
            
        },
        update: function(){
            this.angle += this.angular;
        }
    };
}

function bingo_draw_win_graphics(){
    if(bingo_win_state < 400){
        vp_draw_win_graphics();
        var transform = scale_transform([0.24, 0, 0.49, 0.425]);
        transform[1] = win_top - canvas_height * 0.03;
        context.drawImage(bingo_win_balls, transform[0], transform[1], transform[2], transform[3]);
        bingo_win_state++;
    } else {
        context.globalAlpha = 0.76;
        context.drawImage(vp_win_black, canvas_width * 0.18, canvas_height * 0.0, canvas_width * 0.65, canvas_height * 1.3);
        context.globalAlpha = 1;
        
        context.drawImage(white_logo, canvas_width * 0.44, canvas_height * 0.295, canvas_width * 0.2, canvas_height * 0.1);
        
        if(GameManager.Current_Game == "Bingo")
            context.drawImage(win_screen_bingo, canvas_width * 0.37, canvas_height * 0.485, canvas_width * 0.332, canvas_height * 0.3);
        
        context.drawImage(money_background, canvas_width * 0.415, canvas_height * 0.43, canvas_width * 0.245, canvas_height * 0.083);
        auto_size_text("$99,000,000", canvas_width * 0.16, canvas_height);
        draw_fancy_text("$" + money, canvas_width * 0.425, canvas_height * 0.485);
        
        var top = canvas_height * 0.57;
        var height = canvas_height * 0.08;
        var width = canvas_width * 0.20;
        
        context.drawImage(win_button_back, canvas_width * 0.325, top, width, height);
        context.drawImage(win_button_back, canvas_width * 0.55, top, width, height);
        draw_fancy_text(win_screen_words[2], canvas_width * 0.33 + width / 2 - (context.measureText(win_screen_words[2]).width * 0.5), top + height * 0.75);
        draw_fancy_text(win_screen_words[3], canvas_width * 0.565 + width / 2 - (context.measureText(win_screen_words[3]).width * 0.65), top + height * 0.75);
        

    }
}


function bingo_check_win_screen(x,y){
    if(x >= canvas_width * 0.415 && x <= canvas_width * 0.66){
        if(y >= canvas_height * 0.43 && y <= canvas_height * 0.513){
            open_store();
            return true;
        }
    }
    var top = canvas_height * 0.57;
    var height = canvas_height * 0.08;
    var width = canvas_width * 0.20;
    if(y >= top && y <= top + height){
        if(x >= canvas_width * 0.325 && x <= canvas_width * 0.325 + width){
            if(GameManager.Current_Game == "Bingo")
                init_bingo();
            else if(GameManager.Current_Game == "Keno")
                new_game_btn_click();

            return true;
        } else if(x >= canvas_width * 0.55 && x <= canvas_width * 0.55 + width){
            if(GameManager.Current_Game == "Bingo"){
                init_bingo();
                // alert("Replay Btn clicked");
                // console.log("Replay Btn clicked");
                desired_cards = desired_cards_last;
                bingo_start_game(desired_cards);
                //bingo_get_numbers();
            
            } else if(GameManager.Current_Game == "Keno")
                replay_btn_click();
            return true;
        }
    }
    return false;
}