function draw_payout_table(){
    var value = get_payout_value();;
    context.fillStyle = "#000000";
    context.globalAlpha = 0.5;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.globalAlpha = 1;
    
    
    var left_col = (payout_transform[0] + payout_transform[2] * 0.09);
    var right_col = (payout_transform[0] + payout_transform[2] * 0.555);
    var table_width = (payout_transform[2] * 0.445);
    var  table_spacing = [
        payout_transform[2] * 0.02,
        payout_transform[3] * 0.02
    ];
    var row_dimens = [
        payout_transform[2] * 0.31,
        payout_transform[3] * 0.05
    ];
    
    // Draw Right Column
    var top = payout_transform[1] + payout_transform[3] * 0.09;
    var fnt = auto_size_text(10, canvas.width * table_width * 0.2, canvas.height * row_dimens[1] * payout_vals[0].length) + font;
    for(var i = 0; i < 4; i++){
        var val = value + 3 - i;
        draw_table(val, right_col, top, table_width, row_dimens[1]);
        top += row_dimens[1] * (payout_vals[val].length + 1) + table_spacing[1];
        context.font = fnt;
    }
    
    var top_indent = (top - (payout_transform[1] + payout_transform[3] * 0.09) - (row_dimens[1] * (payout_vals[value + 4].length + payout_vals[value + 5].length + 2) + table_spacing[1]))/2;
        
    
    // Draw Left Column
    top = payout_transform[1] + payout_transform[3] * 0.09;
    top += top_indent;
    //top += (row_dimens[1] * (payout_vals[value + 4].length + payout_vals[value + 5].length + 2) + table_spacing[1]) / 2;
    for(var i = 0; i < 2; i++){
        var val = value + 5 - i;
        draw_table(val, left_col, top, table_width, row_dimens[1]);
        top += row_dimens[1] * (payout_vals[val].length + 1) + table_spacing[1];
        context.font = fnt;
    }
    
    
    context.drawImage(payout_text, canvas.width * payout_transform[0], canvas.height * payout_transform[1], canvas.width * payout_transform[2] * 0.285, canvas.height * payout_transform[3] * 0.185);
    //context.drawImage(payout_exit_img, canvas.width * (payout_transform[0] + payout_transform[2] * 0.75), canvas.height * payout_transform[1], canvas.width * payout_transform[2] * 0.25, canvas.width * payout_transform[2] * 0.25);
}

function draw_table(value, left, top, width, height){

    context.drawImage(payout_left, canvas.width * left, canvas.height * (top + height), canvas.width * width * 0.303, canvas.height * (height * payout_vals[value].length));
    context.drawImage(payout_top, canvas.width * left, canvas.height * top, canvas.width * width, canvas.height * height);
    
    var w = context.measureText(value).width;
    context.fillText(value, canvas.width * (left + width * 0.15) - w / 2, (canvas.height * (top + height)) + (canvas.height * height * payout_vals[value].length * 0.7));
    
    auto_size_text(1, canvas.width, canvas.height * height * 0.8);
    
    var row_transform = [
        left + width * 0.3,
        top + height,
        width * 0.7,
        height
    ];
    
    for(var i = 0; i < payout_vals[value].length; i++){
        context.drawImage(payout_row,
                canvas.width * row_transform[0],
                canvas.height * row_transform[1],
                canvas.width * row_transform[2],
                canvas.height * row_transform[3]
            );
            
        var text_height = canvas.height * (row_transform[1] + row_transform[3] * 0.72);
        context.fillText(value - i, canvas.width * (row_transform[0] + row_transform[2] * 0.08), text_height);
        w = context.measureText(payout_vals[value][i]).width;
        context.fillText(payout_vals[value][i], canvas.width * (row_transform[0] + row_transform[2] * 0.6) - w / 2, text_height);
        
        row_transform[1] += height;
    }
}
