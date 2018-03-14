/* REQUIRES JQUERY */
var minJavaVer = "1.5",
	minJavaVersion = minJavaVer+"+",		//the minimum Java version a user must have
	fullscreenMode=false,
	browserName,
	usergamedata,
	isFirefox = false,
	ignoreRotation = false,			//Whether we should ignore the rotate screen message and allow users to play in both orientations
	autoScrollToTop = false,
	postLoginActionQueue = [];

version = navigator.appVersion;
browserName = navigator.appName;


/**** CODE TO HANDLE PING AND DISCONNECTION *****/
var connected = true,
	reconnectTimeout,
	timeToSendPing,
	pingSentTime,
	pingConfirmTime,
	pingDuration = 20*1000;		//send ping once every x milliseconds

var profanities = ['VIBRATOR','TESTICLE','FOREPLAY','ERECTION','DRUGLORD','DOGSTYLE','BISEXUAL','SCHMUCK','LESBIAN','KNOBJOB','HANDJOB','GENITAL','GANGSTA','COCAINE','BLOWJOB','BASTARD','ASSHOLE','GODDAMN','WANKER','RETARD','RECTUM','RAPIST','NOBJOB','NIGGER','LEZZIE','FAGGOT','DAMMIT','CHRIST','BREAST','WHORE','URINE','SPOOK','SPICK','SPERM','SMACK','SLOPE','SKANK','SCREW','QUEER','PUSSY','PUBIC','PUBES','PRICK','PORNO','PENIS','LEZBO','JESUS','HYMEN','HORNY','FECES','FAGIT','ERECT','CRANK','CRACK','BOOBS','BITCH','BIGOT','ALLAH','WANK','TUSH','TURD','TOOT','TITS','SUCK','SPIC','SPEW','SLUT','SHIT','SHAG','SCUM','RAPE','PUTZ','PUBE','PORN','PORK','POOT','POOP','POLE','PISS','ORGY','MICK','LICK','KNOB','KIKE','JIZZ','JISM','JERK','HUNG','HUMP','HOMO','GOOK','FUCK','FART','DYKE','DONG','DICK','DAMN','DAGO','CUNT','CRAP','COKE','COCK','CLIT','BOOB','BLOW','BANG','ARSE','ANUS','WOP','TIT','SUK','SEX','ROD','PEE','NIP','NIG','LEZ','KUM','JEW','JAP','JAG','GAY','FUK','FUC','FAG','CUM','BRA','ASS'];
	
function fillChars(chr, cnt) {
    var s = '';
    for (var i=0; i<cnt; i++) { s += chr; }
    return s;
}
    
function filterProfanities(str){
    str = str.replace(/\r?\n/g,' <br>');
    var rg;
    for (var i=0; i < profanities.length; i++) {
        rg = new RegExp(profanities[i],"ig");
        if(rg.test(str)){
            str = str.replace(rg,fillChars('*', profanities[i].length));
        }
    }
    return str;
}
    
    
    
/**
 * Shows a lost connection message AND tries to reconnect
 */
function connectionLost(){
	connected = false;
	showWarning("Reconnecting...",1500);		
	log("About to try and rejoin the room");

	//Also need to make sure not to do reconnect (if not already in progress)
	if(reconnectTimeout==null){
		log("setTimeout to try and rejoin room");
		reconnectTimeout = setTimeout(function(){
			if(gameInit==null){
				showWarning("gameInit is null");
			}
			reconnectTimeout = null;
			xService.start(getTargetRoomId(), hotel, Joyplay.getAccessToken(),{
				callback: gameInit,
				errorHandler: function(errorString, exception){
					//DO nothing and wait for the ping to try again
				}
			});
		},1000);
	}else{
		log("reconnectTimeout is not null");
	}
}

function sendPing(){
/*	if(!connected){
		//disable sending ping msg to server;
		return;
	} */
	var d = new Date();
	if(timeToSendPing == null){
		timeToSendPing = d.getTime()+pingDuration;
	}else if(timeToSendPing < d.getTime()){
		pingSentTime = new Date();
		pingConfirmTime = null;
		timeToSendPing = d.getTime()+pingDuration;
		//sendPingMessage()
		xService.ping({callback: pingConfirmCallback});
	}
}


