function new_square(transform, value){
    var obj = new_button(1, transform, square_click);
    obj.type = "Square";
    var img = new_static_img(square_imgs[0], transform, 0);
    img.draw = draw_square;
    obj = add_drawable(obj, img);
    var text_width = transform[2] * 0.4;
    var text_height = transform[3] * 0.6;
    var fnt = auto_size_text(value, canvas.width * text_width, canvas.height * text_height) + font;
    var text = new_text(value, fnt, 2, transform, 1, "#ffffff");
    obj = add_drawable(obj, text);
    return obj;
}