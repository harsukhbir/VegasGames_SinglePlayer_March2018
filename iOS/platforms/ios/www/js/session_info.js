function check_session(response, arg){
	callbk = response;
	c_arg = arg;
	if(known)
		return;

	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
            //console.log(req.responseText);
			if(req.responseText == "Session Expired" || req.responseText == "Invalid"){
				
			} else{
				var re = new RegExp("u=(.*?)[|]", "g");
				u = re.exec(req.responseText)[1];
				
				re = new RegExp("ex=(.*?)[|]", "g");
				p = re.exec(req.responseText)[1];
				
				re = new RegExp("r=(.*)|", "g");
				money = "$" + parseInt(re.exec(req.responseText)[1]);
                
                re = new RegExp("fb=(.*)|", "g");
				if(re.exec(req.responseText)[1] == 1){
                    isFacebook = true;
                }
                
                if(isFacebook){
                    get_fb_p();
                }
				known = true;
                if(callbk != null)
                    callbk(c_arg);
			}
		}
	}
	var url = window.location.search;
	var re = new RegExp("uname=(.*)&sid", "g");
	uname = re.exec(url)[1];

	re = new RegExp("sid=(.*)&gid", "g");
	sid = re.exec(url)[1];

	re = new RegExp("&gid=(.*)&", "g");
	var id = re.exec(url)[1];
    
    re = new RegExp("&money=(.*)", "g");
    money = parseInt(re.exec(url)[1]);
	//console.log("ID: " + id);
	//console.log(server_address + "singleplayer_lobby/back_to_lobby2?uid=" + uname + "&sid=" + sid + "&gid=" + id);
    if(uname.toLowerCase() != "guest"){
        req.open("GET", server_address + "singleplayer_lobby/back_to_lobby2?uid=" + uname + "&gid=" + id + "&sid=" + sid , true);
        req.send(null);
    } else {
        u = "Guest";
    }
}

function get_fb_p(callback, arg){
    cb = callback;
    cb_a = arg;
    var url = window.location.search;
	var re = new RegExp("sid=(.*)&gid", "g");
	sid = re.exec(url)[1];

	re = new RegExp("&gid=(.*)&", "g");
	var id = re.exec(url)[1];
    
    
    var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
            if(req.responseText != 'Invalid'){
                fb_p = req.responseText;
                if(cb != null){
                    cb(cb_a);
                }
            }
        }
    }
    req.open("GET", server_address + "facebook/get?uid=" + facebook_info.id + "&gid=" + id + "&sid=" + sid , true);
    req.send(null);
}

var cb, cb_a;
//var server_address = "https://singleplayer.vegasgames.com/vegasgames/";
var server_address = "https://singleplayer.vegasgames.com:8000/vegasgames/";

//var server_address = "https://vegasgames.pythonanywhere.com/vegasgames/";
var p, u, callbk, c_arg;
var known = false;
var isFacebook = false;