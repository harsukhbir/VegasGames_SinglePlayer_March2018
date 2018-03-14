var accessToken = "undefined";
var facebook_info = "Undefined";
var fb_p = '';

function login_with_facebook(){
    //console.log("Logging in with FB");
    //return;
    //openFB.init({appId: '1094518167227341'});
    openFB.init({appId: '1542352669417906'});
    //alert(accessToken);

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});   
    
	openFB.login(
			function(response) {
				if(response.status === 'connected') {
					//alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
                    accessToken = response.authResponse.accessToken;
                    //alert("Login In Successful");
                    console.log("Login Successful");
                 //alert("Login Successful");
                 get_facebook_info();
                 

				} else {
					//alert('Facebook login failed: ' + response.error);
				}
                // }, {scope: 'email,publish_actions'});
			}, {scope: 'email'});
            

}

function load_fb(){
    facebook_info = JSON.parse(window.localStorage.getItem("fb_info"));
}

function fb_initialize(){
    
    if(!load_access_token()){
        login_with_facebook();
    }
    if(facebook_info == "Undefined" || facebook_info == null){
        get_facebook_info();
    } else {
        login_fields[0].text = facebook_info.id;
        login_fields[1].text = fb_pwd();        
    }
    $(document.getElementsByClassName(" fb_iframe_widget")).hide();
    
}

function facebook_login_successful(data, status){

    // alert(data.name);
    
    login_guest();
    
    //console.log(data);
    //alert(data.name);
    isFacebook = true;
    facebook_info = data;
    window.localStorage.setItem("fb_info", JSON.stringify(facebook_info));
    login_fields[0].text = data.id;
    login_fields[1].text = data.email + data.id + data.name + data.birthday;
    submit_login();
}
/*
function load_access_token(){
    //accessToken = FB.getAccessToken();
}
*/
function facebook_invite(){
    if(!isFacebook){
        fb_initialize();
        return;
    }
    FB.ui({
        method: 'apprequests',
        message: 'Come Play Vegas Games, You know you want to! ;P',
        filters: ['app_non_users'],
        title: 'Come Play this app, seriously'
    },
    function (response) {
        if (response && response.request_ids) {
            //if sucess do something
            //How many people did the user invited?
            var $howManyInvites = String(requests).split(',').length;
        } else {
            //  alert('canceled');
            return false;
        }
    });
}

function facebook_share(){
    if(!isFacebook){
        fb_initialize();
        return;
    }

    var url = 'https://' + window.location.hostname + window.location.pathname;
    FB.ui({
      method: 'share',
      href: url,
    }, function(response){});
}

function get_facebook_info(){
    if(accessToken == "undefined"){
        checkLoginState();
        return;
    }
    //console.log("Getting Facebook Info");
    var url = "https://graph.facebook.com/v2.5/me?fields=id,name,email,birthday&access_token=" + accessToken;
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data, status){facebook_login_successful(data, status);},
        error: function(data, e1, e2){}
            
    });
}

var fb_profile_pic = "Undefined";

function get_fb_pic_src(x,y){
    if(accessToken == "undefined"){
        return checkLoginState();
    }
    fb_profile_pic = new Image();
    fb_profile_pic.src = "https://graph.facebook.com/v2.5/" + facebook_info.id +"/picture?height="+x+"&width="+y;
}

function fb_p_retrieve(){
    /*
    console.log('retrieved');
    login_fields[1].text = fb_p;
    submit_login();    
    */
}

function fb_pwd(callback, arg){
    if(!isFacebook || facebook_info == "Undefined")
        return;
    fb_p = facebook_info.email + facebook_info.id + facebook_info.name + facebook_info.birthday;
    return fb_p;
}

// This function creates an account 
function fb_account_create(){
    create_form[0].value = facebook_info.id;
    create_form[2].value = login_fields[1].text;
    create_form[1].value = facebook_info.email;
    create_form[4].value = facebook_info.name;
    submit_new_account();
    
}

// This all applies to use of openFB

function facebook_login_callback(response){
    
}

function load_access_token(){
    var target = "#access_token=";
    var url = window.location.hash;
    var index = url.indexOf(target);
    if(index == -1){
        console.log("Not Found");
        return false;
    }
    index += target.length;
    accessToken = "";
    for(var i = index; i < url.length; i++){
        if(url[i] == '&')
            break;
        accessToken += url[i];
    }
    return true;
}

function fb_pwd(){
    if(!isFacebook || facebook_info == "Undefined")
        return;
    return facebook_info.email + facebook_info.id + facebook_info.name + facebook_info.birthday;
    
}




var info_window;


function facebook_success(){
    
}


function fb_share(){
    flash("Coming Soon");
    return;
    
    
    if(!isFacebook){
        login_with_facebook()
    }
    console.log = function(arg){
        alert(arg);
    }
    alert("Starting fb share");
    openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: document.getElementById('Message').value || 'Testing Facebook APIs'
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: errorHandler});
}


function fb_share2(){
    var url = "https://graph.facebook.com/v2.5/me?message=testing&access_token=" + accessToken;
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data, status){alert("Success " + JSON.stringify(data));},
        error: function(data, e1, e2){alert("Error " + JSON.stringify(data));}
            
    });
}



// FB SDK Init
//openFB.init({appId: '1094518167227341'});
/*
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1542352669417906',
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
   js.onload = function(){alert("Facebook Loaded???");};
     fjs.parentNode.insertBefore(js, fjs);
    $(document.getElementsByClassName(" fb_iframe_widget")).hide();
   }(document, 'script', 'facebook-jssdk'));
   
   function checkLoginState(response){
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                //console.log('Logged in.');
            }
            else {
                          alert("Logging In");
                FB.login();
            }
            if(response.status === 'connected'){
                $(document.getElementsByClassName(" fb_iframe_widget")).hide();
                if(accessToken == "undefined"){
                    accessToken = FB.getAccessToken();
                }
                if(facebook_info == "Undefined"){
                    get_facebook_info();
                }
            }
        });
   }
   
   
/*
FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    console.log('Logged in.');
  }
  else {
    FB.login();
  }
});
*/
