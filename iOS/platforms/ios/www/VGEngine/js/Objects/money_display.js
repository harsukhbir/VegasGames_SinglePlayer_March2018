function create_money_display(transform){
    var money_display = new_drawable(3, transform);
    var money_display_img = new_static_img(money_display_bg, transform, 3);
    money_display_img.id = "money_image_back";
    money_display = add_drawable(money_display, money_display_img);
    
    var store_btn = new_button(3, transform, home_screen_open_store);
    money_display = add_drawable(money_display, store_btn);
    
    var txt_transform = [
        transform[0] + transform[2] * 0.06,
        transform[1] + transform[3] * 0.7,
        transform[2] * 0.68,
        transform[3] * 0.55
    ];
    var fnt = auto_size_text("$99000000", canvas.width * txt_transform[2], canvas.height * txt_transform[3]) + font;
    var money_txt = new_text("$" + money, fnt, 1, txt_transform, 4, "#00ad9f");
    money_txt.id = "money_display_text";
    money_display = add_drawable(money_display, money_txt);
    //console.log(money_display);
    money_display.id = "Money Display";
    return money_display;
}

function update_money_display(){
    for(var i = 0; i < screens.length; i++){
        var money_display = get_drawable_with_id(screens[i], "Money Display");
        if(money_display != undefined){
            var txt = get_drawable_with_id(money_display, "money_display_text");
            txt.txt = money;
        }
    }
}