var MoneyWheel = {
    draw_loop: null,
    GraphicsObj: null,
    Initialized: false,
    ClickResolved: true,
    Spinning: false,
    SpinComplete: false,
    FollowMouse: false,
    Result: 0,
    Games: 1,
    Bets: [],
    timers: [],
    Wheel: null,
    BetBar: null,
    ChipBar: null,
    Images: null,
    Sounds: null,
    ResultReceived: false,
    GameDelay: 2.5,
    StopTime: 0,
    ShowBet: false,
    CurrentBet: 0,
    FreeSpins: 0,
    FreeSpinStart: 0,
    FreeSpinDelay: 1500,
    EndScreen: null,
    multipliers: [],
    
    Mouse: {
        x: 0,
        y: 0,
        isFollowed: false,
        click_count: 0
    },
    
    return_to_lobby: function(){
        //console.log("Needs to be implemented!");
        // alert("money");
        return_to_lobby();
    },
    increase_games: function(){
        if(MoneyWheel.Games < 5 && money >= MoneyWheel.final_bet() * MoneyWheel.Games + 1){
            MoneyWheel.Games++;
        }
    },
    
    decrease_games: function(){
        if(MoneyWheel.Games > 1){
            MoneyWheel.Games--;
        }
    },
    /*
    begin_spin: function(){
        console.log("Beginning Spin!");
    },
    */
    
    final_bet: function(){
        var b = 0;
        for(var i = 0; i < this.Bets.length; i++){
            b += this.Bets[i][1];
        }
        return b;
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
            if(MoneyWheel.GraphicsObj == null)
                return;
            parent = MoneyWheel.GraphicsObj;
            
        }
        
        var objs = [];
        has_tag(parent);
        return objs;
    },
    
    add_bet: function(type, amount){
        if(amount + this.final_bet() > money || this.Spinning || amount == 0)
            return;
        for(var i = 0; i < this.Bets.length; i++){
            if(this.Bets[i][0] == type){
                this.Bets[i][1] += amount;
                if(this.CurrentBet > money - this.final_bet()){
                    console.log("Setting Current Bet!");
                    this.CurrentBet = money - this.final_bet();
                }
                return;
            }
        }
        this.Bets.push([type, amount]);
        if(this.CurrentBet > money - this.final_bet()){
            console.log("Setting Current Bet!");
            this.CurrentBet = money - this.final_bet();
        }
        if(this.ShowBet)
            this.ShowBet = false;
    },
    clear_bet: function(type){
        for(var i = 0; i < this.Bets.length; i++){
            if(this.Bets[i][0] == type){
                var swp = [];
                for(var j = 0; j < this.Bets.length; j++){
                    if(j != i)
                        swp.push(this.Bets[j]);
                }
                this.Bets = swp;
            }
        }
    },
    
    move_bet: function(type1, type2){
        for(var i = 0; i < this.Bets.length; i++){
            if(this.Bets[i][0] == type1){
                this.add_bet(type2, this.Bets[i][1]);
                this.clear_bet(type1);
            }
        }
    },
    
    
    load_sounds: function(){
        var audio_dir = 'sound/moneywheel/';
        MoneyWheel.Sounds = {
            sound_temp_volume: MusicManager.volume * 0.3,
            
            click: new Audio(audio_dir + '1.wav'),
            
            winner: new Audio(audio_dir + 'thewinner.wav'),
            one: new Audio(audio_dir + '1.wav'),
            two: new Audio(audio_dir + '2.wav'),
            five: new Audio(audio_dir + '5.wav'),
            ten: new Audio(audio_dir + '10.wav'),
            twenty: new Audio(audio_dir + '20.wav'),
            fourty: new Audio(audio_dir + 'lucky.wav'),
            
            fart: new Audio(audio_dir + 'fart.wav'),
            splat: new Audio(audio_dir + 'Splat.wav'),
            boing: new Audio(audio_dir + 'Boing.wav'),
            
            //spin: new Audio(audio_dir + 'trollolol.mp3'),
            spin: new Audio(audio_dir + 'PrizeWheel.wav'),
            
            lose: new Audio(audio_dir + 'man-giggling-02.mp3'),
            
            on_lose: function(){
                this.play(this.lose);
            },
            
            on_spin: function(){
                this.spin.currentTime = 0;
                this.play(this.spin);
            },
            
            on_spin_end: function(){
                this.pause(this.spin);
            },
            
            reset_spin: function(){
                this.spin.currentTime = 0;
            },
            
            win: function(){
                
                var timer = MoneyWheel.new_timer((this.winner.duration) * 1000, function(){MoneyWheel.Sounds.play(this.target);}, false);
                if(MoneyWheel.Wheel.pies[MoneyWheel.Result].value == '1'){
                    this.play(this.winner);
                    timer.target = this.one;
                    MoneyWheel.timers.push(timer);
                } else if(MoneyWheel.Wheel.pies[MoneyWheel.Result].value == '2'){
                    this.play(this.winner);
                    timer.target = this.two;
                    MoneyWheel.timers.push(timer);
                } else if(MoneyWheel.Wheel.pies[MoneyWheel.Result].value == '5'){
                    this.play(this.winner);
                    timer.target = this.five;
                    MoneyWheel.timers.push(timer);
                } else if(MoneyWheel.Wheel.pies[MoneyWheel.Result].value == '10'){
                    this.play(this.winner);
                    timer.target = this.ten;
                    MoneyWheel.timers.push(timer);
                } else if(MoneyWheel.Wheel.pies[MoneyWheel.Result].value == '20'){
                    this.play(this.winner);
                    timer.target = this.twenty;
                    MoneyWheel.timers.push(timer);
                } else if(MoneyWheel.Wheel.pies[MoneyWheel.Result].value == '40'){
                    this.play(this.winner);
                    timer.target = this.fourty;
                    MoneyWheel.timers.push(timer);
                }
            },
            
            on_click: function(type){
                if(type == undefined){
                    var rand = Math.random() * 100;
                    if(rand < 10){
                        this.play(this.fart);
                    } else if(rand < 55){
                        this.play(this.splat);
                    } else {
                        this.play(this.boing);
                    }
                }
            },
            
            pause: function(sound){
                sound.pause();
            },
            
            play: function(sound){
                if(!sound_enabled)
                    return;
                var tmp = MusicManager.volume;
                MusicManager.setVolume(this.sound_temp_volume);
                var timer = MoneyWheel.new_timer(sound.duration * 1000, function(){MusicManager.setVolume(this.volume);}, false);
                timer.volume = tmp;
                MoneyWheel.timers.push(timer);
                sound.play();
            },
            
        };
    },
    
    // #IMAGE
    
    load_images: function(){
        vp_load_win_screen_images();
        MoneyWheel.Images = {
            Loaded: false,
            img_count: 0,
            load_count: 0,
            tiles: [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
            icons: [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
            pies: [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
            display_back: new Image(),
            display_minus: new Image(),
            display_plus: new Image(),
            exit_btn: new Image(),
            money_back: new Image(),
            wheel_outline: new Image(),
            money_wheel_logo: new Image(),
            spin_btn: new Image(),
            bet_display_btn: new Image(),
            bet_bar: new Image(),
            chip_img: new Image(),
            chip_board: new Image(),
            win_overlay: new Image(), 
            win_btn_back: new Image(),
            win_money_back: new Image(),
            background: new Image()
        };
        var dir = img_dir + "wheel/";

        MoneyWheel.Images.img_count = 13;
                
        MoneyWheel.Images.background.onload = this.img_load_callback;
        MoneyWheel.Images.background.src = dir + "background.png";

        MoneyWheel.Images.win_overlay.onload = this.img_load_callback;
        MoneyWheel.Images.win_overlay.src = dir + "moneywheel_win_overlay.png";
        
        MoneyWheel.Images.win_btn_back.onload = this.img_load_callback;
        MoneyWheel.Images.win_btn_back.src = dir + "win_button_back.png";
        
        MoneyWheel.Images.win_money_back.onload = this.img_load_callback;
        MoneyWheel.Images.win_money_back.src = dir + "win_money_background.png";

        MoneyWheel.Images.chip_img.onload = this.img_load_callback;
        MoneyWheel.Images.chip_img.src = dir + "CHIP.png";
        

        MoneyWheel.Images.chip_board.onload = this.img_load_callback;
        MoneyWheel.Images.chip_board.src = dir + "chip_board.png";
        

        MoneyWheel.Images.bet_display_btn.onload = this.img_load_callback;
        MoneyWheel.Images.bet_display_btn.src = dir + "bet_display_button.png";
        

        MoneyWheel.Images.bet_bar.onload = this.img_load_callback;
        MoneyWheel.Images.bet_bar.src = dir + "bet_bar.png";
        
        
        MoneyWheel.Images.exit_btn.onload = this.img_load_callback;
        MoneyWheel.Images.exit_btn.src = dir + "exit_btn.png";
        

        MoneyWheel.Images.money_back.onload = this.img_load_callback;
        MoneyWheel.Images.money_back.src = dir + "money_back.png";
        

        MoneyWheel.Images.wheel_outline.onload = this.img_load_callback;
        MoneyWheel.Images.wheel_outline.src = dir + "wheel_outline.png";
        

        MoneyWheel.Images.money_wheel_logo.onload = this.img_load_callback;
        MoneyWheel.Images.money_wheel_logo.src = dir + "money_wheel_logo.png";
        

        MoneyWheel.Images.spin_btn.onload = this.img_load_callback;
        MoneyWheel.Images.spin_btn.src = dir + "spin_btn.png";
        
        MoneyWheel.Images.img_count += MoneyWheel.Images.icons.length;
        MoneyWheel.Images.img_count += MoneyWheel.Images.tiles.length;
        for(var i = 0; i < MoneyWheel.Images.tiles.length; i++){
            MoneyWheel.Images.tiles[i].onload = this.img_load_callback;
            MoneyWheel.Images.icons[i].onload = this.img_load_callback;
        }
        
        
        var dir_mod = "icons/";
        MoneyWheel.Images.icons[0].src = dir + dir_mod + "icon_chicken.png";
        MoneyWheel.Images.icons[1].src = dir + dir_mod + "icon_cow.png";
        MoneyWheel.Images.icons[2].src = dir + dir_mod + "icon_jester.png";
        MoneyWheel.Images.icons[3].src = dir + dir_mod + "icon_bee.png";
        MoneyWheel.Images.icons[4].src = dir + dir_mod + "icon_pig.png";
        MoneyWheel.Images.icons[5].src = dir + dir_mod + "logo_icon.png";
        
        dir_mod = "tiles/";
        MoneyWheel.Images.tiles[0].src = dir + dir_mod + "tile_red.png";
        MoneyWheel.Images.tiles[1].src = dir + dir_mod + "tile_green_5.png";
        MoneyWheel.Images.tiles[2].src = dir + dir_mod + "tile_green_10.png";
        MoneyWheel.Images.tiles[3].src = dir + dir_mod + "tile_yellow.png";
        MoneyWheel.Images.tiles[4].src = dir + dir_mod + "tile_blue.png";
        MoneyWheel.Images.tiles[5].src = dir + dir_mod + "tile_purple.png";
        
        // Games Display Images
        MoneyWheel.Images.img_count += 3;
        MoneyWheel.Images.display_back.src = dir + "display_back.png";
        MoneyWheel.Images.display_back.onload = this.img_load_callback;
        MoneyWheel.Images.display_plus.src = dir + "plus.png";
        MoneyWheel.Images.display_plus.onload = this.img_load_callback;
        MoneyWheel.Images.display_minus.src = dir + "minus.png";
        MoneyWheel.Images.display_minus.onload = this.img_load_callback;
        
        
        MoneyWheel.Images.img_count += MoneyWheel.Images.pies.length;
        for(var i = 0; i < MoneyWheel.Images.pies.length; i++){
            MoneyWheel.Images.pies[i].onload = this.img_load_callback;
        }
        
        dir_mod = "pies/";
        MoneyWheel.Images.pies[0].src = dir + dir_mod + "1to1.png";
        MoneyWheel.Images.pies[1].src = dir + dir_mod + "2to1.png";
        MoneyWheel.Images.pies[2].src = dir + dir_mod + "5to1.png";
        MoneyWheel.Images.pies[3].src = dir + dir_mod + "10to1.png";
        MoneyWheel.Images.pies[4].src = dir + dir_mod + "20to1.png";
        MoneyWheel.Images.pies[5].src = dir + dir_mod + "40to1.png";
        MoneyWheel.Images.pies[6].src = dir + dir_mod + "x2.png";
        MoneyWheel.Images.pies[7].src = dir + dir_mod + "x3.png";
        MoneyWheel.Images.pies[8].src = dir + dir_mod + "x5.png";
        
        
    },
    
    img_load_callback: function(){
        MoneyWheel.Images.load_count++;
        if(MoneyWheel.Images.load_count < MoneyWheel.Images.img_count)
            return;

        // Creating Graphics Object
        if(!MoneyWheel.Initialized){
            MoneyWheel.GraphicsInit();
            MoneyWheel.Initialized = true;
            MoneyWheel.EndScreenInit();
        }
    },
    
    new_obj: function(args){
        // Initializing Variables
        var obj = new Object();
        obj.type = "object";
        obj.clickable = false;
        obj.onClick = null;
        obj.visible = true;
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
    
    
    new_timer(duration, onComplete, loop){
        var obj = new Object();
        obj.duration = duration;
        obj.start = new Date().getTime();
        obj.complete = false;
        obj.loop = loop;
        obj.onComplete = onComplete;
        obj.tick = function(arg){
            var now = new Date().getTime();
            if(now - arg.start > arg.duration){
                arg.complete = true;
                arg.onComplete();
            }
        };
        return obj;
    },
    
    
    tick: function(){
        for(var i = 0; i < MoneyWheel.timers.length; i++){
            MoneyWheel.timers[i].tick(MoneyWheel.timers[i]);
            if(MoneyWheel.timers[i].complete){
                if(!MoneyWheel.timers[i].loop){
                    MoneyWheel.timers.splice(i,1);
                } else {
                    MoneyWheel.timers[i].complete = false;
                    if(MoneyWheel.timers[i].start != undefined){
                        MoneyWheel.timers[i].start = new Date().getTime();
                    } else {
                        MoneyWheel.timers[i].current = 0;
                    }
                }
            }
        }
    },
    
    
    GraphicsInit: function(){
        MoneyWheel.GraphicsObj = MoneyWheel.new_obj([
            ['clickable', true],
            ['id', 'GraphicsObj']
        ]);
        MoneyWheel.GraphicsObj.clickable = true;
        
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                ['image', MoneyWheel.Images.background],
                ['id', 'background'],
                ]), 0);

                
        // Creating the Bet Table Buttons
        var transform = [0.075, 0.06, 0.235, 0.23];
        var bet_buttons = MoneyWheel.new_obj([
                ['clickable', true],
                ['id', 'bet_buttons']
                ]);
        var bet_btn_text = ["1", "2", "5", "10", "20", "40"];

        for(var i = 0; i < MoneyWheel.Images.tiles.length; i++){
            // Modify Transform Here
            var left = transform[0];
            if(i % 2 == 1)
                left += transform[2] + 0.02;
            var top = transform[1];
            top += Math.floor(i / 2) * (transform[3] + aspect_ratio * 0.02);

            var width = transform[2] * MoneyWheel.Images.tiles[i].width / MoneyWheel.Images.tiles[0].width;
            
            /*
            var icon_transforms = [
                [left + width * 0.1, top - transform[3] * 0.05, width * 0.39, transform[3]],
                [left + width * 0.1, top + transform[3] * 0.05, width * 0.42, transform[3] * 0.84],
                [left + width * 0.063, top + transform[3] * 0.05, width * 0.63, transform[3] * 0.84],
                [left + width * 0.1, top + transform[3] * 0.05, width * 0.5, transform[3] * 0.8],
                [left + width * 0.1, top + transform[3] * 0.05, width * 0.33, transform[3] * 0.9],
                [left - width * 0.03, top - transform[3] * 0.08, width * 0.55, transform[3]],
            ];
            */
            var icon_transforms = [
                [0.1, 0.04, 0.07, 0.235],//chicken
                [0.34, 0.04, 0.085, 0.235],//cow
                [0.08, 0.29, 0.13, 0.26],//jester
                [0.355, 0.31, 0.075, 0.22],//bee
                [0.095, 0.58, 0.07, 0.23],//pig
                [0.335, 0.71, 0.13, 0.09],//logo
            ];
            
            var tile = MoneyWheel.new_obj([
                    ['transform', [left, top, width, transform[3]]],
                    ['image', MoneyWheel.Images.tiles[i]],
                    ['type', 'bet_btn'],
                    ['id', 'bet_btn'],
                    ['num', i],
                    ['value', JSON.parse(bet_btn_text[i])],
                    ['clickable', true],
                    ['onClick', function(){
                        var chips = MoneyWheel.get_objs_with_tag("board_chip");
                        var can_add = true;
                        for(var i = 0; i < chips.length; i++){
                            if(chips[i].follow){
                                can_add = false;
                                break;
                            }
                        }
                        if(can_add)
                            MoneyWheel.add_bet(this.value, MoneyWheel.CurrentBet);
                        }]
                    ]);
            tile.add_child(MoneyWheel.new_obj([
                ['transform', icon_transforms[i]],
                ['type', 'bet_icon'],
                ['image', MoneyWheel.Images.icons[i]],
                ]), 1);
                
                
            var chip = MoneyWheel.new_obj([
                ['transform', [left  + width * 0.4, top + transform[3] * 0.5, transform[3] * 0.5 * 9/16, transform[3] * 0.5]],
                ['transform_orig', [left  + width * 0.4, top + transform[3] * 0.5, transform[3] * 0.5 * 9/16, transform[3] * 0.5]],
                ['value', bet_btn_text[i]],
                ['image', MoneyWheel.Images.chip_board],
                ['parent', tile],
                ['id', 'board_chip'],
                ['last_click', 0],
                ['follow', false],
                ['follow_initial', 0],
                ['clickable', false],
                ['onClick', function(){

                        this.follow = !this.follow;
                        //console.log(this.follow);
                        if(this.follow){
                            //MoneyWheel.clear_bet(this.value);
                            return;
                        } else {
                            var tiles = MoneyWheel.get_objs_with_tag('bet_btn');
                            for(var i = 0; i < tiles.length; i++){
                                var trans = scale_transform(tiles[i].transform);
                                if(MoneyWheel.Mouse.x >= trans[0] && MoneyWheel.Mouse.x <= trans[0] + trans[2]){
                                    if(MoneyWheel.Mouse.y >= trans[1] && MoneyWheel.Mouse.y <= trans[1] + trans[3]){
                                        //console.log(this.value, i);
                                        MoneyWheel.add_bet(tiles[i].value, this.children[0][0].text);
                                    }
                                }
                            }
                            MoneyWheel.clear_bet(this.value)
                            this.transform = this.transform_orig.slice();
                        }
                        

                        /*
                        if(this.transform[0] + this.transform[2] > this.transform_orig[0] && this.transform[0] < this.transform_orig[0] + this.transform_orig[2]
                            && this.transform[1] + this.transform[3] > this.transform_orig[1] && this.transform[1] < this.transform_orig[1] + this.transform_orig[3]){

                            MoneyWheel.clear_bet(this.value);
                            this.follow = false;
                            this.transform = this.transform_orig.slice();
                        }
                        */

                    }],
                ['update', function(){
                    if(this.follow){
                        //console.log("Updating");
                        //this.transform_orig = this.transform.slice();
                        this.transform[0] = MoneyWheel.Mouse.x / canvas_width - this.transform[2] / 2;
                        this.transform[1] = MoneyWheel.Mouse.y / canvas_height - this.transform[3] / 2;
                    } 
                    }],
                ['conditions', [function(arg){
                        var should_draw = false;
                        for(var i = 0; i < MoneyWheel.Bets.length; i++){
                            if(MoneyWheel.Bets[i][0] == parseInt(arg.value)){
                                should_draw = true;
                                break;
                            }
                        }
                        return should_draw;
                        return true;
                    }]]
                ]);
                
            chip.add_child(MoneyWheel.new_obj([
                ['transform', [chip.transform[0] + chip.transform[2] * 0.5, chip.transform[1] + chip.transform[3] * 0.8, chip.transform[2], chip.transform[3]]],
                ['color', '#ffffff'],
                ['parent', chip],
                ['font', auto_size_text("1000", canvas_width * chip.transform[2] * 0.8, canvas_height) + font],
                ['value', bet_btn_text[i]],
                ['text', "0"],
                ['clickable', false],
                ['conditions', [function(arg){
                        var should_draw = false;
                        for(var i = 0; i < MoneyWheel.Bets.length; i++){
                            if(MoneyWheel.Bets[i][0] == parseInt(arg.value)){
                                should_draw = true;
                                break;
                            }
                        }
                        return should_draw;
                    }]],
                ['update', function(arg){
                        this.transform = [this.parent.transform[0] + this.parent.transform[2] * 0.5 - (context.measureText(this.text).width * 0.2) / canvas_width, this.parent.transform[1] + this.parent.transform[3] * 0.65, this.parent.transform[2], this.parent.transform[3]];
                        for(var i = 0; i < MoneyWheel.Bets.length; i++){
                            if(MoneyWheel.Bets[i][0] == parseInt(this.value)){
                                this.text = MoneyWheel.Bets[i][1];
                                break;
                            }
                        }
                    }]
                ]), 4);
                
            tile.add_child(chip, 3);

                
            tile.add_child(MoneyWheel.new_obj([
                ['transform', [left + width * 0.6, top + transform[3] * 0.4, width, transform[3]]],
                ['font', auto_size_text("50", canvas_width * width * 0.35, canvas_height * transform[3] * 0.4) + font],
                ['type', 'btn_btn_txt'],
                ['text', bet_btn_text[i]],
                ['color', "#ffffff"]
                ]), 2);
            tile.add_child(MoneyWheel.new_obj([
                ['transform', [left + width * 0.65, top + transform[3] * 0.7, width, transform[3]]],
                ['font', auto_size_text("to 1", canvas_width * width * 0.3, canvas_height * transform[3] * 0.15) + font],
                ['type', 'btn_btn_txt_to_1'],
                ['text', "to 1"],
                ['color', "#ffffff"]
                ]), 2);
            bet_buttons.add_child(tile, 1);
        }
        MoneyWheel.GraphicsObj.add_child(bet_buttons, 1);
        
        // Creating the Games Display
        var games_disp_transform = [0.34, 0.885, 0.245, 0.1];
        var games_disp = MoneyWheel.new_obj([
                ['image', MoneyWheel.Images.display_back],
                ['type', 'money_disp'],
                ['id', 'money_disp'],
                ['transform', games_disp_transform],
                ['clickable', true]
                ]);
        games_disp.add_child(MoneyWheel.new_obj([
                ['transform', [games_disp_transform[0] + games_disp_transform[2] * 0.03, games_disp_transform[1] + games_disp_transform[3] * 0.7, games_disp_transform[2] * 0.4, games_disp_transform[3] * 0.4]],
                ['font', auto_size_text(words[2], canvas_width * games_disp_transform[2] * 0.3, canvas_height * games_disp_transform[3] * 0.6) + font],
                ['color', "#ffffff"],
                ['text', words[2]],
                ]), 1);
        games_disp.add_child(MoneyWheel.new_obj([
                ['transform', [games_disp_transform[0] + games_disp_transform[2] * 0.65, games_disp_transform[1] + games_disp_transform[3] * 0.75, games_disp_transform[2] * 0.3, games_disp_transform[3] * 0.2]],
                ['font', auto_size_text(words[2], canvas_width * games_disp_transform[2] * 0.7, canvas_height * games_disp_transform[3] * 0.6) + font],
                ['color', "#ffffff"],
                ["id", "game_disp"],
                ['update', function(){this.text = MoneyWheel.Games;}],
                ['text', "0"],
                ]), 1);

        // Games Display Plus Button
        games_disp.add_child(MoneyWheel.new_obj([
                ['image', MoneyWheel.Images.display_plus],
                ['transform', [games_disp_transform[0] + games_disp_transform[2] * 0.8,
                                games_disp_transform[1] + games_disp_transform[3] * 0.1,
                                games_disp_transform[3] * 0.8 * 9/16,
                                games_disp_transform[3] * 0.8]
                                ],
                ['clickable', true],
                ['onClick', this.increase_games]
                ]), 2);
        // Games Display Minus Button
        var height = games_disp_transform[3] * 0.8 * 9/16 * (MoneyWheel.Images.display_minus.height / MoneyWheel.Images.display_minus.width);
        games_disp.add_child(MoneyWheel.new_obj([
                ['image', MoneyWheel.Images.display_minus],
                ['transform', [games_disp_transform[0] + games_disp_transform[2] * 0.4,
                                games_disp_transform[1] + games_disp_transform[3] * 0.5 - height / 2,
                                games_disp_transform[3] * 0.8 * 9/16,
                                games_disp_transform[3] * 0.8 * 9/16 * (MoneyWheel.Images.display_minus.height / MoneyWheel.Images.display_minus.width)]
                                ],
                ['clickable', true],
                ['onClick', this.decrease_games]
                ]), 2);
        MoneyWheel.GraphicsObj.add_child(games_disp, 1);
        
        // Exit Btn
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                    ['transform', [0.005, 0.03, 0.065, aspect_ratio * 0.065]],
                    ['image', MoneyWheel.Images.exit_btn],
                    ['id', 'exit_btn'],
                    ['clickable', true],
                    ['onClick', this.return_to_lobby]
                    ]), 1);

        // Creating Bet Display
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                    ['transform', [0.005, 0.88, 0.06, aspect_ratio * 0.06]],
                    ['id', 'open_bet_display'],
                    ['image', MoneyWheel.Images.bet_display_btn],
                    ['clickable', true],
                    ['onClick', function(){MoneyWheel.ShowBet = !MoneyWheel.ShowBet;}]
                    ]), 5);
        MoneyWheel.BetBar = MoneyWheel.new_obj([
                    ['transform', [0, 0, 0.21, 1]],
                    ['image', MoneyWheel.Images.bet_bar],
                    ['id', 'bet_display'],
                    ['onClick', function(){
                        var disp = MoneyWheel.get_objs_with_tag('chip_bar')[0];
                        disp.last = MoneyWheel.Mouse.y;
                        
                        
                        
                        var height = canvas_height * disp.transform[3];
                        var percent = (height - MoneyWheel.Mouse.y + canvas_height * disp.transform[1]) / height;
                        var trans = scale_transform(disp.transform);
                        if(MoneyWheel.Mouse.y < trans[1] || MoneyWheel.Mouse.y >= trans[1] + trans[3])
                            return;
                        //console.log(percent, MoneyWheel.Mouse.y);
                        if(percent < 0)
                            percent = 0;
                        if(percent > 1)
                            percent = 1;
                        MoneyWheel.CurrentBet = Math.floor(percent * (money - MoneyWheel.final_bet()));
                        }],
                    ['clickable', true],
                    ['conditions', [function(){return MoneyWheel.ShowBet;}]],
                    ['update', function(){
                        }]
                    ]);
        MoneyWheel.BetBar.isClicked = function(x,y){
            var trans = scale_transform(this.transform);
            if(x >= trans[0] && x <= trans[0] + trans[2] * 0.4){
                if(y >= trans[1] && y <= trans[1] + trans[3]){
                    this.onClick();
                    return true;
                }
            }
            return false;
        };
        MoneyWheel.BetBar.add_child(MoneyWheel.new_obj([
                    ['clickable', false],
                    ['transform', [0.02, 0.1, 0.5, 0.5]],
                    ['color', "#ffffff"],
                    ['id', 'bet_bar_display'],
                    ['font', auto_size_text("10", canvas_width * 0.08, canvas_height) + font],
                    ['text', 0],
                    ['update', function(){this.text = MoneyWheel.CurrentBet;}],
                    ['id', 'bet_display']
                    ]), 2);
                    

        MoneyWheel.ChipBar = MoneyWheel.new_obj([
                    ['clickable', false],
                    ['transform', [0, 0.15, 0.1, 0.70]],
                    ['top_margin', 0],
                    ['bottom_margin', 0],
                    ['last', 0],
                    ['chips', []],
                    ['update', function(){
                                var height = canvas_height * this.transform[3];
                                var percent = (height - this.last) / height;
                                percent = MoneyWheel.CurrentBet / (money - MoneyWheel.final_bet());
                                if(percent < 0)
                                    percent = 0;
                                if(percent > 1)
                                    percent = 1;
                                var trans = scale_transform(this.transform);
                                var chip_height = trans[3] * 0.08;
                                for(var i = 0; i < percent * 25; i++){
                                    //context.drawImage(MoneyWheel.Images.chip_img, trans[0], trans[1] + trans[3] - chip_height * i, chip_height, trans[3]);
                                    context.drawImage(MoneyWheel.Images.chip_img, trans[0], trans[1] + trans[3] - chip_height * 0.5 * (i + 2), trans[2], chip_height);
                                    //context.drawImage(MoneyWheel.Images.chip_img, 0, trans[1] + trans[3] - chip_height * i, 100, 50);
                                }
                            }],
                    ['id', 'chip_bar']
                    ]);
        MoneyWheel.BetBar.add_child(MoneyWheel.ChipBar, 3);
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.BetBar, 4);
        
                    
        // Creating Money Display
        var money_disp = MoneyWheel.new_obj([
                    ['transform', [0.07, 0.885, 0.245, 0.1]],
                    ['image', MoneyWheel.Images.money_back],
                    ['clickable', true],
                    ['id', 'money_disp'],
                    ['onClick', open_store]
                    ]);
        
        money_disp.add_child(MoneyWheel.new_obj([
                    ['transform', [0.082, 0.955, 0.245, 0.1]],
                    ['text', 0],
                    ['color', '#00ad9f'],
                    ['font', auto_size_text('$10000', canvas_width * 0.12, canvas_height) + font],
                    ['update', function(){this.text = '$' + money;}],
                    ['onClick', open_store]
                    ]), 2);
        MoneyWheel.GraphicsObj.add_child(money_disp, 1);
                    
        // Adding Logo
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                    ['transform', [0.75, 0.62, 0.23, 0.23]],
                    ['id', 'money_wheel_logo'],
                    ['image', MoneyWheel.Images.money_wheel_logo],
                    ['conditions', [function(){
                        if(MoneyWheel.Spinning){
                            return false;
                        } else {
                            return true;
                        }
                    }]]
                    ]), 12);
                    
        // Creating Spin Btn
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                    ['transform', [0.81, 0.85, 0.17, 0.13]],
                    ['image', MoneyWheel.Images.spin_btn],
                    ['id', 'spin_btn'],
                    ['clickable', true],
                    ['onClick', this.begin_spin],
                    ['conditions', [function(){
                        if(MoneyWheel.Spinning){
                            return false;
                        } else {
                            return true;
                        }
                    }]]
                    ]), 13);
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                    ['transform', [0.835, 0.945, 0.17, 0.13]],
                    ['font', auto_size_text(words[3], canvas_width * 0.13, canvas_height * 0.09) + font],
                    ['color', '#ffffff'],
                    ['text', words[3]],
                    ['id', 'spin_btn_text'],
		     ['conditions', [function(){
                        if(MoneyWheel.Spinning){
                            return false;
                        } else {
                            return true;
                        }
                    }]],
                    ['clickable', false],
                    ]), 14);
        
        // CREATING THE WHEEL
        var pies = MoneyWheel.build_pies();
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.new_obj([
                    ['transform', [0.515, 0, 0.485, 1]],
                    ['image', MoneyWheel.Images.wheel_outline],
                    ['id', 'wheel_outline'],
                    ['type', 'wheel_component'],
                    ]), 10);
        MoneyWheel.Wheel = MoneyWheel.new_obj([
                    //['transform', [0.515, 0, 0.485, 1]],
                    ['transform', [0.82, -0.08, 0.4, 1]],
                    ['id', 'wheel'],
                    ['type', 'wheel_component'],
                    ['angular', 0],
                    //['max_angular', Math.PI * 0.2],
                    ['max_angular', Math.PI * 1.8],
                    ['angle', 0],
                    ['spins', 0],
                    ['min_spins', 0.7],
                    ['max_spins', 3],
                    ['stop_point', 0.5],
                    ['final_angle', 0],
                    ['accelerating', false],
                    ['accel_count', 0],
                    ['accel_time', 140],
                    //['accel', 0.006],
                    ['accel', 0.046],
                    //['deccel', 0.001],
                    ['deccel', 0.025],
                    ['update', function(){MoneyWheel.wheel_update(); MoneyWheel.draw_wheel();}],
                    ['pies', pies]
                    ]);
        MoneyWheel.GraphicsObj.add_child(MoneyWheel.Wheel, 8);
        
    },
    // This could be done by placing a large invisible clickable object on top of the entire game with the correct conditions to only appear after the game is done
    // The same conditions would have to apply to everything on the win screen
    EndScreenInit: function(){
        this.EndScreen = MoneyWheel.new_obj([
                    ['id', 'end_screen'],
                    ['clickable', true],
                    ['type', 'game_screen']
                ]);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['id', 'end_screen_black'],
                    ['transform', [0.08, -0.2, 0.82, 1.5]],
                    ['clickable', false],
                    ['alpha', 0.7],
                    ['image', vp_win_black]
                    ]), 1);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.285, 0.52, 0.155, 0.07]],
                    ['image', MoneyWheel.Images.win_btn_back],
                    ['id', 'select_btn'],
                    ['clickable', true],
                    ['onClick', function(){
                            MoneyWheel.reset();
                            MoneyWheel.Sounds.reset_spin();
                        }]
                    ]), 2);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    //['transform', [0.53, 0.52, 0.195, 0.07]],
                    ['transform', [0.53, 0.52, 0.155, 0.07]],
                    ['image', MoneyWheel.Images.win_btn_back],
                    ['id', 'replay_btn'],
                    ['clickable', true],
                    ['onClick', function(){
                            var tmp = MoneyWheel.Bets;
                            MoneyWheel.reset();
                            MoneyWheel.Bets = tmp;
                            if(MoneyWheel.final_bet() > money){
                                MoneyWheel.Bets = [];
                            } else {
                                MoneyWheel.begin_spin();
                            }
                        }]
                    ]), 2);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.38, 0.38, 0.24, 0.08]],
                    ['image', MoneyWheel.Images.win_money_back],
                    ['id', 'end_screen_money_back'],
                    ['clickable', true],
                    ['onClick', function(){
                            //MoneyWheel.reset();
                            //console.log("This SHOULD open the store");
                            open_store();
                        }]
                    ]), 2);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.185, 0.44, 0.5, 0.2]],
                    ['text', ''],
                    ['id', 'win_money_display'],
                    ['text_style', 1],
                    ['font', auto_size_text("$99,000,000", canvas_width * 0.17, canvas_height * 0.1) + font],
                    ['update', function(){this.text = "$" + money;}],
                    ]), 3);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.57, 0.57, 0.07, 0.195]],
                    ['text', 'Replay'],
                    ['text_style', 1],
                    ['id', 'replay_btn_txt'],
                    ['font', auto_size_text("New Game", canvas_width * 0.1, canvas_height * 0.8) + font],
                    ]), 3);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.32, 0.57, 0.07, 0.195]],
                    ['text', 'New Game'],
                    ['text_style', 1],
                    ['id', 'restart_btn_txt'],
                    ['font', auto_size_text("New Game", canvas_width * 0.1, canvas_height * 0.8) + font],
                    ]), 3);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.41, 0.14, 0.18, 0.2]],
                    ['image', MoneyWheel.Images.money_wheel_logo],
                    ['id', 'end_logo'],
                    ]), 3);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.42, 0.12, 0.06, 0.05]],
                    ['image', logo_tilt],
                    ['id', 'end_logo_tilt'],
                    ]), 4);
        this.EndScreen.add_child(MoneyWheel.new_obj([
                    ['transform', [0.59, 0.08, 0.09, 0.26]],
                    ['image', MoneyWheel.Images.icons[3]],
                    ['id', 'end_bee'],
                    ]), 4);
    },
    
    find_current: function(){
        for(var i = 0; i < MoneyWheel.Wheel.pies.length; i++){
            if(is_within(MoneyWheel.Wheel.angle, i))
                console.log(i, value);
                return i;
        }
    },
    
    init: function(){
        // alert("moneywheel");
        // Initializing Environment
        this.Result = 0;
        this.ResultReceived = false;
        this.CurrentBet = 0;
        store_open = false;
        //this.draw_loop = setInterval(this.draw, 1);
        this.reset();
        
        MoneyWheel.timer_loop = setInterval(MoneyWheel.tick, 1);
        resize_extra = this.GraphicsInit;
        canvas.addEventListener('click', this.on_click, false);

        canvas.addEventListener('mousedown', this.mouse_down, false);
        canvas.addEventListener('mouseup', this.mouse_up, false);
        canvas.addEventListener('mousemove', this.mouse_move, false);
        
        
        // document.addEventListener('click', this.on_click, false);
        // document.addEventListener('touchstart', this.on_click, false);
        document.addEventListener('touchmove', this.mouse_move, false);
        if(MoneyWheel.Images == null){
            this.load_images();
        }
        
        if(MoneyWheel.Sounds == null){
            MoneyWheel.load_sounds();
        }
        

        
        
    },
    

    
    reset: function(){
        store_open = false;
        this.multipliers = [];
        this.Bets = [];
        this.Games = 1;
        this.FollowMouse = false;
        this.ClickResolved = true;
        this.Result = 0;
        this.ResultReceived = false;
        this.SpinComplete = false;

    },
    
    // #DRAW
    draw: function(){
        if(MoneyWheel.Initialized && MoneyWheel.GraphicsObj != null){
            MoneyWheel.draw_obj(MoneyWheel.GraphicsObj);
        }

        if(MoneyWheel.board_chips == undefined){
            MoneyWheel.board_chips = MoneyWheel.get_objs_with_tag("board_chip");
        }else{
            var chips = MoneyWheel.board_chips;
            for(var i = 0; i < chips.length; i++){
                if(chips[i].follow)
                    MoneyWheel.draw_obj(chips[i]);
            }
        }
        
        // WIN GRAPHICS #WIN
        if(MoneyWheel.SpinComplete && !MoneyWheel.Spinning){
            if(isBigSpin){
                wheel_graphics();
                return;
            }


            if(new Date().getTime() - MoneyWheel.StopTime > 2500 * MoneyWheel.GameDelay){
                //console.log("Spin Complete, Decision Time!");
                if(MoneyWheel.Games > 0){
                    MoneyWheel.begin_spin();
                } else {
                    //this.reset();
                    MoneyWheel.draw_obj(MoneyWheel.EndScreen);
                }
            } else {
                vp_draw_win_graphics();
                context.drawImage(MoneyWheel.Images.win_overlay, canvas_width * 0.24, canvas_height * 0.10, canvas_width * 0.55, canvas_height * 0.47);
            }
        } else if(MoneyWheel.FreeSpins > 0 && !MoneyWheel.SpinComplete){
            if(new Date().getTime() - MoneyWheel.FreeSpinStart > MoneyWheel.FreeSpinDelay && MoneyWheel.FreeSpinStart != 0){
                MoneyWheel.FreeSpinStart = 0;
                console.log("Beginning Free Spin");
                MoneyWheel.begin_spin();
            }
        }
        
        if(store_open){
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
                obj.update();
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
                }
            }
            context.globalAlpha = 1;
            for(var i = 0; i < obj.children.length; i++){
                MoneyWheel.draw_obj(obj.children[i][0]);
            }
        }
    },
    
    cleanUp: function(){
        //clearInterval(MoneyWheel.draw_loop);
        clearInterval(MoneyWheel.timer_loop);
        resize_extra = blank;
        canvas.removeEventListener('click', MoneyWheel.on_click);
        canvas.removeEventListener('mousedown', MoneyWheel.mouse_down);
        canvas.removeEventListener('mouseup', MoneyWheel.mouse_up);
        canvas.removeEventListener('mousemove', MoneyWheel.mouse_move);
        
        document.removeEventListener('touchstart', MoneyWheel.on_click);
        document.removeEventListener('touchmove', MoneyWheel.mouse_move);
    },
    
    mouse_up: function(event){
        if(MoneyWheel.Mouse.isFollowed){
            MoneyWheel.Mouse.last = new Date().getTime();
            MoneyWheel.Mouse.isFollowed = false;
            var chips = MoneyWheel.get_objs_with_tag('board_chip');
            for(var i = 0; i < chips.length; i++){
                if(chips[i].check_conditions() && chips[i].follow){
                    chips[i].onClick();
                }
            }
        }
        MoneyWheel.FollowMouse = false;
    },
    
    mouse_down: function(event){
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop; 
        //console.log("Down!", MoneyWheel.BetBar.isClicked(x,y));
        if(MoneyWheel.ShowBet && MoneyWheel.BetBar.isClicked(x,y)){
            //console.log("Setting Follow!");
            MoneyWheel.FollowMouse = true;
        } else {
            //console.log("Checking Chips");
            var chips = MoneyWheel.get_objs_with_tag('board_chip');
            for(var i = 0; i < chips.length; i++){
                if(chips[i].check_conditions()){
                    var trans = scale_transform(chips[i].transform);
                    if(x >= trans[0] && x <= trans[0] + trans[2]){
                        if(y >= trans[1] && y <= trans[1] + trans[3]){
                            //console.log("Chip " + i + " is clicked");
                            //chips[i].follow = true;
                            chips[i].onClick();
                            MoneyWheel.Mouse.isFollowed = true;
                            break;
                        }
                    }
                }
            }
        }
    },
    
    mouse_move: function(event){
        MoneyWheel.Mouse.x = event.clientX - canvas.offsetLeft;
        MoneyWheel.Mouse.y = event.clientY - canvas.offsetTop;
        if(MoneyWheel.ShowBet && MoneyWheel.FollowMouse){
            //console.log(event.movementY);
            var y = event.clientY - canvas.offsetTop;
            var top_margin = canvas_height * MoneyWheel.ChipBar.transform[1];
            var bottom_margin = canvas_height * (MoneyWheel.ChipBar.transform[3] - MoneyWheel.ChipBar.transform[1]);
            y -= top_margin;
            if(y >= canvas_height * (MoneyWheel.ChipBar.transform[1] + MoneyWheel.ChipBar.transform[3]))
                return;
            
            MoneyWheel.ChipBar.last = y;
            var height = canvas_height * MoneyWheel.ChipBar.transform[3];
            var percent = (height - y) / height;
            if(percent < 0)
                percent = 0;
            if(percent > 1)
                percent = 1;
            MoneyWheel.CurrentBet = Math.floor(percent * (money - MoneyWheel.final_bet()));
            //MoneyWheel.CurrentBet = Math.floor(((canvas_height - y) / canvas_height * 0.8) * money);
        }
    },
    
    // #CLICK
    on_click: function(event){
        MoneyWheel.ClickResolved = false;
        if(new Date().getTime() - MoneyWheel.Mouse.last < 80){
            //console.log("Canceling Click");
            MoneyWheel.ClickResolved = true;
            return;
        }
        MoneyWheel.Mouse.last = new Date().getTime();
        
        if(store_open){
            if(store_click(event.clientX - canvas.offsetLeft,event.clientY - canvas.offsetTop)){}
            else close_store();
            MoneyWheel.ClickResolved = true;
        }
        if(!MoneyWheel.Spinning && MoneyWheel.SpinComplete && !isBigSpin && !MoneyWheel.ClickResolved){
            if(Math.floor(experience / 100) > Math.floor((experience - 15) / 100)){
                wheel_init(function(){
                    if(MoneyWheel.Games > 0){
                        MoneyWheel.begin_spin();
                    } else {
                        MoneyWheel.reset();
                    }});
                MoneyWheel.ClickResolved = true;
            } else {
                if(MoneyWheel.Games > 0){
                    MoneyWheel.begin_spin();
                    MoneyWheel.ClickResolved = true;
                } else {
                    //MoneyWheel.reset();
                    console.log("About to check end screen");
                    var x = event.clientX - canvas.offsetLeft;
                    var y = event.clientY - canvas.offsetTop;
                    MoneyWheel.check_click(MoneyWheel.EndScreen,x,y);
                    MoneyWheel.ClickResolved = true;
                }
            }
        } if(isBigSpin && !MoneyWheel.ClickResolved){
            wheel_click_manager(event.clientX - canvas.offsetLeft,event.clientY - canvas.offsetTop);
            MoneyWheel.ClickResolved = true;
        }
        if(MoneyWheel.Initialized && MoneyWheel.GraphicsObj != null && !MoneyWheel.FollowMouse && !MoneyWheel.ClickResolved){
            var x = event.clientX - canvas.offsetLeft;
            var y = event.clientY - canvas.offsetTop;
            MoneyWheel.check_click(MoneyWheel.GraphicsObj, x, y);
        }
        MoneyWheel.Sounds.on_click();
        MoneyWheel.Mouse.click_count++;
    },
    
    // Recursively checking all objects and their children whose conditions evaluate to true
    check_click(obj, x, y){
        //console.log("Checking " + obj.id);
        if(obj.clickable && obj.check_conditions() && !MoneyWheel.ClickResolved){
            for(var i = obj.children.length - 1; i > -1; i--){
                MoneyWheel.check_click(obj.children[i][0], x, y);
            }
            if(!MoneyWheel.ClickResolved){
                MoneyWheel.ClickResolved = obj.isClicked(x,y);
            }
        }
    },
    
    get_result: function(){
        if(uname.toLowerCase() == 'guest'){            
            MoneyWheel.Result = Math.floor(Math.random() * MoneyWheel.Wheel.pies.length);
            //MoneyWheel.Result = MoneyWheel.Wheel.pies.length - 1;
            MoneyWheel.ResultReceived = true;
            console.log(MoneyWheel.Result, MoneyWheel.Wheel.pies[MoneyWheel.Result].value);
        } else {
            var bet_str = '';
            for(var i = 0; i < this.Bets.length; i++){
                bet_str += this.Bets[i][0] + '_' + this.Bets[i][1] + '|'
            }
            var url = server_address + 'moneywheel/result?uid=' + uname + '&sid=' + sid + '&b=' + bet_str;
            console.log(url);
            
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(req.readyState == 4 && req.status == 200){
                    //console.log(req.responseText);
                    if(req.responseText != "Invalid"){
                        MoneyWheel.Result = parseInt(req.responseText);
                        MoneyWheel.ResultReceived = true;
                    }
                }
            }
            req.open("GET", url, true);
            req.send(null);

        }
    },
    
    // Wheel Logic Begins Here
    wheel_update: function(){
        if(!MoneyWheel.Spinning)
            return;
        
        // Calculating Changes in acceleration
        if(this.Wheel.accelerating){
            //console.log("Accelerating");
            // Ensuring that the wheel accelerates for at least accel_time
            if(this.Wheel.accel_count <= this.Wheel.accel_time){
                this.Wheel.accel_count++;
            }
            // Determining when / if the wheel should stop spinning
            if(this.Wheel.accel_count >= this.Wheel.accel_time && this.Wheel.spins > this.Wheel.min_spins){
                this.Wheel.accelerating = MoneyWheel.begin_deccel();
                
            }
            // Capping the angular velocity of the wheel
            if(this.Wheel.angular < this.Wheel.max_angular){
                this.Wheel.angular += this.Wheel.accel;
                if(this.Wheel.angular > this.Wheel.max_angular){
                    this.Wheel.angular = this.Wheel.max_angular;
                }
            } else{
                this.Wheel.angular = this.Wheel.max_angular;
            }
          // Handling the decceleration cycle
        } else {
            if(this.Wheel.angular > 0){
                this.Wheel.angular -= this.Wheel.deccel;
                if(this.Wheel.angular < 0){
                    this.Wheel.angular = 0;
                }
            }
        }

        // "Spinning" Wheel
        this.Wheel.angle += this.Wheel.angular;
        if(this.Wheel.angle > 360){
            this.Wheel.spins++;
            this.Wheel.angle -= 360;
        }
        
        // SPIN COMPLETE #WIN
        if(this.Wheel.angular == 0 && this.Spinning && !this.SpinComplete){
            this.Sounds.on_spin_end();
            console.log("Spin Complete!");
            this.Spinning = false;
            this.SpinComplete = true;
            experience += 15;
            this.StopTime = new Date().getTime();
            this.Wheel.pies[this.Result].result();
            
            vp_reset_win_graphics();
            hand_type = "";
            
            this.Sounds.win();
            
            var t = this.Wheel.pies[this.Result].value;
            console.log(t);
            last_winning = 0;
            last_win = 0;
            for(var i = 0; i < this.Bets.length; i++){
                if(this.Bets[i][0] == t){
                    last_win = this.Bets[i][0] * this.Bets[i][1];
                    this.Bets[i][0] * this.Bets[i][1];
                    break;
                }
            }
            for(var i = 0; i < MoneyWheel.multipliers.length; i++){
                last_win *= MoneyWheel.multipliers[i];
            }
            last_winning = last_win;
            money += last_win;
            
            if(last_win == 0)
                MoneyWheel.Sounds.on_lose();
            this.Wheel.pies[this.Result].result();
            save_storage();
        }
        
    },
    // #DECCEL  #BEGIN DECCEL
    
    begin_deccel: function(){
        if(!this.ResultReceived)
            return true;
        var spin_down = 0;
        var a = this.Wheel.angular;
        while(a > 0){
            a -= this.Wheel.deccel;
            if(a < 0){
                a = 0;
            }
            spin_down += a;
        }
        var stop = (spin_down + this.Wheel.angle) % 360;
        // NOTE This returns the inverse of whether or not it should stop, this is used in determining if the wheel should continue accelerating
        //if(this.is_within(stop, this.Result) && false){
        //console.log(stop, this.Wheel.final_angle);
        
        if(this.is_within(stop, this.Result)){
            //console.log("Could Stop?");
            
            /*
            if(Math.abs(stop - (this.find_angle(this.Result + 1) - 360 / this.Wheel.pies.length * this.Wheel.stop_point)) < 360 / this.Wheel.pies.length * 0.1){
                console.log("Stopping!");
                //console.log(stop, this.Wheel.final_angle);
                return false;
            }
            */
            return false
        } else if(this.Wheel.spins > this.Wheel.max_spins && this.Wheel.angular == this.Wheel.max_angular){
            //console.log("Engaging Stop Hack " + this.Wheel.angle, spin_down);
            //this.Wheel.angle = (this.Wheel.final_angle - 360 / this.Wheel.pies.length * this.Wheel.stop_point)%360 - spin_down - 8; //idk why this -8 needs to be here, but it works...
            //this.Wheel.angle = this.Wheel.angle % 360;
            console.log("stop hack");
            this.Wheel.angular = 0;
            this.Wheel.angle = this.find_angle(this.Result + 1);// - 360 / this.Wheel.pies.length * this.Wheel.stop_point;
            //this.Wheel.angle = this.Wheel.final_angle - 360 / this.Wheel.pies.length * this.Wheel.stop_point;
            return false;
        }
        return true;
    },
    
    
    is_within: function(current, target){
        var prev = (target + 1) % this.Wheel.pies.length;
        prev = MoneyWheel.find_angle(prev);
        var a = MoneyWheel.find_angle(target);
        
        if(current >= prev  && current <= a){
            return true;
        }
        return false;
    },
    
    find_angle: function(target){
        var r = (target * (- 360) / MoneyWheel.Wheel.pies.length - 90) % 360;
        //var r = (target * (- 360) / MoneyWheel.Wheel.pies.length) % 360;
        if(r < 0){
            r += 360;
        }
        return r;
    },
    
    find_current: function(){
        for(var i = 0; i < MoneyWheel.Wheel.pies.length; i++){
            if(MoneyWheel.is_within(MoneyWheel.Wheel.angle, i))
                return i;
        }
    },
    
    jump_to_value: function(value){
        MoneyWheel.Wheel.angle = find_angle(value);
    },
    
    jump_to_angle: function(angle){
        MoneyWheel.Wheel.angle = angle;
    },
    
    // #DRAW WHEEL #WHEEL
    draw_wheel: function(){
        

        var transform = scale_transform(MoneyWheel.Wheel.transform);
        var radius = transform[2] * 0.95;
        //var radius = transform[2];
        var center = [transform[0] + transform[2] * 0.5, transform[1] + transform[3] * 0.5];
        var pies = MoneyWheel.Wheel.pies;
        var pie_angle = 360 / pies.length;        
        
        //context.drawImage(MoneyWheel.Images.pies[0], canvas_width * 0.47, canvas_height * 0.5, canvas_width * 0.5, canvas_height * 0.1);

        context.save();
        context.translate(center[0], center[1]);
        //context.rotate((MoneyWheel.Wheel.angle + 90) * TO_RADIANS);
        context.rotate((MoneyWheel.Wheel.angle + 90 - pie_angle / 2) * TO_RADIANS);
        
        center = [0,0];
        
        
        var rad = 1 * (2 * Math.PI) / pies.length;
        var point_1 = [center[0] + radius * Math.cos(rad), center[1] + radius * Math.sin(rad)];
        
        rad = (2) * (2 * Math.PI) / pies.length;
        var point_2 = [center[0] + radius * Math.cos(rad), center[1] + radius * Math.sin(rad)];
        
        var height = Math.sqrt((point_1[0] - point_2[0])*(point_1[0] - point_2[0]) + (point_1[1] - point_2[1])*(point_1[1] - point_2[1]));
        


        context.fillStyle = "#000000";
        
        for(var i = 0; i < pies.length; i++){
            var img = MoneyWheel.Images.pies[0];
            
            var val = 0;
            if(i == 0){
                val = pies[pies.length - 1].value
            } else {
                val = pies[i-1].value
            }
            if(i == pies.length - 1){
                val = pies[0].value;
            } else {
                val = pies[i + 1].value;
            }
            
            val = pies[i].value;
            
            if(val == 1){
                img = MoneyWheel.Images.pies[0];
            } else if(val == 2){
                img = MoneyWheel.Images.pies[1];
            } else if(val == 5){
                img = MoneyWheel.Images.pies[2];
            } else if(val == 10){
                img = MoneyWheel.Images.pies[3];
            } else if(val == 20){
                img = MoneyWheel.Images.pies[4];
            } else if(val == 40){
                img = MoneyWheel.Images.pies[5];
            } else if(val == "2x"){
                img = MoneyWheel.Images.pies[6];
            } else if(val == "3x"){
                img = MoneyWheel.Images.pies[7];
            } else if(val == "5x"){
                img = MoneyWheel.Images.pies[8];
            }
            context.drawImage(img, center[0] - radius, center[1] - height, radius, height);
            context.fillRect(center[0] - radius, center[1], radius, height * 0.05);
            
            context.rotate(pie_angle * TO_RADIANS);
            
            
        }
        
        context.restore();  
        
    },

    // #PIES #BUILD PIES
    build_pies: function(){
        var pies = [];
        
        // Creating a wheel whose values directly correspond to those on the server
        pies.push(new_pie("1", "#ff5003", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        
        pies.push(new_pie("10", "#fcd70c", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        pies.push(new_pie("5", "#00c654", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        
        pies.push(new_pie("20", "#0391ff", function(){}));
        pies.push(new_pie("5", "#00c654", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        
        pies.push(new_pie("10", "#fcd70c", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("2x", "#ff9703", function(){}));
        pies[pies.length - 1].text = "2x";
        pies[pies.length - 1].result = function(){
            MoneyWheel.multipliers.push(2);
            MoneyWheel.SpinComplete = false;
            MoneyWheel.FreeSpinStart = new Date().getTime();
            MoneyWheel.FreeSpins = 1;
            };
        
        pies.push(new_pie("40", "#c900fb", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("5", "#00c654", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        
        pies.push(new_pie("20", "#0391ff", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        pies.push(new_pie("3x", "#03ffd8", function(){}));
        pies[pies.length - 1].text = "3x";
                pies[pies.length - 1].result = function(){
                    MoneyWheel.multipliers.push(3);
                    MoneyWheel.SpinComplete = false;
                    MoneyWheel.FreeSpinStart = new Date().getTime();
                    MoneyWheel.FreeSpins = 1;
                    };
        pies.push(new_pie("1", "#ff5003", function(){}));
        pies.push(new_pie("5", "#00c654", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        
        pies.push(new_pie("10", "#fcd70c", function(){}));
        pies.push(new_pie("1", "#ff5003", function(){}));
        pies.push(new_pie("2", "#00c654", function(){}));
        pies.push(new_pie("5", "#00c654", function(){}));
        pies.push(new_pie("5x", "#ff0397", function(){}));
        pies[pies.length - 1].text = "5x";
        pies[pies.length - 1].result = function(){
                    MoneyWheel.multipliers.push(5);
                    MoneyWheel.SpinComplete = false;
                    MoneyWheel.FreeSpinStart = new Date().getTime();
                    MoneyWheel.FreeSpins = 1;
                    };
        
        
        
        
        
        /*
        // Generates a random wheel sequence within certain perameters
        for(var i = 0; i < 23; i++){
            pies.push(new_pie("1", "#ff5003", function(){}));
            if(i < 15){
                pies.push(new_pie("2", "#00c654", function(){}));
                if(i < 7){
                    pies.push(new_pie("5", "#00c654", function(){}));
                    if(i < 4){
                        pies.push(new_pie("10", "#fcd70c", function(){}));
                        if(i < 2){
                            pies.push(new_pie("20", "#0391ff", function(){}));
                            
                            pies.push(new_pie("2x", "#ff9703", function(){}));
                            pies[pies.length - 1].text = "2x";
                            pies[pies.length - 1].result = function(){
                                MoneyWheel.multipliers.push(2);
                                MoneyWheel.SpinComplete = false;
                                MoneyWheel.FreeSpinStart = new Date().getTime();
                                MoneyWheel.FreeSpins = 1;
                                };
                        }
                    }
                }
            }
        }
        
        
        pies.push(new_pie("40", "#c900fb", function(){}));

        pies.push(new_pie("3x", "#03ffd8", function(){}));
        pies[pies.length - 1].text = "3x";
                pies[pies.length - 1].result = function(){
                    MoneyWheel.multipliers.push(3);
                    MoneyWheel.SpinComplete = false;
                    MoneyWheel.FreeSpinStart = new Date().getTime();
                    MoneyWheel.FreeSpins = 1;
                    };
        pies.push(new_pie("5x", "#ff0397", function(){}));
        pies[pies.length - 1].text = "5x";
        pies[pies.length - 1].result = function(){
                    MoneyWheel.multipliers.push(5);
                    MoneyWheel.SpinComplete = false;
                    MoneyWheel.FreeSpinStart = new Date().getTime();
                    MoneyWheel.FreeSpins = 1;
                    };
        */
        // Shuffling the pies(this will have to go)
        /*
        for(var i = 0; i < pies.length * 2; i++){
            var index = Math.floor(Math.random() * pies.length);
            swp = pies[index];
            pies[index] = pies[i % pies.length];
            pies[i % pies.length] = swp;
        }
        */
        
        return pies;
    },
    
    // #BEGIN SPIN
    begin_spin: function(){
        if(MoneyWheel.Bets.length == 0)
            return;
        console.log("Beginning Spin!", MoneyWheel.FreeSpins);
        if(MoneyWheel.FreeSpins == 0){
            MoneyWheel.Games--;
            money -= MoneyWheel.final_bet();
        }
        save_storage();
        MoneyWheel.Wheel.spins = 0;        
        MoneyWheel.FreeSpins = 0;
        
        MoneyWheel.ShowBet = false;
        MoneyWheel.CurrentBet = 0;
        
        //#GET RESULT
        MoneyWheel.get_result();
        
        MoneyWheel.Wheel.stop_point = 0.5;
        MoneyWheel.SpinComplete = false;
        
        MoneyWheel.Spinning = true;
        MoneyWheel.Wheel.accelerating = true;
        MoneyWheel.Wheel.accel_count = 0;
        MoneyWheel.Wheel.final_angle = MoneyWheel.find_angle(MoneyWheel.Result);
        MoneyWheel.Sounds.on_spin();

    }


};