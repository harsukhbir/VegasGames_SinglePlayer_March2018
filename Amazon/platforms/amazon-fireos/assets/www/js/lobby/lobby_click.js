function roulette_click() {
  init_roulette();
}

function moneywheel_click() {
  init_moneywheel();
}

function video_poker_click() {
  //window.location = server_address + "video_poker/video_poker/?uid=" + login_fields[0].text+"&pwd="+login_fields[1].text;
  init_vp();
}

function jacks_or_better_click() {
  //window.location = server_address + "job/job/?uid=" + login_fields[0].text+"&pwd="+login_fields[1].text;
  job_init();
}

function jokers_wild_click() {
  //window.location = server_address + "jokers_are_wild/jokers_are_wild/?uid=" + login_fields[0].text+"&pwd="+login_fields[1].text;
  jaw_init();
}

function bingo_click() {
  bingo_init();
}

function keno_click() {
  keno_init();
}

function user_back() {
  mode = 100;
}

function user_settings() {
  user_button_move = !user_button_move;
}

function user_view_achievements() {

}

function open_settings() {
  mode = 101;
}
// This should be moved to its own file
/*
function facebook_share(){
    console.log("FB Share");
    facebook_share();
}
*/
/*
function facebook_invite(){
    facebook_invite();
    //facebook_share();
}
*/

function more_games() {
  // window.location = "http://vegasgames.com";
  // console.log("1");
  // ssAds.showOfferwall();
}

function impgFreeChip() {
  // window.location = "http://vegasgames.com";
  console.log("2");
  var ANDROID_KEY = '465b1a0d';
  var IOS_KEY = '3efd0b09';
  var ssAds = new SupersonicAds(cordova.platformId === 'ios' ? IOS_KEY : ANDROID_KEY, 'demo_' + Date.now());
  ssAds.showOfferwall();
}

function open_language_select() {
  console.log("Opening Language Select");
  language_dropdown = true;
  sound_dropdown = false;
  dd_scroll = 0;
}

function open_sound_select() {
  language_dropdown = false;
  sound_dropdown = true;
  dd_scroll = 0;
}

function check_language_dropdown(x, y) {
  console.log("Checking Language Dropdown");
  var left = canvas_width * settings_buttons[0].transform[0];
  var top = canvas_height * settings_buttons[0].transform[1];
  var width = canvas_width * settings_buttons[0].transform[2];
  var height = canvas_height * settings_buttons[0].transform[3];
  for (var i = 0; i < language_list.length; i++) {
    if (x >= left && x <= left + width) {
      if (y >= top + height * i && y <= top + height * (i + 1)) {
        switch_language(i, 0);
        init();
        mode = 100;
        language_dropdown = false;
        return true;
      }
    }
  }
  return false;
}

function check_sound_dropdown(x, y) {
  var left = canvas_width * settings_buttons[1].transform[0];
  var top = canvas_height * settings_buttons[1].transform[1];
  var width = canvas_width * settings_buttons[1].transform[2];
  var height = canvas_height * settings_buttons[1].transform[3];
  for (var i = 0; i < 2; i++) {
    if (x >= left && x <= left + width) {
      if (y >= top + height * i && y <= top + height * (i + 1)) {
        if (i == 0) {
          sound_enabled = true;
          MusicManager.play_music();
          window.localStorage.setItem("sound_enabled", 1);
        } else {
          sound_enabled = false;
          window.localStorage.setItem("sound_enabled", 0);
        }
        sound_dropdown = false;
        return true;
      }
    }
  }
  return false;
}

