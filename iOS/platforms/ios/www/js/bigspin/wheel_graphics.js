/*
    This is essentially a rip / redo of the roulette game that I coded previously.
    The code is fairly crude and functional (very few dynamic elements here :p)
    due to time constraints (we had a previous version of this game subcontracted
    that didn't end up fitting our requirements
    
    
    - Riley
*/


// Variables relating to the appearance of the wheel
var wheel_transform = [
    0.1,
    0.1,
    0.85 / (16 / 9),
    0.85
];

// Variables Relating to the appearance of other objects
var dealer_transform = [
        wheel_transform[0] + wheel_transform[2] * 0.95,
        0, // #NOTE this value is set equal at draw to ensure that the image always rests at the bottom of the frame
        0.2,
        0 // #NOTE this value is modified to fit the images aspect ratio
];

var logo_transform = [
    0.02,
    0.85,
    0.15,
    0, // #NOTE This is set at draw time to ensure a locked aspect ratio
];


// Variables relating to the wheel object
var wheel_splash_start = 0;
var can_spin = false;
var big_spin_callback;
var complete_time;
var result, result_received;
var stop_point;
var pies = [];
var max_angular = 2.5 * Math.PI;
var min_angular = Math.PI;
var angular = 0;
var angle = 0;
var min_spins = 0.8;
var max_spins = 6;
var spins = 0;
var final_angle = 0;
var free_spin_delay = 1500;
var free_spin_start = 0;
var free_spin = false;


// Variables relating to the "physics" of the simulation
var accel = 0.011 * Math.PI;
var deccel = 0.000002 * Math.PI;
var accel_time = 400;
var accel_count = 0;
var accelerating = true;
var spinnning = false;
var complete = false;



/*
    Entry Point
    #INIT #BEGIN
*/


// MUST BE CALLED FIRST!
function wheel_init(callbk){
    big_spin_callback = callbk;
    BigSpinAudio.free_spin();
    can_spin = true;
    isBigSpin = true;
    wheel_splash_start = new Date().getTime();
    //result = spin_result;
    wheel_reset();
    wheel_transform[0] =  (1 - wheel_transform[2]) / 2;


    // Variables Relating to the appearance of other objects
    dealer_transform = [
            wheel_transform[0] + wheel_transform[2] * 0.89,
            0, // #NOTE this value is set equal at draw to ensure that the image always rests at the bottom of the frame
            0.2,
            0 // #NOTE this value is modified to fit the images aspect ratio
    ];
    //begin_spin();
}


/*
    There are several of these objects (one in keno, moneywheel, roulette) that control sound effects alongside the music controller
    they all share several functions (play, pause) that should be moved to a global audio controller which also has control over the music controller...
    oh well?
    
    #NOTE: This is the worst of the aforementioned audio controllers because of the lack of the timer element in this scope (ALSO BAD)
 */
var BigSpinAudio = {
    // These variables SHOULD be private however JavaScript....
    sound_volume: 0.2,
    free_spin_sound: new Audio('sound/bigspin/getfreespin.mp3'),
    win_sound: new Audio('sound/bigspin/afteryouwinonspin.mp3'),
    spin_sound: new Audio('sound/bigspin/MoneyWheel03.wav'),
    spin_sound_last: 0,
    
    spin: function(){
        var now = new Date().getTime();
        if(now - this.spin_sound_last > this.spin_sound.duration * 1000 * 0.85 + (500 - 500 * angular / max_angular)){
            this.spin_sound.currentTime = 0;
            this.play(this.spin_sound);
            this.spin_sound_last = now;
        }
    },
    
    free_spin: function(){
        this.play(this.free_spin_sound);
    },
    
    win: function(){
        this.play(this.win_sound);
    },
    
    play: function(sound){
        if(!sound_enabled)
            return;
        sound.play();
    },
    
    pause: function(sound){
        if(sound != undefined)
            sound.pause();
    },
};


