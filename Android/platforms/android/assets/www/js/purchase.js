function fb_purchase(id){

    current_transaction = id;
    var url = fb_product_dir;
    if(id == 0)
        url += '500bucks.html';
    else if(id == 1)
        url += '1400bucks.html';
    else if(id == 2)
        url += '5000bucks.html';
    else if(id == 3)
        url += '50000bucks.html';

    FB.ui({
        method: 'pay',
        action: 'purchaseitem',
        product: url,
        quantity: 1
        },
        fb_verify_pay
    );
    fb_pay_test();
}

var current_transaction;

//https://www.youtube.com/watch?v=UWOOw_RSevg
var fb_product_dir = 'https://singleplayer.vegasgames.com/vegasgames/static/payment/';
function fb_pay_test(){

}

function fb_verify_pay(response){
    //console.log(response);
    if(response.error_code != null){
        // Transaction Error
    } else if(response.status != null){
        if(response.status == "completed"){
            // Purchase Was Completed
            flash("Success!");
            money = parseInt(money) + store_values[current_transaction];
            var req = new XMLHttpRequest();
            req.open("GET", server_address + "store/buy?uid=" + facebook_info.id +"&pwd=" + fb_pwd() +"&q=" + response.quantity + '&t=' + current_transaction, true);
            req.send(null);
        }
    }
}