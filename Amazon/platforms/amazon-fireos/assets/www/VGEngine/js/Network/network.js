function load_async(url, callback){
    var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
            callback(req.responseText);
        }
    }
    req.open("GET", url, true);
    req.send(null);
}

function network_init(){
    //check_session(update_money_display, null);
}