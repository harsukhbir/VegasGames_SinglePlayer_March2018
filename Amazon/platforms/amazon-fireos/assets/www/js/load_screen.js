function draw_load(){
    context.drawImage(load_bg, 0,0, canvas_width, canvas_height);
    context.drawImage(logo, canvas_width * 0.385, canvas_height * 0.41, canvas_width * 0.2, canvas_height * 0.13);
    
    var trans = [
        0.41,
        0.555,
        0.153,
        0.033
    ];
    context.drawImage(load_bar_back, canvas_width * trans[0], canvas_height * trans[1], canvas_width * trans[2], canvas_height * trans[3]);
    
    
    var width = canvas_width * 0.03;
    var height = canvas_height * 0.02;
    var text = "70%";
    font_size = 1;
	context.font = font_size + font;
	while(context.measureText("W").width <= height && context.measureText(text).width < width){
		font_size++;
		context.font = font_size + font;
	}

    width = trans[2];
    var outline = trans[0] * 0.01;
    trans[0] += outline;
    trans[1] += outline;
    trans[2] -= 2 * outline;
    trans[3] -= 2 * outline;
    var now = new Date().getTime()
    var percent = (now - load_start) / load_total;
    
    if(percent > 1)
        percent = 1;
    trans[2] *= percent;
    
    context.fillStyle = "#850101";
    context.fillRect(canvas_width * trans[0], canvas_height * trans[1], canvas_width * trans[2], canvas_height * trans[3]);
    context.fillStyle = "#ffffff";
    percent = Math.floor(percent * 100);
    percent += "%";
    context.fillText(percent,
        canvas_width * (trans[0] + width * 0.5) - context.measureText(percent).width/2,
        canvas_height * (trans[1] + outline + trans[3] * 0.8)
        );
    
    if(now > load_end){
        loading = false;
    }
}

function load_begin(time){
    load_start = new Date().getTime();
    loading = true;
    load_total = time;
    load_end = load_start + time;
}


function load_init(){
    img_dir = 'img/';
    load_time = new Date().getTime();
    load_bg = new Image();
    load_bg.src = img_dir + "load/load_bg.png";
    
    load_bar_back = new Image();
    load_bar_back.src = img_dir + "load/load_bar_back.png";
    
    logo = new Image();
    logo.src = img_dir + "logo.png";
}


var load_time;
var load_checked = false;
var loading;
function load_complete(){
    if(!load_checked){
        load_time = new Date().getTime() - load_time;
        load_checked = true;
        console.log("Time: " + load_time);



        // if(rvAvailable) {
        //     ssAds.showRewardedAd();
        // } else {
        //     alert('No rewarded videos are available.')
        // }
        
    }
}



var load_start, load_end, load_total;
var load_bg, load_bar_back;


var load_times = {
    index: 4000,
    lobby_return: 700,
    vp: 2000,
    bingo: 2500,
    keno: 3000
};

load_init();