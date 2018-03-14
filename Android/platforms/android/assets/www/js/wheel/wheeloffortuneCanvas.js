/**
 * The main wheel of fortune canvas element.
 * Property of Joyplay.com
 * @author James Adams
 */

/*
 * @param config - must contain config.segments must be an array defined in a CLOCKWISE order!
 */
function WheelOfFortuneCanvas(tConfig) {
	var config = tConfig;
	var radiansPerDegree = Math.PI / 180;
	var wood1 = "#663705", wood2 = "#441e00", red = "rgba(180,18,30,0.5)", black = "rgba(10,20,0.0.5)", white = "rgba(255,255,255,0.5)", green = "rgba(0,220,0,0.5)", steel = "#7a7b7e", steel2 = "#e6e7e8";
	var outLights = [];
	var frontParticles;
	var rotationDelta = 0.1;     //the change in velocity each step
	var scheduled=[];      //functions or promise chains to be executed next tick
    var preSpinAngle = 40;
	var preSpinPromise;
    
	function schedule(f, timeout){
		if(!timeout) timeout = 0;
		var id = Math.round(Math.random()*99999999);
		scheduled.push([f, new Date().getTime()+timeout, id]);
		return id;
	}
	
	function unschedule(id){
		for(s in scheduled){
			if(scheduled[s][2] == id){
				scheduled.splice(s,1);
				return;
			}			
		}
	}		
	
	//SET DEFAULT VALUES 
	if(!config.colors){
		config.colors = [black, white];
	}
	
	var stage = initialiseCanvas(config.canvasElementId);	
	var wheelContainer = new createjs.Container();
	try{		
		calcCumulativeAngleValues(config);	
		var obj = createWheel(config.segments);
		//{ wheelContainer : wheelContainer, wheeOverlaylGfx : wheeOverlaylGfx }
		var wheel = obj.wheelContainer;
		var wheeOverlaylGfx = obj.wheeOverlaylGfx;		
		wheelContainer.addChild(wheel);
	    
		if(config.bgImage){
			bgBitmap = addImgToTarget(config.bgImage, 0, 0, canvasWidth);		
			stage.addChild(bgBitmap);	
		}
		
		stage.addChild(wheelContainer);
		 
		if(config.overlayImage){
			overlayBitmap = addImgToTarget(config.overlayImage, 0, 0, canvasWidth);		
			stage.addChild(overlayBitmap);	
		}	
		
		
		frontParticles = getParticleLayer();
		if(frontParticles){
			stage.addChild(frontParticles.bmp);		
		}
		
		
		//sunBlast2(frontParticles, canvasWidth/2, canvasHeight/2);	
		//rectPaticleOutline(frontParticles, 100,100,200,200, "./files/gfx//sunParticle.png");
		
		var arrowPosition = (config.arrow && config.arrow.position) ? config.arrow.position : 0;
		
		if(config.arrow && config.arrow.image && !config.ball){
			var arrowContainer = new createjs.Container(); 
			arrowContainer.x = canvasWidth/2;
			arrowContainer.y = canvasHeight/2;
			
			var arrow = new createjs.Bitmap();		
		    arrow.image = getImg(config.arrow.image, function(img){
		    	var xPos = 0; //canvasWidth/2;
		    	var yPos = -wheelRadius;
		    	yPos += getIn(config, ["arrow", "y"], 0) * wheelRadius;
			    setBitmapSize(arrow, xPos, yPos, wheelRadius*getIn(config, ["arrow", "width"], 0.25), wheelRadius*getIn(config, ["arrow", "height"], 0.25));		
			});		
			
			arrowContainer.rotation = arrowPosition; 
			
		    arrowContainer.addChild(arrow);		
		    stage.addChild(arrowContainer);		
		}
	    //------------------------
		var outerBallY = wheelRadius * 0.43, 
		    innerBallY = wheelRadius * 0.275, 
		    wheelRotationDelta = 0.1, //the change in velocity each step
		    ballRotationDelta = 0.1, 			//the change in velocity each step
		    wheelRotationSpeed = 0, ballRotationSpeed, lastTick = 0, targetWheelAngle; //the final target angle
	
		var deferred;     //it's unpleasant having this as a global variable!!
		var result;
		var bouncing;
		var bounce=0;
		var ball = new createjs.Container();
		var ballImg = createBall(wheelRadius / 25);  //new createjs.Bitmap(config.ballImg);	
		ball.addChild(ballImg);
		//put the ball in the middle of the wheel, then we'll adjust the regY and rotation around this point
		ball.x = wheelRadius;				
		ball.y = wheelRadius;
		ball.regY = outerBallY;
		stage.addChild(ball);
		ball.visible = false;
		
		var wheelRotationValue = new createjs.Text("", "20px Arial", "#00dd00");
		stage.addChild(wheelRotationValue);
		wheelRotationValue.x = 10;
		wheelRotationValue.y = 10;
	
		var targetResult = new createjs.Text("", "20px Arial", "#0000dd");
		stage.addChild(targetResult);
		targetResult.x = 10;
		targetResult.y = 28;
		if (!config.debug) {
			targetResult.visible = false;
			wheelRotationValue.visible = false;
		}
	
		//showMsg("PLAY");
	}catch(ex){
		showMsg(ex);
	}
		
	
	//--- PUBLIC METHODS -----------------------------------------------------------------
	
	/** Display this message on the canvas */
	this.showMsg = function(msg){ showMsg(msg); };
	
	/** Display this image on the canvas */
	this.showImage = function(img){ showImage(img); };
	
	/** Display this particle effect */
	this.showParticleEffect = function(effect){
		if(effect.type == "imageShower"){
			imageShower(frontParticles, canvasWidth/2, canvasHeight/2, {width:canvasWidth, height:canvasHeight}, effect);			
		}else if(effect.type == "imageFountain"){
			return createImageFountain(frontParticles, effect);
		}else{
			info("Unknown particle effect type "+effect.type);
		}
	};
	
	/** Set wheel segments.  This can be used to apply a different set of segments to the wheel */
	this.setSegments = function(segments){		
		if (wheelRotationSpeed > 0) {
			throw "Already spinning, ignoring spin() result";
		}		
		wheelContainer.removeAllChildren();
		config.segments = segments;
		calcCumulativeAngleValues(config);
		wheel = createWheel(config.segments);		
		wheelContainer.addChild(wheel);
		ball.visible = false;
	};
	
	/** Get the currently active config */
	this.getConfig = function() { return config;}
		
	/** An animation that moves the wheel back a bit prior to the actual spin */
	this.preSpin = function(preSpinDuration){
		if(!preSpinDuration) preSpinDuration = 1000;
    	var preSpinDeferred = $.Deferred();
        createjs.Tween.get(wheel).to({rotation : wheel.rotation-preSpinAngle}, preSpinDuration, createjs.Ease.cubicInOut())
        	.call(function(){
		          preSpinDeferred.resolve();
        });
        preSpinPromise = preSpinDeferred.promise();
        return preSpinPromise;		
	};
	
	/** Spin the wheel to land on the specified result.  returns a promise that resolves when the spin is finished */
	this.spin = function(result){		
		var def = $.Deferred();
		if(preSpinPromise==null){
			info("It's recommened to call spinner.preSpin before calling spin ")
			this.preSpin();
		}
		
		preSpinPromise.then(doSpin).then(function(){
			def.resolve();
		});			
		
		return def.promise();
		
		function doSpin(){
			preSpinDeferred = null;
			if(config.ball){
				return spinWithBall(result);					
			}else{
				return spinWithoutBall(result);
			}			
		}
	};
	
	/** returns a promise that resolves when the spin is finished */
	function spinWithoutBall(result){
		ball.visible = false;
		
		if(config.spinOutlineEffect){
			movingEmitterOutline(frontParticles, canvasWidth/2, canvasHeight/2, wheelRadius, config.spinOutlineEffect);
		}
		
	    if(wheelRotationSpeed > 0){
	      warn("Already spinning, ignoring spin() result");
	      throw "Wheel is spinning";
	    }

		//Map the result to a wheel segment
	    var validElements = _.filter(config.segments, function(a, idx){ if(a.id==result.id){ return a; } });
	    var seg = _.first(_.shuffle(validElements));
	    if(result.prize!=seg.prize){  
	    	error("ERROR - result and segment prizes don't match!");
	    	showMsg("ERROR - result and segment prizes don't match!");  
	    	return; 
	    }

	    if(config.stopCenterOfSegment==true){
		    var degreesIntoTargetSegment = (seg.degrees/2);
	    }else{	    	
	    	var degreesIntoTargetSegment = seg.degrees*Math.random();	    	
	    }
	    
	    targetAngle = 360 - (seg.total - degreesIntoTargetSegment) + arrowPosition;

	    var angleChangeFromCurrentPosition = targetAngle - wheel.rotation;
	    info("target RESULT="+JSON.stringify(result)+" segment id="+ seg.index +" targetAngle="+targetAngle+" angleChangeFromCurrentPosition="+angleChangeFromCurrentPosition);

	    //------ go back a bit then forwards before starting
	    var speed = calculateSpinSpeed(0, angleChangeFromCurrentPosition, 3+Math.round(Math.random()*5), rotationDelta);

	    return start(wheel.rotation, speed).then(spinning).then(function(){
	    	//The wheel has stopped. 
          
	    	/* It's more flexible if this is done in the contain html/javascript	    	
	    	if(seg.winUrl){
	    		showImage(seg.winUrl);
	    	}else if(seg.onHitMessage){	
		    	showMsg(seg.onHitMessage);
	    	}else if(seg.prizeIcon){
	    		showImage(seg.prizeIcon);		    	
	    	}else if(seg.prize){
		    	showMsg(seg.prize);
	    	}else if(seg.label){	
		    	showMsg(seg.label);		    			    	
	    	}   */	    	
	    	return $.Deferred().resolve().promise("Boo");
	    });
	   
	    //-----------------------------------------------------------
	    
	    function start(startingAngle, speed){
	        var deferred = $.Deferred();
	        createjs.Tween.get(wheel).to({rotation : wheel.rotation}, (preSpinAngle/speed)*40, createjs.Ease.cubicIn())
		        .call(function(){
		          wheel.rotation = startingAngle;      //just incase the tweening library messes up
		          wheelRotationSpeed = speed;               //OK, Set the rotation speed, this will starting the wheel spinning
		          lastTick=0;
		          deferred.resolve();
		    });
	        return deferred.promise();
	      }

	      function spinning(){
	        var deferred = $.Deferred();
			//wheeOverlaylGfx.setStrokeStyle(wheelRadius * getIn(config, ["cellBorder", "width"], 0.0125)).beginStroke( getIn(config, ["cellBorder", "color"], steel));		

	        function spinFrame(){
	          if(wheelRotationSpeed > 0){
	            wheel.rotation += wheelRotationSpeed;
	            wheelRotationSpeed-=rotationDelta;
            	wheeOverlaylGfx.clear();	            
				var seg = getWheelValue(arrowPosition);
	    		drawSegment(wheeOverlaylGfx, seg, "rgba(255,255,0,0.3)");		            
	            schedule(spinFrame);
	          }else{
	            deferred.resolve();
	          }
	        }
	        spinFrame();
	        return deferred.promise();
	      }

	      //UTIL - Get the starting spin speed when the
	      function calculateSpinSpeed(startAngle, endAngle, minimumRotations, delta){
	        //This is the number of degrees we need to move
	        var totalDegrees = (((endAngle - startAngle)+360) % 360) + 360*minimumRotations;
	        //Perform the iterative spin algo in reverse to get the required starting speed.
	        var degreesSoFar = 0;
	        var speed=0;
	        while( (degreesSoFar + (speed+delta)) < totalDegrees){
	          speed += delta;
	          degreesSoFar += speed;
	        }
	        speed += ((totalDegrees - degreesSoFar) / speed)*delta;    //do the last bit so we're exact
	        degreesSoFar += speed;
	        return speed;
	      }	    
	};
	
	/**
	 * Spin the wheel and make the ball stop at the specified result
	 */
	function spinWithBall(tResult) {
		
		if (wheelRotationSpeed > 0 || result != null) {
			throw "Already spinning, ignoring spin() result";
		}
		if(deferred){
			throw "We've already called spin !?";			
		}
		deferred = $.Deferred();		
		result = tResult;
		
		//Map the result to a wheel segment
		var matchingSegments = _.filter(config.segments, function(a, idx) { if (a.id == result.id) { return a; } });
		var seg = _.first(_.shuffle(matchingSegments)); 		//pick a segment of those matching the desired result, (should always only be one with roulette)
		if (result.id != seg.id) {
			throw "ERROR - target result not found in the config";
		}

		targetWheelAngle = 360 - (seg.total - (seg.degrees/2));
		
		var randomOffset = Math.random()*360;
		targetWheelAngle += randomOffset;
		
		info("target RESULT=" + result.id + " segment id=" + seg.index + " targetWheelAngle=" + targetWheelAngle);
		targetResult.text = result;
		
		//Caclulate the start wheel speed so the targetWheelAngle is obtained
		var wheelRotSpeed = calculateSpinSpeed(wheel.rotation, targetWheelAngle, 6, wheelRotationDelta);  //Math.round(Math.random()*8)

		//Caculate where the wheel will be after x iterations, note the angle then get the ball speed required to stop there
		var steps = 160;
		var tBallRotationSpeed = steps * ballRotationDelta; 		//Calculate the start speed for the ball to last x steps		
		var wheelAngleAfterXSteps = whereAfter(wheel.rotation, wheelRotSpeed, wheelRotationDelta, steps);
		var totalBallRotation = 0;
		var tSpeed = tBallRotationSpeed;
		while (tSpeed > 0) { 				//Calculate the total ball rotation
			totalBallRotation += tSpeed;
			tSpeed -= ballRotationDelta;
		}

		info("totalBallRotation should be "+totalBallRotation);
		ball.rotation = (wheelAngleAfterXSteps + totalBallRotation) - targetWheelAngle;
		ball.rotation += randomOffset;		
		ball.regY = outerBallY;
		lastTick = 0;
		bounce=0;
			
		bouncing = _.map(_.range(18), function(){return 0}).concat(_.shuffle([0,0,0,0,0,0,0,0,0,1,2,3,1,2,3]));
		var bouncingAngleSum = _.reduce(bouncing, function(sum, el) {  return sum + el }, 0);
		ball.rotation -= bouncingAngleSum;						//adjust the starting ball rotation by the amount lost to bouncing

		//------ go back then forwards before starting
		var startingAngle = wheel.rotation;
		ball.visible = false;
		createjs.Tween.get(wheel).to({rotation : wheel.rotation-preSpinAngle}, 1000, createjs.Ease.cubicInOut())
		                         .to({rotation : wheel.rotation}, (preSpinAngle/wheelRotSpeed)*40, createjs.Ease.cubicIn())
		                         .call(function(){
		  wheel.rotation = startingAngle;           //just incase the tweening library messes up
		  wheelRotationSpeed = wheelRotSpeed;               //OK, Set the rotation speed, this will starting the wheel spinning
		  ballRotationSpeed = tBallRotationSpeed;
		  lastTick=0;
		  ball.visible = true;
		});		 
		
		//returns where the wheel will be after x steps
		function whereAfter(r, rSpeed, delta, steps) {
			for (var i = 0; i < steps; i++) {
				if (rSpeed > 0) {
					r += rSpeed;
					rSpeed -= delta;
				}
			}
			return r;
		}
		
		schedule(stepWithBall);	     //Start the wheel spinning
		
		return deferred.promise();
		
		//The main step function
		function stepWithBall(event){
			if (wheelRotationSpeed > 0) {
				wheel.rotation += wheelRotationSpeed;
			}else{
				result = null;
			}

			if (ballRotationSpeed > (ballRotationDelta/10)) {
				if (ball.regY > innerBallY && ballRotationSpeed < 8) {
					ball.regY -= wheelRadius/150; 				//move the ball in a bit because slowing down
				}
				ball.rotation -= ballRotationSpeed;			
				ballRotationSpeed -= ballRotationDelta;
				
				if(ball.regY <= innerBallY && bounce < bouncing.length){
				  //simulate hitting a slat
				  var r = Math.random();
				  ball.rotation += bouncing[bounce++];
				  //TODO should be slow the ball rotation ?	
				} 
				
			} else if (wheelRotationSpeed > 0) {
				ball.rotation += wheelRotationSpeed; 	//the ball is in a slot, rotate the ball with the wheel
				//info("moving ball with wheel, ball.rotation="+ball.rotation+" ball is in "+getWheelValue(ball.rotation));
			}

			if (wheelRotationSpeed > 0) {
				wheelRotationSpeed -= wheelRotationDelta;      //slow the wheel
			}	
			wheelRotationValue.text = getWheelValue(0).prize;
			lastTick = event.timeStamp;
			
			//resolve the promise if we've finished
			if(ball.visible && wheelRotationSpeed <= 0.5 && ballRotationSpeed <= 0.1){
				if(deferred){
					deferred.resolve();
					deferred = null;
			    	//showMsg(result);
				}
				if(wheelRotationSpeed > 0 || ballRotationSpeed > 0.01){
					//keep the wheel spinning for a bit longer even though we've resolved the promise					
					schedule(stepWithBall);								
				}else{
					return;
				}
			}else{
				schedule(stepWithBall);			
			}
		}		
	};  	
	//---END OF PUBLIC METHODS-----------------------------------------------------

	var tick = function(event) {
		//----------------- MAIN TICK FUNCTION ----------------
		//trace("tick event.delta="+event.delta);
		var now = new Date().getTime();   //TODO use event.timestamp ?
		var scheduledLastFrame = scheduled;
		scheduled = [];
		for(s in scheduledLastFrame){
			if(now > scheduledLastFrame[s][1]){
				var r = scheduledLastFrame[s][0](event);
				if(r){
					scheduled.push(r);
				}
			}else{
				scheduled.push(scheduledLastFrame[s]);     //not yet
			}
		}
		//-----------------------------------------------------
		
		if (frontParticles) {
			frontParticles.ctx.clear(frontParticles.ctx.COLOR_BUFFER_BIT|frontParticles.ctx.DEPTH_BUFFER_BIT); 
			frontParticles.proton.update();
		}
		
		stage.update();
	}

	//Get the starting spin speed when the
	function calculateSpinSpeed(startAngle, endAngle, minimumRotations, delta) {
		//This is the number of degrees we need to move
		var totalDegrees = (((endAngle - startAngle) + 360) % 360) + 360 * minimumRotations;
		//Perform the iterative spin algo in reverse to get the required starting speed.
		var degreesSoFar = 0;
		var speed = 0;
		while ((degreesSoFar + (speed + delta)) < totalDegrees) {
			speed += delta;
			degreesSoFar += speed;
		}
		speed += ((totalDegrees - degreesSoFar) / speed) * delta; //do the last bit so we're exact
		degreesSoFar += speed;
		return speed;
	}

	createjs.Ticker.addEventListener("tick", tick);
	//createjs.Ticker.setFPS(10);
	
	//Safety check to the supplied config
	function calcCumulativeAngleValues(config) {
		var totalDegrees = 0;
		for (i in config.segments) {
			totalDegrees += config.segments[i].degrees;
			config.segments[i].total = (totalDegrees); //store the total degrees to the end of this element
			config.segments[i].index = (i); //store the index element in here also
		}

		if (totalDegrees < 359.9 || totalDegrees > 360.1) {
			showMsg("WARNING - Total degrees do not add up 360");
		}
	}

	function createWheel(segments) {
		if(segments.length==0){
			showMsg("INVALID WHEEL CONFIG, MUST CONTAIN AT LEAST 1 SEGMENT")
			throw "INVALID WHEEL CONFIG, MUST CONTAIN AT LEAST 1 SEGMENT";
		}
		var wheelContainer = new createjs.Container();
		
	    wheelBitmap = new createjs.Bitmap();
	    wheelBitmap.name = "wheel";
//	    wheelBitmap.y = canvasHeight*1.5;
	    
	    if(config.wheelImg){
		    wheelBitmap.image = getImg(config.wheelImg, function(img){
				wheelBitmap.scaleY = (wheelRadius*2) / img.height;
				wheelBitmap.scaleX = (wheelRadius*2) / img.width;			
	//			wheelBitmap.x = canvasWidth*0.5;;
	//			wheelBitmap.y = 0;						
		    	//alert("loaded");
	//			wheelContainer.cache(0, 0, canvasWidth, canvasHeight)		
			});
	    }
	    
	    wheelContainer.addChild(wheelBitmap);
		
		var wheel = new createjs.Shape();
		wheelContainer.addChild(wheel);
		var gfx = wheel.graphics;
		
		var wheelOverlay = new createjs.Shape();
		wheelContainer.addChild(wheelOverlay);
		var wheeOverlaylGfx = wheelOverlay.graphics;
		
		var labelContainer = new createjs.Container();
		wheelContainer.addChild(labelContainer);

//		gfx.beginFill(wood1).drawCircle(canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.49);
//		gfx.beginFill(wood2).drawCircle(canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.45);

		var angle = -90;
		//Draw the segement backgrounds
		for (var s = 0; s < segments.length; s++) {
			if(segments[s].color){
				col = segments[s].color;
			}else {
				col = config.colors[segments[s].index%config.colors.length];
			} 
			drawSegment(gfx, segments[s], col);			
		}		
		
		//Draw the segment borders
		gfx.setStrokeStyle(wheelRadius * getIn(config, ["cellBorder", "width"], 0.0125)).beginStroke( getIn(config, ["cellBorder", "color"], steel));		
		for (var s = 0; s < segments.length; s++) {
			drawSegment(gfx, segments[s], null);			
		}				
		
		
		//drawSegment(wheeOverlaylGfx, segments[0], "#000000");			
		
		var fontSize = ((wheelRadius*2 / segments.length) * 0.5);
		if(fontSize > wheelRadius*0.05 ){
			fontSize = wheelRadius*0.05;
		}
		
		angle = segments[0].degrees / 2 - 90; 
		for (var n=0; n < segments.length; n++) {
			var textContainer = new createjs.Container();
			var segmentWidth = segments[n].degrees/360 * wheelRadius * Math.PI;
			
			if(segments[n].prizeIcon && segments[n].prizeIcon.length>0){
				var iconBitmap = new createjs.Bitmap();		
				if(segmentWidth > wheelRadius*0.6){
					segmentWidth = wheelRadius*0.6;
				}
				getAndSetImageScale(iconBitmap, segments[n].prizeIcon, segmentWidth);	   //TODO			
				//iconBitmap.rotation = 180;
				textContainer.addChild(iconBitmap);
				iconBitmap.y = wheelRadius*-0.55;
			} else {
				var segmentText = segments[n].label ? segments[n].label : segments[n].prize;				
				var fontName = getFirst(segments[n].font, getIn(config, ["cellLabel", "font"]));								
				fontSize = (segmentWidth*0.5);
				fontSize *= parseFloat(getIn(config, ["cellLabel", "fontSize"], 1));

				var text = new createjs.Text(segmentText, fontSize + "px "+fontName, "#ffffff");
				//Check width
				var max = Math.min(wheelRadius*0.85, (segmentWidth*0.75));
				if(text.getMeasuredWidth() > max){
					fontSize = fontSize * (max / text.getMeasuredWidth());
					var text = new createjs.Text(segmentText, fontSize + "px "+fontName, "#ffffff");
				}
				
				text.rotation = getIn(config, ["cellLabel", "angle"], 0);
				text.y = -wheelRadius*getIn(config, ["cellLabel", "y"], 0.55);
				
				text.regX = text.getMeasuredWidth() / 2;
				text.regY = text.getMeasuredHeight() / 2;				
				text.color = getFirst(segments[n].labelColor, getIn(config, ["cellLabel", "color"]), "#fff");
				textContainer.addChild(text);			
			}
			
			textContainer.x = wheelRadius;
			textContainer.y = wheelRadius;
//			textContainer.regY = wheelRadius * 0.43 * 2;
			textContainer.rotation = 90 + angle;			
			info(">> "+textContainer.rotation+" "+segments[n].total);
			//wheelContainer.addChild(textContainer);
			labelContainer.addChild(textContainer);
			if(n < segments.length-1){
				angle += (segments[n].degrees / 2) + (segments[n+1].degrees / 2); 
			}else{
				angle += segments[n].degrees;				
			}			
		}

		function getAndSetImageScale(iconBitmap, imgSrc, width){
			iconBitmap.image = getImg(imgSrc, function(img){
				if(img.width >= img.height){
					iconBitmap.scaleX = width / img.width;			
					iconBitmap.scaleY = iconBitmap.scaleX; //canvasHeight/10 / img.height;
				}else{
					iconBitmap.scaleY = width / img.height;
					iconBitmap.scaleX = iconBitmap.scaleY;							 
				}
				iconBitmap.regX = iconBitmap.image.width/2;	
				iconBitmap.regY = iconBitmap.image.height/2;										
			});
		}
		
		if(config.outerLights){
			var lightsContainer = new createjs.Container();
			var lightsSize = config.outerLights.size ? config.outerLights.size*wheelRadius : wheelRadius * 0.2;
			for(var d=0; d <= 360; d += 10){
				var lightCont = new createjs.Container();
				var bitmap = addImgToTarget2(config.outerLights.images[0], 0, (wheelRadius*2)*0.47, lightsSize, lightsSize)
				outLights.push(bitmap);
				lightCont.addChild(bitmap);				
				lightCont.rotation = d;
				lightsContainer.addChild(lightCont);
			}
			lightsContainer.x = wheelRadius;
			lightsContainer.y = wheelRadius;
			
			wheelContainer.addChild(lightsContainer);	
			
			function animateLights(event){
				var base = Math.round(event.timeStamp/1000) % config.outerLights.images.length;				
				for(var l=0; l < outLights.length; l++){
					var idx = (base + l) % config.outerLights.images.length;
					if(outLights[l].image){
						outLights[l].image = getImg(config.outerLights.images[idx], function(){
							
						});						
					}
				}									
				schedule(animateLights, 1000);	
			}
			schedule(animateLights,1000);			
		}
		
//		wheelContainer.cache(0, 0, canvasWidth, canvasHeight)		
		wheelContainer.regX = wheelRadius;
		wheelContainer.regY = wheelRadius;
		wheelContainer.x = canvasWidth / 2;
		wheelContainer.y = canvasHeight / 2;
		
		return { wheelContainer : wheelContainer, wheeOverlaylGfx : wheeOverlaylGfx };
	}
	
	function drawSegment(g, seg, col){
		g.beginFill(col);			
		g.moveTo(wheelRadius, wheelRadius);			
		g.arc(wheelRadius, wheelRadius, wheelRadius*2 * 0.45, (seg.total - seg.degrees - 90) * radiansPerDegree, (seg.total -90) * radiansPerDegree);						
	}
	
	function createBall(r) {
		var ball = new createjs.Shape();
		ball.graphics.beginFill("#ccc").drawCircle(r, r, r);
		ball.graphics.beginFill("#ddd").drawCircle(r-(r*0.1), r-(r*0.1), r-(r*0.2));
		ball.graphics.beginFill("#eee").drawCircle(r-(r*0.2), r-(r*0.2), r-(r*0.4));	
		ball.graphics.beginFill("#fff").drawCircle(r-(r*0.3), r-(r*0.3), r-(r*0.6));	
		//ball.graphics.beginFill("#000").drawCircle(r, r, 2);
		ball.cache(0, 0, r*2, r*2);
		
		var ballBitmap = new createjs.Bitmap(ball.cacheCanvas);
		ballBitmap.regX = r;
		ballBitmap.regY = r;
		return ballBitmap;	
	}
	
	
	function mod(n, d) {
		return (((n % d) + d) % d)
	};

	function getWheelValue(at) {
		var val;
		var rot = mod(360 - wheel.rotation + at, 360);
		for (s in config.segments) {
			if (rot <= config.segments[s].total) { 
				val = config.segments[s];
				break;
			}
		}
		return val;
	}
	
	function initialiseCanvas(gameCanvas){
		  if(!gameCanvas) gameCanvas = "gameCanvas";
		  canvasWidth = $("#"+gameCanvas).width(); 			// The actual visible width
		  canvasHeight = $("#"+gameCanvas).height(); 			// The actual visible height
		  wheelRadius = Math.min(canvasWidth, canvasHeight)/2;
		  if(config.wheelRadius){
			  wheelRadius *= config.wheelRadius;
		  }
		  
		  canvas = document.getElementById(gameCanvas);
		  canvas.width = canvasWidth; 						// The width at which it is drawn
		  canvas.height = canvasHeight; 						// The height at which it is drawn

		  if(stage){
		    stage.clear();
		    stage.removeAllChildren();
		    stage.removeAllEventListeners();
		    if(scratchSurface){
		      scratchSurface.uncache();
		    }
		  }else{
		    //initialise the stage
		    stage = new createjs.Stage(canvas);
		    createjs.Touch.enable(stage);
		    createjs.Ticker.setFPS(24);
		  }

		  itemsContainer = new createjs.Container();
		  bitmaps = [];
		  return stage;
	}
	
	function showImage(img){
		var bigwin = addImgToTarget2(img, stage.canvas.width/2, stage.canvas.height/2, stage.canvas.width, null, function(){
			var sX = bigwin.scaleX*0.85;
			var sY = bigwin.scaleY*0.85;
			
			bigwin.scaleX = 0;
			bigwin.scaleY = 0;	
			
			var oldRot = bigwin.rotation;
			bigwin.rotation = -30;
			 
			createjs.Tween.get(bigwin).wait(500).call(function(){
//				playSound("jackpot");      //TODO need to store these somewhere then delete them
//				playSound("credits1");
			}).to({rotation : oldRot}, 900, createjs.Ease.bounceOut);		 
			createjs.Tween.get(bigwin).wait(2000).to({scaleX : sX, scaleY : sY}, 900, createjs.Ease.bounceOut ).wait(2500).call(function(){
				stage.removeChild(bigwin);
			});
		});
		
		stage.addChild(bigwin);		
	}
	
	
	function showMsg(msg,t,y,layerName){
		if(!t) t = 1500;
		if(!y) y = 0.39;
		if(!layerName) layerName = "overlayMsg";
		
		var fontSize = canvasWidth/6;
		if(msg.length > 10){
			fontSize = canvasWidth/(msg.length*0.7);
		}
		
		var text = stage.getChildByName(layerName);
		if(text==null){
			var text = new createjs.Container();							
			text.y = canvasHeight*y;
			text.x = canvasWidth/2;
			text.name = layerName;
			text.alpha = 0;			
			stage.addChild(text);					
			createjs.Tween.get(text).to({ alpha : 1}, 200);
		}
		
		drawFancyText(text, msg, fontSize, (fontSize + "px "+config.msgFont),null,null,null,config.msgGradient);   //TODO 

		if(this[layerName]){
			unschedule(this[layerName]);
		}
		
		this[layerName] = schedule(function(){
			stage.removeChild(text);
			this[layerName] = null;
		}, t);
	}	
	

	function drawFancyText(textContainer, text, fontSize, font, textStrokeCol, textCol1, textCol2, grad){
		var titleText = new createjs.Text(text, font, "#ffffff");
		//textContainer.textAlign = "center";
		var padding = 3;//canvasWidth/8;
		var w = titleText.getMeasuredWidth() + (padding)*2;
		var h = titleText.getMeasuredHeight() + (padding);
		
		textContainer.regX = w/2;
//		textContainer.regY = h/2;
		//textContainer.cache(0,0,w*1.2,h*1.2);
		textContainer.cache(0,0,w,h);
		var strokeSize = fontSize/30;
		var ctx = textContainer.cacheCanvas.getContext("2d");
		ctx.font = font;
	    ctx.lineWidth = strokeSize;
/*	    
		ctx.fillStyle = "rgb(0,0,0)";		
		ctx.fillText(text, strokeSize+10, h-strokeSize+10);
		ctx.strokeText(text, strokeSize+10, h-strokeSize+10);
*/
		
		//This doesn't work properly and creates a truncated border area the text
//		ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
//		ctx.shadowOffsetX = 3;
//		ctx.shadowOffsetY = 3;
//		ctx.shadowBlur = 1; 


	    ctx.miterLimit=3;
	    
	    ctx.shadowColor = null;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		var gradient = ctx.createLinearGradient(0, 0, 0, h);
		
		if(grad){
			for(var g=0; g < grad.length; g++){
				gradient.addColorStop(g/(grad.length-1), grad[g]);					
			}
			
		}else{
			if(!textCol1){ textCol1 = "#fff"; }
			if(!textCol2){ textCol2 = "#fff"; }
			gradient.addColorStop(0, textCol1);
			gradient.addColorStop(1, textCol2);
		}
		ctx.fillStyle = gradient;

    	//ctx.strokeStyle = '#fff';  //'#a51096'; 	//'#932000';
	    //ctx.strokeText(text, strokeSize*1.4, h-strokeSize);
		
	    if(textStrokeCol){
	    	ctx.strokeStyle = textStrokeCol;
	    }else{
	    	ctx.strokeStyle = '#000';  //'#a51096'; 	//'#932000';
	    }
	    ctx.fillText(text, strokeSize, h-strokeSize);
	    ctx.strokeText(text, strokeSize, h-strokeSize);
	}	
	
	function addImgToTarget(srcUrl, x, y, width, height, callback){
		try{					
			var bitmap = new createjs.Bitmap();
			getImg(srcUrl, function(img){
				bitmap.image = img;
				if(img.height>0){
					if(width){
						bitmap.scaleX = width / img.width;							
						bitmap.scaleY = width / img.width;
					}else if(height){
						bitmap.scaleY = height / img.height;
						bitmap.scaleX = bitmap.scaleY;											
					}
					bitmap.x = x;
					bitmap.y = y;											
				}else{
					bitmap.parent.removeChild(bitmap);
				}
				if(callback) callback();
			});	
			return bitmap;
		}catch(ex){
			error(ex);
		}			
	}	
	
	function addImgToTarget2(srcUrl, x, y, width, height, callback){
		try{					
			var bitmap = new createjs.Bitmap();
			getImg(srcUrl, function(img){
				bitmap.image = img;
				if(img.height>0){
					if(width){
						bitmap.scaleX = width / img.width;							
						bitmap.scaleY = width / img.width;
					}else if(height){
						bitmap.scaleY = height / img.height;
						bitmap.scaleX = bitmap.scaleY;											
					}

					bitmap.regX = bitmap.image.width/2;
					bitmap.regY = bitmap.image.height/2;							
						
					bitmap.x = x;
					bitmap.y = y;											
				}else{
					if(bitmap.parent){
						bitmap.parent.removeChild(bitmap);
					}
				}
				if(callback) callback();
			});	
			return bitmap;
		}catch(ex){
			error(ex);
		}			
	}	
	
	function getParticleLayer(){
		//if(config.particleEffects==true){
			try{
 				var effectsCanvas = document.createElement('canvas');
				effectsCanvas.id = "effectsCanvas1";
				effectsCanvas.width  = canvasWidth;
				effectsCanvas.height = canvasHeight;

				var particlesBmp = new createjs.Bitmap(effectsCanvas);
				particlesBmp.name = "particleOverlay";
				
				var proton = new Proton;
				renderer = new Proton.Renderer('webgl', proton, effectsCanvas);
				renderer.blendFunc("SRC_ALPHA", "ONE");
				renderer.start();
				
				protonCtx = particlesBmp.image.getContext("webgl");
				protonCtx.clearColor(0.0, 0.0, 0.0, 0.0);   
				return {bmp : particlesBmp, proton : proton, ctx : protonCtx, canvas : effectsCanvas};
			}catch(ex){
				warn(ex);
				warn("Effects canvas could not be initialised, WebGl may not be available");
				//try with 2d ?
/*				
				var proton = new Proton;
				renderer = new Proton.Renderer('canvas', proton, effectsCanvas);
				renderer.blendFunc("SRC_ALPHA", "ONE");
				renderer.start();
				
				protonCtx = particlesBmp.image.getContext("2d");
				//protonCtx.clearColor(0.0, 0.0, 0.0, 0.0);   
				return {bmp : particlesBmp, proton : proton, ctx : protonCtx, canvas : effectsCanvas};
*/								
			}
		//}
	}

	function imageShower(protonObj, x, y, bounds, effect) { 
		var deferred = $.Deferred();
		var proton = protonObj.proton;
		var images = getIn(effect.images);
		
		var t = getIn(effect, ["duration"], 2500);
		
		var emitter = new Proton.Emitter();
		emitter.rate = new Proton.Rate(new Proton.Span(4, 10), new Proton.Span(.2, .5));
		emitter.addInitialize(new Proton.Mass(1));
		emitter.addInitialize(new Proton.Life(1, 5));
		emitter.addInitialize(new Proton.ImageTarget(images, 100, 100));
		emitter.addInitialize(new Proton.Radius(40));
		emitter.addInitialize(new Proton.V(new Proton.Span(2, 5), new Proton.Span(0, 25, true), 'polar'));
		emitter.addBehaviour(new Proton.Alpha(1, 1));
		emitter.addBehaviour(new Proton.Scale(0, .7));
		emitter.addBehaviour(new Proton.Gravity(5.5));
		emitter.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span(-15, 15), 'add'));
		emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, bounds.width, bounds.height), 'dead'));
		emitter.p.x = x;
		emitter.p.y = y;
		emitter.emit();
		proton.addEmitter(emitter);		
		
		setTimeout(function(){
			emitter.destroy();
			deferred.resolve();
		}, t);
		
		return {promise : deferred.promise(), destroy : function(){
			emitter.destroy();
		}};
	}	

	function createImageFountain(protonObj, meta) {
		var deferred = $.Deferred();
		var proton = protonObj.proton;

		var images = getIn(meta, ["images"], ["./files/gfx/coins1.png"]);
		var t = getIn(meta, ["time"], 2500);
		emitter = new Proton.Emitter();
		emitter.rate = new Proton.Rate(new Proton.Span(getIn(meta, ["rate", "from"], 5), getIn(meta, ["rate", "to"], 13)), .1);
		emitter.addInitialize(new Proton.Mass(1));
		//emitter.addInitialize(new Proton.ImageTarget(image));
		emitter.addInitialize(new Proton.ImageTarget(images, 32));
		emitter.addInitialize(new Proton.Position(new Proton.CircleZone(canvas.width / 2, canvas.height / 2 + 200, 10)));
		emitter.addInitialize(new Proton.Life(5, 7));
		emitter.addInitialize(new Proton.V(new Proton.Span(2, 5), new Proton.Span(0, 30, true), 'polar'));
		emitter.addBehaviour(new Proton.Gravity(2));
		emitter.addBehaviour(new Proton.Scale(getIn(meta, ["scale", "from"], 0.5), getIn(meta, ["scale", "to"], 0.2)));
		emitter.addBehaviour(new Proton.Alpha(getIn(meta, ["alpha", "from"], 0.5), getIn(meta, ["alpha", "to"], 0.2)));
		emitter.emit();
		proton.addEmitter(emitter);
		
		setTimeout(function(){
			emitter.destroy();
			deferred.resolve();
		}, t);
		
		return {promise : deferred.promise(), destroy : function(){
			emitter.destroy();
		}};
	}

	function movingEmitterOutline(protonObj, x, y, radius, images){
		var deferred = $.Deferred();
		var proton = protonObj.proton;

		function createEmitter(){
			var emitter = new Proton.Emitter();
//			var image = new Image();
//			image.onload = function(e) {
				emitter.rate = new Proton.Rate(new Proton.Span(8, 10), new Proton.Span(.01, .015));
				//emitter.rate = new Proton.Rate(new Proton.Span(1, 0.1), .01);
				emitter.addInitialize(new Proton.Mass(1));
				emitter.addInitialize(new Proton.Life(1, 2));
				//emitter.addInitialize(new Proton.ImageTarget(['image/particle.png'], 32));
				emitter.addInitialize(new Proton.ImageTarget(images),32);				
				//emitter.addInitialize(new Proton.Radius(2));
				//emitter.addInitialize(new Proton.V(new Proton.Span(0.1, 1), 180, 'polar'));
				emitter.addInitialize(new Proton.Velocity(0.1, Proton.getSpan(0, 360), 'polar'));
				//emitter.addBehaviour(new Proton.Alpha(1, 0));
				//emitter.addBehaviour(new Proton.Color('#4F1500', '#0029FF'));
				emitter.addBehaviour(new Proton.Color('#ffffbb', '#ffff55'));
				emitter.addBehaviour(new Proton.Scale(0.2, 0.4));
				emitter.addInitialize(new Proton.Position(new Proton.RectZone(-5,-5,10,10)));
				

				//emitter.addBehaviour(new Proton.Color('#E38F5C', '#BD4F00'));
				emitter.addBehaviour(new Proton.Color( 'random', 'random'));
				//emitter.addBehaviour(new Proton.Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, Proton.easeOutSine));
				
				//emitter.addBehaviour(new Proton.Alpha(1, 0.7));
				
				
				//emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, 1003, 610), 'dead'));
				//emitter.p.x = 1003 / 2;
				//emitter.p.y = 610 / 2;
				emitter.emit();
				proton.addEmitter(emitter);				
				
//			}
//			image.src = imageSrc;
			return emitter;
		}

		var em1 = createEmitter();
		//var em2 = createEmitter();


		var angle = 0;
		function t(em){
			angle+=5;
			//new Date().getTime();
			if(angle<360){
				em.p.x = x + (radius * Math.sin(angle*radiansPerDegree));
				em.p.y = y + (radius * Math.cos(angle*radiansPerDegree));
				schedule(function(){ t(em)});
			}else{
				em.destroy();
				deferred.resolve();
			}
		};

		t(em1);
		//t(em2, path2);
		//var p2 = path1.slice(0).reverse();
		//t(em2, p2);
		return {promise : deferred.promise(), destroy : function(){
			 em1.destroy();
			 //em2.destroy();
		}};
	}	
	
	
	
	return this;

}

