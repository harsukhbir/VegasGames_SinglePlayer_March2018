// Abstract Parent Classes
function new_GameObject(){
    var obj = new Object();
    obj.vars = [];
    obj.attributes = [];
    obj.drawables = [];
    obj.add_attribute = add_attribute;
    obj.interactable = false;
    obj.arg = null;
    obj.visible = false;
    obj.check = check_click;
    obj.id = "Undefined";
    obj.type = "GameObject";
    return obj;
}

// Inherits from GameObject
function new_drawable(layer, transform){
    var obj = new_GameObject();
    obj.transform = transform;
    obj.layer = layer;
    obj.visible = true;
    obj.draw = draw_drawable;
    obj.img = null;
    obj.txt = null;
    obj.type = "Drawable";
    return obj;
}

function new_timer(time, loop){
    var obj = new_GameObject();
    obj.tick = function(obj){
        if(obj.time > 0){
            obj.time--;
            if(obj.time <= 0){
                obj.result();
                if(obj.loop){
                    obj.reset(obj);
                }
            }
        }
    };
    obj.result = function(){};
    obj.reset = function(obj){
        obj.time = obj.length;
    };
    obj.length = time;
    obj.time = time;
    obj.loop = loop;
    return obj;
}

// These "Classes" are not abstract 
function new_static_img(img, transform, layer){
    var obj = new_drawable(layer, transform);
    obj.img = img;
    obj.draw = draw_image;
    obj.type = "Static Img";
    return obj;
}

function new_button(layer, transform, onclick){
    var obj = new new_drawable(layer, transform);
    obj.interactable = true;
    obj.onClick = onclick;
    obj.type = "Button";
    return obj;
}

function new_screen(background){
    var obj = new_drawable(-100, [0,0,1,1]);
    obj.onExit = function(){};
    obj.onOpen = function(){};
    obj.background = background;
    obj.type = "Screen";
    return obj;
}



// Text object, performs similarly to drawable
function new_text(txt, font, style, transform, layer, color){
    var obj = new_drawable(layer, transform);
    obj.draw = text_graphics;
    obj.color = color;
    obj.txt = txt;
    obj.font = font;
    obj.style = style;
    obj.transform = transform;
    obj.type = "Text";
    return obj;
}