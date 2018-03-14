/**
	 * 	returns a mapping between the prize and the gems to show
	 */
function consolodatePrizes(ticketConfig){
  var prizeMapping = {},				//stores a mapping between the prize and the gems to show
      consolidatedPrizes = {};			//consolodate prizes of the same value
  for(var p=0; p < ticketConfig.prizes.length;p++){
    if(consolidatedPrizes[ticketConfig.prizes[p][1]] == null){
      consolidatedPrizes[ticketConfig.prizes[p][1]] = true;
    }
  }
  return consolidatedPrizes;
}

function populateGameStyle4Paytable(target, prizes, theme){
  //Populate the pay table
  target.html("");
  for(t in prizes){
    var l = $("<li>");
    var d = $("<span>");
    //info("pays "+prizes[t].prize);
    for(i=0; i < prizes[t].count; i++){
      d.append("<img data-itemType='"+prizes[t].type+"' src='"+gfxCtx + "/" + theme + "/items/"+prizes[t].type+".png?w=150'/>");
    }
    l.append(d);
    l.append("<span>pays "+prizes[t].prize+"<span>");
    //l.attr("data-name", prizes[t].prize);
    target.prepend(l);
  }
}


function setSize(recur) {
  var deviceStyleElement = $("link[rel=stylesheet].deviceCss");
  //var w = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  //desktopRatio = { width : 960, height : 1280 };

  canvasWidth = $("#gameCanvas").width();
  if (true || !isTouchDevice()) {
    // desktop
    var aspectRatio = isLandscape() ? landscapeRatio : portraitRatio;
    function mySetDesktopSize(d){
      info("window dimension = "+d.width+","+d.height);
      var scale = Math.min(d.width / aspectRatio.width, d.height / aspectRatio.height), 		//var w = (window.innerWidth > 0) ? window.innerWidth : screen.width;
          w = Math.round(scale * aspectRatio.width),
          h = Math.round(scale* aspectRatio.height),
          x = w / 10;
      $("#game").css("font-size", x + "px"); 										// Adjust the value of 1em
      //		        $("#game").width(w).height(h).css("left", 0); 			//.css("top", (d.height - h) / 2);
      $("#game").width(w).height(h).css("left", (d.width-w)/2);
      //		        $("#minipokerStandaloneContainer").width(w).css("left", (d.width - w) / 2);

      info("setSize - is desktop setting font-size to "+x);
      when.done("size-set");
    }

    if(window.self !== window.top && typeof getFB == "function" && getFB()){
      getFB().Canvas.getPageInfo(
        function(info) {
          info('FB.Canvas.getPageInfo Width: ' + info.clientWidth + ' Height: ' + info.clientHeight);
          mySetDesktopSize({ width : info.clientWidth, height : info.clientHeight });
        }
      );
    }else{
      //var d = { width : $("#sizeHelper").width(), height : $("#sizeHelper").height() };
      mySetDesktopSize(getWindowDimension());
    }

    //if(getUrlParameter("fb") && deviceStyleElement.attr("href") == "" || deviceStyleElement.attr("href") == null){
    //   	$("link[rel=stylesheet].deviceCss").attr("href", stylesctx+"/desktop.css?rand="+Math.random());
    //}
    if(isLandscape()){
      info("setting landscape style "+stylesctx);
      if (deviceStyleElement.attr("href") == "" || deviceStyleElement.attr("href") == null) {
        deviceStyleElement.attr("href", stylesctx+"/landscape.css?rand="+Math.random());
      }
    }else{
      info("removing landscape style");
      deviceStyleElement.attr("href", "");
    }
  } else {
    // touch device
    info("setSize - touch based device");
    var h = (window.outerHeight > 0) ? window.outerHeight : screen.height;
    $("body").css("height", "1000px"); 												// this will make the height a little more than is visible
    function setMobileSize() {
      var d = getWindowDimension();
      var aspectRatio = {}; 														// dynamically set the screen ratio
      if ($("#sizeHelper").height() > $("#sizeHelper").width()) {					// portrait
        aspectRatio = landscapeRatio;
      } else {
        aspectRatio.width = $("#sizeHelper").width();
        aspectRatio.height = $("#sizeHelper").height();
        var r = aspectRatio.width / aspectRatio.height;
        if (r > 1.7) {
          aspectRatio.width = 1.7 * aspectRatio.height; // This is the minimum aspect ratio we can support
        }
      }

      d.height = $("#sizeHelper").height(); // base the height off this element
      var scale = Math.min(d.width / aspectRatio.width, d.height / aspectRatio.height),
          w = Math.round(scale * aspectRatio.width), h = Math.round(scale* aspectRatio.height),
          x = w / 10; // 12 we could make this smaller depending on the aspect ratio?
      $("#game").css("font-size", x + "px"); // Adjust the value of 1em
      info("setSize - touch device setting font-size to "+x);

      window.scrollTo(0, 1);
      // resetBounceAnimation
      if (recur == null || recur < 4) {
        setTimeout(function() {
          setPokerSize(recur ? 1 : recur++); // run it once more just incase we can make it better now
        }, 1000);
      }
      when.done("size-set");
    }

    setTimeout(function() {
      window.scrollTo(0, 1);
      $("body").css("height", $("#sizeHelper").height()); // reduce the height back to the visibe height
      setMobileSize();
    }, 2500);

    deviceStyleElement.attr("href") == "";
  }
}


