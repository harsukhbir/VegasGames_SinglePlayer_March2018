function draw_login_buttons(){ 
    for(var i = 0; i < login_buttons.length; i++){
        if(i!=2){
            var transform = [canvas_width * login_buttons[i].transform[0], canvas_height * login_buttons[i].transform[1],  canvas_width * login_buttons[i].transform[2],  canvas_height * login_buttons[i].transform[3]];
            context.drawImage(login_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);
            context.font = login_buttons[i].font;
            context.fillStyle = login_buttons[i].font_color;
            var w = context.measureText(login_buttons[i].text).width / 2;
        }
            context.fillText(login_buttons[i].text, transform[0] + transform[2] / 2 - w, transform[1] + transform[3] * 0.6);
    }
    if(document.activeElement == login_form[0]){
        login_field_last = document.activeElement;
        //auto_size_text(login_next.text, canvas_width * login_next.transform[2], canvas_height);
        //draw_fancy_text(login_next.text, canvas_width * login_next.transform[0], canvas_height * 0.42);
        //context.fillText(login_next.text, canvas_width * login_next.transform[0], login_form[0].offsetTop + login_form[0].offsetHeight * 0.65);
        //draw_fancy_text(login_prev.text, canvas_width * login_prev.transform[0], canvas_height * 0.42);
    } else if(document.activeElement == login_form[1]){
        login_field_last = document.activeElement;
        auto_size_text(login_next.text, canvas_width * login_next.transform[2], canvas_height);
        //context.fillText(login_next.text, canvas_width * login_next.transform[0], login_form[1].offsetTop + login_form[1].offsetHeight * 0.65 - login_canvas_shift);
        //context.fillText(login_prev.text, canvas_width * login_prev.transform[0], login_form[1].offsetTop + login_form[1].offsetHeight * 0.65 - login_canvas_shift);
    }
}

function draw_login_text_fields(){
    /*
    for(var i = 0; i < login_fields.length; i++){
        var transform = [canvas_width * login_fields[i].transform[0], canvas_height * login_fields[i].transform[1],  canvas_width * login_fields[i].transform[2],  canvas_height * login_fields[i].transform[3]];
        context.drawImage(login_fields[i].background_img, transform[0], transform[1], transform[2], transform[3]);
        context.font = login_fields[i].font;
        context.fillStyle = login_fields[i].font_color;
        context.fillText(login_fields[i].text, transform[0] + transform[2] *0.05, transform[1] + transform[3] * 0.6);
    }
    */
    context.fillStyle = "#ffffff";
    auto_size_text(words[6] + ":", canvas_width * 0.17, canvas_height * 0.15);
    context.fillText(words[5] + ":", canvas_width * 0.5 - context.measureText(words[5] + ":").width/2, canvas_height * 0.35);
    context.fillText(words[6] + ":", canvas_width * 0.5 - context.measureText(words[6] + ":").width/2, canvas_height * 0.58);
    
}

function draw_create_fields(){
    /*
    for(var i = 0; i < create_fields.length; i++){
        var transform = [canvas_width * create_fields[i].transform[0], canvas_height * create_fields[i].transform[1],  canvas_width * create_fields[i].transform[2],  canvas_height * create_fields[i].transform[3]];
        context.drawImage(create_fields[i].background_img, transform[0], transform[1], transform[2], transform[3]);
        context.font = create_fields[i].font;
        context.fillStyle = create_fields[i].font_color;
        context.fillText(create_fields[i].text, transform[0] + transform[2] *0.05, transform[1] + transform[3] * 0.6);
    }
    */
    auto_size_text(words[5] + ":", canvas_width * 0.13, canvas_height);
    context.fillStyle = "#ffffff";
    var spacing = canvas_height * 0.14;
    var left = canvas_width * 0.495;
    var top = canvas_height * 0.18;
    var titles = [words[5] + ":", "Email:", words[6] + ":", words[6] + ":", "Name" + ":"];
    for(var i = 0; i < titles.length; i++){
        context.fillText(titles[i], left - context.measureText(titles[i]).width/2, top + spacing*i);
    }

    /*
    context.fillStyle = "#ffffff";
    auto_size_text("User Name  ", canvas_width * 0.2, canvas_height * 0.15);
    context.fillText("User Name", canvas_width * 0.1, canvas_height * 0.5);
    context.fillText("Password", canvas_width * 0.1, canvas_height * 0.7);    
    */
}

function draw_login_background(){
    context.drawImage(lobby_background, 0, 0, canvas_width, canvas_height);
    context.fillStyle = "#ffffff";
    auto_size_text(words[0], canvas_width * 0.14, canvas_height * 0.15);
    context.fillText(words[0], canvas_width * 0.5 - context.measureText(words[0]).width/2, canvas_height * 0.2);    
}

