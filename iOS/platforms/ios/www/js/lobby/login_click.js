function login_btn_click(){
    isFacebook = false;
    submit_login();
}

function username_field_edit(){
    username_edit = true;
    password_edit = false;
}

function password_field_edit(){
    password_edit = true;
    username_edit = false;
}

function create_new_account(){
    hide_login_form()
    show_create_form();
    login_fields[0].text = "";
    login_fields[1].text = "";
    mode = 1;
}

function cancel_account_create(){
    hide_create_form();
    login_fields[0].text = "";
    login_fields[1].text = "";
    //show_login_form();
    mode = 2;
}

function vg_login_back(){
    hide_login_form()
    mode = 2;
}

function create_done_btn(){
    for(var i = 0; i < create_form.length; i++){
        create_fields[i].text = create_form[i].value;
    }
    for(var i = 0; i < create_fields.length; i++){
        if(create_fields[i].text == ""){
            create_fields[i].text = create_form[i].value;
        }
    }
    var uname = create_fields[0].text;
    var email = create_fields[1].text;
    var pword = create_fields[2].text;
    var pword2 = create_fields[3].text;
    if(pword != pword2){
        flash("Passwords Do Not Match");
        create_fields[2].text = "";
        create_fields[3].text = "";
        create_form[2].text = "";
        create_form[3].text = "";
        return;
    }
    for(var i = 0; i < create_fields.length; i++){
        if(create_fields[i].text == ""){
            flash("Please Complete All Fields");
            return;
        }
    }
    for(var i = 0; i < create_fields.length; i++){
        create_form[i].value = create_fields[i].text;
    }
    login_fields[0].text = uname;
    login_fields[1].text = pword;
    submit_new_account();
}

function check_login_buttons(x,y){
    for(var i = 0; i < login_buttons.length; i++){
        var transform = [canvas_width * login_buttons[i].transform[0], canvas_height * login_buttons[i].transform[1], canvas_width * login_buttons[i].transform[2], canvas_height * login_buttons[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                login_buttons[i].onClick();
                return true;
            }
        }
    }
    return false;
}

function check_login_fields(x,y){
    console.log("Checking Login Fields");
    for(var i = 0; i < login_fields.length; i++){
        var transform = [canvas_width * login_fields[i].transform[0], canvas_height * login_fields[i].transform[1], canvas_width * login_fields[i].transform[2], canvas_height * login_fields[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                login_fields[i].onClick();
                return true;
            }
        }
    }
    return false;
}

function check_login_next_prev(x,y){
    if(login_field_last == login_form[0]){
        if(x >= canvas_width * (login_next.transform[0]) && x <= canvas_width * (login_next.transform[0] + login_next.transform[2])){
            login_form[1].focus();
        } else if(x >= canvas_width * (login_prev.transform[0]) && x <= canvas_width * (login_prev.transform[0] + login_prev.transform[2])){
            
        }
    } else if(login_field_last == login_form[1]){
        if(x >= canvas_width * (login_next.transform[0]) && x <= canvas_width * (login_next.transform[0] + login_next.transform[2])){
            active_timer = 10;
            canvas.focus();
            submit_login();
        } else if(x >= canvas_width * (login_prev.transform[0]) && x <= canvas_width * (login_prev.transform[0] + login_prev.transform[2])){
            login_form[0].focus();
        }        
    }
    return false;
}

function check_account_create_buttons(x,y){
    for(var i = 0; i < account_create_buttons.length; i++){
        var transform = [canvas_width * account_create_buttons[i].transform[0], canvas_height * account_create_buttons[i].transform[1], canvas_width * account_create_buttons[i].transform[2], canvas_height * account_create_buttons[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                $("#myPage").on("pageshow", function( event ) {
                        $("#myPage").find('input:first').focus();
                } );
                account_create_buttons[i].onClick();
                return true;
            }
        }
    }
    return false;
}

function create_username_edit(){
    console.log("Create Username Edit");
    create_selected = 0;
}

function create_email_edit(){
    console.log("Create Email Edit");
    create_selected = 1;
}

function create_password_edit(){
    console.log("Create Password Edit");
    create_selected = 2;
}
function create_password_conf_edit(){
    console.log("Create Password Conf Edit");
    create_selected = 3;
}

function create_fullname_edit(){
    console.log("Create Fullname Edit");
    create_selected = 4;
}

function forgot_account(){
    //facebookConnectPlugin.login(Array strings of permissions, Function success, Function failure)


    //FB.init();
    //flash("Dumbass");
}

function fb_login(){
    //get_facebook_info();
    fb_initialize();
}
    
function vg_login(){
    show_login_form();
    mode = 0;
}

function guest_login(){
    var date = new Date();
    if(date.getTime() - last_guest > min_guest_time)
        login_guest();
    else
        flash("You cannot log in as a guest right now");
}

function check_create_fields(x,y){
    for(var i = 0; i < create_fields.length; i++){
        var transform = [canvas_width * create_fields[i].transform[0], canvas_height * create_fields[i].transform[1], canvas_width * create_fields[i].transform[2], canvas_height * create_fields[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                create_fields[i].onClick();
                return true;
            }
        }
    }
    return false;
}

function check_init_buttons(x,y){
    for(var i = 0; i < init_buttons.length; i++){		
        var transform = [canvas_width * init_buttons[i].transform[0], canvas_height * init_buttons[i].transform[1], canvas_width * init_buttons[i].transform[2], canvas_height * init_buttons[i].transform[3]];
        if(x >= transform[0] && x <= transform[0] + transform[2]){
            if(y >= transform[1] && y <= transform[1] + transform[3]){
                init_buttons[i].onClick();
                return true;
            }
        }
    }
    return false;
}

function login_click_handler(x,y){
    if(mode == 0){
        if(check_login_buttons(x,y)) return;
        //if(check_login_fields(x,y)) return;
        else if(check_login_next_prev(x,y)) return;
        else{
            password_edit = false;
            username_edit = false;
        }
    } else if(mode == 1){
        if(check_account_create_buttons(x,y)) return;
        if(check_create_fields(x,y)) return;
        else{
            create_selected = -1;
        }
    }
    else if(mode == 2){		
        if(check_init_buttons(x,y)) return;
    }
}