/*
 *
 * FUTURE
 * ------
 * Style 5 - 3 Reel slot machine as in the mocks
 * Style 6 - Candy Crush Saga style.    ##HARD## to make this no win.
 * Style 7 - Grid drop variant - a user selects a square, it reveals something, it then disapears causing those above to drop down
 * and a chain reaction takes place and they collect some gems.  ##HARD## to make this no win.
 * Style 8 - Candy clicker style game.
 *
 * Satisfying clicks
 * Satisfying effects on drag over items
 * Double up challenge
 *
 * Surprise people!  big gems, bonus items, chain reactions, fall downs etc
 * Multiplier between rounds
 * Collections - sticker book, show previous wins
 */

//var landscapeRatio = { width : 2048, height : 1291 };
var landscapeRatio = { width : 1280, height : 800 };   // Nexus 7			height:960 ?
var portraitRatio = { width : 800, height : 1280 };
//var phoneRatio = { width : 2048, height : 1150 }; // These are a bit slimer

var canvas, stage;
var scratchSurface, drawing;
var oldPt;
var itemsContainer;
var color;
var stroke;
var erase = true;
var itemTypes = 12;
var itemImgWidth=375;

var themes = {
	diamonds : {
		//msgFont : "'las_vegas_fabulous'"
		msgFont : "arial",
		bgLineColour : "#000"
	},
	egypt : {
		msgFont : "'las_vegas_fabulous'"
	},
	funkyfruit : {
//		msgFont : "'las_vegas_fabulous'"
		msgFont : "arial",
		bgLineColour : "#fff",
		textStrokeCol : "#96e10b"
	},
};


function gameReady(theme, game, tConfig, winnings, onGameFinished) {
	info("gameReady() called.  theme="+theme+", game="+game+", winnings="+winnings+",");
	info(JSON.stringify(tConfig));

	setSize();
	$(window).bind('resize', setSize);

	var ran = Math.random() + "";
	$("#game").attr("data-random", ran); 				// tag it with a random number
	var check = function() {
		if ($("#game").attr("data-random") != ran) {
			destroyScratchVariables();
		} else {
			setTimeout(check, 2000);
		}
	}
	check(); // We tidy up when we leave the page		// $("#game").on("unload", destroyScratchVariables);

	loadImages(getImagesToPreload(), startGame);

	//------------------------------------------------------------

	function destroyScratchVariables() {

	}

	function getImagesToPreload() {
		var imgs = [];
		for (i = 1; i <= itemTypes; i++) {
			imgs.push(gfxCtx + "/" + theme + "/items/" + i + ".png?w="+itemImgWidth);
		}
		imgs.push(gfxCtx + "/" + theme + "/overlay.png");
		imgs.push(gfxCtx + "/" + theme + "/bg.jpg");
		return imgs;
	}

	function startGame() {
		if (window.top != window) {
			//document.getElementById("header").style.display = "none";
		}

		$("#game").show();
		$("#loadingCanvasContainer").hide();

		$(".identityLabel").click(function(){
			$("#logging").show();
		});

		tConfig.prizes = _.sortBy(tConfig.prizes, function(x){ return -x[2];}) 			//ticketConfig.prizes needs to ordered smallest prize to biggest

		if(!safetyCheck(tConfig, winnings)){
			error("winnings "+winnings+" specified for ticketConfig "+JSON.stringify(tConfig));
			alert("ERROR INVALID WIN FOR TICKET");
			return;
		};
		
		setTheme(theme);
		if(game=="1"){
			var cards = 3;
			var startCard = function(){
				if(cards-- > 0){
					minigame1("gameCanvas", 4, 4, theme, tConfig, winnings, "nylon1", startCard);
				}else{
					alert("Game over.  Play again?");
				}				
			}			
			startCard();			
		}else if(game=="2"){
			//Search scratcher
			var cards = 3;
			var startCard = function(){
				if(cards-- > 0){
					setTimeout(function(){
						minigame2("gameCanvas", theme, tConfig, winnings, "nylon1", startCard);
					},3000);								
				}else{
					alert("Game over.  Play again?");
				}				
			}
			startCard();

		}else if(game=="3"){
			minigame3("gameCanvas", theme, tConfig, winnings);
		}else if(game=="4"){
			minigame4("gameCanvas", theme, tConfig, winnings);			
		}else if(game=="5"){
			spinner("gameCanvas", theme, tConfig, winnings);			
		}else if(game=="6"){
			Roulette("gameCanvas", theme, tConfig, winnings);
		}else if(game=="7"){
			minigame7("gameCanvas", theme, tConfig, winnings);	
		}else if(game=="8"){
			dice("gameCanvas", theme, tConfig, winnings);				
		}else if(game=="9"){
			VideoPoker("gameCanvas");				
		}else{
			alert("please specify a game type");
		}
  }
}