function size(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function addCurrencyToWinnings(str, currency){
	return str;
}

function setTheme(theme){
  var c = stylesctx+"/"+theme+".css?rand="+Math.random();
  $("link[rel=stylesheet].themeCss").attr("href", c);
  $("#bg").error(function() {  $("#bg").hide(); });
  $("#bg").attr("src", gfxCtx+"/"+theme+"/bg.jpg");
  $("#mainDiv .brandIcon").attr("src", gfxCtx+"/joyplay-flat.png");
  $("#mainDiv .costIcon").attr("src", gfxCtx+"/"+theme+"/2dollar.png");
  $("#mainDiv .identityIcon").attr("src", gfxCtx+"/"+theme+"/identityIcon.png");
  $("#mainDiv .identityLabel").attr("src", gfxCtx+"/"+theme+"/identity.png");
  //$("#audioButton").attr("src", gfxCtx+"/"+theme+"/audioOff.png");
  theme = theme;
}


function initialiseCanvas(gameCanvas){
  canvasWidth = $("#"+gameCanvas).width(); 			// The actual visible width
  height = $("#"+gameCanvas).height(); 			// The actual visible height
  canvas = document.getElementById(gameCanvas);
  canvas.width = canvasWidth; 						// The width at which it is drawn
  canvas.height = height; 						// The height at which it is drawn

  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);
  createjs.Ticker.setFPS(24);

  var itemsContainer = new createjs.Container();
  stage.addChild(itemsContainer);

  bitmaps = [];
  return {stage:stage, itemsContainer:itemsContainer};
}

function clearStage(stage, scratchSurface){
  stage.clear();
  stage.removeAllChildren();
  stage.removeAllEventListeners();
  if(scratchSurface){
    scratchSurface.uncache();
  }
}

/**
 * Adds a scratch surface to a stage element
 * @param stage
 * @param overlaySrc
 * @param width
 * @param height
 * @returns {___anonymous6918_6931}
 */
