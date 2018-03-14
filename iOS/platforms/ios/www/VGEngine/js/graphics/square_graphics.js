function draw_square(square){
    context.globalAlpha = 0.55;
    context.drawImage(square.img, 
        canvas.width * square.transform[0],
        canvas.height * square.transform[1],
        canvas.width * square.transform[2],
        canvas.height * square.transform[3]
    );
    context.globalAlpha = 1;
}

function draw_lines(arg1){
    context.fillStyle = "#ffffff";
    
    
    // Vertical Lines
    var transform = [
        0,
        0,
        canvas.width * square_spacing,
        canvas.height
    ];
    for(var i = 0; i < 12; i++){
        transform[0] = canvas.width * i * (square_dimens[0] + square_spacing);
        if(i == 8){
            transform[3] = canvas.height * (square_dimens[1] + square_spacing) * 6;
        }
        context.fillRect(transform[0], transform[1], transform[2], transform[3]);
    }
    
    
    // Horizontal Lines
    transform = [
        0,
        0,
        canvas.width,
        canvas.height * square_spacing
    ];
    for(var i = 0; i < 10; i++){
        transform[1] = canvas.height * i * (square_dimens[1] + square_spacing);
        if(i == 6){
            transform[2] = canvas.width * 8 * (square_dimens[0] + square_spacing);
        }
        context.fillRect(transform[0], transform[1], transform[2], transform[3]);
    }
    
}