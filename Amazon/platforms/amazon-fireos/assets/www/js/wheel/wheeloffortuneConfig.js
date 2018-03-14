// 26, 144, 43
/**
 * An example configuration that retrieves ticket configuration from a ticket engine
 * and then displays the results in a wheel of fortune style display.
 * 
 * @author James Adams
 */
 
 var big_spin_url = "http://52.90.150.11:10555/";
 var big_spin_url_s = "https://52.90.150.11:10555/";
 var wheel_win;
function WheelOfFortune() {
	
	var spinner;	
	initialiseLogging();
	var balance = 0;
	var stakePerSpin = 1;
	var displayMsgQueue = [];
	$("#game .msg").hide();
	
	$(window).bind('resize', setSize);
	setSize();
	
	var ticketName = getUrlParameter("ticketId");
	if(ticketName){
		var params = getUrlParameter("secret") ? {secret :getUrlParameter("secret")} : {};
		params.user = "SOMEUSER_SETME!";     //TODO
        params.stake = 1;
		
		//##NOTE## - in production you will want to make requests to your main server, which is turn calls this the ticket end point
        // #EDIT
    //window.open(big_spin_url + "ticket/"+ticketName, params);
    //wheel_win = window.open(big_spin_url + "ticket/"+ticketName, params);
    
    /*
    //Essentially a XSS Attack used for good
    wheel_win = window.open("https://singleplayer.vegasgames.com/vegasgames/static/singleplayer/index.html");
    console.log(wheel_win.localStorage.getItem("user_name"));
    wheel_win.close();
    */
    
    $.getJSON(big_spin_url + "ticket/"+ticketName, params, function(resp){
        renameFields(resp);
        _.map(resp.outcomes, renameFields);
        resp.display = JSON.parse(resp.display);
        initTicket( resp );	
    });
    
		
	}else{
		var ticketName = getUrlParameter("ticket") ? getUrlParameter("ticket") : "ticket1";	
		initTicket( tickets[ticketName] );		
	}
	
	function initTicket(tConfig){	
		ticketConfig = tConfig;
		
		//we can store additional display information in the ticket and use it to set the css etc
		if(ticketConfig.display.data && ticketConfig.display.data.css){
            // #EDIT
            var URL = big_spin_url + "static/wheeloffortune/";
            for(var i = 2; i < ticketConfig.display.data.css.length; i++){
                URL += ticketConfig.display.data.css[i];
            }
		  $("link[rel=stylesheet].themeCss").attr("href", URL);			
		}
		 
		ticketConfig.outcomes = ticketConfig.outcomes.sort(function(a,b){
			return a.id > b.id;
		});
		
		currentSegments = calculateDegreesFromTheOdds(ticketConfig);
		
		var spinnerConfig1 = $.extend( {}, ticketConfig.display); 
		spinnerConfig1.canvasElementId = "gameCanvas";
		spinnerConfig1.segments = currentSegments;	    //the wheel segments in a CLOCKWISE order!
			
	    if(!(typeof screenfull == "undefined") && screenfull.enabled) {
	    	  document.addEventListener(screenfull.raw.fullscreenchange, setSize);
	    }
	
	    var wheelEventListener = {};
	    
		spinner = new WheelOfFortuneCanvas(spinnerConfig1, wheelEventListener);       //the main wheel canvas
	
		if(false){
			//to animate the wheel into position....
			var targetTop = $( ".canvasContainer" ).position().top;
			$( ".canvasContainer" ).css("top", "-"+targetTop+"px");
			$( ".canvasContainer" ).animate({ top : targetTop}, 1200, "easeOutQuad", function() {
		
			});
		}
		
		setBalance(10);      //TODO  You will want to get this from your server
		$(".identityLabel, .identityIcon, #payoutTable, #showPaytable").remove();
	
		$("#play, #spinBtn").click(function() {
			$("#play, #clearBets, #spinBtn").hide();
			spinWheel();							
		});
		
		$("#gameTable").click(function(){  	    	
			if (isTouchDevice() && !(typeof screenfull == "undefined") && screenfull.enabled && !screenfull.isFullscreen) {	        
		        screenfull.request();			// We can use `this` since we want the clicked element	            	        
		    } 
			$("#gameTable").unbind( "click" );
		});
	}
	
	//showMsg("Place your bets");	

	function setBalance(b){
		balance = b;
		$("#game .balance").html("$"+formatBalance(balance));
	}
		
	function setSize(){
		// We need to use some Javascript as what we want isn't possible in css
		var aspectRatio = { width : 1200, height : 1200 };		    //we want to display at this aspect ratio
		var width = $("#sizeHelper").width();
		var height = $("#sizeHelper").height();
        var scale = Math.min(width / aspectRatio.width, height / aspectRatio.height), 		//var w = (window.innerWidth > 0) ? window.innerWidth : screen.width;
          w = Math.round(scale * aspectRatio.width),
          //h = Math.round(scale* aspectRatio.height),
          x = w / 10;
	      $("#game").css("font-size", x + "px"); 
	}

	/* rename the fields for our client side format */
	function renameFields(obj){
		for(n in obj){
			if(n.indexOf("/")>=0){
				obj[n.substr(n.indexOf("/")+1)] = obj[n];   				//rename fields
				delete obj[n];
			}
		}	
		return obj;
	}
	
	function spinWheel(){
		var bets = []; 
		if(false){
			//Client side spin - Was used during the wheel canvas development
			var r = Math.random();
			info("random is "+r);
			var outcome;
			var cumulativeOdds=0;
			for(s in currentSegments){
				cumulativeOdds += currentSegments[s].weighting;
				if(r < cumulativeOdds){
					outcome = currentSegments[s];
					break;
				}
			}
			spinWithResult(outcome);
		}else{
			if(balance >= stakePerSpin){
				var params = getUrlParameter("secret") ? {secret :getUrlParameter("secret")} : {};
				params.user = "SOMEUSER_SETME!";      //TODO
				params.stake = stakePerSpin;
				setBalance(balance-stakePerSpin);
				spinner.preSpin();      //this moves the wheel back to provide immediate visual feedback before the result is returned from the server
				//setTimeout(function(){
					//##NOTE## - in production you will want to make requests to your main server, which is turn calls this the ticket server end point
                    // #EDIT
                    console.log("Spin Begin");

					$.getJSON(big_spin_url + "play-ticket/"+ticketName, params, function(resp){
						if(resp.headers==null || resp.headers.status==200){
							resp = renameFields(resp);
							spinWithResult(resp);
						}else{
							showMsg(resp.body);
							$("#play, #clearBets").show();
						}
					});
				//}, 1000);				
			}else{
				showMsg("Not enough balance");
			}
		}
		
		function spinWithResult(outcome){
			info("RESULT IS "+JSON.stringify(outcome));
			console.log(outcome);
//			var config = spinner.getConfig();
//		    var validElements = _.filter(config.segments, function(a, idx){ if(a.id==outcome.id){ return a; } });
//		    var seg = _.first(_.shuffle(validElements));

			var prom = spinner.spin(outcome);			
			prom.then(function(){
				//Ok the wheel has stopped, display a message or do what we need to do
		    	if(outcome.winUrl){
		    		//Show an image url if there is one
		    		showImage(outcome.winUrl, 3000);
		    	}else if(outcome.onHitMessage){
		    		//Otherwise the outcome message
			    	showMsg(outcome.onHitMessage);
		    	}else if(outcome.prizeIcon){
		    		//Otherwise the prizeIcon
		    		showImage(outcome.prizeIcon);		    	
		    	}else if(outcome.prize){
		    		//Other the prize amount
			    	showMsg(outcome.prize);
		    	}else if(outcome.label){	
		    		//Failing that display the outcome label
			    	showMsg(outcome.label);		    			    	
		    	}				
				
		    	//You can tell the canvas to play a special effect 
		    	if(outcome.prize && outcome.prize != "" && outcome.prize != "0" && ticketConfig.display.onWinParticleEffect){
		    		//In this example we get the effect to display from the display config
		    		spinner.showParticleEffect(ticketConfig.display.onWinParticleEffect);
		    	}		    	
		    	
				setBalance(balance + outcome.payout);
				setTimeout(function(){
					$("#play, #clearBets, #spinBtn").show();					
				}, 4000);				
			});			
		}
	}
	
	
	function showImage(src, t){		
		showMsg("<img src='"+src+"'/>");
	}
	
	function showMsg(msg, t){		
		if(!t) t = 2000;
		if( !$("#game .msg").is(":visible") ){
			$("#game .msg .inner").html(msg);	
			$("#game .msg").show();				
			setTimeout(function(){
				$("#game .msg").hide();
				if(displayMsgQueue.length > 0){
					showMsg(displayMsgQueue.shift());
				}
			}, t);
		}else{
			displayMsgQueue.push(msg);
		}			
	}	

}

