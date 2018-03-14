function draw_standard_text_scale(text){
    //console.log(text);
    context.fillText(text.txt, canvas.width * text.transform[0], canvas.height * text.transform[1], canvas.width * text.transform[2], canvas.height * text.transform[3]);
}

function draw_standard_text_center(text){
    var trans = [
                canvas.width * (text.transform[0] + text.transform[2] * 0.5) - context.measureText(text.txt).width/2,
                canvas.height * (text.transform[1] + (text.transform[3] * 0.7)),
                canvas.width * text.transform[2],
                canvas.height * text.transform[3]
    ];
    //console.log(text, trans);
    //stop_engine();
    //context.font = 20 + font;
    context.fillText(text.txt, trans[0], trans[1], trans[2], trans[3]);
}


function draw_standard_text(text){
    //console.log(text);
    context.fillText(text.txt, text.transform[0], text.transform[1], text.transform[2], text.transform[3]);
}

function draw_fancy_text(text, left, top){


    var w = context.measureText("T").width;
    context.strokeStyle ="#5b0262";
    context.miterLimit = 2;
    context.lineWidth = 7;
    context.strokeText(text, left, top);
    context.lineWidth = 1;
    
    //var text_gradient = context.createLinearGradient(0, top-w/login_fields[0].text.length, 0,  top + w/login_fields[0].text.length);
    var text_gradient = context.createLinearGradient(0, top - w, 0,  top - w * 0.2);
    text_gradient.addColorStop("0", "#fcd538");
    text_gradient.addColorStop("0.5", "#f4ac2c");
    text_gradient.addColorStop("1.0", "#e85a07");
    context.fillStyle = text_gradient;
    
    context.fillText(text, left, top);
}

function draw_fancy_text_center(text, left, top){
    
    draw_fancy_text(text, left - context.measureText(text).width/2, top);
}

function text_graphics(text){
    if(text.font != null){
        context.font = text.font;
    }
    if(text.color != null){
        context.fillStyle = text.color;
    }
    console.log(text.style);
    switch(text.style){
        case 0:
            draw_standard_text(text);
            break;
        case 1:
            draw_standard_text_scale(text);
            break;
        case 2:
            draw_standard_text_center(text);
            break;
        case 3:
            draw_fancy_text(text.txt, canvas.width * text.transform[0], canvas.height * text.transform[1]);
            break;
        case 4:
            draw_fancy_text(text.txt, canvas.width * text.transform[0], canvas.height * text.transform[1]);
            break;
        default:
            draw_standard_text(text);
            break;
    }
}

