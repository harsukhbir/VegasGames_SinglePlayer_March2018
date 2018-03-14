function purchase(quantity){
    //fb_purchase(quantity);
    //alert("Purchasing");
    //if(!purchaseStore.purchase(quantity))
      //  return;
//alert(“About to purchase?”);
    purchaseStore.purchase(quantity);
    return;
	if(uname.toLowerCase() == 'guest'){
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
                money_popup = false;
            }
		}
	}
    console.log(server_address + "store/buy?uid=" + u +"&pwd=" + p +"&q=" + quantity);
	req.open("GET", server_address + "store/buy?uid=" + u +"&pwd=" + p +"&q=" + quantity, true);
	req.send(null);
    
}

function store_graphics(){
    //context.globalAlpha = 0.95;
    context.drawImage(store_background, canvas_width * store_bg_transform[0], canvas_height * store_bg_transform[1], canvas_width * store_bg_transform[2], canvas_height * store_bg_transform[3]);
    //context.globalAlpha = 1;
    
    context.drawImage(store_exit_btn, canvas_width * store_exit_transform[0], canvas_height * store_exit_transform[1], canvas_width * store_exit_transform[2], canvas_width * store_exit_transform[2]);
    context.drawImage(logo, canvas_width * 0.38, canvas_height * 0.13, canvas_width * 0.19, canvas_height * 0.12);
    auto_size_text("$1000", canvas_width * 0.09,canvas_height);
    for(var i = 0; i < store_imgs.length; i++){
        auto_size_text("$1000", canvas_width * 0.09,canvas_height);
        var transform = [
            canvas_width * (store_btn_transform[0] + (store_btn_transform[2] + store_btn_spacing) * i),
            canvas_height * store_btn_transform[1],
            canvas_width * store_btn_transform[2],
            canvas_height * store_btn_transform[3]
        ];
        context.drawImage(store_imgs[i], transform[0], transform[1], transform[2], transform[3]);
        draw_fancy_text("$" + store_prices[i], transform[0] + transform[2] * 0.5 - context.measureText("$" + store_prices[i]).width/2, transform[1] + transform[3] * 1.2);
        auto_size_text("$1000", canvas_width * 0.075, canvas_height);
        draw_fancy_text("Purchase", transform[0] + transform[2] * 0.5 - context.measureText("Purchase").width/2, transform[1] + transform[3] * 0.954);
        //draw_fancy_text(store_values[i], transform[0] + transform[2] * 0.7, transform[1] + transform[3] * 0.5);
        
        
        draw_fancy_text(store_values[i], transform[0] + transform[2] * 0.5 - context.measureText("$" + store_values[i]).width/2, transform[1] + transform[3] * 0.75);

    }
    
}
function store_click(x,y){
    if(x >= canvas_width * store_exit_transform[0] && x <= canvas_width * (store_exit_transform[0] + store_exit_transform[2])){
        if(y >= canvas_height * store_exit_transform[1] && y <= canvas_height * (store_exit_transform[1]) + canvas_width * store_exit_transform[2]){
            close_store();
            return true;
        }
    }
    
    for(var i = 0; i < store_imgs.length; i++){
        var transform = [
            canvas_width * (store_btn_transform[0] + (store_btn_transform[2] + store_btn_spacing) * i),
            canvas_height * store_btn_transform[1],
            canvas_width * store_btn_transform[2],
            canvas_height * store_btn_transform[3]
        ];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                //flash("Something should happen here!");
                purchase(i);
                return true;
            }
        }
    }
    
    if(x <= canvas_width * store_bg_transform[0] || x >= canvas_width * (store_bg_transform[0] + store_bg_transform[2]) ||
        y <= canvas_height * store_bg_transform[1] || y >= canvas_height * (store_bg_transform[1] + store_bg_transform[3])){
            close_store();
        }
}

function close_store(){
    store_open = false;
    money_popup = false;
}

function open_store(){
    if(!store_init){
        load_store_imgs();
        store_init = true;
    }
    
    store_open = true;
}

function load_store_imgs(){
    var dir = "store/";
    store_imgs = [
        new Image(),
        new Image(),
        new Image(),
        new Image()
    ];
    var store_dir = "img/store/";
    
    store_imgs[0].src = store_dir + "store1.png";
    store_imgs[1].src = store_dir + "store2.png";
    store_imgs[2].src = store_dir + "store3.png";
    store_imgs[3].src = store_dir + "store4.png";
    
    
    store_background = new Image();
    store_background.src = store_dir + "store_background.png";

    store_exit_btn = new Image();
    store_exit_btn.src = store_dir + "exit_btn.png";
}



/*

var purchaseStore = (function () {
                     
                     document.addEventListener("deviceready", function () {
                                               console.log('deviceready');
                                               initStore();
                                               }, false);
                     
                     function initStore() {
                        alert("Store Init");
                        console.log('init store');
                     
                        if (!window.store) {
                            console.log('Store not available');
                            return;
                        }
                     
                     
                     }
                     
                     function purchase(quantity) {
                        console.log('PURCHASE QUANTITY:'+quantity);
                        if(quantity==0) {
                            purchase_1();
                        }
                        else if(quantity==1) {
                            purchase_2();
                        }
                        else if(quantity==2) {
                            purchase_3();
                        }
                        else if(quantity==3) {
                            purchase_4();
                        }
                     }
                     
                     
                     // store_currency_1
                     function purchase_1(){
                     console.log('purchase_1');
                     store.order("store_currency_1");
                     }
                     
                     // store_currency_2
                     function purchase_2(){
                     console.log('purchase_2');
                     store.order("store_currency_2");
                     }
                     
                     // store_currency_5
                     function purchase_3(){
                     console.log('purchase_3');
                     store.order("store_currency_5");
                     }
                     
                     // store_currency_25
                     function purchase_4(){
                     console.log('purchase_4');
                     store.order("store_currency_25");
                     }
                     
                     return {
                     purchase: purchase
                     }
                     }());
 */

var money_popup;
var store_prices = [0.99,1.99,4.99,24.99];
var store_values = [500,1400,5000,50000];
var store_bg_transform = [0.08, 0.11, 0.84, 0.66];
var store_init = false;


var store_imgs, store_background, store_exit_btn;


var store_btn_spacing = 0.025;
var store_btn_transform = [0.11, 0.28, 0.17, 0.34];
var store_exit_transform = [0.1, 0.13, 0.075, 0.075];