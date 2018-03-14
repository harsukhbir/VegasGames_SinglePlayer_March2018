/* Depends on jQuery */

/* The logging levels : 1 - error, 2 - warn, 3 - info, 4 - debug, 5 - trace */
var logLevel = 4;
var tapEventName = "click";
var originalHref;
function saveOriginalHref(){
	originalHref = window.location.href;
}

function getUrlParameter(name, url) {
	if (url == null) {
		if(originalHref!=null){
			url = originalHref;
		}else{
			url = window.location.href;
		}
	}
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	if (results == null)
		return "";
	else
		return results[1];
}

function initialiseLogging() {
	/*	jQuery.fn.log = function(msg) {
		try {
			if (console != null) {
				console.log(msg, this);
			}
		} catch (ex) {}
		return this;
	}; */

	//Instrument the default log function to print out the stacktrace also
	/*		
			new printStackTrace.implementation().instrumentFunction(this, 'log', function(stack){
				try{
					if(stack.length>0){					
						if(stack[0].indexOf("error@")==0 || stack[0].indexOf("warn@")==0 || stack[0].indexOf("info@")==0 ||stack[0].indexOf("debug@")==0 ||  stack[0].indexOf("trace@")==0){
							_log(stack[1]);
						}else{
							_log(stack[0]);
						}
					}
					//_log(stack.join('\n'));
				}catch(ex){
						
				}
			});
	*/	
	
	if ($("#logging").length == 0) {
		/* Create logging console */
		var logDiv = $("<div id='logging' class='dontAutoScroll' style='font-size:11px;display:none; position: absolute; top:0;bottom:0;left:0px;width:100%;background:black;color:green;overflow:scroll;z-index:9999;'><div id='logContent'></div></div>");
		var postToServerButton = $("<div class='postToServer' style='font-size:1.5em; text-align:center;color:white;height:2em;background:#666;border:white solid 0.1em'>POST TO SERVER</div>");
		logDiv.prepend(postToServerButton);
		$(postToServerButton).click( postLogToServer);
		$("body").prepend(logDiv);

		if (getUrlParameter("debug") != "") {
			$("#logging").show();
			try {
				logLevel = parseInt(getUrlParameter("debug"));
			} catch (e) {

			}
			$(".showLog").show();
			$(".showLog").click( function() {
				$("#logging").show();
			});
		}
		$(window).keypress(function(tEvt) {
			/* If Ctrl + ] show debug panel*/
			if (tEvt != null && tEvt.which == 93 && tEvt.ctrlKey) {
				$("#logging").toggle();
			} else if (window.event != null && window.event.keyCode == 29 && window.event.ctrlKey == true) {
				$("#logging").toggle();
			} else {

			}
		});
		$("#logging").click( function() {
			$("#logging").hide();
		});
	}
}

function log(str) {
	_log(str);
}

function err(obj){
	try {
		/* $("").log(str);			calls the jQuery logging */
		if (console != null) {
			console.error(obj);
		}

	} catch (ex) {}
		
	var str="<div style='color:red'>";
	if(obj.stack){
		str+="EXCEPTION <br/>";
		var trace = printStackTrace({e : obj});
		for(t in trace){
			str += trace[t] +"<br/>";
			//err(trace[t]);
		}		
	}else{
		str = obj;
	}		
	str+="</div>";
	
	if ($("#logContent").html() != null && $("#logContent").html().length > 20000) {
		$("#logContent").html("");
	}
	$("#logContent").append(str + "<br/>");	
}

function getLogDate(){
	var date = new Date();
    return date.getUTCHours()+":"+date.getUTCMinutes()+":"+date.getUTCSeconds()+"."+date.getUTCMilliseconds();
}

function _log(str) {
	if (logLevel > 0) {
		str = getLogDate() +" "+ str;
		try {
			/* $("").log(str);			calls the jQuery logging */
			if (console != null) {
				console.log(str, this);
			}

		} catch (ex) {}
		/* Our custom logging */
		if ($("#logContent").html() != null && $("#logContent").html().length > 40000) {
			$("#logContent").html($("#logContent").html().substring(20000)); 
		}
		$("#logContent").append(str + "<br/>");
	}
}

function error(obj) {
	if (logLevel >= 1) {
		//log(printStackTrace());
		err(obj);				
	}
}


function warn(str) {
	if (logLevel >= 2) {
		log("WARN:" + str);
	}
}

function info(str) {
	if (logLevel >= 3) {
		log(str);
	}
}

function trace(str) {
	if (logLevel >= 5) {
		log(str);
	}
}

function debug(str) {
	if (logLevel >= 4) {
		log(str);
	}
}

function logMessage(message) {
	trace(message);
}

function logMethodCall(method) {
	trace("IN:" + method);
};

function logMethodOut(method) {
	trace("OUT:" + method);
};

function postLogToServer() {
	var l = $("#logContent").html();
	var regex = /<br\s*[\/]?>/gi;
	$.post(ctx + "/html/utils/log.jsp", { "log" : l.replace(regex, "\n") }, function() {
		log("Log Posted to server");
	});
}

/*
 * Replace the normal jQuery getScript function with one that supports debugging
 * and which references the script files as external resources rather than
 * inline.
 */
function dynamicallyLoadJSFile(url, callback) {
	debug("dynamicallyLoadJSFile " + url);

	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	/* Attach handlers for all browsers */
	script.onload = script.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			if (callback) {
				callback();
			}
			/* Handle memory leak in IE */
			script.onload = script.onreadystatechange = null;
		} else {
			debug("this.readyState=" + this.readyState);
		}
	};
	script.src = url;
	/* Handle Script loading */
	var done = false;
	head.appendChild(script);
	/* We handle everything using the script element injection */
	return undefined;
};

/**
 * Load in an array of Javascript files
 */
function dynamicallyLoadJSFiles(urls, callback) {
	var loaded = 0;
	for (i in urls) {
		var url = urls[i];
		if (url.indexOf("order!") >= 0) {
			url = url.substring(6);
		}
		dynamicallyLoadJSFile(url, function() {
			loaded++;
			if (loaded == urls.length) {
				callback();
			}
		});
	}
}