function pingConfirmCallback(){
	pingConfirmTime = new Date();
	log("PING CONFIRM "+(new Date().getTime() - pingSentTime.getTime())+" msec");
}

function checkIfLostConn(){
	var d = new Date();
	var checkBetCallbackTime = 12000;//seconds
	if(pingSentTime != null && //ping was sent
			d.getTime() - pingSentTime.getTime()>checkBetCallbackTime &&//seconds since ping was sent 
			pingConfirmTime == null){//ping confirm not received
		connectionLost();
		return true;
	}
	return false;
}

/*************/



/*
 * Default Joyplay social functions.
 * These are overridden for the different distributions such as (Facebook/Moco etc)
 */
function Joyplay(){
	
	this.notLoggedInExceptionHandler = function(){
		alert("Not Logged in - refresh page");
	};
	
	this.initThirdParty = function(appId, callback){ 
//		var guest = getUrlParameter("guest");
//		if(guest=="true"){
//		}
		warn("Joyplay.initThirdParty() - This should be overriden!");
		callback(true); 
		return true;
	};
	this.getReviewUrl = function(){
		return null;
	};
	this.getThirdPartyCurrency = function(){
		return "CHIPS";
	};		
	this.getThirdPartyNetwork = function(){
		return "JOYPLAY";
	};
	this.getFriends = function(b){ 
		b(new Array());
	};
	this.sendRequest = function(f){ 
		showWarning("This is not available in the guest version");
	};
	this.getFirstname = function(f){ 
		if(f!=null){
			f("guest"); 
		}
		return "guest"; 
	};
	this.inviteFriends = function(){ 
		showWarning("This is only available in the Facebook version");
	};
	this.autoInviteFriends = function(msg){ 
		this.inviteFriends();
	};
	this.postToFeedOrInvite = function(){ 
		showWarning("This is only available in the Facebook version");
	};
	this.redeem = function(){ 
		showWarning("This is not available in the guest version");
	};
	this.likes = function(appId, a){ 
		a(false);
	};
	this.getPermissions = function(callback) {
		callback(new Object());
	};
	this.canPublish = function(){
		return true;
	};
	this.postScore = function(score){};
	this.autoPostToFeed = function(){ /* log("TODO autoPostToFeed"); */ };
	this.setStatus = function(){ /* log("TODO setStatus"); */ };
	this.fanPage = function(){ /* log("TODO fanPage"); */ };
	this.refreshBalance = function(b){ /* log("TODO refreshBalance "+b); */ };
	this.showFullProfile = function(b){ /* log("TODO showFullProfile "+b); */ };
	this.setDocumentSize = function(b){ /* log("TODO setDocumentSize "+b); */ };
	this.logout = function(){};
	this.getSocialFeaturesEnabled = function(callback) { 
		if(callback != null){
			callback(false); 
		}
		return false;
	};
	this.getAppUrl = function(){ return appUrl;	};
	this.getServerUrl = function(){ return serverUrl;	};
	this.getAccessToken = function() { return ""; };
}
var Joyplay = new Joyplay();
 
if(navigator.userAgent.indexOf("Firefox") != -1){
	browserName = "Firefox";
	isFirefox = true;
}else if(navigator.userAgent.indexOf("MSIE") != -1){
	browserName = "Explorer";
}

function Dim(){
	this.width = 0;
	this.height = 0;
}

function jadeInstallJava(){
	if(deployJava.installLatestJRE()){ 
		alert("Ok great, Java is updated.  Press enter to join the fun");
	}else{
		alert("Java update was canceled.  No problem, it will install automatically later when you enter the rooms, make sure you click accept when prompted");
	}
}
 
/* 
* Something went wrong with the applet, give up trying to connect.
*/
function giveUp() {
	window.onbeforeunload = null;  
	
    var sURL = unescape("givenUp.jsp");
    window.location.replace( sURL );
}

