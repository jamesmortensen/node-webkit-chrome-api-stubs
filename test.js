/*
 * Use this to test all of the API's to make sure they at least don't throw errors, even
 * if they're not implemented.
 *
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
		  '',  // icon url - can be relative
		  'Title',  // notification title
		  'Description: '  // notification body text
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

}