function wheel_graphics(){
    if(spinning){
        BigSpinAudio.spin();
    }
    
    if(free_spin){
        if(new Date().getTime() - free_spin_start > free_spin_delay){
            wheel_reset();
            begin_spin();
        }
    }
    
    if(wheel_splash_start != 0){
        if(new Date().getTime() - wheel_splash_start > 2500){
            wheel_splash_start = 0;
        }
        draw_wheel_splash_screen();
        return;
    }
    

    context.globalAlpha = 0.60;
    //context.drawImage(background_img, 0, 0,canvas_width, canvas_height);
    context.fillStyle = "#000000";
    context.fillRect(0,0,canvas_width, canvas_height);
    context.globalAlpha = 1;
    
    
    if(complete_time != 0 && !free_spin){
        var now = new Date().getTime();
        if(now - complete_time > 4500){
            //console.log("Complete!");
            isBigSpin = false;
            big_spin_callback();
        }
        if(now - complete_time > 1500){
            big_spin_draw_wheel_after();
            return;
        }
    }
    

    
    draw_dev_wheel();  
    update_wheel();
    
    draw_pointer();
    
    if(!spinning){
        draw_spin_btn();
    }
    
    draw_dealer();
    
    var trans = scale_transform(logo_transform);
    //context.drawImage(big_spin_logo, trans[0], trans[1], trans[2], big_spin_logo.height / big_spin_logo.width * trans[2]);
    
    if(complete){
        draw_complete_anim();
    }
}


/*

    Graphics Objects

*/

// Draw the wheel itself
function update_wheel(){
    if(!spinning)
        return;
    
    // Calculating Changes in acceleration
    if(accelerating){
        // Ensuring that the wheel accelerates for at least accel_time
        if(accel_count <= accel_time){
            accel_count++;
        }
        // Determining when / if the wheel should stop spinning
        if(accel_count >= accel_time && spins > min_spins){
            accelerating = begin_deccel();
            
        }
        // Capping the angular velocity of the wheel
        if(angular < max_angular){
            angular += accel;
            if(angular > max_angular){
                angular = max_angular;
            }
        } else{
            angular = max_angular;
        }
      // Handling the decceleration cycle
    } else {
        if(angular > 0){
            angular -= deccel;
            if(angular < 0){
                angular = 0;
            }
        }
    }

    // "Spinning" Wheel
    angle += angular;
    if(angle > 360){
        spins++;
        angle -= 360;
    }
    
    if(angular == 0){
        spin_complete();
    }
    
}

function draw_pointer(){
    var transform = scale_transform(wheel_transform);
    var arrow_width = transform[2] * 0.2;
    var arrow_height = pointer.width / pointer.height * arrow_width;
    context.drawImage(pointer, transform[0] + transform[2] * 0.5 - arrow_width / 2, 0, arrow_width, arrow_height);
}