function refreshPage() {
	window.onbeforeunload = null;

    //  This version does NOT cause an entry in the browser's
    //  page view history.  Most browsers will always retrieve
    //  the document from the web-server whether it is already
    //  in the browsers page-cache or not.
    var sURL = unescape(window.location.pathname);
    window.location.replace( sURL );
}

function refreshPage() {
	window.onbeforeunload = null;
	
	// If we needed to pull the document from
    //  the web-server again (such as where the document contents
    //  change dynamically) we would pass the argument as 'true'.  
    window.location.reload( true );
}

function refresh() {  
  window.scroll(0,0);
}

function openGame(tUrl) {
	myOpenWindow(tUrl);
}

function goToGamemoviePage(tGamename, tMoviename){
    var sURL = unescape(window.location.pathname);    
    sURL+="?quick=true&gamename="+tGamename+"&moviename="+tMoviename;
    window.location.replace( sURL );
}

var targetRoomId;		//Used in the situation where a room is dynamically loaded via AJAX
function getTargetRoomId(){
	if(targetRoomId!=null){
		return targetRoomId;
	}
	return getRoomIdFromUrl();
}
function getRoomIdFromUrl(){

	var roomId = getUrlParameter("roomId");
	if(roomId== ""){
		try{
			var pathArray = document.location.pathname.split( '/' );
			roomId = pathArray[pathArray.length-1];
			
			if(roomId.charAt(0)!='@'){		//Room names after the slash must start with a '@'	
				roomId = "";		
			}
		}catch(ex){}
	}
	return roomId;
}
function openLobbyHelp() {
	tUrl = "help.jsp";
	myOpenWindow(tUrl);
}

function openGameHelp(tGame) {
	//TODO
	myOpenWindow(tUrl);
}

function openGetPoints() {
	tUrl = "../../games/user/u?page=deposit";
	myOpenWindow(tUrl);
}

//--Opens a players profile
//function openUserProfile(tUser) {
//	tUrl = "../../games/user/u?page=xxx";
//	myOpenWindow(tUrl);
//}

//--Opens a page that contains this players game statistics
function openUsersGameStats(tUser, tGame) {
	tUrl = "../../games/user/u?page=xxx";
	myOpenWindow(tUrl);
}
 
function openMyResources(){
	openInMainWindow("/games/user/myresources");
}

function openMyAccountPage(){
	openInMainWindow("/games/user/u?page=myaccount");
}

function openInvitePage(){
	openInMainWindow("/games/user/u?page=refer");	
}

function goToSubscribePage(){
	openInMainWindow("/games/user/subscribe_page");
}

function openInMainWindow(tUrl) {
	//we use window.parent since the applet will always be hosted in some frameset
	var mainWindow = window.parent.opener;
	mainWindow.location.href = tUrl;
	mainWindow.focus();
	if (isFirefox) {
		//otherwise focus will not be given to the firefox window...very annoying
		mainWindow.alert('Press OK to continue'); 
	}
	
}

function openMyProfile() {
	
	openMyAccountPage();

	//tUrl = "../../games/user/u?page=myprofile";
	//tOptions = "dialogWidth: 800px; dialogHeighth: 700px; resizable:yes; scroll:no";
}

function myOpenWindow(tUrl){
	var args='width=840,height=700,left=25,top=20,toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=0';  
	openURLAndDisplayDivIfBlocked(tUrl,"",args); 	
}

//window.onResize = refresh;
//window.onLoad = refresh;

	
function writeBrowser(){	
	document.write("<br>Browser: "+browserName)
}


function isFirefoxBrowser(){
	browserName = navigator.appName
	if(navigator.userAgent.indexOf("Firefox") != -1){
		return true;
	}
	return false;
}

function checkVersion(version) {
	var javaID="application/x-java-applet;version="
    // Mozilla may not recognize new plugins without this refresh
    //navigator.plugins.refresh(true);
    for (var i = 0; i < navigator.mimeTypes.length; ++i) {
	    pluginType = navigator.mimeTypes[i].type;
        if (pluginType.indexOf(javaID) > -1){
	    	if(pluginType.indexOf(javaID+""+version) > -1){
	           	return true;
	        }
        }
     }
   return false;
 }

