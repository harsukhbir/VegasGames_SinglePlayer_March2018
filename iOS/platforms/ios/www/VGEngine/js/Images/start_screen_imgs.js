function load_start_screen_imgs(){
    start_btn_image = new Image();
    start_btn_image.src = img_dir + "vegas_login_btn.png";
    
    start_screen_bg = new Image();
    start_screen_bg.src = img_dir + "keno_background.png";
    
    
    square_imgs = [new Image(), new Image(), new Image(), new Image()];
    square_imgs[0].src = img_dir + "square.png";
    square_imgs[1].src = img_dir + "square_blue.png";
    square_imgs[2].src = img_dir + "square_green.png";
    square_imgs[3].src = img_dir + "square_red.png";
    
    inc_dec_field = new Image();
    inc_dec_field.src = img_dir + "inc_dec_field.png";
    
    game_select_bg = new Image();
    game_select_bg.src = img_dir + "game_select_bg.png";
    
    bet_select_bg = new Image();
    bet_select_bg.src = img_dir + "bet_select_bg.png";
    
    num_select_bg = new Image();
    num_select_bg.src = img_dir + "num_select_bg.png";
    
    keno_menu_item = new Image();
    keno_menu_item.src = img_dir + "menu_item.png";
    
    confirm_btn_img = new Image();
    confirm_btn_img.src = img_dir + "confirm_btn_img.png";
    
    keno_balls = new Image();
    keno_balls.src = img_dir + "keno_loves_balls.png";
    
    keno_dark = new Image();
    keno_dark.src = img_dir + "keno_dark.png";
    
    prompt_arrow = new Image();
    prompt_arrow.src = img_dir + 'arrow_prompt.png';
}

var start_btn_image, start_screen_bg, square_imgs, inc_dec_field;
var game_select_bg, num_select_bg, bet_select_bg, keno_menu_item, confirm_btn_img, keno_balls, keno_dark, prompt_arrow;