function draw_dev_wheel(){
    var transform = scale_transform(wheel_transform);
    var radius = transform[2] * 0.432;
    var center = [transform[0] + transform[2] * 0.5, transform[1] + transform[3] * 0.5];
    
    context.save();
    context.translate(center[0], center[1]);
    context.rotate(angle * TO_RADIANS);
    
    center = [0,0];
    
    context.lineWidth = 6;
    auto_size_text("Free Spin", radius * 0.4, canvas_height);
    for(var i = 0; i < pies.length; i++){
        context.strokeStyle = pies[i].outline_color;

        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(center[0], center[1]);
        var rad = i * (2 * Math.PI) / pies.length;
        // First Line
        var point_1 = [center[0] + radius * Math.cos(rad), center[1] + radius * Math.sin(rad)];
        context.lineTo(point_1[0], point_1[1]);
        
        context.lineWidth = 1;
        rad = (i+1) * (2 * Math.PI) / pies.length;

        // Top Line
        var point_2 = [center[0] + radius * Math.cos(rad), center[1] + radius * Math.sin(rad)];
        context.lineTo(point_2[0], point_2[1]);
        
        // Return Line
        context.lineWidth = 4;
        context.lineTo(center[0], center[1]);
        
        context.fillStyle = pies[i].fill_color;       
        context.fill();
        context.stroke();
        
        // Initializing Text Pos to Center Between Outer Points
        var text_pos = [
                (point_1[0] + point_2[0]) / 2,
                (point_1[1] + point_2[1]) / 2
                ];
        // Moving Text Pos back 25% of dist to center
        for(var j = 0; j < text_pos.length; j++){
            var dist = Math.sqrt((text_pos[j] - center[j])*(text_pos[j] - center[j])) * 0.25;
            if(text_pos[j] > center[j]){
                text_pos[j] -= Math.abs(dist);
            } else {
                text_pos[j] += Math.abs(dist);
            }
        }
        
        //console.log(distance(text_pos[1], center[1]));
        context.fillStyle = "#000000";
        // More font details should be obtained and set from the individual pies here
        
        
        //drawRotatedText(pies[i].text, text_pos, 360 / pies.length * (i) + 360 / pies.length * 0.5);
        // Breaking Text into Words
        var pie_words = [];
        var w = "";
        for(var j = 0; j < pies[i].text.length; j++){
            if(pies[i].text[j] == ' '){
                pie_words.push(w);
                w = '';
            } else {
                w += pies[i].text[j];
            }
        }
        pie_words.push(w);
        
        var spacing = 0.115;
        
        function move_towards(trans, point, percent){
            for(var p = 0; p < trans.length; p++){
                var dist = Math.sqrt((trans[p] - point[p])*(trans[p] - point[p])) * (percent);
                if(trans[p] > point[p]){
                    trans[p] -= Math.abs(dist);
                } else {
                    trans[p] += Math.abs(dist);
                }
            }
            return trans;
        }
        
        for(var pw = 0; pw < pie_words.length; pw++){
            if(pw < pie_words.length - 1){
                //console.log(context.measureText(pie_words[pw]).width, (context.measureText(pie_words[pw]).width / 2) / distance(text_pos, point_1));
                drawRotatedText(
                            pie_words[pw],
                            //text_pos,
                            move_towards([text_pos[0], text_pos[1]], point_1, (context.measureText(pie_words[pw]).width / 2) / distance(text_pos, point_1)),
                            360 / pies.length * (i) + 360 / pies.length * 0.5 + 90);
                // Moving Each Character closer towards the center
                text_pos = move_towards(text_pos, center, spacing);
                spacing += spacing * spacing;
            } else {
                
                for(var j = 0; j < pie_words[pw].length; j++){
                    var t_angle = 360 / pies.length * i // Angle Of Each Pie
                                + 360 / pies.length * 0.5 // Modifier to ensure relative facing
                                + 90; // Rotate to face center
                                
                    drawRotatedText(pie_words[pw][j],
                                    move_towards([text_pos[0], text_pos[1]], point_1, (context.measureText(pie_words[pw][j]).width / 2) / distance(text_pos, point_1)),
                                    t_angle);
                    
                    // Moving Character Transform
                    //text_pos[1] += h; // Adding Hard Return
                    //text_pos[0] -= context.measureText(pies[i].text[j]).width;
                    
                    // Moving Each Character closer towards the center
                    text_pos = move_towards(text_pos, center, spacing);
                    spacing += spacing * spacing;
                }
            }
            
        }
        
        
    }
    
    center = [transform[0] + transform[2] * 0.5, transform[1] + transform[3] * 0.5];
    context.drawImage(wheel_container, transform[0] - center[0], transform[1] - center[1], transform[2], transform[3]);
    
    context.restore();
}

function big_spin_draw_wheel_after(){
    context.drawImage(big_spin_after_wheel, canvas_width * 0.275, canvas_height * 0.015, canvas_width * 0.49, canvas_height * 0.74);
    auto_size_text("$100000", canvas_width * 0.5, canvas_height);
    draw_win_text(pies[result].text, canvas_width * 0.5 - context.measureText(pies[result].text).width * 0.38, canvas_height * 0.5);
}


function draw_spin_btn(){
    var transform = scale_transform(wheel_transform);
    var radius = transform[2] * 0.3;
    var center = [transform[0] + transform[2] * 0.5, transform[1] + transform[3] * 0.5];
    context.beginPath();
    context.fillStyle = "#238bb5";
    context.strokeStyle = "#238bb5";
    context.arc(center[0], center[1], radius * 0.2, 0, Math.PI * 2);
    context.fill();
    
    radius = transform[2] * 0.2;
    context.drawImage(spin_btn, center[0] - radius/2, center[1] - radius/2, radius, radius);
}

function draw_dealer(){
    var width = canvas_width * dealer_transform[2];
    var height = dealer.height / dealer.width * width;

    context.drawImage(dealer, canvas_width * dealer_transform[0], canvas_height - height, width, height);
    
}