//usage:
//	var desiredJavaVersion = "1.6"
//	detectBrowser()
//	if(isFirefox){
//		if(checkVersion(desiredJavaVersion)){
//			document.write("<br>OK")
//		}else{
//			window.location.href = " http://jdl.sun.com/webapps/getjava/BrowserRedirect?locale=en&host=java.com "
//		}
//	}else{
//		document.write("<br>JRE detection for "+browserName+" not coded yet")
//	}


//Used for detecting a popup being blocked. Use target "_blank" to open a popup.
//@ return true if popup was successfully opened
function openURL( url, target, args ) {
   		
	try	{
		var popup = window.open(url, target, args);
		if (popup == null)
			return false;
		if (window.opera)
			if (!popup.opera)
			return false;
	}catch(err) {
		return false;
	}
	return true;
}

var urlBackup;
function openURLAndDisplayDivIfBlocked( url, target, args) {
	if (openURL(url, target, args) == false) {
		//the popup was blocked
		//save the url
		urlBackup = url;
		//show the div
		$('#popupBlockedDiv').show();
		$('#appletComponent').css("width","1px");
		$('#appletComponent').css("height","1px");
	}
}

function hidePopupBlockedDiv() {
	$('#popupBlockedDiv').style.display='none';
	$('#appletComponent').css("width","100%");
	$('#appletComponent').css("height","100%");
}

/*Just opens a dummy page that will close immediately. If successful it will return true.*/
function arePopupsAllowed(context) {
	return (getUrlParameter("continue") != "") || openURL(context+"/popupCheck.jsp","_blank", 'width=50,height=50,left=25,top=20,toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=0')
}

/*Tries to open url. Returns true if it manages to open the popup */
function openPopup(url) {
	return openPopup(url,'popup');
}

function openPopup(url, target) {
	return openURL(url, target, 'width=900,height=680,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no,directories=no');
}


/*Just opens the URL... doesn't return anything. Useful for using it in href="javascript:justOpenPopup(..." */
function justOpenPopup(url) {
	openPopup(url);
}

function justOpenPopup(url, target) {
	openPopup(url, target);
}

function copyToClipboard(s){
	if( window.clipboardData && clipboardData.setData ){
		clipboardData.setData("Text", s);
	}	
}

function goToSignUpPage() {
	window.onbeforeunload = null;
	//i'm accessing the parent just in case it is in a frame set (guest). It won't effect if we're not in a frameset
	window.parent.location.href = ctx+"/signup_page";
}

function writeAppletForSafari(attributes, parameters) {
	var html = getObjectTag(attributes, parameters);
    document.write(html);   
}
function getObjectTag(attributes, parameters) {
    //var s = '<' + 'object classid="clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA"';	
    var s = '<' + 'object type="application/x-java-applet;version=1.5+"';	
    for (var attribute in attributes) {
    	if(attribute=="style"){
    		//TODO parse the string - "width:1000px;height:601px"
    		var tWidth = "1000";
    		var tHeight = "601";    		
    		s += ' width="'+tWidth+'"';    
    		s += ' height="'+tHeight+'"';    
    	}else{
    		s += ' ' + attribute + '="' + attributes[attribute] + '"';    		
    	}
    }
    s += '>';
    
    for (var parameter in parameters) {
		s += '<param name="'+parameter+'" value="' + parameters[parameter] + '">';
    }
    s += '</object>';
    return s;
}

function getAsEmbedTag(attributes, parameters) {
        var s = '<' + 'embed ';
        for (var attribute in attributes) {
            s += (' ' + attribute + '="' + attributes[attribute] + '"');
        }
        for (var parameter in parameters) {
			s += (' ' + parameter + '="' + parameters[parameter] + '"');
        }
        s += '></embed>';
        return s;
}

/*Set the main css to be the correct size*/
function setMainCSS(){
	var c = "http://"+document.location.host;			//because of IE	
	var w = getDocumentDimension().width;
	if ((w>=700)) {
		c += ctx+"/styles/medium/"+websiteName+".css";
	} else {
		c += ctx+"/styles/small/"+websiteName+".css";
	}
	$("link[rel=stylesheet].mainSizeStyle").attr("href", c);
}

