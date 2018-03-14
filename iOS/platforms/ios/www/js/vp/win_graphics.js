function draw_win_text(text, left, top){
    var fnt = context.font;
    var f = "px Dimbo-Regular";
    context.font = font_size + f;
    
    context.fillStyle = "#ffffff";
    context.fillText(text, left, top);
    
    //context.font = (font_size - 1) + f;
    var w = context.measureText("T").width;
    context.strokeStyle ="#000000";
    context.miterLimit=2;
    context.lineWidth = 1;
    context.strokeText(text, left, top);
    context.lineWidth = 1;
      
    context.font = fnt;
}

function vp_draw_win_graphics(){
    var should_draw_exp = false;
    if(win_fall_rate < win_terminal){
        win_fall_rate += win_accel;
    }
    
    if(!win_bounce){
        win_top += win_fall_rate;
        if(win_top >= win_lowest){
            win_bounce = true;
            win_top = win_lowest;
            win_fall_rate = 1;
        }
    } else{
        win_top -= win_fall_rate;
        if(win_top <= win_stop){
            win_top = win_stop;
            should_draw_exp = true;
        }
    }
    
    
    //var win_width = canvas_width * 0.8;
    //var win_left = canvas_width * 0.1;
    //context.drawImage(win_bar, win_left, win_top, win_width, win_height);
    //context.fillText(hand_type + "     " + last_winning, win_left + win_width * 0.2, win_top + win_height * 0.6);
    
    var w = vp_win_star_back.width / vp_win_star.width;
    var h = vp_win_star_back.height / vp_win_star.height;

    
    //var star_transform = [0.38, 0.22, 0.265, 0.30];
    var star_transform = [0.38, 0.22, 0.265, 0.30];
    star_transform = scale_transform(star_transform);
    star_transform[1] = win_top;
    
    var bck_trans = star_transform.slice();
    bck_trans[2] *= w;
    bck_trans[3] *= h;
    bck_trans[0] -= (bck_trans[2] - star_transform[2]) / 2;
    bck_trans[1] -= (bck_trans[3] - star_transform[3]) / 2;
    
    
    // The black background stuff should be drawn here
    context.globalAlpha = 0.8;
    context.drawImage(vp_win_black, canvas_width * 0.18, canvas_height * 0.12, canvas_width * 0.65, canvas_height * 0.76);
    context.globalAlpha = 1;
    
    // Win display
    if(last_winning != 0 && (GameManager.Current_Game.toLowerCase() != 'roulette' || last_win != 0)){
        // Handling alpha pulse star back
        var alphaRate = 500;
        var a = vp_win_state / alphaRate + 0.4;
        
        if(a > 1)
            a = 1;
        context.globalAlpha = a;
        context.drawImage(vp_win_star_back, bck_trans[0], bck_trans[1], bck_trans[2], bck_trans[3]);
        context.globalAlpha = 1;
        vp_win_state++;
        if(vp_win_state > alphaRate){
            vp_win_state = 0;
        }
        
        context.drawImage(vp_win_star, star_transform[0], star_transform[1], star_transform[2], star_transform[3]);
    
    
        
        var txt = win_screen_words[1];
        auto_size_text(txt, star_transform[2] * 0.5, win_height);
        draw_win_text(txt,
                star_transform[0] + star_transform[2] * 0.5 - context.measureText(txt).width * 0.3,
                star_transform[1] + star_transform[3] * 0.4
                );
        var win_txt = "$" + last_winning;
        if(GameManager.Current_Game.toLowerCase() == 'roulette')
            win_txt = last_winning;
        auto_size_text("$100000", star_transform[2], star_transform[3]);
        draw_win_text(win_txt,
                star_transform[0] + star_transform[2] * 0.5 - context.measureText("$" + last_winning).width / 2,
                star_transform[1] + star_transform[3] * 0.8
                );
        auto_size_text("Royal Flush", canvas_width * 0.3, canvas_height);
        draw_fancy_text(hand_type, canvas_width * 0.5 - context.measureText(hand_type).width / 2, star_transform[1] + star_transform[3] * 1.3);
        
    // Lose Display
    } else {
        context.drawImage(vp_lose_star, star_transform[0], star_transform[1], star_transform[2], star_transform[3]);
        auto_size_text(win_screen_words[1], star_transform[2], star_transform[3]);
        var txt = win_screen_words[0];
        draw_win_text(txt,
                star_transform[0] + star_transform[2] * 0.5 - context.measureText(txt).width * 0.35,
                star_transform[1] + star_transform[3] * 0.65
                );
        auto_size_text(win_screen_words[1], star_transform[2], star_transform[3] * 0.1);
        txt = vp_lose_phrase;
        draw_win_text(txt,
                star_transform[0] + star_transform[2] * 0.5 - context.measureText(txt).width * 0.35,
                star_transform[1] + star_transform[3] * 0.78
                );
        
    }

    
    if(should_draw_exp){
        vp_draw_expbar();
    }
        

}

