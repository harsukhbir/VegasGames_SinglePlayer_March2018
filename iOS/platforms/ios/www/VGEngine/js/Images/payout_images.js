function load_payout_images(){
    payout_row = new Image();
    payout_row.src = img_dir + "payout_row.png";
    
    payout_left = new Image();
    payout_left.src = img_dir + "payout_left.png";
    
    payout_top = new Image();
    payout_top.src = img_dir + "payout_top.png";
    
    payout_text = new Image();
    payout_text.src = img_dir + "payout_text.png";
    
    payout_exit_img = new Image();
    payout_exit_img.src = img_dir + "payout_exit.png";
    
    payout_table_img = new Image();
    payout_table_img.src = img_dir + "payout_table_btn.png";
}

var payout_top, payout_left, payout_row, payout_text, payout_exit_img, payout_table_img;