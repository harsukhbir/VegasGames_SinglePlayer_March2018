function purchase(quantity){
    fb_purchase(quantity);
    /*
    purchaseStore.purchase(quantity);
	if(uname == "guest" || uname == "Guest"){
		check_session(purchase, quantity);
	}
    var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            if(req.responseText == "Invalid"){
                //flash("Invalid Info");
            } else {
                //flash(req.responseText);
                cash = parseInt(cash) + parseInt(req.responseText);
                update_money_display();
                money_popup = false;
            }
		}
	}
    console.log(server_address + "store/buy?uid=" + u +"&pwd=" + p +"&q=" + quantity);
	req.open("GET", server_address + "store/buy?uid=" + u +"&pwd=" + p +"&q=" + quantity, true);
	req.send(null);
    */
}

function store_graphics(){
    context.globalAlpha = 0.06;
    context.drawImage(store_background, canvas.width * store_bg_transform[0], canvas.height * store_bg_transform[1], canvas.width * store_bg_transform[2], canvas.height * store_bg_transform[3]);
    context.globalAlpha = 1;
    
    context.drawImage(exit_btn, canvas.width * store_exit_transform[0], canvas.height * store_exit_transform[1], canvas.width * store_exit_transform[2], canvas.width * store_exit_transform[2]);
    context.drawImage(logo, canvas.width * 0.38, canvas.height * 0.13, canvas.width * 0.19, canvas.height * 0.12);
    auto_size_text("$1000", canvas.width * 0.09,canvas.height);
    for(var i = 0; i < store_imgs.length; i++){
        auto_size_text("$1000", canvas.width * 0.09,canvas.height);
        var transform = [
            canvas.width * (store_btn_transform[0] + (store_btn_transform[2] + store_btn_spacing) * i),
            canvas.height * store_btn_transform[1],
            canvas.width * store_btn_transform[2],
            canvas.height * store_btn_transform[3]
        ];
        context.drawImage(store_imgs[i], transform[0], transform[1], transform[2], transform[3]);
        draw_fancy_text("$" + store_prices[i], transform[0] + transform[2] * 0.5 - context.measureText("$" + store_prices[i]).width/2, transform[1] + transform[3] * 1.2);
        auto_size_text("$1000", canvas.width * 0.075, canvas.height);
        draw_fancy_text("Purchase", transform[0] + transform[2] * 0.5 - context.measureText("Purchase").width/2, transform[1] + transform[3] * 0.954);
        //draw_fancy_text(store_values[i], transform[0] + transform[2] * 0.7, transform[1] + transform[3] * 0.5);
        
        
        draw_fancy_text(store_values[i], transform[0] + transform[2] * 0.5 - context.measureText("$" + store_values[i]).width/2, transform[1] + transform[3] * 0.75);

    }
    
}

function store_click(x,y){
    if(x >= canvas.width * store_exit_transform[0] && x <= canvas.width * (store_exit_transform[0] + store_exit_transform[2])){
        if(y >= canvas.height * store_exit_transform[1] && y <= canvas.height * (store_exit_transform[1]) + canvas.width * store_exit_transform[2]){
            close_store();
            return;
        }
    }
    
    for(var i = 0; i < store_imgs.length; i++){
        var transform = [
            canvas.width * (store_btn_transform[0] + (store_btn_transform[2] + store_btn_spacing) * i),
            canvas.height * store_btn_transform[1],
            canvas.width * store_btn_transform[2],
            canvas.height * store_btn_transform[3]
        ];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                //flash("Something should happen here!");
                purchase(i);
                return;
            }
        }
    }
    
    if(x <= canvas.width * store_bg_transform[0] || x >= canvas.width * (store_bg_transform[0] + store_bg_transform[2]) ||
        y <= canvas.height * store_bg_transform[1] || y >= canvas.height * (store_bg_transform[1] + store_bg_transform[3])){
            close_store();
        }
}

function close_store(){
    store_open = false;
    money_popup = false;
    new_game_btn_click();
}

function open_store(){
    store_open = true;
}


var store_open = false;
var money_popup = false;

var store_prices = [1,2,5,25];

var store_values = [500,1400,5000,50000];


var store_bg_transform = [0.08, 0.11, 0.84, 0.66];


var store_btn_spacing = 0.025;

var store_btn_transform = [0.11, 0.28, 0.17, 0.34];

var store_exit_transform = [0.1, 0.13, 0.075, 0.075];