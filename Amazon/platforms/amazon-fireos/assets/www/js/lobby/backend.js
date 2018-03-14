function submit_login() {
    //console.log("submit login");
    if (active_timer < 10 && false)
        return;
    if (isFacebook) {
        if (facebook_info == "Undefined") {
            //return login_with_facebook();
            return;
        }
        login_fields[0].text = facebook_info.name;
        login_fields[1].text = fb_pwd();
        user_id = facebook_info.id;
    } else {
        if (login_fields[0].text == "" || login_fields[0].text == null) {
            login_fields[0].text = login_form[0].value;
        }
        if (login_fields[1].text == "" || login_fields[1].text == null) {
            login_fields[1].text = login_form[1].value;
        }
        user_id = login_fields[0].text;
    }

    while (user_id[user_id.length - 1] == ' ') {
        var tmp = '';
        for (var i = 0; i < user_id.length - 1; i++) {
            tmp += user_id[i];
        }
        user_id = tmp;
    }

    var password = login_fields[1].text;
    while (password[password.length - 1] == ' ') {
        var tmp = '';
        for (var i = 0; i < password.length - 1; i++) {
            tmp += password[i];
        }
        password = tmp;
    }

    //console.log(login_fields);

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        //alert("Response: " + req.status);
        //alert(req.responseText, req.status, req.readyState);
        if (req.readyState == 4 && req.status == 200) {
            //console.log(req.responseText);
            if (req.responseText == "Invalid") {
                flash("Login Failed");
                return;
            } else if (req.responseText == "DNE") {
                if (!fb_callback && isFacebook) {
                    fb_callback = true;
                    fb_account_create();
                }
                return;
            } else {
                hide_login_form();
                //console.log("setting name " + user_id);
                //console.log("setting pass " + password);
                login_fields[0].text = user_id;
                login_fields[1].text = password;
                window.localStorage.setItem("user_name", login_fields[0].text);
                window.localStorage.setItem("password", login_fields[1].text);
                login_fields[0].text = user_id;
                login_fields[1].text = password;

                //console.log(isFacebook);
                //console.log(req.responseText);
                window.localStorage.setItem("isFacebook", isFacebook);
                money = '';
                var target = 'mny=';
                for (var i = req.responseText.indexOf(target) + target.length; i < req.responseText.length; i++) {
                    if (req.responseText[i] == '|')
                        break;
                    else {
                        money += req.responseText[i];
                    }
                }

                if (isFacebook) {
                    login_fields[0].text = facebook_info.name;
                    fb_p = '';
                    target = 'pwd=';
                    for (var i = req.responseText.indexOf(target) + target.length; i < req.responseText.length; i++) {
                        if (req.responseText[i] == '|')
                            break;
                        else {
                            fb_p += req.responseText[i];
                        }
                    }
                }
                
                mode = 100;
                //console.log("Logged In!");
                get_stats();
                resize_canvas();
                uname = login_fields[0].text;
                check_daily_login();
            }
        }
    }
    //req.onerror = function(){alert("Error");};
    //var url = "https://singleplayer.vegasgames.com:8000/vegasgames/singleplayer_lobby/login?uid=" + user_id +"&pwd=" + password;
    var url = server_url + "login?uid=" + user_id + "&pwd=" + password;
    //window.open(url);
    //alert(url);
    //console.log(url);
    req.open("GET", url, true);
    req.send(null);

}

function login_guest() {
    login_fields[0].text = "Guest";
    login_fields[1].text = "Guest";
    sid = "Guest";
    mode = 100;
    u = "Guest"
    uname = "Guest";

    var now = new Date().getTime();
    var guest_time = window.localStorage.getItem("guest_time");
    if (guest_time != null) {
        guest_time = parseInt(guest_time);
        if (now - guest_time > 1000 * 60 * 60 * 24) {
            money = 100
        } else {
            var mny = window.localStorage.getItem("guest_money");
            if (mny != null) {
                money = parseInt(mny);
            } else {
                money = 100;
            }
        }
    } else {
        money = 100;
    }
    check_daily_login();
    window.localStorage.setItem("guest_time", now);
    user_stats = [0, 0, 0];
    //submit_login();
}


