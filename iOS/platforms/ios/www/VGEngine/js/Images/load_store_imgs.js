function load_store_imgs(){
    var dir = "img/store/";
    store_imgs = [new Image(),new Image(),new Image(),new Image()];
    store_imgs[0].src = dir + "store1.png";
    store_imgs[1].src = dir + "store2.png";
    store_imgs[2].src = dir + "store3.png";
    store_imgs[3].src = dir + "store4.png";

    store_background = new Image();
    store_background.src = dir + "store_background.png";
    
    exit_btn = new Image();
    exit_btn.src = img_dir + "payout_exit.png";
    
}

var store_imgs, store_background, exit_btn;