function draw_create_background(){
    context.drawImage(lobby_background, 0, 0, canvas_width, canvas_height);
    context.fillStyle = "#ffffff";
    var title = words[3];
    auto_size_text(title, canvas_width * 0.25, canvas_height * 0.25);
    context.fillText(title, canvas_width * 0.5 - context.measureText(title).width/2, canvas_height * 0.1);    
}

function draw_create_buttons(){
    for(var i = 0; i < account_create_buttons.length; i++){
        if(i != 2){
            var transform = [canvas_width * account_create_buttons[i].transform[0], canvas_height * account_create_buttons[i].transform[1],  canvas_width * account_create_buttons[i].transform[2],  canvas_height * account_create_buttons[i].transform[3]];
            context.drawImage(account_create_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);
            context.font = account_create_buttons[i].font;
            context.fillStyle = account_create_buttons[i].font_color;
            var w = context.measureText(account_create_buttons[i].text).width / 2;
            context.fillText(account_create_buttons[i].text, transform[0] + transform[2] / 2 - w, transform[1] + transform[3] * 0.6);
        }
    } 
}

function draw_init_buttons(){
    for(var i = 0; i < init_buttons.length; i++){
        var transform = [canvas_width * init_buttons[i].transform[0], canvas_height * init_buttons[i].transform[1],  canvas_width * init_buttons[i].transform[2],  canvas_height * init_buttons[i].transform[3]];
        context.drawImage(init_buttons[i].background_img, transform[0], transform[1], transform[2], transform[3]);
        context.font = init_buttons[i].font;
        context.fillStyle = init_buttons[i].font_color;
        var w = context.measureText(init_buttons[i].text).width / 2;
        context.fillText(init_buttons[i].text, transform[0] + transform[2] / 2 - w, transform[1] + transform[3] * 0.6);
    }
    context.font = init_buttons[3].font;
    context.fillStyle = init_buttons[3].font_color;
    var txt = words[4] + "?     ";
    //context.fillText(txt, canvas_width*init_buttons[3].transform[0] - context.measureText(txt).width, canvas_height*init_buttons[3].transform[1] + canvas_height*init_buttons[3].transform[3]*0.6);
    
    auto_size_text(words[0], canvas_width * 0.11, canvas_height * 0.07);
    var h = context.measureText("T").width;
    var left = canvas_width * 0.15;
    var top = canvas_height * 0.55;
    draw_fancy_text(words[0], left, top);
    top += h * 2;
    left += context.measureText(words[0]).width - context.measureText("Facebook").width;
    draw_fancy_text("Facebook", left, top);
    
    left = canvas_width * 0.76;
    top = canvas_height * 0.55;
    if(language_selected == 0){
        draw_fancy_text("Play", left, top);
        top += h * 2;
        left -= h;
        draw_fancy_text("as guest", left, top);
    } else {
        draw_fancy_text(words[2], left, top);
        top += h * 2;
        left -= h;
    }
    
    left = canvas_width * 0.5 - context.measureText(words[1]).width / 2;
    top =  canvas_height * 0.7;
    draw_fancy_text(words[1], left, top);
    top += h*2;
    left = canvas_width * 0.5 - context.measureText("Vegas Games").width / 2;
    draw_fancy_text("Vegas Games", left, top);
    
}

function draw_init_background(){
    context.drawImage(lobby_background, 0, 0, canvas_width, canvas_height);
}


function draw_login(){
    if(document.activeElement == login_form[1] && login_shift_enabled){
        if(mode == 0){
            canvas.style.top = login_canvas_shift.toString() + "px";
        } else{
            canvas.style.top = "0px";
        }
        login_form[0].style.top = (parseInt(canvas.offsetTop) + parseInt(login_form_dif)).toString() + "px";
        login_form[1].style.top = (parseInt(canvas.offsetTop) + parseInt(login_form_dif) -login_canvas_shift).toString() + "px";
    } else {
        canvas.style.top = "0px";
        login_form[0].style.top = (parseInt(canvas.offsetTop) + parseInt(login_form_dif)).toString() + "px";
        login_form[1].style.top = (parseInt(canvas.offsetTop) + parseInt(login_form_dif) -login_canvas_shift).toString() + "px";
    }
    switch(mode){
        case 0:
            if(document.activeElement == login_form[0] || document.activeElement == login_form[1]){
                active_timer = 0;
            } else{
                active_timer++;
            }
            draw_login_background();
            draw_login_buttons();
            draw_login_text_fields();
            break;
        case 1:
            draw_create_background();
            draw_create_buttons();
            draw_create_fields();
            break;
        case 2:
            draw_init_background();
            draw_init_buttons();
        default:
            break;
    }
}