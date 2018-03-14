function resize(){
	canvas_width = window.innerWidth * 0.9;
	canvas_height = canvas_width * 9/16;
	
	font = 'px verdana';
	font_size = Math.floor(canvas_width / 40);
	context.font = font_size + font;
}

function auto_size_text(text, width, height){
	font_size = 1;
	context.font = font_size + font;
	while(context.measureText("W").width <= height && context.measureText(text).width < width){
		font_size++;
		context.font = font_size + font;
	}
    
    return font_size;
}


function begin(){
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
	resize();
    //result = order[Math.floor(Math.random() * (order.length - 1))];
   
    
    build_wheel();
	drawing = setInterval(wheel_graphics, frame_rate);
    canvas.addEventListener('click', function(event){
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        check_spin_btn(x,y);
	}, false);
}
var aspect_ratio = 16 / 9;
var frame_rate = 1;
var font_size, font;
var canvas, context;
