/*
 * Use this to test all of the API's to make sure they at least don't throw errors, even
 * if they're not implemented.
 *
 * TODO: Use a real testing framework like Jasmine or Mocha.
 */

if(typeof(chrome) == "undefined") {
	console.error("Stubs didn't load yet.");
} else {
	
	chrome.app.runtime.onLaunched.addListener(function() {
	    console.info("onlaunched fires successfully.");
	    
    });


	chrome.alarms.create("test", {});

	chrome.app.window.create("popup.html", {
		width: 500,
		height: 500,
		frame: 'true',
	}, function(appWindow) {
		console.info("popup window opened");
		console.log(appWindow);
	});

    var storage = {};
	storage.inbox = ["test","one","two"];
	chrome.storage.local.set(storage);

	setTimeout(function() {
        chrome.storage.local.get(null, function(items) {
		    i = items;
		    console.log(i);
		});
	}, 2000);


	var notification = webkitNotifications.createNotification(
     	'common/nw-desktop-notifications/desktop-notify.png',  // icon url - can be relative
		'Node Webkit Notification',  // notification title
		'This is a sample notification'  // notification body text
	);
    notification.ondisplay = 
	    function() { 
	        console.info('notifications.ondisplay :: remove after 5 seconds...'); 
/*	        setTimeout( (function(_this) { 
	            return function() { 
	                _this.cancel(); 
	            } 
	        })(this), 5000); */
	    };
    notification.show();
}


function testStorage() {

s = {"id":"123","name":"James","tea":"green"};
chrome.storage.local.set(s);   // store everything
chrome.storage.local.get(null, function(pp) { p=pp;});  // get everything

p=null;   // clear what we pulled
chrome.storage.local.get("id", function(pp) { p=pp;});   // get only id
chrome.storage.local.set(p);   // store only id without overwriting... overwrites on nw...

chrome.storage.local.get("id", function(pp) { p=pp;});   // id still pulls

chrome.storage.local.get(null, function(pp) { p=pp;});   // get everything -- test fails on nw only shows id

}


// the chrome.app.runtime.onLoaded event isn't fully implemented.
window.onload = function() {

	chrome.contextMenus.create(
        {
            "type":"normal",
            "title": "Developer Tools",
            "contexts":["all"],
            "id":"devtools"
        }
	);

	chrome.contextMenus.onClicked.addListener(function(info, tab) { 
        console.info("info = " + info);
        console.info("tab = " + tab); 
          
        switch(info.menuItemId) {

            case 'devtools':
                require('nw.gui').Window.get().showDevTools();

                break;

            case 'background-devtools':
                window.opener.require('nw.gui').Window.get().showDevTools();                  
                break;
        }

    });

	chrome.idle.setDetectionInterval(10);
	chrome.idle.onStateChanged.addListener(function(newState) {
        console.info("main :: onStateChanged :: check autoAway Status...");
        console.debug("main :: onStateChanged :: idle state is " + newState);
    });

};