function pulseGems(bitmaps) {
	var waitTime=0;
	for (b in bitmaps) {
		createjs.Tween.get(bitmaps[b], {ignoreGlobalPause : true}).wait(waitTime).to({ alpha : 0,
							scaleX : (bitmaps[b].scaleX * 2),
							scaleY : (bitmaps[b].scaleY * 2) }, 1500);
		waitTime+=75;
	}
}


function pulseGemsInOrder(bitmaps, gemCount) {
	var waitTime=0;
	var sets = {};

	for (b in bitmaps) {
		var l = sets[bitmaps[b].type];
		if(!l){
			l = [];
			sets[bitmaps[b].type] = l;
		}
		l.push(bitmaps[b]);
	}
	for (ss in sets) {
		var set = sets[ss]
		for(s in set){
			var count = ++gemCount[set[s].type];

			/* function getAddTextFunction(count, x, y){
				return function(){
					var text2 = new createjs.Text(count, (canvasWidth / 10) + "px Arial", "#fff");
					text2.textAlign = "center";
					text2.x = x;
					text2.y = y;
					itemsContainer.addChild(text2);
					createjs.Tween.get(text2).to({ alpha : 0, scaleX : (text2.scaleX * 2), scaleY : (text2.scaleY * 2) }, 1500);
				}
			} */

			//createjs.Tween.get(set[s], {ignoreGlobalPause : true}).wait(waitTime).call(getAddTextFunction(count, set[s].x, set[s].y)).to({ alpha : 0,
			createjs.Tween.get(set[s], {ignoreGlobalPause : true}).wait(waitTime).to({ alpha : 0,
				scaleX : (set[s].scaleX * 2),
				scaleY : (set[s].scaleY * 2) }, 1500);
			waitTime+=150;
		}
	}

	return gemCount;
}

function stop() {}


/**
 * Get the amount of pixels that have an alpha of 0 and so are empty.
 *
 * @returns value between 0 & 1
 */
function getEmptyPixelsWORKS(canvas) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	var emptyPixels = 0;
	var l = pixels.length;
	for ( var i = 0; i < l; i += 4) {
		var alpha = pixels[i + 3]; // Number between 0 and 255
		if (alpha == 0) {
			emptyPixels++;
		}
	}
	return emptyPixels / (canvas.width * canvas.height);
}

function getEmptyPixels(canvas, rects) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	var emptyPixels = 0;
	var l = pixels.length;
	var rectsPixels=0;

	for(r in rects){
		var fromX = rects[r].x,
			fromY = rects[r].y,
			toX = rects[r].x + rects[r].width,
			toY = rects[r].y + rects[r].height;

		for (var i = fromX; i < toX; i++) {
			for (var j = fromY; j < toY; j++) {
				var alpha = pixels[((j*canvas.width)+i)*4 + 3]; // Number between 0 and 255
				if (alpha == 0) {
					emptyPixels++;
				}
			}
		}
		rectsPixels += ((toX-fromX) * (toY-fromY));
	}
	return emptyPixels / rectsPixels;
}

function setSize_OLD(recur) {
	var styleElement = $("link[rel=stylesheet].minipokerSizeStyle");
	var w = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	var x = w / 10;
	$("body").css("font-size", x + "px"); // do we need this?
}


function defaultSetFontSize2() {
	var c = "http://" + document.location.host;
	var w = getDocumentDimension().width;
	var h = getDocumentDimension().height;
	var x = 16 * w / 240;
	var styleElement = $("link[rel=stylesheet].commonGuiSizeStyle");

	if (isLandscape()) { // if (isLandscape()) {
		// #FSIZE# x = 16*w/480;
		if (styleElement.attr("href") == "") {
			styleElement.attr("href", c + ctx + "/styles/commonGuiLandscape.css");
		}
	} else {
		// #FSIZE# x = 16*w/240;
		if (styleElement.attr("href") != "") {
			styleElement.attr("href", "");
		}
	}
	log("Setting lobby body font-size to " + x);
	$("body").css("font-size", x + "px"); // Adjust the value of 1em
}

function getOnLoadBitmapHandler(bitmap, targetWidth, targetHeight){
	return function(){
		bitmap.scaleX = targetWidth / this.width;
		bitmap.scaleY = targetHeight / this.height;
		bitmap.regX = this.width / 2; // set origin point to center of the bitmap
		bitmap.regY = this.height / 2;
	};
}


