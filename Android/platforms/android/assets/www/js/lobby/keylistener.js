function login_keylistener(letter){
    if(mode != 1){
        if(letter == "SUBMIT"){
            submit_login();
            return;
        }
        if(username_edit){
            if(letter == "back"){
                var new_str = "";
                for(var i = 0; i < login_fields[0].text.length-1; i++){
                    new_str += login_fields[0].text[i];
                }
                login_fields[0].text = new_str;
            } else if(letter == "tab"){
                username_edit = false;
                password_edit = true;
            } else{
                login_fields[0].text += letter;
                
            }
        } else if(password_edit){
            if(letter == "back"){
                var new_str = "";
                for(var i = 0; i < login_fields[1].text.length-1; i++){
                    new_str += login_fields[1].text[i];
                }
                login_fields[1].text = new_str;
            } else if(letter == "tab"){
                username_edit = true;
                password_edit = false;
            } else{
                login_fields[1].text += letter;
            }
        }
    } else if(create_selected != -1){
        if(letter != "back"){
            create_fields[create_selected].text += letter;
        } else{
            var new_str = "";
            for(var i = 0; i < create_fields[create_selected].text.length-1; i++){
                new_str += create_fields[create_selected].text[i];
            }
            create_fields[create_selected].text = new_str;
        }
    }
}


function key_handler(e){
    if(e.keyCode == 16)
        shift_down = false;
    else if(e.keyCode == 20)
        caps = !caps;
    
    
    var letter = 'NAN';
    
    if(e.keyCode == 8){
        letter = "back";
    } else if(e.keyCode == 9){
        letter = "tab";
    } else if(e.keyCode == 13){
        letter = "SUBMIT";
    } else if(e.keyCode == 32){
        letter = " ";
    } else if(e.keyCode == 46){
        letter = ".";
    } else if(e.keyCode == 48){
        if(shift_down || caps){
            letter = ")";
        } else{
            letter = "0";
        }
    } else if(e.keyCode > 48 && e.keyCode < 58){
        console.log("Changing NUM TO SYM");
        if(shift_down || caps){
            letter = symbols[e.keyCode - 49];
        } else{
            letter = String.fromCharCode(e.keyCode);
        }
    } else if(e.keyCode > 64 && e.keyCode < 91){
        if(shift_down || caps){
            letter = String.fromCharCode(e.keyCode);
        } else{
            letter = String.fromCharCode(e.keyCode + 32);
        }
    } else if(e.keyCode == 187){
        if(shift_down || caps){
            letter = "+";
        } else{
            letter = "=";
        }
    } else if(e.keyCode == 189){
        if(shift_down || caps){
            letter = "_";
        } else{
            letter = "-";
        }
    }

    if(letter != 'NAN'){
        if(mode >= 0 && mode < 100){
            login_keylistener(letter);
        } else if(mode > 100 && mode <= 200){
            
        }
    }
}

function key_down_handler(e){
    if(e.keyCode == 16)
        shift_down = true;
    else if(e.keyCode == 8 || e.keyCode == 9){
        // By default backspace navigates back, hand to remidy that
        e.preventDefault();
    }
}