function draw_wheel_splash_screen(){
    var trans = [
        0.3,
        0.115,
        0.43,
        0.45
    ];
    trans = scale_transform(trans);
    context.drawImage(big_spin_splash_img, trans[0], trans[1], trans[2], trans[3]);
    
    var width = canvas_width * dealer_transform[2];
    var height = dealer.height / dealer.width * width;

    context.drawImage(dealer, trans[0] + trans[2] * 0.97, canvas_height - height * 0.95, width, height);
    //context.drawImage(dealer, trans[0] + trans[2] * 0.87, d[1], d[2], d[3]);
    
    var txt = "YOU WIN";
    auto_size_text(txt, trans[2] * 0.6, trans[3]);
    draw_win_text(txt,
            trans[0] + trans[2] * 0.5 - context.measureText(txt).width * 0.35,
            trans[1] + trans[3] * 0.7);
    txt = "FREE SPIN";
    auto_size_text(txt, trans[2] * 0.7, trans[3]);
    draw_win_text(txt,
            trans[0] + trans[2] * 0.5 - context.measureText(txt).width * 0.35,
            trans[1] + trans[3] * 0.95);
}

function draw_complete_anim(){
    
}



/*
    INTERACTIONS

*/
// #CLICK
function wheel_click_manager(x,y){
    if(!can_spin || wheel_splash_start != 0)
        return false;
    if(check_spin_btn(x,y)) return true;

    return false;
}

function check_spin_btn(x,y){
    var transform = scale_transform(wheel_transform);
    if(x >= transform[0] && x <= transform[0] + transform[2] && y >= transform[1] && y <= transform[1] + transform[3]){
        if(spinning){
            skip_wheel();
        } else {
            wheel_reset();
            begin_spin();
        }
        return true;
    }
    return false;
}




/*
    UTILS


*/
function wheel_resize(){
    
    
}

function set_result(r){
    
    
}

function distance(p1, p2){
    var dist = 0;
    for(var i = 0; i < p1.length; i++){
        dist += (p1[i] - p2[i]) * (p1[i] - p2[i]);
    }
    return Math.sqrt(dist);
    
}

function draw_mode(){
    stop();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas_width, canvas_height);
}

function begin_spin(){
    can_spin = false;
    //wheel_reset();
    bs_get_result();
}

function wheel_reset(){
    result_received = false;
    complete = false;
    spinning = false;
    accelerating = true;
    free_spin = false;
    accel_time = 200;
    accel_time += Math.random() * accel_time * 0.3;
    accel_count = 0;
    spins = 0;
    angular = 0;
    complete_time = 0;
    angle = 0;
    deccel = 0.025 * Math.PI;
    min_spins = 1 + Math.random() * 2;
    var max_angular = (0.3 + Math.random()) * 0.008 * Math.PI;

    
    wheel_timeout = 1000 + accel_time * 3.5;
    final_angle = find_angle(result);

}

// #COMPLETE
function spin_complete(){
    complete = true;
    spinning = false;
    complete_time = new Date().getTime();
    pies[result].result(pies[result]);
    BigSpinAudio.win();
}

// Finds the angle at which the ball would stop if deccel began now
function begin_deccel(){
    if(!result_received)
        return;
    var spin_down = 0;
    var a = angular;
    while(a > 0){
        a -= deccel;
        if(a < 0){
            a = 0;
        }
        spin_down += a;
    }
    var stop = (spin_down + angle) % 360;

    // NOTE This returns the inverse of whether or not it should stop, this is used in determining if the wheel should continue accelerating
    if(is_within(stop, result) && false){
        console.log("Should start decel");
        if(Math.abs(stop - (final_angle - 360 / pies.length * stop_point)) < 360 / pies.length * 0.1 || spins > max_spins){
            return false;
        }
    } else if(spins > max_spins && angular == max_angular){
        //angle += stop - (final_angle - 360 / pies.length * stop_point);
        angle = (final_angle - 360 / pies.length * stop_point)%360 - spin_down - 8; //idk why this -8 needs to be here, but it works...
        angle = angle % 360;
        //console.log("Engaging Stop Hack " + angle, spin_down);
        return false;
    }
    return true;
}



function find_angle(target){
    var r = (target * (- 360) / pies.length - 90) % 360;
    if(r < 0){
        r += 360;
    }
    return r;
}