function vp_reset_win_graphics(){
    // Win Vars
    win_height = canvas_height * 0.2;
    win_top = -win_height;
    win_lowest = canvas_height * 0.25;
    win_stop = canvas_height * 0.22;
    win_bounce = false;
    
    
    var phrases = [
        "I THINK IT's TIME TO QUIT...",
        "YOU'RE GETTING BETTER... NOT",
        "LETS TRY AGAIN... THIS TIME THINK!",
        "YOUR MOTHER MUST BE PROUD",
        "USE YOUR BRAIN!"
    ];
    vp_lose_phrase = phrases[Math.floor(Math.random() * (phrases.length - 1))];

    //win_fall_rate = 0.6;
    //win_accel = 0.09
    win_fall_rate = 1;
    win_accel = 0.18;
    win_terminal = 8.9;
    vp_win_state = 0;
    
    // Exp Vars
    exp_bar = {
        accel: 0.0004,
        velocity: 0,
        max_velocity: 0.028,
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

function vp_draw_expbar(){
    exp_bar.move();
    exp_bar.update();
    
    // Drawing!
    var transform = [canvas_width * exp_bar.transform[0], canvas_height * exp_bar.transform[1], canvas_width * exp_bar.transform[2], canvas_height * exp_bar.transform[3]];
    context.drawImage(vp_exp_bar_back, transform[0], transform[1], transform[2], transform[3]);
    
    var outline = transform[1] * 0.02;
    var t = transform.slice();
    t[0] += outline;
    t[2] *= 0.9;
    t[2] -= outline;
    t[1] += outline;
    t[3] -= outline * 2;
    
    var width = ((experience % 100) / 100);
    if(width > 1 || width == 0)
        width = 1;

    context.drawImage(vp_exp_bar_front, t[0], t[1], t[2] * width, t[3]);
    auto_size_text(width * 100, transform[2] * 0.05, transform[3] - outline * 2.2);
    draw_win_text(width * 100 + "%", transform[0] + transform[2] * 0.5 - (context.measureText((width * 100).toString() + "%").width / 2), transform[1] + transform[3] * 0.75);
    
    
    transform[0] += transform[2] * 0.9;
    transform[1] -= canvas_height * 0.04;
    transform[3] += canvas_height * 0.04 * 2;
    transform[2] = transform[3];
    transform = scale_transform_down(transform);
    var text_trans = scale_transform(transform);
    drawRotatedImage(vp_exp_bar_wheel, transform.slice(), exp_bar.angle);
    context.fillStyle = "#ffffff";
    var text = win_screen_words[4];
    draw_win_text(text, text_trans[0] + text_trans[2] * 0.5 - context.measureText(text).width / 2, text_trans[1] + text_trans[3] * 1.3);
}

function vp_load_win_screen_images(){
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
    
}