function addScratchSurface(stage, overlaySrc, width, height, name, msg1, msg2){
  var scratchSurface = new createjs.Container();
  scratchSurface.hitArea = new createjs.Shape(new createjs.Graphics().f("#000").dr(0, 0, width, height));
  stage.addChild(scratchSurface);

  var drawing = new createjs.Shape();
  scratchSurface.addChild(drawing);

  var scratchSurfaceBitmap = new createjs.Bitmap(overlaySrc);
  scratchSurfaceBitmap.scaleX = width / scratchSurfaceBitmap.image.width;
  scratchSurfaceBitmap.scaleY = height / scratchSurfaceBitmap.image.height;
  scratchSurface.addChild(scratchSurfaceBitmap);

  var font = "Arial"; 	// "'las_vegas_fabulous'";
  //var text1 = new createjs.Text("Scratch Here", (width/5)+"px "+font, "#666"); text1.textAlign = "center"; text1.x = width/2; text1.y =
  //width * (4/10); scratchSurface.addChild(text1);

  var text2 = new createjs.Text(msg1, (width / 12) + "px Arial", "#555");
  text2.textAlign = "center";
  text2.x = width / 2;
  text2.y = width / 7;
  scratchSurface.addChild(text2);

  var text4 = new createjs.Text(msg2, (width / 12) + "px Arial", "#555");
  text4.textAlign = "center";
  text4.x = width / 2;
  text4.y = width * (5 / 7);
  scratchSurface.addChild(text4);

  // Draw onto the canvas, and then update the container cache.
  scratchSurface.cache(0, 0, width, height); // Cache it.
  scratchSurface.removeChild(scratchSurfaceBitmap);
  scratchSurface.removeChild(text2);
  scratchSurface.removeChild(text4);

  drawing.graphics.clear(); 		// clear so it isn't subtracted from the cache later
  stage.update();
  
  //stage.addEventListener("stagemousedown", handleMouseDown);
  //stage.addEventListener("stagemouseup", handleMouseUp);
  //		stage.addEventListener("stagemousemove", handleMouseMove);
  stage.addEventListener("stagemousemove", handleMouseMove);

  
  return scratchSurface;
  
  var lastPoint;
  var oldMidPt;

  function handleMouseDown(event) {
		lastPoint = new createjs.Point(event.stageX, event.stageY);
		drawing.graphics.mt(lastPoint.x, lastPoint.y);
		info("handleMouseDown "+event);
		stage.addEventListener("stagemousemove", handleMouseMove);
		
//		stage.enableMouseOver = 5;		//5 updates per second
//		stage.addEventListener("mouseleave", function(){
//			lastPoint = null;
//		});

		//event.addEventListener("mousemove", handleMouseMove);
	}

	function handleMouseMove(event) {
		if(event.nativeEvent.which > 0){
			if(lastPoint==null){
				lastPoint = new createjs.Point(event.stageX, event.stageY);
			}
			drawing.graphics.ss(width / 10, "round").s("#ff0000");
			drawing.graphics.mt(lastPoint.x, lastPoint.y);
			drawing.graphics.lt(event.stageX, event.stageY);

			//info("handleMouseMove "+event);
			// Update the last position for next move.
			lastPoint.x = event.stageX;
			lastPoint.y = event.stageY;
			scratchSurface.updateCache("destination-out"); // use the recent drawing to substract from the cache
			drawing.graphics.clear();			
			//drawing.removeAllChildren();			
		}
	}


	function handleMouseUp(event) {
		stage.removeEventListener("stagemousemove", handleMouseMove);
	}

  
}

function addItem(itemsContainer, type, imgPath, x, y, targetWidth, targetHeight) {
  var img = new Image();
  img.src = imgPath;
  var s = new createjs.Bitmap(img);
  s.x = x;
  s.y = y;
  s.type = type;
  s.alpha = 0;
  img.onload = function(){
    s.scaleX = targetWidth / s.image.width;
    s.scaleY = targetHeight / s.image.height;
    s.regX = s.image.width / 2; // set origin point to center of the bitmap
    s.regY = s.image.height / 2;
    s.alpha = 1;
  };

  itemsContainer.addChild(s);
  return s;
}

function populateGameStyle4Paytable(target, prizes, theme){
  //Populate the pay table
  $("#payoutTable #prizes").html("");
  for(t in prizes){
    var l = $("<li>");
    var d = $("<span>");
    //info("pays "+prizes[t].prize);
    for(i=0; i < prizes[t].count; i++){
      d.append("<img src='"+gfxCtx + "/" + theme + "/items/"+prizes[t].type+".png?w="+itemImgWidth+"'/>");
    }
    l.append(d);
    l.append("<span>pays "+prizes[t].prize+"<span>");
    //l.attr("data-name", prizes[t].prize);
    target.append(l);
  }
}

/**
	 * 	returns a mapping between the prize and the gems to show
	 */
function consolodatePrizes(ticketConfig){
  var prizeMapping = {},				//stores a mapping between the prize and the gems to show
      consolidatedPrizes = {};			//consolodate prizes of the same value
  for(var p=0; p < ticketConfig.prizes.length;p++){
    if(consolidatedPrizes[ticketConfig.prizes[p][1]] == null){
      consolidatedPrizes[ticketConfig.prizes[p][1]] = true;
    }
  }
  return consolidatedPrizes;
}


function setBitmapSize(bitmap, x, y, w, h, callback){
  function f(evt){
    bitmap.visible = true;
    bitmap.regX = evt.target.width / 2
    bitmap.regY = evt.target.height / 2;
    bitmap.scaleX = w / evt.target.width;
    bitmap.scaleY = h / evt.target.height;
    bitmap.x = x;
    bitmap.y = y;
    if(callback) callback();
  }

  if(bitmap.image.width>0){
    f({target : bitmap.image});
  }else{
    bitmap.image.onload = f;
    bitmap.visible = false;
  }
}