//Logarithmic function with variable base
function customLog(x,base) {
	return (Math.log(x))/(Math.log(base));
}

function initReverseAjax() {
	if (dwr.engine._scriptSessionId == null) {
		info("setTimeout initReverseAjax() in 2000");
		setTimeout("initReverseAjax()", 2000);
	} else {
		dwr.engine.setActiveReverseAjax(true);
	}
}
function dummyCallback(arg){
	
}
/**
 * 
 * @param s - true or false
 */
function setAutoScrollToTop(s){
	autoScrollToTop = s;
}
var scrollEventHandler = function(event) {
	if(autoScrollToTop && $(".dontAutoScroll").is(":visible")==false ){				//This can be temporily disable by setting this variable
	//	if (isIDevice()) {
	//		window.setTimeout(function() {
	//			window.scrollTo(0, 20);
	//		}, 100);
	//	} else {
			window.setTimeout(function() {
				window.scrollTo(0, 1);
			}, 500);
	//	}
	
		event.stopPropagation();
		event.preventDefault();
	}	
};

/* Get the actual size of the document.body */
function getDocumentDimension(){
  	var d = new Dim();  	
    d.width = $("body").width();
    d.height = $("body").height();
	return d;
}

/**
 * Get the the screen size
 * @param orientation
 */
function getScreenSize(orientation){
	var d = new Dim();
	if(orientation==null){
		orientation = window.orientation;
	}
	
	if(isIDevice() && (orientation==90 || orientation==270)){
		//flip them
		d.width = screen.height;	
		d.height = screen.width;				
	}else{
		d.width = screen.width;	
		d.height = screen.height;		
	}
	return d;
}

/** 
 * Get the available size
 * @param orientation
 */
function getAvailableScreenSize(orientation){
	if(isDesktop){
		var d = getContainerDimension();
		return d;
	}else{
		if(withinIFrame){
			//Because we're within an Iframe we have to rely on the screen size because we can't access the top.window.innerWidth		
			var d = getScreenSize(orientation);
			if( isIPad()) {
				d.height -= 80;		//allow for the top bar				
			}else if( isIPod() || isIPhone() ){
				d.height -= 30;		//allow for the top bar		
			}
			return d;		
		}else{
			var d = getContainerDimension();
			return d;
		}		
	}
}

/* Get the size of the viewport */
function getContainerDimension(){
	var d = new Dim();  	  
	 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight		 
	/*
	if (typeof window.innerWidth != 'undefined'){
		d.width = window.innerWidth;
		d.height = window.innerHeight;
		//alert("window.innerWidth="+window.innerWidth+" window.innerHeight="+window.innerHeight);
//		if (typeof window.outerHeight != 'undefined' && window.outerHeight > window.innerHeight) {
//			d.height = window.outerHeight;
//		}
	} else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth !='undefined' && document.documentElement.clientWidth != 0){
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		d.width = document.documentElement.clientWidth;
		d.height = document.documentElement.clientHeight;
	} else {
		// older versions of IE
		d.width = document.getElementsByTagName('body')[0].clientWidth;
		d.height = document.getElementsByTagName('body')[0].clientHeight;
	}
	*/
	
	d.width = window.innerWidth ? window.innerWidth : $(window).width();
	d.height = window.innerHeight ? window.innerHeight : $(window).height();
	
	if(isIPod() || isIPhone()){
		if(window.navigator.standalone !== true) {
			d.height -= 30;		//take off the nav bar on iPhone
		}
	}

/*	NOT NEEDED iPad seems to have removed this from the innerHeight
	if(isIPad() ){
		if(window.navigator.standalone !== true) {
			d.height -= 80;
		}
	} */
	
	
	if(isIDevice() && (window.orientation==90 || window.orientation==270)){
		var tW = d.width;
		d.width = d.height;
		d.height = tW;
	}
	
	
	return d;
}

/**
 * Set the body height to be that of the SCREEN.
 */
function setBodyHeightToFillWindow(){
    var d = getAvailableScreenSize(); 
    $("body").css("height",d.height + "px");
    $("body").css("position", "relative");
}


