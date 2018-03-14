/*
function draw(){
    if(mode > screens.length || screens[mode] == null)
        return;
    
    // Drawing Background
    if(screens[mode].background != null){
        context.drawImage(screens[mode].background.img,
        canvas.width * screens[mode].transform[0],
        canvas.height * screens[mode].transform[1],
        canvas.width * screens[mode].transform[2],
        canvas.height * screens[mode].transform[3]);
    }
    
    // Drawing Screen Elements
    for(var i = 0; i < screens[mode].drawables.length; i++){
        if(screens[mode].drawables[i].visible){
            render_drawable(screens[mode].drawables[i]);
        }
    }
    
    if(show_payout){
        draw_payout_table();
    }
    if(store_open){
        store_graphics();
    }

}

function render_drawable(drawable){
    drawable.draw(drawable);
    for(var i = 0; i < drawable.drawables.length; i++){
        if(drawable.drawables[i].visible){
            render_drawable(drawable.drawables[i]);
        }
    }
}

function draw_image(image){
    context.drawImage(image.img, 
        canvas.width * image.transform[0],
        canvas.height * image.transform[1],
        canvas.width * image.transform[2],
        canvas.height * image.transform[3]
    );

}


function draw_drawable(drawable){
    
}
*/