function jump_stop(target){
    angle = target;
    drawRotatedImage(wheel, canvas_width/2,canvas_height/2, target);
    draw_wheel_skip_continue();
    stop();
}

function is_within(current, target){
    var prev = (target + 1) % pies.length;
    prev = find_angle(prev);
    var a = find_angle(target);
    
    if(current >= prev  && current <= a){
        return true;
    }
    return false;
}

function skip_wheel(){
    angle = final_angle - 360 / pies.length * stop_point;
    wheel_timeout = 1500;
    accelerating = false;
    should_continue = true;
    angular = 0;
    spin_complete();
}

function scale_transform(target){
    var transform = [];
    for(var i = 0; i < target.length; i++){
        if((i % 2) == 0){
            transform.push(target[i] * canvas_width);
        } else {
            transform.push(target[i] * canvas_height);
        }
    }
    return transform;
}

function scale_transform_down(target){
    var transform = [];
    for(var i = 0; i < target.length; i++){
        if((i % 2) == 0){
            transform.push(target[i] / canvas_width);
        } else {
            transform.push(target[i] / canvas_height);
        }
    }
    return transform;
}

function bs_get_result(){
    stop_point = Math.random();
    if(uname.toLowerCase() == 'guest'){
        
        result = (Math.floor(Math.random() * (pies.length - 1)) - 3) % pies.length;
        if(result < 0)
            result += pies.length;
        result_received = true;
        final_angle = find_angle(result);
        spinning = true;
        return;
    }

    
    
    var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            //console.log(req.responseText);
            if(req.responseText == "Invalid"){
                isBigSpin = false;
            } else {
                result = parseInt(req.responseText);
            }
            result_received = true;
            final_angle = find_angle(result);
            spinning = true;
            
        }
    }
    var url = server_address + "big_spin/get_result?uid=";
    if(isFacebook){
        url += facebook_info.id;
    } else {
        url += uname;
    }
     url += "&pwd=" + login_fields[1].text
    //console.log(server_address + "big_spin/get_result?uid=" + uname +"&pwd=" + login_fields[1].text);
    req.open("GET", url, true);
	req.send(null);

}

function new_pie(value, color, result){
    var obj = new Object();
    obj.value = value;
    obj.result = result;
    obj.outline_color = "#238bb5";
    obj.fill_color = color;
    if(value.indexOf("ree") == -1){
        obj.text = "$" + value;
        if(GameManager.Current_Game != "MoneyWheel"){
            obj.result = function(arg){
                var game = GameManager.Current_Game.toLowerCase();
                console.log(obj.value, game);
                if(game == "lobby" || game == "bingo" || game == "keno" || game == "moneywheel" || game == "roulette"){
                    money = parseInt(money) + parseInt(obj.value);
                } else if(game == "vp" || game == "jb" || game == "jw"){
                    console.log(parseInt(cash) + parseInt(obj.value));
                    cash = parseInt(cash) + parseInt(obj.value);
                }

            }
        }
    } else {
        obj.text = value;
    }
    
    return obj;
}