function job_init() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        uname = login_fields[0].text;
        cash = money;
        GameManager.openJB();
        cash = money;
        //window.location = "job.html?uname="+login_fields[0].text+"&sid="+sid+"&gid=jb&money="+money;        
    } else {
        var name = "";
        var mny = "";
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                response = req.responseText;
                name = "";
                var target = "uid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        name += response[i];
                    }
                }
                //console.log(name);

                sid = "";
                var target = "sid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        sid += response[i];
                    }
                }

                mny = "";
                var target = "money=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        mny += response[i];
                    }
                }
                money = mny;
                if (!isFacebook) {
                    uname = name;
                    u = name;
                } else {
                    uname = facebook_info.id;
                    u = facebook_info.id;
                }
                cash = money;
                GameManager.openJB();
                cash = money;
                increase_bet();
                //window.location = "job.html?uname="+name+"&sid="+sid+"&gid=jb&money="+mny;
            }
        }
        if (isFacebook) {
            GameManager.openJB();
            req.open("GET", server_address + "job/job/?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);
        } else {
            req.open("GET", server_address + "job/job/?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);
    }
}



function init_vp() {

    if (login_fields[0].text.toLowerCase() == "guest") {
        //window.location = server_address + "video_poker/video_poker?uname="+login_fields[0].text+"&sid="+sid+"&money="+money;
        uname = login_fields[0].text;
        u = uname;
        cash = money;
        GameManager.openVP();
        cash = money;
        //window.location = "video_poker.html?uname="+login_fields[0].text+"&sid="+sid+"&gid=vp&money="+money;        
    } else {
        var name = "";
        var mny = "";
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                response = req.responseText;
                if (response == 'Invalid')
                    return;

                name = "";
                var target = "uid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        name += response[i];
                    }
                }


                sid = "";
                var target = "sid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        sid += response[i];
                    }
                }

                mny = "";
                var target = "money=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        mny += response[i];
                    }
                }
                money = mny;
                if (!isFacebook) {
                    uname = name;
                    u = name;
                } else {
                    uname = facebook_info.id;
                    u = facebook_info.id;
                }
                cash = money;
                GameManager.openVP();
                cash = mny;
                increase_bet();
                //window.location = "video_poker.html?uname="+name+"&sid="+sid+"&gid=vp&money="+mny;

            }
        }
        if (isFacebook) {

            GameManager.openVP();
            // alert("isFacebook == if");
            req.open("GET", server_address + "video_poker/init/?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);

        } else {
            // alert("isFacebook == else");
            req.open("GET", server_address + "video_poker/init/?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);
    }
}

function jaw_init() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        //window.location = "jokers_are_wild.html?uname="+login_fields[0].text+"&sid="+sid+"&gid=jw&money="+money;        
        uname = login_fields[0].text;
        u = uname;
        cash = money;
        GameManager.openJW();
        cash = money;
    } else {
        var name = "";
        sid = "";
        var mny = "";
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                response = req.responseText;
                name = "";
                var target = "uid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        name += response[i];
                    }
                }
                //console.log(name);

                sid = "";
                var target = "sid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        sid += response[i];
                    }
                }
                //console.log(sid);

                mny = "";
                var target = "money=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        mny += response[i];
                    }
                }
                money = mny;
                if (!isFacebook) {
                    uname = name;
                    u = name;
                } else {
                    uname = facebook_info.id;
                    u = facebook_info.id;
                }
                cash = money;
                GameManager.openJW();
                cash = money;
                increase_bet();
                //window.location = "jokers_are_wild.html?uname="+name+"&sid="+sid+"&gid=jw&money="+mny;

            }
        }
        if (isFacebook) {
            GameManager.openJW();
            req.open("GET", server_address + "jokers_are_wild/init/?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);
        } else {
            req.open("GET", server_address + "jokers_are_wild/init/?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);
    }
}

function bingo_init() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        //window.location = "bingo.html?uname="+login_fields[0].text+"&sid=GUEST&gid=bingo&money="+money;
        uname = login_fields[0].text;
        GameManager.openBingo();
        uname = login_fields[0].text;

    } else {
        var name = "";
        var mny = "";
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                response = req.responseText;
                if (req.responseText == "Invalid") {
                    flash("Invalid Info");
                    //console.log(req.responseText);
                    return;
                }
                name = "";
                var target = "uid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        name += response[i];
                    }
                }
                //console.log(name);

                sid = "";
                var target = "sid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        sid += response[i];
                    }
                }
                console.log(sid);

                mny = "";
                var target = "money=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        mny += response[i];
                    }
                }
                money = mny;
                if (!isFacebook) {
                    uname = name;
                    u = name;
                } else {
                    uname = facebook_info.id;
                    u = facebook_info.id;
                }
                GameManager.openBingo();
                if (!isFacebook) {
                    uname = name;
                    u = name;
                } else {
                    uname = facebook_info.id;
                    u = facebook_info.id;
                }
                //window.location = "bingo.html?uname="+name+"&sid="+ sid +"&gid=bingo&money="+mny;

            }
        }
        if (isFacebook) {
            GameManager.openBingo();
            req.open("GET", server_address + "bingo/init/?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);
        } else {
            req.open("GET", server_address + "bingo/init/?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);
    }
}


function keno_init() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        //window.location = "VGEngine/keno.html?uname=" + login_fields[0].text + "&sid=GUEST&gid=keno&money=" + money;
        GameManager.openKeno();

    } else {
        var name = "";
        var mny = "";
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                response = req.responseText;
                //console.log(response);
                if (req.responseText == "Invalid") {
                    flash("Invalid Info");
                    //console.log(req.responseText);
                    return;
                }
                name = "";
                var target = "uid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        name += response[i];
                    }
                }
                //console.log(name);

                sid = "";
                var target = "sid=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        sid += response[i];
                    }
                }
                //console.log(sid);

                mny = "";
                var target = "money=";
                for (var i = response.indexOf(target) + target.length; i < response.length; i++) {
                    if (response[i] == '|') {
                        break;
                    } else {
                        mny += response[i];
                    }
                }

                if (!isFacebook) {
                    uname = name;
                    u = name;
                } else {
                    uname = facebook_info.id;
                    u = facebook_info.id;
                }
                money = mny;
                GameManager.openKeno();
                //window.location = "VGEngine/keno.html?uname="+name+"&sid="+ sid + "&gid=keno&money="+mny;
                //window.location = "VGEngine/test.html";
                //window.location = "test.html";

            }
        }
        if (isFacebook) {
            GameManager.openKeno();
            req.open("GET", server_address + "keno/init?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);
        } else {
            req.open("GET", server_address + "keno/init?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);
    }
}

function init_moneywheel() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        uname = login_fields[0].text;
        GameManager.openMoneyWheel();

    } else {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                if (req.responseText != 'Invalid') {
                    //console.log(req.responseText);
                    var resp = JSON.parse(req.responseText);
                    //console.log(resp);
                    sid = resp.sid;
                    money = resp.money;
                    uname = login_fields[0].text;
                    GameManager.openMoneyWheel();
                }
            }
        }
        if (isFacebook) {
            GameManager.openMoneyWheel();
            req.open("GET", server_address + "moneywheel/init?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);
        } else {
            req.open("GET", server_address + "moneywheel/init?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);

    }
}

function init_roulette() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        uname = login_fields[0].text;
        GameManager.openRoulette();

    } else {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var resp = JSON.parse(req.responseText);
                sid = resp.sid;
                money = resp.money;
                uname = login_fields[0].text;
                GameManager.openRoulette();
            }
        }
        if (isFacebook) {
            GameManager.openRoulette();
            req.open("GET", server_address + "roulette/init?uid=" + facebook_info.id + "&pwd=" + fb_pwd(), true);
        } else {
            req.open("GET", server_address + "roulette/init?uid=" + login_fields[0].text + "&pwd=" + login_fields[1].text, true);
        }
        req.send(null);
    }
}