/*
//add new event shortcuts
$.each( ( "touchstart touchmove touchend orientationchange throttledresize " +
					"tap taphold swipe swipeleft swiperight scrollstart scrollstop" ).split( " " ), function( i, name ) {

	$.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	$.attrFn[ name ] = true;
});
*/

/* var supportTouch = $.support.touch,
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
*/

var supportTouch = ("ontouchend" in document),
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchEndEvent = touchStopEvent,
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

function isTouchDevice() { 
	return supportTouch;
/*	var el = document.createElement('div'); 
	//el.setAttribute('ongesturestart', 'return;');
	el.setAttribute('ontouchmove', 'return;'); 	
	return typeof el.ontouchmove == "function"; */	
}

function isTouch(){
	return isTouchDevice();
}
function isLandscape(){	
	//In theory this should work better.  Should try and get it working really.
	//var d;
	//if(withinIFrame){
	//	d = getAvailableScreenSize();
	//}else{
	
/*	
	try{
		if(window.orientation==0 || window.orientation==180){
			return true;
		}else{
			return false;
		}
	}catch(ex){
		return false;
	}	
*/	
	
	if(isTouchDevice()){
		var d = getDocumentDimension();
	}else{
		var d = getWindowDimension();
	}
	return d.width >= d.height;
}

function isPortrait(){
	return !isLandscape();
}

function displayRotateScreenIfLandscape(){			
	var t;
	var f = function(){
		if(!isDesktop && isLandscape() && !isPackagedApp()){
			//LANDSCAPE
			if(!ignoreRotation){
				displayRotateScreen();
				t = setTimeout(f,250);
			}
		}else{
			//OK PORTRAIT
			$(".rotateScreen").remove();
			clearTimeout(t);
		}		
	}
	f();
}

function displayRotateScreenIfPortrait(){			
	$(".rotateScreen").remove();	
	if(!isDesktop && isPortraitView()){
		//IS LANDSCAPE
		if(!ignoreRotation){
			displayRotateScreen();
			return true;
		}
	}
}
function displayRotateScreen(){
	if($(".rotateScreen").length==0){
		$("body").append("<div class='rotateScreen'><div class='message'>Please rotate your device</div><div id='closeRotate' class='close'>[ignore]</div></div>");
		$(".rotateScreen").click( function(){
			ignoreRotation = true;
			$(".rotateScreen").remove();	
		});
	}
}
var prevW=0;
var prevH=0;
var prevDimH=0;
var prevDimW=0;
function clearPrevSizes(){
	prevW=0;
	prevH=0;
	prevDimH=0;
	prevDimW=0;
}
function hasSizeChanged(){
	
	//if(dist=='MOCOSPACE'){
		//TODO we should do this only when in moco as these would not change when we use 100%
		var w = $("body").css("width");
		var h = $("body").css("height");
		var dim = getDocumentDimension();
		if(w == prevW && h == prevH && dim.width==prevDimW && dim.height==prevDimH){
			return false;		//no change
		}else{
			prevW = w;
			prevH = h;
			prevDimW = dim.width;
			prevDimH = dim.height;
			return true;
		}
//	}else{
//		//TODO perhaps check if $("body").css("width") contains %
//		var dim = getDocumentDimension();
//		if(dim.width == prevW && dim.height == prevH){
//			return false;		//no change
//		}
//		prevW = dim.width;
//		prevH = dim.height;
//		return true;		
//	}
}