//---------------------------------
//---------------------------------
//---------------------------------


function showFancyText(stage, text, canvasWidth, canvasHeight, theme, onClickCallback){

	if(text.length < 10){
		var fontSize = (canvasWidth / (2 + text.length));
	}else if(text.length < 11){
		var fontSize = (canvasWidth / 7);
	}else{
		var fontSize = (canvasWidth / ((text.length)-4));
	}

	var text = getFancyText(text, fontSize, canvasWidth, theme.msgFont);
	text.alpha=0;
	text.textAlign = "center";
	text.x = canvasWidth/2;
	text.y = (canvasHeight/2)-(fontSize*0.5)-(canvasHeight/20);


	stage.addChild(text);
	//createjs.Tween.get(itemsContainer).to({ alpha : 0 }, 1000).call();
	createjs.Tween.get(text).wait(500).to({ alpha : 1}, 1500);
	//$("#gameCanvas").on("click",function(){
	if(onClickCallback){
		stage.addEventListener("stagemouseup", function(){
			stage.removeEventListener("stagemouseup");
			onClickCallback();
		});
	}
}



function getFancyText(text, fontSize, canvasWidth, font, textStrokeCol, textCol1, textCol2){
	  var textContainer = new createjs.Container();
	  var font = "bold "+ fontSize + "px "+font;		// Arial";
	  var titleText = new createjs.Text(text, font, "#ffffff");
	  textContainer.textAlign = "center";
	  var padding = canvasWidth/8;
	  var w = titleText.getMeasuredWidth() + (padding);
	  var h = titleText.getMeasuredHeight() + (padding);
	  textContainer.regX = w/2;
	  textContainer.regY = h/2;
	  //textContainer.cache(0,0,w*1.2,h*1.2);
	  textContainer.cache(0,0,w,h);
	  var ctx = textContainer.cacheCanvas.getContext("2d");
	  ctx.font = font;
	  ctx.lineWidth = canvasWidth/140;
	  ctx.fillStyle = "rgb(0,0,0)";
	  ctx.fillText(text, (padding/2)+10, h-(padding/2)+10);
	  ctx.strokeText(text, (padding/2)+10, h-(padding/2)+10);

	  //This doesn't work properly and creates a truncated border area the text
	  /* ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
			ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			ctx.shadowBlur = 1;  */

	  if(textStrokeCol){
	    ctx.strokeStyle = textStrokeCol;
	  }else{
	    ctx.strokeStyle = '#a51096'; 	//'#932000';
	  }

	  ctx.strokeText(text, (padding/2), h-(padding/2));
	  ctx.shadowColor = null;
	  ctx.shadowOffsetX = 0;
	  ctx.shadowOffsetY = 0;
	  var gradient = ctx.createLinearGradient(0, 0, 0, h);

	  if(!textCol1){ textCol1 = "#fff"; }
	  if(!textCol2){ textCol2 = "#fff"; }

	  gradient.addColorStop(0, textCol1);
	  gradient.addColorStop(1, textCol2);

	  ctx.fillStyle = gradient;
	  ctx.fillText(text, (padding/2), h-(padding/2));
	  //textContainer.updateCache();
	  return textContainer;
	}

	var fancyTextContainer;
	function showOverlayMessage(effectsContainer, text, t, font, textStrokeCol){
	  if(!t) t = 1000;

	  if(text.length < 11){
	    var fontSize = (canvasWidth / 7);
	  }else{
	    var fontSize = (canvasWidth / ((text.length)-4));
	  }

	  if(fancyTextContainer && fancyTextContainer.parent){
	    fancyTextContainer.parent.removeChild(fancyTextContainer);
	  }
	  fancyTextContainer = getFancyText(text, fontSize, effectsContainer.width(), font, textStrokeCol);
	  fancyTextContainer.alpha = 0.1;
	  fancyTextContainer.x = (canvasWidth*0.5);
	  fancyTextContainer.y = (height*0.3);
	  effectsContainer.addChild(fancyTextContainer);
	  createjs.Tween.get(fancyTextContainer, {ignoreGlobalPause : true})
	  .to({alpha:1}, 500)
	  .wait(t)
	  .to({alpha:0}, 100)
	  .call(function(){
	    if(this.parent) this.parent.removeChild(this);
	  });
	}



