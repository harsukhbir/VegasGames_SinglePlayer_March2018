function auto_size_text(text, width, height){
	font_size = 1;
	context.font = font_size + font;
	while(context.measureText("W").width <= height && context.measureText(text).width < width){
		font_size++;
		context.font = font_size + font;
	}
    return font_size;
}

function stop_engine(){
    clearInterval(game_loop);
}

function resize_screen(){
    resize_game_canvas();
	font_size = Math.floor(canvas.width / 40);
	context.font = font_size + font;
}

function remove_at(arry, index){
    var ary = [];
    for(var i = 0; i < arry.length; i++){
        if(i != index)
            ary.push(arry[i]);
    }
    return ary;
}

function insert_at(arry, value, index){
    var ary = [];
    for(var i = 0; i < arry.length; i++){
        if(i == index){
            ary.push(value);
        }
        ary.push(arry[i]);
    }
    return ary;
}

function log(text, level){
    if(level >= log_level){
        console.log(text);
    }
}


function sort_attributes(obj){
    var attributes_sorted = [];
    var attributes = [];
    for(var i = 0; i < obj.attributes.length; i++){
        attributes.push(obj.attributes[i]);
    }
    while(attributes.length > 0){
        var smallest = 100000;
        var index = 0;
        for(var i = 0; i < attributes.length; i++){
            if(attributes[i].layer < smallest){
                smallest = attributes[i].layer;
                index = i;
            }
        }
        attributes_sorted.push(attributes[index]);
        remove_at(attributes, index);
    }

    obj.attributes = attributes_sorted;
    return obj;
}

function get_drawable_with_id(obj, id){
    for(var i = 0; i < obj.drawables.length; i++){
        if(obj.drawables[i].id == id){
            return obj.drawables[i];
        }
    }
}

function add_drawable(obj, drawable){
    var index = -1;
    for(var i = 0; i < obj.drawables.length; i++){
        if(drawable.layer >= obj.drawables[i].layer){
            index = i;
        } else {
            break;
        }
    }
    if(index == -1){
        if(obj.drawables.length == 0)
            obj.drawables.push(drawable);
        else{
            obj.drawables = insert_at(obj.drawables, drawable, 0);
        }

    } else {
        if(index + 1 < obj.drawables.length){
            obj.drawables = insert_at(obj.drawables, drawable, index + 1);
        } else{
            obj.drawables.push(drawable);
        }
    }
    return obj;
}

// Adds a new attribute to an object in the appropriate position
// Currently Obfuscated, needs to be updated to act like add_drawable
function add_attribute(obj, attribute){
    var index = -1;
    for(var i = 0; i < obj.attributes.length; i++){
        if(attribute.layer >= obj.attributes[i].layer){
            index = i;
        } else {
            break;
        }
    }
    if(index == -1){
        obj.attributes.push(attribute);
    } else {
        obj.attributes = insert_at(obj.attributes, attribute, index);
    }
    return obj;
}