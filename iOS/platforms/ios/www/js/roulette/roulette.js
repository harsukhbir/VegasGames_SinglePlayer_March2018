/*
    I spent enough time making this to ensure that almost all the code for this is self contained (it of course relies on some global elements / controllers)
    The code here is a little messy and there are not nearly enough comments... sorry?
    Flow begins at init and ends at cleanUp
    Events begin at draw and each of the listener functions.
    For optimization several of the game objects (Namely WinController) should be moved to a higher scope

*/

var Roulette = {
    Red: [1,2,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],
    Black: [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,25],
    draw_loop: null,
    timer_loop: null,
    GraphicsObj: null,
    Wheel: null,
    timers: [],
    BetBar: null,
    Initialized: false,
    ClickResolved: true,
    History: [],
    Hot: [],
    Cold: [],
    Current_Bet: 0,
    Wheel: null,
    Result: 0,
    ResultReceiveed: false,
    Mode: 0,
    Images: null,
    Sounds: null,
    Mouse: {
        x: 0,
        y: 0,
        follow: false
    },
    Bets: [],
    LastBets: [],
    TableChips: null,
    
    
    init: function(){
        // alert("roulette");
        //console.log("Initialized Roulette");
        if(!Roulette.Initialized){
            resize_extra = Roulette.create_objects;
            Roulette.load_images();
            Roulette.load_sounds();
            Roulette.timer_loop = setInterval(Roulette.tick, 1);

            Roulette.save_load_hot_cold();            
            Roulette.timers = [];
            
            canvas.addEventListener('click', Roulette.on_click, false);
            
            canvas.addEventListener('mousedown', this.mouse_down, false);
            canvas.addEventListener('mouseup', this.mouse_up, false);
            canvas.addEventListener('mousemove', this.mouse_move, false);
            
            // document.addEventListener('touchstart', this.on_click, false);
            document.addEventListener('touchmove', this.mouse_move, false);
        }
        Roulette.reset();
    },
    
    reset: function(){
        this.Current_Bet = 0;
        this.ClickResolved = true;
        console.log(this.Bets);
        this.LastBets = this.Bets.slice();
        this.Bets = [];
        this.Mode = 0;
    },
    
    
    
    cleanUp: function(){
        console.log("Cleaning Up1");
        Roulette.reset();
        resize_extra = blank;
        Roulette.Initialized = false;
        clearInterval(Roulette.draw_loop);
        clearInterval(Roulette.timer_loop);
        Roulette.save_load_hot_cold();
        console.log("Cleaning Up2");
        canvas.removeEventListener('click', Roulette.on_click);
            
        canvas.removeEventListener('mousedown', Roulette.mouse_down);
        canvas.removeEventListener('mouseup', Roulette.mouse_up);
        canvas.removeEventListener('mousemove', Roulette.mouse_move);
        
        console.log("Cleaning Up3");
        document.removeEventListener('touchstart', Roulette.on_click);
        document.removeEventListener('touchmove', Roulette.mouse_move);
    },
    
    
    clearAllBets: function(){
        this.Bets = [];
    },
    
    
    beginSpin: function(){

        if(Roulette.Wheel.spinning || !Roulette.Initialized){
            return;
        }

        if(Roulette.final_bet() <= 0){
            return;
        }
        if(!Roulette.ResultReceiveed){
            Roulette.get_result();
            //Roulette.Sounds.on_spin();
        }
        
        Roulette.ResultReceiveed = false;
        Roulette.get_objs_with_tag('end_screen')[0].SHOW = false;
        
        Roulette.Wheel.transform[1] = Roulette.Wheel.transform_orig[1] + Roulette.Wheel.bottom;
        
        money -= Roulette.final_bet();
        save_storage();
        Roulette.Mode = 1;
        Roulette.Wheel.stopping = false;
        Roulette.timers.push(Roulette.new_timer(300, function(){Roulette.Wheel.spinning = true;}, false));
        Roulette.timers.push(Roulette.new_timer(350, function(){Roulette.Sounds.on_spin();}, false));
        //Roulette.Wheel.spinning = true;
        Roulette.Wheel.angle = 0;
        
        var Ball = Roulette.get_objs_with_tag("Ball")[0];
        console.log(Ball);
        Ball.locked = false;
        Ball.velocity = 0;
        Ball.angle = 180;
        Ball.transform[0] = Ball.transform_orig[0];
        Ball.transform[1] = Ball.transform_orig[1];
        Ball.dist = 0;
        
        // This is a sketchy hack, but it works
        context.globalAlpha = 0.7;
        context.fillStyle = "#000000";
        context.fillRect(0,0,canvas_width,canvas_height);
        context.globalAlpha = 1;
        
    },
    
    spinComplete: function(){
        this.Mode = 0;
        Roulette.Sounds.on_spin_done();
        vp_reset_win_graphics();
        hand_type = '';
        last_win = 0;
        experience += 15;
        Roulette.WinController.begin();
        for(var i = 0; i < this.Bets.length; i++){
            if(this.Bets[i].val.indexOf(this.Result) != -1){
                last_win += this.Bets[i].bet * this.Bets[i].ratio;
            }
        }
        last_winning = last_win;
        money += last_win;
        if(last_win == 0){
            Roulette.Sounds.on_lose();
        } else {
            Roulette.Sounds.on_win();
        }
        save_storage();

        Roulette.get_objs_with_tag('end_screen')[0].SHOW = false;
        //this.reset();
        
    },
    
    addBet: function(tag, val, ratio, transform){
        if(Roulette.WinController.SHOW)
            return;
        for(var i = 0; i < this.Bets.length; i++){
            if(this.Bets[i].follow){
                console.log('Found Folling Bet');
                var found = false;
                for(var j = 0; j < this.Bets.length; j++){
                    if(tag == this.Bets[j].tag && i != j){
                        this.Bets[j].bet += this.Bets[i].bet;
                        Roulette.removeBet(this.Bets[i].tag);
                        found = true;
                        break;
                    }
                }
                if(!found){
                    if(tag == this.Bets[i].tag){
                        console.log("Adding");
                        if(money - this.final_bet() > this.Current_Bet){
                            this.Bets[i].bet += this.Current_Bet;
                        }
                    }
                    this.Bets[i].tag = tag;
                    this.Bets[i].transform = transform;
                    this.Bets[i].ratio = ratio;
                    this.Bets[i].follow = false;
                }
                return;
            }
        }
        
        
        if(money - this.final_bet() < this.Current_Bet){
            this.Current_Bet = money - this.final_bet();
        }
        if(this.Current_Bet == 0)
            return;
        this.Bets.push({
            tag: tag, 
            val: val, 
            ratio: ratio, 
            bet: this.Current_Bet,
            transform: transform.slice(),
            orig: transform.slice(),
            follow: false
        });
    },
    
    removeBet(tag){
        //console.log("Removing bet");
        var new_bets = [];
        for(var i = 0; i < Roulette.Bets.length; i++){
            if(Roulette.Bets[i].tag != tag){
                new_bets.push(Roulette.Bets[i]);
            }
        }
        Roulette.Bets = new_bets;
        //Roulette.Bets.splice(i, 0);
        Roulette.ClickResolved = true;
    },
    
    
    stringify_bets: function(){
        var str = '';
        for(var i = 0; i < this.Bets.length; i++){
            str += this.Bets[i].bet + ',' + this.Bets[i].val + ',' + this.Bets[i].ratio + '|';
        }
        return str;
    },
    
    update_history: function(num){
        this.History.push(this.Result);
        var hist = this.History.slice();
        hist.sort();
        var start = 1;
        if(hist.length > 50){
            start = hist.length - 50;
            for(var i = 1; i < 37; i++){
                if(hist.indexOf(i) == -1)
                    cold.push(i);
            }
        }
        var count = 0;
        for(var i = start; i < hist.length; i++){
            if(hist[i-1] == hist[i]){
                count++;
            } else {
                if(count > 3){
                    this.Hot.push(hist[i-1]);
                }
                count = 0;
            }
        }
        if(count > 3)
            this.Hot.push(hist[hist.length - 1]);
          
    },
    
    
    get_result: function(){
        if(Roulette.final_bet() <= 0){
            return;
        }
        if(uname.toLowerCase() == 'guest'){
            this.Result = Math.floor(Math.random() * 36);
            this.ResultReceiveed = true;
            Roulette.update_history();
            Roulette.beginSpin();
        } else {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(req.readyState == 4 && req.status == 200){
                    console.log(req.responseText);
                    var resp = JSON.parse(req.responseText);
                    console.log(resp);
                    Roulette.Result = parseInt(resp.result);
                    Roulette.ResultReceiveed = true;
                    Roulette.update_history();
                    Roulette.beginSpin();
                }
            }
            var url = ""            
            if(isFacebook){
                url = server_address + "roulette/result?uid=" + facebook_info.id + "&sid=" + sid + "&b=" + Roulette.stringify_bets();
            } else {
                url = server_address + "roulette/result?uid=" + login_fields[0].text+"&sid=" + sid + "&b=" + Roulette.stringify_bets();
            }
            console.log(url);
            req.open("GET", url, true);
            req.send(null);
        }
        
        
        

    },
    
    load_sounds: function(){
        var audio_dir = 'sound/';
        var sub_dir = 'roulette/';
        var dir = audio_dir + sub_dir;
        this.Sounds = {
            sound_temp_volume: MusicManager.volume * 0.3,

            //click: new Audio(dir + ''),
            
            click_sounds: [new Audio(dir + 'cchip.wav'), new Audio(dir + 'chip01.wav'), new Audio(dir + 'chip2chip-clink.wav')],
            lose_sounds: [new Audio(dir + 'bustHehitscheckouttime.wav'), new Audio(dir + 'dealerbjeatthishahaha.wav'), new Audio(dir + 'hz134.wav')],
            win_sounds: [new Audio(dir + 'playerbj-missionaccomplished.wav'), new Audio(dir + 'payoff01.wav')],
            spin: new Audio(dir + 'CasinoRouletteWheel.wav'),
            //spin: new Audio(dir + 'arounshegoes1.wav'),
            begin_spin: new Audio(dir + 'goodluck.wav'),
            
            /*
            on_begin_spin(){
                this.play(this.begin_spin);
            },
            */
            
            on_click: function(){
                this.play(this.click_sounds[Math.floor(Math.random() * this.click_sounds.length)]);
            },
            
            on_win: function(){
                this.play(this.win_sounds[Math.floor(Math.random() * this.win_sounds.length)]);
            },
            
            on_lose: function(){
                this.play(this.lose_sounds[Math.floor(Math.random() * this.lose_sounds.length)]);
            },
            
            on_spin: function(){
                this.play(this.spin);
                /*
                var timer = Roulette.new_timer_millis(this.spin.duration * 1000 * 0.6, function(){if(Roulette.Mode == 1){Roulette.Sounds.on_spin();}}, false);
                console.log(this.spin.duration * 1000 * 0.6);
                Rolette.timers.push(timer);
                */
            },
            
            on_spin_done: function(){
                //this.pause(this.spin);
                this.spin.currentTime = this.spin.duration * 0.8;
            },
            
            play: function(sound){
                if(!sound_enabled)
                    return;
                var tmp = MusicManager.volume;
                MusicManager.setVolume(this.sound_temp_volume);
                var timer = Roulette.new_timer_millis(sound.duration * 1000, function(){MusicManager.setVolume(this.volume);}, false);
                timer.volume = tmp;
                Roulette.timers.push(timer);
                sound.play();
            },
            
            pause: function(sound){
                sound.pause();
            },
            
        };
    },
    
    load_images: function(){
        vp_load_win_screen_images();
        Roulette.Images = {
            total_images: 0,
            images_loaded: 0,
            start_btn: new Image(),
            clear_btn: new Image(),
            red_felt: new Image(),
            green_felt: new Image(),
            win_overlay: new Image(),
            ExitBtn: new Image(),
            replay_btn: new Image(),
            new_bet_btn: new Image(),
            roulette_logo: new Image(),
            Wheel: new Image(),
            BetBar: new Image(),
            money_display: new Image(),
            hot_cold_btn: new Image(),
            HotColdWindow: new Image(),
            BetBarToggle: new Image(),
            BarChipImg: new Image(),
            TableChip: new Image(),
            Ball: new Image()
        };
        for(var key in Roulette.Images){
            if(Roulette.Images.hasOwnProperty(key)){
                if(typeof(Roulette.Images[key]) == "object"){
                    Roulette.Images[key].onload = function(){
                        Roulette.Images.images_loaded++;
                        if(Roulette.Images.images_loaded >= Roulette.Images.total_images){
                            Roulette.create_objects();
                        }
                    };
                    Roulette.Images.total_images++;
                }
            }
        }
        
        var dir = img_dir + 'roulette/';
        Roulette.Images.Wheel.src = dir + 'Wheel.png';
        Roulette.Images.BetBar.src = dir + 'roulette_bet_bar.png';
        Roulette.Images.BetBarToggle.src = dir + 'toggle_bet_bar.png';
        Roulette.Images.BarChipImg.src = img_dir + 'wheel/CHIP.png';
        Roulette.Images.TableChip.src = img_dir + 'wheel/chip_board.png';
        Roulette.Images.Ball.src = dir + 'BALLS.png';
        
        Roulette.Images.ExitBtn.src = dir + 'exit_btn.png';
        Roulette.Images.start_btn.src = dir + "start_btn.png";
        Roulette.Images.clear_btn.src = dir + "clear_btn.png";
        Roulette.Images.red_felt.src = dir + 'red_felt.jpg';
        Roulette.Images.green_felt.src = dir + 'green_felt.png';
        Roulette.Images.hot_cold_btn.src = dir + 'tinder_btn.png';
        Roulette.Images.HotColdWindow.src = dir + 'HotColdWindow.png';
        Roulette.Images.money_display.src = dir + 'money_display.png';
        
        Roulette.Images.replay_btn.src = dir + 'replay_btn.png';
        Roulette.Images.new_bet_btn.src = dir + 'new_bet_btn.png';
        Roulette.Images.roulette_logo.src = dir + 'roulette_logo.png';
        
        Roulette.Images.win_overlay.src = dir + 'roulette_win_overlay.png';
        
        //console.log("Roulette Images Initialized");
    },
    
    
    create_objects: function(){
        this.GraphicsObj = Roulette.new_obj([
            ['clickable', true],
            ['id', 'GraphicsObj']
        ]);
        
        // These Set conditions here to show board #CONDITIONS
        var table = Roulette.new_obj([
            ['clickable', true],
            ['conditions', [function(){return Roulette.Mode == 0;}]],
            ['id', 'table']
            ]);
        var tiles = Roulette.new_obj([
            ['clickable', true],
            ['id', 'table_tiles']
            ]);

        var fnt_color = '#ffd757';

        // Creating the 36 Background Colors #TILES
        var tile_transform = [0, 0.44, 0.077, 0.22];
        var table_font = auto_size_text("36", canvas_width * 0.08, canvas_height * 0.055) + font;
        for(var i = 0; i < 39; i++){
            var left = tile_transform[0] + (Math.floor(i / 3) * tile_transform[2]);
            var top = tile_transform[1] - (i % 3) * tile_transform[3];
            
            var txt = i + 1;
            var color = "#c10008";
            if(Roulette.Black.indexOf(txt) != -1){
                color = "#000000";
            }
            
            var clickFunction = function(arg){
                Roulette.addBet(this.value[0], this.value, 35, this.transform);
                //console.log(this.value);
            };
            
            
            if(i >= 36){
                color = "#000000";
                txt = "2to1";
                clickFunction = function(){
                    var val = [];
                    for(var i = 0; i < 12; i++){
                        val.push(i * 3 + (this.value[0] - 36));
                    }
                    Roulette.addBet(this.value[0], val, 2, this.transform);
                    console.log(this.value);
                };
            }
            
            var tile = Roulette.new_obj([
                ['transform', [left, top, tile_transform[2], tile_transform[3]]],
                ['fillColor', color],
                ['type', 'table_tile'],
                ['id', 'tile_back'],
                ['value', [i + 1]],
                ['clickable', true],
                ['onClick', clickFunction]

                ]);

            
            tile.add_child(Roulette.new_obj([
                ['transform', [left + tile_transform[2] * 0.7, top + tile_transform[3] * 0.5 + (context.measureText(txt).width * 0.6) / canvas_width, tile_transform[2], tile_transform[3]]],
                ['color', fnt_color],
                ['color_norm', fnt_color],
                ['id', 'tile_text'],
                ['update', function(){
                    if(Roulette.Hot.indexOf(String(this.text)) != -1){
                        this.color = '#ff0600';
                    } else if(Roulette.Cold.indexOf(String(this.text)) != -1){
                        this.color = '#47cdff';
                    } else {
                        this.color = this.color_norm;
                    }
                    if(String(Roulette.Result) == String(this.text)){
                        this.color = '#10aa31';
                    }
                    }],
                ['clickable', false],
                ['font', table_font],
                ['text_style', 2],
                ['text', txt]
                ]), 1);

            tiles.add_child(tile, 1);
        }
        table.add_child(tiles, 1);
        
        
        // Creating the Lines for the Table
        var table_lines_verticle = Roulette.new_obj([
            ['clickable', false]
            ]);
        for(var i = 0; i < 4; i++){
            table_lines_verticle.add_child(Roulette.new_obj([
                ['transform', [0, i * tile_transform[3], 1, 0.005]],
                ['fillColor', fnt_color],
                ]), 1);
        }
        table.add_child(table_lines_verticle, 2);
        var table_lines_horizontal = Roulette.new_obj([
            ['clickable', false]
            ]);
        for(var i = 0; i < 15; i++){
            table_lines_horizontal.add_child(Roulette.new_obj([
                ['transform', [tile_transform[2] * i, 0, 9/16 * 0.005, tile_transform[3] * 3]],
                ['fillColor', fnt_color],
                ]), 1);
        }        
        table.add_child(table_lines_horizontal, 2);
        
        
        // Adding all the Line and Corner Buttons
        var horizontal_line_buttons = Roulette.new_obj([
            ['id', 'horizontal_line_buttons'],
            ['clickable', true]
            ]);
        var vertical_line_buttons = Roulette.new_obj([
            ['id', 'vertical_line_buttons'],
            ['clickable', true]
            ]);
        var corner_buttons = Roulette.new_obj([
            ['id', 'corner_buttons'],
            ['clickable', true]
            ]);
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 12; j++){
                var value = [j * 3 + 3 - i, j * 3 + 3 - i - 1];
                ratio = 17;
                if(i == 2){
                    //value[1] = 0;
                    value[1] = j * 3 + 2;
                    value.push(j * 3 + 3);
                    ratio = 11;
                }
                horizontal_line_buttons.add_child(Roulette.new_obj([
                    ['transform', [
                        j * tile_transform[2],
                        tile_transform[3] * (i+1) - tile_transform[3] * 0.05,
                        tile_transform[2],
                        tile_transform[3] * 0.1
                        ]],
                    //['value', '{"t":"h",' + i*3 + j],
                    ['value', value.slice()],
                    ['clickable', true],
                    ['ratio', ratio],
                    ['id', 'h_line_' + j + '_' + i],
                    ['onClick', function(){
                        Roulette.addBet(this.id, this.value, this.ratio, this.transform);
                        console.log(this.value);
                        }]
                    ]), 1);
                ratio == 17;
                var val = [j * 3 + 3 - i, (j-1) * 3 + 3 - i];
                if(j == 0){
                    val[1] = 0;
                }
                vertical_line_buttons.add_child(Roulette.new_obj([
                    ['transform', [
                        j * tile_transform[2] - tile_transform[2] * 0.05,
                        tile_transform[3] * i,
                        tile_transform[2] * 0.1,
                        tile_transform[3]
                        ]],
                    ['value', val],
                    ['id', 'v_line_' + j + '_' + i],
                    ['clickable', true],
                    ['onClick', function(){
                        console.log(this.id, this.value, 17);
                        Roulette.addBet(this.value, this.value, 17, this.transform);
                        }]
                    ]), 1);
                

                    
                if(j < 12){
                    value = [
                        j * 3 + 3 - i,
                        j * 3 + 3 - i - 1,
                        (j-1) * 3 + 3 - i,
                        (j-1) * 3 + 3 - i - 1
                    ];
                    ratio = 8;
                    var click_fnc = function(){
                            Roulette.addBet(this.id, this.value, this.ratio, this.transform);
                            console.log(this.value);
                            };
                    
                    if(i == 2){
                        //value[1] = 0;
                        //value[3] = 0;
                        
                        ratio = 5;
                        value[1] = j * 3 + 2;
                        value[3] = (j-1) * 3 + 2;
                        value.push(j * 3 + 3);
                        value.push((j-1) * 3 + 3);
                    }
                    corner_buttons.add_child(Roulette.new_obj([
                        ['transform', [j * tile_transform[2] - tile_transform[2] * 0.05,
                                    (i+1) * tile_transform[3] - tile_transform[3] * 0.05,
                                    tile_transform[2] * 0.1,
                                    tile_transform[3] * 0.1
                                    ]],
                        ['value', value.slice()],
                        ['clickable', true],
                        ['ratio', ratio],
                        ['id', 'c_btn_' + j + '_' + i],
                        ['onClick', click_fnc]
                        ]), 1);
                }
            }
        }
        table.add_child(horizontal_line_buttons, 3);
        table.add_child(vertical_line_buttons, 3);
        table.add_child(corner_buttons, 4);
        
        this.TableChips = Roulette.new_obj([
                ['transform', [0,0,1,0.81]],
                ['clickable', false],
                ['id', 'table_chip_disp'],
                ['font', auto_size_text("1000", canvas_width * 0.05, canvas_height)+font],
                ['color', '#ffffff'],
                ['update', function(){
                        var diameter = canvas_width * 0.05;
                        context.font = this.font;
                        context.fillStyle = this.color;
                        for(var i = 0; i < Roulette.Bets.length; i++){
                            var trans = scale_transform(Roulette.Bets[i].transform);
                            if(Roulette.Bets[i].follow){
                                trans[0] = Roulette.Mouse.x - trans[2] / 2;
                                trans[1] = Roulette.Mouse.y - trans[3] / 2;
                            }
                            context.drawImage(Roulette.Images.TableChip,
                                    trans[0] + trans[2] / 2 - diameter/2,
                                    trans[1] + trans[3] / 2 - diameter/2,
                                    diameter,
                                    diameter
                                    );
                            
                            context.fillText(Roulette.Bets[i].bet, trans[0] + trans[2] / 2 - context.measureText(Roulette.Bets[i].bet).width / 2, trans[1] + trans[3] / 2 + diameter * 0.2);
                        }
                    }]
                ]);
        this.TableChips.isClicked = function(x,y){
            //console.log("Checking TableChips ", x , y);
            for(var i = 0; i < Roulette.Bets.length; i++){
                var trans = scale_transform(Roulette.Bets[i].transform);
                if(x >= trans[0] && x <= trans[0] + trans[2]){
                    if(y >= trans[1] && y <= trans[1] + trans[3]){
                        Roulette.Bets[i].follow = true;
                        return true;
                    }
                }
            }
            return false;
        };
        table.add_child(this.TableChips, 6);
        
        
        
        // Creating Bottom Buttons and Lines
        var bottom_btns = Roulette.new_obj([
                ['id', 'bottom_buttons'],
                ['clickable', true]
                ]);
        var bottom_btn_lines = Roulette.new_obj([
                ['id', 'bottom_lines'],
                ['clickable', false]
                ]);
        var bottom_values = [
            [1,2,3,4,5,6,7,8,9,10,11,12],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
            [13,14,15,16,17,18,19,20,21,22,23,24],
            [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
            Roulette.Black.slice(),
            Roulette.Red.slice(),
            [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],
            [25,26,27,28,29,30,31,32,33,34,35,36],
            [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
            [0]
            ];
        var bottom_btn_text = ["1-12","1-18","13-24","EVEN","","","ODD","25-36","19-36", "0"];
        var bottom_btn_ratios = [2, 1, 2, 1, 1, 1, 1, 2, 1, 35];
        var bottom_btn_font = auto_size_text("EVEN", canvas_width * 0.05, canvas_height) + font;
        for(var i = 0; i < 10; i++){
            var color = '#15b6a0';
            if(i == 4)
                color = "#000000";
            else if(i == 5)
                color = "#db000b";
            else if(i == 9)
                color = "#05a035";
            
            var button = Roulette.new_obj([
                    ['transform', [tile_transform[0] + (0.1*i), tile_transform[3] * 3, 0.1, 0.15]],
                    ['clickable', true],
                    ['id', 'bottom_btn_' + i],
                    ['value', bottom_values[i]],
                    ['ratio', bottom_btn_ratios[i]],
                    ['fillColor', color],
                    ['type', 'button'],
                    ['onClick', function(){
                        Roulette.addBet(this.id, this.value, this.ratio, this.transform);
                        console.log(this.value);
                        }]
                    ]);
            button.add_child(Roulette.new_obj([
                    ['transform', [tile_transform[0] + (0.1*i) + 0.05 - (context.measureText(bottom_btn_text[i]).width * 0.5 / canvas_width), tile_transform[3] * 3.4, 0.1, 0.15]],
                    ['clickable', false],
                    ['id', 'bottom_btn_txt'],
                    ['text', bottom_btn_text[i]],
                    ['color', fnt_color],
                    ['font', bottom_btn_font]
                    ]), 1);

            bottom_btns.add_child(button, 1);
            
            bottom_btn_lines.add_child(Roulette.new_obj([
                    ['transform', [tile_transform[0] + (0.1*i), tile_transform[3] * 3, 0.005*9/16, 0.15]],
                    ['fillColor', fnt_color]
                    ]), 2);
        }
        table.add_child(bottom_btns, 1);
        bottom_btn_lines.add_child(Roulette.new_obj([
                    ['transform', [tile_transform[0], tile_transform[3] * 3 + 0.15, 1, 0.005]],
                    ['fillColor', fnt_color]
                    ]), 2);
                    /*
        bottom_btn_lines.add_child(Roulette.new_obj([
                    ['transform', [tile_transform[0] + (0.1*5), tile_transform[3] * 3 + 0.15, 0.005 * 9/16, 1 - tile_transform[3] * 3 + 0.15]],
                    ['fillColor', fnt_color]
                    ]), 2);
                    */
        table.add_child(bottom_btn_lines, 3);
        
        var money_disp = Roulette.new_obj([
                    ['transform', [0.28, 0.85, 0.29, 0.12]],
                    ['id', 'money_display'],
                    ['clickable', true],
                    ['onClick', open_store],
                    ['image', Roulette.Images.money_display]
                    ]);
        money_disp.add_child(Roulette.new_obj([
                    ['transform', [0.28, 0.93, 0.15, 0.12]],
                    //['transform', [0.28, 0.85, 0.29, 0.12]],
                    ['parent', money_disp],
                    ['id', 'money_disp_txt'],
                    ['text_style', 1],
                    ['text', 0],
                    ['update', function(){
                        this.transform[0] = this.parent.transform[0] + this.parent.transform[2] * 0.01;
                        this.transform[1] = this.parent.transform[1] + this.parent.transform[3] * 0.7;
                        this.text = '$' + money;
                        }]
                    ]), 1);
        table.add_child(money_disp, 3);
        
        
        var HotColdMenu = Roulette.new_obj([
                    ['transform', [0.135, 0.16, 0.15, 0.72]],
                    ['id', 'HotColdWindow'],
                    ['clickable', true],
                    ['open', false],
                    ['conditions', [function(arg){return arg.open;}]],
                    ['image', Roulette.Images.HotColdWindow],
                    ['onClick', function(){}],
                    ]);
        HotColdMenu.isClicked = function(x,y){this.open = false; return false;};
        HotColdMenu.add_child(Roulette.new_obj([
                    ['id', 'hot_text'],
                    ['parent', HotColdMenu],
                    ['font', auto_size_text('7', canvas_width * 0.01, canvas_height) + font],
                    ['update', function(){
                        context.font = this.font;
                        //this.parent.transform[3] = (context.measureText('w').width * Roulette.Hot.length)/canvas_height + 0.1
                        //this.parent.transform[1] = 0.86 - this.parent.transform[3];
                        
                        var trans = scale_transform(this.parent.transform);

                        trans[0] += trans[2] * 0.25;
                        trans[1] += trans[3] * 0.2;
                        context.fillStyle = '#ff000b';
                        var spacing = context.measureText('w').width;
                        for(var i = 0; i < Roulette.Hot.length; i++){
                            context.fillText(Roulette.Hot[i], trans[0] - context.measureText(Roulette.Hot[i]).width/2, trans[1]);
                            trans[1] += spacing;
                        }
                        trans = scale_transform(this.parent.transform);

                        trans[0] += trans[2] * 0.72;
                        trans[1] += trans[3] * 0.2;
                        context.fillStyle = '#00dde0';
                        for(var i = 0; i < Roulette.Cold.length && i < 15; i++){
                            context.fillText(Roulette.Cold[i], trans[0] - context.measureText(Roulette.Hot[i]).width/2, trans[1]);
                            trans[1] += spacing;
                        }
                        }]
                    ]), 1);
        
        table.add_child(HotColdMenu, 5);
        
        
        
        
        // Creating Interaction Buttons
        var interaction_buttons = Roulette.new_obj([    
                    ['clickable', true],
                    ['id', 'bet_interaction_buttons'],
                    ['conditions', [function(arg){
                            if(Roulette.ClickResolved) return true;
                            else return !Roulette.WinController.SHOW;
                        }]]
                    ]);
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0.6, 0.84, 0.18, 0.14]],
                    ['clickable', true],
                    ['id', 'clear_btn'],
                    //['fillColor', '#db000b'], 
                    ['image', Roulette.Images.clear_btn],
                    ['onClick', function(){Roulette.clearAllBets()}]
                    ]), 2);
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0.675 - (context.measureText(words[4]).width * 0.5) / canvas_width, 0.93, 0.18, 0.14]],
                    ['clickable', false],
                    ['color', '#000000'],
                    ['text', words[4]],
                    ]), 3);
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0.8, 0.84, 0.18, 0.14]],
                    //['fillColor', '#05a035'],
                    ['image', Roulette.Images.start_btn],
                    ['id', 'start_btn'],
                    ['clickable', true],
                    ['onClick', function(){
                        //Roulette.beginSpin()
                        //Roulette.Mode = 1;
                        Roulette.get_result();
                    }]
                    ]), 2);
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0.875 - (context.measureText(words[5]).width*0.5)/canvas_width, 0.93, 0.18, 0.14]],
                    ['clickable', false],
                    ['color', '#000000'],
                    ['text', words[5]],
                    ]), 3);
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0.1, 0.86 , 0.07, aspect_ratio * 0.07]],
                    ['clickable', true],
                    ['id', 'exit_btn'],
                    ['image', Roulette.Images.ExitBtn],
                    ['onClick', return_to_lobby]
                    ]), 2);
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0.175, 0.86 , 0.07, aspect_ratio * 0.07]],
                    ['clickable', true],
                    ['id', 'hot_cold_btn'],
                    ['target', HotColdMenu],
                    ['image', Roulette.Images.hot_cold_btn],
                    ['onClick', function(){this.target.open = !this.target.open;}]
                    ]), 2);
        
        interaction_buttons.add_child(Roulette.new_obj([
                    ['transform', [0,0.81,1,0.2]],
                    ['clickable', false],
                    ['id', 'interaction_background'],
                    ['image', Roulette.Images.green_felt]
                    ]), 0);
                    
        table.add_child(interaction_buttons, 2);
        
        
        table.add_child(Roulette.new_obj([
                    ['transform', [0, 
                                    tile_transform[3] * 3 + 0.15 + (1 - (tile_transform[3] * 3 + 0.15) - 0.15) / 2,
                                    0.15 * 9/16,
                                    0.15]],
                    ['clickable', true],
                    ['id', 'bet_bar_toggle'],
                    ['image', Roulette.Images.BetBarToggle],
                    ['onClick', function(){
                        Roulette.BetBar.SHOW = !Roulette.BetBar.SHOW;
                        }]
                    ]), 6);
        
        this.BetBar = Roulette.new_obj([
                    ['transform', [0,0,0.21,1]],
                    ['image', Roulette.Images.BetBar],
                    ['clickable', true],
                    ['id', 'BetBar'],
                    ['onClick', function(){
                        
                        var disp = Roulette.get_objs_with_tag('ChipDisp')[0];
                        disp.last = Roulette.Mouse.y;
                        
                        
                        
                        var height = canvas_height * disp.transform[3];
                        var percent = (height - Roulette.Mouse.y + canvas_height * disp.transform[1]) / height;
                        var trans = scale_transform(disp.transform);
                        if(Roulette.Mouse.y < trans[1] || Roulette.Mouse.y >= trans[1] + trans[3])
                            return;
                        if(percent < 0)
                            percent = 0;
                        if(percent > 1)
                            percent = 1;
                        Roulette.Current_Bet = Math.floor(percent * (money - Roulette.final_bet()));

                        }],
                    ['SHOW', false],
                    ['conditions', [function(arg){
                            //return true;}]]
                            //console.log(Roulette.BetBar.SHOW);
                            return Roulette.BetBar.SHOW;}]]
                    ]);
        this.BetBar.add_child(Roulette.new_obj([
                    ['transform', [0.01,0.1,0.2,0.2]],
                    ['clickable', false],
                    ['text', ''],
                    ['color', '#ffffff'],
                    ['id', 'BetBarCurrentBetDisp'],
                    ['font', auto_size_text('10000', canvas_width * 0.19, canvas_height * 0.1) + font],
                    ['update', function(){
                        this.text = Roulette.Current_Bet;
                        }]
                    ]), 2);
        this.BetBar.add_child(Roulette.new_obj([
                    ['transform', [0.01,0.14,0.07,tile_transform[3]*3 + 0.15 - 0.14]],
                    ['clickable', false],
                    /*['onClick', function(){
                            console.log(Roulette.Mouse.y);
                            //var percent = (Roulette.Mouse.y - canvas_height * this.transform[0]) / (this.transform[3] * canvas_height);
                            this.last = Roulette.Mouse.y;
                            
                        }],*/
                    ['last', 0],
                    ['id', 'ChipDisp'],
                    ['update', function(){

                                var height = canvas_height * this.transform[3];
                                var percent = (height - this.last) / height;
                                percent = Roulette.Current_Bet / (money - Roulette.final_bet());
                                if(percent < 0)
                                    percent = 0;
                                if(percent > 1)
                                    percent = 1;
                                var trans = scale_transform(this.transform);
                                var chip_height = trans[3] * 0.08;
                                for(var i = 0; i < percent * 25; i++){
                                    context.drawImage(Roulette.Images.BarChipImg, trans[0], trans[1] + trans[3] - chip_height * 0.5 * (i + 2), trans[2], chip_height);
                                }
                        }]
                    ]), 1);
                    

        var end_screen = Roulette.new_obj([
                ['clickable', true],
                ['SHOW', false],
                ['id', 'end_screen'],
                ['conditions', [function(arg){return arg.SHOW;}]]
                ]);
        end_screen.add_child(Roulette.new_obj([
                ['transform', [0.15, -0.25, 0.7, 1.5]],
                ['clickable', false],
                ['alpha', 0.7],
                ['id', 'end_screen_black'],
                ['image', vp_win_black]
                ]), 1);
        var end_money_disp = Roulette.new_obj([
                    ['transform', [0.355, 0.3, 0.29, 0.12]],
                    ['id', 'end_money_display'],
                    ['clickable', true],
                    ['onClick', open_store],
                    ['image', Roulette.Images.money_display]
                    ]);
                    
        end_money_disp.add_child(Roulette.new_obj([
                    ['transform', [0.28, 0.93, 0.15, 0.12]],
                    //['transform', [0.28, 0.85, 0.29, 0.12]],
                    ['parent', end_money_disp],
                    ['id', 'end_money_disp_txt'],
                    ['text_style', 1],
                    ['text', 0],
                    ['update', function(){
                        this.transform[0] = this.parent.transform[0] + this.parent.transform[2] * 0.01;
                        this.transform[1] = this.parent.transform[1] + this.parent.transform[3] * 0.7;
                        this.text = '$' + money;
                        }]
                    ]), 1);
                    
        end_screen.add_child(end_money_disp, 3);
        end_screen.add_child(Roulette.new_obj([
                ['transform', [0.27, 0.49, 0.22, 0.07]],
                ['image', Roulette.Images.new_bet_btn],
                ['id', 'new_bet_btn'],
                ['clickable', true],
                ['onClick', function(){
                    Roulette.reset();
                    Roulette.WinController.SHOW = false;
                    }]
                ]), 2);
        end_screen.add_child(Roulette.new_obj([
                ['transform', [0.52, 0.49, 0.22, 0.07]],
                ['image', Roulette.Images.replay_btn],
                ['id', 'replay_btn'],
                ['clickable', true],
                ['onClick', function(){
                    //Roulette.reset();
                    if(money < Roulette.final_bet()){
                        Roulette.reset();
                        Roulette.WinController.SHOW = false;
                        return;
                    }
                    //Roulette.Bets = Roulette.LastBets.slice();
                    //console.log(Roulette.LastBets);
                    Roulette.get_result();
                    }]
                ]), 2);

        end_screen.add_child(Roulette.new_obj([
                ['transform', [0.335, 0.13, 0.315, 0.20]],
                ['image', Roulette.Images.roulette_logo],
                ['clickable', false],
                ['id', 'roulette_logo']
                ]), 2);
        end_screen.add_child(Roulette.new_obj([
                ['transform', [0.335, 0.08, 0.07, 0.06]],
                ['image', logo_tilt],
                ['clickable', false],
                ['id', 'tilt_logo']
                ]), 3);

        Roulette.WinController = Roulette.new_obj([
                ['clickable', true],
                ['id', 'WinController'],
                ['SHOW', false],
                ['child', end_screen],
                ['exp_disp', true],
                ['onClick', function(){
                 Roulette.reset();
                 Roulette.WinController.SHOW = false;
                        }],
                ['begin', function(){
                    this.SHOW = true;
                    this.exp_disp = true;
                    var timerr = Roulette.new_timer(1200, function(){
                        if(!Roulette.Wheel.spinning && !isBigSpin){
                            if(Math.floor(experience / 100) > Math.floor((experience - 15) / 100)){
                                wheel_init(function(){});
                            }
                        }
                        this.target.exp_disp = false;
                        }, false);
                    timerr.target = this;
                    Roulette.timers.push(timerr);
                    }],
                ['conditions', [function(arg){return arg.SHOW;}]],
                ['update', function(){
                    if(this.exp_disp){
                        context.drawImage(Roulette.Images.win_overlay, canvas_width * 0.28, canvas_height * 0.13, canvas_width * 0.585, canvas_height * 0.37);
                        last_winning = '  $' + last_win;
                        vp_draw_win_graphics();
                    }else{
                        this.child.SHOW = true;
                    }
                    }],
                ]);
        Roulette.WinController.add_child(end_screen, 1);
        table.add_child(Roulette.WinController, 9);
        
        table.add_child(this.BetBar, 4);
        this.GraphicsObj.add_child(table, 1);
        
        
        var Wheel = Roulette.new_obj([
                ['id', 'Wheel'],
                ['clickable', true],
                ['conditions', [function(arg){return Roulette.Mode == 1;}]]
                ]);
                
        // #JUMP
        var height = aspect_ratio * 1.4;
        this.Wheel = Roulette.new_obj([
                ['transform', [-0.2, (1.2 - height * 0.5), 1.4, height]],
                ['transform_orig', [-0.2, (1.2 - height * 0.5), 1.4, height]],
                //['image', Roulette.Images.Wheel],
                ['order', [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]],
                ['id', 'wheel_graphic'],
                ['spinning', false],
                ['angle', 0],
                ['clickable', true],
                //['onClick', function(){Roulette.beginSpin();}],
                ['onClick', function(){}],
                ['angular', 0.5],
                ['max_angular', 2],
                ['min_spins', 1],
                ['stopping', false],
                ['accel', 0.1],
                ['deccel', 0.01],
                ['bottom', 1],
                ['update', function(){
                        Roulette.wheel_update(this);
                        var transform = scale_transform(this.transform);
                        drawRotatedImage(Roulette.Images.Wheel, this.transform, this.angle);
                        }],
                ]);
        this.Wheel.add_child(Roulette.new_obj([
                ['transform', [this.Wheel.transform[0] + this.Wheel.transform[2] * 0.13,
                        //this.Wheel.transform[1] + this.Wheel.transform[3] * 0.6,
                        0.8,
                        this.Wheel.transform[2] * 0.025,
                        this.Wheel.transform[3] * 0.025
                        ]],
                ['transform_orig', [-.05, 1]], // #NOTE This should not be hard coded, but it should be fine
                ['update', this.ball_update],
                ['id', 'Ball'],
                ['locked', false],
                
                ['velocity', 0],
                ['max_angular', 5],
                ['min_spins', 2],
                ['dist', 0],
                ['closest_to_center', 0.42],
                ['angle', 180],
                ['accel', 0.15],
                ['deccel', 0.1],
                ['image', Roulette.Images.Ball]
                ]), 2);
        Wheel.add_child(this.Wheel, 1);

        
        
        
        
        
        this.GraphicsObj.add_child(Wheel, 2);
        
        
        // #BEGIN
        this.Initialized = true;
        //console.log("Roulette Fully Initialized");
    },
    
    
    new_obj: function(args){
        // Initializing Variables
        var obj = new Object();
        obj.type = "object";
        obj.clickable = false;
        obj.onClick = null;
        obj.visible = true;
        obj.fillColor = null;
        obj.image = null;
        obj.id = "";
        obj.conditions = [];
        obj.transform = [0,0,1,1];
        obj.children = [];
        obj.update = null;
        
        obj.color = null;
        obj.font = null;
        obj.text_style = 0;
        obj.text = null;
        
        // Setting Custom Variables
        for(var i = 0; i < args.length; i++){
            obj[args[i][0]] = args[i][1];
        }
        
        // Initializing Object Functions
        obj.isClicked = function(x,y){
            var trans = scale_transform(this.transform);
            if(x >= trans[0] && x <= trans[0] + trans[2]){
                if(y >= trans[1] && y <= trans[1] + trans[3]){
                    if(this.onClick != null){
                        this.onClick();
                        return true;
                    }
                }
            }
            return false;
        };
        
        obj.add_child = function(child, priority){
            var index = 0;
            for(var i = 0; i < this.children.length; i++){
                if(this.children[i][1] < priority){
                    index = i + 1;
                } else {
                    break;
                }
            }
            this.children.splice(index, 0, [child, priority]);
        };
        
        obj.check_conditions = function(){
            for(var i = 0; i < this.conditions.length; i++){
                if(!this.conditions[i](obj))
                    return false;
            }
            return true;
        }
        return obj;
    },
    
    
    new_timer_millis(duration, onComplete, loop){
        var obj = new Object();
        obj.duration = duration;
        obj.complete = false;
        obj.loop = loop;
        obj.onComplete = onComplete;
        obj.start = new Date().getTime();
        obj.tick = function(arg){
            var now = new Date().getTime();
            if(now - arg.start > arg.duration){
                arg.complete = true;
                arg.onComplete();
            }
        };
        return obj;
    },
    
    new_timer(duration, onComplete, loop){
        var obj = new Object();
        obj.duration = duration;
        obj.complete = false;
        obj.loop = loop;
        obj.onComplete = onComplete;
        obj.current = 0;
        obj.tick = function(arg){
            if(arg.current < arg.duration){
                arg.current++;
                if(arg.current == arg.duration){
                    arg.complete = true;
                    arg.onComplete();
                }
            }
        };
        return obj;
    },
    
    get_objs_with_tag: function(tag, parent){
        function has_tag(obj){
            if(obj.id == tag){
                objs.push(obj);
            }
            for(var i = 0; i < obj.children.length; i++)
                has_tag(obj.children[i][0]);
        }
        if(parent == undefined){
            //console.log("Setting Parent");
            if(Roulette.GraphicsObj == null)
                return;
            parent = Roulette.GraphicsObj;
            
        }
        
        var objs = [];
        has_tag(parent);
        return objs;
    },

    final_bet: function(){
        var total = 0;
        for(var i = 0; i < this.Bets.length; i++){
            total += this.Bets[i].bet;
        }
        return total;
    },
    
    
    // #TICK
    tick: function(){
        for(var i = 0; i < Roulette.timers.length; i++){
            Roulette.timers[i].tick(Roulette.timers[i]);
            if(Roulette.timers[i].complete){
                if(!Roulette.timers[i].loop){
                    Roulette.timers.splice(i,1);
                } else {
                    Roulette.timers[i].complete = false;
                    if(Roulette.timers[i].start != undefined){
                        Roulette.timers[i].start = new Date().getTime();
                    } else {
                        Roulette.timers[i].current = 0;
                    }
                }
            }
        }
    },
    
    
    // Primary Draw loop
    draw: function(){
        if(Roulette.Initialized){
            Roulette.draw_obj(Roulette.GraphicsObj);
        }
        
        if(isBigSpin){
            wheel_graphics();
        } else if(store_open){
            store_graphics();  
        }
    },
    
    // Recursively Draw all objects and their children whose conditions evaluate to true
    draw_obj: function(obj){
        if(obj.visible && obj.check_conditions()){
            if(obj.alpha != null){
                context.globalAlpha = obj.alpha;
            }
            if(obj.update != null)
                obj.update(obj);
            if(obj.image != null){
                var trans = scale_transform(obj.transform);
                context.drawImage(obj.image, trans[0], trans[1], trans[2], trans[3]);
            } else if(obj.text != null){
                if(obj.font != null){
                    context.font = obj.font;
                }
                if(obj.color != null)
                    context.fillStyle = obj.color;
                
                var trans = scale_transform(obj.transform);
                if(obj.text_style == 0){
                    context.fillText(obj.text, trans[0], trans[1], trans[2], trans[3]);
                } else if(obj.text_style == 1){
                    draw_fancy_text(obj.text, trans[0] + trans[2] * 0.5 - context.measureText(obj.text).width / 2, trans[1]);
                } else if(obj.text_style == 2){
                    drawRotatedText(obj.text, trans, -90);
                }
            } else if(obj.fillColor != null){
                context.fillStyle = obj.fillColor;
                var trans = scale_transform(obj.transform);
                context.fillRect(trans[0], trans[1], trans[2], trans[3]);
            }
            context.globalAlpha = 1;
            for(var i = 0; i < obj.children.length; i++){
                Roulette.draw_obj(obj.children[i][0]);
            }
        }
    },
    
    
    
    on_click: function(event){

        Roulette.ClickResolved = false;
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        
        Roulette.timers.push(Roulette.new_timer(6, function(){Roulette.ClickResolved = true;}, false));
        
        if(isBigSpin && !Roulette.ClickResolved){
            wheel_click_manager(x,y);
            Roulette.ClickResolved = true;
        }
        
        if(store_open && !Roulette.ClickResolved){
            if(store_click(x,y)){}
            else close_store();
            Roulette.ClickResolved = true;
        }
        
        
        // This is a bit of a hack... but it makes everything shorter and faster...
        if(y >= Roulette.TableChips.transform[3] * canvas_height){
            for(var i = 0; i < Roulette.Bets.length; i++){
                if(Roulette.Bets[i].follow){
                    Roulette.removeBet(Roulette.Bets[i].tag);
                }
            }
        }
        if(Roulette.Initialized && !Roulette.ClickResolved){
            Roulette.check_click(Roulette.GraphicsObj, x, y);
        }
        Roulette.Sounds.on_click();

    },
    
    check_click(obj, x, y){
        if(obj.clickable && obj.check_conditions() && !Roulette.ClickResolved){
            for(var i = obj.children.length - 1; i > -1; i--){
                Roulette.check_click(obj.children[i][0], x, y);
            }
            if(!Roulette.ClickResolved){
                Roulette.ClickResolved = obj.isClicked(x,y);
            }
        }
    },
    
    mouse_up: function(event){
        Roulette.Mouse.follow = false;
    },
    
    mouse_down: function(event){
        //console.log(Roulette.ClickResolved);
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop; 
        if(Roulette.TableChips.isClicked(x,y))
            Roulette.ClickResolved = true;
        if(Roulette.BetBar.SHOW && Roulette.BetBar.isClicked(x,y)){
            Roulette.Mouse.follow = true;
        } else {
            Roulette.Mouse.follow = false;
            Roulette.BetBar.SHOW = false;
        }
    },
    
    mouse_move: function(event){
        Roulette.Mouse.x = event.clientX - canvas.offsetLeft;
        Roulette.Mouse.y = event.clientY - canvas.offsetTop;
        if(Roulette.Mouse.follow && Roulette.BetBar.SHOW){
            var ChipDisp = Roulette.get_objs_with_tag("ChipDisp", Roulette.BetBar)[0];
            var y = event.clientY - canvas.offsetTop;
            if(y > canvas_height * (ChipDisp.transform[1] + ChipDisp.transform[3]))
                return;
            var top_margin = canvas_height * ChipDisp.transform[1];
            var bottom_margin = canvas_height * (ChipDisp.transform[3] - ChipDisp.transform[1]);
            y -= top_margin;
            ChipDisp.last = y;
            var height = canvas_height * ChipDisp.transform[3];
            var percent = (height - y) / height;
            //console.log(percent, y);
            if(percent < 0)
                percent = 0;
            if(percent > 1)
                percent = 1;
            Roulette.Current_Bet = Math.floor(percent * (money - Roulette.final_bet()));
        }
    },
    
    
    
    //#WHEEL
    wheel_update: function(arg){
        
        
        if(arg.transform[1] > arg.transform_orig[1]){
            arg.transform[1] -= 0.018;
        }
        
        
        if(!arg.spinning)
            return;
        
        if(!arg.stopping){
            if(arg.angular < arg.max_angular){
                arg.angular += arg.accel;
                if(arg.angular > arg.max_angular)
                    arg.angular = arg.max_angular;
            }
            var deccel_dist = 0;
            var vel = arg.angular;
            while(vel > 0){
                deccel_dist += vel;
                vel -= arg.deccel;
            }
            //console.log(is_within((arg.angle + deccel_dist)%360, Roulette.find_angle(Roulette.Result)), (arg.angle + deccel_dist)%360, Roulette.find_angle(Roulette.Result));
            var angl = (arg.angle - deccel_dist) % 360;
            if(angl < 0)
                angl += 360;
            if(Roulette.is_within(angl, Roulette.find_angle(Roulette.Result)) && Math.abs(arg.angle) > arg.min_spins * 360){
                console.log(Roulette.find_angle(Roulette.Result));
                console.log("Stopping");
                arg.stopping = true;
            }
        } else {
            if(arg.angular > 0){
                arg.angular -= arg.deccel;
            } else {
                // #COMPLETE
                arg.angular = 0;
                arg.spinning = false;
                Roulette.timers.push(Roulette.new_timer(600, function(){
                    Roulette.spinComplete();
                    }, false));
            }
        }
        
        arg.angle -= arg.angular;
    },
    
    ball_update: function(arg){
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
        };

        var center = scale_transform([Roulette.Wheel.transform[0] + Roulette.Wheel.transform[2] / 2, 
                            Roulette.Wheel.transform[1] + Roulette.Wheel.transform[3] / 2, 
                            ]);

        var trans = scale_transform(this.transform_orig);

        trans[0] += this.transform[2] / 2;
        trans[1] += this.transform[3] / 2;
        
        //console.log(trans);


        //console.log(trans);
        
        var start_offset = 77;
        
        

        if(Roulette.is_within(this.angle % 360, ((Roulette.Wheel.angle - Roulette.find_angle(Roulette.Result) + start_offset) % 360) + 360)&& !this.locked && Math.abs(this.angle) > 360 * this.min_spins && this.transform[1] > 1){
            //console.log("Found");
            this.locked = true;
            Roulette.Sounds.on_spin_done();
        }
        
        var angle = this.angle;        
        if(Roulette.Wheel.spinning){
            if(!this.locked){
                if(this.velocity < this.max_angular){
                    this.velocity += this.accel;
                    if(this.velocity > this.max_angular)
                        this.velocity = this.max_angular;
                }
                
                if(this.dist < this.closest_to_center){
                    this.dist += 0.001;
                }
            } else {
                
                this.dist = this.closest_to_center;
                
                this.velocity = 0;
                this.angle = Roulette.Wheel.angle - Roulette.find_angle(Roulette.Result) + start_offset;
                if(this.angle < 0){
                    this.angle += 360;
                }
            }
        }
        trans = move_towards(trans, center, this.dist);

        
        this.angle += this.velocity;
        
        angle *= TO_RADIANS;
        //trans = move_toward(trans, center, 0.01);
        var x = Math.cos(angle) * (trans[0] - center[0]) - Math.sin(angle) * (trans[1] - center[1]) + center[0];
        
        //var y = Math.sin(this.angle) * (this.transform[0] - center[0]) - Math.cos(this.angle) * (this.transform[1] - center[1]) + center[1];
        var y = Math.sin(angle) * (trans[0] - center[0]) + Math.cos(angle) * (trans[1] - center[1]) + center[1];
        

        

        
        /*
        context.strokeStyle = "#000000";
        context.beginPath();
        context.arc(center[0], center[1], canvas_width * 0.3, 0, Math.PI * 2);
        context.stroke();
        context.fill();
        */
        
        this.transform[0] = x / canvas_width - this.transform[2] / 2;
        this.transform[1] = y / canvas_height - this.transform[3] / 2;



        //var t = scale_transform(this.transform);
        //context.drawImage(Roulette.Images.Ball, t[0], t[1], t[2], t[3]);
        
    },
    
    //205
    find_angle: function(num){
        if(this.Wheel.order.indexOf(num) != -1)
            return 360 - (360 / this.Wheel.order.length) * this.Wheel.order.indexOf(num);
        return 0;
    },
    
    
    is_within: function(wheel_angle, point_angle){
        var angl = 360 / Roulette.Wheel.order.length;
        if(point_angle >= wheel_angle - angl / 2 && point_angle <= wheel_angle + angl / 2){
            return true;
        }
        return false;
    },
    
    
    save_load_hot_cold: function(){
        //console.log("Save Load Hot Cold");
        if(Roulette.Hot.length > 0){
            //console.log("Saving Hot Cold ", Roulette.Hot);
            localStorage.setItem('roulette_hot', Roulette.Hot);
            localStorage.setItem('roulette_cold', Roulette.Cold);
        } else {
            //console.log("Loading Hot Cold");
            var hot_str = localStorage.getItem('roulette_hot');
            var cold_str = localStorage.getItem('roulette_cold');
            if(hot_str != '' && hot_str != null){
                Roulette.Hot = hot_str.split(',');
                Roulette.Cold = cold_str.split(',');
            } else {
                Roulette.Hot = [];
                for(var i = 0; i < 3; i++){
                    var rand = Math.floor(Math.random() * 36) + 1;
                    if(Roulette.Hot.indexOf(rand) == -1)
                        Roulette.Hot.push(rand);
                }
                Roulette.Cold = [];
                while(Roulette.Cold.length < 3){
                    var rand = Math.floor(Math.random() * 36) + 1;
                    if(Roulette.Hot.indexOf(rand) == -1 && Roulette.Cold.indexOf(rand) == -1)
                        Roulette.Cold.push(rand);
                }
            }
        }
        //localStorage
    },
    
    clone_obj(obj){      
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
  
    },
};