function submit_new_account() {

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            if (req.responseText == "Invalid") {
                flash("Login Failed");
            } else if (req.responseText == "User Name Take") {
                flash("User Name Take");
            } else {
                login_fields[0].text = create_form[0].value;
                login_fields[1].text = create_form[2].value;
                if (isFacebook) {
                    login_fields[0].text = facebook_info.name;
                }
                mode = 100;
                money = req.responseText;
                hide_create_form();
                get_stats();
            }
        }
    }
    if (isFacebook)
        req.open("GET", server_url + "new_account?uid=" + create_form[0].value + "&pwd=" + create_form[2].value + "&e=" + create_form[1].value + "&n=" + create_form[4].value + "&fb=1", true);
    else
        req.open("GET", server_url + "new_account?uid=" + create_form[0].value + "&pwd=" + create_form[2].value + "&e=" + create_form[1].value + "&n=" + create_form[4].value + "&fb=0", true);
    req.send(null);
}

function contains(ary, value) {
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] == value)
            return true;
    }
    return false;
}

function get_stats() {
    if (login_fields[0].text.toLowerCase() == "guest") {
        user_stats = ["0", "0", "0"];
        return;
    }
    user_stats = ["", "", ""];
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            //console.log(req.responseText);
            if (req.responseText == "Invalid") {
                flash("Invalid Username");
            } else {
                var line = "";
                var index = 0;
                var e = "";
                user_stats = ["", "", ""];
                var ignore = ["t", "=", "&", "b", "g", "e"];
                for (var i = 0; i < req.responseText.length; i++) {
                    if (contains(ignore, req.responseText[i])) {
                        if (req.responseText[i] == "&")
                            index++;
                    } else {
                        if (index < user_stats.length)
                            user_stats[index] += req.responseText[i];
                        else {
                            e += req.responseText[i];
                        }
                    }
                }
                experience = parseInt(e);
                //console.log(user_stats);
            }
        }
    }
    if (!isFacebook) {
        req.open("GET", server_address + "stats/get_stats?uid=" + login_fields[0].text, true);
    } else {
        req.open("GET", server_address + "stats/get_stats?uid=" + facebook_info.id, true);
    }
    req.send(null);
}