function setFullScreenMode(){	
	try{
		log("setFullScreenMode called");
		autoScrollToTop = true;
		fullscreenMode = true;
		setBodyHeightToFillWindow();
	    window.scrollTo(0,1);	
	    
	    $(document).unbind('scroll',scrollEventHandler);
	    $(document).bind('scroll',scrollEventHandler);			//window.addEventListener("scroll", scrollEventHandler, false);	
	    
	    /* $(document).bind('touchmove', function(e) {
	    	   e.preventDefault();
	    }, false); */
	    
	    //FIXME This breaks the "click" event maybe we should set 
/*	    tapEventName="tap"; 
	    $(document).bind('touchstart',function(event, ui){
	    	if($(event.target).hasClass("allowDefault")){		//without auto focus on the text input panel does not work
	    		//showWarning("allow default");
	    	}else{
	    		event.preventDefault();
	    	}
	    	//event.stopPropagation();
	    	//event.stopImmediatePropagation();
			return event;
	    });	
*/
	    
	    
	    
	    //***FIXME*** - THIS STOPS THE AUTOMATIC CHAT FOCUS WORKING	*****************	   
/*	
		$(document).bind('touchstart touchmove touchend taphold tap',function(event, ui){
			//showWarning(event.target.nodeName);
			if(event.target.nodeName=="INPUT"){
				return event;
			}
			if(event.target.nodeName=="IMG"){
				event.preventDefault();		//prevent the toldhold context menu
				return event;
			}
			
			//event.stopImmediatePropagation();
//		  	event.stopPropagation();
//			event.preventDefault();
		  	//showWarning('event '+event.type);
		  	return event;
		});
*/

/* 		doesn't stop the zoom, using dblclick
	    window.addEventListener("doubleTap", function(event){
	    	alert("double tap");
	    	event.preventDefault();
	    },false);
*/
	    
		//Disable the taphold context menu on images
	/*
		$("img").bind('touchstart touchmove touchend touchcancel',function(){
		  	event.stopPropagation();
			event.preventDefault();
		});
	*/	
	    
	}catch(ex){
		showWarning("ERROR SETTING FULL SCREEN MODE "+ex);
	}
}

function getWindowDimension(){
    var r = {width:0, height:0};    
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE 
        r.width = window.innerWidth;
        r.height = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode' 
        r.width = document.documentElement.clientWidth;
        r.height = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible 
        r.width = document.body.clientWidth;
        r.height = document.body.clientHeight;
    }
    return r;
}


function showWarning(textValue, timeToDisplayMsg, tag){
	warn(textValue);
	if(displayErrorMessage){
		if(timeToDisplayMsg==null){
			timeToDisplayMsg = 3000;
		}
		var d = $('<div class="warningPanel roundRect">'+textValue+'</div>');
		d.addClass(tag);
		$("body").prepend(d);		
		d.show();
		setTimeout(function(){
			d.remove();
		}, timeToDisplayMsg);
		_gaq.push(['_trackEvent', 'GUI', 'Warning', textValue]);
	}
}

function Rectangle(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;	
	this.intersects = function(area){
		if(area.y>=this.y && area.y<=this.y+this.height ||
				area.y+area.height>=this.y && area.y+area.height<=this.y+this.height){
			return true;
		}
		return false;
	};
}

/**
 * Opens a page in an iFrame within the current page
 */
function openMiniBrowser(url, onCloseCallback){
	var innerBrowserDiv = $("<iframe class='miniBrowser' src='"+url+"' />");
	$("body").append(innerBrowserDiv);	
	if(onCloseCallback!=null){
		onCloseCallback();
	}
}


/**
 * this is how java check Rectangle intersection 
 * @return
 */
function rectangleIntersects(x1,y1,w1,h1,
		x2,y2,w2,h2) {
	var tw = w1;
	var th = h1;
	var rw = w2;
	var rh = h2;

	var tx = x1;
	var ty = y1;
	var rx = x2;
	var ry = y2;
	rw += rx;
	rh += ry;
	tw += tx;
	th += ty;
	//      overflow || intersect
	return ((rw < rx || rw > tx) &&
		(rh < ry || rh > ty) &&
		(tw < tx || tw > rx) &&
		(th < ty || th > ry));
}


function formatAccount(val){
	val = val / 100;      //by default balances are stored in cents, but converted to dollars for display
	
	var f = function(val, divisor, symbol){
		if(val/divisor == parseInt(val/divisor)){
			return parseInt(val/divisor)+symbol;
		}
		return (val/divisor).toFixed(1)+symbol;		
	};
	
	try{
		if(val<100){
			return ""+val.toFixed(2);
		}else if(val<10000){
			return ""+val;
		}else if(val<1000000){
			return f(val, 1000, "K");
		}else if(val<1000000000){
			return f(val, 1000000, "MM");
		}else if(val<1000000000000){
			return f(val, 1000000000, "B");
		}else{
			return f(val, 1000000000000, "T");		
		}
	}catch(ex){
		error("problem in formatAccount with " + val + " " + ex);
		return "SUPER RICH!";
	}
	
}