/*
function getFancyText(text, fontSize, canvasWidth, theme, textStrokeCol, textCol1, textCol2){
	var textContainer = new createjs.Container();

	//var font = "bold "+ fontSize + "px 'las_vegas_fabulous'";		//		// Arial";
	var font = "bold "+ fontSize + "px "+theme.msgFont;		//+;		// Arial";

	//var font = "bold "+ fontSize + "px Arial";		//+themes[theme].msgFont;		// Arial";
	var titleText = new createjs.Text(text, font, "#ffffff");
	textContainer.textAlign = "center";
	var padding = canvasWidth/8;
	var w = titleText.getMeasuredWidth() + (padding);
	var h = titleText.getMeasuredHeight() + (padding);
	textContainer.regX = w/2;
	textContainer.regY = h/4;
	//textContainer.cache(0,0,w*1.2,h*1.2);
	textContainer.cache(0,0,w,h);
	var ctx = textContainer.cacheCanvas.getContext("2d");
	ctx.font = font;
    ctx.lineWidth = canvasWidth/100;
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText(text, (padding/2)+10, h-(padding/2)+10);
	ctx.strokeText(text, (padding/2)+10, h-(padding/2)+10);


    if(theme.textStrokeCol){
    	ctx.strokeStyle = theme.textStrokeCol;
    }else{
    	ctx.strokeStyle = '#a51096'; 	//'#932000';
    }

    ctx.strokeText(text, (padding/2), h-(padding/2));
    ctx.shadowColor = null;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	var gradient = ctx.createLinearGradient(0, 0, 0, h);

	col1 = textCol1;
	if(col1 == null){ col1 = "#fff"; }
	col2 = textCol2;
	if(col2 == null){ col2 = "#fff"; }
	//themes[theme].textCol1;
	//themes[theme].textCol2;

	gradient.addColorStop(0, col1);
	gradient.addColorStop(1, col2);

	ctx.fillStyle = gradient;
    ctx.fillText(text, (padding/2), h-(padding/2));
    //textContainer.updateCache();
    return textContainer;
}
*/

function getSimpleText(text, fontSize, theme, textStrokeCol, textCol1, textCol2){
	var textContainer = new createjs.Container();
	//var font = "bold "+ fontSize + "px 'las_vegas_fabulous'";		//		// Arial";
	var font = "bold "+ fontSize + "px "+theme.msgFont;		//+;		// Arial";
	//var font = "bold "+ fontSize + "px Arial";		//+themes[theme].msgFont;		// Arial";
	var titleText = new createjs.Text(text, font, "#ffffff");
	titleText.textAlign = "center";
	titleText.width = canvasWidth;
	return titleText;
}

var imgCache = {};

function getImg(imgPath, onload){
    var img = imgCache[imgPath];
    if(img==null){
        var img = new Image();
        img.myCallbacks = [];
        img.myCallbacks.push(onload);
        // #EDIT , this should allow all images to be pulled from the wof server (Obviously less efficient than storing them locally, but should make for "easier" configuration
        var swp = "http://52.90.150.11:10555/static/wheeloffortune/";
        for(var i = 2; i < imgPath.length; i++){
            swp += imgPath[i];
        }
        imgPath = swp;
        img.src = imgPath;
        imgCache[imgPath] = img;
        img.onload = function(evt){
            for(c in img.myCallbacks){
                img.myCallbacks[c](evt.target);
            }
        }
        img.onerror = function(evt){
            error("image load failed! "+imgPath);
            for(c in img.myCallbacks){
                img.myCallbacks[c](evt.target);
            }
        };

    }else if(!img.complete){
        img.myCallbacks.push(onload);
    }else{
  	  setTimeout(function(){
            onload(img);    		  
  	  });
    }
    return img;
}


function getIn(obj, keypath, valIfNotFound){
	if(obj==null) return valIfNotFound;
	var tObj = obj;
	for(var k in keypath){
		if(keypath[k] in tObj){
			tObj = tObj[keypath[k]];
		}else{
			return valIfNotFound;
		}				
	}
	return tObj;				
}

function getFirst(){
	for(var a in arguments){
		if(arguments[a]!=null && arguments[a]!=""){
			return arguments[a];
		}
	}
	return null;
}
