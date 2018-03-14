function new_increase_decrease(transform, text, fnt, increase, decrease){
    var field = new_drawable(2, transform);
    var t_transform = transform.slice();
    t_transform[0] = transform[0] + transform[2] * 0.02;
    t_transform[1] = transform[1] + transform[3] * 0.7;
    var bet_text = new_text(text, fnt, 1, t_transform, 4, "#ffffff");
    //bet_text.draw = txt_graphics_debug;
    field = add_drawable(field, bet_text);

    field = add_drawable(field, new_static_img(inc_dec_field, transform, 1));
    
    var dec_transform = [
        transform[0] + transform[2] * 0.377,
        transform[1],
        transform[2] * 0.20,
        transform[3]
    ];
    var decrease_btn = new_button(3, dec_transform, decrease);
    decrease_btn.id = "decrease";
    field = add_drawable(field, decrease_btn);
    
    var inc_transform = dec_transform.slice();
    
    
    inc_transform[0] = transform[0] + transform[2] * 0.774;
    var increase_btn = new_button(3, inc_transform, increase);
    increase_btn.id = "increase";
    field = add_drawable(field, increase_btn);
    
    field.type = "Inc Dec";
    
    return field;
}