function getUsergameprop(key){
	if(usergamedata.usergameprops!=null){
		return usergamedata.usergameprops[key];
	}else{
		return null;
	}
}

function setUsergameprop(key, val){
	lobbyService.setUsergameProp(key, val);
	usergamedata.usergameprops[key] = val+"";
}

var days = 24*60*60;
var hours = 60*60;//mins * seconds

function formatTime(value){
	if(value<0){
		return "";
	}
	
	var s="";
	var val = value;
	var daysValues = parseInt(val/days);
	if(daysValues>0){
		s = daysValues+"d ";
		val = val - days*daysValues;
	}
	
	var hoursValue = parseInt(val/hours);
	if(hoursValue>0){
		s+= hoursValue+":"
		val = val - hours*hoursValue;
	}

	var minutesValue = parseInt(val/60);
	val = val - minutesValue*60;
	
	s+= (minutesValue>=10?minutesValue:"0"+minutesValue)+":"+(val>=10?val:"0"+val);
	return s;
}
function formatTime2(value){
	if(value<0){
		return "";
	}
	var s="";
	var val = value;
	
	var daysValues = parseInt(val/days);
	if(daysValues>0){
		s = daysValues+" days ";
		val = val - days*daysValues;
	}
	

	var hoursValue = parseInt(val/hours);
	if(hoursValue>0){
		if(hoursValue==1){
			s+= hoursValue+" hour ";			
		}else{
			s+= hoursValue+" hours ";
		}
		val = val - hours*hoursValue;
	}

	var minutesValue = parseInt(val/60);
	val = val - minutesValue*60;
	if(minutesValue  > 0){
		s+= minutesValue +" minutes";
	}
	return s;
}
function getMapSize(obj){
	var c=0;
	for(i in obj){
		c++;
	}
	return c;
}



function formatMoney(n, c, d, t){
	var c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
	 

function animateFieldValue(div, currentValue, value, formatter, callback){
	try{
		if(!formatter) formatter = new Intl.NumberFormat();
	}catch(ex){
		//Not support on mobile Safari so we add a crude work around
		formatter = {
				format : function(b){
					return b.toFixed(2);
				}	
		};
	}
	//var currentValue = parseInt(div.attr("data-val")); 
	animateBalance(div, currentValue, value-currentValue, formatter, callback);
}

/**
 * divInfo is a string like ".divClass" or "#divID"
 */
function animateBalance(divInfo, currentValue, delta, formatter, callback, currencySymbol){
	if(typeof divInfo == "string"){ divInfo = $(divInfo); }
	if(!currencySymbol) currencySymbol="";
	if(delta==0){
		if(formatter){
			divInfo.html(formatter.format(currentValue));
		}else{
			divInfo.html(currentValue);			
		}
		//divInfo.attr("data-val", currentValue);
	}else{
		adjustFieldVal(divInfo,currentValue, delta, formatter, 20, callback);
	}
}

function adjustFieldVal(divInfo, baseValue, delta, formatter, remaingSteps, callback, currencySymbol){
	if(!currencySymbol) currencySymbol="";
	if(typeof divInfo == "string"){ divInfo = $(divInfo); }

	if(delta > 0){
		var step = getBalanceStepAniation(delta, remaingSteps);
		var delay = 30;

		if(formatter){
			divInfo.html(formatter.format(baseValue+step));
		}else{
			divInfo.html(baseValue+step);			
		}
		//divInfo.attr("data-val", baseValue+step);

		setTimeout(function(){
			adjustFieldVal(divInfo, baseValue+step, delta-step, formatter, (remaingSteps-1), callback);
		} , delay );
	}else{
		if(callback!=null){
			callback();
		}
	}
}
 

function getBalanceStepAniation(value, remaingSteps){
	if(remaingSteps==0){
		return value;
	}else{
		//return Math.floor((value*100)/remaingSteps)/100;
		return value/remaingSteps;		
	}
}