function logout(callback) {


  var openFB = (function() {

    var loginURL = 'https://www.facebook.com/dialog/oauth',

      logoutURL = 'https://www.facebook.com/logout.php',

      // By default we store fbtoken in sessionStorage. This can be overridden in init()
      tokenStore = window.sessionStorage,

      // The Facebook App Id. Required. Set using init().
      fbAppId,

      context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),

      baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context,

      // Default OAuth redirect URL. Can be overriden in init()
      oauthRedirectURL = baseURL + '/index.html',

      // Default Cordova OAuth redirect URL. Can be overriden in init()
      cordovaOAuthRedirectURL = "https://www.facebook.com/connect/login_success.html",

      // Default Logout redirect URL. Can be overriden in init()
      logoutRedirectURL = baseURL + '/logoutcallback.html',

      // Because the OAuth login spans multiple processes, we need to keep the login callback function as a variable
      // inside the module instead of keeping it local within the login function.
      loginCallback,

      // Indicates if the app is running inside Cordova
      runningInCordova,

      // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
      loginProcessed;

    // MAKE SURE YOU INCLUDE <script src="cordova.js"></script> IN YOUR index.html, OTHERWISE runningInCordova will always by false.
    // You don't need to (and should not) add the actual cordova.js file to your file system: it will be added automatically
    // by the Cordova build process
    document.addEventListener("deviceready", function() {
      runningInCordova = true;
    }, false);


    /**
     * Logout from Facebook, and remove the token.
     * IMPORTANT: For the Facebook logout to work, the logoutRedirectURL must be on the domain specified in "Site URL" in your Facebook App Settings
     *
     */
    // function logoutNew(callback) {
    // alert("logout ready");
    var logoutWindow,
    token = tokenStore.fbAccessToken;

    /* Remove token. Will fail silently if does not exist */
    tokenStore.removeItem('fbtoken');

    if (token) {
      logoutWindow = window.open(logoutURL + '?access_token=' + token + '&next=' + logoutRedirectURL, '_blank', 'location=no,clearcache=yes');
      if (runningInCordova) {
        setTimeout(function() {
          logoutWindow.close();
        }, 700);
      }


      // before logout
      for (var i = 0; i < login_form.length; i++) {
        login_form[i].value = "";
      }

      for (var i = 0; i < login_fields.length; i++) {
        login_fields[i].text = "";
      }

      window.localStorage.removeItem("fb_info");

      localStorage.clear();
        var User_Checkout = "User Checkout";
        var User_Checkout_No = {
          "User Checkout_No": "1"
        };
      window.plugins.appsFlyer.trackEvent(User_Checkout, User_Checkout_No);
      isFacebook = false;
      init();

      // end

      // setby me
      load_main_scripts();
      // end

    }

    if (callback) {
      callback();
    }

    // }


    // The public API
    return {
      init: init,
      login: login,
      logout: logout,
      revokePermissions: revokePermissions,
      api: api,
      oauthCallback: oauthCallback,
      getLoginStatus: getLoginStatus
    }

  }());

}


function check_lobby_buttons(x, y) {
  for (var i = 0; i < lobby_buttons.length; i++) {
    if (i > 3) {
      var transform = [canvas_width * lobby_buttons[i].transform[0], canvas_height * lobby_buttons[i].transform[1], canvas_width * lobby_buttons[i].transform[2], canvas_height * lobby_buttons[i].transform[3]];
      if (x >= transform[0] && x <= transform[0] + transform[2]) {
        if (y >= transform[1] && y <= transform[1] + transform[3]) {
          lobby_buttons[i].onClick();
          return true;
        }
      }
    }
  }
  return false;
}

function check_game_buttons(x, y) {
  for (var i = 0; i < game_buttons.length; i++) {
    var transform = [
    canvas_width * game_buttons[i].transform[0],
    canvas_height * game_buttons[i].transform[1],
    canvas_width * game_buttons[i].transform[2],
    canvas_height * game_buttons[i].transform[3]];
    //console.log(transform);
    if (x > transform[0] && x <= transform[0] + transform[2]) {
      if (y >= transform[1] && y <= transform[1] + transform[2]) {
        game_buttons[i].onClick();
      }
    }
  }
}

function check_user_buttons(x, y) {
  for (var i = 0; i < user_buttons.length; i++) {
    var transform = [canvas_width * user_buttons[i].transform[0], canvas_height * user_buttons[i].transform[1], canvas_width * user_buttons[i].transform[2], canvas_height * user_buttons[i].transform[3]];

    if (i == 0) {
      //console.log(transform);
      transform[1] -= canvas_height * 0.05;
      transform[3] += canvas_height * 0.05;
      transform[2] += canvas_width * 0.15;
      //console.log(transform);
    }

    if (x >= transform[0] && x <= transform[0] + transform[2]) {
      if (y >= transform[1] && y <= transform[1] + transform[3]) {
        user_buttons[i].onClick();
        return true;
      }
    }
  }
  return false;
}

function check_settings_buttons(x, y) {
  for (var i = 0; i < settings_buttons.length; i++) {
    var transform = [canvas_width * settings_buttons[i].transform[0], canvas_height * settings_buttons[i].transform[1], canvas_width * settings_buttons[i].transform[2], canvas_height * settings_buttons[i].transform[3]];
    if (x >= transform[0] && x <= transform[0] + transform[2]) {
      if (y >= transform[1] && y <= transform[1] + transform[3]) {
        settings_buttons[i].onClick();
        return true
      }
    }
  }
  return false;
}

function check_lobby_other(x, y) {
  if (x >= canvas_width * 0.325 && x <= canvas_width * 0.625) {
    if (y >= canvas_height * 0.84 && y <= canvas_height * 0.95) {
      open_store();
    }
  }
}


function lobby_click_handler(x, y) {
  if (swipe_dist > canvas_width * 0.05) return;
  if (store_open) {
    store_click(x, y);
    return;
  }
  if (mode == 100) {
    if (check_game_buttons(x, y)) return;
    else if (check_lobby_buttons(x, y)) return;
    else if (check_lobby_other(x, y)) return;
  } else if (mode == 101) {
    if (language_dropdown) {
      if (check_language_dropdown(x, y)) return;
    }
    if (sound_dropdown) {
      if (check_sound_dropdown(x, y)) return;
    }
    if (check_user_buttons(x, y)) return;
    if (check_settings_buttons(x, y)) return;
    language_dropdown = false;
    sound_dropdown = false;
    dd_scroll = 0;
  }
}