function build_wheel(){
    load_wheel_images();
    
    var c_pat = [
        "#ff0000",
        "#a186be",
        "#ffbf00",
        "#fba7c6",
        "#37a98b",
        "#ff7214"
    ];
    var p_vals = [
        "100",
        "5",
        "90",
        "25",
        "70",
        "45",
        "10",
        "65",
        "30",
        "85",
        "50",
        "95",
        "55",
        "75",
        "20",
        "15",
        "Free",
    ];
    
    for(var i = 0; i < p_vals.length; i++){
        if(p_vals[i].indexOf("ree") == -1)
            pies.push(new_pie(p_vals[i], c_pat[i % c_pat.length], function(){}));
        else
            pies.push(new_pie(p_vals[i], c_pat[i % c_pat.length], function(){
                //console.log("Working?");
                free_spin = true;
                free_spin_start = new Date().getTime();
                }));
    }
    
    /*
    pies = [
        new_pie("$0", "#000080", function(){console.log("SOMETHING HAPPENED0!");}),
        new_pie("$1", "#ff0000", function(){console.log("SOMETHING HAPPENED1!");}),
        new_pie("$2", "#ffcc00", function(){console.log("SOMETHING HAPPENED2!");}),
        new_pie("$3", "#7b68ee", function(){console.log("SOMETHING HAPPENED3!");}),
        new_pie("$4", "#808080", function(){console.log("SOMETHING HAPPENED4!");}),
        new_pie("$5", "#b8860b", function(){console.log("SOMETHING HAPPENED5!");}),
        new_pie("$6", "#989898", function(){console.log("SOMETHING HAPPENED6!");}),
        new_pie("$7", "#ee82ee", function(){console.log("SOMETHING HAPPENED7!");}),
        new_pie("$8", "#f4a430", function(){console.log("SOMETHING HAPPENED8!");}),
        new_pie("$9", "#f4a430", function(){console.log("SOMETHING HAPPENED9!");}),
        new_pie("$0", "#000080", function(){console.log("SOMETHING HAPPENED0!");}),
        new_pie("$1", "#00FF00", function(){console.log("SOMETHING HAPPENED1!");}),
        new_pie("$2", "#800080", function(){console.log("SOMETHING HAPPENED2!");}),
        new_pie("$3", "#7b68ee", function(){console.log("SOMETHING HAPPENED3!");}),
        new_pie("$4", "#808080", function(){console.log("SOMETHING HAPPENED4!");}),
        new_pie("$5", "#b8860b", function(){console.log("SOMETHING HAPPENED5!");}),
        new_pie("Free Spin","#ffff00", function(){
            console.log("Working?");
            free_spin = true;
            free_spin_start = new Date().getTime();
        }),
    ];
    */
    //wheel_init(result);
}

/*
    Declaring and Loading Images

*/

function load_wheel_images(){
    //var img_dir = "imgz/";
    var dir = "bigspin/";
    
	background_img = new Image();
	background_img.src = img_dir + dir + "background.jpg";
    
    //wheel = new Image();
    //wheel.src = img_dir + dir + "wheel.png";
    
    wheel_container = new Image();
    wheel_container.src = img_dir + dir + "wheelContainer.png";
    
    pointer = new Image();
    pointer.src = img_dir + dir + "arrow2.png";
    
    dealer = new Image();
    dealer.src = img_dir + dir + "lady.png";
    
    spin_btn = new Image();
    spin_btn.src = img_dir + dir + "spinButton.png";
    
    big_spin_logo = new Image();
    big_spin_logo.src = img_dir + "logo.png";
    
    big_spin_splash_img = new Image();
    big_spin_splash_img.src = img_dir + dir + "big_spin_splash_img.png";
    
    big_spin_after_wheel = new Image();
    big_spin_after_wheel.src = img_dir + dir + "big_spin_after_wheel.png";
}

var background_img, table_img, pointer, dealer, spin_btn, big_spin_logo, big_spin_splash_img, big_spin_after_wheel;


/*
    Rotate + Draw Functions
*/

var TO_RADIANS = Math.PI/180; 
function drawRotatedImage(image, transform, angle){
    transform = scale_transform(transform);
    context.save(); 
    
    //context.translate(transform[0] + transform[2] / 2, transform[1] + transform[3] / 2);
    context.translate(transform[0] + transform[2] / 2, transform[1] + transform[3] / 2);
    
    context.rotate(angle * TO_RADIANS);

    //context.drawImage(image, -transform[2]/2, -transform[3]/2, transform[2], transform[3]);
    context.drawImage(image, -transform[2]/2, -transform[3]/2, transform[2], transform[3]);

    context.restore(); 
}

function drawRotatedColor(transform, angle){
    transform = scale_transform(transform);
    context.save(); 
    
    //context.translate(canvas_width / 2, canvas_height / 2);
    context.translate(transform[0] + transform[2] / 2, transform[1] + transform[3] / 2);
    
    context.rotate(angle * TO_RADIANS);

    //context.drawImage(image, -image.width/2, -image.height/2);
    context.fillRect(-transform[2]/2, -transform[3]/2, transform[2], transform[3]);

    context.restore();     
}

function drawRotatedText(text, transform, angle){
    //transform = scale_transform(transform);
    context.save(); 
    
    //context.translate(canvas_width / 2, canvas_height / 2);
    context.translate(transform[0], transform[1]);
    
    context.rotate(angle * TO_RADIANS);

    //context.drawImage(image, -image.width/2, -image.height/2);
    context.fillText(text, 0, 0);

    context.restore();         
}