/* adjust the odds so they add up to 1 */
function calculateRelativeOdds(outcomes){
	var totalWeighting = 0;
	outcomes = JSON.parse(JSON.stringify(outcomes));
	for(o in outcomes){
		totalWeighting += outcomes[o].weighting;
	}	
	for(o in outcomes){
		outcomes[o].odds = (outcomes[o].weighting / totalWeighting);
	}	
	return outcomes
}

function formatBalance(bal){
	return bal.toFixed(2)		
}

function calculateDegreesFromTheOdds(ticket){
	var degreesPerSegment = 360/17;
	var outcomes = calculateRelativeOdds(ticket.outcomes);    //adjust odds so they add up to 1
	//var outcomes = ticket.outcomes;
	
	if(ticket.display.sizing == "proportional"){
		var smallest=360;
		var extraDegrees=0;
		var usedDegrees=0;
		var minDegrees = 10;
		
		for(o in outcomes){
			outcomes[o].degrees = outcomes[o].odds * 360;
			if(outcomes[o].degrees < smallest){
				smallest = outcomes[o].degrees;
			}
			if(outcomes[o].degrees < minDegrees){
				extraDegrees += (minDegrees - outcomes[o].degrees);	    //the extra degrees we need to find			
			}else{
				usedDegrees += outcomes[o].degrees;
			}
		}
	
/*		//TODO Extra work could be done here
		if(extraDegrees > 0){
			//####### TODO EXTRA WORK IS NEEDED HERE ########
//			if(extraDegrees > 360){
//				//TODO ----
//			}			
		}

		var availableDegrees = 360 - extraDegrees;       //The available degrees to be used for those that are not below the minimum
		//FIXME scaling the others down might mean they are now too small!
		//We might need to do a second pass through the values
		
		
		//the smallest segment is too small. Scale it up to the mimimum size scaling the others down accordingly
		//ensuring they are not scaled down below the minimum size.  This limits the max segments to 36 when the min degrees is 10
		for(o in outcomes){
			if(outcomes[o].degrees < minDegrees){
				outcomes[o].degrees = minDegrees;
			}else{
				outcomes[o].degrees = outcomes[o].degrees * (availableDegrees/360);
				//TODO this might now be too small
			}
			availableDegrees -= outcomes[o].degrees;
		}
*/		
		
	}else{
		for(o in outcomes){
			outcomes[o].degrees = (1/ticket.outcomes.length) * 360;
		}		
	}
	

	return outcomes;
}


//Takes an array of numbers and returns an array or arrays including the angle of each segment
//This function gives the same size angle for all.
function calculateDegreesPerSegment(numbersOrder) {
	var degreesPerSegment = 360 / numbersOrder.length;
	return _.map(numbersOrder, function(a) {
		return [ degreesPerSegment, a ];
	});
}

function getCustomWheelSegments(n) {
	var randomWheel = _.shuffle(_.map(_.range(n), function(s) {
		return s + ""
	})); //FIXME randomness should be removed here
	return calculateDegreesPerSegment(randomWheel);
}

//-----------------------------------------------------------------------------------------------
